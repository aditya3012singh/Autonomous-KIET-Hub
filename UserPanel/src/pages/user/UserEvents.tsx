import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Event } from '../../types';
import { apiService } from '../../services/api';

const UserEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllEvents();
      setEvents(response.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
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
          <h1 className="text-2xl font-bold text-black">Events</h1>
          <p className="text-gray-600 mt-1">Stay updated with upcoming academic events</p>
        </div>
        <span className="mt-4 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
          {events.length} events
        </span>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow transition-all">
            <h3 className="text-lg font-semibold text-black mb-3">{event.title}</h3>

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
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                {new Date(event.eventDate) > new Date() ? 'Upcoming' : 'Past'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No events found</h3>
          <p className="text-gray-500">Check back later for upcoming events.</p>
        </div>
      )}
    </div>
  );
};

export default UserEvents;
