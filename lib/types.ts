export interface Question {
  id: string;
  week: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index into options
  explanation: string;
  noShuffle?: boolean; // keep option order fixed (e.g. "all of these")
}

export interface Subject {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  questions: Question[];
}
