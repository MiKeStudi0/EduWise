import { motion, AnimatePresence } from "framer-motion";
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
import { ChevronRight, Globe } from "lucide-react";
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

const getIconBadgeStyle = (slug?: string): React.CSSProperties => {
  const seedSource = slug ?? 'roadmap';
  const seed = seedSource
    .split('')
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 360, 0);
  const accentHue = (seed + 32) % 360;

  return {
    background: `linear-gradient(135deg, hsl(${seed} 82% 58%), hsl(${accentHue} 84% 46%))`,
    boxShadow: `0 6px 14px hsla(${seed}, 90%, 36%, 0.35)`,
  };
};

export const MainNode = ({ data, id }: NodeProps<AppNode>) => {
  const { label, status, iconSlug, type, isActive, onNodeClick } = data;
  const isMastered = status === 'mastered';
  const iconBadgeStyle = useMemo(() => getIconBadgeStyle(iconSlug), [iconSlug]);

  return (
    <div className="relative group">
      <Handle type="target" id="top" position={Position.Top} className="!bg-transparent !border-none" />
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onNodeClick && onNodeClick(id, data)}
        style={{ touchAction: 'pan-y' }}
        className={`
          relative z-10 flex items-center gap-3 px-2 md:px-3 py-1.5 md:py-2.5 rounded-xl transition-all duration-300 w-36 md:w-44 shadow-lg hover:shadow-xl
          border cursor-grab active:cursor-grabbing hover:scale-105
          ${isActive 
            ? 'bg-blue-700 border-blue-800 text-white scale-105 ring-4 ring-blue-500/30' 
            : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500'}
        `}
      >
        <div className="p-1.5 rounded-lg text-white shadow-inner ring-1 ring-white/35" style={iconBadgeStyle}>
          {iconSlug ? (
            <img src={`https://cdn.simpleicons.org/${iconSlug}/ffffff`} alt="" className="w-4 h-4" />
          ) : (type === 'group' ? <Globe size={16} /> : <ChevronRight size={16} />)}
        </div>
        <span className="text-[10px] md:text-xs font-bold text-left tracking-tight">{label}</span>
      </motion.button>

      <Handle type="source" id="left" position={Position.Left} className="!bg-transparent !border-none" />
      <Handle type="source" id="right" position={Position.Right} className="!bg-transparent !border-none" />
      <Handle type="source" id="bottom" position={Position.Bottom} className="!bg-transparent !border-none" />
    </div>
  );
};
