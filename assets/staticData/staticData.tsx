import { colors } from "../../app/styles/colors";

export const ACHIEVEMENTS = [
  { id: '7d', emoji: '🔥', label: '7-Day Streak', accent: colors.Accent.streak, unlocked: true, fresh: true },
  { id: '30d', emoji: '⚡', label: '30-Day Streak', accent: colors.Accent.danger, unlocked: false },
  { id: 'launch', emoji: '🚀', label: 'First Launch', accent: colors.Accent.blue, unlocked: true },
  { id: '100', emoji: '💯', label: 'First 100 Users', accent: colors.Accent.green, unlocked: true },
  { id: '1k', emoji: '🏆', label: 'First 1k Users', accent: colors.Accent.violet, unlocked: false },
  { id: 'ship30', emoji: '📦', label: '30 Ships', accent: colors.Accent.streak, unlocked: false },
];

export const PROFILE = {
  initials: 'AS',
  name: 'Anmol Singh',
  username: '@anmol',
  birthYear: 1999,
  buildingSince: 2023,
  tagline: 'Building FounderGrid — a daily journal for indie founders.',
  bio: 'React Native engineer turned solo founder. Shipping in public, one commit at a time.',
  location: 'Bengaluru, IN',
  // joined: 'Joined Mar 2025',
  followers: 1284,
  following: 312,
  posts: 87,
  currentStreak: 7,
  longestStreak: 42,
  openToCollab: true,
  socials: [
    { id: 'gh', label: 'github.com/anmol' },
    { id: 'x', label: '@anmol_codes' },
    { id: 'ig', label: '@anmol.builds' },
    { id: 'web', label: 'foundergrid.app' },
  ],
  skills: ['React Native', 'Backend', 'Design', 'AI', 'Marketing'],
  lookingFor: ['Designer', 'Developer', 'Co-founder'],
};

export const RECENT_POSTS = [
  {
    id: 'p1',
    when: 'Today',
    project: 'FounderGrid',
    text: 'Shipped the new Add Post screen. Auto-save drafts + mood selector working clean.',
    likes: 42,
    comments: 6,
    hasImage: true,
  },
  {
    id: 'p2',
    when: 'Yesterday',
    project: 'FounderGrid',
    text: 'Refactored the timeline. Cut render time in half by memoizing year groups.',
    likes: 28,
    comments: 3,
    hasImage: false,
  },
  {
    id: 'p3',
    when: '2d ago',
    project: 'Inkwell',
    text: 'Started exploring streaming responses for the AI editor. Latency is the killer.',
    likes: 19,
    comments: 8,
    hasImage: false,
  },
];

export const PROJECTS = [
  {
    id: 'foundergrid',
    name: 'FounderGrid',
    emoji: '🚀',
    accent: colors.Accent.blue,
    pinned: true,
    description: 'A daily journal for indie founders to ship in public.',
    stage: 'Beta',
    contributors: 3,
    stack: ['React Native', 'Node', 'Postgres'],
  },
  {
    id: 'inkwell',
    name: 'Inkwell',
    emoji: '🪶',
    accent: colors.Accent.violet,
    pinned: false,
    description: 'AI writing tool for technical drafts.',
    stage: 'MVP',
    contributors: 1,
    stack: ['AI', 'Next.js'],
  },
  {
    id: 'pulse',
    name: 'Pulse',
    emoji: '📈',
    accent: colors.Accent.green,
    pinned: false,
    description: 'Lightweight uptime + analytics for hobby projects.',
    stage: 'Idea',
    contributors: 1,
    stack: ['SaaS', 'Backend'],
  },
];

export const TRENDING_STREAKS = [
  {
    id: 't1',
    initials: 'DV',
    name: 'Devraj',
    accent: colors.Accent.streak,
    streak: 88,
  },
  {
    id: 't2',
    initials: 'NV',
    name: 'Nikhil',
    accent: colors.Accent.violet,
    streak: 47,
  },
  {
    id: 't3',
    initials: 'RP',
    name: 'Riya',
    accent: colors.Accent.danger,
    streak: 21,
  },
  {
    id: 't4',
    initials: 'PK',
    name: 'Priya',
    accent: colors.Accent.green,
    streak: 12,
  },
  { id: 't5', initials: 'AK', name: 'Aman', accent: colors.Accent.streak, streak: 3 },
];
export const SUGGESTED = [
  {
    id: 's1',
    initials: 'MS',
    name: 'Maya S.',
    tagline: 'Building Lumen · AI',
    accent: colors.Accent.violet,
  },
  {
    id: 's2',
    initials: 'RT',
    name: 'Rohit T.',
    tagline: 'Building Tide · SaaS',
    accent: colors.Accent.green,
  },
  {
    id: 's3',
    initials: 'SR',
    name: 'Sara R.',
    tagline: 'Building Hush · Design',
    accent: colors.Accent.danger,
  },
];

export const LAUNCHED = [
  {
    id: 'l1',
    name: 'Specto',
    emoji: '🔍',
    accent: colors.Accent.violet,
    tagline: 'Visual debugger for RN.',
  },
  {
    id: 'l2',
    name: 'Layer',
    emoji: '🎨',
    accent: colors.Accent.danger,
    tagline: 'Design system as a service.',
  },
  {
    id: 'l3',
    name: 'Tide',
    emoji: '🌊',
    accent: colors.Accent.green,
    tagline: 'Lightweight ops dashboard.',
  },
];