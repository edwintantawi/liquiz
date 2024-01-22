export interface Operation {
  id: string;
  status: 'PENDING' | 'COMPLETED';
  type: 'TOPIC' | 'HISTORY';
  url: string;
  message: string;
  color: string;
  date: Date;
}
