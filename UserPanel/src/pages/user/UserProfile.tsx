import React, { useState } from 'react';
import { User, Mail, Calendar, Shield, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    // Here you would typically make an API call to update the user profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
    // You might want to update the user context here as well
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white rounded-lg transition-all"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-6 mb-8">
          <div className="bg-black rounded-full p-6">
            <User className="h-12 w-12 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
              <Shield className="h-4 w-4 mr-1" />
              {user?.role === 'ADMIN' ? 'Administrator' : 'Student'}
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user?.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user?.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">
                  {user?.role === 'ADMIN' ? 'Administrator' : 'Student'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-black rounded-full p-4 w-16 h-16 mx-auto mb-2">
              <User className="h-8 w-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-sm text-gray-600">Notes Uploaded</p>
          </div>
          <div className="text-center">
            <div className="bg-black rounded-full p-4 w-16 h-16 mx-auto mb-2">
              <User className="h-8 w-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-600">Tips Shared</p>
          </div>
          <div className="text-center">
            <div className="bg-black rounded-full p-4 w-16 h-16 mx-auto mb-2">
              <User className="h-8 w-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600">Downloads</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;