import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  RefreshControl,
  UIManager,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { scale } from '../../helpers/scaler';
import { useTabBarSpace } from '../../components/navigation/CustomTabBar';
import SettingIcon from '../../../assets/icons/SettingIcon';
import CameraIcon from '../../../assets/icons/CameraIcon';
import GithubIcon from '../../../assets/icons/GithubIcon';
import TwitterIcon from '../../../assets/icons/TwitterIcon';
import InstagramIcon from '../../../assets/icons/InstagramIcon';
import WebsiteIcon from '../../../assets/icons/WebsiteIcon';
import { Lucide } from '@react-native-vector-icons/lucide';
import { colors } from '../../styles/colors';
import { ME_AVATAR } from '../../helpers/avatars';
import { PROFILE, PROJECTS, RECENT_POSTS } from '../../../assets/staticData/staticData';
import { supabase, getUserId } from '../../lib/supabase';



// ─── Live data: types, mappers, fallbacks ─────────────────────────────────────
type Project = (typeof PROJECTS)[number];
type ActivityPost = (typeof RECENT_POSTS)[number];

type LiveProfile = {
  name: string;
  username: string;
  bio: string;
  location: string | null;
  avatarUrl: string | null;
  joined: string | null;
  currentStreak: number;
  longestStreak: number;
  posts: number;
  followers: number;
  following: number;
};

// Static mock is the render-immediately default; live data replaces it in place.
const FALLBACK_PROFILE: LiveProfile = {
  name: PROFILE.name,
  username: PROFILE.username,
  bio: PROFILE.bio,
  location: PROFILE.location,
  avatarUrl: null,
  joined: null,
  currentStreak: PROFILE.currentStreak,
  longestStreak: PROFILE.longestStreak,
  posts: PROFILE.posts,
  followers: PROFILE.followers,
  following: PROFILE.following,
};

const relativeWhen = (iso: string): string => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 35) return `${Math.floor(days / 7)}w ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const joinedLabel = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

const PROJECT_PALETTE = [colors.Accent.blue, colors.Accent.violet, colors.Accent.green];

const mapDbProject = (row: any, i: number): Project => ({
  id: String(row.id),
  name: row.name ?? 'Untitled',
  emoji: row.emoji ?? '🚀',
  accent: PROJECT_PALETTE[i % PROJECT_PALETTE.length],
  pinned: !!row.pinned,
  description: row.description ?? '',
  stage: row.stage ?? 'Idea',
  contributors: row.contributors ?? 1,
  stack: Array.isArray(row.stack) ? row.stack : Array.isArray(row.tags) ? row.tags : [],
});

const mapDbActivity = (row: any): ActivityPost => ({
  id: String(row.id),
  when: row.created_at ? relativeWhen(row.created_at) : '',
  project: row.projects?.name ?? 'Foundora',
  text: row.content ?? '',
  likes: row.likes ?? 0,
  comments: row.comments ?? 0,
  hasImage: !!row.has_image,
});


// ─── Cover photo (LinkedIn-style banner) ──────────────────────────────────────
const CoverPhoto = ({
  coverUri,
  onPick,
}: {
  coverUri: string | null;
  onPick: () => void;
}) => {
  if (!coverUri) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPick}
        style={{
          height: scale(76),
          marginHorizontal: scale(16),
          marginTop: scale(4),
          borderRadius: scale(14),
          flexDirection: 'row',
          backgroundColor: colors.Dark.surface,
          borderWidth: 1,
          borderColor: colors.Dark.border,
          borderStyle: 'dashed',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: scale(30),
            height: scale(30),
            borderRadius: scale(9),
            backgroundColor: colors.Accent.blue,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: scale(10),
          }}
        >
          <CameraIcon
            width={scale(16)}
            height={scale(16)}
            color={colors.Others.white}
          />
        </View>
        <Text style={{ fontSize: scale(13), fontWeight: '800', color: colors.Others.white }}>
          Add cover photo
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <View
      style={{
        height: scale(88),
        marginHorizontal: scale(16),
        marginTop: scale(4),
        borderRadius: scale(14),
        backgroundColor: colors.Dark.surface,
        overflow: 'hidden',
      }}
    >
      <Image
        source={{ uri: coverUri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPick}
        style={{
          position: 'absolute',
          top: scale(10),
          right: scale(10),
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.Dark.scrimMedium,
          borderRadius: scale(20),
          paddingVertical: scale(6),
          paddingHorizontal: scale(10),
        }}
      >
        <CameraIcon
          width={scale(13)}
          height={scale(13)}
          color={colors.Others.white}
        />
        <Text style={{ fontSize: scale(11), fontWeight: '700', color: colors.Others.white, marginLeft: scale(4) }}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Reusable: Section header ─────────────────────────────────────────────────
const SectionHeader = ({ title, action }: { title: string; action?: string }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(12),
      marginTop: scale(4),
    }}
  >
    <Text
      style={{
        flex: 1,
        fontSize: scale(11),
        fontWeight: '700',
        color: colors.Dark.textTrace,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
      }}
    >
      {title}
    </Text>
    {action && (
      <TouchableOpacity activeOpacity={0.7}>
        <Text style={{ fontSize: scale(11), fontWeight: '700', color: colors.Accent.blue }}>
          {action}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Reusable: Stat cell ──────────────────────────────────────────────────────
const StatCell = ({
  value,
  label,
  highlight,
}: {
  value: string | number;
  label: string;
  highlight?: boolean;
}) => (
  <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, alignItems: 'center' }}>
    <Text
      style={{
        fontSize: scale(18),
        fontWeight: '800',
        color: highlight ? colors.Accent.streak : colors.Others.white,
        letterSpacing: -0.5,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontSize: scale(10),
        color: colors.Dark.textTrace,
        marginTop: scale(3),
        fontWeight: '600',
        letterSpacing: 0.4,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── Reusable: Pill tab bar ───────────────────────────────────────────────────
const Tabs = <T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string; }[];
  active: T;
  onChange: (id: T) => void;
}) => (
  <View
    style={{
      flexDirection: 'row',
      backgroundColor: colors.Dark.surface,
      borderRadius: scale(14),
      padding: scale(4),
      borderWidth: 1,
      borderColor: colors.Dark.border,
      marginBottom: scale(16),
    }}
  >
    {tabs.map(t => {
      const isActive = active === t.id;
      return (
        <TouchableOpacity
          key={t.id}
          activeOpacity={0.85}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            onChange(t.id);
          }}
          style={{
            flex: 1,
            paddingVertical: scale(9),
            borderRadius: scale(10),
            backgroundColor: isActive ? colors.Accent.blue : colors.Others.transparent,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: scale(12),
              fontWeight: '700',
              color: isActive ? colors.Others.white : colors.Dark.textDim,
              letterSpacing: 0.2,
            }}
          >
            {t.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─── Streak card with heatmap ─────────────────────────────────────────────────
const StreakCard = ({
  currentStreak,
  longestStreak,
}: {
  currentStreak: number;
  longestStreak: number;
}) => {
  const flame = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flame, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(flame, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, [flame]);

  const WEEKS = 52;

  // 52 weeks × 7 days, deterministic intensity 0..3
  const cells = useMemo(() => {
    const out: number[][] = [];
    let s = 9;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let w = 0; w < WEEKS; w++) {
      const col: number[] = [];
      for (let d = 0; d < 7; d++) {
        const r = rand();
        // last week is mostly active to reflect current streak
        if (w >= WEEKS - 2) col.push(r > 0.15 ? Math.ceil(r * 3) : 0);
        else col.push(r > 0.55 ? Math.ceil((r - 0.55) * 7) : 0);
      }
      out.push(col);
    }
    return out;
  }, []);

  // Month label per week-column. Shows the month name only where it changes,
  // so labels visually align with the start of each month — like GitHub.
  const monthLabels = useMemo(() => {
    const today = new Date();
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels: string[] = [];
    let prev = -1;
    for (let w = 0; w < WEEKS; w++) {
      const weeksBack = WEEKS - 1 - w;
      const d = new Date(today);
      d.setDate(d.getDate() - weeksBack * 7);
      const m = d.getMonth();
      labels.push(m === prev ? '' : MONTHS[m]);
      prev = m;
    }
    return labels;
  }, []);

  const cellColor = (v: number) => {
    if (v === 0) return colors.Dark.surfaceHover;
    if (v === 1) return colors.Accent.bluePressed;
    if (v === 2) return colors.Accent.blueActive;
    return colors.Accent.blue;
  };

  return (
    <View
      style={{
        backgroundColor: colors.Dark.surface,
        borderRadius: scale(18),
        padding: scale(16),
        borderWidth: 1,
        borderColor: colors.Dark.border,
        marginBottom: scale(20),
      }}
    >
      {/* Streak top row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scale(14) }}>
        <Animated.View
          style={{
            width: scale(48),
            height: scale(48),
            borderRadius: scale(14),
            backgroundColor: colors.Accent.streakGlowStrong,
            borderWidth: 1,
            borderColor: colors.Accent.streakBorder,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: scale(12),
            transform: [{ scale: flame }],
          }}
        >
          <Lucide name="flame" size={scale(24)} color={colors.Accent.streak} />
        </Animated.View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text
              style={{
                fontSize: scale(28),
                fontWeight: '900',
                color: colors.Accent.streak,
                letterSpacing: -1,
              }}
            >
              {currentStreak}
            </Text>
            <Text
              style={{
                fontSize: scale(13),
                fontWeight: '700',
                color: colors.Others.white,
                marginLeft: scale(6),
              }}
            >
              day streak
            </Text>
          </View>
          <Text style={{ fontSize: scale(11), color: colors.Dark.textDim, marginTop: scale(2) }}>
            Longest: {longestStreak} days
          </Text>
        </View>
      </View>

      {/* Heatmap — GitHub-style, horizontally scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: 999999, y: 0 }}
        contentContainerStyle={{ paddingRight: scale(4) }}
      >
        <View>
          {/* Month label row */}
          <View
            style={{
              flexDirection: 'row',
              marginBottom: scale(4),
              height: scale(14),
            }}
          >
            {monthLabels.map((label, w) => (
              <View
                key={w}
                style={{
                  width: scale(13),
                  marginRight: scale(3),
                  overflow: 'visible',
                }}
              >
                {label ? (
                  <Text
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: scale(30),
                      fontSize: scale(10),
                      fontWeight: '700',
                      color: colors.Dark.textTrace,
                      letterSpacing: 0.3,
                    }}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
          {/* Grid */}
          <View style={{ flexDirection: 'row' }}>
            {cells.map((week, w) => (
              <View key={w} style={{ marginRight: scale(3) }}>
                {week.map((v, d) => (
                  <View
                    key={d}
                    style={{
                      width: scale(13),
                      height: scale(13),
                      borderRadius: scale(3),
                      backgroundColor: cellColor(v),
                      marginBottom: scale(3),
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Legend */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: scale(10),
          justifyContent: 'flex-end',
        }}
      >
        <Text style={{ fontSize: scale(10), color: colors.Dark.textTrace, marginRight: scale(6) }}>
          Less
        </Text>
        {[0, 1, 2, 3].map(v => (
          <View
            key={v}
            style={{
              width: scale(11),
              height: scale(11),
              borderRadius: scale(3),
              backgroundColor: cellColor(v),
              marginRight: scale(3),
            }}
          />
        ))}
        <Text style={{ fontSize: scale(10), color: colors.Dark.textTrace, marginLeft: scale(3) }}>
          More
        </Text>
      </View>
    </View>
  );
};

// ─── Project card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project }: { project: Project }) => (
  <View
    style={{
      backgroundColor: colors.Dark.surface,
      borderRadius: scale(18),
      borderWidth: 1,
      borderColor: project.pinned ? `${project.accent}40` : colors.Dark.border,
      marginBottom: scale(12),
      overflow: 'hidden',
    }}
  >
    {project.pinned && (
      <View style={{ height: scale(2.5), backgroundColor: project.accent, opacity: 0.8 }} />
    )}
    <View style={{ padding: scale(14) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scale(10) }}>
        <View
          style={{
            width: scale(44),
            height: scale(44),
            borderRadius: scale(12),
            backgroundColor: `${project.accent}20`,
            borderWidth: 1,
            borderColor: `${project.accent}40`,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: scale(12),
          }}
        >
          <Text style={{ fontSize: scale(20) }}>{project.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}>
            <Text style={{ fontSize: scale(15), fontWeight: '800', color: colors.Others.white, letterSpacing: -0.3 }}>
              {project.name}
            </Text>
            {project.pinned && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: `${project.accent}25`,
                  paddingVertical: scale(2),
                  paddingHorizontal: scale(7),
                  borderRadius: scale(8),
                }}
              >
                <Text style={{ fontSize: scale(8) }}>📌</Text>
                <Text
                  style={{
                    fontSize: scale(9),
                    color: project.accent,
                    fontWeight: '800',
                    letterSpacing: 0.5,
                    marginLeft: scale(3),
                  }}
                >
                  PINNED
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(2) }}>
            <View
              style={{
                width: scale(6),
                height: scale(6),
                borderRadius: scale(3),
                backgroundColor: project.accent,
                marginRight: scale(5),
              }}
            />
            <Text style={{ fontSize: scale(11), color: project.accent, fontWeight: '700' }}>
              {project.stage}
            </Text>
            <Text style={{ fontSize: scale(11), color: colors.Dark.textTrace, marginHorizontal: scale(5) }}>·</Text>
            <Text style={{ fontSize: scale(11), color: colors.Dark.textDim, fontWeight: '500' }}>
              {project.contributors} {project.contributors === 1 ? 'builder' : 'builders'}
            </Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={{ fontSize: scale(18), color: colors.Dark.textTrace }}>›</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: scale(13),
          color: colors.Dark.textDim,
          lineHeight: scale(19),
          marginBottom: scale(10),
        }}
      >
        {project.description}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {project.stack.map(s => (
          <View
            key={s}
            style={{
              backgroundColor: `${project.accent}14`,
              borderRadius: scale(20),
              paddingVertical: scale(4),
              paddingHorizontal: scale(10),
              marginRight: scale(6),
              marginBottom: scale(4),
              borderWidth: 1,
              borderColor: `${project.accent}30`,
            }}
          >
            <Text style={{ fontSize: scale(10), color: project.accent, fontWeight: '700' }}>
              #{s}
            </Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

// ─── Activity post row ────────────────────────────────────────────────────────
const PROJECT_ACCENTS: Record<string, string> = {
  Foundora: colors.Accent.blue,
  Inkwell: colors.Accent.violet,
  Pulse: colors.Accent.green,
};

const ActivityRow = ({
  post,
  isLast,
}: {
  post: ActivityPost;
  isLast?: boolean;
}) => {
  const accent = PROJECT_ACCENTS[post.project] ?? colors.Accent.blue;
  return (
    <View style={{ flexDirection: 'row', marginBottom: scale(14) }}>
      {/* Spine */}
      <View style={{ width: scale(28), alignItems: 'center' }}>
        <View
          style={{
            width: scale(14),
            height: scale(14),
            borderRadius: scale(7),
            backgroundColor: colors.Dark.surface,
            borderWidth: 2,
            borderColor: accent,
            marginTop: scale(10),
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: accent,
            shadowOpacity: 0.5,
            shadowRadius: 6,
          }}
        >
          <View
            style={{
              width: scale(6),
              height: scale(6),
              borderRadius: scale(3),
              backgroundColor: accent,
            }}
          />
        </View>
        {!isLast && (
          <View
            style={{
              flex: 1,
              width: 1.5,
              backgroundColor: colors.Dark.surfaceRaised,
              marginTop: scale(4),
            }}
          />
        )}
      </View>

      {/* Card */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={{
          flex: 1,
          backgroundColor: colors.Dark.surface,
          borderRadius: scale(16),
          borderWidth: 1,
          borderColor: colors.Dark.border,
          overflow: 'hidden',
        }}
      >
        {/* Accent stripe */}
        <View style={{ height: scale(2), backgroundColor: accent, opacity: 0.7 }} />

        {/* Header: project chip + time */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(12),
            paddingTop: scale(12),
            paddingBottom: scale(8),
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: `${accent}18`,
              borderRadius: scale(8),
              paddingVertical: scale(3),
              paddingHorizontal: scale(8),
              borderWidth: 1,
              borderColor: `${accent}30`,
            }}
          >
            <View
              style={{
                width: scale(6),
                height: scale(6),
                borderRadius: scale(3),
                backgroundColor: accent,
                marginRight: scale(6),
              }}
            />
            <Text
              style={{
                fontSize: scale(10),
                fontWeight: '800',
                color: accent,
                letterSpacing: 0.4,
              }}
            >
              {post.project}
            </Text>
          </View>
          <Text
            style={{
              fontSize: scale(11),
              fontWeight: '700',
              color: colors.Dark.textDim,
              marginLeft: scale(10),
            }}
          >
            {post.when}
          </Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Lucide name="more-horizontal" size={scale(16)} color={colors.Dark.textTrace} />
          </TouchableOpacity>
        </View>

        {/* Body text */}
        <Text
          style={{
            fontSize: scale(13),
            color: colors.Dark.textSecondary,
            lineHeight: scale(20),
            paddingHorizontal: scale(12),
            marginBottom: post.hasImage ? scale(10) : scale(12),
          }}
        >
          {post.text}
        </Text>

        {/* Image preview */}
        {post.hasImage && (
          <View
            style={{
              height: scale(140),
              marginHorizontal: scale(12),
              marginBottom: scale(12),
              backgroundColor: `${accent}12`,
              borderRadius: scale(12),
              borderWidth: 1,
              borderColor: `${accent}25`,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: -scale(20),
                right: -scale(20),
                width: scale(80),
                height: scale(80),
                borderRadius: scale(40),
                backgroundColor: `${accent}10`,
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -scale(30),
                left: -scale(20),
                width: scale(100),
                height: scale(100),
                borderRadius: scale(50),
                backgroundColor: `${accent}08`,
              }}
            />
            <View
              style={{
                width: scale(48),
                height: scale(48),
                borderRadius: scale(14),
                backgroundColor: `${accent}25`,
                borderWidth: 1,
                borderColor: `${accent}40`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lucide name="image" size={scale(22)} color={accent} />
            </View>
            <Text
              style={{
                fontSize: scale(10),
                fontWeight: '800',
                color: accent,
                marginTop: scale(8),
                letterSpacing: 0.6,
                textTransform: 'uppercase',
              }}
            >
              Attached preview
            </Text>
          </View>
        )}

        {/* Action bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(12),
            paddingVertical: scale(10),
            borderTopWidth: 1,
            borderTopColor: colors.Dark.divider,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: scale(18) }}>
            <Lucide name="heart" size={scale(14)} color={colors.Accent.danger} />
            <Text
              style={{
                fontSize: scale(11),
                color: colors.Dark.textDim,
                fontWeight: '700',
                marginLeft: scale(6),
              }}
            >
              {post.likes}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: scale(18) }}>
            <Lucide name="message-circle" size={scale(14)} color={colors.Others.white} />
            <Text
              style={{
                fontSize: scale(11),
                color: colors.Dark.textDim,
                fontWeight: '700',
                marginLeft: scale(6),
              }}
            >
              {post.comments}
            </Text>
          </View>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ marginRight: scale(14) }}
          >
            <Lucide name="share-2" size={scale(14)} color={colors.Dark.textDim} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Lucide name="bookmark" size={scale(14)} color={colors.Dark.textDim} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// ─── Tabs content ─────────────────────────────────────────────────────────────
type TabId = 'projects' | 'activity' | 'about';

const ProjectsTab = ({ projects }: { projects: Project[] }) => {
  const sorted = [...projects].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  return (
    <View>
      <SectionHeader title="Building" action="+ New" />
      {sorted.map(p => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </View>
  );
};

const ActivityTab = ({ posts }: { posts: ActivityPost[] }) => (
  <View>
    <SectionHeader title="Recent updates" action="See all" />
    {posts.map((p, i) => (
      <ActivityRow key={p.id} post={p} isLast={i === posts.length - 1} />
    ))}
  </View>
);

const AboutTab = ({ bio, location }: { bio: string; location: string | null }) => (
  <View>
    <SectionHeader title="Location" />
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.Dark.surface,
        borderRadius: scale(14),
        paddingVertical: scale(12),
        paddingHorizontal: scale(14),
        borderWidth: 1,
        borderColor: colors.Dark.border,
        marginBottom: scale(20),
      }}
    >
      <Text style={{ fontSize: scale(14), marginRight: scale(8) }}>📍</Text>
      <Text style={{ fontSize: scale(13), color: colors.Others.white, fontWeight: '700' }}>
        {location ?? 'Somewhere on Earth'}
      </Text>
    </View>

    <SectionHeader title="Find me elsewhere" />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: scale(20) }}>
      {PROFILE.socials.map(s => {
        const Icon =
          s.id === 'gh'
            ? GithubIcon
            : s.id === 'x'
            ? TwitterIcon
            : s.id === 'ig'
            ? InstagramIcon
            : WebsiteIcon;
        return (
          <TouchableOpacity
            key={s.id}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.Dark.surface,
              borderRadius: scale(20),
              paddingVertical: scale(7),
              paddingHorizontal: scale(11),
              marginRight: scale(8),
              marginBottom: scale(8),
              borderWidth: 1,
              borderColor: colors.Dark.border,
            }}
          >
            <Icon width={scale(13)} height={scale(13)} color={colors.Others.white} />
            <Text
              style={{
                fontSize: scale(11),
                fontWeight: '700',
                color: colors.Others.white,
                marginLeft: scale(6),
              }}
            >
              {s.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    <SectionHeader title="Skills" />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: scale(20) }}>
      {PROFILE.skills.map(s => (
        <View
          key={s}
          style={{
            backgroundColor: colors.Dark.surface,
            borderRadius: scale(20),
            paddingVertical: scale(7),
            paddingHorizontal: scale(13),
            marginRight: scale(8),
            marginBottom: scale(8),
            borderWidth: 1,
            borderColor: colors.Dark.border,
          }}
        >
          <Text style={{ fontSize: scale(12), fontWeight: '700', color: colors.Others.white }}>{s}</Text>
        </View>
      ))}
    </View>

    <SectionHeader title="Looking for" />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: scale(20) }}>
      {PROFILE.lookingFor.map(role => (
        <View
          key={role}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.Accent.greenGlow,
            borderRadius: scale(20),
            paddingVertical: scale(7),
            paddingHorizontal: scale(13),
            marginRight: scale(8),
            marginBottom: scale(8),
            borderWidth: 1,
            borderColor: colors.Accent.greenBorder,
          }}
        >
          <View
            style={{
              width: scale(6),
              height: scale(6),
              borderRadius: scale(3),
              backgroundColor: colors.Accent.green,
              marginRight: scale(7),
            }}
          />
          <Text style={{ fontSize: scale(12), fontWeight: '700', color: colors.Accent.green }}>
            {role}
          </Text>
        </View>
      ))}
    </View>

    <SectionHeader title="Bio" />
    <Text
      style={{
        fontSize: scale(13),
        color: colors.Dark.textMuted,
        lineHeight: scale(20),
        marginBottom: scale(20),
      }}
    >
      {bio}
    </Text>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const tabBarSpace = useTabBarSpace();
  const [tab, setTab] = useState<TabId>('projects');
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Live data — starts as the static mock so the screen renders instantly,
  // then swaps to Supabase data once the session's profile loads.
  const [live, setLive] = useState<LiveProfile>(FALLBACK_PROFILE);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [activity, setActivity] = useState<ActivityPost[]>(RECENT_POSTS);

  const fetchLive = useCallback(async () => {
    try {
      const uid = await getUserId();
      if (!uid) return; // signed out → keep mock data
      const [prof, postCount, followerCount, followingCount, projRows, postRows] =
        await Promise.all([
          supabase.from('profiles').select('*').eq('id', uid).single(),
          supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', uid),
          supabase.from('follows').select('follower_id', { count: 'exact', head: true }).eq('following_id', uid),
          supabase.from('follows').select('follower_id', { count: 'exact', head: true }).eq('follower_id', uid),
          supabase.from('projects').select('*').eq('user_id', uid),
          supabase
            .from('posts')
            .select('*, projects(name)')
            .eq('user_id', uid)
            .order('created_at', { ascending: false })
            .limit(5),
        ]);
      if (prof.data) {
        const p = prof.data;
        setLive({
          name: p.full_name ?? PROFILE.name,
          username: p.username ? `@${p.username}` : PROFILE.username,
          bio: p.bio ?? PROFILE.bio,
          location: p.location,
          avatarUrl: p.avatar_url,
          joined: p.created_at ? joinedLabel(p.created_at) : null,
          currentStreak: p.current_streak ?? 0,
          longestStreak: p.longest_streak ?? 0,
          posts: postCount.count ?? 0,
          followers: followerCount.count ?? 0,
          following: followingCount.count ?? 0,
        });
      }
      if (projRows.data?.length) setProjects(projRows.data.map(mapDbProject));
      if (postRows.data?.length) setActivity(postRows.data.map(mapDbActivity));
    } catch {
      // Network hiccup → whatever is on screen stays.
    }
  }, []);

  // Refetch whenever the tab gains focus so a post published on the Add Post
  // tab shows up here immediately (tab screens stay mounted, so a plain
  // mount-time effect would only ever run once).
  useFocusEffect(
    useCallback(() => {
      fetchLive();
    }, [fetchLive]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLive();
    setRefreshing(false);
  }, [fetchLive]);

  const pickCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      quality: 0.9,
    });
    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (uri) setCoverUri(uri);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.Dark.bg }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarSpace + scale(16) }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.Others.white}
          />
        }
      >
        {/* ── Top bar ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(16),
            paddingTop: scale(10),
            paddingBottom: scale(10),
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: scale(20),
              fontWeight: '900',
              color: colors.Others.white,
              letterSpacing: -0.5,
            }}
          >
            Profile
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Settings')}
            style={{
              width: scale(36),
              height: scale(36),
              borderRadius: scale(18),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.Dark.surface,
              borderWidth: 1,
              borderColor: colors.Dark.border,
            }}
          >
            <SettingIcon width={scale(19)} height={scale(19)} color={colors.Others.white} />
          </TouchableOpacity>
        </View>

        {/* ── Cover photo ── */}
        <CoverPhoto coverUri={coverUri} onPick={pickCover} />

        {/* ── Hero ── */}
        <View style={{ paddingHorizontal: scale(20), paddingTop: scale(12) }}>
          {/* Avatar — overlaps the cover */}
          <View
            style={{
              width: scale(82),
              height: scale(82),
              borderRadius: scale(41),
              backgroundColor: colors.Dark.bg,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -scale(38),
              marginBottom: scale(10),
            }}
          >
            <Image
              source={live.avatarUrl ? { uri: live.avatarUrl } : ME_AVATAR}
              style={{
                width: scale(76),
                height: scale(76),
                borderRadius: scale(38),
                borderWidth: 3,
                borderColor: colors.Accent.blue,
              }}
            />
          </View>

          {/* Name + username + status */}
          <View style={{ marginBottom: scale(14) }}>
            <Text
              style={{
                fontSize: scale(22),
                fontWeight: '900',
                color: colors.Others.white,
                letterSpacing: -0.6,
              }}
            >
              {live.name}
            </Text>
            <Text
              style={{
                fontSize: scale(13),
                color: colors.Accent.blue,
                fontWeight: '700',
                marginTop: scale(2),
              }}
            >
              {live.username}
            </Text>
            {(live.location || live.joined) && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: scale(6),
                }}
              >
                {live.location && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: scale(14),
                    }}
                  >
                    <Lucide name="map-pin" size={scale(11)} color={colors.Dark.textDim} />
                    <Text
                      style={{
                        fontSize: scale(11),
                        color: colors.Dark.textDim,
                        fontWeight: '600',
                        marginLeft: scale(4),
                      }}
                    >
                      {live.location}
                    </Text>
                  </View>
                )}
                {live.joined && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Lucide name="calendar" size={scale(11)} color={colors.Dark.textDim} />
                    <Text
                      style={{
                        fontSize: scale(11),
                        color: colors.Dark.textDim,
                        fontWeight: '600',
                        marginLeft: scale(4),
                      }}
                    >
                      Joined {live.joined}
                    </Text>
                  </View>
                )}
              </View>
            )}
            {PROFILE.openToCollab && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  backgroundColor: colors.Accent.greenGlowStrong,
                  borderRadius: scale(20),
                  paddingVertical: scale(4),
                  paddingHorizontal: scale(9),
                  borderWidth: 1,
                  borderColor: colors.Accent.greenBorderStrong,
                  marginTop: scale(8),
                }}
              >
                <View
                  style={{
                    width: scale(6),
                    height: scale(6),
                    borderRadius: scale(3),
                    backgroundColor: colors.Accent.green,
                    marginRight: scale(6),
                  }}
                />
                <Text
                  style={{
                    fontSize: scale(10),
                    fontWeight: '800',
                    color: colors.Accent.green,
                    letterSpacing: 0.4,
                  }}
                >
                  OPEN TO COLLABORATORS
                </Text>
              </View>
            )}
          </View>

          {/* Tagline */}
          <View
            style={{
              backgroundColor: colors.Dark.surface,
              borderRadius: scale(12),
              padding: scale(12),
              borderWidth: 1,
              borderColor: colors.Dark.border,
              borderLeftWidth: 3,
              borderLeftColor: colors.Accent.blue,
              marginBottom: scale(14),
            }}
          >
            <Text
              style={{
                fontSize: scale(10),
                fontWeight: '800',
                color: colors.Accent.blue,
                letterSpacing: 1,
                marginBottom: scale(4),
              }}
            >
              CURRENTLY BUILDING
            </Text>
            <Text style={{ fontSize: scale(14), color: colors.Others.white, fontWeight: '600', lineHeight: scale(20) }}>
              {PROFILE.tagline}
            </Text>
          </View>

          {/* Stats */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.Dark.surface,
              borderRadius: scale(14),
              paddingVertical: scale(14),
              borderWidth: 1,
              borderColor: colors.Dark.border,
              marginBottom: scale(20),
            }}
          >
            <StatCell value={live.posts} label="Posts" />
            <View style={{ width: 1, backgroundColor: colors.Dark.border }} />
            <StatCell value={live.followers.toLocaleString()} label="Followers" />
            <View style={{ width: 1, backgroundColor: colors.Dark.border }} />
            <StatCell value={live.following} label="Following" />
          </View>

          {/* Streak card */}
          <StreakCard
            currentStreak={live.currentStreak}
            longestStreak={live.longestStreak}
          />
        </View>

        {/* Tabs */}
        <View style={{ paddingHorizontal: scale(20) }}>
          <Tabs
            active={tab}
            onChange={(id) => setTab(id as TabId)}
            tabs={[
              { id: 'projects', label: 'Projects'},
              { id: 'activity', label: 'Timeline' },
              { id: 'about', label: 'About'},
            ]}
          />

          {tab === 'projects' && <ProjectsTab projects={projects} />}
          {tab === 'activity' && <ActivityTab posts={activity} />}
          {tab === 'about' && <AboutTab bio={live.bio} location={live.location} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
