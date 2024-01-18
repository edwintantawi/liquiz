import { auth } from '~/lib/auth';
import { database } from '~/lib/database';
import { HistorySummary } from '~/lib/types/history';

export async function GET(
  _: Request,
  context: { params: { history_id: string } }
) {
  const session = await auth();

  if (!session.isAuthenticated) {
    return Response.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const history = await database.history.findUnique({
    where: { id: context.params.history_id },
  });

  if (history === null) {
    return Response.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  const summary: HistorySummary = {
    status: history.status,
    feedbacks: history.feedbacks,
    suggestions: history.suggestions,
  };

  return Response.json(summary);
}
