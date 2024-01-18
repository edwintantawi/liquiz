import { TopicProviders } from '~/app/topics/[topic_id]/providers';

interface TopicLayoutProps {
  children: React.ReactNode;
}

export default function TopicLayout({ children }: TopicLayoutProps) {
  return <TopicProviders>{children}</TopicProviders>;
}
