import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Clock,
  User,
  CheckCircle,
  Lightbulb,
  Star,
  Award,
  TrendingUp,
  X,
  Send,
  Eye,
  Heart,
  BookmarkPlus,
  Filter,
  Calendar,
  Zap
} from 'lucide-react';
import { Tip } from '../../types';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';

const UserTips: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTip, setNewTip] = useState({ title: '', content: '' });
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllTips();
      const approvedTips = (response.tips || []).filter(
        (tip: { status: string }) => tip.status === 'APPROVED'
      );
      setTips(approvedTips);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTips = tips.filter(
    (tip) =>
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTip = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = newTip.title.trim();
    const trimmedContent = newTip.content.trim();

    if (trimmedTitle.length < 10 || trimmedContent.length < 10) {
      toast.error("Both title and content must be at least 10 characters long.");
      return;
    }

    try {
      await apiService.createTip(newTip);
      setNewTip({ title: '', content: '' });
      setShowCreateForm(false);
      toast.success('Tip submitted successfully and is pending for approval!');
      fetchTips();
    } catch (error) {
      console.error('Error creating tip:', error);
      toast.error('Failed to submit tip. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-amber-500"></div>
            <p className="text-slate-600 font-medium">Loading study tips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-30 animate-pulse delay-2000"></div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Study Tips
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Share and discover effective study strategies from fellow learners
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                <Lightbulb className="h-5 w-5 text-orange-600" />
                <span className="text-orange-400 font-semibold">{filteredTips.length} tips available</span>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Share a Tip
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-slide-up delay-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Find Study Tips</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tips by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Clear Search */}
            <button
              onClick={() => setSearchTerm('')}
              className="flex items-center justify-center px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Search
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Share Your Study Tip</h2>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/50 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTip} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-3">
                  Tip Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTip.title}
                  onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter a catchy title for your study tip"
                  required
                />
                <p className="text-sm text-slate-500 mt-2">Minimum 10 characters required</p>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-3">
                  Tip Content
                </label>
                <textarea
                  id="content"
                  rows={6}
                  value={newTip.content}
                  onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="Share your study tip in detail. What makes it effective? How has it helped you?"
                  required
                />
                <p className="text-sm text-slate-500 mt-2">Minimum 10 characters required</p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 text-slate-600 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/70 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Tip</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tips Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up delay-400">
          {filteredTips.map((tip, index) => (
            <div
              key={tip.id}
              onClick={() => navigate(`/user/tips/${tip.id}`)}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 100 + 500}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-amber-600 text-sm font-medium">Study Tip</span>
                    <div className="flex items-center space-x-2 text-slate-500 text-xs mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(tip.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="bg-green-100 border border-green-200 px-3 py-1 rounded-full flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Approved</span>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors duration-200">
                  {tip.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                  {tip.content}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/30">
                <div className="flex items-center space-x-4 text-slate-500 text-sm">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{tip.postedBy?.name || 'Anonymous'}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                    <BookmarkPlus className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTips.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 text-center animate-fade-in">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="h-10 w-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No study tips found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
              {searchTerm 
                ? "Try adjusting your search terms or explore different keywords."
                : "Be the first to share a valuable study tip with the community!"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105"
                >
                  <X className="h-5 w-5 mr-2" />
                  Clear Search
                </button>
              )}
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Share Your First Tip
              </button>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {filteredTips.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-red-600/20"></div>
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Community Impact</h3>
                <p className="text-amber-100">See how our study tips are helping students succeed</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{tips.length}</div>
                  <div className="text-amber-100 text-sm">Total Tips Shared</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">95%</div>
                  <div className="text-amber-100 text-sm">Success Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">1K+</div>
                  <div className="text-amber-100 text-sm">Students Helped</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTips;