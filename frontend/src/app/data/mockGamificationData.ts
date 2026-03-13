import { UserProfile, DEFAULT_ACHIEVEMENTS } from '../utils/gamification';
import { MessageThread, createThread } from '../utils/messaging';

export const mockUserProfile: UserProfile = {
  id: 'user-current',
  name: 'Alex Morgan',
  avatar: '',
  level: 12,
  points: 1850,
  pointsToNextLevel: 650,
  totalCO2Saved: 95.5,
  totalRides: 62,
  achievements: DEFAULT_ACHIEVEMENTS.map((ach) => {
    let progress = 0;
    let isUnlocked = false;

    // Simulate some unlocked achievements
    if (ach.id === 'ach-first-ride') {
      progress = 62;
      isUnlocked = true;
    } else if (ach.id === 'ach-10-rides') {
      progress = 62;
      isUnlocked = true;
    } else if (ach.id === 'ach-50-rides') {
      progress = 62;
      isUnlocked = true;
    } else if (ach.id === 'ach-50kg-co2') {
      progress = 95.5;
      isUnlocked = true;
    } else if (ach.id === 'ach-7-day-streak') {
      progress = 7;
      isUnlocked = true;
    } else if (ach.id === 'ach-first-share') {
      progress = 5;
      isUnlocked = true;
    }

    return {
      ...ach,
      progress,
      isUnlocked,
      unlockedAt: isUnlocked ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
    };
  }),
  badges: [
    {
      id: 'badge-1',
      name: 'Early Adopter',
      description: 'Joined the platform in its first month',
      icon: '🎖️',
      color: 'blue',
      earnedAt: new Date('2026-01-15'),
    },
    {
      id: 'badge-2',
      name: 'Eco Champion',
      description: 'Saved 50kg of CO₂',
      icon: '🌿',
      color: 'green',
      earnedAt: new Date('2026-02-01'),
    },
    {
      id: 'badge-3',
      name: 'Week Warrior',
      description: '7-day streak achieved',
      icon: '🔥',
      color: 'orange',
      earnedAt: new Date('2026-02-10'),
    },
  ],
  streak: 7,
  longestStreak: 12,
  rank: 6,
  tier: 'gold',
};

export const mockMessageThreads: MessageThread[] = [
  createThread(
    'ride',
    'Morning Commute - Feb 20',
    [
      {
        id: 'user-1',
        name: 'Sarah Johnson',
        avatar: '',
        role: 'driver',
        isOnline: true,
      },
      {
        id: 'user-current',
        name: 'You',
        avatar: '',
        role: 'passenger',
        isOnline: true,
      },
    ],
    'ride-123'
  ),
  createThread(
    'direct',
    'Mike Chen',
    [
      {
        id: 'user-2',
        name: 'Mike Chen',
        avatar: '',
        isOnline: false,
        lastSeen: new Date(Date.now() - 1800000),
      },
      {
        id: 'user-current',
        name: 'You',
        avatar: '',
        isOnline: true,
      },
    ]
  ),
  createThread(
    'group',
    'Tech Park Carpool Group',
    [
      {
        id: 'user-3',
        name: 'Emily Davis',
        avatar: '',
        isOnline: true,
      },
      {
        id: 'user-4',
        name: 'David Wilson',
        avatar: '',
        isOnline: false,
      },
      {
        id: 'user-5',
        name: 'Lisa Brown',
        avatar: '',
        isOnline: true,
      },
      {
        id: 'user-current',
        name: 'You',
        avatar: '',
        isOnline: true,
      },
    ]
  ),
];

// Update threads with last messages and unread counts
mockMessageThreads[0].lastMessage = {
  id: 'msg-1',
  threadId: mockMessageThreads[0].id,
  senderId: 'user-1',
  senderName: 'Sarah Johnson',
  content: "I'm about 5 minutes away!",
  timestamp: new Date(Date.now() - 300000),
  isRead: false,
  type: 'text',
  reactions: [],
};
mockMessageThreads[0].unreadCount = 2;
mockMessageThreads[0].isPinned = true;

mockMessageThreads[1].lastMessage = {
  id: 'msg-2',
  threadId: mockMessageThreads[1].id,
  senderId: 'user-2',
  senderName: 'Mike Chen',
  content: 'Want to share a ride tomorrow?',
  timestamp: new Date(Date.now() - 7200000),
  isRead: true,
  type: 'text',
  reactions: [],
};
mockMessageThreads[1].unreadCount = 0;

mockMessageThreads[2].lastMessage = {
  id: 'msg-3',
  threadId: mockMessageThreads[2].id,
  senderId: 'user-3',
  senderName: 'Emily Davis',
  content: 'Great idea! Count me in.',
  timestamp: new Date(Date.now() - 86400000),
  isRead: true,
  type: 'text',
  reactions: [],
};
mockMessageThreads[2].unreadCount = 0;
