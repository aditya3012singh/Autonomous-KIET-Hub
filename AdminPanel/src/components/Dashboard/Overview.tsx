import React from 'react';
import { FileText, Lightbulb, Calendar, Megaphone, Upload, Users } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useApi } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { DashboardStats } from '../../types';

export function Overview() {
  const { data: stats, loading, error } = useApi<DashboardStats>(api.getDashboardStats);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Welcome Banner Skeleton */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-white/20 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-1/4"></div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
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
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-800">Error loading dashboard stats: {error}</p>
      </div>
    );
  }

  const defaultStats = { notes: 0, tips: 0, events: 0, announcements: 0 };
  const currentStats = stats || defaultStats;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="text-blue-100 text-lg">Manage your education platform efficiently</p>
        </div>
        <div className="absolute top-4 right-8 opacity-20">
          <Users className="w-32 h-32" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Notes"
          value={currentStats.notes}
          icon={FileText}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Study Tips"
          value={currentStats.tips}
          icon={Lightbulb}
          color="yellow"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Upcoming Events"
          value={currentStats.events}
          icon={Calendar}
          color="green"
          trend={{ value: 3, isPositive: false }}
        />
        <StatsCard
          title="Announcements"
          value={currentStats.announcements}
          icon={Megaphone}
          color="purple"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">New note uploaded</p>
                <p className="text-sm text-gray-600">Database Management - Semester 5</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago • Alice Johnson</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Tip approved</p>
                <p className="text-sm text-gray-600">Algorithm Tips</p>
                <p className="text-xs text-gray-500 mt-1">4 hours ago • Bob Smith</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Event created</p>
                <p className="text-sm text-gray-600">Tech Seminar</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago • Admin</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Note feedback received</p>
                <p className="text-sm text-gray-600">Machine Learning</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago • Carol Davis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-6 text-center bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 group">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">Upload Note</p>
              <p className="text-sm text-gray-600 mt-1">Add new study material</p>
            </button>
            
            <button className="p-6 text-center bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors duration-200 group">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">Share Tip</p>
              <p className="text-sm text-gray-600 mt-1">Share study tips</p>
            </button>
            
            <button className="p-6 text-center bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 group">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">View Events</p>
              <p className="text-sm text-gray-600 mt-1">Check upcoming events</p>
            </button>
            
            <button className="p-6 text-center bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200 group">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">Community</p>
              <p className="text-sm text-gray-600 mt-1">Connect with others</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}