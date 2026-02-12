"use client"; // Mandatory for state and Framer Motion

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Code2,
  Briefcase,
  Award,
  Users,
  Target,
  Layers,
  Database,
  Globe,
  Brain,
  Star,
  Lock,
  ChevronRight
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  fadeInUp, 
  staggerContainer, 
  scaleUp, 
  fadeInLeft, 
  fadeInRight 
} from "@/components/animations/MotionWrapper";

const careerPaths = [
  {
    id: "frontend",
    title: "Frontend Developer",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    description: "Master modern frontend technologies and build beautiful, responsive web applications.",
    duration: "4-6 months",
    projects: 8,
    modules: 12,
    skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Testing"],
    salary: "$75k - $120k",
    companies: ["Google", "Meta", "Airbnb", "Stripe"],
    popularity: 89,
  },
  {
    id: "backend",
    title: "Backend Developer",
    icon: Database,
    color: "from-green-500 to-emerald-500",
    description: "Build scalable server-side applications, APIs, and database systems.",
    duration: "4-6 months",
    projects: 7,
    modules: 11,
    skills: ["Node.js", "Python", "Databases", "APIs", "Security"],
    salary: "$80k - $130k",
    companies: ["Amazon", "Netflix", "Uber", "Spotify"],
    popularity: 76,
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    icon: Layers,
    color: "from-purple-500 to-pink-500",
    description: "Become a versatile developer capable of building complete web applications.",
    duration: "6-8 months",
    projects: 12,
    modules: 18,
    skills: ["Frontend", "Backend", "DevOps", "Cloud", "Architecture"],
    salary: "$90k - $150k",
    companies: ["Microsoft", "Apple", "LinkedIn", "Shopify"],
    popularity: 95,
  },
  {
    id: "datascience",
    title: "Data Scientist",
    icon: Brain,
    color: "from-orange-500 to-red-500",
    description: "Analyze data, build ML models, and drive data-driven decisions.",
    duration: "5-7 months",
    projects: 10,
    modules: 14,
    skills: ["Python", "ML/AI", "Statistics", "SQL", "Visualization"],
    salary: "$95k - $160k",
    companies: ["Google", "Tesla", "Netflix", "Bloomberg"],
    popularity: 82,
  },
];

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Frontend Developer at Google",
    avatar: "AJ",
    quote: "LearnStak's Frontend path helped me land my dream job. The projects were incredibly practical.",
    path: "Frontend Developer",
  },
  {
    name: "Maria Garcia",
    role: "Full Stack Engineer at Meta",
    avatar: "MG",
    quote: "The structured curriculum and real-world projects made all the difference in my interview prep.",
    path: "Full Stack Developer",
  },
  {
    name: "David Kim",
    role: "Data Scientist at Netflix",
    avatar: "DK",
    quote: "From zero coding experience to a data science role - this platform made it possible.",
    path: "Data Scientist",
  },
];

export default function Careers() {
  const [selectedPath, setSelectedPath] = useState<typeof careerPaths[0] | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <AnimatePresence mode="wait">
          {!selectedPath ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Hero Section */}
              <section className="relative overflow-hidden py-16 sm:py-24">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="text-center max-w-3xl mx-auto"
                  >
                    <Badge className="mb-4" variant="outline">
                      <Award className="w-3 h-3 mr-1" />
                      Verified Certificates
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                      Launch Your{" "}
                      <span className="gradient-text">Tech Career</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                      Structured learning paths with real-world projects, mentorship, and verified 
                      certifications. Join 50,000+ developers who landed their dream jobs.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button variant="hero" size="xl" className="group">
                        Explore Paths
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button variant="hero-outline" size="xl">
                        Take Career Quiz
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Stats */}
              <section className="py-12 border-y border-border bg-muted/30">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                  >
                    {[
                      { value: "50,000+", label: "Certified Developers" },
                      { value: "85%", label: "Job Placement Rate" },
                      { value: "$95k", label: "Average Starting Salary" },
                      { value: "500+", label: "Hiring Partners" },
                    ].map((stat, index) => (
                      <motion.div key={index} variants={scaleUp} className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </section>

              {/* Career Paths Grid */}
              <section className="py-20">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-12"
                  >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Path</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Comprehensive learning journeys designed to take you from beginner to job-ready developer.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {careerPaths.map((path) => (
                      <motion.div
                        key={path.id}
                        variants={scaleUp}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedPath(path)}
                        className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer shadow-sm"
                      >
                        <div className="flex items-start gap-4 h-full">
                          <div className={cn(
                            "p-3 rounded-xl bg-gradient-to-br shrink-0",
                            path.color
                          )}>
                            <path.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                {path.title}
                              </h3>
                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{path.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {path.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold">
                                  {skill}
                                </Badge>
                              ))}
                            </div>

                            <div className="mt-auto pt-4 border-t border-border flex flex-col gap-4">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{path.duration}</span>
                                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{path.modules} modules</span>
                                    <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5" />{path.projects} projects</span>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase">Popularity</span>
                                        <span className="text-xs font-bold">{path.popularity}%</span>
                                    </div>
                                    <Progress value={path.popularity} className="h-1" />
                                </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </section>

              {/* Testimonials */}
              <section className="py-20 bg-muted/20">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6">
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
                  </motion.div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                      <motion.div key={index} variants={scaleUp} className="p-6 rounded-2xl border border-border bg-card">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                        </div>
                        <p className="text-muted-foreground mb-6 italic text-sm">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{testimonial.name}</div>
                            <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PathDetail path={selectedPath} onBack={() => setSelectedPath(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function PathDetail({ path, onBack }: { path: typeof careerPaths[0]; onBack: () => void }) {
  const modules = [
    { title: "Introduction & Setup", lessons: 5, duration: "2 hours", completed: true },
    { title: "Core Fundamentals", lessons: 12, duration: "6 hours", completed: true },
    { title: "Intermediate Concepts", lessons: 15, duration: "8 hours", completed: false },
    { title: "Advanced Topics", lessons: 10, duration: "5 hours", completed: false, locked: true },
    { title: "Real-World Projects", lessons: 8, duration: "12 hours", completed: false, locked: true },
    { title: "Interview Preparation", lessons: 6, duration: "4 hours", completed: false, locked: true },
    { title: "Final Assessment", lessons: 3, duration: "3 hours", completed: false, locked: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Detail Section */}
      <div className={cn("relative py-16", path.color.replace("from-", "bg-").split(" ")[0] + "/5")}>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-6 hover:bg-accent">
            ← Back to Paths
          </Button>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className={cn("inline-flex p-3 rounded-xl bg-gradient-to-br mb-4 shadow-lg", path.color)}>
                <path.icon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{path.title}</h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">{path.description}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {path.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">{skill}</Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-muted-foreground py-6 border-y border-border">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-medium text-foreground"><Clock className="w-4 h-4 text-primary" /> Duration</span>
                  {path.duration}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-medium text-foreground"><BookOpen className="w-4 h-4 text-primary" /> Modules</span>
                  {path.modules} total
                </div>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-medium text-foreground"><Code2 className="w-4 h-4 text-primary" /> Projects</span>
                  {path.projects} real-world
                </div>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-medium text-foreground"><Briefcase className="w-4 h-4 text-primary" /> Salary</span>
                  {path.salary}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 p-6 rounded-2xl border border-border bg-card shadow-xl sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold">12,000+ Enrolled</span>
              </div>
              <Progress value={28} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground mb-6">2 of 7 modules completed (28%)</p>

              <div className="space-y-3">
                  <Button variant="default" className="w-full bg-primary hover:bg-primary/90">Continue Learning</Button>
                  <Button variant="outline" className="w-full">Download Syllabus</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Grid */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="lg:max-w-3xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Layers className="w-6 h-6 text-primary" />
              Course Curriculum
          </h2>
          <div className="space-y-3">
            {modules.map((module, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200",
                  module.completed ? "border-emerald-500/20 bg-emerald-500/5" : 
                  module.locked ? "opacity-60 bg-muted/30" : "hover:border-primary/30 bg-card shadow-sm"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner",
                    module.completed ? "bg-emerald-500 text-white" : 
                    module.locked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                  )}>
                    {module.completed ? <CheckCircle2 className="w-5 h-5" /> : 
                     module.locked ? <Lock className="w-4 h-4" /> : <span className="font-bold">{index + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base">{module.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
                      <span>{module.lessons} lessons</span>
                      <span>{module.duration}</span>
                    </div>
                  </div>
                  {!module.locked && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}