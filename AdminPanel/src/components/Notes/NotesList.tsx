import React from 'react';
import { CheckCircle, FileText, Download, User, Clock } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { Note } from '../../types';

export function NotesList() {
  const { data, loading, error, refetch } = useApi<{ notes: Note[] }>(api.getNotes);

  const handleApprove = async (noteId: string) => {
    try {
      await api.approveNote(noteId);
      refetch();
    } catch (error) {
      console.error('Error approving note:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="ml-3">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-800">Error loading notes: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Notes Management</h3>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {data?.notes?.length || 0} total notes
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.notes?.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-bold text-gray-900">{note.title}</h4>
                  <p className="text-sm text-gray-500 font-medium">{note.subject.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {note.approvedById ? (
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    ✓ Approved
                  </span>
                ) : (
                  <button
                    onClick={() => handleApprove(note.id)}
                    className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</span>
                  <p className="font-semibold text-gray-900 mt-1">{note.branch}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Semester</span>
                  <p className="font-semibold text-gray-900 mt-1">{note.semester}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Uploaded by</span>
                  <span className="font-semibold text-gray-900 ml-1">{note.uploadedBy.name}</span>
                </div>
                <span className="text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </a>
              
              {!note.approvedById && (
                <button
                  onClick={() => handleApprove(note.id)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}