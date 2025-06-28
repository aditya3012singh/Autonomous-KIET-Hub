import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage, ChatRoom, ChatParticipant, TypingIndicator } from '../types/chat';
import { useAuth } from './AuthContext';

type ChatRoomType = ChatRoom['type'];

interface ChatContextType {
  messages: ChatMessage[];
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  onlineUsers: ChatParticipant[];
  typingUsers: TypingIndicator[];
  isConnected: boolean;
  sendMessage: (content: string, type?: 'text' | 'image' | 'file') => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  createRoom: (name: string, description?: string, type?: ChatRoomType) => void;
  startTyping: () => void;
  stopTyping: () => void;
  addReaction: (messageId: string, emoji: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<ChatParticipant[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    setIsConnected(true);

    const mockRooms: ChatRoom[] = [
      {
        id: '1',
        name: 'General Discussion',
        description: 'General chat for all students',
        type: 'general',
        participants: [],
        unreadCount: 3,
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'admin',
        lastMessage: {
          id: '1',
          content: 'Welcome to the general discussion!',
          senderId: '3',
          senderName: 'Admin User',
          senderRole: 'ADMIN',
          timestamp: '2024-01-15T12:00:00Z',
          type: 'text'
        }
      }
    ];

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        content: 'Welcome to the general discussion!',
        senderId: '3',
        senderName: 'Admin User',
        senderRole: 'ADMIN',
        timestamp: '2024-01-15T12:00:00Z',
        type: 'text'
      }
    ];

    setRooms(mockRooms);
    setMessages(mockMessages);
    setActiveRoom(mockRooms[0]);

    return () => setIsConnected(false);
  }, [user]);

  const sendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!user || !activeRoom || !content.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      timestamp: new Date().toISOString(),
      type
    };

    setMessages(prev => [...prev, newMessage]);
    setRooms(prev => prev.map(room =>
      room.id === activeRoom.id ? { ...room, lastMessage: newMessage } : room
    ));
  };

  const joinRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setActiveRoom(room);
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, unreadCount: 0 } : r));
    }
  };

  const leaveRoom = (roomId: string) => {
    console.log('Leaving room:', roomId);
  };

  const createRoom = (
    name: string,
    description?: string,
    type: ChatRoomType = 'study-group'
  ) => {
    if (!user) return;

    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      name,
      description,
      type,
      participants: [
        { id: user.id, name: user.name, role: user.role, isOnline: true }
      ],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    setRooms(prev => [...prev, newRoom]);
  };

  const startTyping = () => {
    if (!user || !activeRoom) return;
  };

  const stopTyping = () => {
    if (!user || !activeRoom) return;
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!user) return;
    setMessages(prev => prev.map(message => {
      if (message.id !== messageId) return message;

      const reactions = message.reactions || [];
      const exists = reactions.find(r => r.userId === user.id && r.emoji === emoji);

      return {
        ...message,
        reactions: exists
          ? reactions.filter(r => r.id !== exists.id)
          : [...reactions, {
              id: Date.now().toString(),
              emoji,
              userId: user.id,
              userName: user.name
            }]
      };
    }));
  };

  const editMessage = (messageId: string, newContent: string) => {
    if (!user) return;
    setMessages(prev => prev.map(msg =>
      msg.id === messageId && msg.senderId === user.id
        ? { ...msg, content: newContent, edited: true, editedAt: new Date().toISOString() }
        : msg
    ));
  };

  const deleteMessage = (messageId: string) => {
    if (!user) return;
    setMessages(prev => prev.filter(msg => !(msg.id === messageId && msg.senderId === user.id)));
  };

  const value: ChatContextType = {
    messages,
    rooms,
    activeRoom,
    onlineUsers,
    typingUsers,
    isConnected,
    sendMessage,
    joinRoom,
    leaveRoom,
    createRoom,
    startTyping,
    stopTyping,
    addReaction,
    editMessage,
    deleteMessage
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
