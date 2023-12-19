import seedColor from 'seed-color';

type SubjectConstructor = {
  id: string;
  title: string;
  description: string;
  numberOfTopics: number;
  rawFile: string;
};

export class Subject {
  public id: string;
  public title: string;
  public description: string;
  public numberOfTopics: number;
  public rawFile: string;
  public colorCode: string;

  constructor({
    id,
    title,
    description,
    numberOfTopics,
    rawFile,
  }: SubjectConstructor) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.numberOfTopics = numberOfTopics;
    this.rawFile = rawFile;
    this.colorCode = seedColor(id).toHex();
  }
}
