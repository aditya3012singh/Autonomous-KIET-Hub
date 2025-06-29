import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Clock, 
  Search, 
  Filter, 
  Bell, 
  Star, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  TrendingUp,
  Award,
  Eye,
  BookmarkPlus,
  Share2,
  X,
  Megaphone,
  Info
} from 'lucide-react';
import { Announcement } from '../../types';
import { apiService } from '../../services/api';

const UserAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'important'>('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllAnnouncements();
      setAnnouncements(response.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterType === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesFilter = new Date(announcement.createdAt) > weekAgo;
    } else if (filterType === 'important') {
      // For demo purposes, we'll consider announcements with certain keywords as important
      matchesFilter = announcement.title.toLowerCase().includes('important') ||
                     announcement.title.toLowerCase().includes('urgent') ||
                     announcement.title.toLowerCase().includes('exam') ||
                     announcement.title.toLowerCase().includes('deadline');
    }
    
    return matchesSearch && matchesFilter;
  });

  const recentAnnouncements = announcements.filter(announcement => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(announcement.createdAt) > weekAgo;
  });

  const getAnnouncementPriority = (title: string, message: string) => {
    const content = (title + ' ' + message).toLowerCase();
    if (content.includes('urgent') || content.includes('important') || content.includes('deadline')) {
      return { level: 'high', color: 'red', icon: AlertCircle };
    } else if (content.includes('exam') || content.includes('test') || content.includes('assignment')) {
      return { level: 'medium', color: 'amber', icon: Clock };
    } else {
      return { level: 'normal', color: 'blue', icon: Info };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-purple-500"></div>
            <p className="text-slate-600 font-medium">Loading announcements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-red-200 rounded-full opacity-30 animate-pulse delay-2000"></div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Announcements
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Stay informed with the latest updates and important notices
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                <MessageSquare className="h-5 w-5 text-red-600" />
                <span className="text-red-700 font-semibold">{announcements.length} total announcements</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 rounded-xl border border-red-200">
                <Bell className="h-5 w-5 text-red-600" />
                <span className="text-red-700 font-semibold">{recentAnnouncements.length} new this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-slide-up delay-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Find Announcements</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search announcements by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-b-gray-100 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'recent' | 'important')}
              className="px-4 py-3 bg-white/50 backdrop-blur-sm border border-b-gray-100 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Announcements</option>
              <option value="recent">Recent (This Week)</option>
              <option value="important">Important Only</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="flex items-center justify-center px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up delay-300">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Total Announcements</h3>
            <p className="text-3xl font-bold text-slate-600 mb-1">{announcements.length}</p>
            <p className="text-slate-600 text-sm">All time announcements</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Recent Updates</h3>
            <p className="text-3xl font-bold text-slate-600 mb-1">{recentAnnouncements.length}</p>
            <p className="text-slate-600 text-sm">This week's announcements</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Important Notices</h3>
            <p className="text-3xl font-bold text-slate-600 mb-1">
              {announcements.filter(a => getAnnouncementPriority(a.title, a.message).level === 'high').length}
            </p>
            <p className="text-slate-600 text-sm">High priority items</p>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-6 animate-slide-up delay-400">
          {filteredAnnouncements.map((announcement, index) => {
            const priority = getAnnouncementPriority(announcement.title, announcement.message);
            const PriorityIcon = priority.icon;
            
            return (
              <div
                key={announcement.id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group animate-slide-up"
                style={{ animationDelay: `${index * 100 + 500}ms` }}
              >
                {/* Announcement Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300 ${
                      priority.color === 'red' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                        : priority.color === 'amber'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}>
                      <PriorityIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${
                        priority.color === 'red' ? 'text-red-600' : 
                        priority.color === 'amber' ? 'text-amber-600' : 'text-blue-600'
                      }`}>
                        {priority.level === 'high' ? 'Important Notice' : 
                         priority.level === 'medium' ? 'Academic Update' : 'General Announcement'}
                      </span>
                      <div className="flex items-center space-x-2 text-slate-500 text-xs mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(announcement.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Priority Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${
                    priority.color === 'red' 
                      ? 'bg-red-100 text-red-700 border-red-200' 
                      : priority.color === 'amber'
                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    <PriorityIcon className="h-3 w-3" />
                    <span className="capitalize">{priority.level}</span>
                  </div>
                </div>

                {/* Announcement Content */}
                <div className="mb-4">
                  <h3 className={`text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:transition-colors duration-200 ${
                    priority.color === 'red' ? 'group-hover:text-red-600' : 
                    priority.color === 'amber' ? 'group-hover:text-amber-600' : 'group-hover:text-blue-600'
                  }`}>
                    {announcement.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed line-clamp-3">
                    {announcement.message}
                  </p>
                </div>

                {/* Announcement Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="flex items-center space-x-4 text-slate-500 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {announcement.postedBy?.name || 'Admin'}
                        </p>
                        <p className="text-xs text-slate-500">Administrator</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(announcement.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                      <BookmarkPlus className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className={`inline-flex items-center px-4 py-2 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm font-medium ${
                      priority.color === 'red' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                        : priority.color === 'amber'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 text-center animate-fade-in">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              {searchTerm || filterType !== 'all' ? 'No announcements found' : 'No announcements yet'}
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
              {searchTerm || filterType !== 'all' 
                ? "Try adjusting your search criteria or filter settings to find announcements."
                : "Check back later for important updates and announcements from the administration."
              }
            </p>
            {(searchTerm || filterType !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-red-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <X className="h-5 w-5 mr-2" />
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Announcements Summary */}
        {announcements.length > 0 && (
          <div className="bg-gradient-to-r from-purple-500 via-red-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Communication Hub</h3>
                <p className="text-purple-100">Stay connected with important updates and announcements</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Megaphone className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{announcements.length}</div>
                  <div className="text-purple-100 text-sm">Total Announcements</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{recentAnnouncements.length}</div>
                  <div className="text-purple-100 text-sm">This Week</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">98%</div>
                  <div className="text-purple-100 text-sm">Read Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">A+</div>
                  <div className="text-purple-100 text-sm">Communication Quality</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAnnouncements;