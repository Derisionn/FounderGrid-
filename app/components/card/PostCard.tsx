import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Post } from '../../helpers/types';
import { scale } from '../../helpers/scaler';
import { colors } from '../../styles/colors';
import { avatarFor } from '../../helpers/avatars';
import Lucide from '@react-native-vector-icons/lucide';
import HeartIcon from '../../../assets/icons/HeartIcon';
import { StreakChip } from '../home/StreakChip';

const PostCard = ({ post }: { post: Post }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [liked, setLiked] = useState(!!post.liked);
  const [saved, setSaved] = useState(!!post.saved);
  const [followed, setFollowed] = useState(!!post.followed);
  const lastTap = useRef<number>(0);
  const heart = useRef(new Animated.Value(0)).current;
  const likeBounce = useRef(new Animated.Value(1)).current;

  const animateHeart = () => {
    heart.setValue(0);
    Animated.sequence([
      Animated.timing(heart, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.delay(280),
      Animated.timing(heart, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateLikeButton = () => {
    Animated.sequence([
      Animated.timing(likeBounce, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(likeBounce, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLikePress = () => {
    setLiked(l => !l);
    animateLikeButton();
  };

  const handleCardTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      if (!liked) {
        setLiked(true);
        animateLikeButton();
      }
      animateHeart();
    }
    lastTap.current = now;
  };

  const heartScale = heart.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.4],
  });
  const heartOpacity = heart.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <View
      style={{
        backgroundColor: colors.Dark.surface,
        borderRadius: scale(18),
        marginHorizontal: scale(16),
        marginBottom: scale(12),
        borderWidth: 1,
        borderColor: colors.Dark.border,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: scale(2),
          backgroundColor: post.mood.color,
          opacity: 0.6,
        }}
      />

      <View style={{ padding: scale(14) }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: scale(10),
          }}
        >
          {/* Avatar with streak ring */}
          <View
            style={{
              width: scale(44),
              height: scale(44),
              borderRadius: scale(22),
              borderWidth: 2,
              borderColor: colors.Accent.streak,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: scale(10),
            }}
          >
            <Image
              source={avatarFor(post.id)}
              style={{
                width: scale(36),
                height: scale(36),
                borderRadius: scale(18),
              }}
            />
          </View>
          {/* Name + meta */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: scale(6),
              }}
            >
              <Text
                style={{
                  fontSize: scale(13),
                  fontWeight: '800',
                  color: colors.Others.white,
                  letterSpacing: -0.2,
                }}
              >
                {post.author.name}
              </Text>
              <StreakChip streak={post.author.streak} compact />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: scale(2),
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Lucide
                  name="folder"
                  size={scale(11)}
                  color={post.project.accent}
                  style={{ marginRight: scale(4) }}
                />
                <Text
                  style={{
                    fontSize: scale(11),
                    color: post.project.accent,
                    fontWeight: '700',
                  }}
                >
                  {post.project.name}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: scale(11),
                  color: colors.Dark.textTrace,
                  marginHorizontal: scale(5),
                }}
              >
                ·
              </Text>
              <Text
                style={{
                  fontSize: scale(11),
                  color: colors.Dark.textTrace,
                  fontWeight: '500',
                }}
              >
                {post.time}
              </Text>
            </View>
          </View>
          {/* Mood chip */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: `${post.mood.color}18`,
              borderRadius: scale(20),
              paddingVertical: scale(4),
              paddingHorizontal: scale(8),
              borderWidth: 1,
              borderColor: `${post.mood.color}40`,
            }}
          >
            <Lucide
              name={post.mood.icon as any}
              size={scale(10)}
              color={post.mood.color}
              style={{ marginRight: scale(3) }}
            />
            <Text
              style={{
                fontSize: scale(10),
                fontWeight: '800',
                color: post.mood.color,
                letterSpacing: 0.3,
              }}
            >
              {post.mood.label}
            </Text>
          </View>
        </View>

        {/* Body — double-tap to like */}
        <TouchableWithoutFeedback onPress={handleCardTap}>
          <View>
            <Text
              style={{
                fontSize: scale(14),
                color: colors.Dark.textHi,
                lineHeight: scale(21),
                marginBottom: scale(10),
              }}
            >
              {post.text}
            </Text>

            {/* Image */}
            {post.hasImage && (
              <View
                style={{
                  height: scale(170),
                  backgroundColor: `${post.project.accent}15`,
                  borderRadius: scale(14),
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: scale(10),
                  borderWidth: 1,
                  borderColor: `${post.project.accent}30`,
                  overflow: 'hidden',
                }}
              >
                {post.image ? (
                  <Image
                    source={post.image}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <Lucide
                    name="image"
                    size={scale(34)}
                    color={post.project.accent}
                  />
                )}
                {/* Floating heart on double-tap */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    opacity: heartOpacity,
                    transform: [{ scale: heartScale }],
                  }}
                >
                  <HeartIcon width={scale(72)} height={scale(72)} color={colors.Accent.danger} />
                </Animated.View>
              </View>
            )}

            {/* Stack tags */}
            {post.stack.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: scale(4),
                }}
              >
                {post.stack.map(s => (
                  <View
                    key={s}
                    style={{
                      backgroundColor: colors.Dark.surfaceMuted,
                      borderRadius: scale(20),
                      paddingVertical: scale(3),
                      paddingHorizontal: scale(9),
                      marginRight: scale(6),
                      marginBottom: scale(4),
                      borderWidth: 1,
                      borderColor: colors.Dark.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: scale(10),
                        color: colors.Dark.textDim,
                        fontWeight: '700',
                      }}
                    >
                      #{s}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: colors.Dark.borderMuted,
            marginTop: scale(8),
            marginBottom: scale(10),
          }}
        />

        {/* Action row */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Animated.View style={{ transform: [{ scale: likeBounce }] }}>
            <TouchableOpacity
              onPress={handleLikePress}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: scale(18),
              }}
            >
              <View style={{ marginRight: scale(5) }}>
                <HeartIcon
                  width={scale(16)}
                  height={scale(16)}
                  color={liked ? colors.Accent.danger : colors.Dark.textDim}
                />
              </View>
              <Text
                style={{
                  fontSize: scale(12),
                  fontWeight: '700',
                  color: liked ? colors.Accent.danger : colors.Dark.textDim,
                }}
              >
                {post.likes + (liked ? 1 : 0)}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Comments', { postId: post.id })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: scale(18),
            }}
          >
            <Lucide
              name="message-circle"
              size={scale(15)}
              color={colors.Dark.textDim}
              style={{ marginRight: scale(5) }}
            />
            <Text
              style={{
                fontSize: scale(12),
                fontWeight: '700',
                color: colors.Dark.textDim,
              }}
            >
              {post.comments}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Lucide name="send" size={scale(15)} color={colors.Dark.textDim} />
          </TouchableOpacity>
          {/* Follow */}
          {post.followed === false && (
            <TouchableOpacity
              onPress={() => setFollowed(f => !f)}
              activeOpacity={0.85}
              style={{
                marginLeft: scale(12),
                backgroundColor: followed ? colors.Dark.surface : colors.Accent.blue,
                borderRadius: scale(20),
                paddingVertical: scale(5),
                paddingHorizontal: scale(11),
                borderWidth: 1,
                borderColor: followed ? colors.Dark.border : colors.Accent.blue,
              }}
            >
              <Text
                style={{
                  fontSize: scale(11),
                  fontWeight: '800',
                  color: followed ? colors.Dark.textDim : colors.Others.white,
                }}
              >
                {followed ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setSaved(s => !s)}
            activeOpacity={0.7}
            style={{ marginLeft: 'auto' }}
          >
            <Lucide
              name="bookmark"
              size={scale(15)}
              color={saved ? colors.Accent.blue : colors.Dark.textDim}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
