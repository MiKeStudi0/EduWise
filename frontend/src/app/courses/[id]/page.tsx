"use client";

import React, { useState, use } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Play, BookOpen, ChevronRight, Award, Heart, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/components/animations/MotionWrapper";
import Link from "next/link";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { id } = use(params);
  const course = courses.find((c) => c.id === parseInt(id));
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  if (!course) return <div className="pt-20 text-center">Course not found</div>;

  const sections = [
    { title: "Getting Started", lessons: [{ title: "Course Introduction", duration: "5:32", preview: true }] },
    { title: "Core Fundamentals", lessons: [{ title: "Understanding Basics", duration: "15:22", preview: false }] }
    // ... add your other sections here
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="bg-gradient-to-b from-muted/50 to-background">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href="/courses">← Back to Courses</Link>
              </Button>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Badge className="mb-4">{course.category}</Badge>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="font-bold text-amber-500">{course.rating} ★</span>
                    <span className="text-muted-foreground">{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {course.instructorAvatar}
                    </div>
                    <div>
                      <p className="font-medium">Created by {course.instructor}</p>
                      <p className="text-sm text-muted-foreground">Last updated {course.updated}</p>
                    </div>
                  </div>
                </div>

                {/* Sticky Buy Card */}
                <div className="lg:relative">
                  <div className="lg:sticky lg:top-24 rounded-xl border bg-card overflow-hidden shadow-lg">
                    <div className="relative aspect-video">
                      <img src={course.image} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white fill-current" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-bold">${course.discountPrice}</span>
                        <span className="text-lg text-muted-foreground line-through">${course.price}</span>
                      </div>
                      <Button variant="hero" size="lg" className="w-full mb-3">Enroll Now</Button>
                      <Button variant="outline" size="lg" className="w-full gap-2"><Heart className="w-4 h-4" /> Wishlist</Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="lg:max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
            <div className="space-y-3">
              {sections.map((section, idx) => (
                <div key={idx} className="rounded-lg border border-border overflow-hidden">
                  <button onClick={() => setExpandedSection(expandedSection === idx ? null : idx)} className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="font-semibold">{section.title}</span>
                    <ChevronRight className={cn("w-5 h-5 transition-transform", expandedSection === idx && "rotate-90")} />
                  </button>
                  {expandedSection === idx && (
                    <div className="divide-y border-t">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="flex items-center justify-between p-4 hover:bg-muted/10">
                          <div className="flex items-center gap-3">
                            {lesson.preview ? <Play className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                            <span className={cn(lesson.preview && "text-primary")}>{lesson.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}