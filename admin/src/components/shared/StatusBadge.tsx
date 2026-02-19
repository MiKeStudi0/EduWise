import { Status } from '@/types';

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      status === 'active'
        ? 'bg-success/10 text-success'
        : 'bg-muted text-muted-foreground'
    }`}>
      {status}
    </span>
  );
}
