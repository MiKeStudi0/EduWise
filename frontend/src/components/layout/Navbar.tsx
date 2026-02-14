"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Code2, BookOpen, Trophy, GraduationCap, MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button"; // Uses your custom Button variants
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
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          // Base: transparent but readable via blur
          "bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60",
          // Scroll state: adds shadow and defines border visibility
          scrolled 
            ? "border-border/50 shadow-sm py-2" 
            : "border-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-colors" />
                <div className="relative w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
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
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 text-muted-foreground hover:text-primary font-normal"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
              
              {/* PRIMARY CTA: Using 'hero' variant for the glow/gradient */}
              <Button variant="hero" size="sm">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border/50 transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-[500px] opacity-100 shadow-lg" : "max-h-0 opacity-0"
          )}
        >
          <div className="container mx-auto px-4 pb-4 pt-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-accent transition-colors group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                   <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            ))}
            
            <div className="pt-4 space-y-3 px-4 border-t border-border/50 mt-2">
              <div className="flex items-center justify-between">
                 <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                 <ThemeToggle />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full justify-center">
                  Sign in
                </Button>
                {/* Mobile PRIMARY CTA: Using 'hero' variant */}
                <Button variant="hero" className="w-full justify-center">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}