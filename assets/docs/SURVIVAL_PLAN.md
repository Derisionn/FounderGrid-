# FounderGrid — Survival Plan

> No fluff. No "you've got this!" energy. This is the honest playbook for not joining the builder-app graveyard.
>
> Read [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md), [FEATURE_IDEAS.md](FEATURE_IDEAS.md), and [MARKETING_TIPS.md](MARKETING_TIPS.md) first if you haven't. This doc is the strategic layer above all of them.

---

## The graveyard you're walking into

Apps that tried to be "a community for builders" and died (or stalled to a heartbeat):

| App | Pitch | What killed it |
|-----|-------|----------------|
| **Makerlog** | Daily makers' tasks/streaks | Dead feed. Couldn't sustain critical mass. Indie maintainer burned out. |
| **WIP.co** | Paid Telegram-like community for makers | Survives but tiny. Paywall limited growth; never broke out. |
| **Telescope / Sidebar** | Reddit-style for indie hackers | Couldn't compete with Twitter for builder attention. |
| **Pioneer** | Ranking system for builders, weekly demos | Pivoted to a fund. Product itself died. |
| **Polywork** | LinkedIn for multi-hyphenates | Raised millions. Shut down. Couldn't crack network effects. |
| **Lunchclub** | 1:1 networking for professionals | Layoffs, fading. Couldn't sustain the matching loop. |
| **Indie Hackers (forum)** | The OG | Still exists but engagement way down since 2021. Stripe-owned, low investment. |

**Pattern**: All started with "let's make a place where builders gather." All discovered builders already gather on Twitter/X — and the switching cost is brutally high because Twitter has the followers, the graph, and the dopamine.

**This is the headwind FounderGrid is fighting.** Not naming it doesn't make it go away.

---

## Why these apps died (the real reasons, not the polite ones)

1. **Empty feed = empty app.** Social products need critical mass on day one. Cold start kills 95% of attempts. If new users open FounderGrid and the feed is sparse, they leave forever.
2. **Builders are cheap and busy.** They don't pay for community. They don't have time to maintain presence on yet another app.
3. **Twitter already won the network.** The followers, the graph, the muscle memory — all there. FounderGrid has to be **10x better at one specific thing** to make switching worth it. "Vaguely nicer" is not enough.
4. **"Vitamin not painkiller."** "Feeling alone while building" is a vitamin pain. Skippable. Won't drive daily usage. Won't drive payment.
5. **Founder ran out of money / energy.** Solo network-effect products take 2–3 years to maybe work. Most founders quit at month 8.
6. **No distribution mechanism baked in.** Relied on "we'll do marketing." Marketing without a viral loop in the product is paddling against the current forever.

**FounderGrid is currently making 4 of these 6 mistakes.** The good news: all 6 are fixable if you act now.

---

## The 5 brutal truths

### Truth 1: A social feed app for builders is a doomed positioning

If FounderGrid's pitch is "post your daily progress, follow other builders, see a feed" — that's the WIP.co / Makerlog pitch. They tried. It didn't work. Doing it again with nicer UI won't change the outcome.

**What to do**: Stop calling it a social app. Reposition as a **tool that happens to have community**, not a community that happens to have tools.

### Truth 2: Founder timelines (Zuckerberg, Musk) are not differentiation

Wikipedia exists. Forbes exists. There are 50 YouTube channels covering this exact content. Two pre-loaded founders is a tech demo, not a moat.

**What to do**: Either (a) cut founder timelines entirely and focus the wedge, or (b) make founder content do something only FounderGrid can — like overlay them onto your own life ("Bezos was 30 when he started Amazon — you're 28") with daily comparison nudges. The second is interesting. The first is faster.

### Truth 3: Mood tags are cute, not load-bearing

"What's your mood today: shipping / learning / struggling / productive" is a clever signal but it's not what brings users back daily. Instagram has Stories. Twitter has Replies. What's FounderGrid's hook that makes someone open the app at 9pm without a notification?

**What to do**: Identify the **single behavior** that defines FounderGrid. Not 5 features. One. ("Strava users open it after every run." What's FounderGrid's "after every run"?)

### Truth 4: You will not out-execute Twitter on social

You're one developer (assumed). Twitter has thousands of engineers and the network. If FounderGrid's plan is "be like Twitter but for builders," the math doesn't work.

**What to do**: Pick a wedge Twitter is *bad* at. Examples:
- Twitter is bad at **public goal tracking** with progress %
- Twitter is bad at **structured weekly reflection**
- Twitter is bad at **searchable lessons-learned**
- Twitter is bad at **1:1 accountability matching**
- Twitter is bad at **public project changelogs**

Build something Twitter is structurally bad at. Then community happens around it.

### Truth 5: Without a 30-day retention curve, nothing else matters

You can ship features for a year. You can do Product Hunt. You can run ads. None of it matters if users open the app week 1 and never return.

**Get 50 users. See if they come back on day 7. Day 30.** That number is destiny. If it's <10% on day 30, no amount of features or marketing will save the project.

---

## What "different from dead projects" actually requires

The dead projects all shared these traits. FounderGrid must do the *opposite* on each:

| Dead-project trait | FounderGrid must do |
|---------------------|------------------|
| Generic "community for X" pitch | Specific tool that solves one painkiller |
| No distribution loop in the product | Public artifacts (profiles/cards/widgets) that bring new users via existing users |
| Free forever, hoping for ads | Clear paid tier from week 1 (lifetime deal at launch is fine) |
| 100% reliance on founder's marketing | Product that markets itself via shared output |
| Built features for 12 months pre-launch | Ship MVP in 4–6 weeks to 50 real users |
| Founder talked AT users (broadcasts) | Founder talks WITH users (calls, DMs, replies) every week |
| "We'll figure out monetization later" | Day-1 monetization, even if cheap |

If you can't honestly check 6/7 of those right-side boxes within 60 days, kill the project.

---

## The wedge decision (do this first)

Pick one. Don't pick three. Don't keep "all of the above" on the table.

### Option 1: **Buildscape** — the public builder portfolio
- **Repositioning**: "Your project's public progress page. Like a Linktree, but it grows automatically as you ship."
- **Core feature**: every user gets `foundergrid.app/p/:project` — a beautiful auto-updating page from their daily posts
- **Monetization**: $5/mo for custom domain + analytics + remove branding
- **Why it survives**: each user creates a public page → SEO + sharing → distribution baked in → not competing with Twitter
- **Risk**: requires solid web component (you've been building mobile-only)

### Option 2: **Streakr** — Strava for shipping
- **Repositioning**: "Track your daily build streak. Share beautiful cards. Compete with friends."
- **Core feature**: streaks + leaderboards + share cards as the primary surface
- **Monetization**: $4/mo for advanced analytics, custom card designs, private leaderboards
- **Why it survives**: shareable cards = viral loop, streaks = retention, mobile-first fits the wedge
- **Risk**: gamification can feel hollow without depth — needs careful design

### Option 3: **Pairup** — accountability buddies for builders
- **Repositioning**: "Get matched with another builder weekly. Daily check-ins. Ship together."
- **Core feature**: weekly matching algorithm, structured daily DMs, paired streaks
- **Monetization**: $9/mo (high price = serious users only)
- **Why it survives**: solves a real painkiller (accountability), high engagement, defensible
- **Risk**: requires user volume for good matching — chicken-and-egg

### Option 4: **Mentor** — AI co-founder grounded in indie wisdom
- **Repositioning**: "Chat with an AI trained on the actual lessons of indie builders. Ask anything."
- **Core feature**: Claude-powered chat with retrieval over founder content + community lessons
- **Monetization**: $15/mo (AI tools have higher willingness-to-pay)
- **Why it survives**: it's a **tool, not a feed**. Builders pay for tools. Higher LTV. No critical-mass dependency.
- **Risk**: needs quality content corpus, ongoing AI costs

### My recommendation

**Option 4 (Mentor) or Option 1 (Buildscape).** Both are tools, not feeds. Both have natural monetization. Both don't require you to defeat Twitter.

If you want to keep the social/community angle, **Option 2 (Streakr)** is the strongest path because the share cards = built-in distribution.

**Avoid the "all of the above" trap.** Picking is the most valuable thing you do this month.

---

## The 90-day survival plan

If you're going to do this, do it on this timeline. Not slower.

### Days 1–14: Validation (no code)
- [ ] Pick ONE wedge above. Write it down. Tell 5 friends. Get reactions.
- [ ] Build a 1-page landing site with waitlist (Tally + Carrd, 1 day)
- [ ] Talk to **20 indie builders** (Twitter DMs, IH, Reddit). 15 min calls.
  - Don't pitch. Ask: "What's the hardest thing about building solo? What have you tried? What didn't work?"
  - Listen for words they actually use. Steal their language for the landing page.
- [ ] Post daily on Twitter about the build journey.
- [ ] **Gate**: 100+ waitlist sign-ups in 14 days = signal. <50 = pivot or kill.

### Days 15–42: Ruthlessly cut & rebuild
- [ ] Delete every feature outside the wedge MVP. Yes, even the ones you already built.
- [ ] Rebuild around the wedge:
  - Real auth (Supabase phone OTP)
  - Wedge-specific core feature (only this)
  - Public-facing surface (web profile / share card / etc.)
  - Sentry, env vars, basic CI
- [ ] No founder timelines, mood feed, follows, comments — unless the wedge demands them
- [ ] Ship to **TestFlight + Play internal** with 50 hand-picked beta testers

### Days 43–70: Iterate with real users
- [ ] Daily check-ins with testers (you DM them, not the other way around)
- [ ] Track day-1, day-7, day-30 retention obsessively (PostHog, free tier)
- [ ] Ship 2 improvements per week based on what testers actually do (not what they say)
- [ ] **Gate**: 30% of testers using it weekly without prompting = real signal. <10% = product is wrong, pivot or kill.

### Days 71–90: Public launch (only if retention proved)
- [ ] Product Hunt launch (Tuesday, 12:01 AM PT)
- [ ] HackerNews Show HN
- [ ] Indie Hackers post
- [ ] Twitter launch thread
- [ ] Lifetime deal ($49) for first 100 customers — generates revenue + commitment
- [ ] **Gate**: 500 sign-ups + 20 paying customers in 7 days = product has legs. Less = stay in beta, keep iterating.

---

## Hard kill criteria

You need to write these down BEFORE you start, so you'll actually honor them:

| Checkpoint | Kill if... |
|------------|------------|
| Day 14 | Waitlist <50 AND user interviews lukewarm |
| Day 42 | <30 active testers in beta after recruiting 50 |
| Day 70 | Day-30 retention <10% AND no organic word-of-mouth |
| Day 90 | <500 total users AND <20 paying customers AND <5% week-on-week growth |
| Day 180 | <$500 MRR AND no breakout viral moment |

If you hit a kill criterion: **stop adding features**. Either pivot the wedge or shelve the project. Sunk-cost fallacy is what kept Polywork running for 3 years past its expiration date.

---

## The honest probability table

Realistic outcomes if you follow this plan vs. continuing as-is:

| Outcome | Continue as-is | Follow this plan |
|---------|----------------|------------------|
| Joins graveyard within 12 months | **75%** | 45% |
| Cozy small product (<$1k MRR, ~500 users) | 20% | **35%** |
| Real business ($1k–10k MRR) | 4% | 15% |
| Breakout (>$10k MRR or acquired) | 1% | 5% |

The plan doesn't guarantee success. It moves probability mass from "graveyard" to "small but real." That's the realistic best you can do as a solo founder in this category.

---

## What the founders of dead apps wish they had done

Direct quotes (paraphrased) from interviews/post-mortems of failed builder apps:

- *"I should have charged from day one. Free users are tourists."*
- *"I built features for 9 months without talking to users. I built the wrong product."*
- *"The mistake was thinking community happens automatically. It doesn't. It needs structured rituals."*
- *"I optimized for sign-ups when I should have optimized for retention. We had 50,000 sign-ups and 200 active users."*
- *"I was so focused on the product that I didn't realize my real job was distribution."*
- *"I should have shipped the v1 in 6 weeks, not 6 months. The version I shipped was wrong anyway."*

**Don't repeat these.**

---

## Six things to do this week

If you take only one section of this doc seriously, take this one. Specific actions, this week, before anything else:

1. **Decide the wedge.** Pick from the 4 options. Write it down somewhere visible. One sentence.
2. **Buy `foundergrid.app` (or your chosen domain) and ship a 1-page waitlist site.** End of day Tuesday.
3. **Send 20 cold DMs/emails to indie builders** asking for 15 minutes. Schedule 5+ calls this week.
4. **Tweet daily** about FounderGrid's wedge — not the social-app version. The new positioning.
5. **Decide on a paid tier.** Even if it's "$5/mo for X" — write it down.
6. **Set a hard kill date** in your calendar. Mine would be day 90. If kill criteria are hit, you stop.

---

## The meta-truth

The thing that decides whether FounderGrid survives isn't the code, the design, the marketing copy, or the launch.

It's whether you can **stop being a builder of FounderGrid and become a marketer of FounderGrid who occasionally writes code**. The dead apps in the graveyard above all had founders who fell in love with shipping features instead of falling in love with talking to users.

The ones that survived — Indie Hackers, Stripe Press, even small wins like Marc Lou's collection — had founders who shipped less code and shipped more conversations.

If you can make that mental switch, FounderGrid has a real shot. If you can't, no plan in this document will save it.

Be honest about which mode you're in. Then decide if this is the right project.
