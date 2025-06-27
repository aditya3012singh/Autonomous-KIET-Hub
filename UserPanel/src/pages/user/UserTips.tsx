import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Clock,
  User,
  CheckCircle,
} from 'lucide-react';
import { Tip } from '../../types';
import { apiService } from '../../services/api';

const UserTips: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTip, setNewTip] = useState({ title: '', content: '' });
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllTips();
      const approvedTips = (response.tips || []).filter(
        (tip: { status: string }) => tip.status === 'APPROVED'
      );
      setTips(approvedTips);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTips = tips.filter(
    (tip) =>
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

const handleCreateTip = async (e: React.FormEvent) => {
  e.preventDefault();

  const trimmedTitle = newTip.title.trim();
  const trimmedContent = newTip.content.trim();

  if (trimmedTitle.length < 10 || trimmedContent.length < 10) {
    alert("Both title and content must be at least 10 characters long.");
    return;
  }

  try {
    await apiService.createTip(newTip);
    setNewTip({ title: '', content: '' });
    setShowCreateForm(false);
    alert('Tip submitted successfully and is pending approval!');
    fetchTips();
  } catch (error) {
    console.error('Error creating tip:', error);
    alert('Failed to submit tip. Please try again.');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Tips</h1>
          <p className="text-gray-600 mt-1">Share and discover effective study strategies</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center text-white rounded-md bg-black hover:bg-gray-600 px-4 py-2 transition-all"
        >
          <Plus className="h-4 w-4 mr-2 text-white" />
          Share a Tip
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Share Your Study Tip</h2>
          <form onSubmit={handleCreateTip} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newTip.title}
                onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a descriptive title for your tip"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                rows={4}
                value={newTip.content}
                onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your study tip in detail..."
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
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all"
              >
                Submit Tip
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            onClick={() => navigate(`/user/tips/${tip.id}`)}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">{tip.title}</h3>
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Approved
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">{tip.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>by {tip.postedBy?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(tip.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 px-3 py-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">0</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">0</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tips found</h3>
          <p className="text-gray-500">Try adjusting your search or be the first to share a tip!</p>
        </div>
      )}
    </div>
  );
};

export default UserTips;