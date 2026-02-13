import React, { useState, useMemo, useCallback ,useEffect} from 'react';
import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState,
  Handle, 
  Position, 
  MarkerType,
  NodeProps,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css'; 
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
export const TopicGroupNode = ({ data }: NodeProps<AppNode>) => {
    const { childrenItems, side, label } = data;
    const handlePosition = side === 'right' ? Position.Left : Position.Right;
    const handleId = side === 'right' ? 'left' : 'right';
    const itemSourcePosition = side === 'right' ? Position.Right : Position.Left;
    const recommendedTooltip = side === 'left'
        ? {
            wrapper: "absolute right-full top-1/2 -translate-y-1/2 mr-2 z-[60] pointer-events-none hidden md:block",
            pointer: "absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-slate-900 dark:border-l-white"
          }
        : {
            wrapper: "absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[60] pointer-events-none hidden md:block",
            pointer: "absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-slate-900 dark:border-r-white"
          };

    return (
        <div className="relative group cursor-default">
            <Handle type="target" id={handleId} position={handlePosition} className="!bg-transparent !border-none" />
            <div className="w-[140px] md:w-[170px] bg-white/95 dark:bg-card/95 backdrop-blur-md border border-slate-300 dark:border-slate-700 rounded-xl shadow-xl p-2 md:p-3 flex flex-col gap-2 relative z-50 ring-1 ring-black/5">
                <h4 className="text-slate-400 dark:text-muted-foreground text-[9px] md:text-[10px] font-bold text-center mb-1 uppercase tracking-wider flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> {label}
                </h4>
                <div className="flex flex-col gap-2">
                    {childrenItems?.map((child: any) => (
                        <div
                            key={child.id}
                            className={`relative h-7 md:h-8 px-2 rounded-md font-bold text-[9px] md:text-[11px] shadow-sm border border-black/5 flex items-center justify-center transition-all duration-200 group/item hover:scale-105 ${
                                child.isRecommended
                                    ? 'bg-green-500 text-white ring-2 ring-green-500/20'
                                    : child.hasChildren
                                        ? 'bg-amber-400 text-black hover:bg-amber-300'
                                        : 'bg-yellow-400 text-black hover:bg-yellow-300'
                            }`}
                        >
                            {child.isRecommended && (
                                <div className={recommendedTooltip.wrapper}>
                                    <div className="relative bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-lg border border-slate-700 dark:border-slate-200 whitespace-nowrap">
                                        Recommended
                                        <div className={recommendedTooltip.pointer}></div>
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
