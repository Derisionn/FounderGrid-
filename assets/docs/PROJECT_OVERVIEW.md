# FounderGrid — Project Overview

> A React Native mobile app for builders/founders to share progress, follow other builders, and explore founder timelines. Currently in active development with core UI flows in place but production essentials missing.

---

## 1. What FounderGrid Is

FounderGrid is a **builder-focused social mobile app** (think "Instagram meets Indie Hackers" for solo founders, indie builders, and entrepreneurs). The MVP centers on:

- **Daily progress posts** with mood tagging (productive ⚡, shipping 🚢, learning 📚, struggling 🌧️)
- **Follow & feed system** to discover other builders
- **Founder timeline explorer** — biographical journeys of well-known founders (Zuckerberg, Musk) with milestones, quotes, and stats as inspiration
- **Multi-step onboarding** capturing builder type, tagline, and availability
- **Streaks & engagement** to encourage consistent posting

**Target user**: solo founders, indie builders, side-project hackers documenting their journey.

---

## 2. Tech Stack

| Layer | Stack |
|-------|-------|
| **Framework** | React Native 0.82.1 |
| **Language** | TypeScript 5.8.3 |
| **React** | 19.1.1 |
| **Navigation** | `@react-navigation/native` v7 (Stack + Bottom Tabs) |
| **Backend** | Supabase (`@supabase/supabase-js` v2.105.3) |
| **Storage** | `@react-native-async-storage/async-storage` |
| **Icons** | `@react-native-vector-icons` (Lucide, FontAwesome6, MaterialDesign) |
| **SVG** | `react-native-svg` |
| **Gestures** | `react-native-gesture-handler`, `react-native-screens` |
| **Date Picker** | `@react-native-community/datetimepicker` |
| **Tests** | Jest + react-test-renderer |
| **Node** | >= 20 |

---

## 3. Directory Structure

```
technician-v2/
├── App.tsx                      # Root: SafeAreaProvider + NavigationContainer (DarkTheme)
├── index.js                     # RN entry
├── env.js                       # Hardcoded Supabase URL & anon key (⚠️ leak risk)
├── app.json                     # name="FounderGrid"
├── app/
│   ├── navigation/              # Single-file Stack + Tab config
│   ├── screens/
│   │   ├── splash/              # Boot screen
│   │   ├── login/               # Phone + OTP + multi-step signup
│   │   ├── profile/             # BasicInfo onboarding
│   │   ├── bottomNavigation/    # Home, Timeline, AddPost, Notifications, Profile
│   │   ├── timeline/            # FounderDetail screen
│   │   └── settings/            # SettingScreen
│   ├── components/
│   │   ├── base/                # Button, Spacer (V/H)
│   │   └── timeline/            # FounderSuggestionCard, TimelineItem, etc.
│   ├── data/founders.json       # Static founder dataset (Zuckerberg, Musk)
│   ├── helpers/                 # Utility helpers
│   ├── lib/supabase.ts          # Supabase client setup (AsyncStorage adapter)
│   ├── styles/                  # colors, fonts, texts, shadow tokens
│   └── theme/ThemeContext.tsx   # Dark-mode-only context
├── assets/
│   ├── fonts/
│   ├── icons/                   # Custom SVG icon components (e.g. SettingIcon.tsx)
│   └── staticData/
├── android/                     # Native Android project
├── ios/                         # Native iOS project
└── __tests__/App.test.tsx       # Single smoke test
```

---

## 4. Navigation Map

**Root Stack** ([app/navigation/index.tsx](app/navigation/index.tsx)):

```
Splash → Login → OTP → BasicInfo → TabNavigator → Settings
```

**Bottom Tab Navigator** (5 tabs):

```
[Home]  [Timeline]  [AddPost (FAB)]  [Notifications]  [Profile]
```

> ⚠️ `initialRouteName` is hardcoded to `BasicInfo` — should be `Splash` for production so we can route based on auth state.

---

## 5. Screens — What Exists

| Screen | File | State |
|--------|------|-------|
| Splash | [splashScreen.tsx](app/screens/splash/splashScreen.tsx) | Skeleton — no auth check yet |
| Login | [login.tsx](app/screens/login/login.tsx) | Multi-step (phone → DOB → builder type → tagline → availability) |
| OTP | [otp.tsx](app/screens/login/otp.tsx) | 6-digit input + 30s resend timer |
| BasicInfo | [basicInfoScreen.tsx](app/screens/profile/basicInfoScreen.tsx) | Onboarding details with animations |
| Home | [home.tsx](app/screens/bottomNavigation/home.tsx) | Feed: posts, mood tags, like/comment, follow suggestions, streaks |
| Timeline | [timeline.tsx](app/screens/bottomNavigation/timeline.tsx) | Founder explorer cards (mock data) |
| AddPost | [addPost.tsx](app/screens/bottomNavigation/addPost.tsx) | Compose UI (no upload wired) |
| Notifications | [notifications.tsx](app/screens/bottomNavigation/notifications.tsx) | Alerts list (mock data, filter UI) |
| Profile | [profile.tsx](app/screens/bottomNavigation/profile.tsx) | User profile: avatar, bio, posts grid |
| FounderDetail | [FounderDetailScreen.tsx](app/screens/timeline/FounderDetailScreen.tsx) | Deep-dive timeline with milestones + quotes |
| Settings | [settingScreen.tsx](app/screens/settings/settingScreen.tsx) | Push toggles, help, feedback, logout |

---

## 6. Data Layer

| Aspect | Status |
|--------|--------|
| **Supabase client** | ✅ Set up in [app/lib/supabase.ts](app/lib/supabase.ts) with AsyncStorage adapter |
| **Auth** | ❌ Not integrated — uses hardcoded `MOCK_USER_ID = '00000000-0000-0000-0000-000000000001'` |
| **Database schema** | ❌ Not defined in repo (no migrations, no SQL files) |
| **API queries** | ❌ Zero `supabase.from(...)` calls anywhere in screens |
| **Static data** | [app/data/founders.json](app/data/founders.json) — 2 founders, ~20 timeline events each |
| **Image upload** | ❌ AddPost UI exists, but no Storage integration |

---

## 7. State Management

- **Pattern**: React Context + local `useState`
- **Theme context**: [app/theme/ThemeContext.tsx](app/theme/ThemeContext.tsx) (dark-only, toggle is a no-op)
- **No Redux / Zustand / Recoil / Jotai**
- **AsyncStorage**: only used by Supabase auth adapter — not yet for app state

---

## 8. Design System

| File | Coverage |
|------|----------|
| [colors.tsx](app/styles/colors.tsx) | Full palette: primary blues 50–900, greyscale, success/warning/error, sky accents |
| [fonts.tsx](app/styles/fonts.tsx) | Typography scales |
| [texts.tsx](app/styles/texts.tsx) | Text style presets |
| [shadow.tsx](app/styles/shadow.tsx) | Shadow utilities |

**Aesthetic**: Dark-first UI (`#1C1C1E` / `#0D0D12` backgrounds, accent `#3A6FF8`).
**Missing**: spacing scale tokens, animation curves, motion primitives, light theme.

---

## 9. Native Configuration

### Android ([AndroidManifest.xml](android/app/src/main/AndroidManifest.xml))
- Permissions: `INTERNET`, `READ_EXTERNAL_STORAGE`
- App name: FounderGrid
- Default launcher icon (`ic_launcher`)

### iOS
- Bundle name: FounderGrid
- No camera/photo/notification capability descriptions yet

---

## 10. Testing & CI

- **Unit tests**: 1 smoke test in [__tests__/App.test.tsx](__tests__/App.test.tsx) — basic "renders correctly"
- **Integration / E2E**: None
- **CI/CD**: No `.github/workflows/`, no Fastlane lanes, no EAS config
- **Coverage**: ~0%

---

## 11. Build & Run

```bash
# Install
npm install
cd ios && bundle install && bundle exec pod install && cd ..

# Run
npm start            # Metro bundler
npm run ios          # iOS simulator
npm run android      # Android emulator

# Quality
npm run lint
npm test
```

---

## 12. Strengths (Today)

- ✅ Clean navigation structure with typed params
- ✅ Polished multi-step onboarding UX with animations
- ✅ Comprehensive color palette
- ✅ Reusable Spacer/Button base components
- ✅ Supabase client wired (just needs queries)
- ✅ TypeScript throughout

---

## 13. Risks & Gaps

| # | Risk | Severity |
|---|------|----------|
| 1 | Supabase keys hardcoded in [env.js](env.js) (and committed) | 🔴 Critical |
| 2 | Real auth flow not implemented; `MOCK_USER_ID` in use | 🔴 Critical |
| 3 | No DB schema/migrations under version control | 🟠 High |
| 4 | No error/crash tracking (Sentry, etc.) | 🟠 High |
| 5 | No analytics | 🟠 High |
| 6 | Push notifications UI exists but no FCM/APNs setup | 🟠 High |
| 7 | No CI/CD pipeline | 🟠 High |
| 8 | No deep linking | 🟡 Medium |
| 9 | No OTA updates (EAS / CodePush) | 🟡 Medium |
| 10 | No biometric/secure storage | 🟡 Medium |
| 11 | Initial route bypasses auth (`BasicInfo`) | 🟡 Medium |
| 12 | Tests at ~0% coverage | 🟡 Medium |
| 13 | All feed/notifications use mock data | 🟡 Medium |
| 14 | Dark-only forced; toggle is a no-op | 🟢 Low |

See **[PRODUCTION_ROADMAP.md](PRODUCTION_ROADMAP.md)** for the actionable plan to address each.
