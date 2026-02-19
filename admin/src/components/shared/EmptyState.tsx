import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export function EmptyState({ message = 'No items yet. Create your first one!' }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Inbox size={28} className="text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}
