import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@learnstak.io');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
    navigate('/dashboard');
  };

  const inputClass = "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to Learnstak Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputClass} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
