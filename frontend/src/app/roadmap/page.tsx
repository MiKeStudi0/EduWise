"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
// 1. Import Variants to fix the type error
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Layout, Server, Layers, Terminal, ArrowRight, Code2, Database, Shield, Smartphone,
  ShieldCheck, Bot, BrainCircuit, HardDrive, Cpu, Blocks, Bug, Compass, PenTool,
  FileText, Gamepad2, GitBranch, Briefcase, Users, Megaphone, BarChart, LineChart,
  Search, X
} from 'lucide-react';
import { Input } from "@/components/ui/input"; 
import roadmapData from "@/json/roadmap.json"; 

const roadmapStyles: Record<string, { icon: React.ElementType; color: string; bg: string; gradient: string }> = {
  "frontend-development": { icon: Layout, color: "text-blue-500", bg: "bg-blue-500/10", gradient: "from-blue-500/20 to-cyan-500/20" },
  "backend-development": { icon: Server, color: "text-green-500", bg: "bg-green-500/10", gradient: "from-green-500/20 to-emerald-500/20" },
  "full-stack-development": { icon: Layers, color: "text-purple-500", bg: "bg-purple-500/10", gradient: "from-purple-500/20 to-pink-500/20" },
  "devops": { icon: Terminal, color: "text-orange-500", bg: "bg-orange-500/10", gradient: "from-orange-500/20 to-red-500/20" },
  "devsecops": { icon: ShieldCheck, color: "text-red-600", bg: "bg-red-600/10", gradient: "from-red-600/20 to-orange-600/20" },
  "data-analyst": { icon: BarChart, color: "text-yellow-500", bg: "bg-yellow-500/10", gradient: "from-yellow-500/20 to-amber-500/20" },
  "ai-engineer": { icon: Bot, color: "text-rose-500", bg: "bg-rose-500/10", gradient: "from-rose-500/20 to-pink-500/20" },
  "ai-data-scientist": { icon: BrainCircuit, color: "text-violet-500", bg: "bg-violet-500/10", gradient: "from-violet-500/20 to-purple-500/20" },
  "data-engineer": { icon: HardDrive, color: "text-cyan-500", bg: "bg-cyan-500/10", gradient: "from-cyan-500/20 to-blue-500/20" },
  "android-development": { icon: Smartphone, color: "text-emerald-500", bg: "bg-emerald-500/10", gradient: "from-emerald-500/20 to-teal-500/20" },
  "machine-learning-engineer": { icon: Cpu, color: "text-teal-500", bg: "bg-teal-500/10", gradient: "from-teal-500/20 to-emerald-500/20" },
  "postgresql-dba": { icon: Database, color: "text-sky-600", bg: "bg-sky-600/10", gradient: "from-sky-600/20 to-blue-600/20" },
  "blockchain-development": { icon: Blocks, color: "text-amber-500", bg: "bg-amber-500/10", gradient: "from-amber-500/20 to-yellow-500/20" },
  "qa-engineer": { icon: Bug, color: "text-lime-600", bg: "bg-lime-600/10", gradient: "from-lime-600/20 to-green-600/20" },
  "ios-development": { icon: Smartphone, color: "text-slate-500", bg: "bg-slate-500/10", gradient: "from-slate-500/20 to-gray-500/20" },
  "software-architect": { icon: Compass, color: "text-indigo-600", bg: "bg-indigo-600/10", gradient: "from-indigo-600/20 to-violet-600/20" },
  "cyber-security": { icon: Shield, color: "text-red-500", bg: "bg-red-500/10", gradient: "from-red-500/20 to-rose-500/20" },
  "ux-design": { icon: PenTool, color: "text-pink-500", bg: "bg-pink-500/10", gradient: "from-pink-500/20 to-rose-500/20" },
  "technical-writer": { icon: FileText, color: "text-gray-500", bg: "bg-gray-500/10", gradient: "from-gray-500/20 to-slate-500/20" },
  "game-developer": { icon: Gamepad2, color: "text-purple-600", bg: "bg-purple-600/10", gradient: "from-purple-600/20 to-indigo-600/20" },
  "server-side-game-developer": { icon: Gamepad2, color: "text-fuchsia-600", bg: "bg-fuchsia-600/10", gradient: "from-fuchsia-600/20 to-purple-600/20" },
  "mlops-engineer": { icon: GitBranch, color: "text-teal-600", bg: "bg-teal-600/10", gradient: "from-teal-600/20 to-cyan-600/20" },
  "product-manager": { icon: Briefcase, color: "text-blue-600", bg: "bg-blue-600/10", gradient: "from-blue-600/20 to-indigo-600/20" },
  "engineering-manager": { icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10", gradient: "from-indigo-500/20 to-blue-500/20" },
  "devrel-developer-relations": { icon: Megaphone, color: "text-orange-600", bg: "bg-orange-600/10", gradient: "from-orange-600/20 to-red-600/20" },
  "bi-analyst": { icon: LineChart, color: "text-yellow-600", bg: "bg-yellow-600/10", gradient: "from-yellow-600/20 to-orange-600/20" },
};

const defaultStyle = {
  icon: Code2,
  color: "text-indigo-500",
  bg: "bg-indigo-500/10",
  gradient: "from-indigo-500/20 to-violet-500/20"
};

// 2. Explicitly type the variants objects
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.4, 
      ease: "easeOut" 
    } 
  }
};

export default function RoadmapListingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoadmaps = useMemo(() => {
    const allRoadmaps = (roadmapData?.roadmap ?? []).filter((item) => item.is_active);
    
    if (!searchQuery) return allRoadmaps;

    return allRoadmaps.filter((item) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B0C10] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Background Tech Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] dark:opacity-40" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
      </div>

      <main className="relative z-10 flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium border rounded-full text-slate-500 border-slate-200 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-400 backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
              {filteredRoadmaps.length} Career Paths Available
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white"
            >
              Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Craft</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Professional, community-driven roadmaps to help you navigate the ever-changing landscape of software engineering.
            </motion.p>

            {/* --- SEARCH BAR --- */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-xl mx-auto"
            >
              <div className="relative group">
                <div className="relative flex items-center bg-white dark:bg-[#15161C] border border-slate-200 dark:border-slate-800 rounded-2xl 
                  shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
                  hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
                  focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50 
                  transition-all duration-300"
                >
                  <Search className="w-5 h-5 ml-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <Input 
                    type="text" 
                    placeholder="Search for a role (e.g., 'Frontend', 'DevOps')..." 
                    className="border-none bg-transparent h-14 px-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="p-2 mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Cards Grid */}
          <div className="min-h-[400px]">
            {filteredRoadmaps.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredRoadmaps.map((item) => {
                    const style = roadmapStyles[item.slug] ?? defaultStyle;
                    const Icon = style.icon;

                    return (
                      <motion.div 
                        layout
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.id} 
                        className="h-full group"
                      >
                        <Link href={`/roadmap/${item.slug}`} className="block h-full">
                          <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111217] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                            
                            {/* Hover Gradient Overlay */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${style.gradient} pointer-events-none`} />

                            <div className="relative p-6 flex flex-col h-full">
                              {/* Header: Icon & Decor */}
                              <div className="flex justify-between items-start mb-6">
                                <div className={`
                                  relative z-10 flex items-center justify-center w-12 h-12 rounded-xl 
                                  bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 
                                  ${style.color} shadow-sm group-hover:scale-110 transition-transform duration-300
                                `}>
                                  <Icon size={24} strokeWidth={2} />
                                </div>
                                <div className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 transition-colors">
                                   <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                </div>
                              </div>

                              {/* Text Content */}
                              <div className="flex flex-col flex-grow z-10">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>
                              </div>

                              {/* Footer Line */}
                              <div className="mt-6 h-1 w-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:w-full group-hover:bg-indigo-500/50 transition-all duration-500" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              // Empty State
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No roadmaps found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  We couldn't find any roadmaps matching "{searchQuery}". Try searching for something else like "React" or "Python".
                </p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                >
                  Clear search
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}