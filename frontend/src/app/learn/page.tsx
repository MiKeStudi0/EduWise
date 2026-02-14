"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Code2, Palette, FileCode, Terminal, ArrowRight, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced Topic Data
const featuredTopics = [
  { 
    id: "html", 
    name: "HTML", 
    desc: "The structural foundation of the web.", 
    icon: FileCode, 
    color: "text-orange-500", 
    gradient: "from-orange-500/20 to-red-500/20",
    border: "group-hover:border-orange-500/30"
  },
  { 
    id: "css", 
    name: "CSS", 
    desc: "Master layout, animations, and design.", 
    icon: Palette, 
    color: "text-blue-500", 
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "group-hover:border-blue-500/30"
  },
  { 
    id: "javascript", 
    name: "JavaScript", 
    desc: "Add complex interactivity and logic.", 
    icon: Code2, 
    color: "text-yellow-500", 
    gradient: "from-yellow-500/20 to-amber-500/20",
    border: "group-hover:border-yellow-500/30"
  },
  { 
    id: "python", 
    name: "Python", 
    desc: "Data science, AI, and backend logic.", 
    icon: Terminal, 
    color: "text-green-500", 
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "group-hover:border-green-500/30"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function LearnPortal() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B0C10] font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      {/* --- Global Tech Grid Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] dark:opacity-40" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-indigo-500 opacity-10 blur-[120px]" />
      </div>

      <main className="relative z-10 flex-grow pt-32 pb-20">
        
        {/* --- Hero Section --- */}
        <section className="container mx-auto px-4 text-center mb-20">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Interactive Learning Platform</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white"
          >
            What do you want to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              learn today?
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Explore our library of interactive tutorials. From building your first 
            website to training AI models, we've got you covered.
          </motion.p>

          {/* --- Search Bar (Glass & Steel Style) --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-2xl mx-auto px-4"
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10" />
              
              <div className="relative flex items-center bg-white dark:bg-[#15161C] border border-slate-200 dark:border-slate-800 rounded-2xl 
                shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
                hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
                focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50 
                transition-all duration-300"
              >
                <Search className="w-5 h-5 ml-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  className="h-16 pl-4 pr-32 text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                  placeholder="Search e.g. 'HTML', 'Hooks', 'Databases'..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute right-2 top-2 bottom-2">
                  {search ? (
                    <Button variant="ghost" size="icon" onClick={() => setSearch("")} className="h-full w-12 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <X className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button className="h-full px-6 rounded-xl shadow-md shadow-indigo-500/20" variant="hero">
                      Search
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- Topics Grid --- */}
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Popular Topics</h2>
            <Link href="/courses" className="text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors">
              View all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredTopics.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map((topic) => (
              <motion.div key={topic.id} variants={itemVariants}>
                <Link href={`/learn/${topic.id}`} className="block h-full group">
                  <div className={`
                    h-full p-6 rounded-2xl border bg-white dark:bg-[#111217] transition-all duration-300
                    border-slate-200 dark:border-slate-800 ${topic.border}
                    shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] dark:shadow-none
                    hover:-translate-y-1 relative overflow-hidden
                  `}>
                    
                    {/* Hover Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${topic.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300`}>
                        <topic.icon className={`w-7 h-7 ${topic.color}`} />
                      </div>

                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {topic.name}
                      </h3>
                      
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                        {topic.desc}
                      </p>

                      <div className="flex items-center text-sm font-semibold text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                        Start Learning 
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}