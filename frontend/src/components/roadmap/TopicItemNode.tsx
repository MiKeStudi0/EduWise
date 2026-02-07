"use client";

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';

export type TopicItemNodeData = {
  label: string;
  status: 'available' | 'mastered';
};

export type TopicItemNodeType = Node<TopicItemNodeData, 'topicItem'>;

export const TopicItemNode = ({ data }: NodeProps<TopicItemNodeType>) => {
  return (
    <div className="relative group cursor-default">
      <Handle
        type="target"
        position={Position.Right}
        className="!bg-transparent !border-none"
      />
      <div className="w-[200px] h-8 px-2 rounded-md font-bold text-[11px] text-black shadow-sm border border-black/5 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 transition-colors">
        <span className="truncate w-full text-center">{data.label}</span>
      </div>
    </div>
  );
};
