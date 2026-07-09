import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { Lucide } from '@react-native-vector-icons/lucide';
import { scale } from '../../helpers/scaler';
import { colors } from '../../styles/colors';
import { avatarFor } from '../../helpers/avatars';
import { CONVERSATIONS, ACTIVE_NOW, Conversation } from '../../data/mockMessages';



// ─── Constants ────────────────────────────────────────────────────────────────
const BG = colors.Dark.bg;
const ACCENT = colors.Accent.blue;
const SURFACE = colors.Dark.surface;
const SURFACE_BORDER = colors.Dark.border;
const DIVIDER = colors.Dark.divider;
const TEXT_DIM = colors.Dark.textDim;
const TEXT_FAINT = colors.Dark.textTrace;
const ONLINE = colors.Accent.green;

type FilterId = 'all' | 'unread';

// ─── Active rail item ─────────────────────────────────────────────────────────
const ActiveRailItem = ({
  conversation,
  onPress,
}: {
  conversation: Conversation;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={{ alignItems: 'center', marginRight: scale(14), width: scale(64) }}
  >
    <View
      style={{
        width: scale(58),
        height: scale(58),
        borderRadius: scale(29),
        borderWidth: 2,
        borderColor: ONLINE,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={avatarFor(conversation.avatarSeed)}
        style={{ width: scale(50), height: scale(50), borderRadius: scale(25) }}
      />
      <View
        style={{
          position: 'absolute',
          right: -scale(1),
          bottom: -scale(1),
          width: scale(14),
          height: scale(14),
          borderRadius: scale(7),
          backgroundColor: ONLINE,
          borderWidth: 2,
          borderColor: BG,
        }}
      />
    </View>
    <Text
      numberOfLines={1}
      style={{
        fontSize: scale(10),
        color: colors.Dark.textTertiary2,
        marginTop: scale(8),
        fontWeight: '600',
      }}
    >
      {conversation.name.split(' ')[0]}
    </Text>
  </TouchableOpacity>
);

// ─── Conversation row ─────────────────────────────────────────────────────────
const ConversationRow = ({
  conversation,
  onPress,
  isLast,
}: {
  conversation: Conversation;
  onPress: () => void;
  isLast?: boolean;
}) => {
  const isUnread = conversation.unread > 0;
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(12),
        paddingHorizontal: scale(12),
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: DIVIDER,
      }}
    >
      <View style={{ marginRight: scale(12) }}>
        <Image
          source={avatarFor(conversation.avatarSeed)}
          style={{
            width: scale(52),
            height: scale(52),
            borderRadius: scale(26),
            borderWidth: 1.5,
            borderColor: SURFACE_BORDER,
          }}
        />
        {conversation.online && (
          <View
            style={{
              position: 'absolute',
              right: -scale(1),
              bottom: -scale(1),
              width: scale(14),
              height: scale(14),
              borderRadius: scale(7),
              backgroundColor: ONLINE,
              borderWidth: 2,
              borderColor: BG,
            }}
          />
        )}
      </View>

      <View style={{ flex: 1, marginRight: scale(8) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: scale(14),
              fontWeight: '800',
              color: colors.Others.white,
              letterSpacing: -0.2,
            }}
          >
            {conversation.name}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(3) }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: scale(12),
              fontWeight: isUnread ? '700' : '500',
              color: isUnread ? colors.Dark.textPrimary : TEXT_DIM,
            }}
          >
            {conversation.preview}
          </Text>
          <Text style={{ fontSize: scale(10), color: TEXT_FAINT, marginLeft: scale(8) }}>
            · {conversation.time}
          </Text>
        </View>
      </View>

      {isUnread ? (
        <View
          style={{
            minWidth: scale(20),
            height: scale(20),
            borderRadius: scale(10),
            backgroundColor: ACCENT,
            paddingHorizontal: scale(6),
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: ACCENT,
            shadowOpacity: 0.5,
            shadowRadius: 6,
          }}
        >
          <Text
            style={{
              fontSize: scale(10),
              fontWeight: '900',
              color: colors.Others.white,
            }}
          >
            {conversation.unread}
          </Text>
        </View>
      ) : (
        <Lucide name="chevron-right" size={scale(16)} color={TEXT_FAINT} />
      )}
    </TouchableOpacity>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const InboxScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [filter, setFilter] = useState<FilterId>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const base = filter === 'unread' ? CONVERSATIONS.filter(c => c.unread > 0) : CONVERSATIONS;
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q),
    );
  }, [filter, query]);

  const unreadTotal = useMemo(
    () => CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0),
    [],
  );

  const goToChat = (conversationId: string) =>
    navigation.navigate('Chat', { conversationId });

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
              fontSize: scale(14),
              fontWeight: '700',
              color: TEXT_FAINT,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Messages
          </Text>
          
        </View>
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
          <Lucide name="square-pen" size={scale(16)} color={colors.Others.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: scale(40) }}
      >
        {/* Search */}
        <View style={{ paddingHorizontal: scale(16), paddingTop: scale(14) }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: SURFACE,
              borderRadius: scale(14),
              paddingHorizontal: scale(12),
              borderWidth: 1,
              borderColor: SURFACE_BORDER,
            }}
          >
            <Lucide name="search" size={scale(15)} color={TEXT_DIM} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search messages"
              placeholderTextColor={TEXT_FAINT}
              style={{
                flex: 1,
                paddingVertical: scale(10),
                marginLeft: scale(8),
                fontSize: scale(13),
                color: colors.Others.white,
              }}
            />
            {query.length > 0 && (
              <TouchableOpacity activeOpacity={0.7} onPress={() => setQuery('')}>
                <Lucide name="x" size={scale(14)} color={TEXT_DIM} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        

        {/* Filter chips */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(20),
            marginTop: scale(20),
            marginBottom: scale(10),
          }}
        >
          
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
            {(['all', 'unread'] as FilterId[]).map(id => {
              const active = filter === id;
              return (
                <TouchableOpacity
                  key={id}
                  activeOpacity={0.85}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setFilter(id);
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

        {/* Conversation list */}
        <View
          style={{
            backgroundColor: SURFACE,
            borderRadius: scale(16),
            borderWidth: 1,
            borderColor: SURFACE_BORDER,
            marginHorizontal: scale(16),
            overflow: 'hidden',
          }}
        >
          {visible.length === 0 ? (
            <View
              style={{
                paddingVertical: scale(40),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lucide name="inbox" size={scale(28)} color={TEXT_FAINT} />
              <Text
                style={{
                  fontSize: scale(13),
                  fontWeight: '700',
                  color: TEXT_DIM,
                  marginTop: scale(8),
                }}
              >
                No conversations yet
              </Text>
            </View>
          ) : (
            visible.map((c, i) => (
              <ConversationRow
                key={c.id}
                conversation={c}
                onPress={() => goToChat(c.id)}
                isLast={i === visible.length - 1}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InboxScreen;
