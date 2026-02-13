"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ChevronRight, BookOpen, FileCode, Palette, Code2, 
  Terminal, Layers, Database, Server, ChevronDown, 
  Search, CheckCircle2, Circle, Copy, RotateCcw, Play 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

// Animation Variants
const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const fadeInLeft = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };
const staggerContainer = { visible: { transition: { staggerChildren: 0.1 } } };

const topics = [
  {
    id: "html",
    name: "HTML",
    icon: FileCode,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    lessons: [
      { id: "intro", title: "Introduction to HTML", content: "HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages.", note: "Every HTML document must start with a <!DOCTYPE html> declaration.", code: "<!DOCTYPE html>\n<html>\n<body>\n  <h1>Welcome to HTML</h1>\n  <p>Start your journey here.</p>\n</body>\n</html>" },
      { id: "elements", title: "HTML Elements", content: "An HTML element is defined by a start tag, some content, and an end tag.", note: "Elements like <br> are called empty elements and do not have an end tag.", code: "<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>" },
      { id: "headings", title: "HTML Headings", content: "HTML headings are defined with the <h1> to <h6> tags. <h1> defines the most important heading.", note: "Use headings for structure, not to make text BIG or bold.", code: "<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<h3>Heading 3</h3>" },
    ],
  },
  {
    id: "css",
    name: "CSS",
    icon: Palette,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    lessons: [
      { id: "intro", title: "Introduction to CSS", content: "CSS is the language we use to style an HTML document.", note: "CSS describes how HTML elements should be displayed.", code: "body {\n  background-color: lightblue;\n}\nh1 {\n  color: navy;\n  margin-left: 20px;\n}" },
    ],
  },
];

export default function LearnPageContent({ params }: { params: { topic: string } }) {
  const urlTopic = params.topic.toLowerCase();

  // 1. Navigation States
  const [activeTopicId, setActiveTopicId] = useState(urlTopic);
  const [activeLessonId, setActiveLessonId] = useState("intro");
  const [expandedTopic, setExpandedTopic] = useState(urlTopic);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Data Selection Logic
  const currentTopic = useMemo(() => 
    topics.find(t => t.id === activeTopicId) || topics[0], 
  [activeTopicId]);

  const currentLesson = useMemo(() => 
    currentTopic.lessons.find(l => l.id === activeLessonId) || currentTopic.lessons[0], 
  [currentTopic, activeLessonId]);
  
  // 3. Editor State (Synced to current lesson)
  const [code, setCode] = useState(currentLesson.code);
  useEffect(() => { 
    setCode(currentLesson.code); 
  }, [currentLesson]);

  // 4. Progress Logic
  const totalLessons = topics.reduce((acc, t) => acc + t.lessons.length, 0);
  const progress = 33; // Dynamic calculation would happen here based on user data

  // 5. Navigation Handlers
  const navigateLesson = (direction: 'next' | 'prev') => {
    const currentIndex = currentTopic.lessons.findIndex(l => l.id === activeLessonId);
    if (direction === 'next' && currentIndex < currentTopic.lessons.length - 1) {
      setActiveLessonId(currentTopic.lessons[currentIndex + 1].id);
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveLessonId(currentTopic.lessons[currentIndex - 1].id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <motion.aside 
          initial="hidden" animate="visible" variants={fadeInLeft}
          className={cn(
            "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 z-40", 
            sidebarOpen ? "w-72" : "w-0 md:w-16"
          )}
        >
          <div className="h-full flex flex-col w-72">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tutorials..." 
                  className="pl-9 bg-background" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-primary font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                {topics.map((topic) => (
                  <motion.div key={topic.id} variants={fadeInUp} className="mb-1">
                    <button 
                      onClick={() => setExpandedTopic(expandedTopic === topic.id ? "" : topic.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors", 
                        activeTopicId === topic.id ? "bg-primary/10 text-primary" : "hover:bg-accent"
                      )}
                    >
                      <div className={cn("p-2 rounded-lg", topic.bgColor)}>
                        <topic.icon className={cn("w-4 h-4", topic.color)} />
                      </div>
                      <span className="font-medium flex-1">{topic.name}</span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", expandedTopic === topic.id && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {expandedTopic === topic.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-6 pl-4 border-l border-border py-1 space-y-1">
                            {topic.lessons.map((lesson) => (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  setActiveTopicId(topic.id);
                                  setActiveLessonId(lesson.id);
                                }}
                                className={cn(
                                  "w-full flex items-center gap-2 py-2 px-3 text-sm rounded-lg transition-colors text-left", 
                                  activeLessonId === lesson.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent"
                                )}
                              >
                                {activeLessonId === lesson.id ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                {lesson.title}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.aside>

        {/* MAIN CONTENT AREA */}
        <main className={cn("flex-1 transition-all duration-300", sidebarOpen ? "ml-72" : "ml-0 md:ml-16")}>
          <div className="container max-w-6xl mx-auto px-6 py-8">
            
            {/* DYNAMIC BREADCRUMB */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link href="/learn" className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                <BookOpen className="w-4 h-4" /> <span>Learn</span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <button 
                onClick={() => setExpandedTopic(activeTopicId)}
                className="uppercase hover:text-primary transition-colors cursor-pointer"
              >
                {activeTopicId}
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{currentLesson.title}</span>
            </nav>

            {/* LESSON CONTENT */}
            <motion.div key={activeLessonId} initial="hidden" animate="visible" variants={fadeInUp}>
              <h1 className="text-4xl font-bold mb-4">{currentLesson.title}</h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {currentLesson.content}
              </p>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-8">
                <p className="text-sm">
                  <span className="font-semibold text-primary">💡 Note: </span> {currentLesson.note}
                </p>
              </div>

              {/* EDITOR & OUTPUT */}
              <div className="grid lg:grid-cols-2 gap-4 mb-12">
                <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                    <div className="flex items-center gap-2">
                       <Code2 className="w-4 h-4 text-muted-foreground" />
                       <span className="text-sm font-medium">index.html</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(code)}>
                      <Copy className="w-4 h-4 mr-2"/>Copy
                    </Button>
                  </div>
                  <textarea 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    className="w-full h-80 p-4 bg-transparent font-mono text-sm resize-none focus:outline-none scrollbar-thin" 
                    spellCheck={false} 
                  />
                </div>
                <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                  <div className="flex items-center px-4 py-3 bg-muted/50 border-b border-border">
                    <span className="text-sm font-medium">Live Output</span>
                  </div>
                  <iframe 
                    srcDoc={code} 
                    className="w-full h-80 bg-white border-none" 
                    title="output" 
                  />
                </div>
              </div>

              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center justify-between pt-8 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={() => navigateLesson('prev')} 
                  disabled={currentTopic.lessons.findIndex(l => l.id === activeLessonId) === 0}
                  className="gap-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                </Button>
                <Button 
                  variant="hero" 
                  onClick={() => navigateLesson('next')} 
                  disabled={currentTopic.lessons.findIndex(l => l.id === activeLessonId) === currentTopic.lessons.length - 1}
                  className="gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
          
          <div className={cn("mt-auto transition-all duration-300")}>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
