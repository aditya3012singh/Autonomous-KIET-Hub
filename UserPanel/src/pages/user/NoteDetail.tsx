import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Note } from '../../types';
import { ArrowLeft, Download, User, Clock, Book } from 'lucide-react';

const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const res = await apiService.getNote(id!); // <- implement this in your API service
      setNote(res.note);
    } catch (error) {
      console.error('Failed to fetch note:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium text-gray-900">Note not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center text-gray-600 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>

        <div className="flex items-center text-gray-500 text-sm space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{note.uploadedBy?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-center">
            <Book className="h-4 w-4 mr-2 text-gray-400" />
            Subject: {note.subject?.name || 'N/A'}
          </div>
          <div className="flex items-center">
            📚 Branch: {note.branch}
          </div>
          <div className="flex items-center">
            🎓 Semester: {note.semester}
          </div>
          <div className="flex items-center">
            ✅ Status: {note.approvedById ? 'Approved' : 'Pending'}
          </div>
        </div>

        <button
          onClick={() => window.open(note.fileUrl, '_blank')}
          className="mt-6 inline-flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Note
        </button>
      </div>
    </div>
  );
};

export default NoteDetail;
