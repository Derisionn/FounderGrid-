import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from '../../helpers/scaler';
import { useTabBarSpace } from '../../components/navigation/CustomTabBar';
import { colors } from '../../styles/colors';
import { avatarFor } from '../../helpers/avatars';
import PushNotificationIcon from '../../../assets/icons/PushNotifcationIcon';
import { Lucide } from '@react-native-vector-icons/lucide';



// ─── Constants ────────────────────────────────────────────────────────────────
const BG = colors.Dark.bg;
const ACCENT = colors.Accent.blue;
const SURFACE = colors.Dark.surface;
const SURFACE_BORDER = colors.Dark.border;
const TEXT_DIM = colors.Dark.textDim;
const TEXT_FAINT = colors.Dark.textTrace;
const STREAK_ORANGE = colors.Accent.streak;

// ─── Types ────────────────────────────────────────────────────────────────────
type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'streak'
  | 'milestone'
  | 'collab'
  | 'announce'
  | 'recap'
  | 'trending'
  | 'project_views';

type Bucket = 'today' | 'yesterday' | 'week' | 'earlier';

interface Notification {
  id: string;
  type: NotificationType;
  bucket: Bucket;
  time: string;
  title: string;
  preview?: string;
  actor?: { initials: string; accent: string; name: string };
  project?: { name: string; emoji: string; accent: string };
  cta?: string;
  unread: boolean;
  priority?: 'high' | 'normal';
}

type Filter = 'all' | 'mentions' | 'social' | 'streak' | 'system';

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  NotificationType,
  { emoji: string; color: string; label: string; group: Filter }
> = {
  like: { emoji: '❤️', color: colors.Accent.danger, label: 'Like', group: 'social' },
  comment: { emoji: '💬', color: ACCENT, label: 'Comment', group: 'social' },
  follow: { emoji: '✨', color: colors.Accent.violet, label: 'Follow', group: 'social' },
  mention: { emoji: '📣', color: colors.Accent.green, label: 'Mention', group: 'mentions' },
  streak: { emoji: '🔥', color: STREAK_ORANGE, label: 'Streak', group: 'streak' },
  milestone: { emoji: '🏆', color: STREAK_ORANGE, label: 'Milestone', group: 'streak' },
  collab: { emoji: '🤝', color: colors.Accent.green, label: 'Collab', group: 'social' },
  announce: { emoji: '📢', color: ACCENT, label: 'Update', group: 'system' },
  recap: { emoji: '📊', color: colors.Accent.violet, label: 'Recap', group: 'system' },
  trending: { emoji: '📈', color: colors.Accent.streak, label: 'Trending', group: 'system' },
  project_views: { emoji: '👀', color: ACCENT, label: 'Views', group: 'system' },
};

// ─── Demo data ────────────────────────────────────────────────────────────────
const RAW_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'streak',
    bucket: 'today',
    time: 'Now',
    title: "Don't lose your 14-day streak",
    preview: 'Post before midnight to keep the chain alive.',
    cta: 'Post now',
    unread: true,
    priority: 'high',
  },
  {
    id: 'n2',
    type: 'like',
    bucket: 'today',
    time: '2m',
    title: 'Riya liked your update',
    preview: '"Shipped the new Add Post screen…"',
    actor: { initials: 'RP', accent: colors.Accent.danger, name: 'Riya P.' },
    project: { name: 'FounderGrid', emoji: '🚀', accent: ACCENT },
    unread: true,
  },
  {
    id: 'n3',
    type: 'comment',
    bucket: 'today',
    time: '18m',
    title: 'Aman commented on your Day 21 progress',
    preview: '"Curious — how did you handle the auth migration?"',
    actor: { initials: 'AK', accent: ACCENT, name: 'Aman K.' },
    cta: 'Reply',
    unread: true,
  },
  {
    id: 'n4',
    type: 'milestone',
    bucket: 'today',
    time: '1h',
    title: 'You unlocked the 30-day builder badge',
    preview: 'Only 3% of builders make it this far. Keep shipping.',
    cta: 'View badge',
    unread: true,
    priority: 'high',
  },
  {
    id: 'n5',
    type: 'project_views',
    bucket: 'today',
    time: '3h',
    title: '42 builders viewed FounderGrid today',
    preview: 'Up 28% from yesterday.',
    project: { name: 'FounderGrid', emoji: '🚀', accent: ACCENT },
    unread: false,
  },
  {
    id: 'n6',
    type: 'follow',
    bucket: 'yesterday',
    time: '1d',
    title: 'Maya started following you',
    preview: 'Building Lumen — AI for indie writers.',
    actor: { initials: 'MS', accent: colors.Accent.violet, name: 'Maya S.' },
    cta: 'Follow back',
    unread: false,
  },
  {
    id: 'n7',
    type: 'follow',
    bucket: 'yesterday',
    time: '1d',
    title: 'Your project gained 5 new followers',
    project: { name: 'FounderGrid', emoji: '🚀', accent: ACCENT },
    unread: false,
  },
  {
    id: 'n8',
    type: 'mention',
    bucket: 'yesterday',
    time: '1d',
    title: 'Devraj mentioned you',
    preview: '"@anmol — your streak is wild, keep it going 🔥"',
    actor: { initials: 'DV', accent: colors.Accent.green, name: 'Devraj' },
    unread: false,
  },
  {
    id: 'n9',
    type: 'trending',
    bucket: 'yesterday',
    time: '1d',
    title: 'Your update is trending today',
    preview: 'Top 12 in #ReactNative · keep the momentum.',
    project: { name: 'FounderGrid', emoji: '🚀', accent: ACCENT },
    unread: false,
    priority: 'high',
  },
  {
    id: 'n10',
    type: 'recap',
    bucket: 'week',
    time: '3d',
    title: 'Your weekly recap is ready',
    preview: 'You shipped 6 of 7 days. +18 followers. +3 collab requests.',
    cta: 'Open recap',
    unread: false,
  },
  {
    id: 'n11',
    type: 'collab',
    bucket: 'week',
    time: '4d',
    title: 'Sara wants to collaborate on FounderGrid',
    preview: '"I\'m a designer — would love to help with onboarding."',
    actor: { initials: 'SR', accent: colors.Accent.green, name: 'Sara R.' },
    cta: 'Reply',
    unread: false,
  },
  {
    id: 'n12',
    type: 'announce',
    bucket: 'earlier',
    time: '2w',
    title: 'New: Mood + Tags on posts',
    preview: 'Tag your stack and share how the day felt. Try it now.',
    unread: false,
  },
];

// ─── Reusable: Bucket header ──────────────────────────────────────────────────
const BucketHeader = ({ label, count }: { label: string; count: number }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scale(20),
      marginBottom: scale(10),
      marginTop: scale(8),
    }}
  >
    <Text
      style={{
        flex: 1,
        fontSize: scale(11),
        fontWeight: '700',
        color: TEXT_FAINT,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Text>
    <View
      style={{
        backgroundColor: SURFACE,
        borderRadius: scale(20),
        paddingVertical: scale(2),
        paddingHorizontal: scale(8),
      }}
    >
      <Text style={{ fontSize: scale(10), color: TEXT_FAINT, fontWeight: '700' }}>
        {count}
      </Text>
    </View>
  </View>
);

// ─── Reusable: Filter pill bar ────────────────────────────────────────────────
const FILTERS: { id: Filter; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'mentions', label: 'Mentions', emoji: '📣' },
  { id: 'social', label: 'Social', emoji: '💬' },
  { id: 'streak', label: 'Streak', emoji: '🔥' },
  { id: 'system', label: 'System', emoji: '📊' },
];

const FilterBar = ({
  active,
  onChange,
  unreadCounts,
}: {
  active: Filter;
  onChange: (f: Filter) => void;
  unreadCounts: Record<Filter, number>;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: scale(20), paddingBottom: scale(8) }}
  >
    {FILTERS.map(f => {
      const isActive = active === f.id;
      const count = unreadCounts[f.id] ?? 0;
      return (
        <TouchableOpacity
          key={f.id}
          activeOpacity={0.85}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            onChange(f.id);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: scale(7),
            paddingHorizontal: scale(13),
            borderRadius: scale(20),
            marginRight: scale(8),
            backgroundColor: isActive ? ACCENT : SURFACE,
            borderWidth: 1,
            borderColor: isActive ? ACCENT : SURFACE_BORDER,
          }}
        >
          <Text style={{ fontSize: scale(12), marginRight: scale(5) }}>{f.emoji}</Text>
          <Text
            style={{
              fontSize: scale(12),
              fontWeight: '700',
              color: isActive ? colors.Others.white : TEXT_DIM,
              letterSpacing: 0.2,
            }}
          >
            {f.label}
          </Text>
          {count > 0 && !isActive && (
            <View
              style={{
                marginLeft: scale(6),
                backgroundColor: ACCENT,
                borderRadius: scale(10),
                minWidth: scale(18),
                height: scale(18),
                paddingHorizontal: scale(5),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: scale(9), fontWeight: '800', color: colors.Others.white }}>
                {count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

// ─── Streak nudge card (high-priority slot) ───────────────────────────────────
const StreakNudgeCard = ({ streak }: { streak: number }) => {
  const flame = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flame, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(flame, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, [flame]);
  return (
    <View
      style={{
        marginHorizontal: scale(20),
        marginBottom: scale(14),
        backgroundColor: colors.Accent.streakGlowSoft,
        borderRadius: scale(16),
        borderWidth: 1,
        borderColor: colors.Accent.streakBorderHi,
        padding: scale(14),
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          width: scale(46),
          height: scale(46),
          borderRadius: scale(14),
          backgroundColor: colors.Accent.streakGlowBright,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: scale(12),
          transform: [{ scale: flame }],
        }}
      >
        <Lucide name="flame" size={scale(22)} color={STREAK_ORANGE} />
      </Animated.View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: scale(14), fontWeight: '800', color: colors.Others.white, letterSpacing: -0.2 }}>
          Don't break the chain
        </Text>
        <Text style={{ fontSize: scale(12), color: colors.Dark.textSubtle, marginTop: scale(2) }}>
          {streak}-day streak · post before midnight.
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.85}
        style={{
          backgroundColor: STREAK_ORANGE,
          borderRadius: scale(12),
          paddingVertical: scale(8),
          paddingHorizontal: scale(12),
          shadowColor: STREAK_ORANGE,
          shadowOpacity: 0.5,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Text style={{ fontSize: scale(12), fontWeight: '800', color: colors.Dark.bg }}>
          Post
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Notification row ─────────────────────────────────────────────────────────
const NotificationAvatar = ({
  notif,
  cfg,
}: {
  notif: Notification;
  cfg: (typeof TYPE_CONFIG)[keyof typeof TYPE_CONFIG];
}) => {
  if (notif.actor) {
    return (
      <Image
        source={avatarFor(notif.actor.initials)}
        style={{
          width: scale(40),
          height: scale(40),
          borderRadius: scale(20),
        }}
      />
    );
  }
  if (notif.project) {
    return (
      <View
        style={{
          width: scale(40),
          height: scale(40),
          borderRadius: scale(12),
          backgroundColor: `${notif.project.accent}25`,
          borderWidth: 1,
          borderColor: `${notif.project.accent}50`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: scale(18) }}>{notif.project.emoji}</Text>
      </View>
    );
  }
  return (
    <View
      style={{
        width: scale(40),
        height: scale(40),
        borderRadius: scale(12),
        backgroundColor: `${cfg.color}20`,
        borderWidth: 1,
        borderColor: `${cfg.color}40`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: scale(18) }}>{cfg.emoji}</Text>
    </View>
  );
};

const NotificationRow = ({
  notif,
  onMarkRead,
  isNew,
}: {
  notif: Notification;
  onMarkRead: (id: string) => void;
  isNew?: boolean;
}) => {
  const cfg = TYPE_CONFIG[notif.type];
  const fade = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const slide = useRef(new Animated.Value(isNew ? scale(8) : 0)).current;
  useEffect(() => {
    if (!isNew) return;
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start();
  }, [isNew, fade, slide]);

  return (
    <Animated.View
      style={{
        opacity: fade,
        transform: [{ translateY: slide }],
        marginHorizontal: scale(20),
        marginBottom: scale(8),
      }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => notif.unread && onMarkRead(notif.id)}
        style={{
          flexDirection: 'row',
          backgroundColor: notif.unread ? colors.Accent.blueGlowSoft : SURFACE,
          borderRadius: scale(14),
          padding: scale(13),
          borderWidth: 1,
          borderColor: notif.unread ? colors.Accent.blueBorder : SURFACE_BORDER,
        }}
      >
        {/* Unread dot */}
        <View
          style={{
            width: scale(6),
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: scale(15),
          }}
        >
          {notif.unread && (
            <View
              style={{
                width: scale(7),
                height: scale(7),
                borderRadius: scale(3.5),
                backgroundColor: ACCENT,
                shadowColor: ACCENT,
                shadowOpacity: 0.6,
                shadowRadius: 4,
              }}
            />
          )}
        </View>

        {/* Avatar */}
        <View style={{ marginLeft: scale(8), marginRight: scale(12) }}>
          <NotificationAvatar notif={notif} cfg={cfg} />
          {/* Type icon overlay */}
          {(notif.actor || notif.project) && (
            <View
              style={{
                position: 'absolute',
                bottom: -scale(2),
                right: -scale(2),
                width: scale(20),
                height: scale(20),
                borderRadius: scale(10),
                backgroundColor: cfg.color,
                borderWidth: 2,
                borderColor: BG,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: scale(9) }}>{cfg.emoji}</Text>
            </View>
          )}
        </View>

        {/* Body */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: scale(2) }}>
            <Text
              style={{
                flex: 1,
                fontSize: scale(13),
                fontWeight: notif.unread ? '800' : '700',
                color: colors.Others.white,
                lineHeight: scale(18),
                letterSpacing: -0.1,
              }}
              numberOfLines={2}
            >
              {notif.title}
            </Text>
            <Text
              style={{
                fontSize: scale(10),
                color: TEXT_FAINT,
                fontWeight: '600',
                marginLeft: scale(8),
                marginTop: scale(2),
              }}
            >
              {notif.time}
            </Text>
          </View>
          {notif.preview && (
            <Text
              style={{
                fontSize: scale(12),
                color: TEXT_DIM,
                lineHeight: scale(17),
                marginTop: scale(2),
              }}
              numberOfLines={2}
            >
              {notif.preview}
            </Text>
          )}
          {(notif.cta || notif.priority === 'high') && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(8) }}>
              {notif.priority === 'high' && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: `${cfg.color}20`,
                    borderRadius: scale(20),
                    paddingVertical: scale(2),
                    paddingHorizontal: scale(7),
                    marginRight: scale(8),
                    borderWidth: 1,
                    borderColor: `${cfg.color}40`,
                  }}
                >
                  <Text
                    style={{
                      fontSize: scale(9),
                      fontWeight: '800',
                      color: cfg.color,
                      letterSpacing: 0.5,
                    }}
                  >
                    PRIORITY
                  </Text>
                </View>
              )}
              {notif.cta && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: ACCENT,
                    borderRadius: scale(10),
                    paddingVertical: scale(6),
                    paddingHorizontal: scale(11),
                  }}
                >
                  <Text style={{ fontSize: scale(11), fontWeight: '800', color: colors.Others.white }}>
                    {notif.cta}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Suggested builders rail ──────────────────────────────────────────────────
const SUGGESTED = [
  { id: 's1', initials: 'NV', name: 'Nikhil V.', tagline: 'Building Specto · AI', accent: colors.Accent.violet },
  { id: 's2', initials: 'PK', name: 'Priya K.', tagline: 'Building Layer · Design', accent: colors.Accent.danger },
  { id: 's3', initials: 'RT', name: 'Rohit T.', tagline: 'Building Tide · SaaS', accent: colors.Accent.green },
];

const SuggestedRail = () => (
  <View style={{ marginBottom: scale(14) }}>
    <View style={{ paddingHorizontal: scale(20), marginBottom: scale(10), flexDirection: 'row', alignItems: 'center' }}>
      <Text
        style={{
          flex: 1,
          fontSize: scale(11),
          fontWeight: '700',
          color: TEXT_FAINT,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        Builders to follow
      </Text>
      <TouchableOpacity activeOpacity={0.7}>
        <Text style={{ fontSize: scale(11), fontWeight: '700', color: ACCENT }}>See all</Text>
      </TouchableOpacity>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: scale(20) }}
    >
      {SUGGESTED.map(s => (
        <View
          key={s.id}
          style={{
            width: scale(150),
            backgroundColor: SURFACE,
            borderRadius: scale(14),
            borderWidth: 1,
            borderColor: SURFACE_BORDER,
            padding: scale(12),
            marginRight: scale(10),
            alignItems: 'center',
          }}
        >
          <Image
            source={avatarFor(s.id)}
            style={{
              width: scale(46),
              height: scale(46),
              borderRadius: scale(23),
              marginBottom: scale(8),
            }}
          />
          <Text style={{ fontSize: scale(12), fontWeight: '800', color: colors.Others.white }} numberOfLines={1}>
            {s.name}
          </Text>
          <Text
            style={{
              fontSize: scale(10),
              color: TEXT_DIM,
              marginTop: scale(2),
              textAlign: 'center',
            }}
            numberOfLines={1}
          >
            {s.tagline}
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              marginTop: scale(10),
              backgroundColor: ACCENT,
              borderRadius: scale(10),
              paddingVertical: scale(6),
              paddingHorizontal: scale(16),
            }}
          >
            <Text style={{ fontSize: scale(11), fontWeight: '800', color: colors.Others.white }}>Follow</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  </View>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ filter }: { filter: Filter }) => {
  const filterLabel = FILTERS.find(f => f.id === filter)?.label.toLowerCase() ?? 'notifications';
  return (
    <View style={{ alignItems: 'center', paddingTop: scale(60), paddingHorizontal: scale(40) }}>
      <View
        style={{
          width: scale(72),
          height: scale(72),
          borderRadius: scale(36),
          backgroundColor: SURFACE,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: scale(14),
          borderWidth: 1,
          borderColor: SURFACE_BORDER,
        }}
      >
        <PushNotificationIcon width={scale(30)} height={scale(32)} color={colors.Dark.textMuted} />
      </View>
      <Text style={{ fontSize: scale(15), fontWeight: '800', color: colors.Others.white, marginBottom: scale(6) }}>
        No {filterLabel} yet
      </Text>
      <Text
        style={{
          fontSize: scale(12),
          color: TEXT_DIM,
          textAlign: 'center',
          lineHeight: scale(18),
        }}
      >
        Keep shipping. The more you build in public, the more the community shows up.
      </Text>
    </View>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const NotificationsScreen = () => {
  const tabBarSpace = useTabBarSpace();
  const [filter, setFilter] = useState<Filter>('all');
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});

  const notifications = useMemo(
    () =>
      RAW_NOTIFICATIONS.map(n => ({
        ...n,
        unread: readMap[n.id] ? false : n.unread,
      })),
    [readMap],
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => TYPE_CONFIG[n.type].group === filter);
  }, [filter, notifications]);

  const groups = useMemo(() => {
    const out: Record<Bucket, Notification[]> = { today: [], yesterday: [], week: [], earlier: [] };
    filtered.forEach(n => out[n.bucket].push(n));
    // Priority sort: high priority first within each bucket
    (Object.keys(out) as Bucket[]).forEach(b => {
      out[b].sort((a, x) => {
        const ap = a.priority === 'high' ? 0 : 1;
        const xp = x.priority === 'high' ? 0 : 1;
        return ap - xp;
      });
    });
    return out;
  }, [filtered]);

  const unreadCounts = useMemo(() => {
    const counts: Record<Filter, number> = {
      all: 0,
      mentions: 0,
      social: 0,
      streak: 0,
      system: 0,
    };
    notifications.forEach(n => {
      if (!n.unread) return;
      counts.all += 1;
      counts[TYPE_CONFIG[n.type].group] += 1;
    });
    return counts;
  }, [notifications]);

  const handleMarkRead = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.create(180, 'easeInEaseOut', 'opacity'));
    setReadMap(prev => ({ ...prev, [id]: true }));
  };

  const handleMarkAllRead = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next: Record<string, boolean> = {};
    notifications.forEach(n => {
      next[n.id] = true;
    });
    setReadMap(next);
  };

  const totalUnread = unreadCounts.all;
  const isEmpty = filtered.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
      {/* ── Header ── */}
      <View
        style={{
          paddingHorizontal: scale(20),
          paddingTop: scale(14),
          paddingBottom: scale(12),
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: scale(11),
              fontWeight: '700',
              color: TEXT_FAINT,
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginBottom: scale(6),
            }}
          >
            Inbox
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: scale(28), fontWeight: '900', color: colors.Others.white, letterSpacing: -0.8 }}>
              Notifications
            </Text>
            {totalUnread > 0 && (
              <View
                style={{
                  marginLeft: scale(10),
                  backgroundColor: ACCENT,
                  borderRadius: scale(10),
                  minWidth: scale(22),
                  height: scale(22),
                  paddingHorizontal: scale(7),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: scale(11), fontWeight: '800', color: colors.Others.white }}>
                  {totalUnread}
                </Text>
              </View>
            )}
          </View>
        </View>
        {totalUnread > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleMarkAllRead}
            style={{
              paddingVertical: scale(8),
              paddingHorizontal: scale(12),
              borderRadius: scale(20),
              backgroundColor: SURFACE,
              borderWidth: 1,
              borderColor: SURFACE_BORDER,
            }}
          >
            <Text style={{ fontSize: scale(11), fontWeight: '700', color: colors.Others.white }}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Filters ── */}
      <FilterBar active={filter} onChange={setFilter} unreadCounts={unreadCounts} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: scale(8), paddingBottom: tabBarSpace + scale(16) }}
      >
        {/* High-priority streak nudge sits above the list */}
        {filter === 'all' && groups.today.some(n => n.type === 'streak') && (
          <StreakNudgeCard streak={14} />
        )}

        {isEmpty ? (
          <EmptyState filter={filter} />
        ) : (
          <>
            {(['today', 'yesterday', 'week', 'earlier'] as Bucket[]).map(b => {
              const items = groups[b];
              if (items.length === 0) return null;
              const label =
                b === 'today'
                  ? 'Today'
                  : b === 'yesterday'
                  ? 'Yesterday'
                  : b === 'week'
                  ? 'This week'
                  : 'Earlier';
              return (
                <View key={b}>
                  <BucketHeader label={label} count={items.length} />
                  {items.map(n => (
                    <NotificationRow
                      key={n.id}
                      notif={n}
                      onMarkRead={handleMarkRead}
                      isNew={b === 'today' && n.unread}
                    />
                  ))}
                  {b === 'today' && filter === 'all' && <SuggestedRail />}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
