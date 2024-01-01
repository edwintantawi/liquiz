import { Topic as TopicSchema } from '@prisma/client';

import { Subject } from '~/lib/types/subject';

export interface Topic extends TopicSchema {
  subject: Pick<Subject, 'id' | 'title' | 'color'>;
}
