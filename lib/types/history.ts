export interface History {
  id: string;
  score: number;
  createdAt: Date;
}

export interface HistoryDetail extends History {
  topic: {
    id: string;
    title: string;
    numberOfQuestions: number;
    subject: {
      title: string;
      color: string;
    };
  };
}
