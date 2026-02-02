import { BookOpen, Code2, GraduationCap, Briefcase, Brain, Users, Zap, GitBranch } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Documentation",
    description: "Learn with live code examples and instant feedback. Modern tutorials that adapt to your pace.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Code2,
    title: "Coding Challenges",
    description: "Master algorithms and data structures with 50,000+ practice problems across all difficulty levels.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: GraduationCap,
    title: "Video Courses",
    description: "Premium video content from industry experts. Learn at your own pace with downloadable resources.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Briefcase,
    title: "Career Paths",
    description: "Structured learning journeys from beginner to job-ready. Earn verified, shareable certificates.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Personalized roadmaps and adaptive recommendations based on your skills and goals.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: GitBranch,
    title: "Real Projects",
    description: "Build portfolio-worthy projects with Git integration and real-world development workflows.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with peers, get code reviews, and collaborate in real-time pair programming sessions.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Zap,
    title: "Interview Prep",
    description: "DSA practice, mock interviews, and timed assessments to ace your technical interviews.",
    color: "from-amber-500 to-orange-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to become a{" "}
            <span className="gradient-text">better developer</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A unified platform that combines the best of documentation, practice, 
            courses, and career development.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient glow on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}