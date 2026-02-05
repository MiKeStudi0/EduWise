"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from "@/components/layout/Navbar"; 
import { Footer } from "@/components/layout/Footer"; 
import { 
  Target, BookOpen, ChevronRight, CheckCircle2, 
  Trophy, Code2, Terminal, Globe, 
  Layers, Box, Cpu, X, Maximize2
} from 'lucide-react';
import { motion } from "framer-motion";

// --- TYPES ---
interface RoadmapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type?: 'default' | 'group'; 
  status: 'available' | 'mastered';
  icon?: any; // Fallback Lucide icon
  iconSlug?: string; // NEW: Simple Icons slug (e.g. "react", "html5")
  parent: string | null;
  description?: string;
  children?: string[]; 
}

export default function FrontendRoadmapPage() {
  const [activeNode, setActiveNode] = useState<RoadmapNode | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- CONFIG: ADJUST SCALE HERE ---
  const SPACING_X = 140; 
  const SPACING_Y = 100;
  const CANVAS_WIDTH = 1200; 
  const CENTER_OFFSET_X = CANVAS_WIDTH / 2;
  const START_Y_OFFSET = 50; 
  
  // --- ROADMAP DATA ---
  // Added 'iconSlug' to map to https://simpleicons.org/
  const nodes: RoadmapNode[] = [
    // 1. Fundamentals
    { id: 'internet', label: 'Internet', x: 0, y: 0, status: 'mastered', icon: Globe, parent: null, description: 'How the web works. DNS, HTTP, Hosting.' },
    { id: 'html', label: 'HTML', x: 0, y: 1, status: 'mastered', iconSlug: 'html5', parent: 'internet', description: 'Structure of the web. Semantic tags, DOM.' },
    { id: 'css', label: 'CSS', x: 0, y: 2, status: 'mastered', iconSlug: 'css3', parent: 'html', description: 'Styling the web. Box model, Grid, Flexbox.' },
    { id: 'js', label: 'JavaScript', x: 0, y: 3, status: 'available', iconSlug: 'javascript', parent: 'css', description: 'Programming the web. ES6+, Async/Await.' },

    // 2. Branch: Version Control (Left)
    { id: 'vcs', label: 'Version Control', x: -2, y: 3, status: 'available', iconSlug: 'git', parent: 'js', description: 'Tracking changes. Git basics.' },
    { id: 'git', label: 'Git', x: -3, y: 4, status: 'available', iconSlug: 'git', parent: 'vcs', description: 'Commit, Push, Pull, Merge.' },
    { id: 'repo', label: 'VCS Hosting', x: -1, y: 4, status: 'available', iconSlug: 'github', parent: 'vcs', description: 'GitHub, GitLab, Bitbucket.' },

    // 3. Branch: Package Managers (Right)
    { id: 'pkg', label: 'Package Mgrs', x: 2, y: 3, status: 'available', iconSlug: 'npm', parent: 'js', description: 'Managing dependencies.' },
    { id: 'npm', label: 'npm / yarn', x: 3, y: 4, status: 'available', iconSlug: 'npm', parent: 'pkg', description: 'Scripts, package.json.' },

    // 4. Modern Frontend (Center)
    { id: 'frameworks', label: 'Frameworks', x: 0, y: 5, status: 'available', icon: Cpu, parent: 'js', description: 'Modern UI libraries.' },
    
    // Framework Specifics (Grouped Example)
    { 
      id: 'deployment-group', 
      label: 'Deployment', 
      x: 0, 
      y: 6.5, 
      type: 'group',
      status: 'available', 
      parent: 'frameworks', 
      description: 'Hosting and CI/CD platforms.',
      children: ['vercel', 'netlify', 'githubpages', 'render']
    },

    // 5. Build Tools
    { id: 'build', label: 'Build Tools', x: 0, y: 8, status: 'available', icon: undefined, parent: 'deployment-group', description: 'Bundlers and transpilers.' },
    { id: 'vite', label: 'Vite', x: -1, y: 9, status: 'available', iconSlug: 'vite', parent: 'build', description: 'Next Gen Frontend Tooling.' },
    { id: 'linters', label: 'Linters', x: 1, y: 9, status: 'available', iconSlug: 'eslint', parent: 'build', description: 'ESLint, Prettier.' },
  ];

  const groupChildren: Record<string, RoadmapNode[]> = {
    'deployment-group': [
      { id: 'github-pages', label: 'GitHub Pages', x: 0, y: 0, status: 'mastered', iconSlug: 'github', parent: 'deployment-group', description: 'Static site hosting.' },
      { id: 'vercel', label: 'Vercel', x: 0, y: 0, status: 'available', iconSlug: 'vercel', parent: 'deployment-group', description: 'Frontend cloud.' },
      { id: 'netlify', label: 'Netlify', x: 0, y: 0, status: 'available', iconSlug: 'netlify', parent: 'deployment-group', description: 'Web development platform.' },
      { id: 'render', label: 'Render', x: 0, y: 0, status: 'available', iconSlug: 'render', parent: 'deployment-group', description: 'Unified cloud.' },
    ]
  };

  const SettingsIcon = ({ size, className }: { size: number; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const nodesWithIcons = nodes.map(n => n.id === 'build' ? { ...n, icon: SettingsIcon } : n);
  
  const getPos = (node: RoadmapNode) => {
    return {
      x: node.x * SPACING_X + CENTER_OFFSET_X,
      y: node.y * SPACING_Y + START_Y_OFFSET
    };
  };

  const getConnectorPath = (start: RoadmapNode, end: RoadmapNode) => {
    const startPos = getPos(start);
    const endPos = getPos(end);
    const y1Offset = start.type === 'group' ? 100 : 25; 
    const y2Offset = end.type === 'group' ? -35 : -25;
    const x1 = startPos.x;
    const y1 = startPos.y + y1Offset;
    const x2 = endPos.x;
    const y2 = endPos.y + y2Offset;
    const midY = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  };

  // Helper to render icon from CDN or fallback
  const RenderNodeIcon = ({ node, isMastered }: { node: RoadmapNode, isMastered: boolean }) => {
    if (node.iconSlug) {
      // Fetch from Simple Icons CDN
      // If mastered (Yellow bg), use Black icon. Otherwise use White.
      const color = isMastered ? '000000' : 'ffffff';
      return (
        <img 
          src={`https://cdn.simpleicons.org/${node.iconSlug}/${color}`} 
          alt={node.label} 
          className="w-4 h-4" 
        />
      );
    }
    
    // Fallback to Lucide icon
    const Icon = node.icon || ChevronRight;
    return <Icon size={16} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`, 
            backgroundSize: '30px 30px' 
          }} 
      />

      <Navbar />
      
      <main className="flex-grow pt-28 pb-10 z-10 relative">
        <section className="text-center mb-8 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
          >
            Frontend Roadmap
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-base text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            A step-by-step guide to becoming a modern frontend developer.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center gap-8 p-3 px-6 bg-card/80 backdrop-blur border border-border rounded-full shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Target size={16} className="text-primary" />
              <span className="text-xs font-bold text-foreground">12% DONE</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-warning" />
              <span className="text-xs font-bold text-foreground">2,450 XP</span>
            </div>
          </motion.div>
        </section>

        <div className="w-full overflow-x-auto overflow-y-hidden pb-12 scrollbar-hide">
          <div 
             className="relative mx-auto"
             style={{ width: `${CANVAS_WIDTH}px`, height: '1100px' }}
          >
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="6" 
                  markerHeight="4"
                  refX="5"
                  refY="2"
                  orient="auto"
                >
                  <path d="M0,0 L6,2 L0,4 L0,0" fill="hsl(var(--muted-foreground))" opacity="0.9" />
                </marker>
              </defs>

              {nodesWithIcons.map(node => {
                if (!node.parent) return null;
                const parentNode = nodesWithIcons.find(n => n.id === node.parent);
                if (!parentNode) return null;
                return (
                  <path
                    key={`${node.parent}-${node.id}`}
                    d={getConnectorPath(parentNode, node)}
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    className="transition-colors duration-500 opacity-60"
                  />
                );
              })}
            </svg>

            {nodesWithIcons.map((node) => {
              const pos = getPos(node);
              const isMastered = node.status === 'mastered';
              const isActive = activeNode?.id === node.id;
              
              if (node.type === 'group') {
                const children = groupChildren[node.id] || [];
                return (
                  <div
                    key={node.id}
                    style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}
                    className="absolute z-10 w-56"
                  >
                    <div className="bg-yellow-500 text-black rounded-lg shadow-lg overflow-hidden ring-4 ring-yellow-500/20">
                        <div className="bg-yellow-400 text-center py-1.5 font-bold text-xs tracking-wide uppercase">
                          {node.label}
                        </div>
                        <div className="grid grid-cols-2 gap-1 p-1 bg-yellow-50">
                          {children.map(child => (
                            <button
                              key={child.id}
                              onClick={(e) => { e.stopPropagation(); setActiveNode(child); }}
                              className={`
                                flex items-center justify-between px-2 py-1.5 rounded transition-all group/child
                                ${child.status === 'mastered' 
                                  ? 'bg-yellow-200 text-black font-semibold' 
                                  : 'bg-white text-slate-700 hover:bg-yellow-100'}
                              `}
                            >
                              <div className="flex items-center gap-1.5 overflow-hidden">
                                 {/* Render small icon for children too */}
                                 {child.iconSlug && <img src={`https://cdn.simpleicons.org/${child.iconSlug}`} alt="" className="w-3 h-3 opacity-80" />}
                                 <span className="text-[10px] truncate">{child.label}</span>
                              </div>
                              {child.status === 'mastered' && <CheckCircle2 size={10} className="text-black ml-1 flex-shrink-0" />}
                            </button>
                          ))}
                        </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={node.id}
                  onClick={(e) => { e.stopPropagation(); setActiveNode(node); }}
                  style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}
                  className={`
                    absolute z-10 group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 w-44 shadow-lg
                    ${isMastered 
                      ? 'bg-yellow-500 text-black shadow-yellow-500/20' 
                      : isActive 
                        ? 'bg-primary text-primary-foreground shadow-primary/40 scale-110 ring-4 ring-primary/20' 
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }
                  `}
                >
                  <div className={`p-1 rounded-md ${
                    isMastered ? 'bg-black/10 text-black' : 
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {isMastered ? <CheckCircle2 size={16} /> : <RenderNodeIcon node={node} isMastered={isMastered} />}
                  </div>
                  <span className="text-xs font-bold text-left leading-tight">
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer */}
        {activeNode && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[450px] z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-primary opacity-100" />
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                    {activeNode.label}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {activeNode.description}
                  </p>
                </div>
                <button onClick={() => setActiveNode(null)} className="p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-xl shadow-lg active:scale-[0.98] text-xs">
                  <BookOpen size={14} /> Start Lesson
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-xl border border-border active:scale-[0.98] text-xs">
                  <Target size={14} /> Challenge
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}