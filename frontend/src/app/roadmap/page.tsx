"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  Handle, 
  Position, 
  MarkerType,
  NodeProps,
  Edge,
  Node, 
  BackgroundVariant 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css'; 

import { Navbar } from "@/components/layout/Navbar"; 
import { Footer } from "@/components/layout/Footer"; 
import { 
  Target, BookOpen, ChevronRight, X, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { TopicItemNode } from "@/components/roadmap/TopicItemNode";

// --- TYPE DEFINITIONS ---

interface RawRoadmapNode {
  id: string;
  label: string;
  type?: 'default' | 'group'; 
  status: 'available' | 'mastered';
  iconSlug?: string; 
  description?: string;
  subType?: 'topic' | 'option'; 
  isRecommended?: boolean;      
}

type NodeData = {
  label: string;
  status: 'available' | 'mastered';
  type?: 'default' | 'group'; 
  iconSlug?: string;
  description?: string;
  isActive?: boolean;
  childrenItems?: RawRoadmapNode[]; 
  onNodeClick?: (id: string, data: NodeData) => void;
};

type AppNode = Node<NodeData, 'main' | 'topicGroup' | 'optionGroup' | 'topicItem'>;

// --- 1. MAIN BACKBONE NODE ---
const MainNode = ({ data, id }: NodeProps<AppNode>) => {
  const { label, status, iconSlug, type, isActive, onNodeClick } = data;
  const isGroup = type === 'group';
  const isMastered = status === 'mastered';

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNodeClick && onNodeClick(id, data)}
        className={`
          relative z-10 flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 w-44 shadow-sm hover:shadow-md
          border cursor-grab active:cursor-grabbing
          ${isMastered 
            ? 'bg-yellow-400 border-yellow-500 text-black shadow-yellow-500/20' 
            : isActive 
            ? 'bg-indigo-600 border-indigo-600 text-white scale-110 ring-4 ring-indigo-600/20' 
            : 'bg-white dark:bg-card border-slate-200 dark:border-border text-slate-700 dark:text-card-foreground hover:border-slate-300 dark:hover:bg-accent hover:text-slate-900 dark:hover:text-accent-foreground'}
        `}
      >
        <div className={`p-1 rounded-md ${isMastered ? 'bg-black/10' : 'bg-muted'}`}>
          {iconSlug ? (
            <img src={`https://cdn.simpleicons.org/${iconSlug}`} alt="" className="w-4 h-4" />
          ) : isGroup ? (
            <Globe size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </div>
        <span className="text-xs font-bold">{label}</span>
      </motion.button>

      <Handle type="source" id="left" position={Position.Left} className="!bg-transparent !border-none" />
      <Handle type="source" id="right" position={Position.Right} className="!bg-transparent !border-none" />
      <Handle type="source" id="bottom" position={Position.Bottom} className="!bg-transparent !border-none" />
    </div>
  );
};

// --- 2. TOPIC CONTAINER NODE (Left) ---
const TopicGroupNode = ({ data }: NodeProps<AppNode>) => {
    const { childrenItems } = data;
    return (
        <div className="relative group cursor-default">
            <Handle type="target" position={Position.Right} className="!bg-transparent !border-none" />
            <div className="w-[200px] bg-white/95 dark:bg-card/95 backdrop-blur-md border border-slate-200 dark:border-border rounded-xl shadow-xl p-3 flex flex-col gap-2 relative z-50">
                <h4 className="text-slate-400 dark:text-muted-foreground text-[10px] font-bold text-center mb-1 uppercase tracking-wider flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> Topics
                </h4>
                <div className="flex flex-col gap-2">
                    {childrenItems?.map((child) => (
                        <div key={child.id} className="h-8 px-2 rounded-md font-bold text-[11px] text-black shadow-sm border border-black/5 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 transition-colors">
                            <span className="truncate w-full text-center">{child.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 3. OPTION CONTAINER NODE (Right) ---
const OptionGroupNode = ({ data }: NodeProps<AppNode>) => {
    const { childrenItems } = data;
    return (
        <div className="relative group cursor-default">
            <Handle type="target" position={Position.Left} className="!bg-transparent !border-none" />
            <div className="w-[200px] bg-white/95 dark:bg-card/95 backdrop-blur-md border border-slate-200 dark:border-border rounded-xl shadow-xl p-3 flex flex-col gap-2 relative z-50">
                <h4 className="text-slate-400 dark:text-muted-foreground text-[10px] font-bold text-center mb-1 uppercase tracking-wider flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Options
                </h4>
                <div className="flex flex-col gap-2">
                {childrenItems?.map((child) => (
                    <div key={child.id} className="relative w-full group">
                    {child.isRecommended && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[60] pointer-events-none">
                        <div className="relative bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg border border-slate-700 whitespace-nowrap">
                            Recommended
                            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-slate-900"></div>
                        </div>
                        </div>
                    )}
                    <div className={`w-full h-8 px-3 rounded-md font-bold text-[11px] transition-all border border-black/5 flex items-center justify-center gap-2 shadow-sm ${child.isRecommended ? 'bg-green-500 text-white ring-2 ring-green-500/20' : 'bg-yellow-400 text-black hover:bg-yellow-300'}`}>
                        {child.iconSlug && <img src={`https://cdn.simpleicons.org/${child.iconSlug}`} alt="" className="w-3.5 h-3.5" />}
                        <span className="truncate">{child.label}</span>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default function FrontendRoadmapPage() {
  const [activeNodeData, setActiveNodeData] = useState<NodeData | null>(null);

  const rawBackbone: RawRoadmapNode[] = useMemo(() => [
    { id: 'internet', label: 'Internet', x: 0, y: 0, type: 'group', status: 'mastered', iconSlug: 'internetexplorer', description: 'How the web works. DNS, HTTP, Browsers.' },
    { id: 'html', label: 'HTML', x: 0, y: 0, status: 'mastered', iconSlug: 'html5', description: 'Structure of the web.' },
    { id: 'css', label: 'CSS', x: 0, y: 0, status: 'mastered', iconSlug: 'css3', description: 'Styling the web.' },
    { id: 'javascript', label: 'JavaScript', x: 0, y: 0, status: 'available', iconSlug: 'javascript', description: 'Programming the web.' },
    { id: 'frameworks', label: 'Frameworks', x: 0, y: 0, type: 'group', status: 'available', description: 'Modern UI libraries.' },
  ], []);

  const groupChildren: Record<string, RawRoadmapNode[]> = useMemo(() => ({
    'internet': [
      { id: 'how-internet-works', label: 'How it works', status: 'mastered', subType: 'topic' } as any,
      { id: 'http', label: 'HTTP', status: 'mastered', subType: 'topic' },
      { id: 'dns', label: 'DNS', status: 'mastered', subType: 'topic' },
      { id: 'chrome', label: 'Chrome', status: 'available', iconSlug: 'googlechrome', subType: 'option', isRecommended: true },
      { id: 'firefox', label: 'Firefox', status: 'available', iconSlug: 'firefox', subType: 'option' },
    ],
    'frameworks': [
      { id: 'components', label: 'Components', status: 'available', subType: 'topic' },
      { id: 'state', label: 'State', status: 'available', subType: 'topic' },
      { id: 'props', label: 'Props', status: 'available', subType: 'topic' },
      { id: 'hooks', label: 'Hooks', status: 'available', subType: 'topic' },
      { id: 'react', label: 'React', status: 'available', iconSlug: 'react', subType: 'option', isRecommended: true },
      { id: 'vue', label: 'Vue.js', status: 'available', iconSlug: 'vuedotjs', subType: 'option' },
      { id: 'angular', label: 'Angular', status: 'available', iconSlug: 'angular', subType: 'option' },
      { id: 'svelte', label: 'Svelte', status: 'available', iconSlug: 'svelte', subType: 'option' },
    ]
  }), []);

  const nodeTypes = useMemo(() => ({ 
      main: MainNode,
      topicGroup: TopicGroupNode,
      topicItem: TopicItemNode,
      optionGroup: OptionGroupNode
  }), []);

  const handleNodeClick = useCallback((id: string, data: NodeData) => {
      setActiveNodeData(data);
      setNodes((nds) => nds.map((n) => ({
          ...n,
          style: { zIndex: n.id === id ? 1000 : 1 }, 
          data: { ...n.data, isActive: n.id === id }
      })));
  }, []);

  // --- DYNAMIC HEIGHT LAYOUT ---
  const { initialNodes, initialEdges, totalCanvasHeight } = useMemo(() => {
    const nodes: AppNode[] = [];
    const edges: Edge[] = [];
    
    // We start Y at 50 to give some top padding
    let currentY = 50; 
    const MAIN_X = 0;
    const CONTAINER_OFFSET_X = 280; 
    const DEFAULT_GAP = 160;
    const TOPIC_ITEM_GAP = 40;

    rawBackbone.forEach((mainNode, index) => {
        const children = groupChildren[mainNode.id] || [];
        const topics = children.filter(c => c.subType === 'topic');
        const options = children.filter(c => c.subType === 'option');
        
        const maxItems = Math.max(topics.length, options.length);
        const containerHeight = maxItems > 0 ? (maxItems * 40) + 80 : 0;
        const rowHeight = Math.max(containerHeight, DEFAULT_GAP);

        // 1. MAIN NODE
        nodes.push({
            id: mainNode.id,
            type: 'main',
            position: { x: MAIN_X, y: currentY },
            data: { ...mainNode, onNodeClick: handleNodeClick, isActive: false }
        });

        // 2. TOPIC NODES (Left)
        if (topics.length > 0) {
            const useStandaloneTopics = mainNode.id === 'internet';

            if (useStandaloneTopics) {
                const startY = currentY - ((topics.length - 1) * TOPIC_ITEM_GAP) / 2;

                topics.forEach((topic, topicIndex) => {
                    const topicNodeId = `${mainNode.id}-topic-${topic.id}`;
                    nodes.push({
                        id: topicNodeId,
                        type: 'topicItem',
                        position: { 
                            x: MAIN_X - CONTAINER_OFFSET_X, 
                            y: startY + (topicIndex * TOPIC_ITEM_GAP) 
                        },
                        data: { label: topic.label, status: topic.status }
                    });

                    edges.push({
                        id: `e-${mainNode.id}-${topicNodeId}`,
                        source: mainNode.id,
                        target: topicNodeId,
                        sourceHandle: 'left',
                        type: 'smoothstep',
                        style: { stroke: '#fbbf24', strokeWidth: 2, strokeDasharray: '4, 4' },
                    });
                });
            } else {
                nodes.push({
                    id: `${mainNode.id}-topics`,
                    type: 'topicGroup',
                    position: { 
                        x: MAIN_X - CONTAINER_OFFSET_X, 
                        y: currentY - ((topics.length * 40)/2) + 20 
                    },
                    data: { label: 'Topics', status: 'available', childrenItems: topics }
                });

                edges.push({
                    id: `e-${mainNode.id}-topics`,
                    source: mainNode.id,
                    target: `${mainNode.id}-topics`,
                    sourceHandle: 'left',
                    type: 'smoothstep',
                    style: { stroke: '#fbbf24', strokeWidth: 2, strokeDasharray: '4, 4' },
                });
            }
        }

        // 3. OPTION CONTAINER (Right)
        if (options.length > 0) {
            nodes.push({
                id: `${mainNode.id}-options`,
                type: 'optionGroup',
                position: { 
                    x: MAIN_X + CONTAINER_OFFSET_X, 
                    y: currentY - ((options.length * 40)/2) + 20 
                },
                data: { label: 'Options', status: 'available', childrenItems: options }
            });

            edges.push({
                id: `e-${mainNode.id}-options`,
                source: mainNode.id,
                target: `${mainNode.id}-options`,
                sourceHandle: 'right',
                type: 'smoothstep',
                style: { stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '4, 4' },
            });
        }

        // 4. CONNECTOR
        if (index > 0) {
            const prevId = rawBackbone[index - 1].id;
            edges.push({
                id: `e-${prevId}-${mainNode.id}`,
                source: prevId,
                target: mainNode.id,
                sourceHandle: 'bottom',
                type: 'smoothstep',
                style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5, 5' },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
            });
        }

        currentY += rowHeight;
    });

    // Add extra padding at the bottom for the last node
    const totalCanvasHeight = currentY + 100;

    return { initialNodes: nodes, initialEdges: edges, totalCanvasHeight };
  }, [rawBackbone, groupChildren, handleNodeClick]);

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-background text-foreground">
      <Navbar />
      
      {/* 1. 'flex-grow' ensures this section takes up available space 
          2. We removed fixed height (h-screen) so it can grow naturally 
      */}
      <main className="flex-grow pt-28 pb-0 z-10 relative flex flex-col">
        <section className="text-center mb-8 px-4 flex-shrink-0">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-5xl font-bold mb-4"
           >
             Frontend Roadmap
           </motion.h1>
           <p className="text-base text-muted-foreground max-w-2xl mx-auto">
             A step-by-step guide to becoming a modern frontend developer.
           </p>
        </section>

        {/* DYNAMIC HEIGHT WRAPPER 
            We apply totalCanvasHeight here. This forces the div to be exactly as tall
            as the chart, pushing the footer down naturally.
        */}
        <div 
            className="w-full relative border-t border-slate-200 dark:border-border bg-slate-50/50 dark:bg-background/50 backdrop-blur-sm"
            style={{ height: `${totalCanvasHeight}px` }}
        >
            <ReactFlow<AppNode>
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                // --- LOCK VIEWPORT ---
                panOnDrag={false}        // Disable dragging the whole canvas
                zoomOnScroll={false}     // Disable zooming with scroll
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                panOnScroll={false}      // Allow normal browser scrolling
                preventScrolling={false} // Important: Lets the browser window scroll
                
                // --- ENABLE NODE INTERACTION ---
                nodesDraggable={true}    // You can still drag individual nodes
                nodesConnectable={false}
                
                minZoom={1} // Lock Zoom to 1 so it matches pixel height perfectly
                maxZoom={1}
                attributionPosition="bottom-right"
            >
                <Background 
                  color="#94a3b8" 
                  gap={20} 
                  size={1} 
                  variant={BackgroundVariant.Dots} 
                  className="opacity-20" 
                />
                {/* Removed Controls because zooming/panning is disabled */}
            </ReactFlow>
        </div>

        {/* DRAWER COMPONENT */}
        <AnimatePresence>
            {activeNodeData && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[450px] z-50"
            >
                <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-600 opacity-100" />
                <div className="flex justify-between items-start mb-2">
                    <div>
                    <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                        {activeNodeData.label}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        {activeNodeData.description || "Master this concept to progress."}
                    </p>
                    </div>
                    <button 
                        onClick={() => {
                            setActiveNodeData(null);
                            setNodes((nds) => nds.map(n => ({ ...n, style: { zIndex: 1 }, data: { ...n.data, isActive: false } })));
                        }} 
                        className="p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
                    >
                    <X size={16} />
                    </button>
                </div>
                <div className="flex gap-3 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg active:scale-[0.98] text-xs">
                    <BookOpen size={14} /> Start Lesson
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-xl border border-border active:scale-[0.98] text-xs">
                    <Target size={14} /> Challenge
                    </button>
                </div>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
      </main>
      
      {/* Footer will now naturally appear after the specific chart height */}
      <Footer />
    </div>
  );
}
