import Link from "next/link"; // Changed from react-router-dom
import { Code2, Github, Twitter, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  Learn: [
    { label: "Tutorials", href: "/learn" },
    { label: "Documentation", href: "/docs" },
    { label: "Coding Playground", href: "/playground" },
    { label: "Challenges", href: "/practice" },
  ],
  Paths: [
    { label: "Frontend Developer", href: "/paths/frontend" },
    { label: "Backend Developer", href: "/paths/backend" },
    { label: "Full Stack", href: "/paths/fullstack" },
    { label: "Data Science", href: "/paths/data-science" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Community", href: "/community" },
    { label: "Interview Prep", href: "/interview" },
    { label: "Job Board", href: "/jobs" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/company/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Press", href: "/press" },
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
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 py-16 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Code2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">LearnStak</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The complete platform for developers to learn, practice, and build their careers.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LearnStak. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}