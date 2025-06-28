import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  User, 
  ThumbsUp, 
  MessageCircle, 
  ArrowLeft, 
  Lightbulb,
  Star,
  Calendar,
  Share2,
  BookmarkPlus,
  Heart,
  Award,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../../services/api';
import { Tip } from '../../types';

const TipDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tip, setTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tip?.title,
          text: `Check out this study tip: ${tip?.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // Here you would typically make an API call to update the like status
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // Here you would typically make an API call to update the bookmark status
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-amber-500"></div>
            <p className="text-slate-600 font-medium">Loading study tip...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Tip Not Found</h2>
          <p className="text-slate-600 mb-6">The study tip you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-30 animate-pulse delay-2000"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200 group"
        >
          <div className="w-8 h-8 bg-white/70 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="font-medium">Back to Tips</span>
        </button>

        {/* Main Content Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden animate-fade-in">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-red-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-amber-100 text-sm font-medium">Study Tip</span>
                      <div className="flex items-center space-x-4 text-amber-200 text-sm mt-1">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{tip.postedBy?.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(tip.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4 leading-tight">{tip.title}</h1>
                </div>
                
                {/* Featured Badge */}
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full flex items-center space-x-2">
                  <Star className="h-4 w-4 text-amber-200" />
                  <span className="text-sm font-medium text-white">Featured Tip</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 border ${
                    liked 
                      ? 'bg-red-500/20 border-red-400/30 text-red-100' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">Like</span>
                </button>
                
                <button
                  onClick={handleBookmark}
                  className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 border ${
                    bookmarked 
                      ? 'bg-blue-500/20 border-blue-400/30 text-blue-100' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <BookmarkPlus className={`h-4 w-4 mr-2 ${bookmarked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">Save</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:scale-105 border border-white/20"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Tip Content */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Study Tip Content</h2>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
                  {tip.content}
                </p>
              </div>
            </div>

            {/* Author & Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Author Info */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Shared by</h3>
                    <p className="text-slate-600 font-medium">{tip.postedBy?.name || 'Anonymous User'}</p>
                    <p className="text-slate-500 text-sm">Community Contributor</p>
                  </div>
                </div>
              </div>

              {/* Publication Info */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Published</h3>
                    <p className="text-slate-600 font-medium">
                      {new Date(tip.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {new Date(tip.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Section */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Found this helpful?</h3>
                  <p className="text-slate-600">Let others know by liking and sharing this tip</p>
                </div>
                
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      liked 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">0</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 transform hover:scale-105">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">0</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Related Tips Section */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">More Study Tips</h3>
              </div>
              
              <p className="text-slate-600 mb-4">
                Discover more helpful study tips from our community of learners.
              </p>
              
              <button
                onClick={() => navigate('/user/tips')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Lightbulb className="h-5 w-5 mr-2" />
                Browse All Tips
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipDetail;