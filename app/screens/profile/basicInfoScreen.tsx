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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { scale } from '../../helpers/scaler';
import { colors } from '../../styles/colors';
import { Lucide } from '@react-native-vector-icons/lucide';



// ─── Constants ────────────────────────────────────────────────────────────────
const BG = colors.Dark.bg;
const ACCENT = colors.Accent.blue;
const SURFACE = colors.Dark.surface;
const SURFACE_BORDER = colors.Dark.border;
const TEXT_DIM = colors.Dark.textDim;
const TEXT_FAINT = colors.Dark.textTrace;
const STREAK_ORANGE = colors.Accent.streak;

const SUBTITLES = [
  'Foundora helps builders document progress publicly.',
  'Connect with other founders building in public.',
  'Personalize your startup journey.',
];

const TAGLINE_PLACEHOLDERS = [
  'AI productivity app',
  'React Native startup',
  'Marketplace for students',
  'Fitness tracking app',
  'SaaS for indie devs',
];

type BuilderType = { id: string; label: string; sub: string; emoji: string };
const BUILDER_TYPES: BuilderType[] = [
  { id: 'solo', label: 'Solo Founder', sub: 'Building alone', emoji: '👤' },
  { id: 'indie', label: 'Indie Hacker', sub: 'Side projects', emoji: '🚀' },
  { id: 'student', label: 'Student Builder', sub: 'Learning by shipping', emoji: '🎓' },
  { id: 'team', label: 'Small Team', sub: '2-10 builders', emoji: '👥' },
];

const TECH_TAGS = [
  'React Native',
  'AI',
  'SaaS',
  'Backend',
  'Design',
  'Web Development',
  'Mobile Apps',
  'Productivity',
  'Startup Tools',
];

const MAX_TAGS = 5;

// ─── Reusable: Section label ──────────────────────────────────────────────────
const SectionLabel = ({
  children,
  count,
}: {
  children: string;
  count?: string;
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(10),
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
      {children}
    </Text>
    {count && (
      <Text
        style={{ fontSize: scale(11), color: TEXT_FAINT, fontWeight: '700' }}
      >
        {count}
      </Text>
    )}
  </View>
);

// ─── Reusable: Animated chip ──────────────────────────────────────────────────
const Chip = ({
  label,
  emoji,
  selected,
  onPress,
}: {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
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
          backgroundColor: selected ? `${ACCENT}22` : SURFACE,
          borderWidth: 1,
          borderColor: selected ? `${ACCENT}80` : SURFACE_BORDER,
          marginRight: scale(8),
          marginBottom: scale(8),
        }}
      >
        {emoji && (
          <Text style={{ fontSize: scale(13), marginRight: scale(5) }}>
            {emoji}
          </Text>
        )}
        <Text
          style={{
            fontSize: scale(12),
            fontWeight: '700',
            color: selected ? ACCENT : colors.Dark.textMuted,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Builder type card (2x2 grid) ─────────────────────────────────────────────
const BuilderCard = ({
  type,
  selected,
  onPress,
}: {
  type: BuilderType;
  selected: boolean;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
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
    <Animated.View
      style={{
        width: '48%',
        marginBottom: scale(10),
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={{
          backgroundColor: selected ? `${ACCENT}15` : SURFACE,
          borderRadius: scale(14),
          padding: scale(13),
          borderWidth: 1.5,
          borderColor: selected ? ACCENT : SURFACE_BORDER,
          minHeight: scale(96),
        }}
      >
        <View
          style={{
            width: scale(34),
            height: scale(34),
            borderRadius: scale(10),
            backgroundColor: selected
              ? `${ACCENT}25`
              : colors.Dark.surfaceMuted,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: scale(8),
          }}
        >
          <Text style={{ fontSize: scale(16) }}>{type.emoji}</Text>
        </View>
        <Text
          style={{
            fontSize: scale(13),
            fontWeight: '800',
            color: selected ? colors.Others.white : colors.Dark.textBody,
            letterSpacing: -0.2,
          }}
        >
          {type.label}
        </Text>
        <Text
          style={{ fontSize: scale(11), color: TEXT_DIM, marginTop: scale(2) }}
        >
          {type.sub}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Compact avatar uploader ──────────────────────────────────────────────────
const AvatarUploader = ({
  hasAvatar,
  onPick,
}: {
  hasAvatar: boolean;
  onPick: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPick}
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
        width: scale(48),
        height: scale(48),
        borderRadius: scale(24),
        backgroundColor: hasAvatar ? ACCENT : colors.Accent.blueGlowStrong,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(12),
        borderWidth: hasAvatar ? 2 : 1,
        borderColor: hasAvatar ? `${ACCENT}50` : colors.Accent.blueBorderStrong,
      }}
    >
      <Text style={{ fontSize: scale(20) }}>{hasAvatar ? '🧑‍💻' : '📷'}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: scale(13),
          fontWeight: '800',
          color: colors.Others.white,
        }}
      >
        {hasAvatar ? 'Photo added' : 'Upload a photo'}
      </Text>
      <Text
        style={{ fontSize: scale(11), color: TEXT_DIM, marginTop: scale(2) }}
      >
        Optional · helps builders recognize you
      </Text>
    </View>
    <Text
      style={{
        fontSize: scale(13),
        color: hasAvatar ? ACCENT : TEXT_FAINT,
        fontWeight: '700',
      }}
    >
      {hasAvatar ? 'Change' : '+'}
    </Text>
  </TouchableOpacity>
);

// ─── Progress dots ────────────────────────────────────────────────────────────
const ProgressDots = ({ active, total }: { active: number; total: number }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(14),
    }}
  >
    {Array.from({ length: total }).map((_, i) => {
      const isActive = i === active;
      return (
        <View
          key={i}
          style={{
            width: isActive ? scale(20) : scale(6),
            height: scale(6),
            borderRadius: scale(3),
            backgroundColor: isActive ? ACCENT : colors.Dark.surfaceHighlight,
            marginRight: scale(5),
          }}
        />
      );
    })}
  </View>
);

// ─── Streak preview chip (animates from Day 0 → Day 1 once any field is filled) ──
const StreakPreview = ({ awake }: { awake: boolean }) => {
  const flame = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!awake) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(flame, {
          toValue: 1.12,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(flame, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [awake, flame]);
  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: awake ? colors.Accent.streakGlow : SURFACE,
        borderRadius: scale(20),
        paddingVertical: scale(5),
        paddingHorizontal: scale(10),
        borderWidth: 1,
        borderColor: awake ? colors.Accent.streakBorder : SURFACE_BORDER,
        transform: [{ scale: awake ? flame : 1 }],
      }}
    >
      <Lucide
        name="flame"
        size={scale(11)}
        color={awake ? STREAK_ORANGE : TEXT_FAINT}
        style={{ marginRight: scale(4), opacity: awake ? 1 : 0.4 }}
      />
      <Text
        style={{
          fontSize: scale(11),
          fontWeight: '800',
          color: awake ? STREAK_ORANGE : TEXT_FAINT,
          letterSpacing: 0.2,
        }}
      >
        Day {awake ? 1 : 0}
      </Text>
    </Animated.View>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const BasicInfoScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [building, setBuilding] = useState('');
  const [builderType, setBuilderType] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [hasAvatar, setHasAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subtitleIdx, setSubtitleIdx] = useState(0);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  // ── Fade in on mount ──
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fade]);

  // ── Rotate copy ──
  useEffect(() => {
    const subId = setInterval(
      () => setSubtitleIdx(i => (i + 1) % SUBTITLES.length),
      4500,
    );
    const phId = setInterval(
      () => setPlaceholderIdx(i => (i + 1) % TAGLINE_PLACEHOLDERS.length),
      3500,
    );
    return () => {
      clearInterval(subId);
      clearInterval(phId);
    };
  }, []);

  const toggleTag = (tag: string) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(180, 'easeInEaseOut', 'opacity'),
    );
    setTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag].slice(0, MAX_TAGS),
    );
  };

  const hasAnyInput = useMemo(
    () =>
      building.trim().length > 0 ||
      !!builderType ||
      tags.length > 0 ||
      hasAvatar,
    [building, builderType, tags, hasAvatar],
  );

  const canContinue = hasAnyInput && !submitting;

  const handleContinue = async () => {
    if (!canContinue) return;
    setSubmitting(true);
    // UI-only stub — wire to `profiles` upsert when auth lands.
    await new Promise<void>(r => setTimeout(() => r(), 700));
    setSubmitting(false);
    navigation.navigate('TabNavigator');
  };

  const handleSkip = () => navigation.navigate('TabNavigator');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={{ flex: 1, opacity: fade }}>
          {/* ── Top bar with Skip + streak preview ── */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: scale(20),
              paddingTop: scale(12),
              paddingBottom: scale(8),
            }}
          >
            <View style={{ flex: 1 }}>
              <StreakPreview awake={hasAnyInput} />
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleSkip}>
              <Text
                style={{
                  fontSize: scale(12),
                  color: TEXT_DIM,
                  fontWeight: '700',
                }}
              >
                Skip
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: scale(20),
              paddingTop: scale(12),
              paddingBottom: scale(140),
            }}
          >
            <ProgressDots active={1} total={2} />

            {/* Heading */}
            <Text
              style={{
                fontSize: scale(28),
                fontWeight: '900',
                color: colors.Others.white,
                letterSpacing: -0.8,
              }}
            >
              What are you building?
            </Text>
            <Text
              style={{
                fontSize: scale(14),
                color: TEXT_DIM,
                marginTop: scale(6),
                marginBottom: scale(28),
                fontWeight: '500',
                lineHeight: scale(20),
              }}
            >
              {SUBTITLES[subtitleIdx]}
            </Text>

            {/* ── Building input ── */}
            <SectionLabel>Your project</SectionLabel>
            <View
              style={{
                backgroundColor: SURFACE,
                borderRadius: scale(14),
                borderWidth: 1.5,
                borderColor: SURFACE_BORDER,
                paddingHorizontal: scale(14),
                marginBottom: scale(24),
              }}
            >
              <TextInput
                value={building}
                onChangeText={setBuilding}
                placeholder={TAGLINE_PLACEHOLDERS[placeholderIdx]}
                placeholderTextColor={colors.Dark.textPlaceholderSofter}
                maxLength={80}
                style={{
                  fontSize: scale(15),
                  color: colors.Others.white,
                  fontWeight: '600',
                  paddingVertical: scale(13),
                }}
              />
            </View>

            {/* ── Builder type ── */}
            <SectionLabel>You are a</SectionLabel>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginBottom: scale(8),
              }}
            >
              {BUILDER_TYPES.map(t => (
                <BuilderCard
                  key={t.id}
                  type={t}
                  selected={builderType === t.id}
                  onPress={() =>
                    setBuilderType(builderType === t.id ? null : t.id)
                  }
                />
              ))}
            </View>

            {/* ── Interests ── */}
            <View style={{ marginTop: scale(12) }}>
              <SectionLabel count={`${tags.length}/${MAX_TAGS}`}>
                Interests
              </SectionLabel>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: scale(20),
                }}
              >
                {TECH_TAGS.map(t => (
                  <Chip
                    key={t}
                    label={t}
                    selected={tags.includes(t)}
                    onPress={() => toggleTag(t)}
                  />
                ))}
              </View>
            </View>

            {/* ── Avatar ── */}
            <SectionLabel>Profile photo</SectionLabel>
            <View style={{ marginBottom: scale(20) }}>
              <AvatarUploader
                hasAvatar={hasAvatar}
                onPick={() => setHasAvatar(h => !h)}
              />
            </View>

            {/* ── Streak hint ── */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.Accent.streakGlowSubtle,
                borderRadius: scale(14),
                padding: scale(13),
                borderWidth: 1,
                borderColor: colors.Accent.streakBorderHover,
              }}
            >
              <View
                style={{
                  width: scale(36),
                  height: scale(36),
                  borderRadius: scale(12),
                  backgroundColor: colors.Accent.streakGlowExtra,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: scale(12),
                }}
              >
                <Lucide name="flame" size={scale(17)} color={STREAK_ORANGE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: scale(13),
                    fontWeight: '800',
                    color: colors.Others.white,
                  }}
                >
                  Your streak starts on Day 1
                </Text>
                <Text
                  style={{
                    fontSize: scale(11),
                    color: TEXT_DIM,
                    marginTop: scale(2),
                  }}
                >
                  Post your first update to light the flame.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* ── Sticky bottom bar ── */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              paddingHorizontal: scale(20),
              paddingTop: scale(12),
              paddingBottom: Platform.OS === 'ios' ? scale(28) : scale(16),
              backgroundColor: colors.Dark.bgFooter,
              borderTopWidth: 1,
              borderTopColor: colors.Dark.borderMuted,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleContinue}
              disabled={!canContinue}
              style={{
                backgroundColor: canContinue
                  ? ACCENT
                  : colors.Accent.blueDisabled,
                borderRadius: scale(14),
                paddingVertical: scale(15),
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                shadowColor: ACCENT,
                shadowOpacity: canContinue ? 0.4 : 0,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
              }}
            >
              {submitting ? (
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
                    Personalizing…
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: scale(14),
                      fontWeight: '800',
                      color: canContinue
                        ? colors.Others.white
                        : colors.Dark.textDim,
                      letterSpacing: 0.3,
                    }}
                  >
                    Continue
                  </Text>
                  <Text
                    style={{
                      fontSize: scale(13),
                      color: canContinue
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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSkip}
              style={{
                alignItems: 'center',
                paddingVertical: scale(10),
                marginTop: scale(2),
              }}
            >
              <Text
                style={{
                  fontSize: scale(12),
                  color: TEXT_DIM,
                  fontWeight: '700',
                }}
              >
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BasicInfoScreen;
