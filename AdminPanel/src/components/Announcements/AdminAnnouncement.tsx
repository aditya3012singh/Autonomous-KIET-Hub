import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Clock, Edit, Trash2 } from 'lucide-react';
import { Announcement } from '../../types';
import { api } from '../../utils/api';


const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.getAnnouncements();
      setAnnouncements(response.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAnnouncement(newAnnouncement);
      setNewAnnouncement({ title: '', message: '' });
      setShowCreateForm(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await api.deleteAnnouncement(id);
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
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
          <h1 className="text-2xl font-bold text-black">Announcements Management</h1>
          <p className="text-gray-600 mt-1">Create and manage platform announcements</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Announcement
        </button>
      </div>

      {/* Create Announcement Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-black mb-4">Create New Announcement</h2>
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Title</label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Message</label>
              <textarea
                rows={4}
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
              >
                Create Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-black flex-1 pr-4">
                {announcement.title}
              </h3>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                  className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {announcement.message}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
              </div>
              <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                By {announcement.postedBy?.name || 'Admin'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No announcements found</h3>
          <p className="text-gray-500">Create your first announcement to get started.</p>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;