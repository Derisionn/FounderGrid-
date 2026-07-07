import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Lucide } from '@react-native-vector-icons/lucide';
import { scale } from '../../helpers/scaler';
import { colors } from '../../styles/colors';
import { avatarFor } from '../../helpers/avatars';
import { Post } from '../../helpers/types';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const SURFACE = colors.Dark.surface;
const SURFACE_BORDER = colors.Dark.border;
const TEXT_DIM = colors.Dark.textDim;
const TEXT_FAINT = colors.Dark.textTrace;
const STREAK_ORANGE = colors.Accent.streak;
const WHITE = colors.Others.white;

// A post counts as "today" when its relative timestamp is in minutes/hours
// (or the literal "now"). Day-or-older stamps (e.g. "1d", "3d") are excluded.
// Once posts carry real `created_at` values this should compare against the
// user-local midnight instead of parsing the display string.
const isToday = (time: string): boolean => {
  const t = time.trim().toLowerCase();
  if (!t || t === 'now' || t === 'today') return true;
  return /^\d+\s*(m|h|min|mins|hr|hrs)$/.test(t);
};

type Props = {
  posts: Post[];
  /** When true, only surface builders the user follows. Defaults to true. */
  followingOnly?: boolean;
};

/**
 * "Today" lens — a horizontal rail of progress posts shipped today by the
 * builders you follow. A story-shaped answer to "what did people ship today?"
 * that sits above the chronological feed (see UNIQUE_FEATURES.md, feature 1c).
 */
const TodayLens = ({ posts, followingOnly = true }: Props) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const todays = useMemo(() => {
    const todayPosts = posts.filter(p => isToday(p.time));
    if (!followingOnly) return todayPosts;
    const followed = todayPosts.filter(p => p.followed);
    // Fall back to everyone's posts when you don't follow anyone shipping today,
    // so the rail never renders empty for a brand-new account.
    return followed.length >= 2 ? followed : todayPosts;
  }, [posts, followingOnly]);

  if (todays.length === 0) return null;

  return (
    <View style={{ paddingTop: scale(16), paddingBottom: scale(4) }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: scale(20),
          marginBottom: scale(12),
        }}
      >
        <View
          style={{
            width: scale(26),
            height: scale(26),
            borderRadius: scale(8),
            backgroundColor: colors.Accent.streakGlowStrong,
            borderWidth: 1,
            borderColor: colors.Accent.streakBorder,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: scale(8),
          }}
        >
          <Lucide name="sunrise" size={scale(14)} color={STREAK_ORANGE} />
        </View>
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
          Shipped today
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: SURFACE,
            borderRadius: scale(20),
            paddingVertical: scale(3),
            paddingHorizontal: scale(9),
          }}
        >
          <Lucide
            name="zap"
            size={scale(10)}
            color={STREAK_ORANGE}
            style={{ marginRight: scale(4) }}
          />
          <Text
            style={{ fontSize: scale(10), color: TEXT_FAINT, fontWeight: '700' }}
          >
            {todays.length} update{todays.length === 1 ? '' : 's'}
          </Text>
        </View>
      </View>

      {/* Rail */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: scale(16),
          paddingBottom: scale(4),
        }}
      >
        {todays.map(post => {
          const moodColor = post.mood.color;
          return (
            <TouchableOpacity
              key={post.id}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('Comments', { postId: post.id })
              }
              style={{
                width: scale(220),
                backgroundColor: SURFACE,
                borderRadius: scale(16),
                borderWidth: 1,
                borderColor: SURFACE_BORDER,
                padding: scale(14),
                marginRight: scale(12),
              }}
            >
              {/* Author row */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: scale(10),
                }}
              >
                <View
                  style={{
                    width: scale(40),
                    height: scale(40),
                    borderRadius: scale(20),
                    borderWidth: 2,
                    borderColor: moodColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={avatarFor(post.author.username || post.author.name)}
                    style={{
                      width: scale(32),
                      height: scale(32),
                      borderRadius: scale(16),
                    }}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: scale(10) }}>
                  <Text
                    style={{
                      fontSize: scale(13),
                      fontWeight: '800',
                      color: WHITE,
                    }}
                    numberOfLines={1}
                  >
                    {post.author.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: scale(2),
                    }}
                  >
                    <Text style={{ fontSize: scale(11), marginRight: scale(3) }}>
                      {post.project.emoji}
                    </Text>
                    <Text
                      style={{
                        fontSize: scale(11),
                        color: TEXT_DIM,
                        fontWeight: '600',
                      }}
                      numberOfLines={1}
                    >
                      {post.project.name}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mood pill */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  backgroundColor: `${moodColor}1A`,
                  borderWidth: 1,
                  borderColor: `${moodColor}40`,
                  borderRadius: scale(10),
                  paddingVertical: scale(3),
                  paddingHorizontal: scale(8),
                  marginBottom: scale(8),
                }}
              >
                <Lucide
                  name={post.mood.icon as any}
                  size={scale(11)}
                  color={moodColor}
                  style={{ marginRight: scale(5) }}
                />
                <Text
                  style={{
                    fontSize: scale(10),
                    fontWeight: '800',
                    color: moodColor,
                  }}
                >
                  {post.mood.label}
                </Text>
              </View>

              {/* Snippet */}
              <Text
                style={{
                  fontSize: scale(12),
                  lineHeight: scale(17),
                  color: colors.Dark.textTertiary2,
                }}
                numberOfLines={3}
              >
                {post.text}
              </Text>

              {/* Footer */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: scale(12),
                  paddingTop: scale(10),
                  borderTopWidth: 1,
                  borderTopColor: colors.Dark.divider,
                }}
              >
                <Lucide name="clock" size={scale(11)} color={TEXT_FAINT} />
                <Text
                  style={{
                    fontSize: scale(10),
                    color: TEXT_FAINT,
                    fontWeight: '600',
                    marginLeft: scale(4),
                    flex: 1,
                  }}
                >
                  {post.time} ago
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.Accent.streakGlow,
                    borderRadius: scale(20),
                    paddingVertical: scale(2),
                    paddingHorizontal: scale(7),
                    borderWidth: 1,
                    borderColor: colors.Accent.streakBorder,
                  }}
                >
                  <Lucide name="flame" size={scale(10)} color={STREAK_ORANGE} />
                  <Text
                    style={{
                      fontSize: scale(10),
                      fontWeight: '900',
                      color: STREAK_ORANGE,
                      marginLeft: scale(3),
                    }}
                  >
                    {post.author.streak}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TodayLens;
