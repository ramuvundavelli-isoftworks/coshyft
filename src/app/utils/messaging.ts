// In-App Messaging & Chat Utilities

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'system' | 'location' | 'ride-request' | 'ride-update';
  metadata?: {
    rideId?: string;
    location?: { lat: number; lng: number; address: string };
    action?: 'accepted' | 'declined' | 'cancelled' | 'completed';
  };
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface MessageThread {
  id: string;
  type: 'direct' | 'group' | 'ride';
  name: string;
  participants: ThreadParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  rideId?: string;
  isArchived: boolean;
  isPinned: boolean;
  metadata?: {
    rideDate?: Date;
    rideStatus?: string;
  };
}

export interface ThreadParticipant {
  id: string;
  name: string;
  avatar?: string;
  role?: 'driver' | 'passenger';
  isOnline: boolean;
  lastSeen?: Date;
}

export interface QuickReply {
  id: string;
  text: string;
  category: 'greeting' | 'confirmation' | 'location' | 'timing' | 'custom';
  icon: string;
  usageCount: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'pickup' | 'arrival' | 'delay' | 'cancellation' | 'gratitude';
  variables?: string[];
}

/**
 * Default quick replies
 */
export const defaultQuickReplies: QuickReply[] = [
  { id: 'qr1', text: "I'm on my way!", category: 'timing', icon: '🚗', usageCount: 0 },
  { id: 'qr2', text: 'Arriving in 5 minutes', category: 'timing', icon: '⏰', usageCount: 0 },
  { id: 'qr3', text: "I'm here", category: 'location', icon: '📍', usageCount: 0 },
  { id: 'qr4', text: 'Running 5 minutes late', category: 'timing', icon: '⏱️', usageCount: 0 },
  { id: 'qr5', text: 'Thank you!', category: 'gratitude', icon: '🙏', usageCount: 0 },
  { id: 'qr6', text: 'See you soon!', category: 'greeting', icon: '👋', usageCount: 0 },
  { id: 'qr7', text: 'Confirmed!', category: 'confirmation', icon: '✅', usageCount: 0 },
  { id: 'qr8', text: 'Sounds good!', category: 'confirmation', icon: '👍', usageCount: 0 },
];

/**
 * Message templates
 */
export const messageTemplates: MessageTemplate[] = [
  {
    id: 'tpl1',
    name: 'Pickup Notification',
    content: "Hi {name}! I'm heading to pick you up at {location}. ETA: {eta}",
    category: 'pickup',
    variables: ['name', 'location', 'eta'],
  },
  {
    id: 'tpl2',
    name: 'Arrival Notification',
    content: "I've arrived at {location}. I'm in a {vehicle}.",
    category: 'arrival',
    variables: ['location', 'vehicle'],
  },
  {
    id: 'tpl3',
    name: 'Delay Notice',
    content: 'Sorry, running {minutes} minutes late due to {reason}. Still good for you?',
    category: 'delay',
    variables: ['minutes', 'reason'],
  },
  {
    id: 'tpl4',
    name: 'Cancellation Notice',
    content: 'Sorry, I need to cancel our ride today due to {reason}. Can we reschedule?',
    category: 'cancellation',
    variables: ['reason'],
  },
  {
    id: 'tpl5',
    name: 'Thank You Message',
    content: 'Thanks for the ride, {name}! Really appreciate it. See you next time!',
    category: 'gratitude',
    variables: ['name'],
  },
];

/**
 * Create a new message
 */
export function createMessage(
  threadId: string,
  senderId: string,
  senderName: string,
  content: string,
  type: Message['type'] = 'text',
  metadata?: Message['metadata']
): Message {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    threadId,
    senderId,
    senderName,
    content,
    timestamp: new Date(),
    isRead: false,
    type,
    metadata,
    reactions: [],
  };
}

/**
 * Create a new message thread
 */
export function createThread(
  type: MessageThread['type'],
  name: string,
  participants: ThreadParticipant[],
  rideId?: string
): MessageThread {
  return {
    id: `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    name,
    participants,
    unreadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    rideId,
    isArchived: false,
    isPinned: false,
  };
}

/**
 * Format timestamp for display
 */
export function formatMessageTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Group messages by date
 */
export function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
  const grouped = new Map<string, Message[]>();
  
  messages.forEach((message) => {
    const dateKey = message.timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(message);
  });
  
  return grouped;
}

/**
 * Mark messages as read
 */
export function markMessagesAsRead(messages: Message[], userId: string): Message[] {
  return messages.map((msg) =>
    msg.senderId !== userId ? { ...msg, isRead: true } : msg
  );
}

/**
 * Filter threads by search query
 */
export function filterThreads(threads: MessageThread[], query: string): MessageThread[] {
  const lowerQuery = query.toLowerCase();
  return threads.filter(
    (thread) =>
      thread.name.toLowerCase().includes(lowerQuery) ||
      thread.participants.some((p) => p.name.toLowerCase().includes(lowerQuery)) ||
      thread.lastMessage?.content.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Sort threads by most recent
 */
export function sortThreadsByRecent(threads: MessageThread[]): MessageThread[] {
  return [...threads].sort((a, b) => {
    // Pinned threads first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then by most recent
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
}

/**
 * Get unread message count
 */
export function getTotalUnreadCount(threads: MessageThread[]): number {
  return threads.reduce((sum, thread) => sum + thread.unreadCount, 0);
}

/**
 * Apply template with variables
 */
export function applyTemplate(
  template: MessageTemplate,
  variables: Record<string, string>
): string {
  let content = template.content;
  
  template.variables?.forEach((variable) => {
    const value = variables[variable] || `{${variable}}`;
    content = content.replace(`{${variable}}`, value);
  });
  
  return content;
}

/**
 * Create system message
 */
export function createSystemMessage(
  threadId: string,
  content: string,
  metadata?: Message['metadata']
): Message {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    threadId,
    senderId: 'system',
    senderName: 'System',
    content,
    timestamp: new Date(),
    isRead: true,
    type: 'system',
    metadata,
    reactions: [],
  };
}

/**
 * Get typing indicator text
 */
export function getTypingIndicatorText(participants: ThreadParticipant[]): string {
  const typingUsers = participants.filter((p) => p.isOnline);
  
  if (typingUsers.length === 0) return '';
  if (typingUsers.length === 1) return `${typingUsers[0].name} is typing...`;
  if (typingUsers.length === 2)
    return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`;
  return `${typingUsers.length} people are typing...`;
}

/**
 * Validate message content
 */
export function validateMessage(content: string): { isValid: boolean; error?: string } {
  if (!content || content.trim() === '') {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (content.length > 2000) {
    return { isValid: false, error: 'Message is too long (max 2000 characters)' };
  }
  
  return { isValid: true };
}

/**
 * Get message preview (truncated)
 */
export function getMessagePreview(message: Message, maxLength: number = 50): string {
  if (message.type === 'system') {
    return `🔔 ${message.content}`;
  }
  
  if (message.type === 'location') {
    return '📍 Shared location';
  }
  
  if (message.type === 'ride-request') {
    return '🚗 Ride request';
  }
  
  if (message.content.length <= maxLength) {
    return message.content;
  }
  
  return `${message.content.substring(0, maxLength)}...`;
}

/**
 * Add reaction to message
 */
export function addReaction(
  message: Message,
  emoji: string,
  userId: string,
  userName: string
): Message {
  const existingReaction = message.reactions?.find(
    (r) => r.emoji === emoji && r.userId === userId
  );
  
  if (existingReaction) {
    // Remove reaction if already exists
    return {
      ...message,
      reactions: message.reactions?.filter(
        (r) => !(r.emoji === emoji && r.userId === userId)
      ),
    };
  }
  
  // Add new reaction
  return {
    ...message,
    reactions: [...(message.reactions || []), { emoji, userId, userName }],
  };
}

/**
 * Get reaction summary
 */
export function getReactionSummary(reactions: MessageReaction[]): string {
  const grouped = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(grouped)
    .map(([emoji, count]) => `${emoji} ${count}`)
    .join('  ');
}
