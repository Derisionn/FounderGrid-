export type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  username: string;
  text: string;
  time: string;
  likes: number;
  liked?: boolean;
  pinned?: boolean;
  replies?: Comment[];
};

export const POST_PREVIEW = {
  authorName: 'Anmol Singh',
  authorUsername: '@anmol',
  authorSeed: 'me',
  project: 'Foundora',
  time: 'Today',
  text: 'Shipped the new Add Post screen. Auto-save drafts + mood selector working clean.',
  likes: 42,
  totalComments: 18,
};

export const COMMENTS: Comment[] = [
  {
    id: 'c1',
    authorId: 'u1',
    authorName: 'Riya Kapoor',
    username: '@riya.codes',
    text: "the mood selector is such a clean touch — does it pre-fill based on time of day?",
    time: '12m',
    likes: 8,
    pinned: true,
    replies: [
      {
        id: 'c1r1',
        authorId: 'me',
        authorName: 'Anmol Singh',
        username: '@anmol',
        text: 'not yet but great idea, adding it to the backlog 🙏',
        time: '10m',
        likes: 3,
        liked: true,
        replies: [
          {
            id: 'c1r1r1',
            authorId: 'u1',
            authorName: 'Riya Kapoor',
            username: '@riya.codes',
            text: 'lmk when it ships, would love to try it',
            time: '8m',
            likes: 1,
          },
        ],
      },
      {
        id: 'c1r2',
        authorId: 'u2',
        authorName: 'Devansh Mehta',
        username: '@devansh',
        text: '+1, basing on time of day is super underrated',
        time: '7m',
        likes: 2,
      },
    ],
  },
  {
    id: 'c2',
    authorId: 'u3',
    authorName: 'Aarav Sethi',
    username: '@aarav',
    text: 'the auto-save took me a while to get right too. did you use a debounced setState or a ref?',
    time: '35m',
    likes: 5,
    replies: [
      {
        id: 'c2r1',
        authorId: 'me',
        authorName: 'Anmol Singh',
        username: '@anmol',
        text: 'ref + 800ms debounce — way fewer rerenders than setState',
        time: '30m',
        likes: 4,
      },
    ],
  },
  {
    id: 'c3',
    authorId: 'u4',
    authorName: 'Naina Iyer',
    username: '@naina.builds',
    text: 'this is the kind of detail that makes apps feel premium 👌',
    time: '1h',
    likes: 11,
    liked: true,
  },
  {
    id: 'c4',
    authorId: 'u5',
    authorName: 'Kabir Singh',
    username: '@kabir',
    text: "tiny nit — the mood pills could use a touch more breathing room on small phones",
    time: '2h',
    likes: 2,
    replies: [
      {
        id: 'c4r1',
        authorId: 'me',
        authorName: 'Anmol Singh',
        username: '@anmol',
        text: 'fair, will bump the horizontal padding on the next pass',
        time: '1h',
        likes: 1,
      },
    ],
  },
  {
    id: 'c5',
    authorId: 'u6',
    authorName: 'Mira Joshi',
    username: '@mira',
    text: 'congrats on shipping 🚀',
    time: '3h',
    likes: 6,
  },
];
