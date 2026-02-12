
import Link from "next/link"; // Changed to next/link
import { ArrowRight, Play, Sparkles, Code2, BookOpen, Trophy } from "lucide-react";
import { Button } from "../ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero">
      {/* Background Effects - No changes needed, they use your globals.css animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Now with AI-powered learning paths</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="block">Learn. Practice.</span>
            <span className="block gradient-text">Build. Get Hired.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up stagger-1">
            Master programming with interactive tutorials, hands-on coding challenges, 
            real-world projects, and industry-recognized certifications.
          </p>

          {/* CTA Buttons - Using Next.js Link and 'href' */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up stagger-2">
            <Button asChild variant="hero" size="xl">
              <Link href="/learn">
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link href="/practice">
                <Play className="w-5 h-5" />
                Try Coding Playground
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up stagger-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-2xl sm:text-3xl font-bold">500+</span>
              </div>
              <p className="text-sm text-muted-foreground">Tutorials</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Code2 className="w-5 h-5 text-accent" />
                <span className="text-2xl sm:text-3xl font-bold">2,000+</span>
              </div>
              <p className="text-sm text-muted-foreground">Challenges</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-warning" />
                <span className="text-2xl sm:text-3xl font-bold">50K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Learners</p>
            </div>
          </div>
        </div>

        {/* Floating Code Cards */}
        <div className="hidden lg:block absolute left-8 top-1/3 animate-float">
          <div className="glass-card rounded-2xl p-4 w-64 rotate-[-6deg]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-warning/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
            </div>
            <pre className="text-xs font-mono text-muted-foreground">
              <code>{`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`}</code>
            </pre>
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-1/2 animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="glass-card rounded-2xl p-4 w-56 rotate-[6deg]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">All tests passed</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded bg-success/20" />
              <div className="h-2 w-3/4 rounded bg-success/20" />
              <div className="h-2 w-5/6 rounded bg-success/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}