import React, { useState, useEffect } from 'react';
import { BookOpen, Lightbulb, Users, ArrowRight, Star, Quote, ChevronDown, Mail, Phone, MapPin, Send, Heart, Target, Award, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const quotes = [
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert"
  },
  {
    text: "Education is not preparation for life; education is life itself.",
    author: "John Dewey"
  }
];

 
// Custom Logo Component
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

function Home() {
  const navigate = useNavigate(); // ✅ Hook to navigate
  
  const handleGetStarted = () => {
    navigate('/login'); // ✅ Navigate to login page
  };
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/api/v1/contacts/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setFormData({ name: '', email: '', message: '' });
      toast.success("Form Submitted successfully")
    } else {
      toast.error(data.error || "Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Failed to send message. Please try again later.");
  }
};


  const features = [
    {
      icon: BookOpen,
      title: "Smart Note Organization",
      description: "Organize your notes with intelligent categorization and powerful search capabilities."
    },
    {
      icon: Lightbulb,
      title: "Study Insights",
      description: "Get personalized study tips and insights to optimize your learning journey."
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Share knowledge and learn together with a community of passionate learners."
    }
  ];

  const teamMembers = [
    {
      name: "Aditya Singh",
      role: "Founder & CEO",
      description: "Student at KIET Group Of Institution 2024-28",
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Student-Centered",
      description: "Every decision we make puts student success at the center."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We constantly push boundaries to create better learning experiences."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for the highest quality in everything we build."
    },
    {
      icon: Zap,
      title: "Accessibility",
      description: "Learning should be accessible to everyone, everywhere."
    }
  ];

  const renderNavigation = () => (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => setCurrentPage('home')} className="transform hover:scale-105 transition-transform duration-200">
            <NoteNexusLogo />
          </button>
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`transition-all duration-300 ${currentPage === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('about')}
              className={`transition-all duration-300 ${currentPage === 'about' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-800'}`}
            >
              About
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className={`transition-all duration-300 ${currentPage === 'contact' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-800'}`}
            >
              Contact
            </button>
            <button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
                <NoteNexusLogo className="h-16 w-16 mx-auto mb-6" textSize="text-6xl md:text-8xl" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 animate-fade-in">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                  NoteNexus
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-slide-up">
                Your intelligent companion for capturing, organizing, and transforming knowledge into wisdom.
              </p>
            </div>

            {/* Quote Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-4xl mx-auto mb-12 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-500">
              <Quote className="h-8 w-8 text-amber-500 mx-auto mb-6 animate-bounce" />
              <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
                <blockquote className="text-2xl md:text-3xl font-medium text-slate-700 mb-6 italic leading-relaxed">
                  "{quotes[currentQuote].text}"
                </blockquote>
                <cite className="text-lg text-slate-500 font-medium">
                  — {quotes[currentQuote].author}
                </cite>
              </div>
              <div className="flex justify-center mt-8 space-x-2">
                {quotes.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                      index === currentQuote ? 'bg-amber-500 scale-110' : 'bg-slate-300'
                    }`}
                    onClick={() => {
                      setIsVisible(false);
                      setTimeout(() => {
                        setCurrentQuote(index);
                        setIsVisible(true);
                      }, 250);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-16 h-16 bg-amber-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-50 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-green-200 rounded-full opacity-50 animate-bounce delay-3000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 animate-fade-in">
              Elevate Your Learning Experience
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-slide-up">
              Discover powerful tools designed to make your study sessions more effective and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 animate-slide-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Join Our Learning Community
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto animate-slide-up">
              Thousands of students are already transforming their learning journey with NoteNexus.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Active Students" },
              { number: "1M+", label: "Notes Created" },
              { number: "95%", label: "Success Rate" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2 animate-fade-in">{stat.number}</div>
                <div className="text-slate-300 text-lg animate-slide-up">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-500">
            <Star className="h-12 w-12 text-amber-500 mx-auto mb-6 animate-spin-slow" />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 animate-fade-in">
              Ready to Transform Your Studies?
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed animate-slide-up">
              Join thousands of students who have already discovered the power of organized, intelligent note-taking.
            </p>
            <button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 text-white px-10 py-4 rounded-xl text-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Get Started for Free
            </button>
            <p className="text-sm text-slate-500 mt-4 animate-fade-in">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderAboutPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 animate-fade-in">
              About{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                NoteNexus
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-slide-up">
              We're on a mission to revolutionize how students learn, organize knowledge, and achieve academic success through intelligent note-taking technology.
            </p>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-float delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-amber-200 rounded-full opacity-30 animate-float delay-2000"></div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At NoteNexus, we believe that every student deserves access to tools that make learning more effective, organized, and enjoyable. Our platform combines cutting-edge technology with proven learning methodologies to create an experience that adapts to each student's unique learning style.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We're not just building a note-taking app – we're crafting a comprehensive learning ecosystem that empowers students to capture, connect, and create knowledge in ways that were never before possible.
              </p>
            </div>
            <div className="relative animate-slide-right">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-amber-500 rounded-3xl p-8 text-white transform hover:scale-105 transition-all duration-500">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-bold mb-4">Empowering Minds</h3>
                  <p className="text-lg opacity-90">Through intelligent technology and thoughtful design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6 animate-fade-in">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-slide-up">
              These core principles guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-amber-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transform hover:rotate-12 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}

      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-6 animate-fade-in">Meet the Creator</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto animate-slide-up">
            Passion, code, and vision – all built by one.
          </p>

          <div className="mt-12 flex justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 animate-slide-up">
              <div className="relative mb-6">
                <img
                  src="https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Profile image of Aditya Singh"
                  className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-gradient-to-r from-blue-500 to-purple-500 transform hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.012 3.11a1 1 0 00.95.69h3.263c.969 0 1.371 1.24.588 1.81l-2.64 1.918a1 1 0 00-.364 1.118l1.012 3.11c.3.921-.755 1.688-1.54 1.118l-2.64-1.918a1 1 0 00-1.176 0l-2.64 1.918c-.784.57-1.838-.197-1.539-1.118l1.011-3.11a1 1 0 00-.364-1.118L2.236 8.537c-.783-.57-.38-1.81.588-1.81h3.262a1 1 0 00.951-.69l1.012-3.11z" /></svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Aditya Singh</h3>
                <p className="text-blue-600 font-semibold mb-3">Founder & Solo Developer</p>
                <p className="text-slate-600 leading-relaxed">
                  Student at KIET Group Of Institutions (2024–2028), passionate about simplifying learning with technology. Every line of code, design, and idea behind NoteNexus is built by me.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Story Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-8 animate-fade-in">Our Story</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-slate-300 mb-6 leading-relaxed animate-slide-up">
                NoteNexus was born from a simple observation: students were struggling to keep up with the pace of modern education while using outdated note-taking methods. Our founders, having experienced these challenges firsthand, envisioned a platform that could bridge the gap between traditional learning and digital innovation.
              </p>
              <p className="text-xl text-slate-300 leading-relaxed animate-slide-up delay-200">
                Today, we're proud to serve thousands of students worldwide, helping them achieve their academic goals through smarter, more organized learning experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderContactPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 animate-fade-in">
              Get in{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-slide-up">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-float delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-amber-200 rounded-full opacity-30 animate-float delay-2000"></div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20 animate-slide-left">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Send us a Message</h2>
              
              {isSubmitted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-fade-in">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-green-800 font-medium">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 transform hover:scale-105"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 transform hover:scale-105"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 transform hover:scale-105"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 animate-slide-right">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">Email</h4>
                      <p className="text-slate-600">adityanotenexus@gmail.com</p>
                      <p className="text-slate-600">supportnotenexus@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-purple-500 to-amber-500 w-12 h-12 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">Phone</h4>
                      <p className="text-slate-600">+91 7905361332</p>
                      <p className="text-slate-600">Mon-Fri, 9am-6pm IST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-amber-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">Office</h4>
                      <p className="text-slate-600"></p>
                      <p className="text-slate-600">Lucknow, Uttar Pradesh</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-amber-500 rounded-3xl p-8 text-white transform hover:scale-105 transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">Quick Response</h3>
                <p className="text-lg opacity-90 mb-4">
                  Need immediate help? Our support team typically responds within 2 hours during business hours.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Support team online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6 animate-fade-in">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600 animate-slide-up">
              Find answers to common questions about NoteNexus.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How does NoteNexus help improve my study habits?",
                answer: "NoteNexus uses intelligent organization and AI-powered insights to help you structure your notes more effectively, identify knowledge gaps, and optimize your study sessions for better retention."
              },
              {
                question: "Is my data secure with NoteNexus?",
                answer: "Absolutely. We use enterprise-grade encryption and security measures to protect your data. Your notes are private and secure, and we never share your personal information with third parties."
              },
              {
                question: "Can I collaborate with classmates on NoteNexus?",
                answer: "Yes! NoteNexus includes powerful collaboration features that allow you to share notes, work on group projects, and learn together with your classmates while maintaining control over your private content."
              },
              {
                question: "What devices can I use NoteNexus on?",
                answer: "NoteNexus works seamlessly across all your devices - desktop, tablet, and mobile. Your notes sync automatically, so you can access them anywhere, anytime."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderFooter = () => (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="transform hover:scale-105 transition-transform duration-200 mb-4 md:mb-0">
            <NoteNexusLogo className="h-8 w-8" textSize="text-2xl" />
          </button>
          <div className="text-slate-400 text-center md:text-right">
            <p>© 2025 NoteNexus. Empowering minds, one note at a time.</p>
            <p className="text-sm mt-1">Crafted with ❤️ for learners everywhere</p>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen">
      {renderNavigation()}
      
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'about' && renderAboutPage()}
      {currentPage === 'contact' && renderContactPage()}
      
      {renderFooter()}
    </div>
  );
}

export default Home;