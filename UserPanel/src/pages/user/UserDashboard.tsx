import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Lightbulb,
  Calendar,
  MessageSquare,
  TrendingUp,
  Users,
  Award,
  Clock,
  Star,
  ArrowRight,
  Activity,
  Zap,
  Target,
  ChevronRight,
  BarChart3,
  BookmarkPlus,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  type Activity = {
    id: string;
    userId: string;
    action: string;
    subject?: string;
    time: string;
  };

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState([
    { name: 'My Notes', value: '0', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { name: 'Study Tips', value: '0', icon: Lightbulb, color: 'from-amber-500 to-amber-600' },
    { name: 'Upcoming Events', value: '0', icon: Calendar, color: 'from-green-500 to-green-600' },
    { name: 'Announcements', value: '0', icon: MessageSquare, color: 'from-purple-500 to-purple-600' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/overview');
        const data = await res.json();
        setStats([
          { name: 'My Notes', value: data.notes, icon: BookOpen, color: 'from-blue-900 to-blue-600' },
          { name: 'Study Tips', value: data.tips || '0', icon: Lightbulb, color: 'from-blue-900 to-blue-600' },
          { name: 'Upcoming Events', value: data.events || '0', icon: Calendar, color: 'from-blue-900 to-blue-600' },
          { name: 'Announcements', value: data.announcements || '0', icon: MessageSquare, color: 'from-blue-900 to-blue-600' },
        ]);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    
    const fetchActivity = async () => {
      try {
        const data = await apiService.getRecentActivity();
        setRecentActivity(data);
      } catch (error) {
        console.error('Failed to load recent activity', error);
      }
    };

    fetchStats();
    fetchActivity();
  }, []);

  const quickActions = [
    {
      name: 'Browse Notes',
      href: '/user/notes',
      icon: BookOpen,
      description: 'Explore study materials'
    },
    {
      name: 'Share Tip',
      href: '/user/tips',
      icon: Lightbulb,
      description: 'Help fellow students'
    },
    {
      name: 'View Events',
      href: '/user/events',
      icon: Calendar,
      description: 'Upcoming activities'
    },
    {
      name: 'Announcements',
      href: '/user/announcements',
      icon: MessageSquare,
      description: 'Latest updates'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-amber-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-50 animate-pulse delay-2000"></div>
      <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-green-200 rounded-full opacity-50 animate-bounce delay-3000"></div>

      <div className="relative z-10 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-slide-up">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed animate-slide-up delay-200">
                Continue your learning journey and explore new knowledge with NoteNexus
              </p>
              <div className="flex items-center mt-4 space-x-2 animate-slide-up delay-300">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-500 font-medium">All systems ready for learning</span>
              </div>
            </div>
            <div className="hidden md:block animate-slide-left">
              <div className="bg-gradient-to-br from-blue-900 via-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl transform hover:scale-110 transition-transform duration-500">
                <Award className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up delay-400">
          {stats.map((stat, index) => {
            const handleClick = () => {
              if (stat.name.includes('Note')) navigate('/user/notes');
              else if (stat.name.includes('Tip')) navigate('/user/tips');
              else if (stat.name.includes('Announcement')) navigate('/user/announcements');
              else if (stat.name.includes('Event')) navigate('/user/events');
            };

            return (
              <div
                key={stat.name}
                onClick={handleClick}
                className="cursor-pointer bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group animate-slide-up"
                style={{ animationDelay: `${index * 100 + 500}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-r ${stat.color} shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <p className="text-sm font-semibold text-slate-600 mb-2">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                
                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transform origin-left scale-x-75 group-hover:scale-x-100 transition-transform duration-700`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section - Clean & Professional */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity - Simplified */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
              </div>
              <button className="text-sm text-slate-500 hover:text-slate-700 font-medium flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium mb-1">No recent activity</p>
                  <p className="text-slate-500 text-sm">Start exploring to see your activity here</p>
                </div>
              ) : (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200 border border-slate-100"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {activity.action}
                      </p>
                      {activity.subject && (
                        <p className="text-slate-600 text-sm truncate">{activity.subject}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions & Progress - Minimal Design */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={action.name}
                    onClick={() => navigate(action.href)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <action.icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-slate-800 text-sm">{action.name}</p>
                        <p className="text-xs text-slate-500">{action.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <BarChart3 className="h-5 w-5 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Learning Progress</h3>
              </div>
              
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                Keep up the great work! You're making excellent progress.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                  <span className="text-sm font-semibold text-slate-800">75%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-slate-600 h-2 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Star className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 font-medium">Dedicated Learner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;