import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'black';
  trend?: { value: number; isPositive: boolean };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 hover:border-black hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-200">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            trend.isPositive 
              ? 'text-black bg-gray-100' 
              : 'text-gray-600 bg-gray-50'
          }`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition-colors duration-200">{title}</p>
        <p className="text-3xl font-bold text-black group-hover:text-gray-900 transition-colors duration-200">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}