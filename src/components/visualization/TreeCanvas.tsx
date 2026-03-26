import React, { useMemo, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';

export interface TreeNode {
  id: string;
  value: number | string;
  label?: string;
  left: any | null;
  right: any | null;
}

interface TreeCanvasProps {
  root: TreeNode | null;
  forest?: TreeNode[];
  searchPath?: string[];
  targetNodeId?: string | null;
  searchStatus?: 'searching' | 'found' | 'not-found' | null;
}

const convertToD3Hierarchy = (node: TreeNode | null): any => {
  if (!node) return { name: 'dummy', isDummy: true };
  
  const hasChildren = node.left !== null || node.right !== null;
  
  return {
    ...node,
    name: node.id,
    isDummy: false,
    children: hasChildren 
      ? [convertToD3Hierarchy(node.left), convertToD3Hierarchy(node.right)]
      : undefined
  };
};

export const TreeCanvas: React.FC<TreeCanvasProps> = ({ 
  root, 
  forest, 
  searchPath = [], 
  targetNodeId = null,
  searchStatus = null
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { nodes, links } = useMemo(() => {
    let hierarchyData;

    if (forest && forest.length > 0) {
       hierarchyData = {
          name: 'forest-dummy-root',
          isDummyRoot: true,
          children: forest.map(treeNode => convertToD3Hierarchy(treeNode))
       };
    } else if (root) {
       hierarchyData = convertToD3Hierarchy(root);
    } else {
       return { nodes: [], links: [] };
    }

    const rootHierarchy = d3.hierarchy(hierarchyData);

    const treeLayout = d3.tree()
      .size([dimensions.width - 100, dimensions.height - 100])
      .nodeSize([60, 80]); 

    const treeData = treeLayout(rootHierarchy);
    const allExpectedNodes = treeData.descendants();
    const allExpectedLinks = treeData.links();

    const rootX = allExpectedNodes.find(n => n.depth === (forest ? 1 : 0))?.x || 0;
    const offsetX = dimensions.width / 2 - rootX;

    const finalNodes = allExpectedNodes
      .filter((d: any) => !d.data.isDummy && !d.data.isDummyRoot)
      .map(d => ({
        ...d,
        x: d.x + offsetX,
        y: d.y + 50 - (forest ? 80 : 0) 
      }));

    const finalLinks = allExpectedLinks
      .filter((d: any) => !d.source.data.isDummy && !d.target.data.isDummy && !d.source.data.isDummyRoot && !d.target.data.isDummyRoot)
      .map(d => ({
        source: { ...d.source, x: d.source.x + offsetX, y: d.source.y + 50 - (forest ? 80 : 0) },
        target: { ...d.target, x: d.target.x + offsetX, y: d.target.y + 50 - (forest ? 80 : 0) }
      }));

    return { nodes: finalNodes, links: finalLinks };
  }, [root, forest, dimensions]);

  // Helper to determine edge traversal check
  const isEdgeTraversed = (sourceId: string, targetId: string) => {
     const tIdx = searchPath.indexOf(targetId);
     if (tIdx > 0 && searchPath[tIdx - 1] === sourceId) return true;
     return false;
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm">
      <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0">
        <AnimatePresence>
          {links.map((link: any) => {
             const traversed = isEdgeTraversed(link.source.data.id, link.target.data.id);
             return (
              <motion.path
                key={`${link.source.data.id}-${link.target.data.id}`}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ 
                  opacity: 1, 
                  pathLength: 1,
                  d: `M${link.source.x},${link.source.y} L${link.target.x},${link.target.y}`
                }}
                exit={{ opacity: 0, pathLength: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                stroke="currentColor"
                strokeWidth={traversed ? "4" : "2"}
                className={traversed ? "text-amber-500" : "text-slate-300 dark:text-slate-700"}
                fill="none"
              />
            );
          })}
        </AnimatePresence>
      </svg>

      <AnimatePresence>
        {nodes.map((node: any) => {
          const isTraversed = searchPath.includes(node.data.id);
          const isTarget = node.data.id === targetNodeId;
          
          let bgColor = "bg-white dark:bg-slate-800";
          let borderColor = "border-indigo-500";
          let textColor = "text-indigo-700 dark:text-indigo-300";
          let animationProps: any = { opacity: 1, scale: 1, x: node.x - 20, y: node.y - 20 };
          
          if (isTarget) {
            if (searchStatus === 'found') {
               bgColor = "bg-emerald-100 dark:bg-emerald-900/60";
               borderColor = "border-emerald-500";
               textColor = "text-emerald-700 dark:text-emerald-300";
               animationProps = { ...animationProps, scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 1 } };
            } else if (searchStatus === 'not-found') {
               bgColor = "bg-rose-100 dark:bg-rose-900/60";
               borderColor = "border-rose-500";
               textColor = "text-rose-700 dark:text-rose-300";
               animationProps = { ...animationProps, scale: [1, 1.2, 1], transition: { repeat: 3, duration: 0.3 } };
            }
          } else if (isTraversed) {
             bgColor = "bg-amber-100 dark:bg-amber-900/60";
             borderColor = "border-amber-500";
             textColor = "text-amber-700 dark:text-amber-300";
          }

          return (
            <motion.div
              key={node.data.id}
              initial={{ opacity: 0, scale: 0.5, x: node.x - 20, y: node.y - 40 }}
              animate={animationProps}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className={`absolute w-10 h-10 flex flex-col items-center justify-center border-2 rounded-full font-bold shadow-md z-10 ${bgColor} ${borderColor} ${textColor}`}
            >
              {node.data.value}
              {(node.data as any).char && (
                 <span className="absolute -bottom-6 text-xs text-slate-500 dark:text-slate-400 font-normal">
                    {(node.data as any).char}
                 </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium tracking-wide">
          The tree is empty. Add a node to start visualizing.
        </div>
      )}
    </div>
  );
};
