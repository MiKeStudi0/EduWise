import Link from "next/link";
import { Layout, Server, Database, Globe, Cpu, Shield, Smartphone, Cloud } from "lucide-react";

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

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] dark:opacity-40 pointer-events-none" />
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Interactive Learning Roadmaps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Follow step-by-step guides to master your chosen technology path.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadmaps.map((roadmap, index) => (
            <Link
              href={roadmap.href}
              key={roadmap.title}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient glow on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${roadmap.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${roadmap.color} mb-4`}>
                <roadmap.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{roadmap.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {roadmap.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
