import React, { useEffect, useState } from 'react';
import { BookOpen, Lightbulb, Calendar, MessageSquare, TrendingUp, Users, Award, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { name: 'Total Notes', value: '0', icon: BookOpen, color: 'bg-blue-500', pending: '0' },
    { name: 'Study Tips', value: '0', icon: Lightbulb, color: 'bg-yellow-500', pending: '0' },
    { name: 'Events', value: '0', icon: Calendar, color: 'bg-green-500', pending: '0' },
    { name: 'Users', value: '0', icon: Users, color: 'bg-purple-500', pending: '0' },
  ]);

  const recentActivity = [
    { action: 'New note uploaded', subject: 'Data Structures', time: '2 hours ago', user: 'Alice Johnson', status: 'pending' },
    { action: 'Tip submitted', subject: 'Algorithm Tips', time: '4 hours ago', user: 'Bob Smith', status: 'pending' },
    { action: 'User registered', subject: 'New Student', time: '1 day ago', user: 'Carol Davis', status: 'approved' },
    { action: 'Note approved', subject: 'Machine Learning', time: '2 days ago', user: 'David Wilson', status: 'approved' },
  ];

  const pendingApprovals = [
    { type: 'Note', title: 'Advanced Algorithms', user: 'John Doe', time: '1 hour ago' },
    { type: 'Tip', title: 'Effective Study Methods', user: 'Jane Smith', time: '3 hours ago' },
    { type: 'Note', title: 'Database Design', user: 'Mike Johnson', time: '5 hours ago' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/overview');
        const data = await res.json();
        setStats([
          { name: 'Total Notes', value: data.notes || '0', icon: BookOpen, color: 'bg-blue-500', pending: data.pendingNotes || '0' },
          { name: 'Study Tips', value: data.tips || '0', icon: Lightbulb, color: 'bg-yellow-500', pending: data.pendingTips || '0' },
          { name: 'Events', value: data.events || '0', icon: Calendar, color: 'bg-green-500', pending: '0' },
          { name: 'Users', value: data.users || '0', icon: Users, color: 'bg-purple-500', pending: '0' },
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
      <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 mt-2">
              Manage your EduShare platform and help students succeed
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              {stat.pending !== '0' && (
                <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {stat.pending} pending
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            {pendingApprovals.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'Note' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.type}
                    </span>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">by {item.user} • {item.time}</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Pending Items
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.status === 'approved' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {activity.status === 'approved' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-orange-600" />
                  )}
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
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all group text-center">
            <BookOpen className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Review Notes</p>
          </button>
          <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 transition-all group text-center">
            <Lightbulb className="h-8 w-8 text-gray-400 group-hover:text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-yellow-600">Review Tips</p>
          </button>
          <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all group text-center">
            <Calendar className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-green-600">Create Event</p>
          </button>
          <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all group text-center">
            <Users className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Manage Users</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;