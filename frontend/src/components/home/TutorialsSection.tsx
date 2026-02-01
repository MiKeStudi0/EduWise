import Link from "next/link"; // Changed import
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const tutorials = [
  {
    slug: "html",
    title: "HTML",
    description: "Learn the building blocks of the web",
    color: "hsl(14, 77%, 52%)",
    lessons: 45,
    icon: "🌐",
  },
  {
    slug: "css",
    title: "CSS",
    description: "Style beautiful web pages",
    color: "hsl(207, 90%, 54%)",
    lessons: 52,
    icon: "🎨",
  },
  {
    slug: "javascript",
    title: "JavaScript",
    description: "Make your pages interactive",
    color: "hsl(50, 100%, 50%)",
    lessons: 78,
    icon: "⚡",
  },
  {
    slug: "python",
    title: "Python",
    description: "The language for everything",
    color: "hsl(210, 60%, 45%)",
    lessons: 65,
    icon: "🐍",
  },
  {
    slug: "react",
    title: "React",
    description: "Build modern user interfaces",
    color: "hsl(193, 95%, 68%)",
    lessons: 42,
    icon: "⚛️",
  },
  {
    slug: "nodejs",
    title: "Node.js",
    description: "JavaScript on the server",
    color: "hsl(118, 40%, 45%)",
    lessons: 38,
    icon: "🚀",
  },
];

export function TutorialsSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular Tutorials</h2>
            <p className="text-muted-foreground">Start learning with our most popular courses</p>
          </div>
          <Button asChild variant="ghost" className="group">
            <Link href="/learn">
              View all tutorials
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Tutorials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map((tutorial, index) => (
            <Link
              key={tutorial.slug}
              href={`/learn/${tutorial.slug}`}
              className="group relative p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  // Next.js handles inline styles safely on the server
                  style={{ backgroundColor: `${tutorial.color.replace(')', ', 0.2)')}` }}
                >
                  {tutorial.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {tutorial.title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{tutorial.description}</p>
                  <span className="text-xs text-muted-foreground">{tutorial.lessons} lessons</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}