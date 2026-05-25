export interface Concept {
  id: string;
  title: string;
  description: string;
  example?: string;
}

export interface PracticeExercise {
  id: string;
  type: "classification" | "drag-reorder" | "matching" | "fill-blank" | "short-answer" | "apply";
  question: string;
  options?: any;
  answer?: any;
}

export interface LearningUnit {
  id: string;
  title: string;
  description: string;
  concepts: Concept[];
  exercises: PracticeExercise[];
}

export interface SubQuestion {
  id: string;
  marks: number;
  question: string;
  modelAnswer: string;
  keyPoints: string[];
}

export interface ExamQuestion {
  id: string;
  scenarioTitle: string;
  scenarioDescription: string;
  totalMarks: number;
  subQuestions: SubQuestion[];
}
