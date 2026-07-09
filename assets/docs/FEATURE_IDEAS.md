# FounderGrid — Feature Improvements & New Ideas

> Companion to [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) and [PRODUCTION_ROADMAP.md](PRODUCTION_ROADMAP.md).
> This doc is purely about **product**: improvements to existing screens + net-new feature concepts. Each idea includes the *why*, the *how*, and a rough effort estimate.
>
> Effort key: 🟢 small (≤1 day) · 🟡 medium (2–5 days) · 🔴 large (1–3+ weeks)

---

## Part 1 — Improve What Already Exists

### 1. Login & Onboarding ([login.tsx](app/screens/login/login.tsx))

| # | Improvement | Why | Effort |
|---|-------------|-----|--------|
| 1.1 | **Country code picker** with flag + search | Currently phone input is single field — international users hit friction | 🟡 |
| 1.2 | **Email-as-fallback** auth | Some regions have unreliable SMS; offer magic link via email | 🟡 |
| 1.3 | **Sign in with Apple / Google** | Required by Apple if you have any social login; massive conversion lift | 🟡 |
| 1.4 | **Progress indicator** in multi-step signup | Builders see "Step 2 of 5" — reduces drop-off | 🟢 |
| 1.5 | **Allow back-navigation** between signup steps | Currently can't fix earlier answers | 🟢 |
| 1.6 | **Remember progress on app close** | Persist signup state in AsyncStorage so reopening resumes | 🟢 |
| 1.7 | **OTP auto-fill** | iOS does this for free if input has `textContentType="oneTimeCode"`; Android `autoComplete="sms-otp"` | 🟢 |
| 1.8 | **Username uniqueness check (debounced)** | Show ✅ / ❌ as user types, not on submit | 🟢 |
| 1.9 | **Skip onboarding for returning users** | Splash should detect session and bypass entirely | 🟢 |

---

### 2. Home Feed ([home.tsx](app/screens/bottomNavigation/home.tsx))

| # | Improvement | Why | Effort |
|---|-------------|-----|--------|
| 2.1 | **Pull-to-refresh** | Standard expectation; missing = feels broken | 🟢 |
| 2.2 | **Infinite scroll with cursor pagination** | Currently mock data — needs `posts` table with `created_at` cursor | 🟡 |
| 2.3 | **Optimistic likes** | Tap heart → instant UI update, reconcile on server response | 🟢 |
| 2.4 | **Mood filter chips** at top of feed | "Show me only shipping posts today" | 🟢 |
| 2.5 | **Inline comment preview** | Show top 1–2 comments under each post like Twitter | 🟡 |
| 2.6 | **Sticky mood-of-the-day banner** | "What's your mood today?" — primes posting behavior | 🟢 |
| 2.7 | **Empty state with prompts** | "Your feed is empty. Follow these builders to get started." | 🟢 |
| 2.8 | **Long-press post for quick actions** | Save, share, hide, report | 🟡 |
| 2.9 | **"For You" vs "Following" tabs** | Algorithmic feed alongside chronological — drives discovery | 🔴 |
| 2.10| **Smart timestamps** | "2h ago" not "2025-05-10 14:23" | 🟢 |
| 2.11| **Read-state tracking** | Show unread post count when reopening app | 🟡 |

---

### 3. AddPost ([addPost.tsx](app/screens/bottomNavigation/addPost.tsx))

| # | Improvement | Why | Effort |
|---|-------------|-----|--------|
| 3.1 | **Actually upload images** | UI exists but no Storage wiring | 🟡 |
| 3.2 | **Multi-image carousel** (up to 4) | Builders often want before/after shots | 🟡 |
| 3.3 | **Character counter + soft limit** | E.g. 500 chars; show count, gently warn near limit | 🟢 |
| 3.4 | **Drafts** | Save in progress posts to AsyncStorage; restore on reopen | 🟢 |
| 3.5 | **Hashtag autocomplete** | Type `#mvp` → autocomplete from existing tags | 🟡 |
| 3.6 | **@mention autocomplete** | Type `@anm` → list followed builders | 🟡 |
| 3.7 | **Link preview** | Paste a URL → show OG image/title preview before posting | 🟡 |
| 3.8 | **Image filters / cropping** | Inline crop and basic filters (use `react-native-image-crop-picker`) | 🟡 |
| 3.9 | **Post scheduling** | "Post this tomorrow at 9am" — Pro feature later | 🔴 |
| 3.10| **Voice-to-text** | Use native dictation; lowers friction for "I shipped X" style posts | 🟡 |
| 3.11| **Mood inferred from text (AI)** | Suggest a mood based on what they typed; one-tap to accept | 🟡 |

---

### 4. Timeline & Founder Detail ([timeline.tsx](app/screens/bottomNavigation/timeline.tsx), [FounderDetailScreen.tsx](app/screens/timeline/FounderDetailScreen.tsx))

| # | Improvement | Why | Effort |
|---|-------------|-----|--------|
| 4.1 | **More founders** (10+ initially) | 2 is a tech demo, not a feature | 🟡 |
| 4.2 | **Search/filter** by industry, era, gender, country | Diversity matters and helps discovery | 🟡 |
| 4.3 | **Compare two founders side-by-side** | "What were Bezos and Jobs both doing at age 30?" — unique, shareable | 🔴 |
| 4.4 | **Bookmark milestones** | Save inspiring moments to your own collection | 🟡 |
| 4.5 | **"Where I am now" overlay** | Show user's age/years building vs. founder's timeline at same point — emotionally powerful | 🔴 |
| 4.6 | **Daily founder quote** | Push notification with one quote/day from a random founder | 🟢 |
| 4.7 | **Audio narration** | Short ~30s narration of a founder's pivotal moment | 🔴 |
| 4.8 | **Community-suggested edits** | Spot a fact wrong? Suggest a correction (moderated) | 🔴 |
| 4.9 | **Move from JSON → DB** | Required for any of the above | 🟡 |

---

### 5. Notifications ([notifications.tsx](app/screens/bottomNavigation/notifications.tsx))

| # | Improvement | Why | Effort |
|---|-------------|-----|--------|
| 5.1 | **Wire to real data** | Currently mock | 🟡 |
| 5.2 | **Group similar notifications** | "Sarah and 12 others liked your post" instead of 13 separate rows | 🟡 |
| 5.3 | **Mark all as read** button | Inbox zero; small but expected | 🟢 |
| 5.4 | **Granular settings** per type | Likes / comments / follows / mentions — separate toggles | 🟢 |
| 5.5 | **In-app preview** | Tap notification → opens to the relevant post/profile with highlight | 🟢 |
| 5.6 | **Quiet hours** | Don't push between 10pm–8am unless DM | 🟡 |
| 5.7 | **Weekly digest opt-in** | "Catch up on your week" — combats notification fatigue | 🟡 |

---

### 6. Profile ([profile.tsx](app/screens/bottomNavigation/profile.tsx))

| # | Improvement | Why | Effort |
|---|-------------|-----|--------|
| 6.1 | **Edit profile screen** | Currently no way to update bio/tagline | 🟡 |
| 6.2 | **Profile sections / tabs** | Posts · Likes · Saved · Goals — like Twitter profile | 🟡 |
| 6.3 | **Mood history visualization** | Heatmap calendar of moods over last 90 days (GitHub-style) | 🔴 |
| 6.4 | **"What I'm building"** pinned card | Live status: project name, current goal, last shipped | 🟡 |
| 6.5 | **Streak badge** | Visible flame icon with current streak length | 🟢 |
| 6.6 | **External links** | Twitter, GitHub, personal site, Product Hunt | 🟢 |
| 6.7 | **Share profile** | Generate a card image with stats; share to Twitter/IG | 🟡 |
| 6.8 | **Block / mute** | Required for any social product | 🟡 |
| 6.9 | **Public profile QR code** | Generates `foundergrid.app/u/:handle` QR — useful at meetups | 🟢 |

---

### 7. Settings ([settingScreen.tsx](app/screens/settings/settingScreen.tsx))

| # | Improvement | Why | Effort |
|---|-------------|-----|--------|
| 7.1 | **Account section** | Change phone, email, password, delete account (App Store requires deletion path) | 🟡 |
| 7.2 | **Privacy controls** | Public / private profile, who can DM, who can comment | 🟡 |
| 7.3 | **Data export** | GDPR requirement — JSON dump of posts, follows, etc. | 🟡 |
| 7.4 | **Theme toggle** *actually working* | Currently a no-op; add light theme | 🟡 |
| 7.5 | **Language selector** | Even if only English works, structure for i18n | 🟢 |
| 7.6 | **Connected accounts** | GitHub, Twitter, Stripe — for auto-posts | 🔴 |
| 7.7 | **Help center / FAQ** | Inline articles or link out | 🟢 |
| 7.8 | **Send feedback** | Direct form → Supabase or email | 🟢 |
| 7.9 | **About / version / build number** | Required for support; tap version 7x to reveal debug menu | 🟢 |

---

## Part 2 — New Feature Ideas

### A. Daily Build Log 🟡
**What**: A dedicated "today" view at the top of Home — shows a single vertical card per builder you follow with their post(s) for today only. Builds urgency to post; mimics the "story" mental model without being a 24h disappearing story.

**Why**: FounderGrid's core loop is "tell me what builders shipped today." A "Today" lens beats a generic feed for that.

**How**: Query posts where `created_at > today_local_midnight` for followed users, render above the chronological feed.

---

### B. Shipping Streaks Leaderboard 🟡
**What**: Public leaderboard of longest active posting streaks. Filter by builder type (solo/team/agency).

**Why**: Streaks are addictive (Duolingo proved it). Public ranking adds social pressure + bragging rights.

**How**: `streaks` table with `user_id`, `current_streak`, `best_streak`. Cron job at user-local midnight resets if no post yesterday.

**Risk**: Don't make it the *only* thing — risk turning FounderGrid into a streak-anxiety machine. Allow opt-out.

---

### C. Builder Goals & Milestones 🔴
**What**: Users define public goals ("Hit $1k MRR by Aug 15", "Ship MVP in 30 days"). Profile shows progress %. Hitting a milestone auto-posts a celebration with confetti animation.

**Why**: Goal-setting is a known accountability mechanism. Public goals get more support and follow-ups from community.

**How**:
- New `goals` table: `id, user_id, title, target_date, status, metric_type, target_value, current_value`
- Profile screen displays active goals
- Edge Function watches for completion and creates a post

---

### D. Topic Hashtag Pages 🟡
**What**: Tap `#saas` in any post → page showing all posts with that tag, top contributors, related tags.

**Why**: Builds discovery beyond who you follow. Helps FounderGrid become the "search engine for builders working on X."

**How**: Parse `#tag` regex client-side, store in `post_tags` table, build aggregation query.

---

### E. Builder Pairings / Accountability Buddies 🔴
**What**: Weekly opt-in matching with another builder of similar stage. You DM each other every day with what you'll ship that day.

**Why**: Accountability buddies are proven (YC pairs founders this way). FounderGrid is uniquely positioned to provide them.

**How**:
- Opt-in toggle in Settings
- Weekly cron Edge Function pairs eligible users (similar builder type, mood frequency, timezone)
- Surface paired user in dedicated "Buddy" tab for that week

---

### F. Voice / Audio Posts 🔴
**What**: 30-second voice notes attached to posts ("Listen to me explain why I'm pivoting").

**Why**: Lower friction than writing. Adds personality. Differentiates from text-only feed apps.

**How**: `react-native-audio-recorder-player`, upload to Supabase Storage, render with waveform UI.

---

### G. "Yesterday I…" prompts 🟢
**What**: Once a day at user's preferred time, push: "Yesterday you shipped 'feature X'. What did you ship today?" — opens compose pre-filled with context.

**Why**: Reduces blank-page paralysis. Increases posting consistency.

**How**: Cron + push, deep-link into AddPost with previous-post context.

---

### H. Builder Map 🔴
**What**: Opt-in geographic map showing builders by city. Tap a pin → see active builders there.

**Why**: Helps with IRL meetups, finding local co-founders, "is anyone shipping from Berlin tonight?" energy.

**How**: Lat/long stored at city granularity (privacy-safe), `react-native-maps`, clustering for cities.

---

### I. Public Project Pages 🔴
**What**: A user can attach posts to a "project." Project gets its own page — like a Product Hunt page that grows over time. Mini changelog visible publicly.

**Why**: Most builders work on a single thing for months. A project page becomes the canonical link for that work.

**How**:
- `projects` table linked to user
- Posts can optionally tag a project_id
- Public route `/p/:project_slug`

---

### J. Weekly Reflection (AI) 🟡
**What**: Every Sunday, an AI-generated summary of your week's posts: themes, mood patterns, achievements. Private to you (or sharable if you want).

**Why**: Most builders don't journal but want the benefits. FounderGrid already has the data.

**How**: Sunday cron → Edge Function with Anthropic API → store summary → notification.

---

### K. Office Hours / Live Builder Q&A 🔴
**What**: Scheduled live audio rooms (think Twitter Spaces) where a featured builder answers questions for 30 mins.

**Why**: High-engagement event-style feature; brings builders back to the app weekly.

**How**: Use Daily.co or LiveKit RN SDK; add `live_rooms` table.

---

### L. Lessons Learned Library 🟡
**What**: Builders can mark a post as a "lesson learned" — these posts get aggregated into a searchable library by topic.

**Why**: Most valuable FounderGrid content is hard-won lessons. Surfacing them creates a moat (search engine for builder wisdom).

**How**: Add `is_lesson` boolean, separate listing screen with topic filtering.

---

### M. Founder Quote Lock Screen Widget 🟡 (iOS 16+ / Android)
**What**: Lock screen widget with daily quote from a FounderGrid founder.

**Why**: Free distribution; ambient brand presence.

**How**: WidgetKit (iOS) / App Widgets (Android). Use `react-native-widget-extension` or write native.

---

### N. Sharing as Beautiful Cards 🟡
**What**: Generate a designed image card of your post (mood + text + branding) shareable to Twitter/IG/LinkedIn.

**Why**: Free marketing. Makes FounderGrid visible outside the app.

**How**: `react-native-view-shot` + a `<Card />` component that mirrors post design; share via `Share` API.

---

### O. Dashboard Tab — Personal Analytics 🔴
**What**: A new tab/screen showing your stats: post frequency, mood distribution, follower growth chart, engagement rate, streak history, post performance.

**Why**: Builders love metrics. Gives them a reason to open the app even when feed is quiet.

**How**: Aggregation queries; render with `react-native-svg` or `victory-native`.

---

### P. Founder Mode Theme 🟢
**What**: An optional "founder mode" UI theme — denser, terminal-style monospace font, less playful. Complement to default cozy theme.

**Why**: Some users want serious. Theme is also a status / paid-tier perk.

**How**: Extend ThemeContext to support multiple themes, not just dark/light.

---

### Q. Replies-as-DM Promotion 🟢
**What**: When you reply to a post, "Continue this in DM?" CTA appears.

**Why**: Public threads often want to go private; this nudges 1:1 connections.

**How**: Track when reply happens; conditional CTA after X messages.

---

### R. "Help me ship" requests 🟡
**What**: A post type where you tag what you need ("looking for: designer feedback," "looking for: beta testers," "looking for: 5 minutes of a Stripe expert"). Filter feed by these.

**Why**: Builders trade favors constantly. Formalizing it creates a marketplace of micro-help.

**How**: New post field `help_request_type` (enum), filter chip on Home.

---

### S. Bookmarks Become "Inspiration Boards" 🟡
**What**: Collections of saved posts, named by you. Public option turns a board into a curated profile.

**Why**: Pinterest-like layer on top of the feed. Power users love organizing.

**How**: `collections` and `collection_posts` tables; share route.

---

### T. AI Co-Founder ("Ask FounderGrid") 🔴
**What**: A chat interface trained on aggregated lessons-learned + founder timelines. Ask "should I raise or bootstrap?" → grounded answers with links to relevant posts.

**Why**: Highly differentiated. Turns the corpus into a tool, not just content.

**How**: Embed posts/founder content; RAG with Anthropic API; stream responses in a dedicated chat tab.

---

## Part 3 — UX Polish (Quick Wins)

| # | Polish | Effort |
|---|--------|--------|
| U1 | Haptic feedback on like, follow, send (`react-native-haptic-feedback`) | 🟢 |
| U2 | Smooth screen transitions (configure `react-native-screens` properly) | 🟢 |
| U3 | Skeleton loaders instead of spinners | 🟢 |
| U4 | Error states with retry CTAs (not silent fails) | 🟢 |
| U5 | Animated tab bar icons (Lottie or Reanimated) | 🟡 |
| U6 | Custom splash with brand animation (`react-native-bootsplash`) | 🟢 |
| U7 | Pull-down to refresh on every list screen | 🟢 |
| U8 | Toasts for confirmations (`react-native-toast-message`) | 🟢 |
| U9 | Bottom sheet modals (`@gorhom/bottom-sheet`) replace Alert dialogs | 🟡 |
| U10| 60fps tests for Home scroll (use `FlashList` if `FlatList` jank) | 🟡 |

---

## Part 4 — Differentiation Bets (Pick 1–2 to bet big on)

These are what could make FounderGrid *the* builder app rather than another social network. Don't try all of them — pick what aligns with the founder's vision.

| Bet | Why it could be the moat |
|-----|--------------------------|
| **Founder timeline overlays + AI Co-Founder** | Knowledge product no one else has — FounderGrid becomes a tool, not a feed |
| **Accountability buddies + weekly reflection** | Solves the loneliness of building alone — emotional moat |
| **Public goals + project pages + auto-changelog** | Becomes the canonical "builder portfolio" — replaces personal blogs |
| **Shipping leaderboards + challenges** | Gamified consistency engine — Strava for builders |
| **Lessons learned library** | Searchable corpus = SEO + AI training data — content moat |

---

## Recommended Next 5 Features to Ship

If I had to pick five from this whole document to do *next*, in order:

1. **Wire up real post creation + image upload** ([3.1](#3-addpost-addposttsx)) — current biggest gap
2. **Pull-to-refresh + cursor pagination on Home** ([2.1, 2.2](#2-home-feed-hometsx)) — table-stakes
3. **Edit profile screen** ([6.1](#6-profile-profiletsx)) — users currently can't change anything
4. **Mood heatmap on profile** ([6.3](#6-profile-profiletsx)) — visually striking, screenshot-shareable
5. **"Yesterday I…" prompt push** ([G](#g-yesterday-i-prompts-)) — drives daily return without being annoying

Each is small enough to ship in a week. Together they take FounderGrid from "demo" to "real product."
