# Foundora — Project & Scope

> **One-liner:** A mobile-first social network where solo founders and indie builders document what they ship every day, follow each other's journeys, and draw inspiration from the timelines of legendary founders.
>
> Think **"Instagram + Indie Hackers + Strava" for people building things.**

---

## 1. The Problem

Building a startup or side project alone is isolating. The existing options are fragmented:

- **Twitter/X** — great reach, but signal drowns in noise; no structure for "what I shipped today."
- **Indie Hackers / Reddit** — good discussions, but slow, forum-shaped, not a daily habit.
- **Personal blogs / changelogs** — high friction, nobody sees them.
- **Discord/Slack communities** — ephemeral, hard to follow one person's arc over months.

None of them give a builder a **daily, low-friction posting habit + a followable progress timeline + an accountability community** in one place.

## 2. What Foundora Is

Foundora makes "building in public" a daily ritual. The core loop:

1. **Post your progress** — a short update tagged with a *mood* (productive ⚡, shipping 🚢, learning 📚, struggling 🌧️), optionally with an image, tech stack, and project.
2. **Build a streak** — consistent daily posting is rewarded and surfaced on a leaderboard.
3. **Follow other builders** — a feed of what people you follow shipped, plus suggestions.
4. **Get inspired** — explore deep, milestone-by-milestone timelines of famous founders.
5. **Connect** — comment on posts and DM other builders 1:1.

**Target user:** solo founders, indie hackers, side-project builders, and early-stage startup teams who want to document their journey and stay accountable.

## 3. Current Status (snapshot)

This is an **active-development MVP**. The UI flows are largely built and polished; the backend is wired but most screens still render from mock/static data while auth and the database schema are finished.

| Area | State |
|------|-------|
| Navigation & screens | ✅ Built (stack + 5-tab bottom nav) |
| Design system (dark theme) | ✅ Mature color/font/text/shadow tokens |
| Onboarding (phone → OTP → profile) | ✅ Multi-step UI built |
| Feed, leaderboard, messaging, comments | ✅ UI built on mock data |
| Founder timelines | ✅ Built from static `founders.json` |
| Supabase client | ✅ Wired, with a graceful "unconfigured" stub fallback |
| Real auth + DB queries | ⚠️ In progress — uses `MOCK_USER_ID` and mock data |
| Image upload, push, analytics | ❌ Not yet wired |

## 4. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | **Expo** (managed) + React Native 0.85 |
| Language | TypeScript 6 |
| React | 19 |
| Navigation | `@react-navigation` v7 — Stack + Bottom Tabs |
| Backend | **Supabase** (`@supabase/supabase-js` v2) |
| Local storage | `@react-native-async-storage/async-storage` (Supabase auth adapter) |
| Icons | `@react-native-vector-icons` (Lucide, FontAwesome6, Material Design) |
| Vector / SVG | `react-native-svg` (custom icon components in `assets/icons/`) |
| Media | `expo-image-picker` |
| Date input | `@react-native-community/datetimepicker` |
| Tests | Jest + react-test-renderer |
| Node | ≥ 20 |

> **Note:** The repo recently migrated from the React Native CLI to **Expo** (see commit `ad1692c`). `app.json` is now an Expo config (`slug: foundertrack`, dark `userInterfaceStyle`, expo-splash/expo-font plugins). There is no longer a checked-in `android/`/`ios/` native project to maintain by hand.

## 5. App Map

**Root stack** ([app/navigation/index.tsx](app/navigation/index.tsx)):

```
Splash → Login → Otp → BasicInfo → TabNavigator
                                      ├─ Settings
                                      ├─ Leaderboard
                                      ├─ Inbox → Chat
                                      └─ Comments
```

**Bottom tabs:**

```
[Home]  [Timeline]  [ + AddPost ]  [Alerts]  [Profile]
```

### Screens

| Screen | File | Purpose |
|--------|------|---------|
| Splash | [splashScreen.tsx](app/screens/splash/splashScreen.tsx) | Boot / (future) auth routing |
| Login | [login.tsx](app/screens/login/login.tsx) | Multi-step signup: phone → DOB → builder type → tagline → availability |
| OTP | [otp.tsx](app/screens/login/otp.tsx) | 6-digit code + resend timer |
| BasicInfo | [basicInfoScreen.tsx](app/screens/profile/basicInfoScreen.tsx) | Profile onboarding details |
| Home | [home.tsx](app/screens/bottomNavigation/home.tsx) | Feed: posts, moods, likes, follow suggestions, streaks, pull-to-refresh |
| Timeline | [timeline.tsx](app/screens/bottomNavigation/timeline.tsx) | Founder explorer cards |
| AddPost | [addPost.tsx](app/screens/bottomNavigation/addPost.tsx) | Compose a progress post |
| Notifications | [notifications.tsx](app/screens/bottomNavigation/notifications.tsx) | Activity / alerts |
| Profile | [profile.tsx](app/screens/bottomNavigation/profile.tsx) | Avatar, bio, post grid |
| FounderDetail | [FounderDetailScreen.tsx](app/screens/timeline/FounderDetailScreen.tsx) | Milestone-by-milestone founder deep dive |
| Leaderboard | [leaderboardScreen.tsx](app/screens/leaderboard/leaderboardScreen.tsx) | Streak / ranking board |
| Inbox | [inboxScreen.tsx](app/screens/messages/inboxScreen.tsx) | DM conversation list + active-now |
| Chat | [chatScreen.tsx](app/screens/messages/chatScreen.tsx) | 1:1 message thread |
| Comments | [commentsScreen.tsx](app/screens/comments/commentsScreen.tsx) | Threaded comments on a post |
| Settings | [settingScreen.tsx](app/screens/settings/settingScreen.tsx) | Notifications, help, feedback, logout |

## 6. Architecture & Conventions

- **State:** React Context + local `useState`. No Redux/Zustand. `ThemeContext` exists but is dark-only today.
- **Styling:** Centralized tokens in [app/styles/](app/styles/) — `colors`, `fonts`, `texts`, `shadow`. Screens pull `colors.Dark.*` and `colors.Accent.*` into local consts at the top of each file. Sizing goes through a `scale()` helper ([app/helpers/scaler.ts](app/helpers/scaler.ts)) for responsive layout.
- **Avatars:** Centralized in [app/helpers/avatars.ts](app/helpers/avatars.ts) (`avatarFor`, `ME_AVATAR`).
- **Data today:** Mock/static modules under [app/data/](app/data/) (`mockPosts`, `mockMessages`, `mockComments`, `founders.json`) and [assets/staticData/](assets/staticData/). Screens are written so that when Supabase isn't configured, the client returns a safe "unconfigured" result and the UI falls back to mock data.
- **Backend client:** [app/lib/supabase.ts](app/lib/supabase.ts) builds a real client when `env.js` holds valid creds, otherwise a **stub client** so the app still renders. `MOCK_USER_ID` stands in for the signed-in user until auth is wired.

## 7. Data Model (target)

Not yet under version control as migrations — this is the intended shape implied by the screens:

- `profiles` — builder identity, tagline, builder type, avatar, links
- `posts` — text, mood, project ref, image, tech stack, timestamps
- `follows` — follower/followee edges
- `likes`, `comments` — post engagement
- `streaks` — `current_streak`, `best_streak` per user
- `conversations` / `messages` — DMs
- `founders` / `founder_timeline_events` — currently static JSON, eventually DB-backed

## 8. Build & Run

```bash
npm install            # install deps
npm start              # Expo dev server (Metro)
npm run ios            # build & run iOS
npm run android        # build & run Android
npm run lint           # eslint
npm test               # jest
```

To enable the live backend, set real values in `env.js`:

```js
export const SUPABASE_URL = 'https://<project>.supabase.co';
export const SUPABASE_ANON_KEY = '<anon-key>';
```

Until then the app runs fully on mock data.

## 9. Out of Scope (for the MVP)

- Web client (Expo web favicon is configured but the product is mobile-first).
- Light theme (the design is intentionally dark-only for now).
- Monetization / paid tiers.
- Real-time presence beyond the mocked "active now" UI.

## 10. Known Gaps / Risks

| # | Gap | Severity |
|---|-----|----------|
| 1 | Real auth not wired — `MOCK_USER_ID` in use | 🔴 |
| 2 | No DB migrations/schema checked into the repo | 🟠 |
| 3 | Most screens still render mock data | 🟠 |
| 4 | Image upload UI exists but no Storage integration | 🟠 |
| 5 | Push notifications, analytics, crash reporting absent | 🟠 |
| 6 | No CI/CD or EAS build config | 🟡 |
| 7 | Test coverage near zero (single smoke test) | 🟡 |

> For the product direction that differentiates Foundora from generic social apps, see **[UNIQUE_FEATURES.md](UNIQUE_FEATURES.md)**.
