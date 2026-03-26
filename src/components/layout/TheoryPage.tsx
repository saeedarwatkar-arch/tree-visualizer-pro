import React from 'react';
import { theoryContent } from '../../lib/data/theoryData';
import { Play, Target, Cpu, Clock, HardDrive, Network } from 'lucide-react';

interface TheoryPageProps {
  treeType: string;
  onLaunchVisualizer: () => void;
}

export const TheoryPage: React.FC<TheoryPageProps> = ({ treeType, onLaunchVisualizer }) => {
  const data = theoryContent[treeType] || theoryContent['bst'];

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 p-8 lg:p-12 xl:p-16 flex flex-col relative font-sans">
       <div className="max-w-5xl mx-auto w-full space-y-12 pb-16">
          
          {/* Header Section */}
          <div className="space-y-4">
             <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl mb-4">
               <Network className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {data.title}
             </h1>
             <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {data.definition}
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left Column: Use Cases & Mechanisms */}
             <div className="lg:col-span-2 space-y-8">
                
                <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                   <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                      <Target className="w-5 h-5 text-indigo-500" /> Primary Use Cases
                   </h2>
                   <ul className="space-y-4">
                      {data.useCases.map((useCase, idx) => (
                         <li key={idx} className="flex gap-4">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                               {idx + 1}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300 leading-normal">
                               {useCase}
                            </span>
                         </li>
                      ))}
                   </ul>
                </section>

                <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                   <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-purple-500" /> Core Mechanism
                   </h2>
                   <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      {data.mechanisms}
                   </p>
                </section>

             </div>

             {/* Right Column: Complexities */}
             <div className="space-y-6">
                <section className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                   <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-500" /> Time Complexity
                   </h2>
                   
                   <div className="space-y-4 overflow-x-auto pb-2 -mx-2 px-2">
                      <div className="min-w-[200px]">
                         <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Access</span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded whitespace-nowrap ml-4">{data.complexity.access}</span>
                         </div>
                         <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 pt-3">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Insert</span>
                            <span className="font-mono text-sky-600 dark:text-sky-400 font-medium bg-sky-50 dark:bg-sky-900/20 px-2 py-1 rounded whitespace-nowrap ml-4">{data.complexity.insert}</span>
                         </div>
                         <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 pt-3">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Delete</span>
                            <span className="font-mono text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded whitespace-nowrap ml-4">{data.complexity.delete}</span>
                         </div>
                      </div>
                   </div>

                   <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 border-dashed">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Worst Case Pathing</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                         {data.worstCase}
                      </p>
                   </div>
                </section>

                <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                   <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-amber-500" /> Space Complexity
                   </h2>
                   <div className="overflow-x-auto pb-2 -mx-2 px-2">
                       <div className="flex justify-between items-center min-w-[200px]">
                             <span className="text-sm font-bold text-slate-500">Memory Bounds</span>
                             <span className="font-mono text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded whitespace-nowrap ml-4">{data.complexity.space}</span>
                       </div>
                   </div>
                </section>
             </div>
          </div>

          {/* Action Footer */}
          <div className="fixed bottom-0 left-0 lg:left-80 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-6 flex justify-center z-20 transition-all">
             <button
               onClick={onLaunchVisualizer}
               className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all hover:-translate-y-1"
             >
                <Play className="w-5 h-5 fill-current" />
                <span className="font-bold text-lg tracking-wide">Explore {data.title} Visualizer</span>
             </button>
          </div>
       </div>
    </div>
  );
};
