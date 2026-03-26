export class SplayTreeNode {
  id: string;
  value: number;
  left: SplayTreeNode | null;
  right: SplayTreeNode | null;
  parent: SplayTreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.id = Math.random().toString(36).substring(2, 10);
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

export class SplayTree {
  root: SplayTreeNode | null;

  constructor() {
    this.root = null;
  }

  private leftRotate(x: SplayTreeNode) {
    const y = x.right;
    if (y) {
      x.right = y.left;
      if (y.left) y.left.parent = x;

      y.parent = x.parent;
    }

    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    if (y) y.left = x;
    x.parent = y;
  }

  private rightRotate(x: SplayTreeNode) {
    const y = x.left;
    if (y) {
      x.left = y.right;
      if (y.right) y.right.parent = x;

      y.parent = x.parent;
    }

    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }

    if (y) y.right = x;
    x.parent = y;
  }

  private splay(x: SplayTreeNode) {
    while (x.parent) {
      if (!x.parent.parent) {
        // Zig
        if (x === x.parent.left) this.rightRotate(x.parent);
        else this.leftRotate(x.parent);
      } else if (x === x.parent.left && x.parent === x.parent.parent.left) {
        // Zig-Zig
        this.rightRotate(x.parent.parent);
        this.rightRotate(x.parent);
      } else if (x === x.parent.right && x.parent === x.parent.parent.right) {
        // Zig-Zig
        this.leftRotate(x.parent.parent);
        this.leftRotate(x.parent);
      } else if (x === x.parent.right && x.parent === x.parent.parent.left) {
        // Zig-Zag
        this.leftRotate(x.parent);
        this.rightRotate(x.parent); // x parent changed above
      } else {
        // Zig-Zag
        this.rightRotate(x.parent);
        this.leftRotate(x.parent); // x parent changed above
      }
    }
  }

  insert(value: number) {
    if (!this.root) {
      this.root = new SplayTreeNode(value);
      return;
    }

    let p: SplayTreeNode | null = this.root;
    let node: SplayTreeNode | null = null;
    let parent: SplayTreeNode | null = null;

    while (p) {
      parent = p;
      if (value < p.value) {
        p = p.left;
      } else if (value > p.value) {
        p = p.right;
      } else {
        // We do not insert duplicates, but we still splay the found one
        return this.splay(p);
      }
    }

    node = new SplayTreeNode(value);
    node.parent = parent;

    if (parent) {
      if (value < parent.value) {
        parent.left = node;
      } else {
        parent.right = node;
      }
    }

    this.splay(node);
  }

  delete(value: number) {
    let node: SplayTreeNode | null = this.root;
    let target: SplayTreeNode | null = null;

    while (node) {
      if (value === node.value) {
        target = node;
        break;
      }
      if (value < node.value) {
        node = node.left;
      } else {
        node = node.right;
      }
    }

    if (!target) return; // not found

    this.splay(target);

    if (!target.left) {
      this.root = target.right;
      if (target.right) target.right.parent = null;
    } else {
      let rightSubtree = target.right;
      let leftSubtree = target.left;
      
      leftSubtree.parent = null;
      this.root = leftSubtree;
      
      let maxNode = leftSubtree;
      while (maxNode.right) {
        maxNode = maxNode.right;
      }
      
      this.splay(maxNode);
      this.root.right = rightSubtree;
      if (rightSubtree) rightSubtree.parent = this.root;
    }
  }

  search(value: number): { path: string[], found: boolean } {
    const path: string[] = [];
    let node = this.root;
    while (node) {
      path.push(node.id);
      if (node.value === value) {
        this.splay(node);
        return { path, found: true };
      }
      if (value < node.value) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return { path, found: false };
  }
}
