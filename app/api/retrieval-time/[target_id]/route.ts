import { auth } from '~/lib/auth';
import { database } from '~/lib/database';

export async function GET(
  _: Request,
  context: { params: { target_id: string } }
) {
  const session = await auth();

  if (!session.isAuthenticated) {
    return Response.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const result = await database.retrievalTime.findFirst({
    select: { duration: true },
    where: { targetId: context.params.target_id },
    orderBy: { duration: 'desc' },
  });

  if (result === null) return Response.json({ duration: null });

  return Response.json({ duration: result.duration });
}
