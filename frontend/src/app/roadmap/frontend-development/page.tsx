"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
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
  Target, BookOpen, ChevronRight, X, Globe, BrainCircuit, Code, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Assuming these exist in your project based on imports
import { TopicItemNode } from "@/components/roadmap/TopicItemNode";
import { OptionItemNode } from "@/components/roadmap/OptionItemNode";
import roadmapDataSource from "@/json/frontend-development.json";

// --- CONSTANTS ---
const PHASE_BRACKET_WIDTH = 120; // Reduced width for cleaner modern look
const PHASE_BRACKET_GAP = 40;
const PHASE_BRACKET_PADDING = 20;

// --- TYPE DEFINITIONS ---

type RoadmapChildType = 'subtopic' | 'module' | 'topic' | 'option';

interface RoadmapChild {
  id: string | number;
  label: string;
  type: RoadmapChildType; 
  status?: 'available' | 'mastered' | 'locked';
  recommendation?: string;
  icon_slug?: string;
  is_recommended?: boolean;
  side?: 'left' | 'right'; 
  children?: RoadmapChild[];
}

interface RoadmapStep {
  id: number;
  roadmap_id: number;
  title: string;
  short_title: string; 
  slug: string;        
  description: string;
  long_description: string;
  estimated_hours: number;
  recommendation: string;
  learning_objectives: string;
  outcomes: string;
  seo: {
    meta_title: string;
    meta_description: string;
  };
  ui_config?: {
    topic_layout: 'grouped' | 'loose'; 
    icon_slug?: string;
    node_type?: 'default' | 'group';
  };
  children: RoadmapChild[]; 
}

interface RoadmapPhase {
  phase_number: number;
  phase_name: string;
  phase_description: string;
  estimated_total_hours: number;
  topics: RoadmapStep[];
}

interface RoadmapRoot {
  title: string;
  description: string;
  phases: RoadmapPhase[];
  metadata?: {
    total_estimated_hours: number;
    total_topics: number;
    roadmap_version: string;
    last_updated: string;
  };
}

const isOptionType = (type?: RoadmapChildType) => type === 'option';
const resolveSide = (child: RoadmapChild, fallbackSide?: 'left' | 'right') =>
  child.side ?? fallbackSide ?? (isOptionType(child.type) ? 'right' : 'left');

type HierarchyNode = Omit<RoadmapChild, 'children' | 'side'> & {
  side: 'left' | 'right';
  children?: HierarchyNode[];
};

const normalizeHierarchy = (children: RoadmapChild[], parentSide?: 'left' | 'right'): HierarchyNode[] => {
  return children.map((child) => {
    const resolvedSide = resolveSide(child, parentSide);
    const { children: rawChildren, ...rest } = child;
    return {
      ...rest,
      side: resolvedSide,
      children: rawChildren ? normalizeHierarchy(rawChildren, resolvedSide) : undefined
    } as HierarchyNode;
  });
};

const countNodes = (nodes: HierarchyNode[]): number =>
  nodes.reduce((sum, node) => sum + 1 + countNodes(node.children ?? []), 0);

const priorityFromRecommendation = (recommendation?: string, fallback?: number) => {
  if (recommendation === 'P') return 1;
  if (recommendation === 'A') return 2;
  return fallback ?? 0;
};

const resolveRecommended = (child: { is_recommended?: boolean }) => Boolean(child.is_recommended);

// --- NODE DATA TYPES ---
type NodeData = {
  id: string;
  phaseId: string | number;
  topicId?: string | number;
  subtopicId?: string | number;
  priority?: number;
  depth?: number;
  label: string;
  status: 'available' | 'mastered';
  type?: 'default' | 'group'; 
  iconSlug?: string;
  description?: string;
  isActive?: boolean;
  childrenItems?: any[]; 
  onNodeClick?: (id: string, data: NodeData) => void;
  isRecommended?: boolean;
  side?: 'left' | 'right'; 
  phaseHeight?: number;
  phaseSubtitle?: string;
};

type AppNode = Node<NodeData, 'main' | 'topicGroup' | 'optionGroup' | 'topicItem' | 'optionItem' | 'phaseBracket'>;

// --- 1. MAIN BACKBONE NODE ---
const MainNode = ({ data, id }: NodeProps<AppNode>) => {
  const { label, status, iconSlug, type, isActive, onNodeClick } = data;
  const isMastered = status === 'mastered';

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onNodeClick && onNodeClick(id, data)}
        className={`
          relative z-10 flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 w-48 shadow-sm hover:shadow-md
          border cursor-grab active:cursor-grabbing
          ${isMastered 
            ? 'bg-blue-500 border-blue-600 text-white shadow-blue-500/20' 
            : isActive 
            ? 'bg-blue-600 border-blue-600 text-white scale-105 ring-4 ring-blue-600/20' 
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-foreground hover:border-blue-500/50'}
        `}
      >
        <div className={`p-1 rounded-md ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
          {iconSlug ? (
            <img src={`https://cdn.simpleicons.org/${iconSlug}`} alt="" className="w-4 h-4" />
          ) : (type === 'group' ? <Globe size={16} /> : <ChevronRight size={16} />)}
        </div>
        <span className="text-xs font-bold text-left">{label}</span>
      </motion.button>

      <Handle type="source" id="left" position={Position.Left} className="!bg-transparent !border-none" />
      <Handle type="source" id="right" position={Position.Right} className="!bg-transparent !border-none" />
      <Handle type="source" id="bottom" position={Position.Bottom} className="!bg-transparent !border-none" />
    </div>
  );
};

// --- 2. TOPIC CONTAINER NODE ---
const TopicGroupNode = ({ data }: NodeProps<AppNode>) => {
    const { childrenItems, side, label } = data;
    const handlePosition = side === 'right' ? Position.Left : Position.Right;
    const handleId = side === 'right' ? 'left' : 'right';
    const itemSourcePosition = side === 'right' ? Position.Right : Position.Left;

    return (
        <div className="relative group cursor-default">
            <Handle type="target" id={handleId} position={handlePosition} className="!bg-transparent !border-none" />
            <div className="w-[200px] bg-white/95 dark:bg-card/95 backdrop-blur-md border border-slate-200 dark:border-border rounded-xl shadow-xl p-3 flex flex-col gap-2 relative z-50">
                <h4 className="text-slate-400 dark:text-muted-foreground text-[10px] font-bold text-center mb-1 uppercase tracking-wider flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> {label}
                </h4>
                <div className="flex flex-col gap-2">
                    {childrenItems?.map((child: any) => (
                        <div
                            key={child.id}
                            className={`relative h-8 px-2 rounded-md font-bold text-[11px] shadow-sm border border-black/5 flex items-center justify-center transition-colors group/item ${
                                child.isRecommended
                                    ? 'bg-green-500 text-white ring-2 ring-green-500/20'
                                    : 'bg-yellow-400 text-black hover:bg-yellow-300'
                            }`}
                        >
                            {child.isRecommended && (
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[60] pointer-events-none">
                                    <div className="relative bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg border border-slate-700 whitespace-nowrap">
                                        Recommended
                                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-slate-900"></div>
                                    </div>
                                </div>
                            )}
                            {child.hasChildren && (
                                <Handle 
                                    type="source" 
                                    position={itemSourcePosition} 
                                    id={child.id}
                                    className="!bg-transparent !border-none w-2 h-2"
                                    style={{ [side === 'right' ? 'right' : 'left']: '-10px' }}
                                />
                            )}
                            <span className="truncate w-full text-center">{child.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 3. OPTION CONTAINER NODE ---
const OptionGroupNode = ({ data }: NodeProps<AppNode>) => {
    const { childrenItems, side, label } = data;
    const handlePosition = side === 'left' ? Position.Right : Position.Left;
    const handleId = side === 'left' ? 'right' : 'left';
    const itemSourcePosition = side === 'left' ? Position.Left : Position.Right;

    return (
        <div className="relative group cursor-default">
            <Handle type="target" id={handleId} position={handlePosition} className="!bg-transparent !border-none" />
            <div className="w-[200px] bg-white/95 dark:bg-card/95 backdrop-blur-md border border-slate-200 dark:border-border rounded-xl shadow-xl p-3 flex flex-col gap-2 relative z-50">
                <h4 className="text-slate-400 dark:text-muted-foreground text-[10px] font-bold text-center mb-1 uppercase tracking-wider flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {label}
                </h4>
                <div className="flex flex-col gap-2">
                {childrenItems?.map((child: any) => (
                    <div key={child.id} className="relative w-full group">
                    {child.isRecommended && (
                        <div className="absolute top-1/2 -translate-y-1/2 z-[60] pointer-events-none left-full ml-2">
                        <div className="relative bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg border border-slate-700 whitespace-nowrap">
                            Recommended
                            <div className="absolute top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent right-full border-r-[4px] border-r-slate-900"></div>
                        </div>
                        </div>
                    )}
                    <div className={`relative w-full h-8 px-3 rounded-md font-bold text-[11px] transition-all border border-black/5 flex items-center justify-center gap-2 shadow-sm ${child.isRecommended ? 'bg-green-500 text-white ring-2 ring-green-500/20' : 'bg-yellow-400 text-black hover:bg-yellow-300'}`}>
                        {child.hasChildren && (
                            <Handle 
                                type="source" 
                                position={itemSourcePosition} 
                                id={child.id}
                                className="!bg-transparent !border-none w-2 h-2"
                                style={{ [side === 'left' ? 'left' : 'right']: '-10px' }}
                            />
                        )}
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

// --- 4. PHASE BRACKET NODE (UPDATED & STYLED) ---
const getPhaseStyle = (phaseNum: number | string) => {
    const num = Number(phaseNum);
    switch (num) {
      case 1: return { color: "text-cyan-500", bg: "bg-cyan-500", border: "border-cyan-500/30", gradient: "from-cyan-500/50 to-transparent" };
      case 2: return { color: "text-violet-500", bg: "bg-violet-500", border: "border-violet-500/30", gradient: "from-violet-500/50 to-transparent" };
      case 3: return { color: "text-amber-500", bg: "bg-amber-500", border: "border-amber-500/30", gradient: "from-amber-500/50 to-transparent" };
      default: return { color: "text-slate-500", bg: "bg-slate-500", border: "border-slate-500/30", gradient: "from-slate-500/50 to-transparent" };
    }
  };
  
const PhaseBracketNode = ({ data }: NodeProps<AppNode>) => {
    const height = Math.max(120, data.phaseHeight ?? 120);
    const styles = getPhaseStyle(data.phaseId);

    return (
        <div 
        className="relative pointer-events-none flex flex-col" 
        style={{ height, width: PHASE_BRACKET_WIDTH }} 
        aria-hidden="true"
        >
            {/* Top Number Badge */}
            <div className={`absolute top-0 right-0 w-10 h-10 rounded-xl ${styles.bg} flex items-center justify-center shadow-lg shadow-${styles.color}/20 z-10`}>
                <span className="text-white font-black text-lg">{data.phaseId}</span>
            </div>

            {/* Vertical Gradient Line */}
            <div className="absolute top-10 right-5 bottom-0 w-[2px] h-[calc(100%-20px)] bg-slate-200 dark:bg-slate-800">
                <div className={`w-full h-1/2 bg-gradient-to-b ${styles.gradient}`} />
            </div>

            {/* Content Area */}
            <div className="absolute top-14 right-8 flex flex-col items-end text-right w-64 pr-2">
                <h3 className={`text-sm font-bold uppercase tracking-widest ${styles.color} mb-1`}>
                {data.phaseSubtitle}
                </h3>
                <p className="text-[10px] font-medium text-muted-foreground leading-tight opacity-80 line-clamp-3">
                {data.label}
                </p>
            </div>

            {/* Bottom decorative dot */}
            <div className={`absolute bottom-0 right-[17px] w-1.5 h-1.5 rounded-full ${styles.bg}`} />
        </div>
    );
};

export default function FrontendRoadmapPage() {
  const [activeNodeData, setActiveNodeData] = useState<NodeData | null>(null);
  const [activeTab, setActiveTab] = useState('roadmap');

  const tabs = [
    { id: 'roadmap', label: 'Roadmap', icon: BrainCircuit },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'practices', label: 'Best Practices', icon: Target },
    { id: 'quiz', label: 'Quiz', icon: Lock },
  ];

  // --- CONFIGURATION ---
  const roadmapRoot: RoadmapRoot = useMemo(
    () => (roadmapDataSource as { roadmap: RoadmapRoot }).roadmap,
    []
  );
  const phases = roadmapRoot.phases ?? [];

  const nodeTypes = useMemo(() => ({ 
      main: MainNode,
      topicGroup: TopicGroupNode,
      topicItem: TopicItemNode,
      optionItem: OptionItemNode,
      optionGroup: OptionGroupNode,
      phaseBracket: PhaseBracketNode
  }), []);

  const handleNodeClick = useCallback((id: string, data: NodeData) => {
      setActiveNodeData(data);
      setNodes((nds) => nds.map((n) => ({
          ...n,
          style: { zIndex: n.id === id ? 1000 : 1 }, 
          data: { ...n.data, isActive: n.id === id }
      })));
  }, []);

  // --- DYNAMIC HEIGHT LAYOUT ALGORITHM ---
  const { initialNodes, initialEdges, totalCanvasHeight } = useMemo(() => {
    const nodes: AppNode[] = [];
    const edges: Edge[] = [];
    
    let currentY = 50; 
    let minX = 0;
    const MAIN_X = 0;
    const CONTAINER_OFFSET_X = 280; 
    const DEPTH_X_GAP = 220;
    const DEFAULT_GAP = 160;
    const TOPIC_ITEM_GAP = 40;

    const phaseMarkers: Array<{
      id: string;
      label: string;
      subtitle: string;
      startY: number;
      endY: number;
      phaseId: number | string;
    }> = [];

    const pushNode = (node: AppNode) => {
      nodes.push(node);
      minX = Math.min(minX, node.position.x);
    };

    let previousStepSlug: string | null = null;

    phases.forEach((phase) => {
      if (!phase.topics || phase.topics.length === 0) {
        return;
      }

      const phaseStartY = currentY;

      phase.topics.forEach((step, index) => {
        // 1. FILTER: Normalize hierarchy, then split into Left/Right roots
        const hierarchy = normalizeHierarchy(step.children);
        const leftItems = hierarchy.filter(c => c.side === 'left');
        const rightItems = hierarchy.filter(c => c.side === 'right');
        
        // Check if loose layout is explicitly set
        const isLoose = step.ui_config?.topic_layout === 'loose';
        
        const leftCount = countNodes(leftItems);
        const rightCount = countNodes(rightItems);
        const maxItems = Math.max(leftCount, rightCount);
        const containerHeight = maxItems > 0 ? (maxItems * TOPIC_ITEM_GAP) + 40 : 0;
        const rowHeight = Math.max(containerHeight, DEFAULT_GAP);

        // 2. MAIN NODE
        pushNode({
            id: step.slug,
            type: 'main',
            position: { x: MAIN_X, y: currentY },
            data: { 
              id: String(step.id),
              phaseId: phase.phase_number,
              priority: index + 1,
              depth: 0,
              label: step.short_title, 
              status: 'available', 
              iconSlug: step.ui_config?.icon_slug,
              type: step.ui_config?.node_type || 'default',
              description: step.description,
              onNodeClick: handleNodeClick, 
              isActive: false 
            }
        });

        const layoutSideRecursive = (
          items: HierarchyNode[],
          side: 'left' | 'right',
          startY: number
        ) => {
          let cursorY = startY;
          const sign = side === 'left' ? -1 : 1;

          const walk = (
            item: HierarchyNode,
            depth: number,
            parentNodeId: string,
            topicId?: string | number,
            subtopicId?: string | number,
            order?: number
          ) => {
            const nodeId = `${step.slug}-${side}-${depth}-${item.id}`;
            const isOption = isOptionType(item.type);
            const itemStatus = item.status ?? 'available';
            const nextTopicId = depth === 1 ? item.id : topicId;
            const nextSubtopicId = depth === 2 ? item.id : subtopicId;

            pushNode({
              id: nodeId,
              type: isOption ? 'optionItem' : 'topicItem',
              position: {
                x: MAIN_X + sign * (CONTAINER_OFFSET_X + (depth - 1) * DEPTH_X_GAP),
                y: cursorY
              },
              data: {
                id: String(item.id),
                phaseId: phase.phase_number,
                topicId: nextTopicId,
                subtopicId: nextSubtopicId,
                priority: priorityFromRecommendation(item.recommendation, order),
                depth,
                label: item.label,
                status: itemStatus as any,
                iconSlug: item.icon_slug,
                isRecommended: resolveRecommended(item),
                side
              }
            });

            edges.push({
              id: `e-${parentNodeId}-${nodeId}`,
              source: parentNodeId,
              target: nodeId,
              sourceHandle: side,
              targetHandle: side === 'left' ? 'right' : 'left',
              type: 'smoothstep',
              style: { stroke: isOption ? '#22c55e' : '#fbbf24', strokeWidth: 2, strokeDasharray: '4, 4' },
            });

            cursorY += TOPIC_ITEM_GAP;

            item.children?.forEach((child, childIndex) => {
              walk(child, depth + 1, nodeId, nextTopicId, nextSubtopicId, childIndex + 1);
            });
          };

          items.forEach((item, index) => {
            walk(item, 1, step.slug, undefined, undefined, index + 1);
          });
        };

        if (isLoose) {
            if (leftCount > 0) {
              const startY = currentY - ((leftCount - 1) * TOPIC_ITEM_GAP) / 2;
              layoutSideRecursive(leftItems, 'left', startY);
            }

            if (rightCount > 0) {
              const startY = currentY - ((rightCount - 1) * TOPIC_ITEM_GAP) / 2;
              layoutSideRecursive(rightItems, 'right', startY);
            }
        } else {
            // GROUPED LAYOUT (Recursive Containers)
            
            const layoutGroupRecursive = (
                items: HierarchyNode[],
                side: 'left' | 'right',
                baseX: number,
                baseY: number,
                parentId: string,
                parentHandleId: string | null
            ): number => {
                if (items.length === 0) return 0;

                const groupId = `${step.slug}-group-${parentId}-${items[0].id}`;
                const isOptionGroup = items.length > 0 && items.every(i => isOptionType(i.type));
                const groupType = isOptionGroup ? 'optionGroup' : 'topicGroup';
                const groupHeight = (items.length * 40) + 50;

                pushNode({
                    id: groupId,
                    type: groupType,
                    position: { x: baseX, y: baseY },
                    data: {
                        id: groupId,
                        phaseId: phase.phase_number,
                        label: isOptionGroup ? 'Options' : 'Topics',
                        status: 'available',
                        side: side,
                        childrenItems: items.map(t => ({
                            ...t,
                            id: String(t.id),
                            iconSlug: t.icon_slug,
                            isRecommended: resolveRecommended(t),
                            hasChildren: t.children && t.children.length > 0
                        }))
                    }
                });

                // Edge from Parent
                edges.push({
                    id: `e-${parentId}-${groupId}`,
                    source: parentId,
                    target: groupId,
                    sourceHandle: parentHandleId || side, // if null, use side (main node)
                    targetHandle: side === 'left' ? 'right' : 'left',
                    type: 'smoothstep',
                    style: { stroke: isOptionGroup ? '#22c55e' : '#fbbf24', strokeWidth: 2, strokeDasharray: '4, 4' },
                });

                // Process Children Groups
                let currentChildY = baseY;
                let maxChildHeight = 0;

                items.forEach((item) => {
                    if (item.children && item.children.length > 0) {
                        const offset = side === 'left' ? -250 : 250;
                        const childHeight = layoutGroupRecursive(
                            item.children,
                            side,
                            baseX + offset,
                            currentChildY,
                            groupId,
                            String(item.id)
                        );
                        currentChildY += Math.max(childHeight, 40) + 20;
                        maxChildHeight += Math.max(childHeight, 40) + 20;
                    }
                });

                return Math.max(groupHeight, maxChildHeight);
            };

            if (leftCount > 0) {
                layoutGroupRecursive(leftItems, 'left', MAIN_X - CONTAINER_OFFSET_X, currentY, step.slug, null);
            }
            if (rightCount > 0) {
                layoutGroupRecursive(rightItems, 'right', MAIN_X + CONTAINER_OFFSET_X, currentY, step.slug, null);
            }
        }

        // 5. CONNECTOR (Vertical Line)
        if (previousStepSlug) {
            edges.push({
                id: `e-${previousStepSlug}-${step.slug}`,
                source: previousStepSlug, target: step.slug,
                sourceHandle: 'bottom',
                type: 'smoothstep',
                style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5, 5' },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
            });
        }

        previousStepSlug = step.slug;
        currentY += rowHeight;
      });

      const phaseEndY = currentY;
      phaseMarkers.push({
        id: `phase-${phase.phase_number}`,
        label: phase.phase_description, // UPDATED: Use description for text
        subtitle: phase.phase_name,     // UPDATED: Use Name for Title
        startY: phaseStartY,
        endY: phaseEndY,
        phaseId: phase.phase_number
      });
    });

    const bracketX = minX - PHASE_BRACKET_WIDTH - PHASE_BRACKET_GAP;
    phaseMarkers.forEach((marker) => {
      const phaseHeight = Math.max(DEFAULT_GAP, marker.endY - marker.startY) + PHASE_BRACKET_PADDING * 2;
      pushNode({
        id: marker.id,
        type: 'phaseBracket',
        position: { x: bracketX, y: marker.startY - PHASE_BRACKET_PADDING },
        data: {
          id: marker.id,
          phaseId: marker.phaseId,
          label: marker.label,
          status: 'available',
          phaseSubtitle: marker.subtitle,
          phaseHeight
        },
        draggable: false,
        selectable: false,
        focusable: false
      });
    });

    const totalCanvasHeight = currentY + 100;

    return { initialNodes: nodes, initialEdges: edges, totalCanvasHeight };
  }, [phases, handleNodeClick]);

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-background text-foreground font-sans">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-0 z-10 relative flex flex-col items-center">
        
        {/* --- DYNAMIC HEADER --- */}
        <section className="text-center mb-6 px-4 max-w-4xl w-full">
           <motion.div
             initial={{ opacity: 0, y: 20 }} 
             animate={{ opacity: 1, y: 0 }}
             className="inline-block mb-3 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase"
           >
             Career Path
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }} 
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-slate-900 dark:text-white"
           >
             {roadmapRoot.title}
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
           >
             {roadmapRoot.description}
           </motion.p>
        </section>

        {/* --- TAB NAVIGATION --- */}
        <div className="w-full max-w-4xl px-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-8 border-b border-slate-200 dark:border-slate-800">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 pb-4 px-2 text-sm font-bold transition-colors
                    ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                  {isActive && (
                    <motion.div 
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 dark:bg-blue-400 rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="w-full flex-grow relative bg-slate-50/50 dark:bg-black/20">
          
          {activeTab === 'roadmap' ? (
            <div 
              className="w-full h-full min-h-[600px] border-t border-slate-200 dark:border-slate-800"
              style={{ height: `${totalCanvasHeight}px` }}
            >
              <ReactFlow<AppNode>
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                panOnDrag={false}        
                zoomOnScroll={false}     
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                panOnScroll={false}      
                preventScrolling={false} 
                nodesDraggable={true}    
                nodesConnectable={false}
                minZoom={1} 
                maxZoom={1}
                attributionPosition="bottom-right"
                proOptions={{ hideAttribution: true }}
              >
                <Background 
                  color="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  gap={40} 
                  size={1} 
                  variant={BackgroundVariant.Dots} 
                />
              </ReactFlow>
            </div>
          ) : (
            // --- COMING SOON PLACEHOLDER ---
            <div className="w-full h-[400px] flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Lock className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                The {tabs.find(t => t.id === activeTab)?.label} module is currently under development. 
                Focus on the roadmap for now!
              </p>
            </div>
          )}
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
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden ring-1 ring-black/5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                          {activeNodeData.label}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">
                          {activeNodeData.description || "Master this concept to progress."}
                      </p>
                    </div>
                    <button 
                        onClick={() => {
                            setActiveNodeData(null);
                            setNodes((nds) => nds.map(n => ({ ...n, style: { zIndex: 1 }, data: { ...n.data, isActive: false } })));
                        }} 
                        className="p-2 -mr-2 -mt-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-6">
                      <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
                        <BookOpen size={18} /> Start Learning
                      </button>
                      <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-bold rounded-xl active:scale-[0.98] transition-all">
                        <Target size={18} /> Mark Complete
                      </button>
                  </div>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}