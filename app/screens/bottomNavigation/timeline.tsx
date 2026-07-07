import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from '../../helpers/scaler';
import { useTabBarSpace } from '../../components/navigation/CustomTabBar';
import { colors } from '../../styles/colors';
import FounderSuggestionCard from '../../components/timeline/FounderSuggestionCard';
import FounderDetailScreen from '../timeline/FounderDetailScreen';
import SearchIcon from '../../../assets/icons/SearchIcon';
import { Founder, FoundersData } from '../../helpers/types';
import foundersData from '../../data/founders.json';

const founders: Founder[] = (foundersData as FoundersData).founders;

type ScreenMode = 'search' | 'timeline';

// ─── Main Screen ──────────────────────────────────────────────────────────────
const TimelineScreen = () => {
  const tabBarSpace = useTabBarSpace();
  const [mode, setMode] = useState<ScreenMode>('search');
  const [selectedFounderId, setSelectedFounderId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const searchAnim = useRef(new Animated.Value(0)).current;

  const selectedFounder: Founder | undefined = founders.find(
    f => f.id === selectedFounderId,
  );

  const filteredFounders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return founders;
    return founders.filter(
      f =>
        f.profile.name.toLowerCase().includes(q) ||
        f.profile.company.toLowerCase().includes(q) ||
        f.profile.title.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleSelectFounder = (id: string) => {
    Keyboard.dismiss();
    setSelectedFounderId(id);
    setMode('timeline');
  };

  const handleBack = () => {
    setMode('search');
    setSearchQuery('');
  };

  const onSearchFocus = () =>
    Animated.timing(searchAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  const onSearchBlur = () =>
    Animated.timing(searchAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

  const searchBorderColor = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.Dark.surfaceStronger, colors.Accent.blue],
  });

  // ─── Timeline Mode ────────────────────────────────────────────────────────────
  if (mode === 'timeline' && selectedFounder) {
    return (
      <FounderDetailScreen founder={selectedFounder} onBack={handleBack} />
    );
  }

  // ─── Search Mode ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.Dark.bg }}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: scale(20),
            paddingTop: scale(28),
            paddingBottom: scale(8),
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: scale(10),
              width: scale(120),
              height: scale(80),
              borderRadius: scale(60),
              backgroundColor: colors.Accent.blue,
              opacity: 0.08,
            }}
          />
          <Text
            style={{
              fontSize: scale(11),
              fontWeight: '700',
              color: colors.Dark.textPlaceholder,
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginBottom: scale(6),
            }}
          >
            Discover
          </Text>
          <Text
            style={{
              fontSize: scale(28),
              fontWeight: '800',
              color: colors.Others.white,
              letterSpacing: -0.8,
            }}
          >
            Founders
          </Text>
          <Text
            style={{
              fontSize: scale(13),
              color: colors.Dark.textHint,
              marginTop: scale(4),
              fontWeight: '500',
            }}
          >
            Explore journeys of the world's top founders
          </Text>
        </View>

        {/* Search bar */}
        <View
          style={{
            paddingHorizontal: scale(20),
            paddingTop: scale(16),
            paddingBottom: scale(8),
          }}
        >
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.Dark.surfaceMuted,
              borderRadius: scale(16),
              paddingHorizontal: scale(14),
              paddingVertical: scale(12),
              borderWidth: 1.5,
              borderColor: searchBorderColor,
            }}
          >
            <View style={{ marginRight: scale(8) }}>
              <SearchIcon width={scale(16)} height={scale(18)} color={colors.Dark.textMuted} />
            </View>
            <TextInput
              style={{
                flex: 1,
                fontSize: scale(15),
                color: colors.Others.white,
                padding: 0,
                fontWeight: '500',
              }}
              placeholder="Search founders, companies…"
              placeholderTextColor={colors.Dark.textPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={onSearchFocus}
              onBlur={onSearchBlur}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text
                  style={{
                    fontSize: scale(16),
                    color: colors.Dark.textFainter,
                  }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>

        {/* Founder list */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: scale(20),
            paddingBottom: tabBarSpace + scale(16),
            paddingTop: scale(8),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: scale(14),
            }}
          >
            <Text
              style={{
                fontSize: scale(11),
                fontWeight: '700',
                color: colors.Dark.textFainter,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                flex: 1,
              }}
            >
              {searchQuery.trim() ? 'Results' : 'All Founders'}
            </Text>
            <View
              style={{
                backgroundColor: colors.Dark.surfaceHover,
                borderRadius: scale(20),
                paddingVertical: scale(3),
                paddingHorizontal: scale(10),
              }}
            >
              <Text
                style={{
                  fontSize: scale(11),
                  color: colors.Dark.textFainter,
                  fontWeight: '600',
                }}
              >
                {searchQuery.trim()
                  ? `${filteredFounders.length} found`
                  : `${founders.length} total`}
              </Text>
            </View>
          </View>

          {filteredFounders.length > 0 ? (
            filteredFounders.map(founder => (
              <FounderSuggestionCard
                key={founder.id}
                founder={founder}
                onPress={() => handleSelectFounder(founder.id)}
              />
            ))
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: scale(60) }}>
              <Text style={{ fontSize: scale(36), marginBottom: scale(12) }}>
                🔭
              </Text>
              <Text
                style={{
                  fontSize: scale(15),
                  fontWeight: '700',
                  color: colors.Dark.textFainter,
                }}
              >
                No founders found
              </Text>
              <Text
                style={{
                  fontSize: scale(13),
                  color: colors.Dark.textPlaceholderSofter,
                  marginTop: scale(6),
                }}
              >
                Try a different name or company
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TimelineScreen;
