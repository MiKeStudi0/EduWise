import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await register(name, email, password);
    setLoading(false);
    toast({ title: 'Account created!', description: 'You can now sign in.' });
    navigate('/login');
  };

  const inputClass = "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-muted-foreground text-sm mt-1">Get started with Learnstak</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputClass} placeholder="Your name" />
          </div>
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
            Create Account
          </button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
