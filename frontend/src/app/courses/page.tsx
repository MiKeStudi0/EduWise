"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Clock, Play, BookOpen, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, scaleUp } from "@/components/animations/MotionWrapper";
import Link from "next/link";

export default function CoursesPage() {
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
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
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
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop",
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
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop",
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
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop",
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
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=225&fit=crop",
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
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
    bestseller: true,
    updated: "January 2026",
  },
];

  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
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
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Learn from the <span className="gradient-text">best instructors</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Premium video courses designed by industry experts. Learn at your own pace.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            {/* Filters */}
            <div className="flex gap-4">
               <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="h-10 px-4 rounded-lg border bg-background text-sm">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
               <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="h-10 px-4 rounded-lg border bg-background text-sm">
                {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
               </select>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <motion.div variants={scaleUp} whileHover={{ y: -4 }} className="group rounded-xl border border-border bg-card overflow-hidden cursor-pointer transition-shadow hover:shadow-lg h-full">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {course.bestseller && <Badge className="absolute top-3 left-3 bg-amber-500 text-white border-0">Bestseller</Badge>}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary fill-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-amber-500">{course.rating}</span>
                      <div className="flex items-center text-amber-500"><Star className="w-4 h-4 fill-current" /></div>
                      <span className="text-xs text-muted-foreground">({course.reviews.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xl font-bold">${course.discountPrice}</span>
                      <Badge variant="outline" className="text-xs">{course.level}</Badge>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}