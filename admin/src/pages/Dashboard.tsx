import { useApp } from '@/contexts/AppContext';
import { KPICard } from '@/components/shared/KPICard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Users, BookOpen, CreditCard, Layers } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartData } from '@/data/mockData';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { users, technologies, lessons, subscriptions } = useApp();

  const activeContent = lessons.items.filter(l => l.status === 'active').length;
  const inactiveContent = lessons.items.filter(l => l.status === 'inactive').length;
  const pieData = [
    { name: 'Active', value: activeContent || 1 },
    { name: 'Inactive', value: inactiveContent || 1 },
  ];

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '12px',
    fontSize: '14px',
    padding: '8px 12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    color: 'hsl(var(--foreground))',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Users" value={users.items.length} icon={Users} trend="+12% this month" delay={0} />
        <KPICard title="Active Subs" value={subscriptions.items.filter(s => s.status === 'active').length} icon={CreditCard} trend="+5% this month" delay={0.05} />
        <KPICard title="Total Lessons" value={lessons.items.length} icon={BookOpen} trend="+8 this week" delay={0.1} />
        <KPICard title="Technologies" value={technologies.items.length} icon={Layers} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border/50 shadow-sm rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" tickLine={false} axisLine={false} dy={10} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-border/50 shadow-sm rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Lessons per Technology</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.lessonsPerTech}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" tickLine={false} axisLine={false} dy={10} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--muted)/0.2)' }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border/50 shadow-sm rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Content Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={14} fontWeight={500}>
                <Cell fill="hsl(var(--success))" strokeWidth={0} />
                <Cell fill="hsl(var(--muted))" strokeWidth={0} />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-border/50 shadow-sm rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Recent Users</h3>
          <div className="space-y-2">
            {users.items.slice(-5).reverse().map(user => (
              <div key={user.id} className="flex items-center justify-between py-3 px-2 hover:bg-accent/50 rounded-lg transition-colors border-b border-border/40 last:border-0">
                <div>
                  <p className="text-base font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <StatusBadge status={user.status} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
