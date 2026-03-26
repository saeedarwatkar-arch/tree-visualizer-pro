export class HuffmanNode {
  id: string;
  char: string;
  value: number; // use value for freq to align with TreeCanvas interface expectations
  left: HuffmanNode | null;
  right: HuffmanNode | null;

  constructor(char: string, freq: number, id?: string) {
    this.char = char;
    this.value = freq; 
    this.id = id || Math.random().toString(36).substring(2, 10);
    this.left = null;
    this.right = null;
  }
}

export class HuffmanBuilder {
   static generateSteps(inputText: string): HuffmanNode[][] {
      if (!inputText) return [];
      
      // Calculate frequencies
      const freqMap = new Map<string, number>();
      for (const char of inputText) {
         freqMap.set(char, (freqMap.get(char) || 0) + 1);
      }
      
      const forest: HuffmanNode[] = [];
      for (const [char, freq] of Array.from(freqMap.entries())) {
         forest.push(new HuffmanNode(char, freq, 'leaf-'+char.charCodeAt(0)));
      }
      
      forest.sort((a, b) => a.value - b.value);

      const steps: HuffmanNode[][] = [ [...forest] ]; 
      
      while (forest.length > 1) {
         const left = forest.shift()!;
         const right = forest.shift()!;
         
         // Using a new ID that combines them so it doesn't change randomly
         // on every re-render or generation
         const mergedId = `merge-${left.id}-${right.id}`; 
         const merged = new HuffmanNode(
            left.char + right.char, 
            left.value + right.value, 
            mergedId
         );
         merged.left = left;
         merged.right = right;
         
         let inserted = false;
         for (let i = 0; i < forest.length; i++) {
            if (forest[i].value > merged.value) {
               forest.splice(i, 0, merged);
               inserted = true;
               break;
            }
         }
         if (!inserted) {
            forest.push(merged);
         }
         
         steps.push([...forest]);
      }
      
      return steps;
   }

   static search(root: HuffmanNode | null, pattern: string): { path: string[], found: boolean } {
      const path: string[] = [];
      if (!root) return { path, found: false };
      
      let current = root;
      path.push(current.id);
      
      for(const char of pattern) {
         if (char === '0' && current.left) current = current.left;
         else if (char === '1' && current.right) current = current.right;
         else return { path, found: false }; 
         
         path.push(current.id);
      }
      
      const isLeaf = !current.left && !current.right;
      return { path, found: isLeaf && !!current.char };
  }
}
