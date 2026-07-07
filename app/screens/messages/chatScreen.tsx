import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Lucide } from '@react-native-vector-icons/lucide';
import { scale } from '../../helpers/scaler';
import { colors } from '../../styles/colors';
import { avatarFor } from '../../helpers/avatars';
import { CONVERSATIONS, THREADS, Message } from '../../data/mockMessages';

// ─── Constants ────────────────────────────────────────────────────────────────
const BG = colors.Dark.bg;
const ACCENT = colors.Accent.blue;
const SURFACE = colors.Dark.surface;
const SURFACE_BORDER = colors.Dark.border;
const DIVIDER = colors.Dark.divider;
const TEXT_DIM = colors.Dark.textDim;
const TEXT_FAINT = colors.Dark.textTrace;
const ONLINE = colors.Accent.green;

// ─── Time helpers ─────────────────────────────────────────────────────────────
const ANCHOR_NOW = new Date('2026-05-12T16:30:00').getTime();

const formatTime = (iso: string) => {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const dayLabel = (iso: string) => {
  const date = new Date(iso);
  const todayKey = new Date(ANCHOR_NOW).toDateString();
  const yKey = new Date(ANCHOR_NOW - 24 * 60 * 60 * 1000).toDateString();
  const key = date.toDateString();
  if (key === todayKey) return 'Today';
  if (key === yKey) return 'Yesterday';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === new Date(ANCHOR_NOW).getFullYear() ? undefined : 'numeric',
  });
};

// ─── Day separator pill ───────────────────────────────────────────────────────
const DaySeparator = ({ label }: { label: string }) => (
  <View
    style={{
      alignItems: 'center',
      marginVertical: scale(12),
    }}
  >
    <View
      style={{
        backgroundColor: SURFACE,
        borderRadius: scale(12),
        paddingHorizontal: scale(12),
        paddingVertical: scale(4),
        borderWidth: 1,
        borderColor: SURFACE_BORDER,
      }}
    >
      <Text
        style={{
          fontSize: scale(10),
          fontWeight: '800',
          color: TEXT_DIM,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  </View>
);

// ─── Message bubble ───────────────────────────────────────────────────────────
const Bubble = ({
  message,
  isFirstInGroup,
  isLastInGroup,
  showSeen,
}: {
  message: Message;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  showSeen: boolean;
}) => {
  const mine = message.fromMe;
  const radiusLarge = scale(18);
  const radiusTail = scale(4);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: mine ? 'flex-end' : 'flex-start',
        marginTop: isFirstInGroup ? scale(10) : scale(2),
        paddingHorizontal: scale(16),
      }}
    >
      <View style={{ maxWidth: '78%' }}>
        <View
          style={{
            backgroundColor: mine ? ACCENT : SURFACE,
            borderWidth: mine ? 0 : 1,
            borderColor: SURFACE_BORDER,
            paddingHorizontal: scale(12),
            paddingVertical: scale(8),
            borderTopLeftRadius: mine ? radiusLarge : isFirstInGroup ? radiusLarge : radiusTail,
            borderTopRightRadius: mine ? (isFirstInGroup ? radiusLarge : radiusTail) : radiusLarge,
            borderBottomLeftRadius: mine ? radiusLarge : isLastInGroup ? radiusTail : radiusLarge,
            borderBottomRightRadius: mine ? (isLastInGroup ? radiusTail : radiusLarge) : radiusLarge,
            shadowColor: mine ? ACCENT : colors.Others.shadow,
            shadowOpacity: mine ? 0.25 : 0,
            shadowRadius: mine ? 8 : 0,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            style={{
              fontSize: scale(13),
              color: mine ? colors.Others.white : colors.Dark.textPrimary,
              lineHeight: scale(19),
            }}
          >
            {message.text}
          </Text>
        </View>
        {isLastInGroup && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: mine ? 'flex-end' : 'flex-start',
              marginTop: scale(3),
              paddingHorizontal: scale(4),
            }}
          >
            <Text style={{ fontSize: scale(9), color: TEXT_FAINT, fontWeight: '600' }}>
              {formatTime(message.at)}
            </Text>
            {mine && showSeen && message.seen && (
              <>
                <Text style={{ fontSize: scale(9), color: TEXT_FAINT, marginHorizontal: scale(4) }}>
                  ·
                </Text>
                <Lucide name="check-check" size={scale(11)} color={ACCENT} />
                <Text
                  style={{
                    fontSize: scale(9),
                    color: ACCENT,
                    fontWeight: '700',
                    marginLeft: scale(3),
                  }}
                >
                  Seen
                </Text>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
type ChatRoute = RouteProp<{ Chat: { conversationId: string } }, 'Chat'>;

const ChatScreen = ({
  navigation,
  route,
}: {
  navigation: NavigationProp<any>;
  route: ChatRoute;
}) => {
  const conversation = useMemo(
    () => CONVERSATIONS.find(c => c.id === route.params.conversationId) ?? CONVERSATIONS[0],
    [route.params.conversationId],
  );
  const [messages, setMessages] = useState<Message[]>(THREADS[conversation.id] ?? []);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const onSend = () => {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = {
      id: `local-${Date.now()}`,
      fromMe: true,
      text,
      at: new Date().toISOString(),
      seen: false,
    };
    setMessages(prev => [...prev, msg]);
    setDraft('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  // Build render rows: day separator + bubble grouping flags
  const rows = useMemo(() => {
    const out: Array<
      | { kind: 'day'; id: string; label: string }
      | {
          kind: 'msg';
          id: string;
          message: Message;
          isFirstInGroup: boolean;
          isLastInGroup: boolean;
          showSeen: boolean;
        }
    > = [];

    let prevDayKey: string | null = null;
    let lastSeenMineIndex = -1;
    messages.forEach((m, i) => {
      if (m.fromMe && m.seen) lastSeenMineIndex = i;
    });

    messages.forEach((m, i) => {
      const dayKey = new Date(m.at).toDateString();
      if (dayKey !== prevDayKey) {
        out.push({ kind: 'day', id: `day-${dayKey}`, label: dayLabel(m.at) });
        prevDayKey = dayKey;
      }
      const prev = messages[i - 1];
      const next = messages[i + 1];
      const isFirstInGroup =
        !prev || prev.fromMe !== m.fromMe || new Date(prev.at).toDateString() !== dayKey;
      const isLastInGroup =
        !next || next.fromMe !== m.fromMe || new Date(next.at).toDateString() !== dayKey;
      out.push({
        kind: 'msg',
        id: m.id,
        message: m,
        isFirstInGroup,
        isLastInGroup,
        showSeen: i === lastSeenMineIndex,
      });
    });

    return out;
  }, [messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
      {/* Top bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: scale(12),
          paddingVertical: scale(10),
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
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lucide name="chevron-left" size={scale(20)} color={colors.Others.white} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: scale(4) }}
        >
          <View style={{ marginRight: scale(10) }}>
            <Image
              source={avatarFor(conversation.avatarSeed)}
              style={{
                width: scale(38),
                height: scale(38),
                borderRadius: scale(19),
                borderWidth: 1.5,
                borderColor: conversation.online ? ONLINE : SURFACE_BORDER,
              }}
            />
            {conversation.online && (
              <View
                style={{
                  position: 'absolute',
                  right: -scale(1),
                  bottom: -scale(1),
                  width: scale(11),
                  height: scale(11),
                  borderRadius: scale(5.5),
                  backgroundColor: ONLINE,
                  borderWidth: 2,
                  borderColor: BG,
                }}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: scale(14),
                fontWeight: '900',
                color: colors.Others.white,
                letterSpacing: -0.3,
              }}
            >
              {conversation.name}
            </Text>
            <Text
              style={{
                fontSize: scale(10),
                color: conversation.online ? ONLINE : TEXT_DIM,
                marginTop: scale(1),
                fontWeight: '700',
              }}
            >
              {conversation.lastActive}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: scale(36),
            height: scale(36),
            borderRadius: scale(18),
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: scale(2),
          }}
        >
          <Lucide name="phone" size={scale(16)} color={colors.Others.white} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: scale(36),
            height: scale(36),
            borderRadius: scale(18),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lucide name="video" size={scale(16)} color={colors.Others.white} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? scale(0) : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: scale(8), paddingBottom: scale(12) }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {rows.map(r =>
            r.kind === 'day' ? (
              <DaySeparator key={r.id} label={r.label} />
            ) : (
              <Bubble
                key={r.id}
                message={r.message}
                isFirstInGroup={r.isFirstInGroup}
                isLastInGroup={r.isLastInGroup}
                showSeen={r.showSeen}
              />
            ),
          )}
        </ScrollView>

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
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: scale(38),
              height: scale(38),
              borderRadius: scale(19),
              backgroundColor: SURFACE,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: SURFACE_BORDER,
              marginRight: scale(8),
            }}
          >
            <Lucide name="image" size={scale(16)} color={colors.Others.white} />
          </TouchableOpacity>

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
              value={draft}
              onChangeText={setDraft}
              placeholder="Message…"
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
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ marginLeft: scale(8), paddingBottom: scale(2) }}
            >
              <Lucide name="smile" size={scale(16)} color={TEXT_DIM} />
            </TouchableOpacity>
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
            <Lucide name="send" size={scale(16)} color={colors.Others.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
