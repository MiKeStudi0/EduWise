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
// --- HOOKS ---
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const getPhaseStyle = (phaseNum: number | string) => {
    const num = Number(phaseNum);
    switch (num) {
      case 1: return { color: "#06b6d4", text: "text-cyan-500", bg: "bg-cyan-500" }; // Cyan
      case 2: return { color: "#8b5cf6", text: "text-violet-500", bg: "bg-violet-500" }; // Violet
      case 3: return { color: "#f59e0b", text: "text-amber-500", bg: "bg-amber-500" }; // Amber
      default: return { color: "#64748b", text: "text-slate-500", bg: "bg-slate-500" }; // Slate
    }
  };
  
type AppNode = Node<NodeData, 'main' | 'topicGroup' | 'optionGroup' | 'topicItem' | 'optionItem' | 'phaseBracket'>;
export const PhaseBracketNode = ({ data }: NodeProps<AppNode>) => {
    const isMobile = useIsMobile();
    const height = Math.max(120, data.phaseHeight ?? 120);
    const styles = getPhaseStyle(data.phaseId);
    
    // SVG Geometry for a Left-Facing Curly Brace "{"
    const w = isMobile ? 20 : 40; // width of the bracket area
    const q = isMobile ? 5 : 10; // curve radius
    const mid = height / 2;

    // Path Logic: Top Right -> Curve TL -> Down -> Curve In (Point) -> Curve Out -> Down -> Curve BL -> Bottom Right
    const pathData = `
        M ${w} 0 
        Q 0 0 0 ${q} 
        L 0 ${mid - q} 
        Q 0 ${mid} ${-q*1.5} ${mid} 
        Q 0 ${mid} 0 ${mid + q} 
        L 0 ${height - q} 
        Q 0 ${height} ${w} ${height}
    `;

    return (
        <div 
            className="relative pointer-events-none flex flex-col items-center justify-center transition-all duration-300" 
            style={{ height, width: isMobile ? 0 : 140, display: isMobile ? 'none' : 'flex' }} 
            aria-hidden="true"
        >
            {/* The Curly Brace SVG */}
            <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                    width={isMobile ? 30 : 50} 
                    height={height} 
                    viewBox={`-20 0 50 ${height}`} 
                    fill="none" 
                    className="drop-shadow-sm origin-left"
                    style={{ transform: 'translateX(20px)' }}
                >
                    <path 
                        d={pathData} 
                        stroke={styles.color}
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Text Content - Stacked Vertically & Centered */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm max-w-[120px] ml-2">
                <div className={`w-6 h-6 rounded-full ${styles.bg} flex items-center justify-center shadow-sm mb-1.5`}>
                    <span className="text-white font-bold text-[10px]">{data.phaseId}</span>
                </div>
                <h3 className={`text-[10px] font-bold uppercase tracking-wider ${styles.text} leading-tight mb-1`}>
                    {data.phaseSubtitle}
                </h3>
                <p className="text-[9px] font-medium text-muted-foreground leading-tight line-clamp-2">
                    {data.label}
                </p>
            </div>
        </div>
    );
};
