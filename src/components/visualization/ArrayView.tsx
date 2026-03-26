import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArrayViewProps {
  array: number[];
  searchPathIds?: string[]; // Corresponding parallel IDs
  targetIdx?: number | null;
  searchStatus?: 'searching' | 'found' | 'not-found' | null;
}

export const ArrayView: React.FC<ArrayViewProps> = ({ array, searchPathIds = [], targetIdx = null, searchStatus = null }) => {
  return (
    <div className="w-full mt-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Underlying Array Mapping</div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {array.map((val, idx) => (
            <motion.div
              key={`${val}-${idx}`} // Using both value and idx so it animations smoothly. Or just ID if available, but array values work visually for a simple view
              layout
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex flex-col items-center"
            >
              <div className="text-[10px] text-slate-400 mb-1 font-mono">[{idx}]</div>
              <div className={`w-10 h-10 border-2 rounded flex items-center justify-center font-bold transition-all duration-300
                 ${targetIdx === idx && searchStatus === 'found' ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 animate-pulse' : ''}
                 ${targetIdx === idx && searchStatus === 'not-found' ? 'border-rose-500 bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300' : ''}
                 ${searchPathIds.includes(`${val}`) && targetIdx !== idx ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300' : ''}
                 ${!searchPathIds.includes(`${val}`) && targetIdx !== idx ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''}
              `}>
                {val}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {array.length === 0 && (
          <div className="text-slate-400 italic text-sm py-4">Array is empty</div>
        )}
      </div>
    </div>
  );
};
