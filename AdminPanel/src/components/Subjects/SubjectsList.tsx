import React, { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { Subject } from '../../types';
import { SubjectForm } from './SubjectForm';

export function SubjectsList() {
  const { data, loading, error, refetch } = useApi<{ subjects: Subject[] }>(api.getSubjects);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.deleteSubject(id);
        refetch();
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSubject(null);
    refetch();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="ml-3">
                  <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-800">Error loading subjects: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Subjects Management</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add Subject</span>
        </button>
      </div>

      {showForm && (
        <SubjectForm
          subject={editingSubject}
          onClose={handleFormClose}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.subjects?.map((subject) => (
          <div key={subject.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-bold text-gray-900">{subject.name}</h4>
                  <p className="text-sm text-gray-500 font-medium">{subject.branch}</p>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleEdit(subject)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                Semester {subject.semester}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}