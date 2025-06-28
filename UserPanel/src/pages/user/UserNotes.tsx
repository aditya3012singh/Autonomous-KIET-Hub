import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Download, Eye, Star, Clock, User, Plus, ChevronDown,
  BookOpen, GraduationCap, Building, FileText, CheckCircle, Upload,
  X, Calendar, Award, TrendingUp
} from 'lucide-react';
import { Note, Subject } from '../../types';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';

const UserNotes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    branches: [] as string[],
    semester: '',
    subjectId: '',
    file: null as File | null,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const branches = ['CSE', 'ECE', 'Mechanical', 'ELCE', 'EEE', 'CSE-AI', 'CSE-AIML', 'CS', 'IT', 'CSIT'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await apiService.getAllNotes();
      const approved = (res.notes || []).filter((n: any) => n.approvedById);
      setNotes(approved);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await apiService.getAllSubjects();
      setSubjects(res.subjects || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, branches, semester, subjectId, file } = uploadData;
    if (!title || branches.length === 0 || !semester || !subjectId || !file) {
      toast.error('Please fill out all fields and select a file.');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('branches', JSON.stringify(branches));
      fd.append('semester', semester);
      fd.append('subjectId', subjectId);
      fd.append('file', file);
      await apiService.uploadNote(fd);
      toast.success('Note uploaded successfully and is pending approval.');
      setShowUploadForm(false);
      setUploadData({ title: '', branches: [], semester: '', subjectId: '', file: null });
      fetchNotes();
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload note.');
    }
  };

  const toggleBranch = (branch: string) => {
    setUploadData((prev) => {
      const exists = prev.branches.includes(branch);
      const updated = exists
        ? prev.branches.filter((b) => b !== branch)
        : [...prev.branches, branch];
      return { ...prev, branches: updated };
    });
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !selectedBranch || note.branch === selectedBranch;
    const matchesSemester = !selectedSemester || note.semester.toString() === selectedSemester;
    return matchesSearch && matchesBranch && matchesSemester;
  });

  const uniqueNotes = Object.values(
    filteredNotes.reduce((acc, note) => {
      if (!acc[note.fileUrl]) {
        acc[note.fileUrl] = { ...note, branches: [note.branch] };
      } else if (!acc[note.fileUrl].branches.includes(note.branch)) {
        acc[note.fileUrl].branches.push(note.branch);
      }
      return acc;
    }, {} as Record<string, Note & { branches: string[] }>)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
            <p className="text-slate-600 font-medium">Loading study notes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-200 rounded-full opacity-30 animate-pulse delay-2000"></div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Study Notes
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Browse and download shared study materials from your peers
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-purple-700  font-semibold">{uniqueNotes.length} notes available</span>
              </div>
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center px-6 py-3 bg-purple-200 text-purple-800 font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2 text-purple-800" />
                Upload Note
              </button>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Upload New Note</h2>
              </div>
              <button
                onClick={() => setShowUploadForm(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/50 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Note Title</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-b-slate-100 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter a descriptive title for your note"
                    required
                  />
                </div>

                {/* Branches Dropdown */}
                <div ref={dropdownRef} className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Branches</label>
                  <div
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="cursor-pointer w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-b-slate-100 rounded-xl text-slate-800 flex justify-between items-center transition-all duration-200 hover:bg-white/70"
                  >
                    <span className={uploadData.branches.length > 0 ? 'text-slate-800' : 'text-slate-500'}>
                      {uploadData.branches.length > 0
                        ? `${uploadData.branches.length} branch${uploadData.branches.length > 1 ? 'es' : ''} selected`
                        : 'Select applicable branches'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {dropdownOpen && (
                    <div className="absolute z-20 mt-2 w-full max-h-48 overflow-y-auto bg-white/90 backdrop-blur-md border border-b-slate-100 rounded-xl shadow-xl">
                      {branches.map((branch) => (
                        <label
                          key={branch}
                          className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-white/50 transition-colors duration-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            checked={uploadData.branches.includes(branch)}
                            onChange={() => toggleBranch(branch)}
                          />
                          <span className="font-medium">{branch}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Semester</label>
                  <select
                    value={uploadData.semester}
                    onChange={(e) => setUploadData({ ...uploadData, semester: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-b-slate-100 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem.toString()}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Subject</label>
                  <select
                    value={uploadData.subjectId}
                    onChange={(e) => setUploadData({ ...uploadData, subjectId: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-b-slate-100 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Upload File</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-b-slate-100 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    required
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">Supported formats: PDF, DOC, DOCX, PPT, PPTX</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-6 py-3 text-slate-600 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/70 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Upload Note
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-slide-up delay-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Filter & Search</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search notes or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* Semester Filter */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s.toString()}>
                  Semester {s}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBranch('');
                setSelectedSemester('');
              }}
              className="flex items-center justify-center px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up delay-400">
          {uniqueNotes.map((note, index) => (
            <div
              key={note.fileUrl}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group animate-slide-up"
              style={{ animationDelay: `${index * 100 + 500}ms` }}
            >
              {/* Note Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {note.title}
                  </h3>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {note.subject?.name || 'Unknown Subject'}
                    </span>
                    
                    {note.branches.length > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 relative group/tooltip cursor-default">
                        <Building className="h-3 w-3 mr-1" />
                        {note.branches[0]}
                        {note.branches.length > 1 && ` +${note.branches.length - 1}`}
                        
                        {/* Tooltip */}
                        <div className="absolute z-10 hidden group-hover/tooltip:block bg-white border border-slate-200 shadow-lg text-sm text-slate-700 rounded-lg px-3 py-2 mt-1 left-0 whitespace-nowrap">
                          {note.branches.join(', ')}
                        </div>
                      </span>
                    )}
                    
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Sem {note.semester}
                    </span>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="bg-green-100 p-2 rounded-full border border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>

              {/* Note Info */}
              <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{note.uploadedBy?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/30">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/user/notes/${note.id}`)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => window.open(note.fileUrl, '_blank')}
                    className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {uniqueNotes.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 text-center animate-fade-in">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No notes found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
              Try adjusting your search criteria or be the first to upload a note for your subject.
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Upload First Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotes;