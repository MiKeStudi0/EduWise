"use client";

import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="relative py-10 overflow-hidden bg-background flex items-center justify-center">
      
      {/* --- Background Effects --- */}
      
      {/* 1. Consistent Tech Grid (Same as Hero/Features) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] dark:opacity-40 pointer-events-none" />
      
      {/* 2. Central Pulsing Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none mix-blend-screen" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="max-w-4xl mx-auto text-center"
        >
          
          {/* Badge */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start your journey today</span>
          </motion.div>

          {/* Headline */}
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-foreground"
          >
            Ready to level up your{" "}
            <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              skills
            </span>?
          </motion.h2>

          {/* Description */}
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join millions of developers learning, practicing, and building 
            their careers with LearnStak. It's free to get started.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              asChild 
              variant="hero" 
              size="xl" 
              className="w-full sm:w-auto min-w-[200px] shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <Zap className="w-5 h-5 fill-current" />
                Create Free Account
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="glass" 
              size="xl" 
              className="w-full sm:w-auto min-w-[200px] border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <Link href="/courses" className="flex items-center gap-2">
                Explore Curriculum
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          {/* Footer Note */}
          <motion.p 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="mt-8 text-sm text-muted-foreground opacity-70"
          >
            No credit card required • Cancel anytime
          </motion.p>
          
        </motion.div>
      </div>
    </section>
  );
}