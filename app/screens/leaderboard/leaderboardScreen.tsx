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
import { NavigationProp } from '@react-navigation/native';
import { Lucide } from '@react-native-vector-icons/lucide';
import { scale } from '../../helpers/scaler';
import { colors } from '../../styles/colors';
import { ME_AVATAR, avatarFor } from '../../helpers/avatars';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Constants ────────────────────────────────────────────────────────────────
const BG = colors.Dark.bg;
const ACCENT = colors.Accent.blue;
const SURFACE = colors.Dark.surface;
const SURFACE_BORDER = colors.Dark.border;
const DIVIDER = colors.Dark.divider;
const TEXT_DIM = colors.Dark.textDim;
const TEXT_FAINT = colors.Dark.textTrace;
const STREAK_ORANGE = colors.Accent.streak;
const GOLD = colors.Accent.streakAmber;
const SILVER = colors.Dark.textSubtle;
const BRONZE = colors.Accent.amber;

type RangeId = 'weekly' | 'monthly' | 'all';

type Builder = {
  id: string;
  name: string;
  username: string;
  points: number;
  streak: number;
  delta: number;
  isMe?: boolean;
};

// ─── Demo data ────────────────────────────────────────────────────────────────
const ME: Builder = {
  id: 'me',
  name: 'Anmol Singh',
  username: '@anmol',
  points: 1840,
  streak: 7,
  delta: 4,
  isMe: true,
};

const LEADERS_RAW: Builder[] = [
  { id: 'u1', name: 'Riya Kapoor', username: '@riya.codes', points: 4820, streak: 96, delta: 0 },
  { id: 'u2', name: 'Devansh Mehta', username: '@devansh', points: 4510, streak: 81, delta: 1 },
  { id: 'u3', name: 'Aarav Sethi', username: '@aarav', points: 4230, streak: 64, delta: -1 },
  { id: 'u4', name: 'Naina Iyer', username: '@naina.builds', points: 3940, streak: 58, delta: 2 },
  { id: 'u5', name: 'Kabir Singh', username: '@kabir', points: 3710, streak: 49, delta: 0 },
  { id: 'u6', name: 'Mira Joshi', username: '@mira', points: 3380, streak: 41, delta: 3 },
  { id: 'u7', name: 'Ishaan Rao', username: '@ishaan', points: 3110, streak: 33, delta: -2 },
  { id: 'u8', name: 'Tara Bhatia', username: '@tara', points: 2870, streak: 27, delta: 1 },
  { id: 'u9', name: 'Vivaan Shah', username: '@vivaan', points: 2540, streak: 22, delta: 0 },
  { id: 'u10', name: 'Sara Khanna', username: '@sara', points: 2210, streak: 18, delta: 4 },
  { id: 'u11', name: 'Arjun Patel', username: '@arjun', points: 1980, streak: 12, delta: -1 },
  ME,
  { id: 'u12', name: 'Diya Rao', username: '@diya', points: 1690, streak: 6, delta: 0 },
  { id: 'u13', name: 'Krish Verma', username: '@krish', points: 1430, streak: 4, delta: 2 },
];

const RANGES: { id: RangeId; label: string }[] = [
  { id: 'weekly', label: 'This week' },
  { id: 'monthly', label: 'This month' },
  { id: 'all', label: 'All time' },
];

// ─── Range tabs ───────────────────────────────────────────────────────────────
const RangeTabs = ({
  active,
  onChange,
}: {
  active: RangeId;
  onChange: (id: RangeId) => void;
}) => (
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
    {RANGES.map(t => {
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
            backgroundColor: isActive ? ACCENT : colors.Others.transparent,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: scale(12),
              fontWeight: '700',
              color: isActive ? colors.Others.white : TEXT_DIM,
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

// ─── Podium block (top 3) ─────────────────────────────────────────────────────
const PodiumBlock = ({
  builder,
  rank,
  accent,
  height,
}: {
  builder: Builder;
  rank: 1 | 2 | 3;
  accent: string;
  height: number;
}) => {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (rank !== 1) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse, rank]);

  const avatarSize = rank === 1 ? scale(74) : scale(58);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {rank === 1 && (
        <Lucide
          name="crown"
          size={scale(22)}
          color={GOLD}
          style={{ marginBottom: scale(2) }}
        />
      )}
      <Animated.View
        style={{
          width: avatarSize + scale(8),
          height: avatarSize + scale(8),
          borderRadius: (avatarSize + scale(8)) / 2,
          backgroundColor: `${accent}20`,
          borderWidth: 2,
          borderColor: accent,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: pulse }],
          shadowColor: accent,
          shadowOpacity: rank === 1 ? 0.6 : 0.3,
          shadowRadius: rank === 1 ? 14 : 8,
          shadowOffset: { width: 0, height: 0 },
        }}
      >
        <Image
          source={avatarFor(builder.id)}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -scale(4),
            backgroundColor: accent,
            borderRadius: scale(10),
            paddingHorizontal: scale(7),
            paddingVertical: scale(2),
            borderWidth: 2,
            borderColor: BG,
          }}
        >
          <Text
            style={{
              fontSize: scale(10),
              fontWeight: '900',
              color: colors.Others.white,
              letterSpacing: 0.3,
            }}
          >
            #{rank}
          </Text>
        </View>
      </Animated.View>
      <Text
        numberOfLines={1}
        style={{
          fontSize: scale(12),
          fontWeight: '800',
          color: colors.Others.white,
          marginTop: scale(14),
          maxWidth: scale(96),
          textAlign: 'center',
        }}
      >
        {builder.name}
      </Text>
      <Text
        style={{
          fontSize: scale(10),
          color: TEXT_DIM,
          marginTop: scale(2),
        }}
      >
        {builder.username}
      </Text>
      <View
        style={{
          marginTop: scale(8),
          backgroundColor: `${accent}18`,
          borderRadius: scale(10),
          paddingHorizontal: scale(9),
          paddingVertical: scale(4),
          borderWidth: 1,
          borderColor: `${accent}40`,
        }}
      >
        <Text style={{ fontSize: scale(12), fontWeight: '900', color: accent, letterSpacing: -0.3 }}>
          {builder.points.toLocaleString()}
        </Text>
      </View>
      <View
        style={{
          width: '78%',
          height: scale(height),
          marginTop: scale(10),
          backgroundColor: `${accent}14`,
          borderTopLeftRadius: scale(10),
          borderTopRightRadius: scale(10),
          borderWidth: 1,
          borderBottomWidth: 0,
          borderColor: `${accent}30`,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: scale(8),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Lucide name="flame" size={scale(11)} color={STREAK_ORANGE} />
          <Text
            style={{
              fontSize: scale(10),
              fontWeight: '800',
              color: STREAK_ORANGE,
              marginLeft: scale(3),
            }}
          >
            {builder.streak}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ─── Podium (top 3) ───────────────────────────────────────────────────────────
const Podium = ({ top3 }: { top3: Builder[] }) => {
  const [first, second, third] = top3;
  return (
    <View
      style={{
        backgroundColor: SURFACE,
        borderRadius: scale(18),
        borderWidth: 1,
        borderColor: SURFACE_BORDER,
        paddingTop: scale(16),
        paddingHorizontal: scale(8),
        marginBottom: scale(20),
        overflow: 'hidden',
      }}
    >
      <Text
        style={{
          fontSize: scale(11),
          fontWeight: '800',
          color: TEXT_FAINT,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: scale(8),
        }}
      >
        Top builders
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        {second && <PodiumBlock builder={second} rank={2} accent={SILVER} height={56} />}
        {first && <PodiumBlock builder={first} rank={1} accent={GOLD} height={84} />}
        {third && <PodiumBlock builder={third} rank={3} accent={BRONZE} height={42} />}
      </View>
    </View>
  );
};

// ─── My rank card ─────────────────────────────────────────────────────────────
const MyRankCard = ({ rank, total, me }: { rank: number; total: number; me: Builder }) => {
  const flame = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flame, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(flame, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, [flame]);

  const percentile = Math.max(1, Math.round((rank / total) * 100));

  return (
    <View
      style={{
        backgroundColor: colors.Accent.blueGlowSubtle,
        borderRadius: scale(18),
        borderWidth: 1,
        borderColor: colors.Accent.blueBorderStrong,
        padding: scale(14),
        marginBottom: scale(20),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: scale(54),
            height: scale(54),
            borderRadius: scale(27),
            backgroundColor: BG,
            borderWidth: 2,
            borderColor: ACCENT,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: scale(12),
          }}
        >
          <Image
            source={ME_AVATAR}
            style={{ width: scale(48), height: scale(48), borderRadius: scale(24) }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: scale(10),
              fontWeight: '800',
              color: ACCENT,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}
          >
            Your rank
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: scale(2) }}>
            <Text
              style={{
                fontSize: scale(28),
                fontWeight: '900',
                color: colors.Others.white,
                letterSpacing: -1,
              }}
            >
              #{rank}
            </Text>
            <Text
              style={{
                fontSize: scale(12),
                color: TEXT_DIM,
                fontWeight: '700',
                marginLeft: scale(6),
              }}
            >
              of {total.toLocaleString()}
            </Text>
          </View>
          <Text style={{ fontSize: scale(11), color: TEXT_DIM, marginTop: scale(2) }}>
            Top {percentile}% · {me.points.toLocaleString()} pts
          </Text>
        </View>

        <Animated.View
          style={{
            alignItems: 'center',
            backgroundColor: colors.Accent.streakGlowStrong,
            borderRadius: scale(14),
            paddingHorizontal: scale(12),
            paddingVertical: scale(10),
            borderWidth: 1,
            borderColor: colors.Accent.streakBorder,
            transform: [{ scale: flame }],
          }}
        >
          <Lucide name="flame" size={scale(22)} color={STREAK_ORANGE} />
          <Text
            style={{
              fontSize: scale(16),
              fontWeight: '900',
              color: STREAK_ORANGE,
              marginTop: scale(2),
              letterSpacing: -0.4,
            }}
          >
            {me.streak}
          </Text>
          <Text
            style={{
              fontSize: scale(8),
              fontWeight: '800',
              color: STREAK_ORANGE,
              letterSpacing: 0.6,
            }}
          >
            DAYS
          </Text>
        </Animated.View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginTop: scale(14),
          backgroundColor: colors.Accent.blueGlow,
          borderRadius: scale(12),
          borderWidth: 1,
          borderColor: colors.Accent.blueBorder,
          paddingVertical: scale(10),
        }}
      >
        <MiniStat label="Points" value={me.points.toLocaleString()} />
        <View style={{ width: 1, backgroundColor: colors.Accent.blueBorder }} />
        <MiniStat
          label="Weekly"
          value={`${me.delta >= 0 ? '+' : ''}${me.delta}`}
          tone={me.delta >= 0 ? colors.Accent.green : colors.Accent.danger}
        />
        <View style={{ width: 1, backgroundColor: colors.Accent.blueBorder }} />
        <MiniStat label="Streak" value={`${me.streak}d`} tone={STREAK_ORANGE} />
      </View>
    </View>
  );
};

const MiniStat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text
      style={{
        fontSize: scale(15),
        fontWeight: '900',
        color: tone ?? colors.Others.white,
        letterSpacing: -0.4,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontSize: scale(9),
        color: TEXT_FAINT,
        marginTop: scale(2),
        fontWeight: '700',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Text>
  </View>
);

// ─── Row (rank entry) ─────────────────────────────────────────────────────────
const RankRow = ({
  builder,
  rank,
  isLast,
}: {
  builder: Builder;
  rank: number;
  isLast?: boolean;
}) => {
  const isMe = builder.isMe;
  const deltaColor =
    builder.delta > 0
      ? colors.Accent.green
      : builder.delta < 0
      ? colors.Accent.danger
      : TEXT_FAINT;
  const deltaIcon =
    builder.delta > 0 ? 'trending-up' : builder.delta < 0 ? 'trending-down' : 'minus';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(12),
        paddingHorizontal: scale(12),
        backgroundColor: isMe ? colors.Accent.blueGlow : colors.Others.transparent,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: DIVIDER,
        borderLeftWidth: isMe ? 3 : 0,
        borderLeftColor: isMe ? ACCENT : colors.Others.transparent,
      }}
    >
      <Text
        style={{
          width: scale(28),
          fontSize: scale(13),
          fontWeight: '800',
          color: isMe ? ACCENT : TEXT_DIM,
          letterSpacing: -0.3,
        }}
      >
        #{rank}
      </Text>

      <Image
        source={isMe ? ME_AVATAR : avatarFor(builder.id)}
        style={{
          width: scale(36),
          height: scale(36),
          borderRadius: scale(18),
          borderWidth: 1.5,
          borderColor: isMe ? ACCENT : SURFACE_BORDER,
          marginRight: scale(10),
        }}
      />

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: scale(13),
              fontWeight: '800',
              color: colors.Others.white,
              letterSpacing: -0.2,
            }}
            numberOfLines={1}
          >
            {builder.name}
          </Text>
          {isMe && (
            <View
              style={{
                marginLeft: scale(6),
                backgroundColor: ACCENT,
                paddingHorizontal: scale(6),
                paddingVertical: scale(1),
                borderRadius: scale(6),
              }}
            >
              <Text
                style={{
                  fontSize: scale(9),
                  fontWeight: '900',
                  color: colors.Others.white,
                  letterSpacing: 0.4,
                }}
              >
                YOU
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(2) }}>
          <Lucide name="flame" size={scale(10)} color={STREAK_ORANGE} />
          <Text
            style={{
              fontSize: scale(10),
              fontWeight: '700',
              color: STREAK_ORANGE,
              marginLeft: scale(3),
            }}
          >
            {builder.streak}
          </Text>
          <Text style={{ fontSize: scale(10), color: TEXT_FAINT, marginHorizontal: scale(5) }}>·</Text>
          <Text style={{ fontSize: scale(10), color: TEXT_DIM, fontWeight: '600' }}>
            {builder.username}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text
          style={{
            fontSize: scale(14),
            fontWeight: '900',
            color: colors.Others.white,
            letterSpacing: -0.3,
          }}
        >
          {builder.points.toLocaleString()}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(2) }}>
          <Lucide name={deltaIcon as any} size={scale(11)} color={deltaColor} />
          <Text
            style={{
              fontSize: scale(10),
              color: deltaColor,
              fontWeight: '800',
              marginLeft: scale(3),
            }}
          >
            {builder.delta === 0 ? '—' : Math.abs(builder.delta)}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const LeaderboardScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [range, setRange] = useState<RangeId>('weekly');

  const ranked = useMemo(() => {
    const multiplier = range === 'weekly' ? 1 : range === 'monthly' ? 1.08 : 1.22;
    return [...LEADERS_RAW]
      .map(b => ({ ...b, points: Math.round(b.points * multiplier) }))
      .sort((a, b) => b.points - a.points);
  }, [range]);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const myRank = ranked.findIndex(b => b.isMe) + 1;
  const me = ranked.find(b => b.isMe) ?? ME;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
      {/* Top bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: scale(16),
          paddingTop: scale(12),
          paddingBottom: scale(12),
          borderBottomWidth: 1,
          borderBottomColor: DIVIDER,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
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
          <Lucide name="chevron-left" size={scale(18)} color={colors.Others.white} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: scale(10),
              fontWeight: '700',
              color: TEXT_FAINT,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Compete
          </Text>
          <Text
            style={{
              fontSize: scale(15),
              fontWeight: '900',
              color: colors.Others.white,
              marginTop: scale(2),
              letterSpacing: -0.3,
            }}
          >
            Leaderboard
          </Text>
        </View>
        <View
          style={{
            width: scale(36),
            height: scale(36),
            borderRadius: scale(18),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: SURFACE_BORDER,
            backgroundColor: SURFACE,
          }}
        >
          <Lucide name="trophy" size={scale(16)} color={GOLD} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: scale(16),
          paddingTop: scale(16),
          paddingBottom: scale(40),
        }}
      >
        <RangeTabs active={range} onChange={setRange} />

        <Podium top3={top3} />

        <MyRankCard rank={myRank} total={ranked.length} me={me} />

        {/* Section header */}
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
              color: TEXT_FAINT,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            Rankings
          </Text>
          <Text style={{ fontSize: scale(10), color: TEXT_DIM, fontWeight: '700' }}>
            {ranked.length} builders
          </Text>
        </View>

        <View
          style={{
            backgroundColor: SURFACE,
            borderRadius: scale(16),
            borderWidth: 1,
            borderColor: SURFACE_BORDER,
            overflow: 'hidden',
          }}
        >
          {rest.map((b, i) => (
            <RankRow
              key={b.id}
              builder={b}
              rank={i + 4}
              isLast={i === rest.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderboardScreen;
