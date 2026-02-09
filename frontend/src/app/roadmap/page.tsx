"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Layout, Server, Layers, Terminal, ArrowRight } from 'lucide-react';

const roadmaps = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Master the art of creating intuitive and dynamic user interfaces. Learn HTML, CSS, JavaScript, React, and modern styling frameworks.',
    slug: 'frontend',
    icon: Layout,
    gradient: 'from-blue-500 to-cyan-400',
    shadowColor: 'shadow-blue-500/25'
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Build robust server-side applications. Dive into databases, APIs, authentication, and server architecture.',
    slug: 'backend',
    icon: Server,
    gradient: 'from-green-500 to-emerald-400',
    shadowColor: 'shadow-green-500/25'
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    description: 'Combine frontend and backend skills to build complete web applications from scratch.',
    slug: 'fullstack',
    icon: Layers,
    gradient: 'from-purple-500 to-pink-400',
    shadowColor: 'shadow-purple-500/25'
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    description: 'Streamline development and deployment processes with CI/CD, containers, and cloud infrastructure.',
    slug: 'devops',
    icon: Terminal,
    gradient: 'from-orange-500 to-red-400',
    shadowColor: 'shadow-orange-500/25'
  }
];

export default function RoadmapListingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            >
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Learning Path</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Select a roadmap to start your journey. We provide structured paths to help you master the skills you need for your career.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {roadmaps.map((roadmap, index) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Link href={`/roadmap/${roadmap.slug}`} className="block h-full">
                  <div className="group relative h-full bg-white dark:bg-card border border-slate-200 dark:border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                    {/* Decorative Gradient Blob */}
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${roadmap.gradient} opacity-[0.08] rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-125 duration-500`} />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${roadmap.gradient} text-white shadow-lg ${roadmap.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                        <roadmap.icon size={32} />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {roadmap.title}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-muted-foreground mb-8 flex-grow leading-relaxed">
                        {roadmap.description}
                      </p>
                      
                      <div className="flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-auto">
                        <span>Start Roadmap</span>
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}