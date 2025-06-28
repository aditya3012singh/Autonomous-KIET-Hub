export interface AIMessage {
  id: string;
  content: string;
  type: 'text' | 'explanation' | 'quiz' | 'summary' | 'tip';
  confidence: number;
  sources?: string[];
  relatedTopics?: string[];
}

export interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface StudyContext {
  subject?: string;
  topic?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
}