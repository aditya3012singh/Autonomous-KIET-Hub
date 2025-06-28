export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: 'STUDENT' | 'ADMIN';
  timestamp: string;
  type: 'text' | 'image' | 'file';
  edited?: boolean;
  editedAt?: string;
  replyTo?: string;
  reactions?: ChatReaction[];
}

export interface ChatReaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'general' | 'study-group' | 'subject' | 'private';
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  createdBy: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
  isOnline: boolean;
  lastSeen?: string;
  avatar?: string;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  roomId: string;
}