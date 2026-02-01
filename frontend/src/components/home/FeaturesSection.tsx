import { BookOpen, Code2, GraduationCap, Compass, CheckCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Tutorials",
    description: "Learn by doing with our hands-on tutorials. Write code directly in the browser and see results instantly.",
    color: "primary",
    highlights: ["Live code editor", "Instant feedback", "Step-by-step guides"],
  },
  {
    icon: Code2,
    title: "Practice Problems",
    description: "Sharpen your skills with 2000+ coding challenges. From easy to expert, tackle problems that matter.",
    color: "accent",
    highlights: ["Difficulty levels", "Multiple languages", "Real interview prep"],
  },
  {
    icon: GraduationCap,
    title: "Video Courses",
    description: "Deep dive into topics with expert-led video courses. Learn at your own pace, anywhere.",
    color: "warning",
    highlights: ["HD video lessons", "Downloadable resources", "Lifetime access"],
  },
  {
    icon: Compass,
    title: "Career Paths",
    description: "Follow structured roadmaps to become job-ready. Earn certificates that employers recognize.",
    color: "success",
    highlights: ["Guided learning", "Portfolio projects", "Industry certs"],
  },
];

// In Next.js, we keep this object outside the component to prevent re-creation on every render
const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/20",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--accent)/0.3)]",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/20",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--warning)/0.3)]",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--success)/0.3)]",
  },
};

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Why CodeForge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to become a developer
          </h2>
          <p className="text-muted-foreground">
            From your first line of code to landing your dream job, we've got you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            
            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative p-6 rounded-2xl border bg-card/50 transition-all duration-300 hover:bg-card",
                  colors.border,
                  colors.glow,
                  // We add the animation class here
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", colors.bg)}>
                  <Icon className={cn("w-6 h-6", colors.text)} />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={cn("w-4 h-4", colors.text)} />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}