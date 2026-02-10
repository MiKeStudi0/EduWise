"use client"; // Required for state, filtering, and Framer Motion

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Clock,
  Users,
  Play,
  BookOpen,
  Filter,
  ChevronDown,
  Heart,
  Share2,
  CheckCircle2,
  Lock,
  ChevronRight,
  Award
} from "lucide-react";
import Image from "next/image"; // Next.js optimized Image component
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, scaleUp } from "@/components/animations/MotionWrapper";

const categories = ["All Courses", "Web Development", "Data Science", "Mobile Development", "DevOps", "AI & ML"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const courses = [
  {
    id: 1,
    title: "Complete React Developer Course",
    instructor: "Sarah Chen",
    instructorAvatar: "SC",
    rating: 4.9,
    reviews: 12453,
    students: 89432,
    duration: "42 hours",
    lessons: 245,
    level: "Beginner",
    category: "Web Development",
    price: 89.99,
    discountPrice: 14.99,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    bestseller: true,
    updated: "January 2026",
  },
  {
    id: 2,
    title: "Python for Data Science & Machine Learning",
    instructor: "Dr. Michael Park",
    instructorAvatar: "MP",
    rating: 4.8,
    reviews: 8921,
    students: 67234,
    duration: "56 hours",
    lessons: 312,
    level: "Intermediate",
    category: "Data Science",
    price: 129.99,
    discountPrice: 19.99,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
    bestseller: true,
    updated: "December 2025",
  },
  {
    id: 3,
    title: "Advanced Node.js: Building Scalable APIs",
    instructor: "James Wilson",
    instructorAvatar: "JW",
    rating: 4.7,
    reviews: 5432,
    students: 34521,
    duration: "38 hours",
    lessons: 198,
    level: "Advanced",
    category: "Web Development",
    price: 99.99,
    discountPrice: 16.99,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
    bestseller: false,
    updated: "January 2026",
  },
  {
    id: 4,
    title: "Flutter & Dart Complete Developer Guide",
    instructor: "Emily Rodriguez",
    instructorAvatar: "ER",
    rating: 4.9,
    reviews: 7823,
    students: 45678,
    duration: "48 hours",
    lessons: 276,
    level: "Beginner",
    category: "Mobile Development",
    price: 109.99,
    discountPrice: 17.99,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop",
    bestseller: true,
    updated: "January 2026",
  },
  {
    id: 5,
    title: "Docker & Kubernetes: The Complete Guide",
    instructor: "Alex Thompson",
    instructorAvatar: "AT",
    rating: 4.8,
    reviews: 6234,
    students: 38901,
    duration: "35 hours",
    lessons: 189,
    level: "Intermediate",
    category: "DevOps",
    price: 94.99,
    discountPrice: 15.99,
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop",
    bestseller: false,
    updated: "December 2025",
  },
  {
    id: 6,
    title: "Deep Learning with TensorFlow 2.0",
    instructor: "Dr. Lisa Wang",
    instructorAvatar: "LW",
    rating: 4.9,
    reviews: 9876,
    students: 52341,
    duration: "62 hours",
    lessons: 345,
    level: "Advanced",
    category: "AI & ML",
    price: 149.99,
    discountPrice: 24.99,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    bestseller: true,
    updated: "January 2026",
  },
];

export default function CoursePage() {
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "All Courses" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <AnimatePresence mode="wait">
          {!selectedCourse ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="container max-w-7xl mx-auto px-4 sm:px-6"
            >
              {/* Header */}
              <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  Learn from the <span className="gradient-text">best instructors</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Premium video courses designed by industry experts. Learn at your own pace with lifetime access.
                </p>
              </motion.div>

              {/* Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none h-10 px-4 pr-10 rounded-lg border border-input bg-background text-sm cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="appearance-none h-10 px-4 pr-10 rounded-lg border border-input bg-background text-sm cursor-pointer"
                    >
                      {levels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Course List */}
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    variants={scaleUp}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedCourse(course)}
                    className="group rounded-xl border border-border bg-card overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-video">
                      <Image src={course.image} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                      {course.bestseller && (
                        <Badge className="absolute top-3 left-3 bg-amber-500 text-white">Bestseller</Badge>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center"><Play className="w-5 h-5 text-primary fill-primary" /></div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-amber-500 text-sm">{course.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3.5 h-3.5", i < Math.floor(course.rating) ? "text-amber-500 fill-amber-500" : "text-muted")} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">({course.reviews.toLocaleString()})</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.lessons}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">${course.discountPrice}</span>
                          <span className="text-sm text-muted-foreground line-through">${course.price}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase">{course.level}</Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function CourseDetail({ course, onBack }: { course: typeof courses[0]; onBack: () => void }) {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const sections = [
    {
      title: "Getting Started",
      lessons: [
        { title: "Course Introduction", duration: "5:32", preview: true },
        { title: "Setting Up Your Environment", duration: "12:45", preview: true },
        { title: "Project Overview", duration: "8:21", preview: false },
      ],
    },
    {
      title: "Core Fundamentals",
      lessons: [
        { title: "Understanding the Basics", duration: "15:22", preview: false },
        { title: "Key Concepts Explained", duration: "18:45", preview: false },
      ],
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">← Back to Courses</Button>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Badge className="mb-4">{course.category}</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Master {course.category.toLowerCase()} with this comprehensive course. Learn industrial best practices and build professional-grade applications.
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /><span className="font-bold text-foreground">{course.rating}</span> ({course.reviews} ratings)</div>
             <div className="flex items-center gap-1.5"><Users className="w-4 h-4" />{course.students.toLocaleString()} students</div>
             <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" />Last updated {course.updated}</div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
            {sections.map((section, idx) => (
              <div key={idx} className="border border-border rounded-xl overflow-hidden bg-card">
                <button 
                   onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                   className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 font-semibold">
                    <ChevronRight className={cn("w-4 h-4 transition-transform", expandedSection === idx && "rotate-90")} />
                    {section.title}
                  </div>
                  <span className="text-xs text-muted-foreground">{section.lessons.length} lessons</span>
                </button>
                <AnimatePresence>
                  {expandedSection === idx && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="flex items-center justify-between p-4 text-sm hover:bg-muted/10">
                          <div className="flex items-center gap-3">
                             {lesson.preview ? <Play className="w-3.5 h-3.5 text-primary" /> : <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                             <span className={cn(lesson.preview && "text-primary font-medium")}>{lesson.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
            <div className="relative aspect-video">
               <Image src={course.image} alt="preview" fill className="object-cover" unoptimized />
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Button variant="ghost" className="w-14 h-14 rounded-full bg-white/90"><Play className="w-6 h-6 text-primary fill-primary" /></Button></div>
            </div>
            <div className="p-6">
               <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold">${course.discountPrice}</span>
                  <span className="text-lg text-muted-foreground line-through">${course.price}</span>
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20">{Math.round((1 - course.discountPrice / course.price) * 100)}% Off</Badge>
               </div>
               <Button className="w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90">Add to Cart</Button>
               <Button variant="outline" className="w-full mt-3 h-12">Buy Now</Button>
               <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest">30-Day Money-Back Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}