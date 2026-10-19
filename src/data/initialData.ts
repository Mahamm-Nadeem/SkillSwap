import { UserProfile, SwapRequest, SwapSession, InAppNotification } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_ayesha',
    displayName: 'Ayesha Khan',
    headline: 'Aspiring UX Designer & Content Strategist',
    bio: 'Bootstrapping my career shift into product design. Ready to trade practical academic English coaching and portfolio writing for hands-on Figma and UX mentorship.',
    timezone: 'America/New_York',
    published: true,
    averageRating: 4.8,
    totalCompletedSessions: 6,
    avatarColor: 'from-amber-600 to-rose-600',
    avatarInitials: 'AK',
    memberSince: 'March 2026',
    skillsOffered: [
      { id: 'so_1', name: 'Conversational English', level: 'Advanced', category: 'Language' },
      { id: 'so_2', name: 'Academic & Essay Writing', level: 'Advanced', category: 'Writing' },
      { id: 'so_3', name: 'UX Copywriting', level: 'Intermediate', category: 'Design' }
    ],
    skillsRequested: [
      { id: 'sr_1', name: 'Figma Basics', level: 'Beginner', category: 'Design' },
      { id: 'sr_2', name: 'UX Research & Testing', level: 'Beginner', category: 'Design' },
      { id: 'sr_3', name: 'Design Systems', level: 'Beginner', category: 'Design' }
    ]
  },
  {
    id: 'user_marcus',
    displayName: 'Marcus Lee',
    headline: 'Junior Web Developer & Remote Worker',
    bio: 'Junior web developer passionate about web accessibility and frontend tools. Happy to pair on JavaScript debugging and CSS layouts in exchange for conversational Spanish practice.',
    timezone: 'America/Los_Angeles',
    published: true,
    averageRating: 4.9,
    totalCompletedSessions: 8,
    avatarColor: 'from-blue-600 to-indigo-600',
    avatarInitials: 'ML',
    memberSince: 'February 2026',
    skillsOffered: [
      { id: 'so_4', name: 'HTML & CSS Architecture', level: 'Advanced', category: 'Engineering' },
      { id: 'so_5', name: 'JavaScript Debugging', level: 'Advanced', category: 'Engineering' },
      { id: 'so_6', name: 'Responsive Web Design', level: 'Advanced', category: 'Engineering' }
    ],
    skillsRequested: [
      { id: 'sr_4', name: 'Conversational Spanish', level: 'Beginner', category: 'Language' },
      { id: 'sr_5', name: 'Conversational English', level: 'Intermediate', category: 'Language' }
    ]
  },
  {
    id: 'user_elena',
    displayName: 'Elena Rostova',
    headline: 'Brand Identity & Visual Designer',
    bio: 'Brand specialist with 4+ years creating visual guidelines for early-stage companies. Looking to pick up frontend code (React/Tailwind) in exchange for brand audits and Figma craft.',
    timezone: 'Europe/London',
    published: true,
    averageRating: 4.7,
    totalCompletedSessions: 5,
    avatarColor: 'from-emerald-600 to-teal-700',
    avatarInitials: 'ER',
    memberSince: 'January 2026',
    skillsOffered: [
      { id: 'so_7', name: 'Figma Basics', level: 'Advanced', category: 'Design' },
      { id: 'so_8', name: 'Brand Identity & Guidelines', level: 'Advanced', category: 'Design' },
      { id: 'so_9', name: 'Typography & Layout', level: 'Advanced', category: 'Design' }
    ],
    skillsRequested: [
      { id: 'sr_6', name: 'HTML & CSS Architecture', level: 'Beginner', category: 'Engineering' },
      { id: 'sr_7', name: 'JavaScript Debugging', level: 'Beginner', category: 'Engineering' }
    ]
  },
  {
    id: 'user_david',
    displayName: 'David Chen',
    headline: 'Senior Frontend Engineer & Mentor',
    bio: 'Specialist in React performance, component libraries, and clean state architectures. Looking to trade technical deep dives for help with freelance client scoping and product strategy.',
    timezone: 'America/Chicago',
    published: true,
    averageRating: 5.0,
    totalCompletedSessions: 12,
    avatarColor: 'from-purple-600 to-violet-800',
    avatarInitials: 'DC',
    memberSince: 'December 2025',
    skillsOffered: [
      { id: 'so_10', name: 'React Component Architecture', level: 'Advanced', category: 'Engineering' },
      { id: 'so_11', name: 'TypeScript Systems', level: 'Advanced', category: 'Engineering' },
      { id: 'so_12', name: 'Code Review & Refactoring', level: 'Advanced', category: 'Engineering' }
    ],
    skillsRequested: [
      { id: 'sr_8', name: 'Academic & Essay Writing', level: 'Intermediate', category: 'Writing' },
      { id: 'sr_9', name: 'Product Management Scoping', level: 'Beginner', category: 'Product' }
    ]
  },
  {
    id: 'user_sophia',
    displayName: 'Sophia Martinez',
    headline: 'Digital Illustrator & 2D Animator',
    bio: 'Freelance illustrator creating character designs and asset packs. Seeking guidance on client contracts and SEO optimization in return for digital drawing and Procreate workflows.',
    timezone: 'America/Denver',
    published: true,
    averageRating: 4.6,
    totalCompletedSessions: 4,
    avatarColor: 'from-pink-600 to-rose-700',
    avatarInitials: 'SM',
    memberSince: 'March 2026',
    skillsOffered: [
      { id: 'so_13', name: 'Vector Illustration', level: 'Advanced', category: 'Design' },
      { id: 'so_14', name: 'Procreate Workflow', level: 'Advanced', category: 'Design' },
      { id: 'so_15', name: 'Storyboard Drafting', level: 'Intermediate', category: 'Design' }
    ],
    skillsRequested: [
      { id: 'sr_10', name: 'UX Copywriting', level: 'Beginner', category: 'Writing' },
      { id: 'sr_11', name: 'Conversational English', level: 'Intermediate', category: 'Language' }
    ]
  }
];

export const INITIAL_REQUESTS: SwapRequest[] = [
  {
    id: 'req_1',
    senderId: 'user_ayesha',
    recipientId: 'user_marcus',
    senderSkill: 'Conversational English',
    recipientSkill: 'HTML & CSS Architecture',
    introNote: 'Hi Marcus! I saw you are looking to practice conversational English. I can help with accent and fluency practice, and would love your guidance on responsive CSS layouts.',
    status: 'Accepted',
    createdAt: '2026-10-16T14:30:00Z',
    sessionId: 'sess_1'
  },
  {
    id: 'req_2',
    senderId: 'user_elena',
    recipientId: 'user_ayesha',
    senderSkill: 'Figma Basics',
    recipientSkill: 'Conversational English',
    introNote: 'Hello Ayesha! I saw on your profile you want to master Figma tools and UI fundamentals. I would be thrilled to review your wireframes in exchange for conversational English practice.',
    status: 'Pending',
    createdAt: '2026-10-18T09:15:00Z'
  },
  {
    id: 'req_3',
    senderId: 'user_ayesha',
    recipientId: 'user_david',
    senderSkill: 'Academic & Essay Writing',
    recipientSkill: 'React Component Architecture',
    introNote: 'Hi David! I would love to learn React fundamentals from you, and can assist you with structuring your technical essays or client writeups.',
    status: 'Pending',
    createdAt: '2026-10-18T16:00:00Z'
  }
];

export const INITIAL_SESSIONS: SwapSession[] = [
  {
    id: 'sess_1',
    swapRequestId: 'req_1',
    userAId: 'user_ayesha',
    userBId: 'user_marcus',
    skillTaughtByA: 'Conversational English',
    skillTaughtByB: 'HTML & CSS Architecture',
    date: '2026-10-22',
    time: '18:00',
    durationMinutes: 45,
    meetingUrl: 'https://meet.google.com/xyz-ghjk-uvw',
    status: 'Scheduled',
    proposedBy: 'user_marcus',
    proposedAt: '2026-10-17T11:00:00Z',
    feedbacks: {}
  },
  {
    id: 'sess_past_1',
    swapRequestId: 'req_past_1',
    userAId: 'user_ayesha',
    userBId: 'user_david',
    skillTaughtByA: 'Academic & Essay Writing',
    skillTaughtByB: 'TypeScript Systems',
    date: '2026-10-10',
    time: '15:00',
    durationMinutes: 60,
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    status: 'Completed',
    proposedBy: 'user_david',
    proposedAt: '2026-10-08T10:00:00Z',
    feedbacks: {
      user_ayesha: {
        sessionTookPlace: true,
        punctualityRating: 5,
        knowledgeSharingRating: 5,
        overallRating: 5,
        reviewText: 'David explained TypeScript generics and props with incredible patience. Clear, concise, and structured.',
        submittedAt: '2026-10-10T16:20:00Z'
      },
      user_david: {
        sessionTookPlace: true,
        punctualityRating: 5,
        knowledgeSharingRating: 5,
        overallRating: 5,
        reviewText: 'Ayesha gave great feedback on my draft article and helped refine the narrative flow. Highly recommended!',
        submittedAt: '2026-10-10T16:25:00Z'
      }
    }
  }
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_ayesha',
    title: 'Swap Request Accepted',
    message: 'Marcus Lee accepted your swap proposal! You can now propose a meeting time.',
    type: 'acceptance',
    timestamp: '2026-10-17T10:45:00Z',
    read: false,
    linkAction: {
      type: 'session',
      targetId: 'sess_1'
    }
  },
  {
    id: 'notif_2',
    userId: 'user_ayesha',
    title: 'New Swap Proposal',
    message: 'Elena Rostova proposed an exchange: Figma Basics for Conversational English.',
    type: 'request',
    timestamp: '2026-10-18T09:15:00Z',
    read: false,
    linkAction: {
      type: 'request',
      targetId: 'req_2'
    }
  }
];
