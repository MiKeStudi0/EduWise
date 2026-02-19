import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  delay?: number;
}

export function KPICard({ title, value, icon: Icon, trend, delay = 0 }: KPICardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const start = Date.now();
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border rounded-xl p-5 hover:scale-[1.01] transition-transform"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <div className="text-2xl font-bold text-foreground">{count.toLocaleString()}</div>
      {trend && <span className="text-xs text-success mt-1 block">{trend}</span>}
    </motion.div>
  );
}
