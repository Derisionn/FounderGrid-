import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { scale } from '../../helpers/scaler';
import { useTabBarSpace } from '../../components/navigation/CustomTabBar';
import { supabase } from '../../lib/supabase';
import { colors } from '../../styles/colors';
import { avatarFor, ME_AVATAR } from '../../helpers/avatars';
import { MOCK_POSTS } from '../../data/mockPosts';

import { Lucide } from '@react-native-vector-icons/lucide';
import { FeedItem, Mood, Post } from '../../helpers/types';
import {
  LAUNCHED,
  SUGGESTED,
  TRENDING_STREAKS,
} from '../../../assets/staticData/staticData';
import PostCard from '../../components/card/PostCard';
import TodayLens from '../../components/home/TodayLens';

// ─── Constants ────────────────────────────────────────────────────────────────
const BG = colors.Dark.bg;
const ACCENT = colors.Accent.blue;
const SURFACE = colors.Dark.surface;
const SURFACE_BORDER = colors.Dark.border;
const TEXT_DIM = colors.Dark.textDim;
const TEXT_FAINT = colors.Dark.textTrace;
const STREAK_ORANGE = colors.Accent.streak;

// ─── Mood config ──────────────────────────────────────────────────────────────
const MOODS: Record<string, Mood> = {
  productive: {
    id: 'productive',
    emoji: '⚡',
    icon: 'zap',
    label: 'Productive',
    color: colors.Accent.streakAmber,
  },
  shipping: {
    id: 'shipping',
    emoji: '🚢',
    icon: 'ship',
    label: 'Shipping',
    color: colors.Accent.shippingGreen,
  },
  learning: {
    id: 'learning',
    emoji: '📚',
    icon: 'book-open',
    label: 'Learning',
    color: ACCENT,
  },
  struggling: {
    id: 'struggling',
    emoji: '🌧️',
    icon: 'cloud-rain',
    label: 'Struggling',
    color: colors.Accent.danger,
  },
};

// ─── Current user (mock until auth lands) ─────────────────────────────────────
const ME = { initials: 'AS', name: 'Anmol', streak: 7, postedToday: false };

// ─── DB row → Post transformer ────────────────────────────────────────────────
// Tolerant to missing columns on profiles/projects so the UI stays renderable
// before all schema fields are populated.
const initialsFrom = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('') || '·';

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
};

// Deterministic accent picker — keeps each builder visually distinct without
// requiring an `accent_color` column on profiles.
const ACCENT_PALETTE = [
  ACCENT,
  colors.Accent.danger,
  colors.Accent.violet,
  colors.Accent.green,
  colors.Accent.streak,
  colors.Accent.shippingGreen,
];
const accentFor = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) % 2147483647;
  }
  return ACCENT_PALETTE[h % ACCENT_PALETTE.length];
};

const mapRowToPost = (row: any): Post => {
  const profile = row.profiles ?? {};
  const project = row.projects ?? {};
  const moodId = row.mood ?? 'productive';
  const displayName =
    profile.full_name ?? profile.username ?? 'Unknown builder';
  const userSeed = String(profile.id ?? row.user_id ?? displayName);
  return {
    id: String(row.id),
    author: {
      initials: initialsFrom(displayName),
      name: displayName,
      username: profile.username ? `@${profile.username}` : '',
      accent: accentFor(userSeed),
      streak: profile.current_streak ?? 0,
    },
    project: {
      name: project?.name ?? 'Untitled',
      emoji: '🚀',
      accent: accentFor(String(project?.id ?? userSeed)),
    },
    time: row.created_at ? relativeTime(row.created_at) : '',
    text: row.content ?? '',
    hasImage: !!row.has_image,
    stack: Array.isArray(row.tags) ? row.tags : [],
    mood: MOODS[moodId] ?? MOODS.productive,
    likes: 0,
    comments: 0,
  };
};

// Interleave community modules every few posts so the feed stays varied.
const buildFeed = (posts: Post[]): FeedItem[] => {
  const out: FeedItem[] = [];
  posts.forEach((p, i) => {
    out.push({ kind: 'post', data: p });
    if (i === 1) out.push({ kind: 'celebration' });
    if (i === 2) out.push({ kind: 'suggested' });
    if (i === 3) out.push({ kind: 'launched' });
  });
  return out;
};

// ─── Streak chip ──────────────────────────────────────────────────────────────

// ─── Trending streaks rail ────────────────────────────────────────────────────
const TrendingStreaksRail = () => (
  <View style={{ paddingTop: scale(16), paddingBottom: scale(8) }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(20),
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
        Shipping today
      </Text>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: scale(20) }}
    >
      {TRENDING_STREAKS.map(b => (
        <TouchableOpacity
          key={b.id}
          activeOpacity={0.8}
          style={{
            alignItems: 'center',
            marginRight: scale(14),
            width: scale(64),
          }}
        >
          <View
            style={{
              width: scale(58),
              height: scale(58),
              borderRadius: scale(29),
              borderWidth: 2.5,
              borderColor: b.accent,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: b.accent,
              shadowOpacity: 0.5,
              shadowRadius: 8,
            }}
          >
            <Image
              source={avatarFor(b.id)}
              style={{
                width: scale(50),
                height: scale(50),
                borderRadius: scale(25),
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -scale(4),
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.Dark.bg,
                borderRadius: scale(12),
                paddingHorizontal: scale(6),
                paddingVertical: scale(2),
                borderWidth: 1.5,
                borderColor: STREAK_ORANGE,
              }}
            >
              <Lucide name="flame" size={scale(9)} color={STREAK_ORANGE} />
              <Text
                style={{
                  fontSize: scale(9),
                  fontWeight: '900',
                  color: STREAK_ORANGE,
                  marginLeft: scale(2),
                }}
              >
                {b.streak}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: scale(10),
              color: colors.Dark.textTertiary2,
              marginTop: scale(10),
              fontWeight: '600',
            }}
            numberOfLines={1}
          >
            {b.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

// ─── Post card ────────────────────────────────────────────────────────────────

// ─── Inline community modules ─────────────────────────────────────────────────
const CelebrationBlock = () => (
  <View
    style={{
      marginHorizontal: scale(16),
      marginBottom: scale(12),
      backgroundColor: colors.Accent.streakGlowSubtle,
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: colors.Accent.streakBorderHover,
      padding: scale(14),
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <View
      style={{
        width: scale(44),
        height: scale(44),
        borderRadius: scale(14),
        backgroundColor: colors.Accent.streakGlowExtra,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(12),
      }}
    >
      <Lucide name="party-popper" size={scale(20)} color={STREAK_ORANGE} />
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: scale(13),
          fontWeight: '800',
          color: colors.Others.white,
        }}
      >
        5 builders just hit 30 days
      </Text>
      <Text
        style={{ fontSize: scale(11), color: TEXT_DIM, marginTop: scale(2) }}
      >
        You're 23 days away from joining them.
      </Text>
    </View>
  </View>
);

const SuggestedBuildersBlock = () => (
  <View style={{ marginBottom: scale(12) }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(20),
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
        Builders you might know
      </Text>
      <Text style={{ fontSize: scale(11), color: ACCENT, fontWeight: '700' }}>
        See all
      </Text>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: scale(16) }}
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
          <Text
            style={{
              fontSize: scale(12),
              fontWeight: '800',
              color: colors.Others.white,
            }}
            numberOfLines={1}
          >
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
            <Text
              style={{
                fontSize: scale(11),
                fontWeight: '800',
                color: colors.Others.white,
              }}
            >
              Follow
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  </View>
);

const LaunchedBlock = () => (
  <View
    style={{
      marginHorizontal: scale(16),
      marginBottom: scale(12),
      backgroundColor: SURFACE,
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: SURFACE_BORDER,
      padding: scale(14),
    }}
  >
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(10),
      }}
    >
      <Lucide
        name="rocket"
        size={scale(14)}
        color={TEXT_FAINT}
        style={{ marginRight: scale(6) }}
      />
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
        Recently launched
      </Text>
      <Text style={{ fontSize: scale(11), color: ACCENT, fontWeight: '700' }}>
        See all
      </Text>
    </View>
    {LAUNCHED.map((l, i) => (
      <TouchableOpacity
        key={l.id}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: scale(10),
          borderTopWidth: i === 0 ? 0 : 1,
          borderTopColor: colors.Dark.divider,
        }}
      >
        <View
          style={{
            width: scale(36),
            height: scale(36),
            borderRadius: scale(10),
            backgroundColor: `${l.accent}20`,
            borderWidth: 1,
            borderColor: `${l.accent}40`,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: scale(10),
          }}
        >
          <Lucide name="package" size={scale(16)} color={l.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: scale(13),
              fontWeight: '800',
              color: colors.Others.white,
            }}
          >
            {l.name}
          </Text>
          <Text
            style={{
              fontSize: scale(11),
              color: TEXT_DIM,
              marginTop: scale(1),
            }}
          >
            {l.tagline}
          </Text>
        </View>
        <Lucide name="chevron-right" size={scale(16)} color={TEXT_FAINT} />
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Empty state (kept for first-time users) ──────────────────────────────────
const EmptyState = () => (
  <View style={{ alignItems: 'center', padding: scale(40) }}>
    <Lucide
      name="sprout"
      size={scale(40)}
      color={colors.Accent.green}
      style={{ marginBottom: scale(12) }}
    />
    <Text
      style={{
        fontSize: scale(15),
        fontWeight: '800',
        color: colors.Others.white,
        marginBottom: scale(6),
      }}
    >
      Start documenting your journey
    </Text>
    <Text
      style={{
        fontSize: scale(12),
        color: TEXT_DIM,
        textAlign: 'center',
        lineHeight: scale(18),
      }}
    >
      Follow a few builders to fill your feed, or share your first update — even
      a one-liner is enough.
    </Text>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const tabBarSpace = useTabBarSpace();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(*), projects(*)')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error || !data || data.length === 0) {
        setPosts(MOCK_POSTS as unknown as Post[]);
        return;
      }
      setPosts(data.map(mapRowToPost));
    } catch {
      setPosts(MOCK_POSTS as unknown as Post[]);
    }
  }, []);

  useEffect(() => {
    fetchPosts().finally(() => setLoading(false));
  }, [fetchPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPosts(),
      new Promise<void>(r => setTimeout(() => r(), 700)),
    ]);
    setRefreshing(false);
  }, [fetchPosts]);

  const feed = useMemo(() => buildFeed(posts), [posts]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarSpace + scale(16) }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ACCENT}
            colors={[ACCENT]}
            progressBackgroundColor={SURFACE}
          />
        }
      >
        {/* <TopBar /> */}
        {/* <CreatePostPrompt /> */}

        {/* ── Home header (brand + leaderboard entry) ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(20),
            paddingTop: scale(10),
            paddingBottom: scale(6),
          }}
        >
          <Image
            source={ME_AVATAR}
            style={{
              width: scale(36),
              height: scale(36),
              borderRadius: scale(18),
              borderWidth: 1.5,
              borderColor: `${ACCENT}50`,
              marginRight: scale(10),
            }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: scale(10),
                fontWeight: '700',
                color: TEXT_FAINT,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Welcome back
            </Text>
            <Text
              style={{
                fontSize: scale(18),
                fontWeight: '900',
                color: colors.Others.white,
                letterSpacing: -0.5,
                marginTop: scale(2),
              }}
              numberOfLines={1}
            >
              {ME.name}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Leaderboard')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: scale(36),
              paddingHorizontal: scale(12),
              borderRadius: scale(18),
              borderWidth: 1,
              borderColor: colors.Accent.streakBorder,
              backgroundColor: colors.Accent.streakGlowStrong,
            }}
          >
            <Lucide name="trophy" size={scale(14)} color={STREAK_ORANGE} />
            {/* <Text
              style={{
                fontSize: scale(11),
                fontWeight: '800',
                color: STREAK_ORANGE,
                marginLeft: scale(6),
                letterSpacing: 0.3,
              }}
            >
              Leaderboard
            </Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Inbox')}
            style={{
              width: scale(36),
              height: scale(36),
              borderRadius: scale(18),
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: SURFACE_BORDER,
              backgroundColor: SURFACE,
              marginLeft: scale(10),
            }}
          >
            <Lucide
              name="message-circle"
              size={scale(16)}
              color={colors.Others.white}
            />
            <View
              style={{
                position: 'absolute',
                top: scale(7),
                right: scale(8),
                width: scale(9),
                height: scale(9),
                borderRadius: scale(4.5),
                backgroundColor: colors.Accent.danger,
                borderWidth: 1.5,
                borderColor: BG,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* {!ME.postedToday && <StreakRiskBanner />} */}
        <TrendingStreaksRail />

        {/* ── "Today" lens: what the builders you follow shipped today ── */}
        {!loading && <TodayLens posts={posts} />}

        {/* Section label */}
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(20),
            marginTop: scale(8),
            marginBottom: scale(12),
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
            Your feed
          </Text>
          <View
            style={{
              backgroundColor: SURFACE,
              borderRadius: scale(20),
              paddingVertical: scale(3),
              paddingHorizontal: scale(9),
            }}
          >
            <Text
              style={{
                fontSize: scale(10),
                color: TEXT_FAINT,
                fontWeight: '700',
              }}
            >
              {posts.length} updates
            </Text>
          </View>
        </View> */}

        {loading ? (
          <View style={{ paddingVertical: scale(60), alignItems: 'center' }}>
            <ActivityIndicator color={ACCENT} />
          </View>
        ) : fetchError ? (
          <View
            style={{
              paddingHorizontal: scale(20),
              paddingVertical: scale(40),
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: scale(13),
                color: colors.Accent.danger,
                fontWeight: '700',
                marginBottom: scale(6),
              }}
            >
              Couldn't load the feed
            </Text>
            <Text
              style={{
                fontSize: scale(11),
                color: TEXT_DIM,
                textAlign: 'center',
              }}
            >
              {fetchError}
            </Text>
          </View>
        ) : feed.length === 0 ? (
          <EmptyState />
        ) : (
          feed.map((item, i) => {
            switch (item.kind) {
              case 'post':
                return <PostCard key={item.data.id} post={item.data} />;
              case 'celebration':
                return <CelebrationBlock key={`c-${i}`} />;
              case 'suggested':
                return <SuggestedBuildersBlock key={`s-${i}`} />;
              case 'launched':
                return <LaunchedBlock key={`l-${i}`} />;
            }
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
