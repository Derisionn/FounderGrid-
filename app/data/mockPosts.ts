import type { ImageSourcePropType } from 'react-native';
import { colors } from '../styles/colors';

const MOCK_POST_IMAGE_1 = require('../../assets/images/mockPost1.jpg');
const MOCK_POST_IMAGE_2 = require('../../assets/images/mockPost2.jpg');

export type MockMood = {
  id: 'productive' | 'shipping' | 'learning' | 'struggling';
  emoji: string;
  icon: string;
  label: string;
  color: string;
};

export type MockPost = {
  id: string;
  author: {
    initials: string;
    name: string;
    username: string;
    accent: string;
    streak: number;
  };
  project: { name: string; emoji: string; accent: string };
  time: string;
  text: string;
  hasImage?: boolean;
  image?: ImageSourcePropType;
  stack: string[];
  mood: MockMood;
  likes: number;
  comments: number;
  liked?: boolean;
  saved?: boolean;
  followed?: boolean;
};

const ACCENT = colors.Accent.blue;

const MOODS: Record<MockMood['id'], MockMood> = {
  productive: {
    id: 'productive',
    emoji: '⚡',
    icon: 'zap',
    label: 'Productive',
    color: colors.Accent.streakAmber,
  },
  shipping: {
    id: 'shipping',
    emoji: '🚢',
    icon: 'ship',
    label: 'Shipping',
    color: colors.Accent.shippingGreen,
  },
  learning: {
    id: 'learning',
    emoji: '📚',
    icon: 'book-open',
    label: 'Learning',
    color: ACCENT,
  },
  struggling: {
    id: 'struggling',
    emoji: '🌧️',
    icon: 'cloud-rain',
    label: 'Struggling',
    color: colors.Accent.danger,
  },
};

export const MOCK_POSTS: MockPost[] = [
  {
    id: 'p1',
    author: {
      initials: 'MS',
      name: 'Maya Shah',
      username: '@mayabuilds',
      accent: colors.Accent.violet,
      streak: 42,
    },
    project: { name: 'Lumen', emoji: '💡', accent: colors.Accent.violet },
    time: '12m',
    text: 'Shipped semantic search in Lumen today. Went from keyword match → embeddings + reranker. P95 latency under 240ms. Feels obvious in hindsight, took me 3 weeks to make it boring.',
    hasImage: true,
    image: MOCK_POST_IMAGE_1,
    stack: ['typescript', 'pgvector', 'supabase'],
    mood: MOODS.shipping,
    likes: 84,
    comments: 12,
    followed: false,
  },
  {
    id: 'p2',
    author: {
      initials: 'RT',
      name: 'Rohit Tandon',
      username: '@rohitops',
      accent: colors.Accent.green,
      streak: 18,
    },
    project: { name: 'Tide', emoji: '🌊', accent: colors.Accent.green },
    time: '47m',
    text: 'Day 18. First paying customer 🎉. They messaged at 11pm asking for a Stripe invoice. Sent it from my couch in my pajamas. Indie life.',
    stack: ['nextjs', 'stripe'],
    mood: MOODS.productive,
    likes: 213,
    comments: 31,
    followed: true,
  },
  {
    id: 'p3',
    author: {
      initials: 'SR',
      name: 'Sara Raj',
      username: '@sarah_designs',
      accent: colors.Accent.danger,
      streak: 7,
    },
    project: { name: 'Hush', emoji: '🤫', accent: colors.Accent.danger },
    time: '1h',
    text: 'spent 5 hours debugging a layout shift. it was one wrong flex-basis. send help (or coffee).',
    stack: ['react-native', 'reanimated'],
    mood: MOODS.struggling,
    likes: 56,
    comments: 9,
    followed: false,
  },
  {
    id: 'p4',
    author: {
      initials: 'DV',
      name: 'Devraj Verma',
      username: '@devraj',
      accent: colors.Accent.streak,
      streak: 88,
    },
    project: { name: 'Specto', emoji: '🔍', accent: colors.Accent.violet },
    time: '2h',
    text: 'Day 88 streak. Started reading Designing Data-Intensive Applications today. Ch1 alone is worth the whole book. Will share notes here as I go.',
    stack: ['systems', 'reading'],
    mood: MOODS.learning,
    likes: 142,
    comments: 24,
    followed: true,
  },
  {
    id: 'p5',
    author: {
      initials: 'NV',
      name: 'Nikhil Vora',
      username: '@nikbuilds',
      accent: colors.Accent.violet,
      streak: 47,
    },
    project: { name: 'Layer', emoji: '🎨', accent: colors.Accent.danger },
    time: '3h',
    text: 'Launching Layer v2 next week. Design tokens, dark mode, custom themes, plus a public API. Beta access for the first 50 builders who comment.',
    hasImage: true,
    image: MOCK_POST_IMAGE_2,
    stack: ['nextjs', 'tailwind', 'figma-api'],
    mood: MOODS.shipping,
    likes: 312,
    comments: 78,
    followed: false,
  },
  {
    id: 'p6',
    author: {
      initials: 'PK',
      name: 'Priya Kapoor',
      username: '@priyabuilds',
      accent: colors.Accent.green,
      streak: 12,
    },
    project: { name: 'Slate', emoji: '📝', accent: colors.Accent.blue },
    time: '4h',
    text: 'Killed a feature today. The "AI summary" button nobody used. Removed 600 lines. The app feels lighter. Maybe the lesson is to ship less, not more.',
    stack: ['swift', 'swiftui'],
    mood: MOODS.productive,
    likes: 198,
    comments: 22,
    followed: false,
  },
  {
    id: 'p7',
    author: {
      initials: 'AK',
      name: 'Aman Khanna',
      username: '@amanship',
      accent: ACCENT,
      streak: 3,
    },
    project: { name: 'Drift', emoji: '🪁', accent: ACCENT },
    time: '6h',
    text: "Three days in. The honeymoon is over. Today I rewrote the auth flow for the third time. Trying to remind myself: this is what building actually looks like.",
    stack: ['flutter', 'firebase'],
    mood: MOODS.struggling,
    likes: 67,
    comments: 14,
    followed: false,
  },
  {
    id: 'p8',
    author: {
      initials: 'RP',
      name: 'Riya Patel',
      username: '@riyamakes',
      accent: colors.Accent.danger,
      streak: 21,
    },
    project: { name: 'Pulse', emoji: '💓', accent: colors.Accent.pink },
    time: '8h',
    text: "Cold email response rate hit 14% this week. Up from 3% a month ago. The change? I stopped pitching and started asking one specific question. That's the whole playbook.",
    stack: ['growth', 'cold-email'],
    mood: MOODS.shipping,
    likes: 421,
    comments: 96,
    followed: true,
  },
  {
    id: 'p9',
    author: {
      initials: 'JS',
      name: 'Jay Sethi',
      username: '@jaybuilds',
      accent: colors.Accent.amber,
      streak: 33,
    },
    project: { name: 'Inkwell', emoji: '🖋️', accent: colors.Accent.amber },
    time: '11h',
    text: 'Finally understood how React Server Components actually work. Wrote a 2000-word post about it. Will probably understand it again tomorrow.',
    hasImage: false,
    stack: ['react', 'nextjs', 'rsc'],
    mood: MOODS.learning,
    likes: 178,
    comments: 41,
    followed: false,
  },
  {
    id: 'p10',
    author: {
      initials: 'TM',
      name: 'Tanvi Mehra',
      username: '@tanvibuilds',
      accent: colors.Accent.shippingGreen,
      streak: 64,
    },
    project: { name: 'Glow', emoji: '✨', accent: colors.Accent.shippingGreen },
    time: '14h',
    text: "MRR crossed $1k this month. Took 11 months. Slower than every Twitter thread said it should be. Doesn't matter — I'm still here, still shipping. That's the whole game.",
    hasImage: true,
    image: MOCK_POST_IMAGE_1,
    stack: ['saas', 'milestone'],
    mood: MOODS.shipping,
    likes: 1247,
    comments: 184,
    followed: true,
  },
  {
    id: 'p11',
    author: {
      initials: 'HC',
      name: 'Hari Chandra',
      username: '@haribuilds',
      accent: colors.Accent.blueBright,
      streak: 9,
    },
    project: { name: 'Beacon', emoji: '🔦', accent: colors.Accent.blueBright },
    time: '1d',
    text: 'Switched the whole stack from Postgres to SQLite + Turso. Cold start dropped from 1.4s → 90ms. Bills dropped 80%. The simplest stack wins more often than I expect.',
    stack: ['sqlite', 'turso', 'remix'],
    mood: MOODS.productive,
    likes: 289,
    comments: 52,
    followed: false,
  },
  {
    id: 'p12',
    author: {
      initials: 'AS',
      name: 'Aisha Sinha',
      username: '@aishaships',
      accent: colors.Accent.emerald,
      streak: 27,
    },
    project: { name: 'Mosaic', emoji: '🧩', accent: colors.Accent.emerald },
    time: '1d',
    text: "User interview #20 done today. Pattern is undeniable now: nobody wants what I thought I was building. They want the boring thing I almost skipped. Pivoting Monday. Grateful for the early feedback.",
    stack: ['discovery', 'pivots'],
    mood: MOODS.learning,
    likes: 503,
    comments: 117,
    followed: false,
  },
];
