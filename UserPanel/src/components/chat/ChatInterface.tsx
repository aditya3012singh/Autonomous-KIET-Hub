import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Smile,
  Paperclip,
  Users,
  Settings,
  Search,
  Phone,
  Video,
  MoreVertical,
  Edit3,
  Trash2,
  Reply,
  Heart,
  ThumbsUp,
  Laugh,
  X,
  Plus,
  Hash,
  Lock,
  Globe,
  UserPlus,
  Bot,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage, ChatRoom } from '../../types/chat';
import AIAssistant from './AIAssistant';

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const {
    messages,
    rooms,
    activeRoom,
    onlineUsers,
    typingUsers,
    isConnected,
    sendMessage,
    joinRoom,
    createRoom,
    addReaction,
    editMessage,
    deleteMessage
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showRoomSettings, setShowRoomSettings] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    description: '',
    type: 'study-group'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['❤️', '👍', '😂', '😮', '😢', '😡', '🎉', '🔥'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // Check if message starts with AI trigger
      if (messageInput.toLowerCase().startsWith('/ai ') || messageInput.toLowerCase().startsWith('@studybot ')) {
        const aiPrompt = messageInput.replace(/^(\/ai |@studybot )/i, '');
        handleAIMessage(aiPrompt, false);
      } else {
        sendMessage(messageInput);
      }
      setMessageInput('');
    }
  };

  const handleAIMessage = (content: string, isAI: boolean = false) => {
    if (isAI) {
      // Create AI message and add to chat
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        senderId: 'ai-assistant',
        senderName: 'StudyBot AI',
        senderRole: 'ADMIN',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      // In a real implementation, you'd add this through the chat context
      // For demo, we'll simulate by sending through the normal flow
      setTimeout(() => {
        sendMessage(`🤖 **StudyBot AI**: ${content}`);
      }, 500);
    } else {
      // Send user message normally
      sendMessage(content);
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessage(messageId);
    setEditContent(content);
  };

  const handleSaveEdit = () => {
    if (editingMessage && editContent.trim()) {
      editMessage(editingMessage, editContent);
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomData.name.trim()) {
      createRoom(newRoomData.name, newRoomData.description, newRoomData.type);
      setNewRoomData({ name: '', description: '', type: 'study-group' });
      setShowCreateRoom(false);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeRoomMessages = messages.filter(msg => 
    activeRoom && msg.senderId // For demo, showing all messages in active room
  );

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isAIMessage = (message: ChatMessage) => {
    return message.senderId === 'ai-assistant' || 
           message.senderName === 'StudyBot AI' ||
           message.content.includes('🤖 **StudyBot AI**');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-30 animate-pulse delay-2000"></div>

      <div className="relative z-10 h-screen flex">
        {/* Sidebar - Rooms List */}
        <div className="w-80 bg-white/70 backdrop-blur-sm border-r border-white/20 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chat Rooms
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAIAssistant(!showAIAssistant)}
                  className={`p-2 rounded-lg hover:shadow-lg transform hover:scale-110 transition-all duration-200 ${
                    showAIAssistant 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                      : 'bg-white/50 text-slate-600'
                  }`}
                  title="Toggle AI Assistant"
                >
                  <Bot className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transform hover:scale-110 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* AI Assistant Panel */}
          {showAIAssistant && (
            <div className="p-4 border-b border-white/20 max-h-96 overflow-y-auto">
              <AIAssistant onSendMessage={handleAIMessage} />
            </div>
          )}

          {/* Rooms List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => joinRoom(room.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                  activeRoom?.id === room.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/50 backdrop-blur-sm hover:bg-white/70 text-slate-800 border border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      room.type === 'general' ? 'bg-green-500' :
                      room.type === 'study-group' ? 'bg-blue-500' :
                      room.type === 'subject' ? 'bg-purple-500' : 'bg-slate-500'
                    }`}>
                      {room.type === 'general' ? <Globe className="h-4 w-4 text-white" /> :
                       room.type === 'private' ? <Lock className="h-4 w-4 text-white" /> :
                       <Hash className="h-4 w-4 text-white" />}
                    </div>
                    <h3 className="font-semibold text-sm truncate">{room.name}</h3>
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
                
                {room.lastMessage && (
                  <p className={`text-xs truncate ${
                    activeRoom?.id === room.id ? 'text-blue-100' : 'text-slate-600'
                  }`}>
                    {room.lastMessage.senderName}: {room.lastMessage.content}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${
                    activeRoom?.id === room.id ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {room.participants.length} members
                  </span>
                  {room.lastMessage && (
                    <span className={`text-xs ${
                      activeRoom?.id === room.id ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {formatTime(room.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Connection Status */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm text-slate-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {showAIAssistant && (
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">AI Active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeRoom ? (
            <>
              {/* Chat Header */}
              <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                      activeRoom.type === 'general' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      activeRoom.type === 'study-group' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                      activeRoom.type === 'subject' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 
                      'bg-gradient-to-r from-slate-500 to-slate-600'
                    }`}>
                      {activeRoom.type === 'general' ? <Globe className="h-6 w-6 text-white" /> :
                       activeRoom.type === 'private' ? <Lock className="h-6 w-6 text-white" /> :
                       <Hash className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                        <span>{activeRoom.name}</span>
                        {showAIAssistant && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 rounded-full">
                            <Bot className="h-3 w-3 text-purple-600" />
                            <span className="text-xs text-purple-600 font-medium">AI Enabled</span>
                          </div>
                        )}
                      </h2>
                      <p className="text-slate-600 text-sm">
                        {activeRoom.description || `${activeRoom.participants.length} members`}
                        {showAIAssistant && (
                          <span className="ml-2 text-purple-600">• Type /ai or @studybot for AI help</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-600 hover:bg-white/50 rounded-lg transition-all duration-200 transform hover:scale-110">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-white/50 rounded-lg transition-all duration-200 transform hover:scale-110">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-white/50 rounded-lg transition-all duration-200 transform hover:scale-110">
                      <Users className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setShowRoomSettings(!showRoomSettings)}
                      className="p-2 text-slate-600 hover:bg-white/50 rounded-lg transition-all duration-200 transform hover:scale-110"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeRoomMessages.map((message, index) => {
                  const isOwnMessage = message.senderId === user?.id;
                  const isAI = isAIMessage(message);
                  const showDate = index === 0 || 
                    formatDate(message.timestamp) !== formatDate(activeRoomMessages[index - 1]?.timestamp);
                  
                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-slate-600 border border-white/30">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          {!isOwnMessage && (
                            <div className="flex items-center space-x-2 mb-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                isAI ? 'bg-gradient-to-r from-purple-500 to-blue-500' :
                                message.senderRole === 'ADMIN' ? 'bg-red-500' : 'bg-blue-500'
                              }`}>
                                {isAI ? <Bot className="h-3 w-3" /> : message.senderName.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-slate-700">{message.senderName}</span>
                              {isAI && (
                                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                                  <Sparkles className="h-3 w-3" />
                                  <span>AI</span>
                                </span>
                              )}
                              {message.senderRole === 'ADMIN' && !isAI && (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Admin</span>
                              )}
                            </div>
                          )}
                          
                          <div className="group relative">
                            {editingMessage === message.id ? (
                              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
                                <input
                                  type="text"
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full bg-transparent border-none outline-none text-slate-800"
                                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                  <button
                                    onClick={() => setEditingMessage(null)}
                                    className="text-xs text-slate-500 hover:text-slate-700"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveEdit}
                                    className="text-xs text-blue-600 hover:text-blue-700"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className={`rounded-2xl p-3 shadow-lg ${
                                isAI
                                  ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white'
                                  : isOwnMessage
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                  : 'bg-white/70 backdrop-blur-sm text-slate-800 border border-white/30'
                              }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                                {message.edited && (
                                  <span className={`text-xs ${isOwnMessage || isAI ? 'text-blue-100' : 'text-slate-500'} italic`}>
                                    (edited)
                                  </span>
                                )}
                                
                                {/* Reactions */}
                                {message.reactions && message.reactions.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {message.reactions.map((reaction) => (
                                      <span
                                        key={reaction.id}
                                        className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center space-x-1"
                                      >
                                        <span>{reaction.emoji}</span>
                                        <span>1</span>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Message Actions */}
                            {!editingMessage && !isAI && (
                              <div className={`absolute top-0 ${isOwnMessage ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                                <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-white/30">
                                  <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-1 text-slate-600 hover:text-slate-800 transition-colors"
                                  >
                                    <Smile className="h-4 w-4" />
                                  </button>
                                  <button className="p-1 text-slate-600 hover:text-slate-800 transition-colors">
                                    <Reply className="h-4 w-4" />
                                  </button>
                                  {isOwnMessage && (
                                    <>
                                      <button
                                        onClick={() => handleEditMessage(message.id, message.content)}
                                        className="p-1 text-slate-600 hover:text-slate-800 transition-colors"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => deleteMessage(message.id)}
                                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className={`text-xs text-slate-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Typing Indicators */}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm text-slate-600">
                          {typingUsers.map(u => u.userName).join(', ')} typing...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30 z-50">
                  <div className="grid grid-cols-4 gap-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          // Add emoji to message input
                          setMessageInput(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="bg-white/70 backdrop-blur-sm border-t border-white/20 p-6">
                {showAIAssistant && (
                  <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-purple-700">
                      <Brain className="h-4 w-4" />
                      <span className="font-medium">AI Commands:</span>
                      <code className="bg-purple-100 px-2 py-1 rounded text-xs">/ai [question]</code>
                      <span>or</span>
                      <code className="bg-purple-100 px-2 py-1 rounded text-xs">@studybot [question]</code>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="p-2 text-slate-600 hover:bg-white/50 rounded-lg transition-all duration-200 transform hover:scale-110"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder={showAIAssistant ? "Type /ai or @studybot for AI help, or chat normally..." : "Type a message..."}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {showAIAssistant && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="flex items-center space-x-1 text-xs text-purple-600">
                          <Zap className="h-3 w-3" />
                          <span>AI Ready</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-slate-600 hover:bg-white/50 rounded-lg transition-all duration-200 transform hover:scale-110"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* No Room Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Welcome to NoteNexus Chat</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                  Select a room from the sidebar to start chatting with your fellow students and get help with your studies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowCreateRoom(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Room
                  </button>
                  <button
                    onClick={() => setShowAIAssistant(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Bot className="h-5 w-5 mr-2" />
                    Try AI Assistant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Create New Room</h3>
              <button
                onClick={() => setShowCreateRoom(false)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Room Name</label>
                <input
                  type="text"
                  value={newRoomData.name}
                  onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter room name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Description (Optional)</label>
                <textarea
                  value={newRoomData.description}
                  onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe the purpose of this room"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Room Type</label>
                <select
                  value={newRoomData.type}
                  onChange={(e) => setNewRoomData({ ...newRoomData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="study-group">Study Group</option>
                  <option value="subject">Subject Discussion</option>
                  <option value="general">General Chat</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateRoom(false)}
                  className="px-6 py-3 text-slate-600 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/70 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;