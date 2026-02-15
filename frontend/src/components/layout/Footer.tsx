"use client";

import Link from "next/link";
import { Code2, Github, Twitter, Linkedin, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";

const footerLinks = {
  Product: [
    { label: "Courses", href: "/courses" },
    { label: "Roadmaps", href: "/roadmap" },
    { label: "Coding Playground", href: "/playground" },
    { label: "Challenges", href: "/practice" },
    { label: "Pricing", href: "/pricing" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Community", href: "/community" },
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/help" },
    { label: "Changelog", href: "/changelog" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Legal", href: "/legal" },
    { label: "Contact", href: "/contact" },
    { label: "Partners", href: "/partners" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-slate-50 dark:bg-slate-950/30 pt-16 pb-8 overflow-hidden">
      
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        
        {/* Top Section: Brand + Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                <Code2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">LearnStak</span>
            </Link>
            
            <p className="text-base text-muted-foreground mb-8 max-w-sm leading-relaxed">
              The premier platform for developers to master their craft. 
              Interactive roadmaps, hands-on challenges, and a community that helps you grow.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-border transition-all"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => {
              // LOGIC: Check if category is Resources, hide it on mobile (hidden), show on medium+ screens (md:block)
              const visibilityClass = category === "Resources" ? "hidden md:block" : "";

              return (
                <div key={category} className={visibilityClass}>
                  <h3 className="font-semibold text-foreground mb-6">{category}</h3>
                  <ul className="space-y-4">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                        >
                          <span className="w-0 group-hover:w-1.5 h-1.5 rounded-full bg-primary mr-0 group-hover:mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-b border-border/60 py-10 mb-8 bg-card/30 backdrop-blur-sm rounded-2xl px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-foreground">Stay in the loop</h4>
                <p className="text-sm text-muted-foreground">Get the latest tutorials and updates sent to your inbox.</p>
              </div>
            </div>
            
            {/* Input & Button: Stacks vertically on mobile, Row on tablet+ */}
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background w-full sm:min-w-[240px] border-border focus-visible:ring-primary" 
              />
              <Button 
                variant="hero" 
                size="lg"
                className="shadow-xl shadow-primary/20 w-full sm:w-auto"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LearnStak Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}