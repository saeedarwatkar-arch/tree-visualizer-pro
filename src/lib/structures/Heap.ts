export class TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(value: number, id?: string) {
    this.value = value;
    this.id = id || Math.random().toString(36).substring(2, 10);
    this.left = null;
    this.right = null;
  }
}

export class Heap {
  array: number[];
  type: 'min' | 'max';
  nodeIds: Map<number, string>; // Value to an ID mapping just to preserve animation keys

  constructor(type: 'min' | 'max' = 'min') {
    this.array = [];
    this.type = type;
    this.nodeIds = new Map();
  }

  private compare(a: number, b: number): boolean {
    if (this.type === 'min') return a < b;
    return a > b;
  }

  insert(value: number) {
    this.array.push(value);
    // Keep a consistent ID for the inserted value if it hasn't existed recently
    if (!this.nodeIds.has(value)) {
      this.nodeIds.set(value, Math.random().toString(36).substring(2, 10));
    }
    this.heapifyUp(this.array.length - 1);
  }

  delete(value?: number) {
    if (this.array.length === 0) return;
    
    // Default to extract root if no value passed
    let index = 0;
    if (value !== undefined) {
       index = this.array.indexOf(value);
       if (index === -1) return;
    }

    if (this.array.length === 1) {
      if (index === 0) {
         this.nodeIds.delete(this.array[0]);
         this.array = [];
      }
      return;
    }

    this.nodeIds.delete(this.array[index]); // Remove ID tracking
    this.array[index] = this.array.pop()!;
    this.heapifyDown(index);
    this.heapifyUp(index); // In case we decreased its priority matching up
  }

  private heapifyUp(index: number) {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.compare(this.array[current], this.array[parent])) {
        // Swap
        [this.array[current], this.array[parent]] = [this.array[parent], this.array[current]];
        current = parent;
      } else {
        break;
      }
    }
  }

  private heapifyDown(index: number) {
    let current = index;
    while (true) {
      let left = 2 * current + 1;
      let right = 2 * current + 2;
      let smallestOrLargest = current;

      if (left < this.array.length && this.compare(this.array[left], this.array[smallestOrLargest])) {
        smallestOrLargest = left;
      }

      if (right < this.array.length && this.compare(this.array[right], this.array[smallestOrLargest])) {
        smallestOrLargest = right;
      }

      if (smallestOrLargest !== current) {
        [this.array[current], this.array[smallestOrLargest]] = [this.array[smallestOrLargest], this.array[current]];
        current = smallestOrLargest;
      } else {
        break;
      }
    }
  }

  // View Helper - Convert Array into a normal tree structure for D3 Rendering
  get root(): TreeNode | null {
    if (this.array.length === 0) return null;

    const buildTree = (idx: number): TreeNode | null => {
      if (idx >= this.array.length) return null;
      
      const val = this.array[idx];
      const nid = this.nodeIds.get(val);
      const node = new TreeNode(val, nid);
      node.left = buildTree(2 * idx + 1);
      node.right = buildTree(2 * idx + 2);
      
      return node;
    };

    return buildTree(0);
  }

  getNodeCount(): number {
    return this.array.length;
  }

  getHeight(): number {
    if (this.array.length === 0) return 0;
    return Math.floor(Math.log2(this.array.length)) + 1;
  }

  getInorder(node: TreeNode | null = this.root, result: number[] = []): number[] {
    if (node) {
      this.getInorder(node.left, result);
      result.push(node.value);
      this.getInorder(node.right, result);
    }
    return result;
  }

  getPreorder(node: TreeNode | null = this.root, result: number[] = []): number[] {
    if (node) {
      result.push(node.value);
      this.getPreorder(node.left, result);
      this.getPreorder(node.right, result);
    }
    return result;
  }

  getPostorder(node: TreeNode | null = this.root, result: number[] = []): number[] {
    if (node) {
      this.getPostorder(node.left, result);
      this.getPostorder(node.right, result);
      result.push(node.value);
    }
    return result;
  }

  search(value: number): { path: string[], found: boolean } {
    const path: string[] = [];
    let found = false;
    for (let i = 0; i < this.array.length; i++) {
       const val = this.array[i];
       path.push(this.nodeIds.get(val)!);
       if (val === value) {
         found = true;
         break;
       }
    }
    return { path, found };
  }
}
