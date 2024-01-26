import { HistoryStatus } from '@prisma/client';

export interface History {
  id: string;
  score: number;
  createdAt: Date;
  numberOfQuestions: number;
  scoreInPercentage: number;
}

export interface HistoryDetail extends History {
  topic: {
    id: string;
    title: string;
    numberOfQuestions: number;
    subject: {
      id: string;
      title: string;
      color: string;
    };
  };
  questions: {
    id: string;
    statement: string;
    isCorrect: boolean;
    options: {
      id: string;
      statement: string;
      description: string;
    }[];
    choice: {
      id: string;
      optionId: string;
    };
  }[];
  summary: HistorySummary;
}

export interface HistorySummaryMessage {
  history: {
    id: string;
  };
  topic: {
    title: string;
  };
  questions: {
    id: string;
    statement: string;
    options: {
      id: string;
      statement: string;
      description: string;
      isCorrect: boolean;
      isChosen: boolean;
    }[];
  }[];
}

export interface HistorySummary {
  status: HistoryStatus;
  feedbacks: string[];
  suggestions: string[];
}
