import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { Lucide } from '@react-native-vector-icons/lucide';
import { scale } from '../../helpers/scaler';
import { colors } from '../../styles/colors';
import { avatarFor, ME_AVATAR } from '../../helpers/avatars';
import { COMMENTS, POST_PREVIEW, Comment } from '../../data/mockComments';



// ─── Constants ────────────────────────────────────────────────────────────────
const BG = colors.Dark.bg;
const ACCENT = colors.Accent.blue;
const SURFACE = colors.Dark.surface;
const SURFACE_BORDER = colors.Dark.border;
const DIVIDER = colors.Dark.divider;
const TEXT_DIM = colors.Dark.textDim;
const TEXT_FAINT = colors.Dark.textTrace;
const DANGER = colors.Accent.danger;

type SortId = 'top' | 'newest';

// ─── Comment item ─────────────────────────────────────────────────────────────
const CommentItem = ({
  comment,
  depth,
  onReply,
  onToggleLike,
}: {
  comment: Comment;
  depth: number;
  onReply: (target: Comment) => void;
  onToggleLike: (id: string) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const replies = comment.replies ?? [];
  const hasReplies = replies.length > 0;
  // Cap visual indent so deeply-nested threads don't squish on small phones.
  const indent = Math.min(depth, 3) * scale(28);

  return (
    <View style={{ marginLeft: indent, marginTop: scale(14) }}>
      <View style={{ flexDirection: 'row' }}>
        {/* Spine + avatar column */}
        <View style={{ width: scale(36), alignItems: 'center' }}>
          <Image
            source={avatarFor(comment.authorId)}
            style={{
              width: scale(32),
              height: scale(32),
              borderRadius: scale(16),
              borderWidth: 1.5,
              borderColor: depth === 0 ? SURFACE_BORDER : colors.Dark.borderSubtle,
            }}
          />
          {hasReplies && !collapsed && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setCollapsed(true);
              }}
              style={{
                flex: 1,
                width: 2,
                backgroundColor: colors.Dark.surfaceRaised,
                marginTop: scale(4),
                marginBottom: scale(4),
              }}
            />
          )}
        </View>

        {/* Body */}
        <View style={{ flex: 1, marginLeft: scale(8) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text
              style={{
                fontSize: scale(13),
                fontWeight: '800',
                color: colors.Others.white,
                letterSpacing: -0.2,
              }}
            >
              {comment.authorName}
            </Text>
            <Text
              style={{
                fontSize: scale(11),
                color: TEXT_DIM,
                marginLeft: scale(6),
                fontWeight: '600',
              }}
            >
              {comment.username}
            </Text>
            <Text style={{ fontSize: scale(10), color: TEXT_FAINT, marginHorizontal: scale(5) }}>
              ·
            </Text>
            <Text style={{ fontSize: scale(10), color: TEXT_FAINT, fontWeight: '700' }}>
              {comment.time}
            </Text>
            {comment.pinned && (
              <View
                style={{
                  marginLeft: scale(6),
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.Accent.blueGlow,
                  borderRadius: scale(8),
                  paddingHorizontal: scale(6),
                  paddingVertical: scale(2),
                  borderWidth: 1,
                  borderColor: colors.Accent.blueBorder,
                }}
              >
                <Lucide name="pin" size={scale(9)} color={ACCENT} />
                <Text
                  style={{
                    fontSize: scale(9),
                    fontWeight: '800',
                    color: ACCENT,
                    marginLeft: scale(3),
                    letterSpacing: 0.3,
                  }}
                >
                  PINNED
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              fontSize: scale(13),
              color: colors.Dark.textSecondary,
              lineHeight: scale(19),
              marginTop: scale(4),
            }}
          >
            {comment.text}
          </Text>

          {/* Action row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: scale(8),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onToggleLike(comment.id)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: scale(16) }}
            >
              <Lucide
                name="heart"
                size={scale(13)}
                color={comment.liked ? DANGER : TEXT_DIM}
              />
              <Text
                style={{
                  fontSize: scale(11),
                  fontWeight: '700',
                  color: comment.liked ? DANGER : TEXT_DIM,
                  marginLeft: scale(5),
                }}
              >
                {comment.likes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onReply(comment)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: scale(16) }}
            >
              <Lucide name="reply" size={scale(13)} color={TEXT_DIM} />
              <Text
                style={{
                  fontSize: scale(11),
                  fontWeight: '700',
                  color: TEXT_DIM,
                  marginLeft: scale(5),
                }}
              >
                Reply
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Lucide name="more-horizontal" size={scale(14)} color={TEXT_FAINT} />
            </TouchableOpacity>
          </View>

          {/* Collapsed indicator */}
          {hasReplies && collapsed && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setCollapsed(false);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: scale(10),
                paddingVertical: scale(4),
              }}
            >
              <View
                style={{
                  width: scale(20),
                  height: 1.5,
                  backgroundColor: colors.Dark.surfaceRaised,
                  marginRight: scale(8),
                }}
              />
              <Text
                style={{
                  fontSize: scale(11),
                  fontWeight: '800',
                  color: ACCENT,
                  letterSpacing: 0.2,
                }}
              >
                View {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Nested replies */}
      {hasReplies && !collapsed && (
        <View>
          {replies.map(r => (
            <CommentItem
              key={r.id}
              comment={r}
              depth={depth + 1}
              onReply={onReply}
              onToggleLike={onToggleLike}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Helpers: recursive tree ops ──────────────────────────────────────────────
const toggleLikeIn = (list: Comment[], id: string): Comment[] =>
  list.map(c => {
    if (c.id === id) {
      const wasLiked = !!c.liked;
      return { ...c, liked: !wasLiked, likes: c.likes + (wasLiked ? -1 : 1) };
    }
    if (c.replies?.length) {
      return { ...c, replies: toggleLikeIn(c.replies, id) };
    }
    return c;
  });

const appendReplyIn = (list: Comment[], parentId: string, reply: Comment): Comment[] =>
  list.map(c => {
    if (c.id === parentId) {
      return { ...c, replies: [...(c.replies ?? []), reply] };
    }
    if (c.replies?.length) {
      return { ...c, replies: appendReplyIn(c.replies, parentId, reply) };
    }
    return c;
  });

const sortComments = (list: Comment[], sort: SortId): Comment[] => {
  if (sort === 'top') {
    return [...list]
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.likes - a.likes;
      })
      .map(c => ({ ...c, replies: c.replies ? sortComments(c.replies, sort) : c.replies }));
  }
  // newest — best-effort using string parse of "Xm/h/d"
  const rank = (t: string) => {
    const m = t.match(/(\d+)(m|h|d|w)/);
    if (!m) return 0;
    const n = Number(m[1]);
    const mult = m[2] === 'm' ? 1 : m[2] === 'h' ? 60 : m[2] === 'd' ? 60 * 24 : 60 * 24 * 7;
    return n * mult;
  };
  return [...list]
    .sort((a, b) => rank(a.time) - rank(b.time))
    .map(c => ({ ...c, replies: c.replies ? sortComments(c.replies, sort) : c.replies }));
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const CommentsScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [comments, setComments] = useState<Comment[]>(COMMENTS);
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [sort, setSort] = useState<SortId>('top');
  const inputRef = useRef<TextInput>(null);

  const visible = useMemo(() => sortComments(comments, sort), [comments, sort]);

  const totalCount = useMemo(() => {
    const count = (list: Comment[]): number =>
      list.reduce((sum, c) => sum + 1 + (c.replies ? count(c.replies) : 0), 0);
    return count(comments);
  }, [comments]);

  const onToggleLike = useCallback(
    (id: string) => setComments(prev => toggleLikeIn(prev, id)),
    [],
  );

  const onReply = useCallback((target: Comment) => {
    setReplyTo(target);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const cancelReply = () => setReplyTo(null);

  const onSend = () => {
    const text = draft.trim();
    if (!text) return;
    const newComment: Comment = {
      id: `local-${Date.now()}`,
      authorId: 'me',
      authorName: 'Anmol Singh',
      username: '@anmol',
      text,
      time: 'now',
      likes: 0,
    };
    setComments(prev =>
      replyTo ? appendReplyIn(prev, replyTo.id, newComment) : [...prev, newComment],
    );
    setDraft('');
    setReplyTo(null);
  };

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
            Discussion
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
            {totalCount} {totalCount === 1 ? 'comment' : 'comments'}
          </Text>
        </View>
        <View style={{ width: scale(36) }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: scale(12) }}
        >
          {/* Post preview card */}
          <View
            style={{
              backgroundColor: SURFACE,
              borderRadius: scale(16),
              borderWidth: 1,
              borderColor: SURFACE_BORDER,
              padding: scale(12),
              marginHorizontal: scale(16),
              marginTop: scale(14),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={avatarFor(POST_PREVIEW.authorSeed)}
                style={{
                  width: scale(36),
                  height: scale(36),
                  borderRadius: scale(18),
                  borderWidth: 1.5,
                  borderColor: SURFACE_BORDER,
                  marginRight: scale(10),
                }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: scale(13),
                    fontWeight: '800',
                    color: colors.Others.white,
                    letterSpacing: -0.2,
                  }}
                >
                  {POST_PREVIEW.authorName}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(2) }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.Accent.blueGlow,
                      borderRadius: scale(8),
                      paddingHorizontal: scale(6),
                      paddingVertical: scale(1),
                      borderWidth: 1,
                      borderColor: colors.Accent.blueBorder,
                    }}
                  >
                    <View
                      style={{
                        width: scale(5),
                        height: scale(5),
                        borderRadius: scale(2.5),
                        backgroundColor: ACCENT,
                        marginRight: scale(4),
                      }}
                    />
                    <Text
                      style={{
                        fontSize: scale(9),
                        fontWeight: '800',
                        color: ACCENT,
                        letterSpacing: 0.3,
                      }}
                    >
                      {POST_PREVIEW.project}
                    </Text>
                  </View>
                  <Text style={{ fontSize: scale(10), color: TEXT_FAINT, marginLeft: scale(8) }}>
                    {POST_PREVIEW.time}
                  </Text>
                </View>
              </View>
            </View>
            <Text
              numberOfLines={3}
              style={{
                fontSize: scale(13),
                color: colors.Dark.textSecondary,
                lineHeight: scale(19),
                marginTop: scale(10),
              }}
            >
              {POST_PREVIEW.text}
            </Text>
          </View>

          {/* Sort row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: scale(20),
              marginTop: scale(20),
              marginBottom: scale(4),
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
              Comments
            </Text>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: SURFACE,
                borderRadius: scale(20),
                padding: scale(3),
                borderWidth: 1,
                borderColor: SURFACE_BORDER,
              }}
            >
              {(['top', 'newest'] as SortId[]).map(id => {
                const active = sort === id;
                return (
                  <TouchableOpacity
                    key={id}
                    activeOpacity={0.85}
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setSort(id);
                    }}
                    style={{
                      paddingVertical: scale(5),
                      paddingHorizontal: scale(11),
                      borderRadius: scale(16),
                      backgroundColor: active ? ACCENT : colors.Others.transparent,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: scale(10),
                        fontWeight: '800',
                        color: active ? colors.Others.white : TEXT_DIM,
                        letterSpacing: 0.3,
                        textTransform: 'capitalize',
                      }}
                    >
                      {id}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Comments list */}
          <View style={{ paddingHorizontal: scale(16), paddingBottom: scale(8) }}>
            {visible.map(c => (
              <CommentItem
                key={c.id}
                comment={c}
                depth={0}
                onReply={onReply}
                onToggleLike={onToggleLike}
              />
            ))}
          </View>
        </ScrollView>

        {/* Replying-to banner */}
        {replyTo && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.Accent.blueGlow,
              borderTopWidth: 1,
              borderTopColor: colors.Accent.blueBorder,
              paddingHorizontal: scale(16),
              paddingVertical: scale(8),
            }}
          >
            <Lucide name="corner-down-right" size={scale(13)} color={ACCENT} />
            <Text
              style={{
                fontSize: scale(11),
                fontWeight: '700',
                color: ACCENT,
                marginLeft: scale(6),
                flex: 1,
              }}
              numberOfLines={1}
            >
              Replying to {replyTo.authorName}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={cancelReply}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Lucide name="x" size={scale(14)} color={ACCENT} />
            </TouchableOpacity>
          </View>
        )}

        {/* Composer */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: scale(12),
            paddingTop: scale(8),
            paddingBottom: scale(10),
            borderTopWidth: 1,
            borderTopColor: DIVIDER,
            backgroundColor: BG,
          }}
        >
          <Image
            source={ME_AVATAR}
            style={{
              width: scale(32),
              height: scale(32),
              borderRadius: scale(16),
              borderWidth: 1.5,
              borderColor: `${ACCENT}50`,
              marginRight: scale(8),
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
              backgroundColor: SURFACE,
              borderRadius: scale(20),
              borderWidth: 1,
              borderColor: SURFACE_BORDER,
              paddingHorizontal: scale(14),
              paddingVertical: Platform.OS === 'ios' ? scale(8) : scale(2),
              minHeight: scale(38),
            }}
          >
            <TextInput
              ref={inputRef}
              value={draft}
              onChangeText={setDraft}
              placeholder={replyTo ? `Reply to ${replyTo.authorName}…` : 'Add a comment…'}
              placeholderTextColor={TEXT_FAINT}
              multiline
              style={{
                flex: 1,
                fontSize: scale(13),
                color: colors.Others.white,
                maxHeight: scale(120),
                paddingTop: 0,
                paddingBottom: 0,
              }}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSend}
            disabled={!draft.trim()}
            style={{
              width: scale(38),
              height: scale(38),
              borderRadius: scale(19),
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: scale(8),
              backgroundColor: draft.trim() ? ACCENT : colors.Accent.blueDisabled,
              shadowColor: ACCENT,
              shadowOpacity: draft.trim() ? 0.45 : 0,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Lucide name="send" size={scale(15)} color={colors.Others.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommentsScreen;
