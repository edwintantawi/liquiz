import { SubjectItemSkeleton } from '~/components/subject/subject-item';

interface SubjectListSkeletonProps {
  count: number;
}

export function SubjectListSkeleton({ count }: SubjectListSkeletonProps) {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {Array.from({ length: count }).map((_, index) => {
        return (
          <li key={index}>
            <SubjectItemSkeleton />
          </li>
        );
      })}
    </ul>
  );
}
