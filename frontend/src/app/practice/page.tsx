"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  CheckCircle, 
  ChevronRight,
  Shuffle,
  Flame,
  Target,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { problems } from "./data";

const topics = ["All", "Array", "String", "Linked List", "Tree", "DP", "Hash Table", "Stack", "Math"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

const difficultyColors = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Practice() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty = selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === "All" || problem.topics.includes(selectedTopic);
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesTopic && matchesSearch;
  });

  const stats = {
    solved: problems.filter((p) => p.solved).length,
    easy: problems.filter((p) => p.difficulty === "Easy").length,
    medium: problems.filter((p) => p.difficulty === "Medium").length,
    hard: problems.filter((p) => p.difficulty === "Hard").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Practice Problems</h1>
            <p className="text-muted-foreground">Sharpen your coding skills with real interview questions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Solved</span>
              </div>
              <p className="text-2xl font-bold">{stats.solved}/{problems.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 text-success mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Easy</span>
              </div>
              <p className="text-2xl font-bold">{stats.easy}</p>
            </div>
            <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 text-warning mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-medium">Medium</span>
              </div>
              <p className="text-2xl font-bold">{stats.medium}</p>
            </div>
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Hard</span>
              </div>
              <p className="text-2xl font-bold">{stats.hard}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {difficulties.map((diff) => (
                <Button
                  key={diff}
                  variant={selectedDifficulty === diff ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={cn(
                    selectedDifficulty === diff && diff !== "All" && 
                    difficultyColors[diff as keyof typeof difficultyColors]
                  )}
                >
                  {diff}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="sm">
              <Shuffle className="w-4 h-4 mr-2" />
              Random
            </Button>
          </div>

          {/* Topics */}
          <div className="flex gap-2 flex-wrap mb-6">
            {topics.map((topic) => (
              <Badge
                key={topic}
                variant={selectedTopic === topic ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedTopic === topic ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                )}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>

          {/* Problems Table */}
          <div className="rounded-2xl border border-border overflow-hidden bg-card">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-secondary/50 text-sm font-medium text-muted-foreground border-b border-border">
              <div className="col-span-1">Status</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Difficulty</div>
              <div className="col-span-3">Topics</div>
              <div className="col-span-1 text-right">Accept.</div>
            </div>

            <div className="divide-y divide-border">
              {filteredProblems.map((problem) => (
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
                  <div className="col-span-12 sm:col-span-5 flex items-center gap-2">
                    <span className="text-muted-foreground">{problem.id}.</span>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {problem.title}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="col-span-6 sm:col-span-2 flex items-center">
                    <Badge 
                      variant="outline" 
                      className={cn("font-medium", difficultyColors[problem.difficulty as keyof typeof difficultyColors])}
                    >
                      {problem.difficulty}
                    </Badge>
                  </div>
                  <div className="col-span-6 sm:col-span-3 flex flex-wrap gap-1 items-center">
                    {problem.topics.slice(0, 2).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {problem.topics.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{problem.topics.length - 2}</span>
                    )}
                  </div>
                  <div className="hidden sm:flex col-span-1 items-center justify-end text-sm text-muted-foreground">
                    {problem.acceptance}%
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {filteredProblems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No problems found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
