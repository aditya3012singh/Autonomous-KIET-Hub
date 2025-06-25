const API_BASE_URL = 'http://localhost:3000/api';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.reload();
      return;
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
  }
  
  return response.json();
};

export const api = {
  // Dashboard
  getDashboardStats: () => apiRequest('/overview'),
  
  // Users
  getUsers: () => apiRequest('/v1/users'),
  deleteUser: (userId: string) => apiRequest(`/v1/users`, {
    method: 'DELETE',
    body: JSON.stringify({ userId })
  }),
  
  // Subjects
  getSubjects: () => apiRequest('/v1/subjects/subject'),
  createSubject: (data: any) => apiRequest('/v1/subjects/subject', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateSubject: (id: string, data: any) => apiRequest(`/v1/subjects/subject/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteSubject: (id: string) => apiRequest(`/v1/subjects/subject/${id}`, {
    method: 'DELETE'
  }),
  
  // Notes
  getNotes: () => apiRequest('/v1/notes/note/all'),
  approveNote: (id: string) => apiRequest(`/v1/notes/note/approve/${id}`, {
    method: 'PUT'
  }),
  
  // Tips
  getAllTips: () => apiRequest('/v1/tips/tip/all'),
  getPendingTips: () => apiRequest('/v1/tips/tip/pending'),
  moderateTip: (id: string, status: 'APPROVED' | 'REJECTED') => apiRequest(`/v1/tips/tip/approve/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  deleteTip: (id: string) => apiRequest(`/v1/tips/tip/${id}`, {
    method: 'DELETE'
  }),
  
  // Files
  getFiles: () => apiRequest('/v1/files/files'),
  deleteFile: (id: string) => apiRequest(`/v1/files/file/${id}`, {
    method: 'DELETE'
  }),
  
  // Announcements
  getAnnouncements: () => apiRequest('/v1/announcements/announcement'),
  createAnnouncement: (data: any) => apiRequest('/v1/announcements/announcement', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateAnnouncement: (id: string, data: any) => apiRequest(`/v1/announcements/announcement/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteAnnouncement: (id: string) => apiRequest(`/v1/announcements/announcement/${id}`, {
    method: 'DELETE'
  }),
  
  // Events
  getEvents: () => apiRequest('/v1/events/event'),
  createEvent: (data: any) => apiRequest('/v1/events/event', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateEvent: (id: string, data: any) => apiRequest(`/v1/events/event/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteEvent: (id: string) => apiRequest(`/v1/events/event/${id}`, {
    method: 'DELETE'
  }),
  
  // Feedback
  getFeedback: (id: string) => apiRequest(`/v1/feedback/feedback/${id}`),
  deleteFeedback: (id: string) => apiRequest(`/v1/feedback/feedback/${id}`, {
    method: 'DELETE'
  }),

  // Authentication
  getUserProfile: () => apiRequest('/v1/users/profile'),
};