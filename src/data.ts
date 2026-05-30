import { UserStats, ScriptureVerse, Prayer, Mission, PathStage } from "./types";

export const DEFAULT_USER_STATS: UserStats = {
  username: "Seeker",
  avatarUrl: "",
  completedMissionsCount: 0,
  currentStreak: 0,
  level: 1,
  checklist: {
    prayer: false,
    word: false,
    obedience: false,
  },
};

export const DEFAULT_VERSES: ScriptureVerse[] = [
  {
    id: "v1",
    reference: "John 15:1-5",
    verseLines: [
      "“I am the true vine, and my Father is the gardener. He cuts off every branch in me that bears no fruit, while every branch that does bear fruit he prunes so that it will be even more fruitful.”",
      "“You are already clean because of the word I have spoken to you. Remain in me, as I also remain in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me.”",
      "“I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.”"
    ],
    simpleMeaning: "Jesus uses the metaphor of a vine to illustrate our total dependence on Him. Pruning isn't punishment; it's a preparation for greater growth.",
    context: "Spoken by Jesus to His disciples during the Last Supper, shortly before His arrest. It underscores the vital union between Him and His followers required to sustain healthy, vibrant faith.",
    application: "Identify any aspects of life you are trying to handle in your own strength. Consecrate those plans to God today, resting in the simplicity of remaining in Him rather than relying on self-effort.",
    reflection: "Remaining in God means constant communion—asking, listening, and obeying His quiet prompts.",
    actionStep: "Write down 3 areas of self-reliance and declare your alignment with Christ as your source.",
    dayNumber: 4,
    totalDays: 21
  },
  {
    id: "v2",
    reference: "Psalm 23:1-3",
    verseLines: [
      "“The Lord is my shepherd; I shall not want.”",
      "“He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name’s sake.”"
    ],
    simpleMeaning: "God’s provision is complete; find rest in His guidance today. He goes before you as a caring shepherd.",
    context: "A psalm of David, expressing ultimate trust and confidence in God's protective and nurturing care.",
    application: "Take 10 minutes to sit by quiet surroundings, breathe deeply, and thank God for His abundant provision in your current season.",
    reflection: "Rest is not inactivity; it is trust in active shepherd-care.",
    actionStep: "Take 5 minutes to express gratitude in prayer today.",
    dayNumber: 1,
    totalDays: 21
  },
  {
    id: "v3",
    reference: "John 14:6",
    verseLines: [
      "“I am the way, the truth, and the life. No one comes to the Father except through me.”"
    ],
    simpleMeaning: "Jesus is the exclusive path of reconciliation, clarity of truth, and source of eternal life.",
    context: "Comforting the disciples about the Father's house, Jesus answers Thomas's question about navigation and destination.",
    application: "Rely on the character of Jesus as your absolute truth when making decision dilemmas today.",
    reflection: "Jesus is not merely a pathfinder; He is the destination itself.",
    actionStep: "Share this truth during a conversation or meditate on it for 10 minutes.",
    dayNumber: 2,
    totalDays: 21
  }
];

export const DEFAULT_PRAYERS: Prayer[] = [
  {
    id: "p1",
    text: "Lord, grant me the wisdom to navigate the challenges at work today. Help me to speak with grace and act with integrity even when under pressure.",
    timestamp: "TODAY, 8:42 AM",
    categoryTags: ["WORK", "WISDOM"],
    answered: false
  },
  {
    id: "p2",
    text: "Seeking healing for Sarah's surgery. Praying for the surgeon's hands and for a peace that surpasses all understanding for the family.",
    timestamp: "AUG 24, 2023",
    categoryTags: ["HEALTH", "FAMILY"],
    answered: true,
    answerText: "Surgery was a success! Doctors are amazed at the recovery speed. Praise be to God."
  },
  {
    id: "p3",
    text: "Guidance for the new mission season. Open the doors that should be opened and close those that are not from You.",
    timestamp: "AUG 20, 2023",
    categoryTags: ["GUIDANCE", "FAITH"],
    answered: false
  }
];

export const DEFAULT_MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "Forgive someone",
    description: "Release a debt or a grudge that you've been holding. Take the first step toward reconciliation today.",
    iconType: "Heart",
    status: "idle"
  },
  {
    id: "m2",
    title: "Pray for someone",
    description: "Identify someone in your circle who is struggling and commit to five minutes of focused intercession.",
    iconType: "BookOpen",
    status: "idle"
  },
  {
    id: "m3",
    title: "Share faith",
    description: "Have a meaningful conversation about your spiritual journey with a friend or colleague this week.",
    iconType: "MessageCircle",
    status: "idle"
  },
  {
    id: "m4",
    title: "Serve locally",
    description: "Find a local food bank, shelter, or community garden and sign up for a volunteer shift.",
    iconType: "Users",
    status: "idle"
  }
];

export const DEFAULT_STAGES: PathStage[] = [
  {
    id: "s1",
    name: "Seeker",
    description: "Discovering who God is and asking the fundamental questions of faith.",
    completedDate: "Jan 2024",
    completed: true,
    active: false
  },
  {
    id: "s2",
    name: "Believer",
    description: "Placing active trust in Jesus Christ and acknowledging Him as Savior.",
    completedDate: "March 2024",
    completed: true,
    active: false
  },
  {
    id: "s3",
    name: "Disciple",
    description: "Developing consistent personal disciplines of prayer, study, community life, and obedience.",
    completed: false,
    active: true,
    progressPercent: 64,
    subtracks: [
      {
        id: "sub1",
        label: "Deep Study",
        subtitle: "4/7 days completed",
        icon: "BookOpen"
      },
      {
        id: "sub2",
        label: "Koinonia",
        subtitle: "Weekly group session",
        icon: "Users"
      },
      {
        id: "sub3",
        label: "Reflection",
        subtitle: "Daily journal entry",
        icon: "Edit3"
      }
    ],
    requirements: [
      {
        id: "r1",
        text: "Complete 'The Great Commission' module",
        completed: true
      },
      {
        id: "r2",
        text: "Guide 2 individuals through Seeker path",
        completed: false
      },
      {
        id: "r3",
        text: "Attend Leadership Workshop",
        completed: false
      }
    ]
  },
  {
    id: "s4",
    name: "Ambassador",
    description: "Leading others towards the truth, showing exemplary character, and discipling searchers.",
    completed: false,
    active: false
  }
];
