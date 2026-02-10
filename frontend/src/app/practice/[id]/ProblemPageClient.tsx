"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Play,
  Settings,
  Code2,
  Terminal,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ProblemPageClientProps = {
  id: string;
};

export function ProblemPageClient({ id }: ProblemPageClientProps) {
  const [activeTab, setActiveTab] = useState<"description" | "solution" | "submissions">("description");
  const [code, setCode] = useState(`function twoSum(nums, target) {
  // Write your code here
  
};`);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Problem Header / Toolbar */}
      <div className="pt-16 border-b border-border bg-card/50">
        <div className="flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/practice">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </Button>
            <div className="h-4 w-[1px] bg-border" />
            <span className="font-medium text-sm">Problem {id}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="hero" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Run Code
            </Button>
            <Button variant="success" size="sm">
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Problem Info */}
        <div className="w-1/2 border-r border-border overflow-y-auto bg-card/30">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-bold">Two Sum</h1>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Easy
              </Badge>
            </div>

            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setActiveTab("description")}
                className={cn(
                  "text-sm font-medium pb-2 border-b-2 transition-colors",
                  activeTab === "description" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Description
              </button>
              <button 
                onClick={() => setActiveTab("solution")}
                className={cn(
                  "text-sm font-medium pb-2 border-b-2 transition-colors",
                  activeTab === "solution" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Editorial
              </button>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
              <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
              
              <h4 className="mt-6 mb-2">Example 1:</h4>
              <div className="bg-secondary/50 p-4 rounded-lg font-mono text-xs">
                <p>Input: nums = [2,7,11,15], target = 9</p>
                <p>Output: [0,1]</p>
                <p>Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Editor & Terminal */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          {/* Editor Header */}
          <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-[#252525]">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Code2 className="w-4 h-4" />
              <span>solution.js</span>
            </div>
          </div>

          {/* Code Editor Placeholder */}
          <div className="flex-1 p-4 font-mono text-sm text-gray-300">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent outline-none resize-none"
              spellCheck={false}
            />
          </div>

          {/* Terminal / Console */}
          <div className="h-48 border-t border-white/10 bg-[#151515]">
            <div className="h-8 border-b border-white/5 flex items-center px-4 gap-2">
              <Terminal className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Console</span>
            </div>
            <div className="p-4 font-mono text-xs text-success/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                <span>Running test cases...</span>
              </div>
              <div className="mt-2 text-white/50">Output: [0, 1]</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
