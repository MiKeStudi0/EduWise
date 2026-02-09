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
  Target, BookOpen, ChevronRight, X, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Assuming these exist in your project based on imports
import { TopicItemNode } from "@/components/roadmap/TopicItemNode";
import { OptionItemNode } from "@/components/roadmap/OptionItemNode";
import roadmapDataSource from "@/json/postgresql-dba.json";

// --- TYPE DEFINITIONS ---

type RoadmapChildType = 'subtopic' | 'module' | 'topic' | 'option';

// 1. Updated Child Data Structure with 'side'
interface RoadmapChild {
  id: string | number;
  label: string;
  type: RoadmapChildType; 
  status?: 'available' | 'mastered' | 'locked';
  recommendation?: string;
  icon_slug?: string;
  is_recommended?: boolean;
  // NEW: Explicit control over placement
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

const flattenHierarchy = (nodes: HierarchyNode[]): HierarchyNode[] => {
  return nodes.reduce((acc, node) => {
    acc.push(node);
    if (node.children) {
      acc.push(...flattenHierarchy(node.children));
    }
    return acc;
  }, [] as HierarchyNode[]);
};

const priorityFromRecommendation = (recommendation?: string, fallback?: number) => {
  if (recommendation === 'P') return 1;
  if (recommendation === 'A') return 2;
  return fallback ?? 0;
};

const resolveRecommended = (child: { is_recommended?: boolean }) => Boolean(child.is_recommended);

// 2. React Flow Node Data Types
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
  // NEW: Pass side to node to determine handle position
  side?: 'left' | 'right'; 
};

type AppNode = Node<NodeData, 'main' | 'topicGroup' | 'optionGroup' | 'topicItem' | 'optionItem'>;

// --- 1. MAIN BACKBONE NODE ---
const MainNode = ({ data, id }: NodeProps<AppNode>) => {
  const { label, status, iconSlug, type, isActive, onNodeClick } = data;
  const isGroup = type === 'group';
  const isMastered = status === 'mastered';

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onNodeClick && onNodeClick(id, data)}
        className={`
          relative z-10 flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 w-44 shadow-sm hover:shadow-md
          border cursor-grab active:cursor-grabbing
          ${isMastered 
            ? 'bg-blue-500 border-blue-600 text-white shadow-blue-500/20' 
            : isActive 
            ? 'bg-blue-600 border-blue-600 text-white scale-110 ring-4 ring-blue-600/20' 
            : 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40'}
        `}
      >
        <div className="p-1 rounded-md bg-white/20">
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

// --- 2. TOPIC CONTAINER NODE ---
// UPDATED: Dynamically switches Handle based on 'side' prop
const TopicGroupNode = ({ data }: NodeProps<AppNode>) => {
    const { childrenItems, side, onNodeClick, label } = data;
    
    // If this node is on the Right side, the connector comes from the Left.
    // If on the Left side (default), connector comes from the Right.
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
// UPDATED: Dynamically switches Handle based on 'side' prop
const OptionGroupNode = ({ data }: NodeProps<AppNode>) => {
    const { childrenItems, side, onNodeClick, label } = data;
    
    // Default options are on Right (Handle Left). If moved to Left, Handle is Right.
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
                        // Recommended Tooltip
                        <div className="absolute top-1/2 -translate-y-1/2 z-[60] pointer-events-none left-full ml-2">
                        <div className="relative bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg border border-slate-700 whitespace-nowrap">
                            Recommended
                            {/* Little triangle pointer logic */}
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

export default function FrontendRoadmapPage() {
  const [activeNodeData, setActiveNodeData] = useState<NodeData | null>(null);

  // --- CONFIGURATION ---
  const roadmapData: RoadmapStep[] = useMemo(
    () => roadmapDataSource as RoadmapStep[],
    []
  );


  const nodeTypes = useMemo(() => ({ 
      main: MainNode,
      topicGroup: TopicGroupNode,
      topicItem: TopicItemNode,
      optionItem: OptionItemNode,
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

  // --- DYNAMIC HEIGHT LAYOUT ALGORITHM (UPDATED) ---
  const { initialNodes, initialEdges, totalCanvasHeight } = useMemo(() => {
    const nodes: AppNode[] = [];
    const edges: Edge[] = [];
    
    let currentY = 50; 
    const MAIN_X = 0;
    const CONTAINER_OFFSET_X = 280; 
    const DEPTH_X_GAP = 220;
    const DEFAULT_GAP = 160;
    const TOPIC_ITEM_GAP = 40;

    roadmapData.forEach((step, index) => {
        // 1. FILTER: Normalize hierarchy, then split into Left/Right roots
        const hierarchy = normalizeHierarchy(step.children);
        const leftItems = hierarchy.filter(c => c.side === 'left');
        const rightItems = hierarchy.filter(c => c.side === 'right');
        
        // Check if loose layout is explicitly set
        // Note: We removed '|| hasNesting' because the user wants container style even for nested items
        const isLoose = step.ui_config?.topic_layout === 'loose';
        
        const leftCount = countNodes(leftItems);
        const rightCount = countNodes(rightItems);
        const maxItems = Math.max(leftCount, rightCount);
        const containerHeight = maxItems > 0 ? (maxItems * TOPIC_ITEM_GAP) + 40 : 0;
        const rowHeight = Math.max(containerHeight, DEFAULT_GAP);

        // 2. MAIN NODE
        nodes.push({
            id: step.slug,
            type: 'main',
            position: { x: MAIN_X, y: currentY },
            data: { 
              id: String(step.id),
              phaseId: step.id,
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

            nodes.push({
              id: nodeId,
              type: isOption ? 'optionItem' : 'topicItem',
              position: {
                x: MAIN_X + sign * (CONTAINER_OFFSET_X + (depth - 1) * DEPTH_X_GAP),
                y: cursorY
              },
              data: {
                id: String(item.id),
                phaseId: step.id,
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

                nodes.push({
                    id: groupId,
                    type: groupType,
                    position: { x: baseX, y: baseY },
                    data: {
                        id: groupId,
                        phaseId: step.id,
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
        if (index > 0) {
            const prevId = roadmapData[index - 1].slug;
            edges.push({
                id: `e-${prevId}-${step.slug}`,
                source: prevId, target: step.slug,
                sourceHandle: 'bottom',
                type: 'smoothstep',
                style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5, 5' },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
            });
        }

        currentY += rowHeight;
    });

    const totalCanvasHeight = currentY + 100;

    return { initialNodes: nodes, initialEdges: edges, totalCanvasHeight };
  }, [roadmapData, handleNodeClick]);

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-background text-foreground">
      <Navbar />
      
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

        <div 
            className="w-full relative border-t border-border bg-background backdrop-blur-sm"
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
            >
                <Background 
                  color="hsl(var(--primary) / 0.06)" 
                  gap={50} 
                  size={1} 
                  variant={BackgroundVariant.Lines} 
                />
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
      
      <Footer />
    </div>
  );
}