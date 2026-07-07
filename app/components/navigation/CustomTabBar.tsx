import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  withTiming,
  withSequence,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Defs,
  RadialGradient,
  Stop,
  Circle as SvgCircle,
} from 'react-native-svg';
import Home from '../../../assets/icons/Home';
import Timeline from '../../../assets/icons/Timeline';
import Profile from '../../../assets/icons/Profile';
import Bell from '../../../assets/icons/Bell';
import Plus from '../../../assets/icons/Plus';
import { colors } from '../../styles/colors';

const ACCENT = colors.Accent.blue;
const INACTIVE = colors.Dark.inactiveTab;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Geometry sourced from the Figma SVG (viewBox 412 x 136).
// Every Y value is scaled by SCALE = SCREEN_WIDTH / 412 so the navbar keeps
// its proportions on any phone width.
const DESIGN_WIDTH = 412;
const SCALE = SCREEN_WIDTH / DESIGN_WIDTH;

// Full card frame (glow halo + bar + safe-area strip)
const FRAME_HEIGHT = 136 * SCALE;

// Bar inside the frame: y=44 -> y=105 in design space
const BAR_TOP = 44 * SCALE;
const BAR_BOTTOM = 105 * SCALE;
const BAR_HEIGHT = BAR_BOTTOM - BAR_TOP;
const BAR_CORNER_RADIUS = 4 * SCALE;

// Notch wraps a circle centered on the active tab.
const NOTCH_HALF_WIDTH = ((264 - 147) / 2) * SCALE;

// Floating circle: 56px disk + 4px ring (60px outer).
const CIRCLE_INNER = 56 * SCALE;
const RING = 4 * SCALE;
const CIRCLE_TOTAL = CIRCLE_INNER + RING * 2;
// Circle top edge sits at design y=12; bar top is y=44, so it pokes up 32px.
const CIRCLE_LIFT = (44 - 12) * SCALE;

// Soft glow halo radius (radial gradient behind the floating button).
const GLOW_RADIUS = 64;

// Total height the floating tab bar occupies from the bottom of the screen
// (bar + home-indicator strip + the lift of the active circle). The bar is
// absolutely positioned, so the navigator reserves no space for it — screens
// must pad scroll content / lift fixed CTAs by this amount themselves.
export const useTabBarSpace = (): number => {
  const insets = useSafeAreaInsets();
  const indicatorStripHeight = FRAME_HEIGHT - BAR_BOTTOM;
  return FRAME_HEIGHT + Math.max(0, insets.bottom - indicatorStripHeight);
};

type IconProps = { width?: number; height?: number; color?: string };

// Config keyed by the route names registered in the BottomTab.Navigator.
const TAB_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<IconProps> }
> = {
  HomeScreenNavigator: { label: 'Home', icon: Home },
  TimelineScreenNavigator: { label: 'Timeline', icon: Timeline },
  AddPostScreenNavigator: { label: 'Post', icon: Plus },
  NotificationsScreenNavigator: { label: 'Alerts', icon: Bell },
  ProfileScreenNavigator: { label: 'Profile', icon: Profile },
};

const AnimatedPath = Animated.createAnimatedComponent(
  Path,
) as unknown as React.ComponentType<
  React.ComponentProps<typeof Path> & { animatedProps?: any }
>;
const AnimatedSvgCircle = Animated.createAnimatedComponent(
  SvgCircle,
) as unknown as React.ComponentType<
  React.ComponentProps<typeof SvgCircle> & { animatedProps?: any }
>;

// BounceableTab plays a quick scale-down/up pulse when its `index` matches the
// value held in `bouncingTab` — visual feedback on the tab being deselected.
interface BounceableTabProps {
  index: number;
  bouncingTab: SharedValue<number | null>;
  children: React.ReactNode;
}
const BounceableTab: React.FC<BounceableTabProps> = ({
  index,
  bouncingTab,
  children,
}) => {
  const scale = useSharedValue(1);
  useAnimatedReaction(
    () => bouncingTab.value,
    (currentValue) => {
      if (currentValue === index) {
        scale.value = withSequence(
          withTiming(0.82, { duration: 110 }),
          withSpring(1, { damping: 6, stiffness: 260, mass: 0.5 }),
        );
        bouncingTab.value = null;
      }
    },
  );
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

/**
 * Build the navbar bar path — ported from the Figma SVG (412x136 viewBox).
 * The bar occupies y=44 -> y=105 with a 4px corner radius; the notch cradle
 * spans x=147 -> x=264 and arcs down to y=85. We translate into local bar
 * coords (bar top = 0) and shift the cradle to follow the active tab centerX.
 * Marked as a worklet so it runs on the UI thread inside useAnimatedProps.
 */
function buildNavPath(centerX: number): string {
  'worklet';
  const W = SCREEN_WIDTH;
  const H = BAR_HEIGHT;
  const r = BAR_CORNER_RADIUS;
  const half = NOTCH_HALF_WIDTH;

  // Clamp center so the cradle stays fully inside the bar's flat top edge.
  const minCenter = r + half;
  const maxCenter = W - r - half;
  const cx =
    centerX < minCenter ? minCenter : centerX > maxCenter ? maxCenter : centerX;

  const s = SCALE;
  const off = (x: number) => (x - 205.5) * s; // offset from cradle midpoint
  const dy = (y: number) => (y - 44) * s; // y relative to bar top

  const x1 = cx + off(147);
  const x2 = cx + off(264);

  const c1a_x = cx + off(155.837);
  const c1a_y = dy(44);
  const c1b_x = cx + off(162.708);
  const c1b_y = dy(51.4299);
  const p1_x = cx + off(166.073);
  const p1_y = dy(59.6008);

  const c2a_x = cx + off(172.21);
  const c2a_y = dy(74.5066);
  const c2b_x = cx + off(186.88);
  const c2b_y = dy(84.9999);
  const p2_x = cx + off(204);
  const p2_y = dy(85);

  const p3_x = cx + off(207);
  const p3_y = dy(85);

  const c3a_x = cx + off(224.12);
  const c3a_y = dy(84.9999);
  const c3b_x = cx + off(238.79);
  const c3b_y = dy(74.5066);
  const p4_x = cx + off(244.927);
  const p4_y = dy(59.6008);

  const c4a_x = cx + off(248.292);
  const c4a_y = dy(51.4299);
  const c4b_x = cx + off(255.163);
  const c4b_y = dy(44);

  return [
    `M ${r} 0`,
    `L ${x1} 0`,
    `C ${c1a_x} ${c1a_y}, ${c1b_x} ${c1b_y}, ${p1_x} ${p1_y}`,
    `C ${c2a_x} ${c2a_y}, ${c2b_x} ${c2b_y}, ${p2_x} ${p2_y}`,
    `L ${p3_x} ${p3_y}`,
    `C ${c3a_x} ${c3a_y}, ${c3b_x} ${c3b_y}, ${p4_x} ${p4_y}`,
    `C ${c4a_x} ${c4a_y}, ${c4b_x} ${c4b_y}, ${x2} 0`,
    `L ${W - r} 0`,
    `Q ${W} 0, ${W} ${r}`,
    `L ${W} ${H}`,
    `L 0 ${H}`,
    `L 0 ${r}`,
    `Q 0 0, ${r} 0`,
    `Z`,
  ].join(' ');
}

/**
 * A floating notched tab bar: the active tab is lifted into a blue circle that
 * slides along the bar as you switch tabs, cradled by an animated SVG notch
 * with a soft glow halo behind it.
 */
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  const tabs = state.routes.filter((r) => TAB_CONFIG[r.name]);
  const tabWidth = SCREEN_WIDTH / tabs.length;
  const activeIndex = tabs.findIndex(
    (r) => r.key === state.routes[state.index].key,
  );
  const safeActiveIndex = activeIndex < 0 ? 0 : activeIndex;
  const targetCenterX = tabWidth * safeActiveIndex + tabWidth / 2;

  const animatedCenterX = useSharedValue(targetCenterX);
  const bouncingTab = useSharedValue<number | null>(null);
  const previousIndexRef = React.useRef(safeActiveIndex);

  React.useEffect(() => {
    animatedCenterX.value = withSpring(targetCenterX, {
      damping: 18,
      stiffness: 180,
      mass: 0.7,
    });
    const previous = previousIndexRef.current;
    if (previous !== safeActiveIndex) {
      bouncingTab.value = previous;
    }
    previousIndexRef.current = safeActiveIndex;
  }, [targetCenterX, animatedCenterX, safeActiveIndex, bouncingTab]);

  const clampCenter = (x: number) => {
    'worklet';
    const minCenter = BAR_CORNER_RADIUS + NOTCH_HALF_WIDTH;
    const maxCenter = SCREEN_WIDTH - BAR_CORNER_RADIUS - NOTCH_HALF_WIDTH;
    if (x < minCenter) return minCenter;
    if (x > maxCenter) return maxCenter;
    return x;
  };

  const animatedPathProps = useAnimatedProps(() => ({
    d: buildNavPath(animatedCenterX.value),
  }));
  const animatedGlowProps = useAnimatedProps(() => ({
    cx: clampCenter(animatedCenterX.value),
  }));
  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: clampCenter(animatedCenterX.value) - CIRCLE_TOTAL / 2 },
    ],
  }));

  const handlePress = (routeKey: string, routeName: string, focused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });
    if (!focused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const indicatorStripHeight = FRAME_HEIGHT - BAR_BOTTOM;
  const extraSafeArea = Math.max(0, insets.bottom - indicatorStripHeight);
  const wrapperHeight = FRAME_HEIGHT + extraSafeArea;
  const barFill = colors.Dark.bgTabBar;
  const svgCanvasHeight = BAR_HEIGHT;

  const activeRouteName = tabs[safeActiveIndex]?.name;
  const ActiveIcon = activeRouteName
    ? TAB_CONFIG[activeRouteName].icon
    : Home;

  return (
    <View
      style={[styles.outer, { height: wrapperHeight }]}
      pointerEvents="box-none"
    >
      {/* Solid strip below the bar (home-indicator area + safe-area overflow) */}
      <View
        style={[
          styles.indicatorStrip,
          {
            height: indicatorStripHeight + extraSafeArea,
            backgroundColor: barFill,
          },
        ]}
        pointerEvents="none"
      />

      {/* Bar shape + soft glow halo behind the floating circle */}
      <View
        style={[
          styles.svgLayer,
          {
            width: SCREEN_WIDTH,
            height: svgCanvasHeight + GLOW_RADIUS,
            bottom: indicatorStripHeight + extraSafeArea - 1,
          },
        ]}
        pointerEvents="none"
      >
        <Svg width={SCREEN_WIDTH} height={svgCanvasHeight + GLOW_RADIUS}>
          <Defs>
            <RadialGradient id="tabGlow" cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor={ACCENT} stopOpacity="0.28" />
              <Stop offset="0.5" stopColor={ACCENT} stopOpacity="0.1" />
              <Stop offset="1" stopColor={ACCENT} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <AnimatedSvgCircle
            animatedProps={animatedGlowProps as any}
            cy={GLOW_RADIUS}
            r={GLOW_RADIUS}
            fill="url(#tabGlow)"
          />
          <AnimatedPath
            animatedProps={animatedPathProps as any}
            transform={`translate(0, ${GLOW_RADIUS})`}
            fill={barFill}
          />
        </Svg>
      </View>

      {/* Tab buttons row */}
      <View
        style={[
          styles.tabRow,
          {
            width: SCREEN_WIDTH,
            height: BAR_HEIGHT,
            bottom: indicatorStripHeight + extraSafeArea,
          },
        ]}
        pointerEvents="box-none"
      >
        {tabs.map((route, index) => {
          const { label, icon: Icon } = TAB_CONFIG[route.name];
          const isActive = index === safeActiveIndex;
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabButton}
              onPress={() => handlePress(route.key, route.name, isActive)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${label} tab`}
              accessibilityState={{ selected: isActive }}
            >
              <BounceableTab index={index} bouncingTab={bouncingTab}>
                <View style={styles.tabContent}>
                  {/* Icon slot — empty for the active tab (the floating circle
                      takes its place), kept as a spacer so labels line up. */}
                  <View style={styles.iconSlot}>
                    {isActive ? null : (
                      <Icon width={24} height={24} color={INACTIVE} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.tabLabel,
                      isActive
                        ? { color: ACCENT, fontWeight: '600' }
                        : { color: INACTIVE, fontWeight: '400' },
                    ]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                </View>
              </BounceableTab>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating active button — slides via animated translateX */}
      <Animated.View
        style={[
          styles.floatingButtonWrapper,
          {
            bottom:
              indicatorStripHeight + extraSafeArea + BAR_HEIGHT - CIRCLE_LIFT,
          },
          animatedCircleStyle,
        ]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => {
            const active = tabs[safeActiveIndex];
            if (active) handlePress(active.key, active.name, true);
          }}
          activeOpacity={0.85}
          style={styles.floatingButton}
        >
          <View style={styles.accentInner}>
            <ActiveIcon width={26} height={26} color={colors.Others.white} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    zIndex: 1000,
  },
  indicatorStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  svgLayer: {
    position: 'absolute',
    left: 0,
  },
  tabRow: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    paddingTop: 14,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconSlot: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  floatingButtonWrapper: {
    position: 'absolute',
    left: 0,
    width: CIRCLE_TOTAL,
    height: CIRCLE_TOTAL,
    zIndex: 30,
  },
  floatingButton: {
    width: CIRCLE_TOTAL,
    height: CIRCLE_TOTAL,
    borderRadius: CIRCLE_TOTAL / 2,
    backgroundColor: colors.Dark.bg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 14,
  },
  accentInner: {
    width: CIRCLE_INNER,
    height: CIRCLE_INNER,
    borderRadius: CIRCLE_INNER / 2,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomTabBar;
