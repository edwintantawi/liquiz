export interface Subject {
  id: string;
  title: string;
  description: string;
  color: string;
  numberOfTopics: number;
}

export interface SubjectDetail extends Subject {
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
