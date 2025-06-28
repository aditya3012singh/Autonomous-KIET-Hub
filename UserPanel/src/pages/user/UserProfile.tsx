import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X, 
  Star,
  Award,
  Clock,
  CheckCircle,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';

const UserProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = async () => {
    try {
      const res = await apiService.updateProfile(formData);
      toast.success('Profile updated successfully!');
      setUser(res.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await apiService.updateProfile({ password: passwordData.newPassword });
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Password update failed:', error);
      toast.error('Failed to update password');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const handlePasswordCancel = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-30 animate-pulse delay-2000"></div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                My Profile
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Manage your account settings and personal information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {!isEditing && !showPasswordForm && (
                <>
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-800 via-blue-900 to-blue-800 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Key className="h-5 w-5 mr-2" />
                    Change Password
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-800 via-blue-900 to-blue-800 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-slide-up delay-200">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-8">
            <div className="relative mb-6 md:mb-0">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-800 via-blue-900 to-blue-800 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <User className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">{user?.name}</h2>
              <p className="text-lg text-slate-600 mb-3">{user?.email}</p>
              
              <div className="flex flex-wrap gap-3">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                  user?.role === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-700 border-purple-200' 
                    : 'bg-blue-100 text-blue-700 border-blue-200'
                }`}>
                  <Shield className="h-4 w-4 mr-2" />
                  {user?.role === 'ADMIN' ? 'Administrator' : 'Student'}
                </span>
                
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                  <Star className="h-4 w-4 mr-2" />
                  Active Member
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800">12</div>
                <div className="text-sm text-slate-600">Contributions</div>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {user?.createdAt 
                    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                    : 0}
                </div>
                <div className="text-sm text-slate-600">Days Active</div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Account Information</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                {isEditing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="block w-full pl-14 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                    <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-slate-800 font-medium">{user?.name}</span>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <div className="flex items-center space-x-4 p-4 bg-slate-100 rounded-xl border border-slate-200">
                  <div className="bg-slate-300 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-slate-600" />
                  </div>
                  <span className="text-slate-600 font-medium">{user?.email}</span>
                  <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">Read-only</span>
                </div>
              </div>

              {/* Account Type */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Account Type</label>
                <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    user?.role === 'ADMIN' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    <Shield className={`h-5 w-5 ${
                      user?.role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <span className="text-slate-800 font-medium">
                    {user?.role === 'ADMIN' ? 'Administrator' : 'Student'}
                  </span>
                </div>
              </div>

              {/* Member Since */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Member Since</label>
                <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-slate-800 font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons for Profile Edit */}
            {isEditing && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-white/30">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 text-slate-600 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/70 transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Change Password</h2>
              </div>
              <button
                onClick={handlePasswordCancel}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/50 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Password */}
                <div className="lg:col-span-2 space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="bg-slate-600 w-8 h-8 rounded-lg flex items-center justify-center">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="block w-full pl-14 pr-14 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <div className="bg-slate-400 w-8 h-8 rounded-lg flex items-center justify-center">
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-white" />
                        ) : (
                          <Eye className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="block w-full pl-14 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <p className="text-sm text-slate-500">Minimum 6 characters required</p>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="block w-full pl-14 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/30">
                <button
                  type="button"
                  onClick={handlePasswordCancel}
                  className="px-6 py-3 text-slate-600 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/70 transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Key className="h-4 w-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Account Security Section */}
        <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Account Security</h3>
                <p className="text-slate-300">Your account is protected with advanced security measures</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                </div>
                <h4 className="font-semibold mb-2">Email Verified</h4>
                <p className="text-slate-300 text-sm">Your email address has been verified and secured</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Lock className="h-5 w-5 text-blue-300" />
                </div>
                <h4 className="font-semibold mb-2">Secure Password</h4>
                <p className="text-slate-300 text-sm">Your password is encrypted and stored securely</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Star className="h-5 w-5 text-purple-300" />
                </div>
                <h4 className="font-semibold mb-2">Active Session</h4>
                <p className="text-slate-300 text-sm">Currently logged in from a secure connection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;