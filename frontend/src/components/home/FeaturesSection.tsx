"use client";

import Link from "next/link";
// Imported Variants type to fix the TypeScript error
import { motion, Variants } from "framer-motion";
import { Layout, Server, Database, Globe, Cpu, Shield, Smartphone, Cloud, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button"; 

const roadmaps = [
  {
    icon: Layout,
    title: "Frontend",
    description: "Master the browser. HTML, CSS, React, and UI/UX principles.",
    color: "from-blue-500 to-cyan-500",
    href: "/roadmap/frontend-development",
  },
  {
    icon: Server,
    title: "Backend",
    description: "Server-side logic, APIs, databases, and system architecture.",
    color: "from-green-500 to-emerald-500",
    href: "/roadmap/backend",
  },
  {
    icon: Database,
    title: "Full Stack",
    description: "Bridge the gap. Build complete web applications from scratch.",
    color: "from-purple-500 to-pink-500",
    href: "/roadmap/fullstack",
  },
  {
    icon: Cpu,
    title: "AI & Data Science",
    description: "Machine learning, python, data analysis, and neural networks.",
    color: "from-orange-500 to-red-500",
    href: "/roadmap/ai-data-scientist",
  },
  {
    icon: Cloud,
    title: "DevOps",
    description: "CI/CD, containers, cloud infrastructure, and automation.",
    color: "from-indigo-500 to-blue-500",
    href: "/roadmap/devops",
  },
  {
    icon: Smartphone,
    title: "Mobile Dev",
    description: "Build native apps for iOS and Android using React Native or Flutter.",
    color: "from-pink-500 to-rose-500",
    href: "/roadmap/mobile",
  },
  {
    icon: Shield,
    title: "Cyber Security",
    description: "Ethical hacking, network security, and cryptography.",
    color: "from-red-500 to-orange-500",
    href: "/roadmap/cyber-security",
  },
  {
    icon: Globe,
    title: "Blockchain",
    description: "Smart contracts, dApps, solidity, and web3 development.",
    color: "from-teal-500 to-emerald-500",
    href: "/roadmap/blockchain",
  },
];

// Typed animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    }
  },
};

export function FeaturesSection() {
  return (
    <section className="py-10 relative overflow-hidden bg-background">
      
      {/* MATCHING GRID BACKGROUND FROM HERO SECTION 
         - Uses the exact same indigo tint (rgba(99,102,241,0.08))
         - Uses the same mask-image for the fade effect
         - Uses the same dark mode opacity logic
      */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] dark:opacity-40 pointer-events-none" />
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-4 text-foreground"
          >
            <span className="gradient-text">Interactive Learning Roadmaps</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-muted-foreground"
          >
            Follow step-by-step guides to master your chosen technology path.
          </motion.p>
        </div>

        {/* Animated Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {roadmaps.map((roadmap) => (
            <motion.div key={roadmap.title} variants={itemVariants}>
              <Link
                href={roadmap.href}
                className="group relative block h-full p-6 rounded-2xl transition-all duration-300
                  bg-card
                  border border-border
                  shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
                  hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                  hover:-translate-y-1"
              >
                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${roadmap.color} mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <roadmap.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Text Content */}
                <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {roadmap.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {roadmap.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <Link href="/roadmap">
            <Button 
              variant="hero" 
              size="lg" 
              className="rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              View More Roadmaps
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}