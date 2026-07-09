# FounderGrid — Production Roadmap & Feature Plan

> Companion to [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md). This doc is split into two halves:
>
> 1. **Production hardening** — what must be in place before App Store / Play Store submission
> 2. **Feature roadmap** — new functionality to build, organized by phase

---

# Part 1 — Production Hardening

## P0 (Blockers — do before any public release)

### 1. Secrets & environment management 🔴
**Problem**: Supabase URL & anon key are hardcoded in [env.js](env.js) and committed to git.

**Fix**:
- Install `react-native-config` (recommended) or `react-native-dotenv`
- Create `.env.development`, `.env.staging`, `.env.production`
- Rotate the existing Supabase anon key (it's compromised once it ships in source)
- Add `.env*` to `.gitignore`; keep only `.env.example`
- Reference keys via `Config.SUPABASE_URL` instead of imports

```bash
npm install react-native-config
# iOS pod install required
```

### 2. Real authentication flow 🔴
**Problem**: `MOCK_USER_ID = '00000000-...'` bypasses auth entirely.

**Fix**:
- Implement Supabase phone-based OTP using `supabase.auth.signInWithOtp({ phone })` and `verifyOtp({ phone, token, type: 'sms' })`
- Persist session via the existing AsyncStorage adapter
- Add `onAuthStateChange` listener at app root → drives navigation
- Splash screen reads session and routes to either Login or TabNavigator
- Change `initialRouteName` from `BasicInfo` → `Splash`

### 3. Database schema under version control 🔴
**Problem**: No `supabase/` directory, no migrations.

**Fix**:
```
supabase/
├── migrations/
│   ├── 0001_init_users.sql
│   ├── 0002_posts_and_moods.sql
│   ├── 0003_follows.sql
│   ├── 0004_notifications.sql
│   └── 0005_rls_policies.sql
├── seed.sql
└── config.toml
```
Tables to define: `profiles`, `posts`, `post_likes`, `post_comments`, `follows`, `notifications`, `streaks`, `founders` (migrate from JSON).
Enable **Row Level Security** on every table from day one.

### 4. Error tracking & crash reporting 🔴
**Choose one**:
- **Sentry** (recommended) — `@sentry/react-native`, source maps, performance, replays
- Bugsnag — simpler pricing
- Firebase Crashlytics — free, less RN-friendly

```bash
npm install @sentry/react-native
npx @sentry/wizard@latest -i reactNative
```
Wrap `App` in `Sentry.wrap(App)`, add user context after login, tag releases.

### 5. CI/CD pipeline 🔴
Create `.github/workflows/`:

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `ci.yml` | PR to `main` | lint, typecheck, test, build (both platforms) |
| `release-ios.yml` | tag `v*` | EAS Build → TestFlight |
| `release-android.yml` | tag `v*` | EAS Build → Play Console internal track |

Recommended: **EAS Build** (Expo) even for bare RN — handles signing, certificates, OTA.

---

## P1 (Required before scaling beyond beta)

### 6. Analytics
**Pick one** (in priority order):
1. **PostHog** — free up to 1M events, product analytics + session replay
2. **Amplitude** — generous free tier, great cohort analysis
3. **Mixpanel** — strong funnel analysis

Track baseline events: `app_open`, `signup_started`, `signup_completed`, `post_created`, `post_liked`, `follow_added`, `screen_view`.

### 7. Push notifications
- **iOS**: APNs via Apple Developer account
- **Android**: Firebase Cloud Messaging (FCM)
- **Library**: `@react-native-firebase/messaging` + `notifee` for local
- Server-side: Supabase Edge Function triggers FCM on `notifications` insert
- Settings screen toggles already exist — wire them up

### 8. Deep linking
Configure `linking` in `NavigationContainer`:
```ts
const linking = {
  prefixes: ['foundergrid://', 'https://foundergrid.app'],
  config: { screens: { Profile: 'u/:username', Post: 'p/:id' } }
}
```
Add Universal Links (iOS) + App Links (Android) verification files.

### 9. Secure storage for tokens
**Replace** AsyncStorage for sensitive data with:
- `react-native-keychain` (iOS Keychain + Android Keystore), OR
- `expo-secure-store` if leaning on EAS

Keep AsyncStorage for non-sensitive prefs (theme, last-seen feed, etc.).

### 10. Permissions & native config
- iOS Info.plist — add usage descriptions:
  - `NSCameraUsageDescription` — "FounderGrid uses your camera to attach photos to posts"
  - `NSPhotoLibraryUsageDescription`
  - `NSPhotoLibraryAddUsageDescription`
  - (later) `NSContactsUsageDescription` — for finding builders to follow
- Android — add to manifest as needed: `CAMERA`, `READ_MEDIA_IMAGES` (Android 13+), `POST_NOTIFICATIONS`

### 11. Build configurations
- **iOS**: separate schemes/configs for Dev / Staging / Prod (different bundle IDs, icons, names)
- **Android**: product flavors with `applicationIdSuffix` for dev/staging
- App icon + splash screen polish (use `react-native-bootsplash`)

### 12. Testing strategy
| Layer | Tool | Target |
|-------|------|--------|
| Unit | Jest + React Native Testing Library | 60%+ on helpers, components |
| Integration | RNTL with mocked Supabase | All major screens render & interact |
| E2E | Detox or Maestro | Auth → Post → Like → Follow happy path |

### 13. Performance baseline
- Add Sentry Performance or Firebase Performance Monitoring
- Wrap heavy lists in `FlatList`/`FlashList` (currently unknown if used in feed)
- Add `React.memo` on feed cards
- Image optimization: `react-native-fast-image`

---

## P2 (Nice-to-have, do incrementally)

### 14. OTA updates
- **EAS Update** (recommended) — push JS-only fixes without store review
- Or Microsoft CodePush (deprecating; avoid for new projects)

### 15. Feature flags & A/B testing
- **GrowthBook** (open source, self-host) or **PostHog feature flags**
- First flag candidates: experimental UI, founder content type, notification cadence

### 16. Biometric auth
- `react-native-keychain` already supports Face ID / Touch ID / fingerprint gate on session unlock
- Add toggle in Settings

### 17. Offline support
- Cache feed in AsyncStorage / MMKV (`react-native-mmkv` is faster)
- Queue post creates when offline, retry on reconnect
- Use `@react-native-community/netinfo` for connection state

### 18. Accessibility
- Run a11y audit with React Native Accessibility Inspector
- Add `accessibilityLabel`, `accessibilityRole` to all interactive elements
- Test with VoiceOver (iOS) and TalkBack (Android)
- Color contrast: verify against WCAG AA on dark theme

### 19. Internationalization (i18n)
- `react-i18next` or `lingui`
- Even if only English at launch, structure copy for future locales
- Date formatting: `date-fns` with locale support

### 20. Legal & store readiness
- **Privacy Policy** (required by both stores)
- **Terms of Service**
- Apple App Privacy nutrition labels
- Google Play Data Safety form
- App Store Connect screenshots (6.5", 5.5"), Play Console graphics
- Age rating questionnaire — likely 13+ (matches in-app age gate)

---

# Part 2 — Feature Roadmap

## Phase 1 — Wire up existing UI (1–2 weeks)

The screens exist but talk to mock data. Connect them to Supabase.

| # | Feature | Tables | Notes |
|---|---------|--------|-------|
| 1.1 | Real auth (phone OTP) | — | See P0 #2 |
| 1.2 | Profile create on signup | `profiles` | Captures builder type, tagline, availability from BasicInfo |
| 1.3 | Post create from AddPost | `posts` + Supabase Storage | Image upload via signed URLs |
| 1.4 | Home feed query | `posts` join `profiles` | Order by `created_at DESC`, paginate (cursor) |
| 1.5 | Like / unlike | `post_likes` | Optimistic UI |
| 1.6 | Comment thread | `post_comments` | Phase 1 = flat list, threading later |
| 1.7 | Follow / unfollow | `follows` | Profile screen + suggestions card |
| 1.8 | Notifications feed | `notifications` | Trigger via DB triggers/Edge Function |
| 1.9 | Founders → DB | `founders`, `founder_events` | Migrate `founders.json` |

---

## Phase 2 — Core social loops (3–4 weeks)

### 2.1 Streaks system
- Daily-post streak counter visible on Home + Profile
- Cron Edge Function resets at user's local midnight (use timezone in profile)
- Push when streak about to break ("post today to keep your 7-day streak!")

### 2.2 Mood analytics
- Personal dashboard: weekly mood distribution chart
- "What does shipping week feel like?" — aggregate mood patterns

### 2.3 Discovery / Explore
- New tab or screen surfacing:
  - Trending posts (likes per hour)
  - Builders you might follow (similar builder type / mood)
  - "Today's shipping" filter

### 2.4 Search
- Search builders by handle, name, builder type, tagline
- Search posts by hashtag (introduce `#tags` parsing)

### 2.5 Direct messaging
- 1:1 DMs between followed builders
- Use Supabase Realtime for live updates
- Tables: `conversations`, `messages`

### 2.6 Mentions & replies
- Parse `@username` in post content
- Notification on mention
- Tap mention → profile

---

## Phase 3 — Engagement & retention (4–6 weeks)

### 3.1 Builder challenges
- Time-boxed challenges ("Ship something in 7 days")
- Leaderboards
- Badges / achievements

### 3.2 Weekly digest
- Push or email Sunday recap: posts you missed, top builders, milestones

### 3.3 Saved posts / collections
- Bookmark icon → personal saved feed
- Optionally: named collections (e.g. "design inspiration")

### 3.4 Reactions beyond likes
- Reactions: 🔥 (shipping), 💪 (motivating), 💡 (helpful), ❤️ (love)
- Mood-themed reaction set

### 3.5 Founder timeline expansions
- Add 10–20 more founders (Jobs, Bezos, Patrick Collison, Sara Blakely…)
- User-submitted timeline corrections (moderated)
- Comparison view: side-by-side timelines

### 3.6 Onboarding interest selection
- After BasicInfo, ask "what topics interest you?" (e.g. SaaS, AI, mobile, hardware)
- Seeds initial follow suggestions and feed

---

## Phase 4 — Power features (longer-term)

### 4.1 Web app companion
- Read-only public profile pages at `foundergrid.app/u/:username`
- Helps with sharing, SEO, deep-link landing pages

### 4.2 Builder spotlights
- Editorial weekly featured builder
- Long-form Q&A format

### 4.3 Goals & milestones
- Personal goals tracking ("ship MVP by Aug 15")
- Public progress %, milestone celebration posts

### 4.4 Communities / Groups
- Topic-based communities (Solo SaaS, Hardware, Indie Game Dev)
- Group-specific feeds + members

### 4.5 Audio / video posts
- Short voice notes (à la Twitter Spaces clip)
- Loom-style video demos for shipping moments

### 4.6 Monetization (only after PMF)
- **FounderGrid Pro**: advanced analytics, custom badge, profile customization
- **Sponsored posts** for relevant SaaS tools
- Avoid ads in feed — kills the builder vibe

### 4.7 Integrations
- GitHub: auto-post when you ship a release
- Stripe: post when you hit revenue milestones (opt-in, anonymized $ optional)
- Twitter/X cross-posting
- Lemon Squeezy / Gumroad: revenue milestones

### 4.8 AI assists
- Mood detection from post text (suggest mood tag)
- Weekly reflection generated from your posts
- Translate posts to user's preferred language

---

## Suggested execution order

```
Week 1–2  : P0 hardening (env, auth, schema, Sentry, CI)
Week 3–4  : Phase 1 wire-up (real Supabase queries replace mocks)
Week 5    : P1 — analytics, push, deep linking
Week 6–8  : Phase 2 — streaks, discovery, DMs
Week 9    : P1 — testing, perf, store assets
Week 10   : Closed beta (TestFlight + Play internal track)
Week 11–12: Iterate from beta feedback, add Phase 3 highlights
Week 13   : Public launch
Phase 4   : Post-launch, prioritized by usage data
```

---

## Open questions for the team

1. **Monetization timeline** — free forever, or freemium from day 1?
2. **Founder content** — editorial-curated or community-submitted with moderation?
3. **Username system** — handles like `@anmol` or just display names?
4. **Web presence** — RN-only or do we want a Next.js companion site?
5. **Region** — global launch or geographic phasing? (affects compliance work — GDPR, etc.)
6. **Support stack** — Intercom? Crisp? Or just an email link?

---

## Quick-win starter PRs

If picking the smallest meaningful PRs to ship first:

1. **Move Supabase keys to `.env`** (1 hour) — security must-fix
2. **Splash → auth-aware routing** (2 hours) — fixes initial route bug
3. **Add Sentry** (3 hours) — instant visibility into crashes
4. **Wire up post creation to Supabase** (1 day) — biggest user-visible feature gap
5. **Add `.github/workflows/ci.yml`** (2 hours) — lint + test on every PR
