"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  Play, 
  Lock, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  FileCode,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PathDetailPage({ params }: { params: { slug: string } }) {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const title = params.slug.charAt(0).toUpperCase() + params.slug.slice(1) + " Developer";

  const modules = [
    {
      title: "Foundations & Environment Setup",
      duration: "2 weeks",
      lessons: 8,
      status: "completed",
      topics: ["Terminal Basics", "Git & GitHub", "Package Managers", "Editor Setup"]
    },
    {
      title: "Advanced UI Patterns",
      duration: "3 weeks",
      lessons: 12,
      status: "current",
      topics: ["Responsive Design", "CSS Grid & Flexbox", "Accessibility", "Tailwind CSS"]
    },
    {
      title: "State Management & APIs",
      duration: "4 weeks",
      lessons: 15,
      status: "locked",
      topics: ["React Hooks", "Context API", "TanStack Query", "REST Integration"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Path Header */}
        <section className="border-b border-border bg-card/50 py-12">
          <div className="container mx-auto px-4">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/paths">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Paths
              </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 16 Weeks</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 45 Lessons</span>
                  <span className="flex items-center gap-1"><FileCode className="w-4 h-4" /> 5 Projects</span>
                </div>
              </div>
              <div className="w-full md:w-72">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-bold text-primary">35%</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8">Curriculum Roadmap</h2>
            
            <div className="space-y-4">
              {modules.map((mod, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "rounded-xl border transition-all overflow-hidden",
                    mod.status === "current" ? "border-primary/50 ring-1 ring-primary/20 shadow-lg" : "border-border"
                  )}
                >
                  <button 
                    onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 bg-card hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {mod.status === "completed" ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : mod.status === "current" ? (
                        <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        </div>
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div className="text-left">
                        <h3 className="font-semibold">{mod.title}</h3>
                        <p className="text-xs text-muted-foreground">{mod.duration} • {mod.lessons} Lessons</p>
                      </div>
                    </div>
                    <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", expandedModule === idx && "rotate-180")} />
                  </button>

                  {expandedModule === idx && (
                    <div className="p-5 bg-background/50 border-t border-border animate-fade-in">
                      <div className="grid sm:grid-cols-2 gap-3">
                        {mod.topics.map((topic) => (
                          <div key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                            {topic}
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-6" variant={mod.status === "locked" ? "outline" : "default"} disabled={mod.status === "locked"}>
                        {mod.status === "completed" ? "Review Module" : mod.status === "current" ? "Continue Learning" : "Locked"}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}