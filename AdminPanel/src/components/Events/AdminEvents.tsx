import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { Event } from '../../types';
import { api } from '../../utils/api'; // ✅ Corrected import

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    content: '',
    eventDate: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.getEvents(); // ✅ Fixed
      setEvents((response.events || []).sort((a: { eventDate: string | number | Date; }, b: { eventDate: string | number | Date; }) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      ));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEvent(newEvent); // ✅ Fixed
      setNewEvent({ title: '', content: '', eventDate: '' });
      setShowCreateForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.deleteEvent(id); // ✅ Fixed
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
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
          <h1 className="text-2xl font-bold text-black">Events Management</h1>
          <p className="text-gray-600 mt-1">Create and manage academic events</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </button>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-black mb-4">Create New Event</h2>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Content</label>
              <textarea
                rows={4}
                value={newEvent.content}
                onChange={(e) => setNewEvent({ ...newEvent, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Event Date</label>
              <input
                type="datetime-local"
                value={newEvent.eventDate}
                onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
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
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-black flex-1 pr-2">{event.title}</h3>
              <div className="flex space-x-1">
                <button className="p-1 text-gray-400 hover:text-black rounded">
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="p-1 text-gray-400 hover:text-gray-800 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{event.content}</p>

            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.eventDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(event.eventDate).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  new Date(event.eventDate) > new Date()
                    ? 'bg-black text-white'
                    : 'bg-gray-600 text-white'
                }`}
              >
                {new Date(event.eventDate) > new Date() ? 'Upcoming' : 'Past'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No events found</h3>
          <p className="text-gray-500">Create your first event to get started.</p>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
