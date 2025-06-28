class AIService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    // In production, this would come from environment variables
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key');
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('openai_api_key', apiKey);
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are StudyBot, an intelligent AI study assistant for NoteNexus. You help students with:
              - Explaining complex concepts in simple terms
              - Creating quizzes and practice questions
              - Summarizing study materials
              - Providing personalized study tips
              - Analyzing uploaded notes and documents
              
              Always be encouraging, educational, and helpful. Use emojis sparingly but effectively. 
              Format your responses clearly with headers, bullet points, and examples when appropriate.
              Keep responses concise but comprehensive.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  async analyzeNoteContent(noteContent: string, analysisType: 'summary' | 'quiz' | 'concepts' | 'questions' = 'summary'): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackNoteAnalysis(noteContent, analysisType);
    }

    const prompts = {
      summary: `Please analyze the following study notes and provide a comprehensive summary with key points, main concepts, and important details:\n\n${noteContent}`,
      
      quiz: `Based on the following study notes, create a comprehensive quiz with multiple choice, short answer, and essay questions to test understanding:\n\n${noteContent}`,
      
      concepts: `Analyze the following study notes and identify the main concepts, key terms, and their relationships. Explain each concept clearly:\n\n${noteContent}`,
      
      questions: `Based on the following study notes, generate thoughtful study questions that would help a student better understand and remember this material:\n\n${noteContent}`
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are StudyBot, an expert at analyzing academic content. When analyzing notes:
              - Identify key concepts and themes
              - Create clear, structured summaries
              - Generate relevant questions and quizzes
              - Explain complex ideas in accessible language
              - Provide study strategies specific to the content
              
              Format your response with clear headers and bullet points for easy reading.`
            },
            {
              role: 'user',
              content: prompts[analysisType]
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I couldn\'t analyze the content. Please try again.';
    } catch (error) {
      console.error('Note analysis error:', error);
      return this.getFallbackNoteAnalysis(noteContent, analysisType);
    }
  }

  async explainConcept(concept: string, level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate', context?: string): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackExplanation(concept, level);
    }

    const levelDescriptions = {
      beginner: 'Explain in very simple terms with everyday examples, avoiding technical jargon',
      intermediate: 'Provide a comprehensive explanation with relevant examples and some technical detail',
      advanced: 'Give an in-depth explanation with technical details, advanced examples, and theoretical implications'
    };

    const prompt = `${levelDescriptions[level]}. Explain the concept of "${concept}"${context ? ` in the context of ${context}` : ''}.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are StudyBot, an expert educator. When explaining concepts:
              - Start with a clear definition
              - Use relevant examples and analogies
              - Break down complex ideas into digestible parts
              - Provide practical applications
              - Suggest ways to remember the concept
              
              Adjust your explanation level appropriately and use clear formatting.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I couldn\'t explain that concept. Please try again.';
    } catch (error) {
      console.error('Concept explanation error:', error);
      return this.getFallbackExplanation(concept, level);
    }
  }

  async generateStudyPlan(subject: string, timeframe: string, goals: string[]): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackStudyPlan(subject, timeframe, goals);
    }

    const prompt = `Create a detailed study plan for ${subject} over ${timeframe}. Goals: ${goals.join(', ')}. Include daily/weekly schedules, key topics to cover, study methods, and milestones.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are StudyBot, a study planning expert. Create comprehensive, realistic study plans that:
              - Break down subjects into manageable chunks
              - Include various study methods and techniques
              - Set realistic timelines and milestones
              - Account for review and practice time
              - Provide motivation and progress tracking suggestions`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I couldn\'t create a study plan. Please try again.';
    } catch (error) {
      console.error('Study plan generation error:', error);
      return this.getFallbackStudyPlan(subject, timeframe, goals);
    }
  }

  // Fallback responses when OpenAI is not available
  private getFallbackResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
      return "👋 Hi! I'm StudyBot, your AI study assistant. I can help you with explanations, create quizzes, summarize content, and provide study tips. What would you like to learn about today?\n\n*Note: Connect your OpenAI API key for enhanced AI capabilities!*";
    } else if (lowerPrompt.includes('explain') || lowerPrompt.includes('what is')) {
      return "🧠 **Explanation Mode**\n\nI'd love to explain that concept for you! Here's a structured approach:\n\n• **Definition**: [Core concept explanation]\n• **Key Components**: [Main parts or elements]\n• **Examples**: [Real-world applications]\n• **Study Tips**: [How to remember this]\n\n*For detailed AI explanations, please connect your OpenAI API key.*";
    } else if (lowerPrompt.includes('quiz') || lowerPrompt.includes('test')) {
      return "📝 **Quiz Generator**\n\nHere's a sample quiz structure:\n\n**1. Multiple Choice**: What is the main concept?\n   a) Option A\n   b) Option B\n   c) Option C\n\n**2. Short Answer**: Explain in your own words\n\n**3. Application**: Give a real-world example\n\n*Connect OpenAI for custom quizzes based on your specific content!*";
    } else if (lowerPrompt.includes('summary') || lowerPrompt.includes('summarize')) {
      return "📋 **Summary Framework**\n\n**Key Points**:\n• Main concept and definition\n• Important applications\n• Critical details to remember\n\n**Study Strategy**:\n• Review main points daily\n• Create visual connections\n• Practice with examples\n\n*For AI-powered summaries of your notes, connect your OpenAI API key.*";
    } else {
      return "🤖 **StudyBot Ready**\n\nI'm here to help with your studies! I can:\n\n• 🧠 Explain complex concepts\n• 📝 Generate practice quizzes\n• 📋 Summarize study materials\n• 💡 Provide study tips\n• 📊 Analyze your notes\n\n*For full AI capabilities, please add your OpenAI API key in settings.*";
    }
  }

  private getFallbackNoteAnalysis(content: string, type: string): string {
    return `📄 **Note Analysis (${type.toUpperCase()})**\n\n*Demo Mode - Connect OpenAI for full analysis*\n\n**Sample Analysis**:\n• Content length: ~${content.length} characters\n• Estimated reading time: ${Math.ceil(content.length / 1000)} minutes\n• Key topics detected: [Would be identified by AI]\n• Complexity level: [Would be assessed by AI]\n\n**Recommendations**:\n• Review main concepts\n• Create practice questions\n• Connect related topics\n\n*Connect your OpenAI API key for detailed content analysis!*`;
  }

  private getFallbackExplanation(concept: string, level: string): string {
    return `🧠 **Concept Explanation: ${concept}**\n\n*Demo Mode - Level: ${level}*\n\n**Definition**: [AI would provide detailed explanation]\n\n**Key Points**:\n• Core principles\n• Important applications\n• Common examples\n\n**Study Tips**:\n• Break down into smaller parts\n• Use visual aids\n• Practice with examples\n\n*Connect OpenAI API key for detailed, personalized explanations!*`;
  }

  private getFallbackStudyPlan(subject: string, timeframe: string, goals: string[]): string {
    return `📅 **Study Plan: ${subject}**\n\n*Demo Mode - ${timeframe}*\n\n**Goals**: ${goals.join(', ')}\n\n**Sample Structure**:\n• Week 1-2: Foundation concepts\n• Week 3-4: Advanced topics\n• Week 5-6: Practice and review\n\n**Daily Schedule**:\n• 30 min reading\n• 20 min practice\n• 10 min review\n\n*Connect OpenAI for personalized, detailed study plans!*`;
  }
}

export const aiService = new AIService();