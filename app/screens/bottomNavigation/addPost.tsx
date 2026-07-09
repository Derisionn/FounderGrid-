import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale } from '../../helpers/scaler';
import { supabase, getUserId } from '../../lib/supabase';
import { colors } from '../../styles/colors';
import { ME_AVATAR } from '../../helpers/avatars';
import { Lucide } from '@react-native-vector-icons/lucide';
import { useTabBarSpace } from '../../components/navigation/CustomTabBar';



// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = colors.Accent.blue;
const BG = colors.Dark.bg;
const SURFACE = colors.Dark.surface;
const SURFACE_BORDER = colors.Dark.border;
const TEXT_DIM = colors.Dark.textFaint;
const TEXT_FAINT = colors.Dark.textPlaceholder;
const MAX_CHARS = 500;
const DRAFT_KEY = '@foundora/post-draft';
const ONBOARDING_KEY = '@foundora/post-onboarded';

const PLACEHOLDERS = [
  'What did you build today?',
  'Share your progress…',
  'Fixed onboarding bug today',
  'Shipped a new feature 🚀',
  'Stuck on something? Ask the community.',
];

const PROJECTS = [
  { id: 'foundora', name: 'Foundora' },
  { id: 'side', name: 'Side Project' },
  { id: 'consult', name: 'Client Work' },
];

const TAGS = ['React Native', 'AI', 'SaaS', 'Design', 'Backend', 'iOS', 'Web3'];

type Mood = { id: string; label: string; color: string };
const MOODS: Mood[] = [
  { id: 'productive', label: 'Productive', color: colors.Accent.streakAmber },
  { id: 'shipping', label: 'Shipping', color: colors.Accent.shippingGreen },
  { id: 'learning', label: 'Learning', color: colors.Accent.blue },
  { id: 'struggling', label: 'Struggling', color: colors.Accent.danger },
];

type Visibility = 'public' | 'followers';

// ─── Reusable: Section label ──────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: scale(10),
      fontWeight: '700',
      color: TEXT_FAINT,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: scale(10),
    }}
  >
    {children}
  </Text>
);

// ─── Reusable: Chip ───────────────────────────────────────────────────────────
const Chip = ({
  label,

  selected,
  onPress,
  accent = ACCENT,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  accent?: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: scale(8),
          paddingHorizontal: scale(13),
          borderRadius: scale(20),
          backgroundColor: selected ? `${accent}22` : SURFACE,
          borderWidth: 1,
          borderColor: selected ? `${accent}80` : SURFACE_BORDER,
          marginRight: scale(8),
          marginBottom: scale(8),
        }}
      >
        <Text
          style={{
            fontSize: scale(12),
            fontWeight: '700',
            color: selected ? accent : colors.Dark.textTertiary,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Reusable: ToggleRow ──────────────────────────────────────────────────────
const ToggleRow = ({
  icon,
  title,
  subtitle,
  value,
  onChange,
}: {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => {
  const tx = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(tx, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [value, tx]);

  const knobLeft = tx.interpolate({
    inputRange: [0, 1],
    outputRange: [scale(2), scale(20)],
  });
  const trackBg = tx.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.Dark.surfaceStrong, `${ACCENT}cc`],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onChange(!value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: SURFACE,
        borderRadius: scale(14),
        padding: scale(13),
        borderWidth: 1,
        borderColor: SURFACE_BORDER,
      }}
    >
      <View
        style={{
          width: scale(34),
          height: scale(34),
          borderRadius: scale(10),
          backgroundColor: colors.Accent.blueGlowStrong,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: scale(12),
        }}
      >
        <Text style={{ fontSize: scale(15) }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: scale(13), fontWeight: '700', color: colors.Others.white }}>
          {title}
        </Text>
        <Text
          style={{ fontSize: scale(11), color: TEXT_DIM, marginTop: scale(2) }}
        >
          {subtitle}
        </Text>
      </View>
      <Animated.View
        style={{
          width: scale(40),
          height: scale(22),
          borderRadius: scale(12),
          backgroundColor: trackBg,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: scale(18),
            height: scale(18),
            borderRadius: scale(9),
            backgroundColor: colors.Others.white,
            position: 'absolute',
            left: knobLeft,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Streak badge ─────────────────────────────────────────────────────────────
const StreakBadge = ({ streak }: { streak: number }) => {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulse]);
  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.Accent.burnt,
        paddingVertical: scale(6),
        paddingHorizontal: scale(10),
        borderRadius: scale(20),
        borderWidth: 1,
        borderColor: colors.Accent.burntBorder,
        transform: [{ scale: pulse }],
      }}
    >
      <Lucide
        name="flame"
        size={scale(12)}
        color={colors.Accent.streak}
        style={{ marginRight: scale(4) }}
      />
      <Text
        style={{
          fontSize: scale(12),
          fontWeight: '800',
          color: colors.Accent.streak,
          letterSpacing: 0.2,
        }}
      >
        {streak}-day streak
      </Text>
    </Animated.View>
  );
};

// ─── Project picker (inline expandable) ───────────────────────────────────────
const ProjectPicker = ({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selected = PROJECTS.find(p => p.id === selectedId) ?? PROJECTS[0];
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(o => !o);
  };
  return (
    <View>
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.85}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: SURFACE,
          borderRadius: scale(20),
          paddingVertical: scale(6),
          paddingHorizontal: scale(10),
          borderWidth: 1,
          borderColor: SURFACE_BORDER,
        }}
      >
        <Text style={{ fontSize: scale(12), fontWeight: '700', color: colors.Others.white }}>
          {selected.name}
        </Text>
        <Text
          style={{ fontSize: scale(10), color: TEXT_DIM, marginLeft: scale(6) }}
        >
          {open ? '▴' : '▾'}
        </Text>
      </TouchableOpacity>
      {open && (
        <View
          style={{
            position: 'absolute',
            top: scale(38),
            left: 0,
            right: 0,
            backgroundColor: colors.Dark.bgElevated,
            borderRadius: scale(14),
            borderWidth: 1,
            borderColor: SURFACE_BORDER,
            paddingVertical: scale(4),
            zIndex: 10,
            elevation: 10,
            shadowColor: colors.Others.shadow,
            shadowOpacity: 0.4,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
          }}
        >
          {PROJECTS.map(p => (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.7}
              onPress={() => {
                onSelect(p.id);
                toggle();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: scale(8),
                paddingHorizontal: scale(12),
                backgroundColor:
                  p.id === selectedId ? colors.Accent.blueGlow : colors.Others.transparent,
              }}
            >
              <Text
                style={{
                  fontSize: scale(13),
                  fontWeight: '600',
                  color: p.id === selectedId ? ACCENT : colors.Others.white,
                  flex: 1,
                }}
              >
                {p.name}
              </Text>
              {p.id === selectedId && (
                <Text style={{ fontSize: scale(12), color: ACCENT }}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Onboarding hint (first-time only) ────────────────────────────────────────
const OnboardingHint = ({ onDismiss }: { onDismiss: () => void }) => {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [fade]);
  return (
    <Animated.View
      style={{
        opacity: fade,
        backgroundColor: colors.Accent.blueGlowSubtle,
        borderRadius: scale(14),
        padding: scale(13),
        borderWidth: 1,
        borderColor: colors.Accent.blueBorderHover,
        marginBottom: scale(16),
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      <Text style={{ fontSize: scale(16), marginRight: scale(10) }}>👋</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: scale(13),
            fontWeight: '700',
            color: colors.Others.white,
            marginBottom: scale(4),
          }}
        >
          Your first post
        </Text>
        <Text
          style={{
            fontSize: scale(12),
            color: TEXT_DIM,
            lineHeight: scale(18),
          }}
        >
          Keep it real — small wins, small struggles. Builders connect over
          honesty, not hype.
        </Text>
      </View>
      <TouchableOpacity
        onPress={onDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text
          style={{ fontSize: scale(14), color: TEXT_DIM, marginLeft: scale(8) }}
        >
          ×
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Format date ──────────────────────────────────────────────────────────────
const formatNow = () => {
  const d = new Date();
  const date = d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const AddPostScreen = () => {
  const tabBarSpace = useTabBarSpace();
  const [text, setText] = useState('');
  const [project, setProject] = useState(PROJECTS[0].id);
  const [mood, setMood] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [openToCollab, setOpenToCollab] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const streak = 7;

  // ── Restore draft + onboarding ──
  useEffect(() => {
    (async () => {
      const draft = await AsyncStorage.getItem(DRAFT_KEY);
      if (draft) {
        try {
          const d = JSON.parse(draft);
          setText(d.text ?? '');
          setProject(d.project ?? PROJECTS[0].id);
          setMood(d.mood ?? null);
          setTags(Array.isArray(d.tags) ? d.tags : []);
          setVisibility(d.visibility ?? 'public');
          setOpenToCollab(!!d.openToCollab);
          setHasImage(!!d.hasImage);
        } catch {}
      }
      const onboarded = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (!onboarded) setShowHint(true);
    })();
  }, []);

  // ── Auto-save draft (debounced) ──
  useEffect(() => {
    const t = setTimeout(() => {
      const payload = JSON.stringify({
        text,
        project,
        mood,
        tags,
        visibility,
        openToCollab,
        hasImage,
      });
      AsyncStorage.setItem(DRAFT_KEY, payload).then(() =>
        setSavedAt(Date.now()),
      );
    }, 600);
    return () => clearTimeout(t);
  }, [text, project, mood, tags, visibility, openToCollab, hasImage]);

  // ── Rotate placeholder when empty ──
  useEffect(() => {
    if (text.length > 0) return;
    const id = setInterval(
      () => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length),
      3500,
    );
    return () => clearInterval(id);
  }, [text]);

  const charCount = text.length;
  const overLimit = charCount > MAX_CHARS;
  const canPost = text.trim().length > 0 && !overLimit && !posting;

  const toggleTag = (tag: string) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(180, 'easeInEaseOut', 'opacity'),
    );
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const dismissHint = async () => {
    setShowHint(false);
    await AsyncStorage.setItem(ONBOARDING_KEY, '1');
  };

  const handlePost = async () => {
    if (!canPost) return;
    setPosting(true);
    setPostError(null);
    const uid = await getUserId();
    if (!uid) {
      setPostError('You need to be signed in to post.');
      setPosting(false);
      return;
    }
    // `project` here is a local slug (e.g. 'foundora'); real project_id will be
    // populated once projects are fetched from Supabase. Send null for now.
    const { error } = await supabase.from('posts').insert({
      user_id: uid,
      project_id: null,
      content: text.trim(),
      mood,
      tags,
      visibility,
      has_image: hasImage,
    });
    if (error) {
      setPostError(error.message);
      setPosting(false);
      return;
    }
    await AsyncStorage.removeItem(DRAFT_KEY);
    setText('');
    setMood(null);
    setTags([]);
    setHasImage(false);
    setOpenToCollab(false);
    setPosting(false);
  };

  const savedLabel = useMemo(() => {
    if (!savedAt) return '';
    const seconds = Math.max(1, Math.floor((Date.now() - savedAt) / 1000));
    return seconds < 5 ? 'Draft saved' : 'Draft saved · just now';
  }, [savedAt]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Top bar ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(16),
            paddingTop: scale(12),
            paddingBottom: scale(12),
            borderBottomWidth: 1,
            borderBottomColor: colors.Dark.divider,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: scale(36),
              height: scale(36),
              borderRadius: scale(18),
              backgroundColor: SURFACE,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: SURFACE_BORDER,
            }}
          >
            <Text
              style={{
                fontSize: scale(16),
                color: colors.Others.white,
                marginTop: scale(-1),
              }}
            >
              ×
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: scale(14),
                fontWeight: '800',
                color: colors.Others.white,
                letterSpacing: -0.2,
              }}
            >
              New Post
            </Text>
            <Text
              style={{
                fontSize: scale(10),
                color: TEXT_FAINT,
                marginTop: scale(1),
                fontWeight: '600',
              }}
            >
              {formatNow()}
            </Text>
          </View>
          <StreakBadge streak={streak} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: scale(20),
            paddingTop: scale(18),
            // Clear the fixed action bar plus the floating tab bar below it.
            paddingBottom: tabBarSpace + scale(120),
          }}
          keyboardShouldPersistTaps="handled"
        >
          {showHint && <OnboardingHint onDismiss={dismissHint} />}

          {/* ── Author + project row ── */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: scale(16),
              zIndex: 10,
            }}
          >
            <Image
              source={ME_AVATAR}
              style={{
                width: scale(38),
                height: scale(38),
                borderRadius: scale(19),
                marginRight: scale(10),
              }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: scale(13),
                  fontWeight: '700',
                  color: colors.Others.white,
                }}
              >
                You
              </Text>
              <Text
                style={{
                  fontSize: scale(11),
                  color: TEXT_DIM,
                  marginTop: scale(1),
                }}
              >
                Posting to {visibility === 'public' ? 'everyone' : 'followers'}
              </Text>
            </View>
            <ProjectPicker selectedId={project} onSelect={setProject} />
          </View>

          {/* ── Text input ── */}
          <View style={{ minHeight: scale(140), marginBottom: scale(8) }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              placeholderTextColor={colors.Dark.textPlaceholderSofter}
              multiline
              maxLength={MAX_CHARS + 50}
              style={{
                fontSize: scale(17),
                lineHeight: scale(25),
                color: colors.Others.white,
                fontWeight: '500',
                textAlignVertical: 'top',
                minHeight: scale(140),
                padding: 0,
                letterSpacing: -0.2,
              }}
            />
          </View>

          {/* ── Char counter + draft saved ── */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: scale(16),
              minHeight: scale(16),
            }}
          >
            <Text
              style={{
                fontSize: scale(11),
                color: TEXT_FAINT,
                fontWeight: '500',
                flex: 1,
              }}
            >
              {savedLabel}
            </Text>
            {text.length > 0 && (
              <Text
                style={{
                  fontSize: scale(11),
                  fontWeight: '700',
                  color: overLimit
                    ? colors.Accent.danger
                    : charCount > MAX_CHARS - 50
                    ? colors.Accent.streak
                    : TEXT_FAINT,
                }}
              >
                {charCount}/{MAX_CHARS}
              </Text>
            )}
          </View>

          {/* ── Image attachment ── */}
          {hasImage ? (
            <View
              style={{
                height: scale(170),
                borderRadius: scale(16),
                backgroundColor: colors.Accent.blueGlow,
                borderWidth: 1,
                borderColor: colors.Accent.blueBorderStrong,
                marginBottom: scale(20),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: scale(28), marginBottom: scale(8) }}>
                🖼️
              </Text>
              <Text
                style={{
                  fontSize: scale(12),
                  color: colors.Others.white,
                  fontWeight: '600',
                }}
              >
                screenshot.png
              </Text>
              <TouchableOpacity
                onPress={() => setHasImage(false)}
                style={{
                  position: 'absolute',
                  top: scale(10),
                  right: scale(10),
                  width: scale(26),
                  height: scale(26),
                  borderRadius: scale(13),
                  backgroundColor: colors.Dark.scrim,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: colors.Others.white, fontSize: scale(13) }}>×</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setHasImage(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: SURFACE,
                borderRadius: scale(14),
                padding: scale(13),
                borderWidth: 1,
                borderColor: SURFACE_BORDER,
                borderStyle: 'dashed',
                marginBottom: scale(20),
              }}
            >
              <View
                style={{
                  width: scale(34),
                  height: scale(34),
                  borderRadius: scale(10),
                  backgroundColor: colors.Accent.blueGlowStrong,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: scale(12),
                }}
              >
                <Text style={{ fontSize: scale(15) }}>📷</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: scale(13),
                    fontWeight: '700',
                    color: colors.Others.white,
                  }}
                >
                  Add a screenshot
                </Text>
                <Text
                  style={{
                    fontSize: scale(11),
                    color: TEXT_DIM,
                    marginTop: scale(2),
                  }}
                >
                  Show what you shipped today.
                </Text>
              </View>
              <Text style={{ fontSize: scale(18), color: TEXT_FAINT }}>+</Text>
            </TouchableOpacity>
          )}

          {/* ── Mood ── */}
          <SectionLabel>How's it going?</SectionLabel>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: scale(20),
            }}
          >
            {MOODS.map(m => (
              <Chip
                key={m.id}
                label={m.label}
                selected={mood === m.id}
                accent={m.color}
                onPress={() => setMood(mood === m.id ? null : m.id)}
              />
            ))}
          </View>

          {/* ── Tags ── */}
          <SectionLabel>Tag your stack</SectionLabel>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: scale(20),
            }}
          >
            {TAGS.map(t => (
              <Chip
                key={t}
                label={t}
                selected={tags.includes(t)}
                onPress={() => toggleTag(t)}
              />
            ))}
          </View>

          {/* ── Visibility ── */}
          <SectionLabel>Visibility</SectionLabel>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: SURFACE,
              borderRadius: scale(14),
              padding: scale(4),
              borderWidth: 1,
              borderColor: SURFACE_BORDER,
              marginBottom: scale(16),
            }}
          >
            {(['public', 'followers'] as Visibility[]).map(v => {
              const active = visibility === v;
              return (
                <TouchableOpacity
                  key={v}
                  activeOpacity={0.85}
                  onPress={() => setVisibility(v)}
                  style={{
                    flex: 1,
                    paddingVertical: scale(10),
                    borderRadius: scale(10),
                    backgroundColor: active ? ACCENT : 'transparent',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: scale(13), marginRight: scale(6) }}>
                    {v === 'public' ? '🌍' : '👥'}
                  </Text>
                  <Text
                    style={{
                      fontSize: scale(13),
                      fontWeight: '700',
                      color: active ? colors.Others.white : TEXT_DIM,
                    }}
                  >
                    {v === 'public' ? 'Public' : 'Followers'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Collab toggle ── */}
          <ToggleRow
            icon="🤝"
            title="Open to collaborators"
            subtitle="Let other builders reach out about this."
            value={openToCollab}
            onChange={setOpenToCollab}
          />
        </ScrollView>

        {/* ── Fixed action bar, floating above the tab bar ── */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: tabBarSpace,
            paddingHorizontal: scale(16),
            paddingTop: scale(10),
            paddingBottom: scale(12),
            backgroundColor: colors.Dark.bgFooter,
            borderTopWidth: 1,
            borderTopColor: colors.Dark.borderMuted,
          }}
        >
          {!canPost && text.trim().length === 0 && (
            <Text
              style={{
                fontSize: scale(11),
                color: TEXT_FAINT,
                textAlign: 'center',
                marginBottom: scale(8),
                fontWeight: '500',
              }}
            >
              Add a few words to share an update.
            </Text>
          )}
          {overLimit && (
            <Text
              style={{
                fontSize: scale(11),
                color: colors.Accent.danger,
                textAlign: 'center',
                marginBottom: scale(8),
                fontWeight: '600',
              }}
            >
              You're over the {MAX_CHARS}-character limit.
            </Text>
          )}
          {postError && (
            <Text
              style={{
                fontSize: scale(11),
                color: colors.Accent.danger,
                textAlign: 'center',
                marginBottom: scale(8),
                fontWeight: '600',
              }}
            >
              {postError}
            </Text>
          )}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePost}
            disabled={!canPost}
            style={{
              backgroundColor: canPost ? ACCENT : colors.Accent.blueDisabled,
              borderRadius: scale(14),
              paddingVertical: scale(15),
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              shadowColor: ACCENT,
              shadowOpacity: canPost ? 0.4 : 0,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
            }}
          >
            {posting ? (
              <>
                <ActivityIndicator
                  color={colors.Others.white}
                  size="small"
                  style={{ marginRight: scale(8) }}
                />
                <Text
                  style={{
                    fontSize: scale(14),
                    fontWeight: '800',
                    color: colors.Others.white,
                  }}
                >
                  Posting…
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: scale(14),
                    fontWeight: '800',
                    color: canPost ? colors.Others.white : colors.Dark.textDim,
                    letterSpacing: 0.3,
                  }}
                >
                  Share update
                </Text>
                <Text
                  style={{
                    fontSize: scale(13),
                    color: canPost
                      ? colors.Dark.textSecondary
                      : colors.Dark.textFainter,
                    marginLeft: scale(8),
                  }}
                >
                  →
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddPostScreen;
