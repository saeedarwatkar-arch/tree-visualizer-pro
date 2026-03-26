export class TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.id = Math.random().toString(36).substring(2, 10);
    this.left = null;
    this.right = null;
  }
}

export class BinaryTree {
  root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  insert(value: number) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return;
    }

    const queue: TreeNode[] = [this.root];

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (!current.left) {
        current.left = newNode;
        return;
      } else {
        queue.push(current.left);
      }

      if (!current.right) {
        current.right = newNode;
        return;
      } else {
        queue.push(current.right);
      }
    }
  }

  delete(value: number) {
    if (!this.root) return;

    if (!this.root.left && !this.root.right) {
      if (this.root.value === value) {
        this.root = null;
      }
      return;
    }

    let q: TreeNode[] = [this.root];
    let temp: TreeNode | null = null;
    let keyNode: TreeNode | null = null;

    // Do level order traversal to find deepest node and the node to be deleted
    while (q.length > 0) {
      temp = q.shift()!;
      if (temp.value === value) {
        keyNode = temp;
      }
      if (temp.left) q.push(temp.left);
      if (temp.right) q.push(temp.right);
    }

    if (keyNode && temp) {
      const x = temp.value;
      this.deleteDeepest(this.root, temp);
      keyNode.value = x;
    }
  }

  private deleteDeepest(root: TreeNode, deepestNode: TreeNode) {
    let q: TreeNode[] = [root];

    while (q.length > 0) {
      let temp = q.shift()!;
      
      if (temp === deepestNode) {
        temp = null as any; 
        return;
      }

      if (temp.right) {
        if (temp.right === deepestNode) {
          temp.right = null;
          return;
        } else {
          q.push(temp.right);
        }
      }

      if (temp.left) {
        if (temp.left === deepestNode) {
          temp.left = null;
          return;
        } else {
          q.push(temp.left);
        }
      }
    }
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

  getNodeCount(node: TreeNode | null = this.root): number {
    if (!node) return 0;
    return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right);
  }

  getHeight(node: TreeNode | null = this.root): number {
    if (!node) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  // Level-order search simulation
  search(value: number): { path: string[], found: boolean } {
    const path: string[] = [];
    if (!this.root) return { path, found: false };

    const queue: TreeNode[] = [this.root];

    while (queue.length > 0) {
      const current = queue.shift()!;
      path.push(current.id);

      if (current.value === value) return { path, found: true };

      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    return { path, found: false };
  }
}
