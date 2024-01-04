import { Subject } from '~/lib/types/subject';

export interface Topic {
  id: string;
  title: string;
  subject: Pick<Subject, 'id' | 'title' | 'color'>;
}

export interface TopicDetail extends Topic {
  numberOfQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}
