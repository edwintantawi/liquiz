export interface Question {
  id: string;
  topicId: string;
  statement: string;
  options: {
    id: string;
    statement: string;
    description: string;
    isCorrect: boolean;
  }[];
}
