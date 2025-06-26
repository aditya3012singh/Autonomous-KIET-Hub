import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Search,
  ThumbsUp,
  MessageCircle,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Tip } from '../../types';
import { api } from '../../utils/api';

const AdminTips: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [tips, setTips] = useState<Tip[]>([]);
  const [selectedTips, setSelectedTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await api.getAllTips();
      setTips(response.tips || []);
    } catch (error) {
      console.error('Error fetching tips:', error);
      toast.error('Failed to fetch tips');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTip = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.moderateTip(id, status);
      toast.success(`Tip ${status.toLowerCase()}`);
      fetchTips();
    } catch (error) {
      console.error('Error updating tip status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleBulkApprove = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.bulkApproveTips(selectedTips, status);
      toast.success(`Selected tips ${status.toLowerCase()}`);
      setSelectedTips([]);
      fetchTips();
    } catch (error) {
      console.error('Bulk approval error:', error);
      toast.error('Bulk update failed');
    }
  };

  const toggleTipSelection = (id: string) => {
    setSelectedTips((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const filteredTips = tips.filter((tip) => {
    const matchesSearch =
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || tip.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddTip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTip({ title: newTitle, content: newContent });
      toast.success('Tip submitted for approval');
      setNewTitle('');
      setNewContent('');
      fetchTips();
    } catch (error) {
      console.error('Error adding tip:', error);
      toast.error('Failed to submit tip');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Tips Management</h1>
          <p className="text-gray-600 mt-1">Review and manage study tips from students</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black text-white">
            {filteredTips.length} tips
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-white">
            {filteredTips.filter((tip) => tip.status === 'PENDING').length} pending
          </span>
        </div>
      </div>

      {/* Add Tip Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Add New Tip</h2>
        <form onSubmit={handleAddTip} className="space-y-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter tip title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            required
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Enter tip content"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            rows={4}
            required
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Submit Tip
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {selectedTips.length > 0 && (
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => handleBulkApprove('APPROVED')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Approve Selected
          </button>
          <button
            onClick={() => handleBulkApprove('REJECTED')}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Reject Selected
          </button>
        </div>
      )}

      <div className="space-y-4">
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTips.includes(tip.id)}
                  onChange={() => toggleTipSelection(tip.id)}
                  className="mr-2 accent-black"
                />
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-semibold text-black mb-2">{tip.title}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">{tip.content}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {tip.status === 'APPROVED' && <CheckCircle className="h-5 w-5 text-black" />}
                {tip.status === 'PENDING' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                {tip.status === 'REJECTED' && <XCircle className="h-5 w-5 text-red-600" />}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>by {tip.postedBy?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(tip.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {tip.status === 'PENDING' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveTip(tip.id, 'APPROVED')}
                    className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproveTip(tip.id, 'REJECTED')}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No tips found</h3>
          <p className="text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminTips;
