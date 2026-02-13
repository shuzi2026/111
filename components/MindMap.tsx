
import React from 'react';
import { motion } from 'framer-motion';
import { MindMapNode } from '../types';

interface MindMapProps {
  data: MindMapNode;
  isAdmin: boolean;
  onUpdate: (data: MindMapNode) => void;
}

const MindMapDisplay: React.FC<MindMapProps> = ({ data, isAdmin, onUpdate }) => {
  const renderNode = (node: MindMapNode, x: number, y: number, level: number = 0) => {
    const childSpacing = level === 0 ? 280 : 180 / (level || 1);
    const startY = y - ((node.children?.length || 0) - 1) * childSpacing / 2;

    const handleEdit = (nodeId: string) => {
        if (!isAdmin) return;
        const newLabel = prompt('重命名此节点:', node.label);
        if (!newLabel) return;
        const editRecursive = (current: MindMapNode): MindMapNode => {
            if (current.id === nodeId) return { ...current, label: newLabel };
            return { ...current, children: current.children?.map(editRecursive) };
        };
        onUpdate(editRecursive(data));
    }

    const handleAddChild = (nodeId: string) => {
      const label = prompt('输入新子节点名称:');
      if (!label) return;
      const updateChildren = (current: MindMapNode): MindMapNode => {
        if (current.id === nodeId) {
          return {
            ...current,
            children: [...(current.children || []), { id: Date.now().toString(), label: label }]
          };
        }
        return { ...current, children: current.children?.map(updateChildren) };
      };
      onUpdate(updateChildren(data));
    };

    return (
      <g key={node.id}>
        {/* Animated Connectors */}
        {node.children?.map((child, i) => {
          const childX = x + 320;
          const childY = startY + i * childSpacing;
          return (
            <React.Fragment key={child.id}>
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: level * 0.2 }}
                d={`M ${x + 180} ${y} C ${x + 250} ${y}, ${x + 250} ${childY}, ${childX} ${childY}`} 
                className="fill-none stroke-slate-900" 
                strokeWidth={5}
              />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                d={`M ${x + 180} ${y} C ${x + 250} ${y}, ${x + 250} ${childY}, ${childX} ${childY}`} 
                className="fill-none stroke-white opacity-60" 
                strokeWidth={2}
                strokeDasharray="10 20"
              />
              {renderNode(child, childX, childY, level + 1)}
            </React.Fragment>
          );
        })}

        {/* Node Design */}
        <motion.g 
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onClick={() => handleEdit(node.id)}
          className="cursor-pointer"
        >
          <rect 
            x={x} y={y - 35} width={180} height={70} 
            className={`${level === 0 ? 'fill-red-600' : 'fill-white'} stroke-slate-900`} 
            strokeWidth={5}
          />
          <rect x={x + 6} y={y + 25} width={168} height={6} fill="rgba(0,0,0,0.15)" />
          
          <text 
            x={x + 90} y={y + 8} 
            textAnchor="middle" 
            className={`${level === 0 ? 'fill-white' : 'fill-slate-900'} text-sm font-black uppercase tracking-widest`}
          >
            {node.label}
          </text>
        </motion.g>

        {/* RPG Style Plus Icon */}
        {isAdmin && (
          <motion.g 
            whileHover={{ scale: 1.2, rotate: 90 }}
            transform={`translate(${x + 165}, ${y - 50})`}
            onClick={(e) => { e.stopPropagation(); handleAddChild(node.id); }}
            className="cursor-pointer"
          >
             <rect width={32} height={32} className="fill-green-500 stroke-slate-900" strokeWidth={3} />
             <text x={16} y={24} textAnchor="middle" className="fill-white font-black text-2xl">+</text>
          </motion.g>
        )}
      </g>
    );
  };

  return (
    <div className="pixel-box bg-[#cfd5e0] h-[85vh] overflow-auto relative p-12 scanlines border-8 border-double border-slate-900">
       <div className="mb-16 flex justify-between items-start">
          <div className="bg-white p-6 border-4 border-slate-900 shadow-[8px_8px_0px_#000]">
            <h2 className="text-5xl font-black font-handwriting mb-2 text-slate-900">世界观/技术树 (Tech Tree)</h2>
            <div className="flex items-center gap-4">
              <div className="w-full h-4 bg-slate-200 border-2 border-slate-900 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} className="h-full bg-blue-500" />
              </div>
              <span className="text-xs font-black font-mono">MAP: 75% DISCOVERED</span>
            </div>
          </div>
          {isAdmin && (
            <div className="bg-red-600 text-white p-4 font-black text-xs animate-pulse border-4 border-slate-900 shadow-[4px_4px_0px_#000]">
              DEBUG MODE: ON
            </div>
          )}
       </div>
       
       <div className="flex items-center justify-start min-h-full min-w-[1500px] p-20">
         <svg width={1800} height={900} className="w-full h-auto drop-shadow-2xl">
            {renderNode(data, 100, 450)}
         </svg>
       </div>

       {/* Floating "Pixel Fog" for atmosphere */}
       <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')]"></div>
    </div>
  );
};

export default MindMapDisplay;
