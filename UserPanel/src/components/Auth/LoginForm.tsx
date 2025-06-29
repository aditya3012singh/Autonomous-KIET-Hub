import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Custom Logo Component matching home page
const NoteNexusLogo = ({ className = "h-8 w-8", textSize = "text-2xl" }) => (
  <div className="flex items-center space-x-3">
    <div className="relative">
      <div className={`bg-gradient-to-br from-blue-600 via-purple-600 to-amber-500 p-2 rounded-xl ${className} flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
        <BookOpen className="h-5 w-5 text-white" />
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
    </div>
    <span className={`${textSize} font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent`}>
      NoteNexus
    </span>
  </div>
);


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate=useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    try {
      await login(email, password);
      // ✅ toast and navigation now handled inside AuthContext
    } catch (error) {
      // Optional: fallback or logging
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-amber-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-50 animate-pulse delay-2000"></div>
      <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-green-200 rounded-full opacity-50 animate-bounce delay-3000"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div onClick={()=>navigate('/')} className="text-center hover:cursor-pointer cursor-pointer animate-fade-in">
          <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
            <NoteNexusLogo className="h-12 w-12 mx-auto mb-4" textSize="text-3xl" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Welcome Back to{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
              NoteNexus
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Continue your learning journey and explore new knowledge
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-500 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="animate-slide-up delay-200">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="block w-full pl-14 pr-4 py-4 border border-gray-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 transform hover:scale-105"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="animate-slide-up delay-300">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="bg-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-14 pr-14 py-4 border border-gray-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 transform hover:scale-105"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transform hover:scale-110 transition-transform duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <div className="bg-slate-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Button - Simple Blue Color */}
            <div className="animate-slide-up delay-400">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing you in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to NoteNexus</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 space-y-4 animate-slide-up delay-500">
            <div className="text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-all duration-300 underline decoration-2 underline-offset-2"
                >
                  Create your account
                </Link>
              </p>
            </div>
            
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center animate-fade-in delay-600">
          <p className="text-sm text-slate-500">
            Secure login powered by advanced encryption
          </p>
          <div className="flex justify-center items-center mt-2 space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;