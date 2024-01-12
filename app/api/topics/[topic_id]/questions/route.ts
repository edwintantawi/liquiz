import { auth } from '~/lib/auth';
import { database } from '~/lib/database';

export async function GET(
  _: Request,
  context: { params: { topic_id: string } }
) {
  const session = await auth();

  if (!session.isAuthenticated) {
    return Response.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const questions = await database.question.findMany({
    where: {
      topicId: context.params.topic_id,
      topic: { subject: { userId: session.user.id } },
    },
    include: {
      options: { select: { id: true, statement: true, description: true } },
    },
  });

  return Response.json(questions);
}
