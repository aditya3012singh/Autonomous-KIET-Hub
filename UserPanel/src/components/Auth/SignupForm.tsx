import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff, User, Shield, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as 'STUDENT' | 'ADMIN',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [otp, setOtp] = useState('');
  const [adminExists, setAdminExists] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  // Cooldown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, role: value as 'STUDENT' | 'ADMIN' }));

    if (value === 'ADMIN') {
      try {
        const response = await apiService.checkAdminExists();
        setAdminExists(response.adminExists);
        if (response.adminExists) {
          toast.error('An admin already exists. Only one admin is allowed.');
        }
      } catch {
        toast.error('Error checking admin existence');
      }
    } else {
      setAdminExists(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.role === 'ADMIN' && adminExists) {
      toast.error('Cannot create admin. Admin already exists.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = await apiService.checkUserExists(formData.email);
      if (existingUser.exists) {
        toast.info('User already exists. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      await apiService.generateOtp(formData.email);
      setStep('otp');
      setResendCooldown(60);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = formData.email.toLowerCase();
      await apiService.verifyOtp(email, otp.trim());

      const response = await apiService.signup({
        name: formData.name,
        email,
        password: formData.password,
        role: formData.role,
      });

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      navigate(response.user.role === 'ADMIN' ? '/admin' : '/user');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await apiService.generateOtp(formData.email.toLowerCase());
      setResendCooldown(60);
      toast.success('OTP resent successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend OTP');
    }
  };

  // OTP Verification Screen
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-16 h-16 bg-amber-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-50 animate-pulse delay-2000"></div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <div onClick={()=>navigate('/')} className="mb-8 cursor-pointer hover:cursor-pointer transform hover:scale-105 transition-transform duration-500">
              <NoteNexusLogo className="h-12 w-12 mx-auto mb-4" textSize="text-3xl" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Verify Your{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                Email
              </span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-blue-600 font-semibold">{formData.email}</p>
          </div>

          {/* OTP Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-500 animate-slide-up">
            <form className="space-y-6" onSubmit={handleOtpVerification}>
              <div className="animate-slide-up delay-200">
                <label htmlFor="otp" className="block text-sm font-semibold text-slate-700 mb-3">
                  Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full px-4 py-4 border border-gray-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono transition-all duration-200 transform hover:scale-105"
                  placeholder="000000"
                />
              </div>

              <div className="animate-slide-up delay-300">
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Verify & Create Account</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center space-y-3 animate-slide-up delay-400">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={resendCooldown > 0}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 underline decoration-2 underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Didn't receive the code? Resend"}
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => setStep('signup')}
                    className="text-slate-500 hover:text-slate-700 transition-all duration-300"
                  >
                    ← Back to signup
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Signup Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-amber-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-50 animate-pulse delay-2000"></div>
      <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-green-200 rounded-full opacity-50 animate-bounce delay-3000"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div onClick={()=>navigate('/')} className="text-center cursor-pointer hover:cursor-pointer animate-fade-in">
          <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
            <NoteNexusLogo className="h-12 w-12 mx-auto mb-4" textSize="text-3xl" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Join{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
              NoteNexus
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Create your account and start your learning journey
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-500 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSignup}>
            {/* Full Name */}
            <div className="animate-slide-up delay-200">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-3">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="block w-full pl-14 pr-4 py-4 border border-gray-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 transform hover:scale-105"
                />
              </div>
            </div>

            {/* Email */}
            <div className="animate-slide-up delay-300">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="bg-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="block w-full pl-14 pr-4 py-4 border border-gray-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 transform hover:scale-105"
                />
              </div>
            </div>

            {/* Role */}
            <div className="animate-slide-up delay-400">
              <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-3">
                Account Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="bg-amber-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  className="block w-full pl-14 pr-4 py-4 border border-gray-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 transform hover:scale-105"
                >
                  <option value="STUDENT">Student</option>
                  <option value="ADMIN" disabled={adminExists}>
                    Admin {adminExists ? '(Already exists)' : ''}
                  </option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="animate-slide-up delay-500">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className="block w-full pl-14 pr-14 py-4 border border-gray-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 transform hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transform hover:scale-110 transition-transform duration-200"
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

            {/* Confirm Password */}
            <div className="animate-slide-up delay-600">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="block w-full pl-14 pr-14 py-4 border border-gray-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 transform hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transform hover:scale-110 transition-transform duration-200"
                >
                  <div className="bg-slate-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Button - Simple Blue Color */}
            <div className="animate-slide-up delay-700">
              <button
                type="submit"
                disabled={isLoading || (formData.role === 'ADMIN' && adminExists)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 space-y-4 animate-slide-up delay-800">
            <div className="text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-all duration-300 underline decoration-2 underline-offset-2"
                >
                  Sign in here
                </Link>
              </p>
            </div>
            
            {/* Terms Notice */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-4 w-4 text-amber-500 mr-2" />
                <span className="text-sm font-semibold text-slate-700">Welcome to NoteNexus</span>
              </div>
              <p className="text-xs text-slate-600 text-center leading-relaxed">
                By creating an account, you agree to our Terms of Service and Privacy Policy. 
                Join thousands of students already learning with us!
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center animate-fade-in delay-900">
          <p className="text-sm text-slate-500">
            Secure registration with email verification
          </p>
          <div className="flex justify-center items-center mt-2 space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Protected by advanced security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;