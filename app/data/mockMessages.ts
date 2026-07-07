export type Message = {
  id: string;
  fromMe: boolean;
  text: string;
  // ISO timestamp — used to compute display time + day separators
  at: string;
  seen?: boolean;
};

export type Conversation = {
  id: string;
  name: string;
  username: string;
  avatarSeed: string;
  online: boolean;
  lastActive: string;
  preview: string;
  previewFromMe: boolean;
  time: string;
  unread: number;
};

// Anchor "now" so timestamps render predictably in dev
const NOW = new Date('2026-05-12T16:30:00').getTime();
const minutesAgo = (m: number) => new Date(NOW - m * 60 * 1000).toISOString();
const hoursAgo = (h: number) => minutesAgo(h * 60);
const daysAgo = (d: number) => minutesAgo(d * 60 * 24);

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Riya Kapoor',
    username: '@riya.codes',
    avatarSeed: 'u1',
    online: true,
    lastActive: 'Active now',
    preview: "Loved the new podium screen — did you ship it today?",
    previewFromMe: false,
    time: '2m',
    unread: 2,
  },
  {
    id: 'c2',
    name: 'Devansh Mehta',
    username: '@devansh',
    avatarSeed: 'u2',
    online: true,
    lastActive: 'Active now',
    preview: "you: pushed the auth fix, mind reviewing?",
    previewFromMe: true,
    time: '14m',
    unread: 0,
  },
  {
    id: 'c3',
    name: 'Aarav Sethi',
    username: '@aarav',
    avatarSeed: 'u3',
    online: false,
    lastActive: 'Active 1h ago',
    preview: 'sent a voice note 🎙️',
    previewFromMe: false,
    time: '1h',
    unread: 1,
  },
  {
    id: 'c4',
    name: 'Naina Iyer',
    username: '@naina.builds',
    avatarSeed: 'u4',
    online: true,
    lastActive: 'Active now',
    preview: 'okay let me try that and ping you back',
    previewFromMe: false,
    time: '3h',
    unread: 0,
  },
  {
    id: 'c5',
    name: 'Kabir Singh',
    username: '@kabir',
    avatarSeed: 'u5',
    online: false,
    lastActive: 'Active 4h ago',
    preview: 'you: 🔥',
    previewFromMe: true,
    time: '5h',
    unread: 0,
  },
  {
    id: 'c6',
    name: 'Mira Joshi',
    username: '@mira',
    avatarSeed: 'u6',
    online: false,
    lastActive: 'Active yesterday',
    preview: 'I can introduce you to the YC team, would that help?',
    previewFromMe: false,
    time: '1d',
    unread: 3,
  },
  {
    id: 'c7',
    name: 'Ishaan Rao',
    username: '@ishaan',
    avatarSeed: 'u7',
    online: false,
    lastActive: 'Active 2d ago',
    preview: 'you: shared a post',
    previewFromMe: true,
    time: '2d',
    unread: 0,
  },
  {
    id: 'c8',
    name: 'Tara Bhatia',
    username: '@tara',
    avatarSeed: 'u8',
    online: true,
    lastActive: 'Active now',
    preview: 'congrats on the launch!! 🚀',
    previewFromMe: false,
    time: '3d',
    unread: 0,
  },
  {
    id: 'c9',
    name: 'Vivaan Shah',
    username: '@vivaan',
    avatarSeed: 'u9',
    online: false,
    lastActive: 'Active last week',
    preview: 'you: let me check and revert',
    previewFromMe: true,
    time: '1w',
    unread: 0,
  },
  {
    id: 'c10',
    name: 'Sara Khanna',
    username: '@sara',
    avatarSeed: 'u10',
    online: false,
    lastActive: 'Active last week',
    preview: 'thanks for the intro 🙌',
    previewFromMe: false,
    time: '2w',
    unread: 0,
  },
];

export const THREADS: Record<string, Message[]> = {
  c1: [
    { id: 'm1', fromMe: false, text: 'hey, saw your latest post on the leaderboard screen 👀', at: hoursAgo(26) },
    { id: 'm2', fromMe: false, text: 'the podium animation is sick', at: hoursAgo(26) },
    { id: 'm3', fromMe: true, text: 'thank you!! still tweaking the gold glow', at: hoursAgo(25), seen: true },
    { id: 'm4', fromMe: true, text: 'thinking of adding confetti when you hit #1', at: hoursAgo(25), seen: true },
    { id: 'm5', fromMe: false, text: 'do it. low-key the kind of detail people screenshot', at: hoursAgo(4) },
    { id: 'm6', fromMe: true, text: 'lol fair point. will ship tonight', at: hoursAgo(4), seen: true },
    { id: 'm7', fromMe: false, text: 'Loved the new podium screen — did you ship it today?', at: minutesAgo(2) },
    { id: 'm8', fromMe: false, text: 'also — wanna jam on the inbox UI together?', at: minutesAgo(2) },
  ],
  c2: [
    { id: 'm1', fromMe: false, text: 'auth is misbehaving on android again', at: hoursAgo(3) },
    { id: 'm2', fromMe: true, text: 'on it. is it the refresh token loop?', at: hoursAgo(3), seen: true },
    { id: 'm3', fromMe: false, text: 'yeah same one as last week', at: hoursAgo(2) },
    { id: 'm4', fromMe: true, text: 'pushed the auth fix, mind reviewing?', at: minutesAgo(14), seen: true },
  ],
  c3: [
    { id: 'm1', fromMe: true, text: 'sending the brief over now', at: hoursAgo(5), seen: true },
    { id: 'm2', fromMe: false, text: 'got it, reading thru', at: hoursAgo(4) },
    { id: 'm3', fromMe: false, text: 'sent a voice note 🎙️', at: hoursAgo(1) },
  ],
  c4: [
    { id: 'm1', fromMe: true, text: 'try wrapping the Animated.View in useNativeDriver: true', at: hoursAgo(4), seen: true },
    { id: 'm2', fromMe: false, text: 'okay let me try that and ping you back', at: hoursAgo(3) },
  ],
  c5: [
    { id: 'm1', fromMe: false, text: 'shipped the v1 of the feed today 🎉', at: hoursAgo(6) },
    { id: 'm2', fromMe: true, text: '🔥', at: hoursAgo(5), seen: true },
  ],
  c6: [
    { id: 'm1', fromMe: false, text: 'btw saw your post about looking for an intro', at: daysAgo(1) },
    { id: 'm2', fromMe: false, text: "I know a few folks who've gone thru YC recently", at: daysAgo(1) },
    { id: 'm3', fromMe: false, text: 'I can introduce you to the YC team, would that help?', at: daysAgo(1) },
  ],
  c7: [
    { id: 'm1', fromMe: true, text: 'shared a post', at: daysAgo(2), seen: true },
  ],
  c8: [
    { id: 'm1', fromMe: false, text: 'congrats on the launch!! 🚀', at: daysAgo(3) },
  ],
  c9: [
    { id: 'm1', fromMe: false, text: 'can you take a look at the PR when you have time?', at: daysAgo(7) },
    { id: 'm2', fromMe: true, text: 'let me check and revert', at: daysAgo(7), seen: true },
  ],
  c10: [
    { id: 'm1', fromMe: false, text: 'thanks for the intro 🙌', at: daysAgo(14) },
  ],
};

export const ACTIVE_NOW: Conversation[] = CONVERSATIONS.filter(c => c.online);
