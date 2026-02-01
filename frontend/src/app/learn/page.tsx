"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Code2, Palette, FileCode, Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const featuredTopics = [
  { id: "html", name: "HTML", desc: "The foundation of the web", icon: FileCode, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "css", name: "CSS", desc: "Design and layout mastery", icon: Palette, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "javascript", name: "JavaScript", desc: "Add interactivity to sites", icon: Code2, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { id: "python", name: "Python", desc: "Versatile and powerful coding", icon: Terminal, color: "text-green-500", bg: "bg-green-500/10" },
];

export default function LearnPortal() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 gradient-text"
          >
            What do you want to learn today?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Search through our interactive tutorials and start building real projects in minutes.
          </motion.p>

          {/* Large Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto mb-16"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <Input 
              className="h-16 pl-14 pr-32 text-lg rounded-2xl shadow-xl border-primary/20 focus-visible:ring-primary"
              placeholder="Search e.g. 'HTML Headings' or 'React Hooks'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="absolute right-2 top-2 h-12 px-6 rounded-xl" variant="hero">
              Search
            </Button>
          </motion.div>
        </section>

        {/* Topic Grid */}
        <section className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTopics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link href={`/learn/${topic.id}`} className="group block p-6 rounded-3xl border border-border bg-card hover:border-primary/50 hover:shadow-glow transition-all">
                  <div className={`w-14 h-14 rounded-2xl ${topic.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <topic.icon className={`w-7 h-7 ${topic.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{topic.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{topic.desc}</p>
                  <div className="flex items-center text-primary font-semibold text-sm">
                    Start Learning <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}