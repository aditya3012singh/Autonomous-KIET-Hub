import React, { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Eye, Search, Filter, X, Plus, File, Image, Video, Music, Archive, Calendar, User, HardDrive, Folder, Grid, List, MoreVertical, Share2, Star, Clock, CheckCircle, AlertCircle, UploadCloud as CloudUpload, FolderOpen, FileIcon, ImageIcon, VideoIcon, MusicIcon, ArchiveIcon } from 'lucide-react';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';

interface FileItem {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  uploadedBy?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

const UserFiles: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document' | 'video' | 'audio' | 'other'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

const fetchFiles = async () => {
  try {
    setLoading(true);
    const response = await apiService.getAllFiles();
    console.log(response);

    // Map API files to your expected interface:
    const mappedFiles = (response.files || []).map((file: any) => ({
      id: file.id,
      originalName: file.filename || file.originalName || 'Unnamed',
      name: file.filename || file.originalName || 'Unnamed',
      size: file.size,
      type: file.type,
      url: file.url,
      createdAt: file.createdAt || '', // fallback if missing
      uploadedBy: file.uploadedBy || null, // might be null or undefined
    }));

    setFiles(mappedFiles);
  } catch (error) {
    console.error('Error fetching files:', error);
    setFiles([]);
  } finally {
    setLoading(false);
  }
};


  const handleFileUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;

    setUploading(true);
    try {
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('file', file);
        
        await apiService.uploadFile(formData);
      }
      
      toast.success(`${filesToUpload.length} file(s) uploaded successfully!`);
      setSelectedFiles([]);
      setShowUploadForm(false);
      fetchFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

const handleDeleteFile = async (fileId: string) => {
  if (!confirm('Are you sure you want to delete this file?')) return;

  setDeletingFileId(fileId);

  try {
    await apiService.deleteFile(fileId);
    toast.success('File deleted successfully!');
    fetchFiles();
  } catch (error) {
    console.error('Error deleting file:', error);
    toast.error('Failed to delete file. Please try again.');
  } finally {
    setDeletingFileId(null);
  }
};
    const navigate=useNavigate()
    const handleViewFile = (file: FileItem) => {
    navigate(`/user/files/${file.id}`);
  };

const handleDownloadFile = (file: FileItem) => {
  if (file?.url) {
    window.open(file.url, '_blank'); // Opens the file in a new tab
  } else {
    console.warn("File URL not found.");
  }
};

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles(droppedFiles);
      setShowUploadForm(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFilesList = Array.from(e.target.files);
      setSelectedFiles(selectedFilesList);
      setShowUploadForm(true);
    }
  };

const getFileIcon = (type?: string) => {
  if (!type) return File;  // fallback icon
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('pdf')) return FileText;
  if (type.includes('zip') || type.includes('rar')) return Archive;
  return File;
};


  const getFileTypeCategory = (type: string): 'image' | 'document' | 'video' | 'audio' | 'other' => {
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'document';
    return 'other';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || getFileTypeCategory(file.type) === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getFileStats = () => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const typeStats = files.reduce((acc, file) => {
      const category = getFileTypeCategory(file.type);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalSize, typeStats };
  };

  const stats = getFileStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
            <p className="text-slate-600 font-medium">Loading files...</p>
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
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-30 animate-pulse delay-2000"></div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                My Files
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Upload, organize, and manage your study files and documents
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                <HardDrive className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700 font-semibold">{files.length} files</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-xl border border-blue-200">
                <Folder className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-semibold">{formatFileSize(stats.totalSize)}</span>
              </div>
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Upload Files
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
                <h2 className="text-2xl font-bold text-slate-800">Upload Files</h2>
              </div>
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  setSelectedFiles([]);
                }}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/50 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <CloudUpload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-800 mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-slate-600">
                    Supports PDF, DOC, DOCX, PPT, PPTX, images, and more
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.rar"
                />
              </div>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Selected Files ({selectedFiles.length})</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedFiles.map((file, index) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{file.name}</p>
                            <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => {
                      setSelectedFiles([]);
                      setShowUploadForm(false);
                    }}
                    className="px-6 py-3 text-slate-600 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/70 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleFileUpload(selectedFiles)}
                    disabled={uploading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        <span>Upload Files</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search & Filter Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-slide-up delay-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Find Files</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search files by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Files</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="other">Other</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="flex items-center justify-center px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </button>
          </div>
        </div>

        {/* Files Display */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate-slide-up delay-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Your Files ({filteredFiles.length})</h3>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                {searchTerm || filterType !== 'all' ? 'No files found' : 'No files uploaded yet'}
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                {searchTerm || filterType !== 'all' 
                  ? "Try adjusting your search criteria or filter settings."
                  : "Upload your first file to get started with organizing your study materials."
                }
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Upload Your First File
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file, index) => {
                const Icon = getFileIcon(file.type);
                return (
                  <div
                    key={file.id}
                    onClick={() => handleViewFile(file)} 
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group animate-slide-up"
                    style={{ animationDelay: `${index * 100 + 400}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {file.originalName}
                      </h3>
                      <p className="text-sm text-slate-500 mb-2">{formatFileSize(file.size)}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-slate-600" />
                        </div>
                        <span className="text-xs text-slate-600 font-medium">
                          {file.uploadedBy?.name || 'You'}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getFileTypeCategory(file.type) === 'image' ? 'bg-green-100 text-green-700' :
                        getFileTypeCategory(file.type) === 'document' ? 'bg-blue-100 text-blue-700' :
                        getFileTypeCategory(file.type) === 'video' ? 'bg-purple-100 text-purple-700' :
                        getFileTypeCategory(file.type) === 'audio' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {getFileTypeCategory(file.type)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFiles.map((file, index) => {
                const Icon = getFileIcon(file.type);
                return (
                  <div
                    key={file.id}
                    onClick={() => handleViewFile(file)} 
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200 group animate-slide-up"
                    style={{ animationDelay: `${index * 50 + 400}ms` }}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors duration-200">
                          {file.originalName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{file.uploadedBy?.name || 'You'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getFileTypeCategory(file.type) === 'image' ? 'bg-green-100 text-green-700' :
                        getFileTypeCategory(file.type) === 'document' ? 'bg-blue-100 text-blue-700' :
                        getFileTypeCategory(file.type) === 'video' ? 'bg-purple-100 text-purple-700' :
                        getFileTypeCategory(file.type) === 'audio' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {getFileTypeCategory(file.type)}
                      </span>
                      <button
                        onClick={() => handleDownloadFile(file)}
                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Storage Summary */}
        {files.length > 0 && (
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 rounded-3xl p-8 text-white relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-pink-600/20"></div>
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Storage Overview</h3>
                <p className="text-blue-100">Manage your files efficiently and keep your study materials organized</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <HardDrive className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{files.length}</div>
                  <div className="text-blue-100 text-sm">Total Files</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Folder className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{formatFileSize(stats.totalSize)}</div>
                  <div className="text-blue-100 text-sm">Storage Used</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.typeStats.document || 0}</div>
                  <div className="text-blue-100 text-sm">Documents</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Image className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.typeStats.image || 0}</div>
                  <div className="text-blue-100 text-sm">Images</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFiles;