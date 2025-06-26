import React from 'react';
import { FileText, Lightbulb, Calendar, Megaphone, Upload, Users } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useApi } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { DashboardStats } from '../../types';

export function Overview() {
  const { data: stats, loading, error } = useApi<DashboardStats>(api.getDashboardStats);

  const defaultStats = { notes: 0, tips: 0, events: 0, announcements: 0 };
  const currentStats = stats || defaultStats;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white border border-black rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-300 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white text-black border border-black rounded-2xl p-6 shadow-sm">
        <p className="font-medium">Error loading dashboard stats: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-black">
      {/* Welcome Banner */}
      <div className="bg-white border border-black rounded-2xl p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 text-black">Welcome back, Admin!</h1>
          <p className="text-lg text-gray-700">Manage your education platform efficiently</p>
        </div>
        <div className="absolute top-4 right-8 opacity-5">
          <Users className="w-32 h-32 text-black" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Notes" 
          value={currentStats.notes} 
          icon={FileText} 
          color="black" 
          trend={{ value: 12, isPositive: true }} 
        />
        <StatsCard 
          title="Study Tips" 
          value={currentStats.tips} 
          icon={Lightbulb} 
          color="black" 
          trend={{ value: 8, isPositive: true }} 
        />
        <StatsCard 
          title="Upcoming Events" 
          value={currentStats.events} 
          icon={Calendar} 
          color="black" 
          trend={{ value: 3, isPositive: false }} 
        />
        <StatsCard 
          title="Announcements" 
          value={currentStats.announcements} 
          icon={Megaphone} 
          color="black" 
          trend={{ value: 5, isPositive: true }} 
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white border border-black rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-black">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { icon: FileText, title: "New note uploaded", detail: "Database Management - Semester 5", time: "2 hours ago • Alice Johnson" },
              { icon: Lightbulb, title: "Tip approved", detail: "Algorithm Tips", time: "4 hours ago • Bob Smith" },
              { icon: Calendar, title: "Event created", detail: "Tech Seminar", time: "1 day ago • Admin" },
              { icon: Megaphone, title: "Note feedback received", detail: "Machine Learning", time: "2 days ago • Carol Davis" },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-300 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all duration-300 group">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-black group-hover:text-white transition-colors duration-300">{item.title}</p>
                  <p className="text-sm text-gray-700 group-hover:text-gray-200 transition-colors duration-300">{item.detail}</p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-300 mt-1 transition-colors duration-300">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-black rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-black">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Upload, title: "Upload Note", desc: "Add new study material" },
              { icon: Lightbulb, title: "Share Tip", desc: "Share study tips" },
              { icon: Calendar, title: "View Events", desc: "Check upcoming events" },
              { icon: Users, title: "Community", desc: "Connect with others" },
            ].map((item, index) => (
              <button
                key={index}
                className="p-6 text-center bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black rounded-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <p className="font-semibold text-black group-hover:text-white transition-colors duration-300">{item.title}</p>
                <p className="text-sm text-gray-600 group-hover:text-gray-200 mt-1 transition-colors duration-300">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}