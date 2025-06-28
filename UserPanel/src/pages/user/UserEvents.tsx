import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Filter, 
  Search, 
  ChevronRight,
  CalendarDays,
  Timer,
  Award,
  TrendingUp,
  Eye,
  BookmarkPlus,
  Share2,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { Event } from '../../types';
import { apiService } from '../../services/api';

const UserEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all');

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

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const eventDate = new Date(event.eventDate);
    const now = new Date();
    
    let matchesFilter = true;
    if (filterType === 'upcoming') {
      matchesFilter = eventDate > now;
    } else if (filterType === 'past') {
      matchesFilter = eventDate <= now;
    }
    
    return matchesSearch && matchesFilter;
  });

  const upcomingEvents = events.filter(event => new Date(event.eventDate) > new Date());
  const pastEvents = events.filter(event => new Date(event.eventDate) <= new Date());

  const getEventStatus = (eventDate: string) => {
    const event = new Date(eventDate);
    const now = new Date();
    const diffTime = event.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      if (diffDays === 1) return { status: 'tomorrow', label: 'Tomorrow', color: 'amber' };
      if (diffDays <= 7) return { status: 'this-week', label: `In ${diffDays} days`, color: 'blue' };
      return { status: 'upcoming', label: 'Upcoming', color: 'green' };
    } else if (diffDays === 0) {
      return { status: 'today', label: 'Today', color: 'red' };
    } else {
      return { status: 'past', label: 'Past', color: 'slate' };
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      full: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-green-500"></div>
            <p className="text-slate-600 font-medium">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-30 animate-pulse delay-2000"></div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-blue-400 bg-clip-text text-transparent mb-3">
                Academic Events
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Stay updated with upcoming academic events and important dates
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="text-slate-700 font-semibold">{events.length} total events</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-xl border border-green-200">
                <Timer className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-semibold">{upcomingEvents.length} upcoming</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-slide-up delay-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-700 via-blue-900 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Find Events</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-b-slate-300 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'upcoming' | 'past')}
              className="px-4 py-3 bg-white/50 backdrop-blur-sm border border-b-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="flex items-center justify-center px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up delay-300">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Upcoming Events</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">{upcomingEvents.length}</p>
            <p className="text-slate-600 text-sm">Events scheduled ahead</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-blue-600  rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">This Week</h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {upcomingEvents.filter(event => {
                const diffTime = new Date(event.eventDate).getTime() - new Date().getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7 && diffDays > 0;
              }).length}
            </p>
            <p className="text-slate-600 text-sm">Events this week</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-blue-600  rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Past Events</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">{pastEvents.length}</p>
            <p className="text-slate-600 text-sm">Completed events</p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up delay-400">
          {filteredEvents.map((event, index) => {
            const eventStatus = getEventStatus(event.eventDate);
            const formattedDate = formatEventDate(event.eventDate);
            
            return (
              <div
                key={event.id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group animate-slide-up"
                style={{ animationDelay: `${index * 100 + 500}ms` }}
              >
                {/* Event Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-green-600 text-sm font-medium">Academic Event</span>
                      <div className="flex items-center space-x-2 text-slate-500 text-xs mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{formattedDate.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    eventStatus.color === 'red' 
                      ? 'bg-red-100 text-red-700 border-red-200' 
                      : eventStatus.color === 'amber'
                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : eventStatus.color === 'blue'
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : eventStatus.color === 'green'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {eventStatus.color === 'red' && <AlertCircle className="h-3 w-3 mr-1 inline" />}
                    {eventStatus.color !== 'red' && eventStatus.color !== 'slate' && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                    {eventStatus.label}
                  </div>
                </div>

                {/* Event Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
                    {event.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {event.content}
                  </p>
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3 text-slate-600 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CalendarDays className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{formattedDate.full}</p>
                      <p className="text-xs text-slate-500">Event Date</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-slate-600 text-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Timer className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{formattedDate.time}</p>
                      <p className="text-xs text-slate-500">Event Time</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                      <BookmarkPlus className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm font-medium">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 text-center animate-fade-in">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              {searchTerm || filterType !== 'all' ? 'No events found' : 'No events scheduled'}
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
              {searchTerm || filterType !== 'all' 
                ? "Try adjusting your search criteria or filter settings to find events."
                : "Check back later for upcoming academic events and important dates."
              }
            </p>
            {(searchTerm || filterType !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <X className="h-5 w-5 mr-2" />
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Events Summary */}
        {events.length > 0 && (
          <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl p-8 text-white relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Event Calendar Overview</h3>
                <p className="text-green-100">Stay organized with our comprehensive event tracking</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{events.length}</div>
                  <div className="text-green-100 text-sm">Total Events</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Timer className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{upcomingEvents.length}</div>
                  <div className="text-green-100 text-sm">Upcoming</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-green-100 text-sm">Attendance Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">A+</div>
                  <div className="text-green-100 text-sm">Event Quality</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEvents;