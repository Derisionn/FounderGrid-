export type TimelineCategory =
  | 'milestone'
  | 'funding'
  | 'product'
  | 'acquisition'
  | 'personal'
  | 'setback';

export interface TimelineStat {
  label: string;
  value: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  age?: number;
  month?: string;
  title: string;
  description: string;
  story?: string;
  insight?: string;
  icon?: string;
  tag?: string;
  category: TimelineCategory;
  tags: string[];
  stats: TimelineStat[];
  quote: string;
  isHighlight: boolean;
}

export interface FounderProfile {
  name: string;
  title: string;
  company: string;
  companies?: string[];
  tagline?: string;
  image?: string;
  netWorth: string;
  totalFundsRaised: string;
  usersServed: string;
  followersInspired?: string;
  avatarInitials: string;
  accentColor: string;
  bio: string;
  inspiration: string;
  quotes?: string[];
}

export interface Founder {
  id: string;
  profile: FounderProfile;
  timeline: TimelineEvent[];
}

export interface FoundersData {
  founders: Founder[];
}
export type Mood = { id: string; emoji: string; icon: string; label: string; color: string };

export interface Post {
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
  image?: import('react-native').ImageSourcePropType;
  stack: string[];
  mood: Mood;
  likes: number;
  comments: number;
  liked?: boolean;
  saved?: boolean;
  followed?: boolean;
}
export type FeedItem =
  | { kind: 'post'; data: Post }
  | { kind: 'celebration' }
  | { kind: 'suggested' }
  | { kind: 'launched' };