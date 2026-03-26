import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TreeCanvas } from './components/visualization/TreeCanvas';
import { ArrayView } from './components/visualization/ArrayView';
import { StatsPanel } from './components/dashboard/StatsPanel';
import { TheoryPage } from './components/layout/TheoryPage';

import { BST } from './lib/structures/BST';
import { AVLTree } from './lib/structures/AVLTree';
import { BinaryTree } from './lib/structures/BinaryTree';
import { SplayTree } from './lib/structures/SplayTree';
import { Heap } from './lib/structures/Heap';
import { HuffmanBuilder, HuffmanNode } from './lib/structures/HuffmanTree';

import { Play, Trash2, ArrowRightLeft, SplitSquareHorizontal, Search, BookOpen } from 'lucide-react';

type TreeMode = 'bst' | 'avl' | 'binary' | 'splay' | 'minheap' | 'maxheap' | 'huffman';
type ViewMode = 'theory' | 'visualizer';

const createTree = (type: TreeMode) => {
  switch(type) {
    case 'bst': return new BST();
    case 'avl': return new AVLTree();
    case 'binary': return new BinaryTree();
    case 'splay': return new SplayTree();
    case 'minheap': return new Heap('min');
    case 'maxheap': return new Heap('max');
    default: return new BST();
  }
};

const typeLabels: Record<TreeMode, string> = {
  bst: 'Binary Search Tree',
  avl: 'AVL Tree',
  binary: 'Simple Binary Tree',
  splay: 'Splay Tree',
  minheap: 'Min Heap',
  maxheap: 'Max Heap',
  huffman: 'Huffman Tree'
};

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('theory');
  const [treeType1, setTreeType1] = useState<TreeMode>('bst');
  const [treeType2, setTreeType2] = useState<TreeMode>('avl');
  
  const [tree1, setTree1] = useState<any>(createTree('bst'));
  const [tree2, setTree2] = useState<any>(createTree('avl'));
  
  const [root1, setRoot1] = useState<any>(null);
  const [root2, setRoot2] = useState<any>(null);

  const [isCompare, setIsCompare] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Huffman specific
  const [huffmanText, setHuffmanText] = useState('tree visualizer');
  const [huffSteps, setHuffSteps] = useState<HuffmanNode[][]>([]);
  const [currentHuffStep, setCurrentHuffStep] = useState(0);

  // Search Engine State
  const [searchPath, setSearchPath] = useState<string[]>([]);
  const [targetNodeId, setTargetNodeId] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<'searching' | 'found' | 'not-found' | null>(null);
  const searchIntervalRef = useRef<number | null>(null);

  const resetSearchState = () => {
     if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
     setSearchPath([]);
     setTargetNodeId(null);
     setSearchStatus(null);
  };

  const syncRender = () => {
    resetSearchState();
    if (treeType1 !== 'huffman') setRoot1(tree1.root ? { ...tree1.root } : null);
    if (isCompare && treeType2 !== 'huffman') setRoot2(tree2.root ? { ...tree2.root } : null);
  };

  const handleInsert = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (treeType1 === 'huffman') return;
    
    const val = parseInt(inputValue);
    if (!isNaN(val)) {
      if (tree1.insert) tree1.insert(val);
      if (isCompare && tree2.insert) tree2.insert(val);
      syncRender();
      setInputValue('');
    }
  }, [inputValue, tree1, tree2, isCompare, treeType1]);

  const handleDelete = useCallback(() => {
    if (treeType1 === 'huffman') return;
    const val = parseInt(inputValue);
    if (!isNaN(val)) {
      if (tree1.delete) tree1.delete(val);
      if (isCompare && tree2.delete) tree2.delete(val);
      syncRender();
      setInputValue('');
    }
  }, [inputValue, tree1, tree2, isCompare, treeType1]);

  const handleSearch = useCallback(() => {
     if (treeType1 === 'huffman') return;
     const val = parseInt(inputValue);
     if (isNaN(val) || !tree1.search) return;

     resetSearchState();
     setViewMode('visualizer');
     setSearchStatus('searching');

     const result = tree1.search(val);
     // Note: we are currently searching tree1. If Compare Mode is on, 
     // we'd probably want a separate path array for tree2, but for simplicity we'll focus visual tracking on Tree 1.
     
     const fullPath = result.path || [];
     
     let i = 0;
     setSearchPath([]); // strict init
     
     if (fullPath.length === 0) {
        setSearchStatus('not-found');
        return;
     }

     searchIntervalRef.current = window.setInterval(() => {
        setSearchPath(prev => [...prev, fullPath[i]]);
        
        if (i === fullPath.length - 1) {
           if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
           setTargetNodeId(result.found ? fullPath[i] : fullPath[i]);
           setSearchStatus(result.found ? 'found' : 'not-found');
           
           // Structural self-adjusting trees change their roots dynamically upon search.
           if (treeType1 === 'splay') {
              setRoot1(tree1.root ? { ...tree1.root } : null);
           }
        }
        i++;
     }, 400);

  }, [inputValue, tree1, treeType1]);

  const handleClear = useCallback(() => {
    setTree1(createTree(treeType1));
    setRoot1(null);
    if (isCompare) {
      setTree2(createTree(treeType2));
      setRoot2(null);
    }
    setHuffSteps([]);
    resetSearchState();
    setInputValue('');
  }, [treeType1, treeType2, isCompare]);

  const handleHuffmanSearch = useCallback(() => {
     if (huffSteps.length === 0) return;
     const finalForest = huffSteps[huffSteps.length - 1];
     if (!finalForest || finalForest.length !== 1) return; // not built fully
     
     resetSearchState();
     setViewMode('visualizer');
     setSearchStatus('searching');

     // inputValue acts as the 01 string pattern for Huffman
     const pattern = inputValue.replace(/[^01]/g, '');
     const result = HuffmanBuilder.search(finalForest[0], pattern);
     const fullPath = result.path || [];
     
     let i = 0;
     setSearchPath([]); 
     
     if (fullPath.length === 0) {
        setSearchStatus('not-found');
        return;
     }

     searchIntervalRef.current = window.setInterval(() => {
        setSearchPath(prev => [...prev, fullPath[i]]);
        if (i === fullPath.length - 1) {
           if (searchIntervalRef.current) clearInterval(searchIntervalRef.current);
           setTargetNodeId(result.found ? fullPath[i] : fullPath[i]);
           setSearchStatus(result.found ? 'found' : 'not-found');
        }
        i++;
     }, 400); // little faster for huffman decodes
  }, [huffSteps, inputValue]);

  const handleSwitchType1 = (type: TreeMode) => {
    setTreeType1(type);
    setTree1(createTree(type));
    setRoot1(null);
    setHuffSteps([]);
    resetSearchState();
    setViewMode('theory');
  };

  const handleSwitchType2 = (type: TreeMode) => {
    setTreeType2(type);
    setTree2(createTree(type));
    setRoot2(null);
    resetSearchState();
  };

  const handleRandomize = useCallback(() => {
    if (treeType1 === 'huffman') return;
    const newT1 = createTree(treeType1);
    const newT2 = isCompare ? createTree(treeType2) : null;
    
    for (let i = 0; i < 15; i++) {
        const val = Math.floor(Math.random() * 100);
        newT1.insert(val);
        if (newT2) newT2.insert(val);
    }
    setTree1(newT1);
    setRoot1({...newT1.root});
    if (newT2) {
      setTree2(newT2);
      setRoot2({...newT2.root});
    }
    resetSearchState();
    setViewMode('visualizer');
  }, [treeType1, treeType2, isCompare]);

  const handleBuildHuffman = (e?: React.FormEvent) => {
     e?.preventDefault();
     const steps = HuffmanBuilder.generateSteps(huffmanText);
     setHuffSteps(steps);
     setCurrentHuffStep(0);
     setViewMode('visualizer');
  };

  useEffect(() => {
     if (huffSteps.length > 0 && currentHuffStep < huffSteps.length - 1) {
        const timer = setTimeout(() => {
           setCurrentHuffStep(prev => prev + 1);
        }, 1500); 
        return () => clearTimeout(timer);
     }
  }, [huffSteps, currentHuffStep]);

  useEffect(() => {
     return () => resetSearchState();
  }, []);

  const renderTreeArea = (type: TreeMode, treeInst: any, rootNode: any, titleStr: string, isPrimary: boolean) => {
     if (type === 'huffman') {
        const forest = huffSteps[currentHuffStep] || [];
        return (
          <div className="flex-1 flex flex-col min-h-0">
             <div className="flex justify-between items-center mb-2">
               <h2 className="text-lg font-medium tracking-tight">Huffman Construction Step {currentHuffStep + 1}/{Math.max(1, huffSteps.length)}</h2>
             </div>
             <div className="flex-1 relative rounded-xl shadow-inner border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                 <TreeCanvas 
                   root={null} 
                   forest={forest} 
                   searchPath={isPrimary ? searchPath : []}
                   targetNodeId={isPrimary ? targetNodeId : null}
                   searchStatus={isPrimary ? searchStatus : null}
                 />
             </div>
          </div>
        );
     }

     // Use search highlight path strictly for Primary tree. 
     // Doing both requires maintaining dual-pathing which is out-of-scope for simple comparative demo visualization logic.
     const applySearch = isPrimary ? {
        searchPath, targetNodeId, searchStatus
     } : {};

     let heapTargetIdx = null;
     if (isPrimary && searchStatus && treeInst.array) {
        heapTargetIdx = treeInst.array.indexOf(parseInt(inputValue));
     }

     return (
       <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium tracking-tight flex items-center gap-2">
               {titleStr}
            </h2>
          </div>
          <StatsPanel root={rootNode} />
          
          <div className="flex-1 relative rounded-xl shadow-inner border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
             <TreeCanvas root={rootNode} {...applySearch} />
          </div>

          {(type === 'minheap' || type === 'maxheap') && treeInst && (
             <ArrayView 
                array={treeInst.array || []} 
                searchPathIds={isPrimary ? searchPath.map(id => {
                   // Map Canvas IDs back to values for array highlighting
                   for (const [val, sid] of treeInst.nodeIds.entries()) {
                      if (sid === id) return String(val);
                   }
                   return "";
                }) : []} 
                targetIdx={isPrimary ? heapTargetIdx : null}
                searchStatus={isPrimary ? searchStatus : null}
             />
          )}
       </div>
     );
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shadow-lg z-20">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Tree Explorer
          </h1>
          <button 
             onClick={() => setViewMode(viewMode === 'theory' ? 'visualizer' : 'theory')}
             className="text-slate-500 hover:text-indigo-600 transition-colors"
             title={`Switch to ${viewMode === 'theory' ? 'Visualizer' : 'Theory'}`}
          >
             <BookOpen size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Compare Mode</h2>
             <button 
                onClick={() => {
                   if (treeType1 === 'huffman') handleSwitchType1('bst'); 
                   setIsCompare(!isCompare);
                   if (viewMode === 'theory') setViewMode('visualizer');
                }}
                className={`p-2 rounded-md border ${isCompare ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-300' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}
             >
                <SplitSquareHorizontal size={18} />
             </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Primary Tree</h2>
            <select 
               value={treeType1} 
               onChange={(e) => handleSwitchType1(e.target.value as TreeMode)}
               className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-md text-sm cursor-pointer"
            >
               {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {isCompare && (
             <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
               <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Secondary Tree</h2>
               <select 
                  value={treeType2} 
                  onChange={(e) => handleSwitchType2(e.target.value as TreeMode)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-md text-sm cursor-pointer"
               >
                  {Object.entries(typeLabels).filter(([k]) => k !== 'huffman').map(([k, v]) => <option key={k} value={k}>{v}</option>)}
               </select>
             </div>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Operations</h2>
            
            {treeType1 === 'huffman' ? (
               <div className="space-y-4">
                  <form onSubmit={handleBuildHuffman} className="space-y-3 pb-3 border-b border-slate-200 dark:border-slate-700/50">
                     <input 
                       type="text" 
                       value={huffmanText}
                       onChange={(e) => setHuffmanText(e.target.value)}
                       placeholder="Enter string" 
                       className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     />
                     <button 
                       type="submit"
                       className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium"
                     >
                       <Play size={16} /> Build & Animate
                     </button>
                  </form>
                  <form onSubmit={(e) => { e.preventDefault(); handleHuffmanSearch(); }} className="space-y-2">
                      <div className="text-xs text-slate-500 font-semibold uppercase">Search / Decode (0s & 1s)</div>
                      <input 
                         type="text" 
                         value={inputValue}
                         onChange={(e) => setInputValue(e.target.value.replace(/[^01]/g, ''))}
                         placeholder="e.g. 010" 
                         className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button 
                         type="button"
                         onClick={handleHuffmanSearch}
                         className="w-full flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 py-2 rounded-md text-sm font-medium transition-colors border border-amber-200 dark:border-amber-800"
                         disabled={!inputValue || huffSteps.length === 0}
                      >
                         <Search size={16} /> Decode Path
                      </button>
                  </form>
               </div>
            ) : (
               <form onSubmit={handleInsert} className="space-y-3">
                 <div className="flex space-x-2">
                   <input 
                     type="number" 
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     placeholder="Enter value" 
                     className="flex-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                   />
                 </div>
                 <div className="flex space-x-2">
                   <button 
                     type="button"
                     onClick={handleInsert}
                     className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
                     disabled={!inputValue}
                   >
                     <Play size={16} /> Insert
                   </button>
                   <button 
                     type="button"
                     onClick={handleDelete}
                     className="flex-1 flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-2 rounded-md text-sm font-medium transition-colors"
                     disabled={!inputValue}
                   >
                     <Trash2 size={16} /> Delete
                   </button>
                 </div>
                 <button 
                   type="button"
                   onClick={handleSearch}
                   className="w-full flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 py-2 rounded-md text-sm font-medium transition-colors border border-amber-200 dark:border-amber-800 mt-2"
                   disabled={!inputValue}
                 >
                   <Search size={16} /> Find & Animate
                 </button>
               </form>
            )}
          </div>

          {treeType1 !== 'huffman' && (
             <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <button 
                   type="button"
                   onClick={handleRandomize}
                   className="w-full flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 py-2 rounded-md text-sm font-medium transition-colors border border-purple-200 dark:border-purple-800"
                 >
                   <ArrowRightLeft size={16} /> Randomize Sequence
                 </button>
             </div>
          )}

          <div className="pt-2">
            <button 
               type="button"
               onClick={handleClear}
               className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-md text-sm font-medium transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
             >
               <Trash2 size={16} /> Clear Canvas
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col md:flex-row gap-6 ${isCompare ? 'overflow-auto' : 'overflow-hidden'}`}>
        {viewMode === 'theory' ? (
           <TheoryPage 
              treeType={treeType1} 
              onLaunchVisualizer={() => setViewMode('visualizer')} 
           />
        ) : (
           <div className="flex-1 w-full h-full p-6 flex flex-col md:flex-row gap-6">
              {renderTreeArea(treeType1, tree1, root1, typeLabels[treeType1], true)}
              
              {isCompare && treeType1 !== 'huffman' && (
                 renderTreeArea(treeType2, tree2, root2, typeLabels[treeType2], false)
              )}
           </div>
        )}
      </div>
    </div>
  );
}

export default App;
