import { ArrowRight, Clock, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Added Next.js Link

const paths = [
  {
    title: "Frontend Developer",
    description: "Master HTML, CSS, JavaScript, React, and modern frontend tooling",
    duration: "4-6 months",
    modules: 12,
    projects: 8,
    gradient: "from-blue-500 to-cyan-500",
    skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Next.js"],
  },
  {
    title: "Backend Developer",
    description: "Build scalable APIs with Node.js, databases, and cloud services",
    duration: "4-6 months",
    modules: 10,
    projects: 6,
    gradient: "from-green-500 to-emerald-500",
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "AWS"],
  },
  {
    title: "Full Stack Developer",
    description: "Complete end-to-end development from frontend to deployment",
    duration: "8-10 months",
    modules: 20,
    projects: 12,
    gradient: "from-purple-500 to-pink-500",
    skills: ["React", "Node.js", "Databases", "DevOps", "Testing"],
  },
  {
    title: "Data Science",
    description: "Analyze data, build ML models, and derive actionable insights",
    duration: "6-8 months",
    modules: 14,
    projects: 10,
    gradient: "from-orange-500 to-red-500",
    skills: ["Python", "Pandas", "ML/AI", "TensorFlow", "SQL"],
  },
];

export function PathsSection() {
  return (
    <section className="py-24 relative">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Career Paths & Certifications
            </h2>
            <p className="text-lg text-muted-foreground">
              Structured learning journeys to land your dream job
            </p>
          </div>
          
          {/* Refactored Button to use Next.js Link */}
          <Button asChild variant="outline" className="self-start sm:self-auto group">
            <Link href="/courses">
              View All Paths
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Paths Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {paths.map((path, index) => (
            <div
              key={path.title}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${path.gradient}`} />
              
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {path.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {path.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {path.duration}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    {path.modules} modules
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Trophy className="w-4 h-4" />
                    {path.projects} projects
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}