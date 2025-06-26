import React from 'react';
import { Shield, User, Trash2, Search } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { User as UserType } from '../../types';

export function UsersList() {
  const { data, loading, error, refetch } = useApi<{ users: UserType[] }>(api.getUsers);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(userId);
        refetch();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = data?.users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-black rounded-2xl p-6 shadow-sm">
        <p className="text-black font-medium">Error loading users: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-300">
      <div className="p-8 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-black">Users Management</h3>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
            {filteredUsers.length} total users
          </div>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black bg-gray-50 text-black"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Role
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-semibold text-black">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.role === 'ADMIN' ? (
                      <Shield className="w-5 h-5 text-black mr-2" />
                    ) : (
                      <User className="w-5 h-5 text-gray-600 mr-2" />
                    )}
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${
                      user.role === 'ADMIN'
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-gray-600 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}