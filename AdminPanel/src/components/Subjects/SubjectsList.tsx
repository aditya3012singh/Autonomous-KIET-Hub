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
          <div key={i} className="bg-white border border-gray-300 rounded-2xl p-6 animate-pulse">
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
      <div className="bg-white border border-black rounded-2xl p-6 shadow-sm">
        <p className="text-black font-medium">Error loading subjects: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-black">Subjects Management</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add Subject</span>
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
          <div key={subject.id} className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 hover:border-black hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-200">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-bold text-black">{subject.name}</h4>
                  <p className="text-sm text-gray-600 font-medium">{subject.branch}</p>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleEdit(subject)}
                  className="p-2 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="p-2 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-black border border-gray-300">
                Semester {subject.semester}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}