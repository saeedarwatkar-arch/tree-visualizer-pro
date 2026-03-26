import React from 'react';
import { TreeUtils, type GenericNode } from '../../lib/structures/TreeUtils';

interface StatsPanelProps {
  root: GenericNode | null;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ root }) => {
  const nodeCount = TreeUtils.getNodeCount(root);
  const height = TreeUtils.getHeight(root);
  
  // Only calculate traversals if tree is reasonably small to avoid performance hits
  // and visual overflow. For educational purposes, ~30 nodes is our limit anyway.
  const inorder = nodeCount <= 50 ? TreeUtils.getInorder(root).join(', ') : '...';
  const preorder = nodeCount <= 50 ? TreeUtils.getPreorder(root).join(', ') : '...';
  const postorder = nodeCount <= 50 ? TreeUtils.getPostorder(root).join(', ') : '...';

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col xl:flex-row gap-4 mb-4">
      <div className="flex gap-4 xl:w-1/3">
        <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-2 sm:p-3 rounded-lg border border-slate-100 dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Height</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{height}</div>
        </div>
        <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nodes</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{nodeCount}</div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-2 xl:mt-0">
        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-2 rounded border border-indigo-100 dark:border-indigo-900/50">
          <div className="text-[10px] font-bold text-indigo-500 uppercase mb-1">Inorder</div>
          <div className="text-xs font-mono text-slate-700 dark:text-slate-300 break-words">{inorder || 'Empty'}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 p-2 rounded border border-purple-100 dark:border-purple-900/50">
          <div className="text-[10px] font-bold text-purple-500 uppercase mb-1">Preorder</div>
          <div className="text-xs font-mono text-slate-700 dark:text-slate-300 break-words">{preorder || 'Empty'}</div>
        </div>
        <div className="bg-pink-50 dark:bg-pink-950/30 p-2 rounded border border-pink-100 dark:border-pink-900/50">
          <div className="text-[10px] font-bold text-pink-500 uppercase mb-1">Postorder</div>
          <div className="text-xs font-mono text-slate-700 dark:text-slate-300 break-words">{postorder || 'Empty'}</div>
        </div>
      </div>
    </div>
  );
};
