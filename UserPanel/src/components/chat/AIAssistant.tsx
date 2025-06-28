import React, { useState } from 'react';
import { 
  Bot, 
  Lightbulb, 
  BookOpen, 
  Brain, 
  Target, 
  Zap,
  MessageCircle,
  Sparkles,
  GraduationCap,
  FileText,
  HelpCircle,
  TrendingUp,
  Settings,
  Key,
  Upload,
  Search,
  Calendar,
  X
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { apiService } from '../../services/api';

interface AIAssistantProps {
  onSendMessage: (message: string, isAI?: boolean) => void;
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onSendMessage, className = '' }) => {
  const [isThinking, setIsThinking] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showNoteAnalysis, setShowNoteAnalysis] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [userNotes, setUserNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<'summary' | 'quiz' | 'concepts' | 'questions'>('summary');

  const capabilities = [
    {
      id: 'explain',
      name: 'Explain Concepts',
      description: 'Get clear explanations of complex topics',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      prompt: 'Can you explain'
    },
    {
      id: 'quiz',
      name: 'Generate Quiz',
      description: 'Create practice questions to test knowledge',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      prompt: 'Create a quiz about'
    },
    {
      id: 'summarize',
      name: 'Summarize Content',
      description: 'Get concise summaries of study materials',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      prompt: 'Summarize this topic:'
    },
    {
      id: 'tips',
      name: 'Study Tips',
      description: 'Receive personalized study strategies',
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      prompt: 'Give me study tips for'
    },
    {
      id: 'analyze',
      name: 'Analyze Notes',
      description: 'AI analysis of your uploaded notes',
      icon: Search,
      color: 'from-indigo-500 to-blue-500',
      prompt: 'Analyze my notes'
    },
    {
      id: 'plan',
      name: 'Study Plan',
      description: 'Create personalized study schedules',
      icon: Calendar,
      color: 'from-red-500 to-pink-500',
      prompt: 'Create a study plan for'
    }
  ];

  const quickPrompts = [
    "Explain this concept in simple terms",
    "Create a quiz to test my knowledge",
    "Give me study tips for better retention",
    "Summarize the key points",
    "How can I remember this better?",
    "What are real-world applications?",
    "Analyze my uploaded notes",
    "Create a study plan for this week"
  ];

  React.useEffect(() => {
    fetchUserNotes();
  }, []);

  const fetchUserNotes = async () => {
    try {
      const response = await apiService.getAllNotes();
      setUserNotes(response.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      aiService.setApiKey(apiKey.trim());
      setShowApiKeyModal(false);
      onSendMessage("🔑 OpenAI API key connected! I now have enhanced AI capabilities for detailed explanations, note analysis, and personalized study assistance.", true);
    }
  };

  const handleCapabilityClick = (capability: any) => {
    setSelectedCapability(capability.id);
    
    if (capability.id === 'analyze') {
      setShowNoteAnalysis(true);
      return;
    }
    
    const message = `${capability.prompt} [your topic here]`;
    handleAIInteraction(message);
  };

  const handleNoteAnalysis = async () => {
    if (!selectedNote) return;
    
    const note = userNotes.find(n => n.id === selectedNote);
    if (!note) return;

    setIsThinking(true);
    setShowNoteAnalysis(false);

    try {
      // First, send user message
      onSendMessage(`Analyze my note: "${note.title}" - ${analysisType} analysis`);
      
      // Simulate getting note content (in real app, you'd fetch the actual file content)
      const noteContent = `Study Note: ${note.title}\nSubject: ${note.subject?.name || 'Unknown'}\nBranch: ${note.branch}\nSemester: ${note.semester}\n\n[Note: In a real implementation, this would contain the actual content of the uploaded file]`;
      
      // Get AI analysis
      const aiResponse = await aiService.analyzeNoteContent(noteContent, analysisType);
      
      // Send AI response
      setTimeout(() => {
        onSendMessage(`📄 **Note Analysis Complete**\n\n${aiResponse}`, true);
        setIsThinking(false);
      }, 1000);
      
    } catch (error) {
      console.error('Note analysis failed:', error);
      onSendMessage("I encountered an error while analyzing your note. Please try again.", true);
      setIsThinking(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (prompt.includes('notes')) {
      setShowNoteAnalysis(true);
      return;
    }
    handleAIInteraction(prompt);
  };

  const handleAIInteraction = async (userMessage: string) => {
    setIsThinking(true);
    
    try {
      // Send user message first
      onSendMessage(userMessage);
      
      // Get AI response
      const aiResponse = await aiService.generateResponse(userMessage);
      
      // Send AI response
      setTimeout(() => {
        onSendMessage(aiResponse, true);
        setIsThinking(false);
      }, 500);
      
    } catch (error) {
      console.error('AI interaction failed:', error);
      onSendMessage("I'm having trouble processing that request right now. Please try again later.", true);
      setIsThinking(false);
    }
  };

  const hasApiKey = !!localStorage.getItem('openai_api_key');

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg ${className}`}>
      {/* AI Assistant Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <span>StudyBot AI</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </h3>
            <p className="text-sm text-slate-600">
              {hasApiKey ? 'Enhanced AI capabilities active' : 'Demo mode - Connect OpenAI for full features'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowApiKeyModal(true)}
          className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
            hasApiKey 
              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
              : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
          }`}
          title={hasApiKey ? 'API Key Connected' : 'Connect OpenAI API Key'}
        >
          <Key className="h-4 w-4" />
        </button>
      </div>

      {/* AI Capabilities Grid */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>AI Capabilities</span>
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <button
                key={capability.id}
                onClick={() => handleCapabilityClick(capability)}
                disabled={isThinking}
                className={`p-3 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200 transform hover:scale-105 text-left group ${
                  selectedCapability === capability.id ? 'ring-2 ring-blue-500' : ''
                } ${isThinking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${capability.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h5 className="text-xs font-semibold text-slate-800 mb-1">{capability.name}</h5>
                <p className="text-xs text-slate-600 leading-tight">{capability.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
          <MessageCircle className="h-4 w-4 text-blue-500" />
          <span>Quick Prompts</span>
        </h4>
        <div className="space-y-2">
          {quickPrompts.slice(0, 4).map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleQuickPrompt(prompt)}
              disabled={isThinking}
              className={`w-full text-left px-3 py-2 text-sm bg-white/50 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/70 transition-all duration-200 transform hover:scale-105 ${
                isThinking ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* AI Status */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isThinking ? 'bg-amber-500 animate-pulse' : hasApiKey ? 'bg-green-500' : 'bg-blue-500'}`}></div>
          <span className="text-sm font-medium text-slate-700">
            {isThinking ? 'AI is thinking...' : hasApiKey ? 'AI Enhanced' : 'Demo Mode'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <GraduationCap className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-blue-600 font-medium">Study Mode</span>
        </div>
      </div>

      {/* Thinking Animation */}
      {isThinking && (
        <div className="mt-4 flex items-center justify-center space-x-2 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/30">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
          </div>
          <span className="text-sm text-slate-600 font-medium">StudyBot is analyzing...</span>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
                <Key className="h-6 w-6 text-amber-500" />
                <span>OpenAI API Key</span>
              </h3>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600">
                Connect your OpenAI API key to unlock enhanced AI capabilities including detailed explanations, note analysis, and personalized study assistance.
              </p>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">How to get your API key:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
                  <li>2. Sign in to your OpenAI account</li>
                  <li>3. Click "Create new secret key"</li>
                  <li>4. Copy and paste the key here</li>
                </ol>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-6 py-3 text-slate-600 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/70 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApiKeySubmit}
                  disabled={!apiKey.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Connect API Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Analysis Modal */}
      {showNoteAnalysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
                <Search className="h-6 w-6 text-indigo-500" />
                <span>Analyze Notes</span>
              </h3>
              <button
                onClick={() => setShowNoteAnalysis(false)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Note to Analyze
                </label>
                <select
                  value={selectedNote || ''}
                  onChange={(e) => setSelectedNote(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Choose a note...</option>
                  {userNotes.map((note) => (
                    <option key={note.id} value={note.id}>
                      {note.title} - {note.subject?.name || 'Unknown Subject'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Analysis Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'summary', label: 'Summary', icon: FileText },
                    { value: 'quiz', label: 'Quiz', icon: Target },
                    { value: 'concepts', label: 'Concepts', icon: Brain },
                    { value: 'questions', label: 'Questions', icon: HelpCircle }
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setAnalysisType(type.value as any)}
                        className={`p-3 rounded-xl border transition-all duration-200 transform hover:scale-105 ${
                          analysisType === type.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-white/30 bg-white/50 text-slate-700 hover:bg-white/70'
                        }`}
                      >
                        <Icon className="h-5 w-5 mx-auto mb-2" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowNoteAnalysis(false)}
                  className="px-6 py-3 text-slate-600 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/70 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNoteAnalysis}
                  disabled={!selectedNote}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Analyze Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;