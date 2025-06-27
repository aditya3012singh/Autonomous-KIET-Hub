const API_BASE_URL = 'http://localhost:3000/api/v1';

class ApiService {
  
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
  async getTipById(id: string) {
  const response = await fetch(`http://localhost:3000/api/v1/tips/tip/${id}`, {
    headers: this.getAuthHeaders(),
  });
  return this.handleResponse(response);
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  }
  
  // Auth endpoints
  async generateOtp(email: string) {
    const response = await fetch(`${API_BASE_URL}/users/generate-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(response);
  }
  
  async verifyOtp(email: string, code: string) {
    const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    return this.handleResponse(response);
  }

  async signup(userData: { email: string; name: string; password: string; role?: string }) {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async signin(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async checkAdminExists() {
    const response = await fetch(`${API_BASE_URL}/users/check-admin`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return this.handleResponse(response);
  }

  // Notes endpoints
  async uploadNote(noteData: FormData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/v1/notes/note/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ no "Content-Type"
      },
      body: noteData,
    });
    return this.handleResponse(response);
  }

  async getAllNotes() {
    const response = await fetch(`${API_BASE_URL}/notes/note/all`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getNote(id: string) {
    const response = await fetch(`${API_BASE_URL}/notes/note/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async filterNotes(filters: { branch?: string; semester?: string; subjectId?: string }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await fetch(`${API_BASE_URL}/notes/note/filter?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async approveNote(id: string) {
    const response = await fetch(`${API_BASE_URL}/notes/note/approve/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Tips endpoints
  async createTip(tipData: { title: string; content: string }) {
    const response = await fetch(`http://localhost:3000/api/v1/tips/tip`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(tipData),
    });
    return this.handleResponse(response);
  }

  async getAllTips() {
    const response = await fetch(`http://localhost:3000/api/v1/tips/tip/all`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getPendingTips(page = 1, limit = 10) {
    const response = await fetch(`${API_BASE_URL}/tips/tip/pending?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
async updateProfile(data: { name?: string; password?: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
    method: 'PUT',
    headers: this.getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return this.handleResponse(response);
}

  async approveTip(id: string, status: 'APPROVED' | 'REJECTED') {
    const response = await fetch(`${API_BASE_URL}/tips/tip/approve/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }

  async deleteTip(id: string) {
    const response = await fetch(`${API_BASE_URL}/tips/tip/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Subjects endpoints
  async createSubject(subjectData: { name: string; branch: string; semester: number }) {
    const response = await fetch(`${API_BASE_URL}/subjects/subject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(subjectData),
    });
    return this.handleResponse(response);
  }

  async getAllSubjects() {
    const response = await fetch(`${API_BASE_URL}/subjects/subject`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getSubject(id: string) {
    const response = await fetch(`${API_BASE_URL}/subjects/subject/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateSubject(id: string, subjectData: { name: string; branch: string; semester: number }) {
    const response = await fetch(`${API_BASE_URL}/subjects/subject/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(subjectData),
    });
    return this.handleResponse(response);
  }

  async deleteSubject(id: string) {
    const response = await fetch(`${API_BASE_URL}/subjects/subject/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Announcements endpoints
  async createAnnouncement(announcementData: { title: string; message: string }) {
    const response = await fetch(`${API_BASE_URL}/announcements/announcement`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(announcementData),
    });
    return this.handleResponse(response);
  }

  async getAllAnnouncements() {
    const response = await fetch(`${API_BASE_URL}/announcements/announcement`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAnnouncement(id: string) {
    const response = await fetch(`${API_BASE_URL}/announcements/announcement/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateAnnouncement(id: string, announcementData: { title: string; message: string }) {
    const response = await fetch(`${API_BASE_URL}/announcements/announcement/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(announcementData),
    });
    return this.handleResponse(response);
  }

  async deleteAnnouncement(id: string) {
    const response = await fetch(`${API_BASE_URL}/announcements/announcement/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Events endpoints
  async createEvent(eventData: { title: string; content: string; eventDate: string }) {
    const response = await fetch(`${API_BASE_URL}/events/event`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return this.handleResponse(response);
  }

  async getAllEvents() {
    const response = await fetch(`${API_BASE_URL}/events/event`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getEvent(id: string) {
    const response = await fetch(`${API_BASE_URL}/events/event/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateEvent(id: string, eventData: { title: string; content: string; eventDate: string }) {
    const response = await fetch(`${API_BASE_URL}/events/event/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return this.handleResponse(response);
  }

  async deleteEvent(id: string) {
    const response = await fetch(`${API_BASE_URL}/events/event/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Feedback endpoints
  async submitFeedback(feedbackData: { content: string; noteId?: string; tipId?: string }) {
    const response = await fetch(`${API_BASE_URL}/feedback/feedback`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(feedbackData),
    });
    return this.handleResponse(response);
  }

  async getFeedbacks(id: string) {
    const response = await fetch(`${API_BASE_URL}/feedback/feedback/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteFeedback(id: string) {
    const response = await fetch(`${API_BASE_URL}/feedback/feedback/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Files endpoints
  async uploadFile(fileData: FormData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/files/file`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: fileData,
    });
    return this.handleResponse(response);
  }

  async getAllFiles() {
    const response = await fetch(`${API_BASE_URL}/files/files`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteFile(id: string) {
    const response = await fetch(`${API_BASE_URL}/files/file/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  
}

export const apiService = new ApiService();