export interface SearchRecords {
  subjects: {
    id: string;
    title: string;
    description: string;
    color: string;
    numberOfTopics: number;
  }[];
  topics: {
    id: string;
    title: string;
    subject: {
      id: string;
      title: string;
      color: string;
    };
  }[];
  questions: {
    id: string;
    statement: string;
    topic: {
      id: string;
      title: string;
    };
    subject: {
      id: string;
      title: string;
      color: string;
    };
    options: {
      id: string;
      statement: string;
    }[];
  }[];
}
