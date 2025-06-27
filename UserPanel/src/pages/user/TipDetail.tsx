import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User, ThumbsUp, MessageCircle, ArrowLeft } from 'lucide-react';
import { apiService } from '../../services/api';
import { Tip } from '../../types';

const TipDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tip, setTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchTip();
  }, [id]);

  const fetchTip = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTipById(id!);
      setTip(response.tip);
    } catch (error) {
      console.error('Error fetching tip:', error);
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

  if (!tip) {
    return <p className="text-center mt-12 text-gray-600">Tip not found</p>;
  }

  return (
    <div className="w-full px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Tips
      </button>

      <div className="w-full bg-white shadow-md rounded-2xl p-8 border border-gray-100">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{tip.title}</h1>

        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{tip.postedBy?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(tip.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {tip.content}
        </p>

        <div className="mt-8 flex items-center space-x-4 text-gray-500">
          <button className="flex items-center px-3 py-1 rounded-lg hover:bg-blue-50 transition">
            <ThumbsUp className="h-5 w-5 mr-1" />
            <span>0</span>
          </button>
          <button className="flex items-center px-3 py-1 rounded-lg hover:bg-green-50 transition">
            <MessageCircle className="h-5 w-5 mr-1" />
            <span>0</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipDetail;
