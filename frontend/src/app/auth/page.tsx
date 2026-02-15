"use client";

import { useState } from "react";
// Added Variants type for TypeScript
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { 
  Mail, Lock, User, ArrowRight, Github, Chrome, 
  Sparkles, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar"; 
import { cn } from "@/lib/utils";

// --- ANIMATION CONFIGURATION ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

// Floating animation for the left side cards
const floatVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  floating: {
    y: [0, -15, 0],
    rotate: [0, 1, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B0C10] font-sans selection:bg-indigo-500/30">
      
      <Navbar />

      <main className="flex-1 flex pt-16"> 
        
        {/* --- LEFT SIDE: Visuals --- */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12 border-r border-slate-200 dark:border-slate-800">
          
          {/* 1. Base Background */}
          <div className="absolute inset-0 bg-slate-50 dark:bg-[#0B0C10]" />

          {/* 2. Unified Grid Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-100 dark:opacity-40" />
          
          {/* 3. Purple Lighting Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-lg">
            {/* Added container variants to stagger text */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>Join the Elite</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                Code Your Future. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">
                  Build the Impossible.
                </span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Join 50,000+ developers mastering the modern web stack. Get access to premium roadmaps and challenges.
              </motion.p>
            </motion.div>

            {/* 3D Floating Elements */}
            <div className="relative h-64 w-full">
               {/* Applied floatVariants for continuous movement */}
               <motion.div 
                 variants={floatVariants}
                 initial="hidden"
                 animate={["visible", "floating"]}
                 className="absolute top-0 left-0 bg-white/90 dark:bg-[#111217] backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xl dark:shadow-2xl w-64 rotate-[-6deg] hover:rotate-0 transition-transform duration-500"
               >
                 <div className="flex items-center gap-2 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                 </div>
                 <div className="space-y-2 font-mono text-xs">
                   <div className="text-purple-600 dark:text-purple-400">
                     const <span className="text-blue-600 dark:text-blue-400">user</span> = <span className="text-amber-600 dark:text-yellow-300">await</span> login();
                   </div>
                   <div className="text-slate-400 dark:text-slate-500">// Welcome back</div>
                 </div>
               </motion.div>

               <motion.div 
                 variants={floatVariants}
                 initial="hidden"
                 animate={["visible", "floating"]}
                 transition={{ delay: 0.5 }} // Stagger the float start
                 className="absolute bottom-4 right-0 bg-white/80 dark:bg-[#15161C] backdrop-blur-xl border border-white/50 dark:border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center gap-4 w-60 rotate-[3deg] hover:rotate-0 transition-transform duration-500"
               >
                 <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                   <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <div>
                   <div className="text-sm font-bold text-slate-900 dark:text-white">Access Granted</div>
                   <div className="text-xs text-slate-500 dark:text-slate-400">Premium unlocked</div>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Form --- */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
          
          {/* 1. Base Background */}
          <div className="absolute inset-0 bg-slate-50 dark:bg-[#0B0C10]" />

          {/* 2. Unified Grid Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-100 dark:opacity-40 pointer-events-none" />
          
          {/* 3. Subtle Center Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Added AnimatePresence to container for page transitions if needed, using motion.div for entry */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[400px] z-10 relative"
          >
            
            {/* Header */}
            <div className="mb-10 text-center lg:text-left">
              <motion.h2 
                variants={itemVariants}
                key={isLogin ? "login-h" : "reg-h"}
                className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
              >
                {isLogin ? "Welcome back" : "Create an account"}
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                key={isLogin ? "login-p" : "reg-p"}
                className="text-slate-500 dark:text-slate-400"
              >
                {isLogin ? "Enter your details to access your learning path." : "Start your 7-day free trial. No credit card required."}
              </motion.p>
            </div>

            {/* Form Fields */}
            <form className="space-y-5">
              <AnimatePresence mode="popLayout">
                
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <motion.div variants={itemVariants} className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10" />
                      <Input 
                        type="text" 
                        placeholder="Full Name" 
                        className="h-12 pl-12 bg-white dark:bg-[#15161C] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                      />
                    </motion.div>
                  </motion.div>
                )}

                <motion.div layout variants={itemVariants}>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10" />
                    <Input 
                      type="email" 
                      placeholder="Email Address" 
                      className="h-12 pl-12 bg-white dark:bg-[#15161C] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                  </div>
                </motion.div>

                <motion.div layout variants={itemVariants}>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10" />
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      className="h-12 pl-12 bg-white dark:bg-[#15161C] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                  </div>
                </motion.div>

                {isLogin && (
                  <motion.div 
                    variants={itemVariants}
                    className="flex justify-end pt-1"
                  >
                    <Link href="/forgot-password">
                      <span className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                        Forgot Password?
                      </span>
                    </Link>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full h-12 shadow-xl shadow-indigo-500/20 text-base font-semibold group mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase font-medium">
                <span className="bg-slate-50 dark:bg-[#0B0C10] px-4 text-slate-500 dark:text-slate-400">Or continue with</span>
              </div>
            </motion.div>

            {/* Social Login Buttons */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 bg-white dark:bg-[#15161C] border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-[1.02] transition-transform">
                <Chrome className="w-5 h-5 mr-2 text-slate-900 dark:text-white" />
                Google
              </Button>
              <Button variant="outline" className="h-12 bg-white dark:bg-[#15161C] border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-[1.02] transition-transform">
                <Github className="w-5 h-5 mr-2 text-slate-900 dark:text-white" />
                GitHub
              </Button>
            </motion.div>

            {/* Switch Mode Link */}
            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </motion.div>

            {/* Footer Text */}
            <motion.p variants={itemVariants} className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</Link> and{" "}
              <Link href="/privacy" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</Link>.
            </motion.p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}