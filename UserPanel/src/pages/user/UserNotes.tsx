import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Star, Clock, User, Plus } from 'lucide-react';
import { Note, Subject } from '../../types';
import { apiService } from '../../services/api';

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
    branch: '',
    semester: '',
    subjectId: '',
    file: null as File | null,
  });

  const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllNotes();
      // Filter only approved notes for users
      const approvedNotes = (response.notes || []).filter((note: { approvedById: any; }) => note.approvedById);
      setNotes(approvedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await apiService.getAllSubjects();
      setSubjects(response.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title || !uploadData.branch || !uploadData.semester || !uploadData.subjectId || !uploadData.file) {
      alert("Please fill out all fields and select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('branch', uploadData.branch);
      formData.append('semester', uploadData.semester);
      formData.append('subjectId', uploadData.subjectId);
      formData.append('file', uploadData.file);

      await apiService.uploadNote(formData);
      alert("Note uploaded successfully and is pending approval.");

      setShowUploadForm(false);
      setUploadData({
        title: '',
        branch: '',
        semester: '',
        subjectId: '',
        file: null,
      });
      fetchNotes();
    } catch (error) {
      console.error('Error uploading note:', error);
      alert("Failed to upload note.");
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subject?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !selectedBranch || note.branch === selectedBranch;
    const matchesSemester = !selectedSemester || note.semester.toString() === selectedSemester;

    return matchesSearch && matchesBranch && matchesSemester;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Notes</h1>
          <p className="text-gray-600 mt-1">Browse and download shared study materials</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {filteredNotes.length} notes available
          </span>
          <button
            onClick={() => setShowUploadForm(true)}
            className="inline-flex items-center px-4 py-2 bg-black rounded-md text-white hover:bg-gray-600 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Note
          </button>
        </div>
      </div>

      {showUploadForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Note</h2>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                <select
                  value={uploadData.branch}
                  onChange={(e) => setUploadData({ ...uploadData, branch: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select
                  value={uploadData.semester}
                  onChange={(e) => setUploadData({ ...uploadData, semester: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem.toString()}>Semester {sem}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={uploadData.subjectId}
                  onChange={(e) => setUploadData({ ...uploadData, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} - {subject.branch} (Sem {subject.semester})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
              <input
                type="file"
                onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black rounded-md hover:bg-slate-600 text-white transition-all"
              >
                Upload Note
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            <option value="">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem} value={sem.toString()}>Semester {sem}</option>
            ))}
          </select>

          <button className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-md hover:bg-slate-600 transition-all">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {note.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {note.subject?.name || 'Unknown Subject'}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    Sem {note.semester}
                  </span>
                </div>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Star className="h-4 w-4 text-green-600" />
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <User className="h-4 w-4" />
              <span>by {note.uploadedBy?.name || 'Unknown'}</span>
              <Clock className="h-4 w-4" />
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Approved
              </span>
              
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => window.open(note.fileUrl, '_blank')}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or upload a new note.</p>
        </div>
      )}
    </div>
  );
};

export default UserNotes;