import Link from "next/link"; // Changed to next/link
import { ArrowRight, CheckCircle, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Table"],
    acceptance: 49.2,
    solved: true,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    topics: ["Linked List", "Math"],
    acceptance: 42.1,
    solved: true,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["String", "Sliding Window"],
    acceptance: 34.5,
    solved: false,
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topics: ["Array", "Binary Search"],
    acceptance: 38.9,
    solved: false,
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["Stack", "String"],
    acceptance: 43.2,
    solved: true,
  },
];

const difficultyColors = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

export function ProblemsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Practice Problems</h2>
            <p className="text-muted-foreground">Sharpen your skills with real coding challenges</p>
          </div>
          <Button asChild variant="ghost" className="group">
            <Link href="/practice">
              View all problems
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Problems Table */}
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-secondary/50 text-sm font-medium text-muted-foreground border-b border-border">
            <div className="col-span-1">Status</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-3">Topics</div>
            <div className="col-span-1 text-right">Accept.</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {problems.map((problem) => (
              <Link
                key={problem.id}
                href={`/practice/${problem.id}`}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors group"
              >
                <div className="col-span-12 sm:col-span-1 flex items-center">
                  {problem.solved ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <div className="col-span-12 sm:col-span-5">
                  <span className="text-muted-foreground mr-2">{problem.id}.</span>
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {problem.title}
                  </span>
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium", difficultyColors[problem.difficulty as keyof typeof difficultyColors])}
                  >
                    {problem.difficulty}
                  </Badge>
                </div>
                <div className="col-span-6 sm:col-span-3 flex flex-wrap gap-1">
                  {problem.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <div className="hidden sm:flex col-span-1 items-center justify-end text-sm text-muted-foreground">
                  {problem.acceptance}%
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center gap-2 text-success mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">Easy</span>
            </div>
            <p className="text-2xl font-bold">423</p>
            <p className="text-xs text-muted-foreground">Problems</p>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-2 text-warning mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">Medium</span>
            </div>
            <p className="text-2xl font-bold">891</p>
            <p className="text-xs text-muted-foreground">Problems</p>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive mb-1">
              <Users className="w-4 h-4" />
              <span className="font-semibold">Hard</span>
            </div>
            <p className="text-2xl font-bold">387</p>
            <p className="text-xs text-muted-foreground">Problems</p>
          </div>
        </div>
      </div>
    </section>
  );
}