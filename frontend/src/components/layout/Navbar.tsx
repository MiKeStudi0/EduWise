"use client"; // Mandatory for hooks and DOM manipulation

import { useState, useEffect } from "react";
import Link from "next/link"; // Use Next.js Link
import { usePathname } from "next/navigation"; // Replaces useLocation
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Code2, 
  BookOpen, 
  Trophy, 
  GraduationCap, 
  Compass,
  Search,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Code2 },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/paths", label: "Paths", icon: Compass },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname(); // Replaces location.pathname

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  // Safe way to handle hydration and initial theme in Next.js
  useEffect(() => {
    if (!document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Link 'to' becomes 'href' */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 w-9 h-9 rounded-xl gradient-bg opacity-50 blur-lg group-hover:opacity-75 transition-opacity" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Code<span className="gradient-text">Forge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button variant="default" size="sm">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex gap-2 mt-4 px-4">
                <Button variant="outline" className="flex-1">Sign In</Button>
                <Button variant="default" className="flex-1">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}