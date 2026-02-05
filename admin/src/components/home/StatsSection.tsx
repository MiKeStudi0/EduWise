import { Users, Code2, Award, Building2 } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "2M+",
    label: "Active Learners",
    description: "developers learning with us",
  },
  {
    icon: Code2,
    value: "50K+",
    label: "Coding Challenges",
    description: "practice problems available",
  },
  {
    icon: Award,
    value: "15K+",
    label: "Certificates Issued",
    description: "verified credentials earned",
  },
  {
    icon: Building2,
    value: "500+",
    label: "Hiring Partners",
    description: "companies recruiting our grads",
  },
];

const companyLogos = [
  "Google",
  "Meta",
  "Amazon",
  "Microsoft",
  "Apple",
  "Netflix",
];

export function StatsSection() {
  return (
    <section className="py-20 border-y border-border/50">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-8">
            Trusted by developers at the world's leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {companyLogos.map((company) => (
              <div
                key={company}
                className="text-xl sm:text-2xl font-semibold text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
