import { Subject } from '~/lib/types/subject';

export interface Topic {
  id: string;
  title: string;
  subject: Pick<Subject, 'id' | 'title' | 'color'>;
}

export interface TopicDetail extends Topic {
  numberOfQuestions: number;
  numberOfHistories: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TopicMessage {
  subject: { id: string };
  topic: {
    id: string;
    title: string;
    numberOfQuestions: number;
  };
  contexts: string[];
}
