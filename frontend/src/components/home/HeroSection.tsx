import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Code2, BookOpen, Trophy, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-16 flex items-center justify-center overflow-hidden bg-background">
      
      {/* --- Background Effects --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-pulse-slow animation-delay-500 mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* GRID FIX: 
         1. Changed rgba alpha from 0.03 to 0.08 (8% opacity) for visibility on white.
         2. Added 'dark:opacity-40' so it's not too harsh in dark mode.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] dark:opacity-40" />

      {/* --- Main Content --- */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary fill-primary/10" />
            <span className="text-sm font-medium text-primary/90">Now with AI-powered learning paths</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
            <span className="block text-foreground">Learn. Practice.</span>
            <span className="block bg-gradient-to-r from-primary via-violet-600 to-blue-600 bg-clip-text text-transparent pb-2">
              Build. Get Hired.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up stagger-1 leading-relaxed">
            Master programming with interactive tutorials, hands-on coding challenges, 
            real-world projects, and industry-recognized certifications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto mb-20 animate-slide-up stagger-2">
            <Button asChild variant="hero" size="xl" className="shadow-xl shadow-primary/20">
              <Link href="/learn">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="xl" className="bg-transparent border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
              <Link href="/practice">
                <Play className="w-5 h-5 mr-2 text-primary" />
                Try Coding Playground
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 w-full max-w-3xl mx-auto animate-slide-up stagger-3 border-t border-border/50 pt-8">
            <div className="text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">500+</span>
                <span className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5">
                   <BookOpen className="w-4 h-4" /> Tutorials
                </span>
              </div>
            </div>
            
            <div className="text-center relative after:content-[''] after:absolute after:-left-4 after:top-1/2 after:-translate-y-1/2 after:h-12 after:w-[1px] after:bg-border/60">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">2k+</span>
                <span className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5">
                  <Code2 className="w-4 h-4" /> Challenges
                </span>
              </div>
            </div>

            <div className="text-center relative after:content-[''] after:absolute after:-left-4 after:top-1/2 after:-translate-y-1/2 after:h-12 after:w-[1px] after:bg-border/60">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">50k+</span>
                <span className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5">
                  <Trophy className="w-4 h-4" /> Learners
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Floating Elements --- */}
        <div className="hidden xl:block absolute left-4 top-1/3 animate-float duration-[7s]">
          <div className="relative rounded-xl overflow-hidden bg-[#1e1e2e] shadow-2xl border border-slate-800 w-72 rotate-[-6deg] hover:rotate-0 transition-transform duration-300">
            <div className="bg-[#2a2a3c] px-4 py-2 flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/80" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
               <div className="w-3 h-3 rounded-full bg-green-500/80" />
               <div className="ml-auto text-[10px] text-slate-400 font-mono">script.js</div>
            </div>
            <div className="p-4 font-mono text-xs text-slate-300 leading-relaxed">
              <div><span className="text-purple-400">function</span> <span className="text-blue-400">levelUp</span>() {"{"}</div>
              <div className="pl-4"><span className="text-purple-400">const</span> skills = [<span className="text-green-400">"React"</span>, <span className="text-green-400">"Node"</span>];</div>
              <div className="pl-4"><span className="text-purple-400">return</span> skills.<span className="text-blue-400">map</span>(s {`=>`} s + <span className="text-green-400">"++"</span>);</div>
              <div>{"}"}</div>
            </div>
          </div>
        </div>

        <div className="hidden xl:block absolute right-4 top-1/2 animate-float duration-[6s] delay-700">
          <div className="rounded-xl bg-background/95 backdrop-blur shadow-xl border border-border p-5 w-64 rotate-[6deg] hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4 border-b border-dashed border-border pb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Test Passed</div>
                <div className="text-xs text-muted-foreground">All systems go</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Performance</span>
                <span className="text-green-600 font-medium">98/100</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[98%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}