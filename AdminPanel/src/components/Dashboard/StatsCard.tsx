import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'green' | 'purple';
  trend?: { value: number; isPositive: boolean };
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    lightBg: 'bg-blue-50'
  },
  yellow: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-500',
    lightBg: 'bg-yellow-50'
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-500',
    lightBg: 'bg-green-50'
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-500',
    lightBg: 'bg-purple-50'
  }
};

export function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}