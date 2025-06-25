import React, { useState, useEffect } from 'react';
import { Search, ThumbsUp, MessageCircle, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Tip } from '../../types';
import { apiService } from '../../services/api';

const AdminTips: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllTips();
      setTips(response.tips || []);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTip = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await apiService.approveTip(id, status);
      fetchTips();
    } catch (error) {
      console.error('Error updating tip status:', error);
    }
  };

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || tip.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tips Management</h1>
          <p className="text-gray-600 mt-1">Review and manage study tips from students</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {filteredTips.length} tips
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            {filteredTips.filter(tip => tip.status === 'PENDING').length} pending
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filter by status</span>
          </div>
        </div>
      </div>

      {/* Tips List */}
      <div className="space-y-4">
        {filteredTips.map((tip) => (
          <div key={tip.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {tip.content}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {tip.status === 'APPROVED' && (
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}
                {tip.status === 'PENDING' && (
                  <div className="bg-orange-100 p-2 rounded-full">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  </div>
                )}
                {tip.status === 'REJECTED' && (
                  <div className="bg-red-100 p-2 rounded-full">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tip.status === 'APPROVED' 
                    ? 'bg-green-100 text-green-800' 
                    : tip.status === 'PENDING'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tip.status}
                </span>
              </div>
            </div>

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
                <div className="flex items-center space-x-2 mr-4">
                  <button className="flex items-center space-x-1 px-3 py-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">0</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">0</span>
                  </button>
                </div>

                {tip.status === 'PENDING' && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleApproveTip(tip.id, 'APPROVED')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleApproveTip(tip.id, 'REJECTED')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Reject
                    </button>
                  </div>
                )}
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
          <p className="text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminTips;