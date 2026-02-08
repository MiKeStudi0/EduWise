"use client";

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';

export type TopicItemNodeData = {
  label: string;
  status: 'available' | 'mastered';
  side?: 'left' | 'right';
  isRecommended?: boolean;
};

export type TopicItemNodeType = Node<TopicItemNodeData, 'topicItem'>;

export const TopicItemNode = ({ data }: NodeProps<TopicItemNodeType>) => {
  const isRightSide = data.side === 'right';
  const handlePosition = isRightSide ? Position.Left : Position.Right;
  const handleId = isRightSide ? 'left' : 'right';
  const sourceHandlePosition = isRightSide ? Position.Right : Position.Left;
  const sourceHandleId = isRightSide ? 'right' : 'left';

  return (
    <div className="relative group cursor-default">
      <Handle
        type="target"
        id={handleId}
        position={handlePosition}
        className="!bg-transparent !border-none"
      />
      <Handle
        type="source"
        id={sourceHandleId}
        position={sourceHandlePosition}
        className="!bg-transparent !border-none"
      />
      {data.isRecommended && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[60] pointer-events-none">
          <div className="relative bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg border border-slate-700 whitespace-nowrap">
            Recommended
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-slate-900"></div>
          </div>
        </div>
      )}
      <div
        className={`w-[200px] h-8 px-2 rounded-md font-bold text-[11px] shadow-sm border border-black/5 flex items-center justify-center transition-colors ${
          data.isRecommended
            ? 'bg-green-500 text-white ring-2 ring-green-500/20'
            : 'bg-yellow-400 text-black hover:bg-yellow-300'
        }`}
      >
        <span className="truncate w-full text-center">{data.label}</span>
      </div>
    </div>
  );
};
