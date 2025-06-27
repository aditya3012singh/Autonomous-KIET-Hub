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
  upvotes: any;
  id: string;
  title: string;
  branch: string;
  semester: number;
  fileUrl: string;
  subjectId: string;
  uploadedById: string;
  approvedById?: string;
  createdAt: string;
  subject?: Subject;
  uploadedBy?: User;
  approvedBy?: User;
  feedbacks?: Feedback[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  setUser: (user: User | null) => void; // ✅ Add this
}


export interface Tip {
  id: string;
  title: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  postedById?: string;
  approvedById?: string;
  postedBy?: User;
  approvedBy?: User;
  feedbacks?: Feedback[];
}

export interface Feedback {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  noteId?: string;
  tipId?: string;
  user?: User;
  note?: Note;
  tip?: Tip;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  postedById: string;
  postedBy?: User;
}

export interface Event {
  id: string;
  title: string;
  content: string;
  eventDate: string;
  createdAt: string;
}

export interface File {
  id: string;
  url: string;
  filename: string;
  type: string;
  size: number;
  uploadedById: string;
  createdAt: string;
  uploadedBy?: User;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}