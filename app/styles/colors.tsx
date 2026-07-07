// import { useTheme } from '../theme/ThemeContext';

const colors = {
  // primary: {
  //   50: 'rgba(255, 243, 237, 1)',
  //   100: 'rgba(255, 229, 213, 1)',
  //   200: 'rgba(254, 199, 170, 1)',
  //   300: 'rgba(253, 159, 116, 1)',
  //   400: 'rgba(250, 98, 46, 1)',
  //   500: 'rgba(248, 71, 23, 1)',
  //   600: 'rgba(233, 45, 13, 1)',
  //   700: 'rgba(193, 30, 13, 1)',
  //   800: 'rgba(154, 25, 18, 1)',
  //   900: 'rgba(124, 24, 18, 1)',
  // },
  //   primary: {
  //   50:  'rgba(235, 242, 255, 1)',   // very light blue
  //   100: 'rgba(220, 232, 255, 1)',
  //   200: 'rgba(186, 210, 255, 1)',
  //   300: 'rgba(152, 188, 255, 1)',
  //   400: 'rgba(118, 166, 255, 1)',
  //   500: 'rgba(76, 130, 255, 1)',    // main brand color
  //   600: 'rgba(59, 102, 204, 1)',
  //   700: 'rgba(44, 75, 153, 1)',
  //   800: 'rgba(30, 50, 102, 1)',
  //   900: 'rgba(18, 30, 61, 1)',
  // },
  primary: {
    50: 'rgba(235, 242, 255, 1)', // Very light blue — backgrounds
    100: 'rgba(215, 230, 255, 1)', // Soft UI backgrounds
    200: 'rgba(179, 205, 255, 1)', // Light accents
    300: 'rgba(138, 178, 255, 1)', // Cards hover / borders
    400: 'rgba(97, 151, 255, 1)', // Subtle highlights
    500: 'rgba(58, 111, 248, 1)', // Main brand color (buttons, icons)
    600: 'rgba(46, 88, 197, 1)', // Darker brand for active states
    700: 'rgba(34, 65, 146, 1)', // Headings + strong accents
    800: 'rgba(22, 42, 97, 1)', // Dark mode accents
    900: 'rgba(11, 21, 48, 1)', // Deep navy (hero backgrounds)
  },

  Greyscale: {
    0: 'rgba(248, 250, 251, 1)',
    25: 'rgba(252, 252, 252, 1)',
    50: 'rgba(250, 250, 250, 1)',
    100: 'rgba(223, 225, 231, 1)',
    200: 'rgba(228, 228, 231, 1)',
    300: 'rgba(164, 172, 185, 1)',
    400: 'rgba(129, 136, 152, 1)',
    500: 'rgba(102, 109, 128, 1)',
    600: 'rgba(54, 57, 74, 1)',
    700: 'rgba(39, 40, 53, 1)',
    800: 'rgba(26, 27, 37, 1)',
    900: 'rgba(13, 13, 18, 1)',
  },
  Additional: {
    Sky: {
      0: 'rgba(240, 251, 255, 1)',
      25: 'rgba(209, 240, 250, 1)',
      50: 'rgba(126, 221, 241, 1)',
      100: 'rgba(51, 207, 255, 1)',
      200: 'rgba(17, 107, 151, 1)',
      300: 'rgba(12, 78, 110, 1)',
    },
  },
  Alert: {
    Success: {
      0: 'rgba(239, 254, 250, 1)',
      25: 'rgba(221, 243, 239, 1)',
      50: 'rgba(158, 225, 212, 1)',
      100: 'rgba(64, 196, 170, 1)',
      200: 'rgba(40, 128, 111, 1)',
      300: 'rgba(24, 78, 68, 1)',
    },
    Warning: {
      0: 'rgba(255, 246, 224, 1)',
      25: 'rgba(250, 237, 204, 1)',
      50: 'rgba(252, 218, 131, 1)',
      100: 'rgba(255, 190, 76, 1)',
      200: 'rgba(150, 100, 34, 1)',
      300: 'rgba(92, 61, 31, 1)',
    },
    Error: {
      0: 'rgba(255, 240, 243, 1)',
      25: 'rgba(250, 219, 225, 1)',
      50: 'rgba(237, 130, 150, 1)',
      100: 'rgba(223, 28, 65, 1)',
      200: 'rgba(150, 19, 44, 1)',
      300: 'rgba(113, 14, 33, 1)',
    },
  },
  Others: {
    white: 'rgba(255, 255, 255, 1)',
    DarkForeground: 'rgba(252, 252, 252, 1)',
    transparent: 'transparent',
    shadow: '#000',
  },

  // Dark UI surface system — used by feed/home/profile/notifications/etc.
  // NOTE: base solid tones are kept as hex so callers can safely append alpha
  // suffixes via template literals (e.g. `${colors.Dark.bg}cc`).
  Dark: {
    bg: '#0D0D12',                              // primary background
    bgElevated: '#15151C',                      // raised menus/sheets
    bgTabBar: '#1C1C1E',                        // iOS-style tab bar surface
    bgOverlay: 'rgba(13, 13, 18, 0.88)',        // image overlay
    bgFooter: 'rgba(13, 13, 18, 0.96)',         // sticky footer bg

    // System grey (iOS tab inactive)
    inactiveTab: '#8E8E93',

    // White-with-alpha surfaces
    surfaceSubtle: 'rgba(255, 255, 255, 0.03)',
    surface: 'rgba(255, 255, 255, 0.04)',
    surfaceMuted: 'rgba(255, 255, 255, 0.05)',
    surfaceHover: 'rgba(255, 255, 255, 0.06)',
    surfaceActive: 'rgba(255, 255, 255, 0.07)',
    surfaceRaised: 'rgba(255, 255, 255, 0.08)',
    surfaceStrong: 'rgba(255, 255, 255, 0.1)',
    surfaceStronger: 'rgba(255, 255, 255, 0.12)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.15)',
    surfaceContrast: 'rgba(255, 255, 255, 0.2)',

    // Borders / dividers
    border: 'rgba(255, 255, 255, 0.08)',
    borderSubtle: 'rgba(255, 255, 255, 0.05)',
    borderMuted: 'rgba(255, 255, 255, 0.06)',
    borderHover: 'rgba(255, 255, 255, 0.07)',
    borderStrong: 'rgba(255, 255, 255, 0.09)',
    borderHigh: 'rgba(255, 255, 255, 0.1)',
    borderHighest: 'rgba(255, 255, 255, 0.12)',
    divider: 'rgba(255, 255, 255, 0.05)',
    dividerSubtle: 'rgba(255, 255, 255, 0.04)',

    // Text (white-on-dark) — by descending emphasis
    textHi: 'rgba(255, 255, 255, 0.92)',
    textPrimary: 'rgba(255, 255, 255, 1)',
    textBody: 'rgba(255, 255, 255, 0.9)',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textMuted: 'rgba(255, 255, 255, 0.78)',
    textTertiary: 'rgba(255, 255, 255, 0.7)',
    textSubtle: 'rgba(255, 255, 255, 0.65)',
    textTertiary2: 'rgba(255, 255, 255, 0.6)',
    textSofter: 'rgba(255, 255, 255, 0.55)',
    textDim: 'rgba(255, 255, 255, 0.5)',
    textFaint: 'rgba(255, 255, 255, 0.45)',
    textFainter: 'rgba(255, 255, 255, 0.4)',
    textGhost: 'rgba(255, 255, 255, 0.38)',
    textHint: 'rgba(255, 255, 255, 0.36)',
    textWhisper: 'rgba(255, 255, 255, 0.35)',
    textTrace: 'rgba(255, 255, 255, 0.32)',
    textPlaceholder: 'rgba(255, 255, 255, 0.28)',
    textPlaceholderSofter: 'rgba(255, 255, 255, 0.25)',
    textOverlay: 'rgba(255, 255, 255, 0.18)',

    // Black scrim/overlays (over images etc.)
    scrimLight: 'rgba(0, 0, 0, 0.18)',
    scrimSoft: 'rgba(0, 0, 0, 0.38)',
    scrimMedium: 'rgba(0, 0, 0, 0.45)',
    scrim: 'rgba(0, 0, 0, 0.5)',
    scrimStrong: 'rgba(0, 0, 0, 0.55)',
  },

  // Accent palette — semantic brand & status colors used throughout dark UI.
  // Base tones use hex so callers can append alpha via template literals
  // (e.g. `${colors.Accent.blue}cc`). Pre-mixed alpha variants are listed
  // explicitly below each base tone.
  Accent: {
    // Brand blue (same family as primary[500])
    blue: '#3A6FF8',
    blueGlowSoft: 'rgba(58, 111, 248, 0.05)',
    blueGlowSubtle: 'rgba(58, 111, 248, 0.08)',
    blueGlow: 'rgba(58, 111, 248, 0.12)',
    blueGlowStrong: 'rgba(58, 111, 248, 0.15)',
    blueGlowExtra: 'rgba(58, 111, 248, 0.18)',
    blueBorder: 'rgba(58, 111, 248, 0.2)',
    blueBorderHover: 'rgba(58, 111, 248, 0.25)',
    blueBorderStrong: 'rgba(58, 111, 248, 0.3)',
    bluePressed: 'rgba(58, 111, 248, 0.32)',
    blueDisabled: 'rgba(58, 111, 248, 0.25)',
    blueActive: 'rgba(58, 111, 248, 0.6)',

    // Streak / warning orange
    streak: '#F8B23A',
    streakAmber: '#F8B73A',
    streakGlowSubtle: 'rgba(248, 178, 58, 0.08)',
    streakGlowSoft: 'rgba(248, 178, 58, 0.1)',
    streakGlow: 'rgba(248, 178, 58, 0.12)',
    streakGlowStrong: 'rgba(248, 178, 58, 0.15)',
    streakGlowExtra: 'rgba(248, 178, 58, 0.18)',
    streakGlowBright: 'rgba(248, 178, 58, 0.2)',
    streakBorderHover: 'rgba(248, 178, 58, 0.25)',
    streakBorderHi: 'rgba(248, 178, 58, 0.35)',
    streakBorder: 'rgba(248, 178, 58, 0.4)',

    // Burnt orange (trending pill)
    burnt: 'rgba(248, 71, 23, 0.12)',
    burntBorder: 'rgba(248, 71, 23, 0.4)',

    // Danger / hot pink
    danger: '#F83A6F',

    // Shipping mint
    shippingGreen: '#3AF89A',

    // Green (success / online)
    green: '#22C55E',
    greenGlow: 'rgba(34, 197, 94, 0.1)',
    greenGlowStrong: 'rgba(34, 197, 94, 0.12)',
    greenBorder: 'rgba(34, 197, 94, 0.3)',
    greenBorderStrong: 'rgba(34, 197, 94, 0.4)',

    // Timeline / category palette
    violet: '#A855F7',
    violetGlow: 'rgba(168, 85, 247, 0.12)',
    emerald: '#10B981',
    red: '#EF4444',
    redGlow: 'rgba(239, 68, 68, 0.12)',
    amber: '#F59E0B',
    amberGlow: 'rgba(245, 158, 11, 0.12)',
    blueBright: '#3B82F6',
    pink: '#EC4899',
    pinkGlow: 'rgba(236, 72, 153, 0.12)',
    cyan: '#06B6D4',
    purple: '#8B5CF6',
    grey: '#6B7280',
  },
};

const darkTheme = {
  primary: {
    50: 'rgba(41, 28, 22, 1)',
    100: 'rgba(154, 25, 18, 1)',
    200: 'rgba(193, 30, 13, 1)',
    300: 'rgba(233, 45, 13, 1)',
    400: 'rgba(224, 79, 40, 1)',
    500: 'rgba(248, 71, 23, 1)',
    600: 'rgba(253, 159, 116, 1)',
    700: 'rgba(254, 199, 170, 1)',
    800: 'rgba(255, 229, 213, 1)',
    900: 'rgba(255, 243, 237, 1)',
  },
  Greyscale: {
    0: 'rgba(26, 26, 26, 1)',
    25: 'rgba(252, 252, 252, 1)',
    50: 'rgba(39, 40, 53, 1)',
    100: 'rgba(54, 57, 74, 1)',
    200: 'rgba(44, 44, 48, 1)',
    300: 'rgba(129, 136, 152, 1)',
    400: 'rgba(112, 112, 123, 1)',
    500: 'rgba(160, 160, 171, 1)',
    600: 'rgba(223, 225, 231, 1)',
    700: 'rgba(250, 250, 250, 1)',
    800: 'rgba(252, 252, 252, 1)',
    900: 'rgba(252, 252, 252, 1)',
  },
  Additional: {
    Sky: {
      0: 'rgba(12, 78, 110, 1)',
      25: 'rgba(17, 107, 151, 1)',
      50: 'rgba(51, 207, 255, 1)',
      100: 'rgba(126, 221, 241, 1)',
      200: 'rgba(209, 240, 250, 1)',
      300: 'rgba(240, 251, 255, 1)',
    },
  },
  Alert: {
    Success: {
      0: 'rgba(24, 78, 68, 1)',
      25: 'rgba(40, 128, 111, 1)',
      50: 'rgba(64, 196, 170, 1)',
      100: 'rgba(158, 225, 212, 1)',
      200: 'rgba(221, 243, 239, 1)',
      300: 'rgba(239, 254, 250, 1)',
    },
    Warning: {
      0: 'rgba(92, 61, 31, 1)',
      25: 'rgba(150, 100, 34, 1)',
      50: 'rgba(255, 190, 76, 1)',
      100: 'rgba(252, 218, 131, 1)',
      200: 'rgba(250, 237, 204, 1)',
      300: 'rgba(92, 61, 31, 1)',
    },
    Error: {
      0: 'rgba(113, 14, 33, 1)',
      25: 'rgba(150, 19, 44, 1)',
      50: 'rgba(223, 28, 65, 1)',
      100: 'rgba(223, 28, 65, 1)',
      200: 'rgba(250, 219, 225, 1)',
      300: 'rgba(255, 240, 243, 1)',
    },
  },
  Others: {
    white: 'rgba(255, 255, 255, 1)',
    DarkForeground: 'rgba(30, 30, 30, 1)',
  },
};

// export const useColors = () => {
//   const { isDark } = useTheme();
//   return isDark ? darkTheme : lightTheme;
// };

// export const colors = lightTheme;

export { colors };
