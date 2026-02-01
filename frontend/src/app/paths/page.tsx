import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  BookOpen, 
  Award, 
  ChevronRight,
  CheckCircle,
  Users,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const paths = [
  {
    slug: "frontend",
    title: "Frontend Developer",
    description: "Master HTML, CSS, JavaScript, and React to build modern, responsive web applications. Learn state management, testing, and deployment.",
    duration: "3-4 months",
    modules: 12,
    projects: 5,
    learners: "12.5K",
    rating: 4.9,
    color: "hsl(193, 95%, 68%)",
    icon: "🎨",
    progress: 35,
    skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS"],
    outcomes: [
      "Build responsive websites",
      "Create React applications",
      "Master modern CSS techniques",
      "Deploy to production",
    ],
  },
  {
    slug: "backend",
    title: "Backend Developer",
    description: "Learn Node.js, databases, REST APIs, and server architecture. Build scalable, secure backend systems.",
    duration: "4-5 months",
    modules: 15,
    projects: 6,
    learners: "8.2K",
    rating: 4.8,
    color: "hsl(118, 40%, 45%)",
    icon: "⚙️",
    progress: 0,
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs"],
    outcomes: [
      "Design database schemas",
      "Build REST APIs",
      "Implement authentication",
      "Handle scaling",
    ],
  },
  {
    slug: "fullstack",
    title: "Full Stack Developer",
    description: "Complete path covering frontend, backend, databases, and deployment. Become a versatile developer.",
    duration: "6-8 months",
    modules: 24,
    projects: 8,
    learners: "15.8K",
    rating: 4.9,
    color: "hsl(239, 84%, 67%)",
    icon: "🚀",
    progress: 0,
    skills: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
    outcomes: [
      "Build complete web apps",
      "Design system architecture",
      "Deploy with Docker",
      "Optimize performance",
    ],
  },
  {
    slug: "datascience",
    title: "Data Science",
    description: "Python, statistics, machine learning, and data visualization. Transform data into insights.",
    duration: "5-6 months",
    modules: 18,
    projects: 7,
    learners: "9.4K",
    rating: 4.7,
    color: "hsl(280, 70%, 55%)",
    icon: "📊",
    progress: 0,
    skills: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow"],
    outcomes: [
      "Analyze large datasets",
      "Build ML models",
      "Create visualizations",
      "Make predictions",
    ],
  },
];

export default function PathsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 gradient-hero relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Career Paths</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Follow structured learning roadmaps designed by industry experts. 
                Complete projects, earn certificates, and get job-ready.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Industry certificates
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  45K+ learners
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Paths List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-8">
              {paths.map((path) => (
                <div
                  key={path.slug}
                  className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300"
                >
                  {/* Progress bar for started paths */}
                  {path.progress > 0 && (
                    <div className="h-1 bg-secondary">
                      <div 
                        className="h-full gradient-bg"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  )}

                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left: Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div 
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                            style={{ backgroundColor: `${path.color.replace(')', ', 0.15)')}` }}
                          >
                            {path.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h2 className="text-2xl font-bold">{path.title}</h2>
                              {path.progress > 0 && (
                                <span className="text-sm text-primary font-medium">
                                  {path.progress}% complete
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-warning text-warning" />
                                {path.rating}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {path.learners} learners
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {path.description}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {path.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Stats Summary */}
                        <div className="flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {path.duration}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <BookOpen className="w-4 h-4" />
                            {path.modules} modules
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Award className="w-4 h-4" />
                            {path.projects} projects
                          </div>
                        </div>
                      </div>

                      {/* Right: Outcomes & Action */}
                      <div className="lg:w-80 lg:border-l lg:border-border lg:pl-6 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                            What you&apos;ll learn
                          </h3>
                          <ul className="space-y-2 mb-8">
                            {path.outcomes.map((outcome) => (
                              <li key={outcome} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button asChild variant="hero" className="w-full">
                          <Link href={`/paths/${path.slug}`}>
                            {path.progress > 0 ? "Continue Learning" : "Start Path"}
                            <ChevronRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
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