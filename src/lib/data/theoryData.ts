export interface TreeComplexity {
   access: string;
   insert: string;
   delete: string;
   space: string;
}

export interface TheoryData {
  title: string;
  definition: string;
  useCases: string[];
  complexity: TreeComplexity;
  worstCase: string;
  mechanisms: string;
}

export const theoryContent: Record<string, TheoryData> = {
  bst: {
    title: "Binary Search Tree (BST)",
    definition: "A node-based binary tree data structure where each node has at most two children. The left subtree of a node contains only nodes with keys lesser than the node's key, and the right subtree contains only keys greater.",
    useCases: ["Basic searching and sorting", "Building dynamic sets or lookup tables", "Foundation for more advanced trees"],
    complexity: {
      access: "O(log n)",
      insert: "O(log n)",
      delete: "O(log n)",
      space: "O(n)"
    },
    worstCase: "O(n) - Occurs when data is inserted in sorted order, devolving the tree into a linked list.",
    mechanisms: "Recursive logic follows branching left for smaller values and right for larger ones."
  },
  avl: {
    title: "AVL Tree",
    definition: "A self-balancing Binary Search Tree where the difference between heights of left and right subtrees cannot be more than one for all nodes. It dynamically rotates nodes when this property is violated.",
    useCases: ["In-memory sorts and sets requiring guaranteed fast lookups", "Database indexing where deletions/insertions are less frequent than reads", "Dictionary applications"],
    complexity: {
      access: "O(log n)",
      insert: "O(log n)",
      delete: "O(log n)",
      space: "O(n)"
    },
    worstCase: "O(log n) - Guaranteed logarithmic upper bound due to strict balancing.",
    mechanisms: "Maintains balance through Left-Left (LL), Right-Right (RR), Left-Right (LR), and Right-Left (RL) rotations."
  },
  binary: {
    title: "Simple Binary Tree",
    definition: "A hierarchical data structure in which each node has at most two children. This implementation uses level-order insertion, prioritizing filling the tree level by level from left to right.",
    useCases: ["Representing hierarchical data (e.g., file systems)", "Evaluating expressions (Parse Trees)", "Huffman coding foundations"],
    complexity: {
      access: "O(n)",
      insert: "O(n)",
      delete: "O(n)",
      space: "O(n)"
    },
    worstCase: "O(n) - Since there is no ordering guarantee, finding a specific node requires traversing the entire structure.",
    mechanisms: "Uses a queue to perform level-order traversal for finding the next empty child spot."
  },
  splay: {
    title: "Splay Tree",
    definition: "A self-adjusting binary search tree with the additional property that recently accessed elements are quick to access again. It achieves this by bringing the accessed node to the root via specific rotations.",
    useCases: ["Caches mapping algorithms", "Garbage collection implementations", "Data compression algorithms"],
    complexity: {
      access: "O(log n) amortized",
      insert: "O(log n) amortized",
      delete: "O(log n) amortized",
      space: "O(n)"
    },
    worstCase: "O(n) - Can temporarily become unbalanced, but sequential accesses amortize back down to logarithmic time.",
    mechanisms: "Repeated Zig, Zig-Zig, and Zig-Zag sequential rotations move frequently searched targets to the root."
  },
  minheap: {
    title: "Min Heap",
    definition: "A complete binary tree mapping to an array where the value of each parent node is structurally less than or equal to the values of its children.",
    useCases: ["Priority Queues", "Dijkstra's shortest-path algorithm", "Heap Sort"],
    complexity: {
      access: "O(1) (to root)",
      insert: "O(log n)",
      delete: "O(log n)",
      space: "O(n)"
    },
    worstCase: "O(log n) - Inserting or deleting always requires bubbling up or bubbling down.",
    mechanisms: "Mathematical indexing maps Parent(i) to Children(2i+1, 2i+2). Heapifies dynamically to strictly protect Priority."
  },
  maxheap: {
    title: "Max Heap",
    definition: "Similar to a Min Heap, but the value of each parent node is strictly greater than or equal to the values of its children, capturing the largest element at the root.",
    useCases: ["Priority Queues capturing maximums", "Order statistics algorithms", "Selecting Top-K elements"],
    complexity: {
      access: "O(1) (to root)",
      insert: "O(log n)",
      delete: "O(log n)",
      space: "O(n)"
    },
    worstCase: "O(log n) - Follows precise structural priority maintenance.",
    mechanisms: "Mathematical indexing maps Parent(i) to Children(2i+1, 2i+2). Heapifies dynamically to strictly protect Priority."
  },
  huffman: {
    title: "Huffman Tree",
    definition: "An optimal prefix code tree used for lossless data compression. It assigns variable-length codes to input characters directly mapped to their frequencies.",
    useCases: ["ZIP, GZIP compression standards", "JPEG and PNG encoding", "Network data transmission protocol optimization"],
    complexity: {
      access: "N/A",
      insert: "O(n log n) (building)",
      delete: "N/A",
      space: "O(n)"
    },
    worstCase: "O(n log n) - It must sort/extract characters dynamically by frequency.",
    mechanisms: "Greedy algorithm isolates the two lowest-frequency forest roots and merges them iteratively."
  }
};
