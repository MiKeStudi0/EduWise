"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ChevronRight, BookOpen, FileCode, Palette, Code2, 
  Terminal, Layers, Database, Server, ChevronDown, 
  Search, CheckCircle2, Circle, Copy, RotateCcw, Play,
  Lightbulb, AlertTriangle, XCircle, CheckCircle, Zap,
  MonitorPlay, StickyNote, CornerDownRight,
  BrainCircuit,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { topics } from "./Topics";

// --- Data Structure (Unchanged) ---
// const topics = [
//   {
//     id: "html",
//     name: "HTML",
//     icon: FileCode,
//     color: "text-orange-500",
//     bgColor: "bg-orange-500/10",
//     lessons: [
//       { 
//         id: "intro", 
//         title: "Introduction to HTML", 
//         description: "HTML (HyperText Markup Language) is the skeleton of every website. It tells the browser what content is on the page—headings, paragraphs, images, and links.",
//         videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE", 
//         problem: "Computers need a structured way to understand text, images, and layout. Without HTML, a browser would just see a blob of unformatted text.",
//         mentalModel: "Think of HTML like the frame of a house. It defines the rooms (sections) and structure, but it doesn't decide the paint color (CSS) or how the lights turn on (JavaScript).",
//         whenToUse: ["Structuring web content", "Creating forms", "Embedding images/video"],
//         whenNotToUse: ["Styling the page (use CSS)", "Complex logic (use JS)"],
//         syntax: "<tagname>Content goes here...</tagname>",
//         code: `<!DOCTYPE html>
// <html>
// <head>
//   <title>My First Page</title>
// </head>
// <body>
//   <h1>Hello World</h1>
//   <p>This is my first website.</p>
// </body>
// </html>`,
//         subtopics: [
//             {
//                 title: "The Anatomy of an Element",
//                 content: "An HTML element usually consists of a start tag, content, and an end tag.",
//                 example: "<h1>This is a Heading</h1>",
//                 tip: "Tags are case-insensitive, but it's best practice to use lowercase (e.g., <div> not <DIV>)."
//             },
//             {
//                 title: "Nesting Elements",
//                 content: "Elements can contain other elements. This is called nesting.",
//                 example: "<div><p>I am inside a div!</p></div>",
//                 tip: "Always close inner tags before closing outer tags. Think of them like Russian nesting dolls."
//             }
//         ],
//         commonMistakes: [
//             "Forgetting the end tag (e.g., leaving a <p> open).",
//             "Nesting block elements inside inline elements incorrectly."
//         ],
//         bonusTip: "Use semantic tags like <article> and <section> instead of just <div> for better SEO and accessibility."
//       },
//     ],
//   },
//   {
//     id: "css",
//     name: "CSS",
//     icon: Palette,
//     color: "text-blue-500",
//     bgColor: "bg-blue-500/10",
//     lessons: [
//       { 
//         id: "intro", 
//         title: "Introduction to CSS", 
//         description: "CSS (Cascading Style Sheets) controls how HTML elements are displayed.",
//         videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
//         problem: "HTML is ugly by default. CSS solves the problem of design, layout, and visual hierarchy.",
//         mentalModel: "If HTML is the skeleton, CSS is the skin, clothes, and makeup.",
//         whenToUse: ["Changing colors/fonts", "Layouts (Grid/Flexbox)", "Responsive design"],
//         whenNotToUse: ["Defining page structure (use HTML)", "Handling data logic (use JS)"],
//         syntax: "selector { property: value; }",
//         code: `body {
//   font-family: sans-serif;
//   background-color: #f0f0f0;
// }
// h1 {
//   color: navy;
//   text-align: center;
// }`,
//         subtopics: [],
//         commonMistakes: [" forgetting the semi-colon ; at the end of a line."],
//         bonusTip: "Use CSS Variables (--primary-color) to make theme changes easy."
//       },
//     ],
//   },
// ];

// --- Animation Variants ---
const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const fadeInLeft = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

export default function LearnPageContent({ topic }: { topic: string }) {
  const urlTopic = topic.toLowerCase();
  const initialTopicId = topics.some((item) => item.id === urlTopic) ? urlTopic : topics[0].id;

  const [activeTopicId, setActiveTopicId] = useState(initialTopicId);
  const [activeLessonId, setActiveLessonId] = useState("intro");
  const [expandedTopic, setExpandedTopic] = useState(initialTopicId);
  
  // Responsive Sidebar Logic
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const currentTopic = useMemo(() => topics.find(t => t.id === activeTopicId) || topics[0], [activeTopicId]);
  const currentLesson = useMemo(() => currentTopic.lessons.find(l => l.id === activeLessonId) || currentTopic.lessons[0], [currentTopic, activeLessonId]);
  
  const [code, setCode] = useState(currentLesson.code);
  useEffect(() => { setCode(currentLesson.code); }, [currentLesson]);

  const progress = 33; 

  const navigateLesson = (direction: 'next' | 'prev') => {
    const currentIndex = currentTopic.lessons.findIndex(l => l.id === activeLessonId);
    if (direction === 'next' && currentIndex < currentTopic.lessons.length - 1) {
      setActiveLessonId(currentTopic.lessons[currentIndex + 1].id);
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveLessonId(currentTopic.lessons[currentIndex - 1].id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-[#0B0C10]">
      <div className="flex flex-1 ">
        
        {/* --- MOBILE OVERLAY (Closes sidebar when clicked) --- */}
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* --- SIDEBAR --- */}
        <motion.aside 
          className={cn(
            "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-[#111217] border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 z-50 lg:z-40 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]", 
            "w-80", // Fixed width
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:border-r-0" // Slide out on mobile, collapse on desktop
          )}
        >
          <div className="h-full flex flex-col w-80">
            {/* Search */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Filter topics..." 
                  className="pl-9 bg-slate-100 dark:bg-slate-900/50 border-transparent focus:bg-white dark:focus:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all shadow-none" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Mobile Close Button */}
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden ml-2">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Progress */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Course Progress</span>
                <Badge variant="secondary" className="text-xs font-bold text-primary bg-primary/10 border-primary/20">{progress}%</Badge>
              </div>
              <Progress value={progress} className="h-1.5 bg-slate-200 dark:bg-slate-800" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500" />
            </div>

            {/* Topics List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {topics.map((topic) => (
                <div key={topic.id} className="mb-2">
                  <button 
                    onClick={() => setExpandedTopic(expandedTopic === topic.id ? "" : topic.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group border border-transparent", 
                      activeTopicId === topic.id 
                        ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm shadow-slate-200/50 dark:shadow-none" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110 shadow-sm", topic.bgColor)}>
                      <topic.icon className={cn("w-4 h-4", topic.color)} />
                    </div>
                    <span className="font-semibold text-sm flex-1 text-slate-700 dark:text-slate-200">{topic.name}</span>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", expandedTopic === topic.id && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedTopic === topic.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-5 pl-4 border-l-2 border-slate-200 dark:border-slate-800 my-2 space-y-0.5">
                          {topic.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => { 
                                setActiveTopicId(topic.id); 
                                setActiveLessonId(lesson.id);
                                if(isMobile) setSidebarOpen(false); // Auto close on mobile click
                              }}
                              className={cn(
                                "w-full flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-all text-left relative overflow-hidden", 
                                activeLessonId === lesson.id 
                                  ? "bg-primary/10 text-primary font-medium" 
                                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                              )}
                            >
                              {activeLessonId === lesson.id ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <Circle className="w-3.5 h-3.5 shrink-0 opacity-40" />}
                              <span className="line-clamp-1">{lesson.title}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* --- MAIN CONTENT --- */}
        <main 
          className={cn(
            "flex-1 transition-all duration-300 min-w-0 bg-slate-50/50 dark:bg-[#0B0C10] relative flex flex-col", 
            sidebarOpen && !isMobile ? "lg:ml-80" : "ml-0" // Only add margin on desktop
          )}
        >
          
          {/* BACKGROUND PATTERN */}
          <div className="fixed inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

          {/* STICKY HEADER */}
          <div className="sticky top-0 z-30 w-full bg-slate-50/95 dark:bg-[#0B0C10]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center gap-4 shadow-sm">
             <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="shrink-0 hover:bg-white dark:hover:bg-slate-800">
                {sidebarOpen ? <ChevronRight className="w-5 h-5 text-slate-500 rotate-180" /> : <Menu className="w-5 h-5 text-slate-500" />}
             </Button>
             <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
             <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 overflow-hidden whitespace-nowrap mask-linear-fade">
                <span className="font-semibold text-primary hidden md:inline">{currentTopic.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-300 hidden md:inline" />
                <span className="text-slate-900 dark:text-white font-medium truncate">{currentLesson.title}</span>
             </nav>
          </div>

          <div className="container max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12 md:space-y-16 relative z-10 flex-1">
            
            {/* 1. TITLE & DESCRIPTION */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  {currentLesson.title}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                  {currentLesson.description}
                </p>
              </div>

              {/* 2. PROBLEM & MENTAL MODEL CARDS - Stack on mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 md:p-6 rounded-2xl bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-orange-600 dark:text-orange-400 font-bold uppercase text-xs tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> The Problem
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                    {currentLesson.problem}
                  </p>
                </div>
                <div className="p-5 md:p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs tracking-wider">
                    <BrainCircuit className="w-4 h-4" /> Mental Model
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                    {currentLesson.mentalModel}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 3. VIDEO */}
            {currentLesson.videoUrl && (
              <motion.div variants={fadeInUp} className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 bg-black aspect-video relative group">
                <iframe 
                  src={currentLesson.videoUrl} 
                  className="w-full h-full" 
                  title="Lesson Video" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                />
              </motion.div>
            )}

            {/* 4. USE CASES - Stack on mobile */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> When to use
                </h3>
                <ul className="space-y-3">
                  {currentLesson.whenToUse?.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 text-sm md:text-base">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
                  <XCircle className="w-5 h-5 text-rose-500" /> When NOT to use
                </h3>
                <ul className="space-y-3">
                  {currentLesson.whenNotToUse?.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400 p-3 rounded-lg bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 text-sm md:text-base">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* 5. SYNTAX & CODE PLAYGROUND */}
            <motion.div variants={fadeInUp} className="space-y-4">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                    <Terminal className="w-6 h-6 text-primary" /> Interactive Playground
                  </h3>
                  <Badge variant="outline" className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 w-fit">
                    syntax: {currentLesson.syntax}
                  </Badge>
               </div>
               
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 bg-[#1e1e2e]">
                  {/* Editor */}
                  <div className="flex flex-col h-[350px] md:h-[500px] border-b xl:border-b-0 xl:border-r border-white/5 relative group">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2a2a3c] border-b border-black/20">
                       <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/50" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                          <div className="w-3 h-3 rounded-full bg-green-500/50" />
                       </div>
                       <span className="text-xs font-mono text-slate-400 absolute left-1/2 -translate-x-1/2">index.html</span>
                       <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-400 hover:text-white hover:bg-white/10" onClick={() => navigator.clipboard.writeText(code)}>
                          <Copy className="w-3 h-3 mr-1"/> Copy
                       </Button>
                    </div>
                    <textarea 
                      value={code} 
                      onChange={(e) => setCode(e.target.value)} 
                      className="flex-1 w-full p-4 md:p-6 bg-[#1e1e2e] text-slate-300 font-mono text-sm resize-none focus:outline-none leading-relaxed selection:bg-indigo-500/30" 
                      spellCheck={false} 
                    />
                  </div>

                  {/* Preview */}
                  <div className="flex flex-col h-[350px] md:h-[500px] bg-white border-l border-slate-200 dark:border-transparent">
                    <div className="flex items-center px-4 py-2 bg-slate-50 border-b border-slate-200">
                       <MonitorPlay className="w-3 h-3 text-slate-400 mr-2" />
                       <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Preview</span>
                    </div>
                    <iframe srcDoc={code} className="flex-1 w-full border-none" title="output" />
                  </div>
               </div>
            </motion.div>

            {/* 6. SUBTOPICS */}
            <div className="space-y-12">
               {currentLesson.subtopics?.map((sub, idx) => (
                 <motion.div key={idx} variants={fadeInUp} className="relative pl-6 md:pl-8 border-l-2 border-slate-200 dark:border-slate-800">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-100 dark:border-indigo-900" >
                        <span className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">{sub.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{sub.content}</p>
                    
                    {sub.example && (
                      <div className="rounded-xl bg-slate-900 dark:bg-black p-4 md:p-5 font-mono text-xs md:text-sm text-emerald-400 border border-slate-800 shadow-inner mb-6 overflow-x-auto">
                         {sub.example}
                      </div>
                    )}

                    {sub.tip && (
                      <div className="flex flex-col md:flex-row gap-4 p-5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-900 dark:text-blue-100 text-sm">
                         <Zap className="w-5 h-5 shrink-0 text-blue-500" />
                         <div>
                            <strong className="block mb-1 font-semibold text-blue-700 dark:text-blue-300">Pro Tip</strong>
                            {sub.tip}
                         </div>
                      </div>
                    )}
                 </motion.div>
               ))}
            </div>

            {/* 7. COMMON MISTAKES & BONUS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <motion.div variants={fadeInUp} className="p-6 rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/5">
                  <h3 className="font-bold text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Common Mistakes
                  </h3>
                  <ul className="space-y-3">
                    {currentLesson.commonMistakes?.map((mistake, i) => (
                      <li key={i} className="flex gap-3 text-sm text-rose-900 dark:text-rose-200/80">
                         <CornerDownRight className="w-4 h-4 shrink-0 opacity-50 mt-0.5" /> {mistake}
                      </li>
                    ))}
                  </ul>
               </motion.div>

               <motion.div variants={fadeInUp} className="p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Lightbulb className="w-24 h-24 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Bonus Tip
                  </h3>
                  <p className="text-sm text-amber-900 dark:text-amber-200/80 leading-relaxed relative z-10">
                    {currentLesson.bonusTip}
                  </p>
               </motion.div>
            </div>

            {/* NAVIGATOR FOOTER */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-12 border-t border-slate-200 dark:border-slate-800">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigateLesson('prev')} 
                  disabled={currentTopic.lessons.findIndex(l => l.id === activeLessonId) === 0}
                  className="group w-full md:w-auto"
                >
                  <ChevronRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform text-slate-400 group-hover:text-foreground" /> 
                  <span className="text-slate-600 dark:text-slate-300 group-hover:text-foreground">Previous Lesson</span>
                </Button>
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => navigateLesson('next')} 
                  disabled={currentTopic.lessons.findIndex(l => l.id === activeLessonId) === currentTopic.lessons.length - 1}
                  className="group shadow-xl shadow-primary/20 w-full md:w-auto"
                >
                  Next Lesson <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}