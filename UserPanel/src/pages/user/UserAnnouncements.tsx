import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { Announcement } from '../../types';
import { apiService } from '../../services/api';

const UserAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Announcements</h1>
          <p className="text-gray-600 mt-1">Stay informed with the latest updates</p>
        </div>
        <span className="mt-4 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
          {announcements.length} announcements
        </span>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow transition"
          >
            <h3 className="text-lg font-semibold text-black mb-2">{announcement.title}</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">{announcement.message}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full border border-gray-300">
                By {announcement.postedBy?.name || 'Admin'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No announcements found</h3>
          <p className="text-gray-500">Check back later for new announcements.</p>
        </div>
      )}
    </div>
  );
};

export default UserAnnouncements;
