import React from 'react';
import { BookOpen, Lightbulb, Calendar, MessageSquare, TrendingUp, Users, Award, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Notes', value: '1,234', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Study Tips', value: '89', icon: Lightbulb, color: 'bg-yellow-500' },
    { name: 'Upcoming Events', value: '12', icon: Calendar, color: 'bg-green-500' },
    { name: 'Announcements', value: '6', icon: MessageSquare, color: 'bg-purple-500' },
  ];

  const recentActivity = [
    { action: 'New note uploaded', subject: 'Data Structures', time: '2 hours ago', user: 'Alice Johnson' },
    { action: 'Tip approved', subject: 'Algorithm Tips', time: '4 hours ago', user: 'Bob Smith' },
    { action: 'Event created', subject: 'Tech Seminar', time: '1 day ago', user: 'Admin' },
    { action: 'Note feedback received', subject: 'Machine Learning', time: '2 days ago', user: 'Carol Davis' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 mt-2">
              {user?.role === 'ADMIN' ? 'Manage your platform and help students succeed' : 'Continue your learning journey'}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
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
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.subject}</p>
                  <p className="text-xs text-gray-400">{activity.time} • {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all group">
              <BookOpen className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Upload Note</p>
            </button>
            <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 transition-all group">
              <Lightbulb className="h-8 w-8 text-gray-400 group-hover:text-yellow-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-yellow-600">Share Tip</p>
            </button>
            <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all group">
              <Calendar className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-green-600">View Events</p>
            </button>
            <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all group">
              <Users className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Community</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;