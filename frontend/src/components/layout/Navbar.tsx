"use client"; // Required for useState and onClick

import { useState } from "react";
import Link from "next/link"; // Changed from react-router-dom
import { Menu, X, Code2, BookOpen, Trophy, GraduationCap, MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ThemeToggle";

const navItems = [
   { 
    label: "Roadmaps", 
    href: "/roadmap", 
    icon: MapIcon,
    description: "Guides to navigate your learning journey"
  },
  { 
    label: "Learn", 
    href: "/learn", 
    icon: BookOpen,
    description: "Interactive tutorials & documentation"
  },
  { 
    label: "Practice", 
    href: "/practice", 
    icon: Code2,
    description: "Coding challenges & algorithms"
  },
  { 
    label: "Courses", 
    href: "/courses", 
    icon: GraduationCap,
    description: "Video-based learning paths"
  },
  { 
    label: "Careers", 
    href: "/careers", 
    icon: Trophy,
    description: "Certification & job prep"
  },
  
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <script src="https://code.iconify.design/1/1.0.7/iconify.min.js"></script>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Changed 'to' to 'href' */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-colors" />
                <div className="relative w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">
                LearnStak
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href} // Changed 'to' to 'href'
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
              <Button variant="hero" size="sm">
                Get Started Free
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={cn(
              "md:hidden overflow-hidden transition-all duration-300 ease-out",
              isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
            )}
          >
            <div className="pt-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href} // Changed 'to' to 'href'
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              ))}
              <div className="pt-4 space-y-2 px-4">
                <Button variant="outline" className="w-full">
                  Sign in
                </Button>
                <Button variant="hero" className="w-full">
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}