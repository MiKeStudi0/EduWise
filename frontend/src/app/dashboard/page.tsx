"use client"; // Required for Framer Motion, hooks, and interactivity

import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  GraduationCap,
  LineChart,
  Play,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Award,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Image from "next/image"; // Next.js optimized Image component
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

const stats = [
  { label: "Day Streak", value: "23", icon: Flame, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { label: "Problems Solved", value: "127", icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
  { label: "Hours Learned", value: "84", icon: Clock, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { label: "Certificates", value: "3", icon: Award, color: "text-purple-500", bgColor: "bg-purple-500/10" },
];

const weeklyActivity = [
  { day: "Mon", problems: 8, hours: 2.5 },
  { day: "Tue", problems: 12, hours: 3.2 },
  { day: "Wed", problems: 5, hours: 1.5 },
  { day: "Thu", problems: 15, hours: 4.0 },
  { day: "Fri", problems: 10, hours: 2.8 },
  { day: "Sat", problems: 18, hours: 5.0 },
  { day: "Sun", problems: 6, hours: 1.8 },
];

const currentCourses = [
  {
    title: "Complete React Developer Course",
    instructor: "Sarah Chen",
    progress: 68,
    lastAccessed: "2 hours ago",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop",
  },
  {
    title: "Python for Data Science",
    instructor: "Dr. Michael Park",
    progress: 42,
    lastAccessed: "Yesterday",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=240&fit=crop",
  },
  {
    title: "Docker & Kubernetes Masterclass",
    instructor: "Alex Thompson",
    progress: 15,
    lastAccessed: "3 days ago",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=240&fit=crop",
  },
];

const recentProblems = [
  { title: "Two Sum", difficulty: "Easy", status: "Solved", time: "2 min ago" },
  { title: "Merge Intervals", difficulty: "Medium", status: "Attempted", time: "15 min ago" },
  { title: "LRU Cache", difficulty: "Medium", status: "Solved", time: "1 hour ago" },
  { title: "Binary Tree Level Order", difficulty: "Medium", status: "Solved", time: "2 hours ago" },
];

const achievements = [
  { title: "Problem Solver", description: "Solved 100 problems", icon: Target, unlocked: true },
  { title: "Streak Master", description: "20 day streak", icon: Flame, unlocked: true },
  { title: "Quick Learner", description: "Complete 5 courses", icon: GraduationCap, unlocked: false },
  { title: "Code Warrior", description: "Solve 50 hard problems", icon: Trophy, unlocked: false },
];

const recommendations = [
  { title: "Graph Algorithms", type: "Problem Set", difficulty: "Medium" },
  { title: "System Design Basics", type: "Course", difficulty: "Intermediate" },
  { title: "Dynamic Programming", type: "Tutorial", difficulty: "Advanced" },
];

export default function Dashboard() {
  const maxProblems = Math.max(...weeklyActivity.map(d => d.problems));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          {/* Welcome Header */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome back, Alex! 👋</h1>
                <p className="text-muted-foreground">
                  You're on a <span className="text-orange-500 font-semibold">23 day streak</span>. Keep going!
                </p>
              </div>
              <Button variant="default" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="w-4 h-4" />
                Continue Learning
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleUp}
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 rounded-xl bg-card border border-border shadow-sm"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.color)} />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Activity */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="p-6 rounded-xl bg-card border border-border shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Weekly Activity</h2>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                {/* Activity Chart */}
                <div className="flex items-end justify-between gap-2 h-40 mb-4">
                  {weeklyActivity.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.problems / maxProblems) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex-1 flex flex-col items-center gap-2 h-full"
                    >
                      <div 
                        className="w-full bg-primary/80 rounded-t-lg hover:bg-primary transition-colors cursor-pointer relative group"
                        style={{ height: "100%" }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border shadow-sm z-20">
                          {day.problems} problems
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  {weeklyActivity.map((day) => (
                    <span key={day.day} className="flex-1 text-center">{day.day}</span>
                  ))}
                </div>

                {/* Summary */}
                <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">74</div>
                    <div className="text-xs text-muted-foreground">Problems This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success text-emerald-500">+23%</div>
                    <div className="text-xs text-muted-foreground">vs Last Week</div>
                  </div>
                </div>
              </motion.div>

              {/* Current Courses */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="p-6 rounded-xl bg-card border border-border shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Continue Learning</h2>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All Courses
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {currentCourses.map((course, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="relative w-20 h-12 flex-shrink-0">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="rounded-lg object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={course.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{course.progress}%</span>
                        </div>
                      </div>
                      <div className="hidden sm:block text-xs text-muted-foreground whitespace-nowrap">
                        {course.lastAccessed}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Problems */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="p-6 rounded-xl bg-card border border-border shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Recent Problems</h2>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {recentProblems.map((problem, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {problem.status === "Solved" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-yellow-500" />
                        )}
                        <div>
                          <div className="font-medium">{problem.title}</div>
                          <div className="text-xs text-muted-foreground">{problem.time}</div>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          problem.difficulty === "Easy" && "text-emerald-500 border-emerald-500/30",
                          problem.difficulty === "Medium" && "text-yellow-500 border-yellow-500/30",
                          problem.difficulty === "Hard" && "text-red-500 border-red-500/30"
                        )}
                      >
                        {problem.difficulty}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* Career Path Progress */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInRight}
                className="p-6 rounded-xl bg-card border border-border shadow-sm"
              >
                <h2 className="text-lg font-semibold mb-4">Career Path</h2>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Full Stack Developer</h3>
                      <p className="text-xs text-muted-foreground">4 of 7 modules completed</p>
                    </div>
                  </div>
                  <Progress value={57} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">57% complete</span>
                    <span className="text-primary font-medium">~6 weeks left</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Continue Path
                </Button>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInRight}
                className="p-6 rounded-xl bg-card border border-border shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Achievements</h2>
                  <Badge variant="secondary" className="text-xs">2/8</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      whileHover={achievement.unlocked ? { scale: 1.05 } : {}}
                      className={cn(
                        "p-3 rounded-lg text-center transition-all",
                        achievement.unlocked 
                          ? "bg-primary/10 border border-primary/20" 
                          : "bg-muted/50 opacity-50"
                      )}
                    >
                      <achievement.icon className={cn(
                        "w-6 h-6 mx-auto mb-2",
                        achievement.unlocked ? "text-primary" : "text-muted-foreground"
                      )} />
                      <div className="text-xs font-medium truncate">{achievement.title}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInRight}
                className="p-6 rounded-xl bg-card border border-border shadow-sm"
              >
                <h2 className="text-lg font-semibold mb-4">Recommended for You</h2>

                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="font-medium text-sm">{rec.title}</div>
                        <div className="text-xs text-muted-foreground">{rec.type}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {rec.difficulty}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Activity Calendar Heatmap */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInRight}
                className="p-6 rounded-xl bg-card border border-border shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Activity Calendar</h2>
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Heatmap grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 28 }).map((_, i) => {
                    const intensity = Math.random();
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className={cn(
                          "aspect-square rounded-sm",
                          intensity > 0.7 ? "bg-primary" :
                          intensity > 0.5 ? "bg-primary/60" :
                          intensity > 0.3 ? "bg-primary/30" :
                          "bg-muted"
                        )}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-1 mt-3 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="w-3 h-3 rounded-sm bg-muted" />
                  <div className="w-3 h-3 rounded-sm bg-primary/30" />
                  <div className="w-3 h-3 rounded-sm bg-primary/60" />
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                  <span>More</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}