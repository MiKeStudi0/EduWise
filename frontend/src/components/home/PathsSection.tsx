import Link from "next/link"; // Replaced react-router-dom
import { ArrowRight, Clock, BookOpen, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const paths = [
  {
    slug: "frontend",
    title: "Frontend Developer",
    description: "Master HTML, CSS, JavaScript, and React to build modern web applications",
    duration: "3-4 months",
    modules: 12,
    projects: 5,
    color: "hsl(193, 95%, 68%)",
    icon: "🎨",
    progress: 35,
  },
  {
    slug: "backend",
    title: "Backend Developer",
    description: "Learn Node.js, databases, APIs, and server architecture",
    duration: "4-5 months",
    modules: 15,
    projects: 6,
    color: "hsl(118, 40%, 45%)",
    icon: "⚙️",
    progress: 0,
  },
  {
    slug: "fullstack",
    title: "Full Stack Developer",
    description: "Complete path covering frontend, backend, and deployment",
    duration: "6-8 months",
    modules: 24,
    projects: 8,
    color: "hsl(239, 84%, 67%)",
    icon: "🚀",
    progress: 0,
  },
  {
    slug: "datascience",
    title: "Data Science",
    description: "Python, statistics, machine learning, and data visualization",
    duration: "5-6 months",
    modules: 18,
    projects: 7,
    color: "hsl(280, 70%, 55%)",
    icon: "📊",
    progress: 0,
  },
];

export function PathsSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Career Paths</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Structured learning paths to your dream job
          </h2>
          <p className="text-muted-foreground">
            Follow our guided roadmaps, complete real projects, and earn industry-recognized certificates.
          </p>
        </div>

        {/* Paths Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {paths.map((path, index) => (
            <Link
              key={path.slug}
              href={`/paths/${path.slug}`}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden"
            >
              {/* Progress indicator for started paths */}
              {path.progress > 0 && (
                <div className="absolute top-0 left-0 right-0 h-1">
                  <div 
                    className="h-full gradient-bg"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              )}

              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: `${path.color.replace(')', ', 0.2)')}` }}
                >
                  {path.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {path.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      {path.modules} modules
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Award className="w-4 h-4" />
                      {path.projects} projects
                    </div>
                  </div>

                  {path.progress > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary font-medium">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild variant="hero" size="lg">
            <Link href="/paths">
              Explore all paths
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}