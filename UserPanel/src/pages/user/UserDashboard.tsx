import React, { useEffect, useState } from 'react';
import { BookOpen, Lightbulb, Calendar, MessageSquare, TrendingUp, Users, Award, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { name: 'My Notes', value: '0', icon: BookOpen, color: 'bg-black' },
    { name: 'Study Tips', value: '0', icon: Lightbulb, color: 'bg-black' },
    { name: 'Upcoming Events', value: '0', icon: Calendar, color: 'bg-black' },
    { name: 'Announcements', value: '0', icon: MessageSquare, color: 'bg-black' },
  ]);

  const recentActivity = [
    { action: 'Downloaded note', subject: 'Data Structures', time: '2 hours ago', user: 'You' },
    { action: 'Shared tip', subject: 'Algorithm Tips', time: '4 hours ago', user: 'You' },
    { action: 'Joined event', subject: 'Tech Seminar', time: '1 day ago', user: 'You' },
    { action: 'Viewed announcement', subject: 'New Features', time: '2 days ago', user: 'You' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/overview');
        const data = await res.json();
        setStats([
          { name: 'My Notes', value: '5', icon: BookOpen, color: 'bg-black' },
          { name: 'Study Tips', value: data.tips || '0', icon: Lightbulb, color: 'bg-black' },
          { name: 'Upcoming Events', value: data.events || '0', icon: Calendar, color: 'bg-black' },
          { name: 'Announcements', value: data.announcements || '0', icon: MessageSquare, color: 'bg-black' },
        ]);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-black rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 mt-2">
              Continue your learning journey and explore new knowledge
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-black p-2 rounded-full">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.subject}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/user/notes" className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all group text-center">
              <BookOpen className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Browse Notes</p>
            </a>
            <a href="/user/tips" className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-600 hover:bg-gray-100 transition-all group text-center">
              <Lightbulb className="h-8 w-8 text-gray-400 group-hover:text-black mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-black">Share Tip</p>
            </a>
            <a href="/user/events" className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all group text-center">
              <Calendar className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-green-600">View Events</p>
            </a>
            <a href="/user/announcements" className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all group text-center">
              <Users className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Announcements</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;