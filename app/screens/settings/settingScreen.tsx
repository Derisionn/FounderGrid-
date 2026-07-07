import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { scale } from '../../helpers/scaler';
import { colors } from '../../styles/colors';
import { ME_AVATAR } from '../../helpers/avatars';
import { Lucide } from '@react-native-vector-icons/lucide';
import { supabase } from '../../lib/supabase';

// ─── Constants ────────────────────────────────────────────────────────────────
const BG = colors.Dark.bg;
const ACCENT = colors.Accent.blue;
const SURFACE = colors.Dark.surface;
const SURFACE_BORDER = colors.Dark.border;
const DIVIDER = colors.Dark.divider;
const TEXT_DIM = colors.Dark.textDim;
const TEXT_FAINT = colors.Dark.textTrace;
const STREAK_ORANGE = colors.Accent.streak;
const DANGER = colors.Accent.danger;

// ─── Mock user (swap for real session/profile data) ───────────────────────────
const ME = {
  initials: 'AS',
  name: 'Anmol Singh',
  username: '@anmol',
  streak: 7,
};

// ─── Reusable: Switch knob ────────────────────────────────────────────────────
const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => {
  const tx = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(tx, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [value, tx]);
  const knobLeft = tx.interpolate({ inputRange: [0, 1], outputRange: [scale(2), scale(20)] });
  const trackBg = tx.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.Dark.surfaceStrong, `${ACCENT}cc`],
  });
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onChange(!value)}>
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

// ─── Reusable: Settings row ───────────────────────────────────────────────────
type RowProps = {
  icon: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  badge?: { color: string; label: string };
  toggle?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
  isLast?: boolean;
};

const Row = ({
  title,
  subtitle,
  rightText,
  badge,
  toggle,
  onToggle,
  onPress,
  danger,
  isLast,
}: RowProps) => {
  const titleColor = danger ? DANGER : colors.Others.white;
  const Wrapper = onPress || toggle !== undefined ? TouchableOpacity : View;
  const wrapperProps =
    onPress || toggle !== undefined
      ? {
          activeOpacity: 0.7,
          onPress: () => {
            if (toggle !== undefined && onToggle) onToggle(!toggle);
            else onPress?.();
          },
        }
      : {};
  return (
    <Wrapper {...wrapperProps}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: scale(14),
          paddingVertical: scale(12),
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: DIVIDER,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: scale(13), fontWeight: '700', color: titleColor }}>
            {title}
          </Text>
          {subtitle && (
            <Text style={{ fontSize: scale(11), color: TEXT_DIM, marginTop: scale(2) }}>
              {subtitle}
            </Text>
          )}
        </View>
        {badge && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: `${badge.color}20`,
              borderRadius: scale(20),
              paddingVertical: scale(3),
              paddingHorizontal: scale(8),
              marginRight: scale(6),
              borderWidth: 1,
              borderColor: `${badge.color}40`,
            }}
          >
            <Text style={{ fontSize: scale(10), fontWeight: '800', color: badge.color }}>
              {badge.label}
            </Text>
          </View>
        )}
        {rightText && (
          <Text
            style={{
              fontSize: scale(12),
              color: TEXT_DIM,
              fontWeight: '600',
              marginRight: scale(6),
            }}
          >
            {rightText}
          </Text>
        )}
        {toggle !== undefined && onToggle ? (
          <Toggle value={toggle} onChange={onToggle} />
        ) : onPress && !danger ? (
          <Lucide name="chevron-right" size={scale(16)} color={TEXT_FAINT} />
        ) : null}
      </View>
    </Wrapper>
  );
};

// ─── Reusable: Section ────────────────────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ marginBottom: scale(20) }}>
    <Text
      style={{
        fontSize: scale(11),
        fontWeight: '700',
        color: TEXT_FAINT,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: scale(10),
        marginLeft: scale(4),
      }}
    >
      {title}
    </Text>
    <View
      style={{
        backgroundColor: SURFACE,
        borderRadius: scale(16),
        borderWidth: 1,
        borderColor: SURFACE_BORDER,
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  </View>
);

// ─── Hero card ────────────────────────────────────────────────────────────────
const HeroCard = ({ onEdit }: { onEdit: () => void }) => {
  const flame = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flame, { toValue: 1.1, duration: 900, useNativeDriver: true }),
        Animated.timing(flame, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, [flame]);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: SURFACE,
        borderRadius: scale(16),
        padding: scale(14),
        borderWidth: 1,
        borderColor: SURFACE_BORDER,
        marginBottom: scale(20),
      }}
    >
      <Image
        source={ME_AVATAR}
        style={{
          width: scale(54),
          height: scale(54),
          borderRadius: scale(27),
          borderWidth: 2,
          borderColor: `${ACCENT}50`,
          marginRight: scale(12),
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: scale(15), fontWeight: '900', color: colors.Others.white, letterSpacing: -0.3 }}>
          {ME.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(2) }}>
          <Text style={{ fontSize: scale(12), color: ACCENT, fontWeight: '700' }}>
            {ME.username}
          </Text>
          <Text style={{ fontSize: scale(11), color: TEXT_FAINT, marginHorizontal: scale(6) }}>·</Text>
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.Accent.streakGlow,
              borderRadius: scale(20),
              paddingVertical: scale(2),
              paddingHorizontal: scale(7),
              borderWidth: 1,
              borderColor: colors.Accent.streakBorder,
              transform: [{ scale: flame }],
            }}
          >
            <Lucide
              name="flame"
              size={scale(10)}
              color={STREAK_ORANGE}
              style={{ marginRight: scale(3) }}
            />
            <Text style={{ fontSize: scale(10), fontWeight: '800', color: STREAK_ORANGE }}>
              {ME.streak}
            </Text>
          </Animated.View>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onEdit}
        style={{
          backgroundColor: ACCENT,
          borderRadius: scale(10),
          paddingVertical: scale(8),
          paddingHorizontal: scale(12),
          shadowColor: ACCENT,
          shadowOpacity: 0.4,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Text style={{ fontSize: scale(11), fontWeight: '800', color: colors.Others.white }}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const SettingScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  // Builder preferences
  const [openToCollab, setOpenToCollab] = useState(true);
  const [showStreak, setShowStreak] = useState(true);
  const [showActiveProject, setShowActiveProject] = useState(true);

  // Notifications
  const [pushEnabled, setPushEnabled] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [likesNotif, setLikesNotif] = useState(true);
  const [followersNotif, setFollowersNotif] = useState(true);
  const [weeklyRecap, setWeeklyRecap] = useState(true);

  // Appearance
  const [darkMode, setDarkMode] = useState(true);

  // Privacy
  const [publicProfile, setPublicProfile] = useState(true);
  const [followersOnlyPosts, setFollowersOnlyPosts] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
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
          borderBottomColor: colors.Dark.divider,
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
            Settings
          </Text>
          <Text style={{ fontSize: scale(15), fontWeight: '900', color: colors.Others.white, marginTop: scale(2), letterSpacing: -0.3 }}>
            Your space
          </Text>
        </View>
        <View style={{ width: scale(36) }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: scale(16),
          paddingTop: scale(16),
          paddingBottom: scale(40),
        }}
      >
        <HeroCard onEdit={() => {}} />

        {/* ── Account ── */}
        <Section title="Account">
          <Row icon="pencil" title="Edit profile" onPress={() => {}} />
          <Row icon="at-sign" title="Change username" rightText={ME.username} onPress={() => {}} />
          <Row icon="camera" title="Profile photo" onPress={() => {}} />
          <Row icon="file-text" title="Bio & about" onPress={() => {}} />
          <Row icon="github" title="GitHub" rightText="github.com/anmol" onPress={() => {}} />
          <Row icon="twitter" title="X / Twitter" rightText="@anmol_codes" onPress={() => {}} />
          <Row icon="globe" title="Website" rightText="foundora.app" onPress={() => {}} isLast />
        </Section>

        {/* ── Builder Preferences ── */}
        <Section title="Builder Preferences">
          <Row
            icon="handshake"
            title="Open to collaborators"
            subtitle="Show a green badge on your profile."
            toggle={openToCollab}
            onToggle={setOpenToCollab}
          />
          <Row
            icon="flame"
            title="Show streak publicly"
            subtitle="Visible on your profile and posts."
            toggle={showStreak}
            onToggle={setShowStreak}
          />
          <Row
            icon="rocket"
            title="Show active project publicly"
            toggle={showActiveProject}
            onToggle={setShowActiveProject}
          />
          <Row icon="code" title="Builder type" rightText="Solo Founder" onPress={() => {}} isLast />
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications">
          <Row
            icon="bell"
            title="Push notifications"
            toggle={pushEnabled}
            onToggle={setPushEnabled}
          />
          <Row
            icon="alarm-clock"
            title="Streak reminders"
            subtitle="Gentle nudge if you haven't posted today."
            toggle={streakReminders}
            onToggle={setStreakReminders}
          />
          <Row icon="heart" title="Likes & comments" toggle={likesNotif} onToggle={setLikesNotif} />
          <Row icon="sparkles" title="New followers" toggle={followersNotif} onToggle={setFollowersNotif} />
          <Row
            icon="bar-chart-3"
            title="Weekly progress recap"
            toggle={weeklyRecap}
            onToggle={setWeeklyRecap}
            isLast
          />
        </Section>

        {/* ── Appearance ── */}
        <Section title="Appearance">
          <Row
            icon="moon"
            title="Dark mode"
            subtitle="Light theme coming soon."
            toggle={darkMode}
            onToggle={setDarkMode}
          />
          <Row
            icon="palette"
            title="Theme"
            rightText="Default"
            badge={{ color: ACCENT, label: 'SOON' }}
            isLast
          />
        </Section>

        {/* ── Privacy & Visibility ── */}
        <Section title="Privacy & Visibility">
          <Row
            icon="eye"
            title="Public profile"
            subtitle="Anyone can find and view you."
            toggle={publicProfile}
            onToggle={setPublicProfile}
          />
          <Row
            icon="users"
            title="Followers-only posts"
            subtitle="Default new posts to followers."
            toggle={followersOnlyPosts}
            onToggle={setFollowersOnlyPosts}
          />
          <Row
            icon="ban"
            title="Blocked users"
            badge={{ color: TEXT_DIM, label: 'SOON' }}
            onPress={() => {}}
            isLast
          />
        </Section>

        {/* ── Support & Community ── */}
        <Section title="Support & Community">
          <Row icon="bug" title="Report a bug" onPress={() => {}} />
          <Row icon="message-square" title="Send feedback" onPress={() => {}} />
          <Row icon="scroll-text" title="Community guidelines" onPress={() => {}} />
          <Row icon="circle-help" title="Help & support" onPress={() => {}} isLast />
        </Section>

        {/* ── Session ── */}
        <Section title="Session">
          <Row icon="log-out" title="Log out" onPress={handleLogout} danger />
          <Row
            icon="triangle-alert"
            title="Delete account"
            subtitle="Permanently removes your posts, streak, and followers."
            onPress={() => {}}
            danger
            isLast
          />
        </Section>

        {/* ── App version footer ── */}
        <View style={{ alignItems: 'center', marginTop: scale(8) }}>
          <Text style={{ fontSize: scale(11), color: TEXT_FAINT, fontWeight: '700' }}>
            Foundora · v1.0.0
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(4) }}>
            <Text style={{ fontSize: scale(10), color: TEXT_FAINT }}>
              Build something today
            </Text>
            <Lucide
              name={Platform.OS === 'ios' ? 'apple' : 'bot'}
              size={scale(11)}
              color={TEXT_FAINT}
              style={{ marginLeft: scale(4) }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;
