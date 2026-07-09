# FounderGrid — What Makes It Unique

> Companion to **[PROJECT_SCOPE.md](PROJECT_SCOPE.md)**.
>
> A feed app with likes and follows is a commodity — Twitter, Threads, and a dozen clones already exist. This document is the plan for the features that make FounderGrid *the* app for builders rather than another social network.
>
> **Effort key:** 🟢 small (≤1 day) · 🟡 medium (2–5 days) · 🔴 large (1–3+ weeks)
>
> Each feature lists **Why it's a moat**, **How to build it**, and how it ties into the existing screens.



---





## The Core Thesis

FounderGrid wins if it owns one sentence: **"the place where builders show up every day to ship in public."** Three reinforcing loops make that defensible:

1. **Habit loop** — streaks + daily prompts make posting a ritual, not a chore.
2. **Accountability loop** — buddies, public goals, and challenges make quitting socially costly.
3. **Knowledge loop** — founder timelines + a lessons library + AI turn the corpus into a *tool*, not just content.

Everything below ladders up to one of those three loops. **Don't build all of it.** Pick the bets that match the founder's vision and go deep.

---

## Bet 1 — The Daily Build Ritual 🟡 *(Habit loop)*

The single most important behavior is "post every day." Make it effortless and rewarding.

### 1a. "Yesterday you shipped…" prompt 🟡
Once a day, at the user's preferred time, push a notification that opens AddPost **pre-filled with context from their last post**: *"Yesterday you shipped 'OAuth flow'. What did you ship today?"*
- **Why:** Kills blank-page paralysis — the #1 reason daily-posting habits die.
- **How:** Supabase scheduled Edge Function → push (Expo Notifications) → deep-link into [addPost.tsx](app/screens/bottomNavigation/addPost.tsx) with the previous post as context.

### 1b. Streak engine with grace + freeze 🟡
The leaderboard ([leaderboardScreen.tsx](app/screens/leaderboard/leaderboardScreen.tsx)) and `StreakChip` already exist — make the streak *real and forgiving*.
- **Why:** Duolingo proved streaks are addictive, but brittle streaks cause rage-quits. A "streak freeze" (1 free skip/week) keeps users from abandoning after one missed day.
- **How:** `streaks` table (`current_streak`, `best_streak`, `freezes_remaining`, `last_post_date`). Midnight (user-local) cron decrements; a freeze absorbs one miss.

### 1c. "Today" lens above the feed 🟡
A horizontal rail at the top of [home.tsx](app/screens/bottomNavigation/home.tsx) showing only *today's* posts from people you follow — a story-shaped view without disappearing content.
- **Why:** The core question is "what did builders ship *today*," and a generic chronological feed buries that.
- **How:** Query posts where `created_at > local_midnight` for followed users; render a rail above the main feed.

---

## Bet 2 — Accountability That Other Apps Can't Copy 🔴 *(Accountability loop)*

This is the emotional moat. Building alone is lonely; FounderGrid can manufacture accountability.

### 2a. Accountability Buddies 🔴
Weekly opt-in pairing with another builder of similar stage. Each day you tell each other what you'll ship.
- **Why:** YC pairs founders this way for a reason. No generic social app does structured 1:1 accountability — and the DM layer ([inboxScreen.tsx](app/screens/messages/inboxScreen.tsx) / [chatScreen.tsx](app/screens/messages/chatScreen.tsx)) is already built.
- **How:** Opt-in toggle in Settings → weekly cron Edge Function matches eligible users (builder type, timezone, posting cadence) → surface the paired buddy in a dedicated tab/thread for the week.

### 2b. Public Goals & Milestones 🔴
Users declare a public goal ("Hit $1k MRR by Aug 15", "Ship MVP in 30 days"). Profile shows live progress %. Hitting it auto-posts a celebration with a confetti animation.
- **Why:** Public commitment is a proven accountability lever, and it gives the community something concrete to root for.
- **How:** `goals` table (`title, target_date, metric_type, target_value, current_value, status`); render on [profile.tsx](app/screens/bottomNavigation/profile.tsx); Edge Function watches for completion and creates the celebratory post.

### 2c. Ship Challenges 🟡
Time-boxed group challenges: "#30DaysOfShipping", "Launch Week". Join → your streak counts toward a cohort leaderboard.
- **Why:** Cohorts create belonging and a finish line. Reuses the leaderboard you already have, scoped to a challenge.
- **How:** `challenges` + `challenge_members`; filter the existing leaderboard by `challenge_id`.

---

## Bet 3 — Turn the Corpus Into a Tool 🔴 *(Knowledge loop)*

FounderGrid accumulates two unique datasets: **founder timelines** and **builders' day-by-day lessons**. Most apps leave that as dead content. Make it queryable.

### 3a. "Where I am now" timeline overlay 🔴 *(signature feature)*
On a founder's timeline ([FounderDetailScreen.tsx](app/screens/timeline/FounderDetailScreen.tsx)), overlay a marker for **the user's own age / years-building** against the founder's arc: *"At your age, Bezos was still 4 years from starting Amazon."*
- **Why:** Emotionally powerful and completely unique — it reframes the inspiration content as personal. Nobody else can show this because nobody else has both your data *and* structured founder timelines.
- **How:** The data is already structured (`TimelineEvent.age` in [app/helpers/types.ts](app/helpers/types.ts)). Compute the user's age/start-date and render a "you are here" line across the timeline.

### 3b. Lessons Learned Library 🟡
Let users flag a post as a "lesson learned." Aggregate flagged posts into a searchable, topic-filtered library.
- **Why:** The most valuable content here is hard-won lessons. A searchable library becomes an SEO + AI-training moat — "the search engine for builder wisdom."
- **How:** Add `is_lesson` boolean to posts; a dedicated listing screen with topic filters.

### 3c. Weekly Reflection (AI) 🟡
Every Sunday, generate a private AI summary of the user's week: themes, mood patterns, wins. Optionally shareable.
- **Why:** Builders want the benefits of journaling without journaling. FounderGrid already has the raw posts.
- **How:** Sunday cron → Edge Function → **Claude API** (`claude-opus-4-8` for quality, or `claude-haiku-4-5` for cost) over the week's posts → store summary → notify.

### 3d. "Ask FounderGrid" AI Co-Founder 🔴
A chat tab grounded in the lessons library + founder timelines. Ask *"should I raise or bootstrap?"* → get answers cited from real posts and founder moments.
- **Why:** Turns content into a product. Highly differentiated, and it gets better as the corpus grows — a compounding moat.
- **How:** Embed posts + founder content into a vector store (Supabase pgvector) → RAG → stream responses from the **Claude API** in a dedicated chat screen.

---

## Differentiation Scoreboard

| Bet | Loop | Moat type | Effort | Recommendation |
|-----|------|-----------|--------|----------------|
| Daily Build Ritual (1a–1c) | Habit | Retention engine | 🟡 | **Do first** — cheap, foundational |
| "Where I am now" overlay (3a) | Knowledge | Unique data product | 🔴 | **Signature** — nobody can copy it |
| Accountability Buddies (2a) | Accountability | Emotional | 🔴 | High-conviction bet |
| Public Goals (2b) | Accountability | Social proof | 🔴 | Pairs with buddies |
| Lessons Library (3b) | Knowledge | Content/SEO | 🟡 | Quiet compounder |
| Ask FounderGrid AI (3d) | Knowledge | Compounding | 🔴 | Later — needs corpus first |

---

## Supporting Features (raise the floor)

These don't differentiate on their own, but their *absence* makes FounderGrid feel like a demo. Ship the cheap ones early.

| # | Feature | Screen | Effort |
|---|---------|--------|--------|
| S1 | Wire real post creation + image upload (Supabase Storage) | [addPost.tsx](app/screens/bottomNavigation/addPost.tsx) | 🟡 |
| S2 | Cursor pagination + optimistic likes | [home.tsx](app/screens/bottomNavigation/home.tsx) | 🟡 |
| S3 | Edit-profile screen + external links (GitHub/X/site) | [profile.tsx](app/screens/bottomNavigation/profile.tsx) | 🟡 |
| S4 | Mood heatmap (GitHub-style 90-day calendar) | [profile.tsx](app/screens/bottomNavigation/profile.tsx) | 🔴 |
| S5 | Real auth (replace `MOCK_USER_ID`) + Splash auth routing | [splashScreen.tsx](app/screens/splash/splashScreen.tsx) | 🟡 |
| S6 | Group/aggregate notifications ("Sarah +12 liked your post") | [notifications.tsx](app/screens/bottomNavigation/notifications.tsx) | 🟡 |
| S7 | Hashtag pages (tap `#saas` → all posts + top contributors) | feed-wide | 🟡 |
| S8 | Share post as a branded image card (free marketing) | post component | 🟡 |
| S9 | Block / mute + account deletion (App Store requirement) | [settingScreen.tsx](app/screens/settings/settingScreen.tsx) | 🟡 |
| S10 | Haptics, skeleton loaders, toasts, retry states (polish) | app-wide | 🟢 |

---

## Recommended Sequencing

**Phase 1 — Make it real (weeks 1–3)**
Wire auth (S5), post creation + image upload (S1), and feed pagination (S2). The app stops being a mockup.

**Phase 2 — Make it sticky (weeks 4–6)**
Streak engine with freeze (1b), the "Yesterday you shipped…" prompt (1a), and the "Today" lens (1c). Now there's a reason to open it daily.

**Phase 3 — Make it unique (weeks 7+)**
Ship the signature **"Where I am now" timeline overlay** (3a) and the **Lessons Library** (3b). Then bet big on **Accountability Buddies** (2a) + **Public Goals** (2b).

**Phase 4 — Make it compound (later)**
**Weekly Reflection** (3c) and **Ask FounderGrid** (3d), once there's enough corpus to make the AI genuinely useful.

---

## What to Deliberately *Not* Do

- **Don't chase generic feed parity** (algorithmic For You, Reels, etc.) — that's a war against Twitter you can't win.
- **Don't gamify into anxiety** — streaks need a freeze/grace mechanic or they punish the very users you want.
- **Don't build all three knowledge AI features at once** — they need the corpus first; premature AI on thin data feels gimmicky.
- **Don't add a web app yet** — mobile-first daily ritual is the wedge.
