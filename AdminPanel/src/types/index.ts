export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  branch: string;
  semester: number;
}

export interface Note {
  id: string;
  title: string;
  branch: string;
  semester: number;
  fileUrl: string;
  createdAt: string;
  approvedById?: string;
  subject: Subject;
  uploadedBy: User;
  approvedBy?: User;
  feedbacks?: Feedback[];
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  postedBy?: User;
  approvedBy?: User;
}

export interface FileUpload {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  uploadedBy: User;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  postedBy: User;
}

export interface Event {
  id: string;
  title: string;
  content: string;
  eventDate: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  noteId?: string;
  tipId?: string;
}

export interface DashboardStats {
  notes: number;
  tips: number;
  events: number;
  announcements: number;
}