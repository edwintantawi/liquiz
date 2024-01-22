import { HistoryStatus, TopicStatus } from '@prisma/client';

import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { Operation } from '~/lib/types/operation';

export async function GET(_: Request) {
  const session = await auth();

  if (!session.isAuthenticated) {
    return Response.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const topics: Operation[] = (
    await database.topic.findMany({
      where: {
        subject: { userId: session.user.id },
        status: { not: { equals: TopicStatus.NONE } },
      },
      orderBy: { createdAt: 'desc' },
    })
  ).map((topic) => {
    const status = topic.status as Operation['status'];
    const parsedOperation = parseOperationResource({
      status,
      type: 'TOPIC',
    });
    return {
      type: 'TOPIC',
      id: topic.id,
      status,
      url: `/topics/${topic.id}`,
      createdAt: topic.createdAt,
      message: `${parsedOperation.prefix} ${parsedOperation.action} "${topic.title}" ${parsedOperation.resource}`,
    };
  });

  const histories: Operation[] = (
    await database.history.findMany({
      where: {
        topic: { subject: { userId: session.user.id } },
        status: { not: { equals: HistoryStatus.NONE } },
      },
      include: { topic: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    })
  ).map((history) => {
    const status = history.status as Operation['status'];
    const parsedOperation = parseOperationResource({
      status,
      type: 'HISTORY',
    });

    return {
      type: 'HISTORY',
      id: history.id,
      status,
      url: `/topics/${history.topicId}/histories/${history.id}`,
      createdAt: history.createdAt,
      message: `${parsedOperation.prefix} ${parsedOperation.action} "${history.topic.title}" ${parsedOperation.resource}`,
    };
  });

  let operations = [...topics, ...histories].sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  );
  const pendingOperations = operations.filter(
    (operation) => operation.status === 'PENDING'
  );
  const restOperations = operations.filter(
    (operations) => operations.status !== 'PENDING'
  );

  operations = [...pendingOperations, ...restOperations];

  return Response.json(operations);
}

function parseOperationResource(operation: Pick<Operation, 'status' | 'type'>) {
  const prefixList: Record<Operation['status'], string> = {
    COMPLETED: 'Successfully',
    PENDING: 'On',
  };

  const actionList: Record<Operation['type'], string> = {
    TOPIC: 'creating',
    HISTORY: 'generating',
  };

  const resourceList: Record<Operation['type'], string> = {
    TOPIC: 'topic',
    HISTORY: 'history summary',
  };

  const prefix = prefixList[operation.status] ?? 'Error';
  const action = actionList[operation.type] ?? 'processing';
  const resource = resourceList[operation.type] ?? 'resource';

  return { prefix, action, resource };
}
