export class AVLTreeNode {
  id: string;
  value: number;
  height: number;
  left: AVLTreeNode | null;
  right: AVLTreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.id = Math.random().toString(36).substring(2, 10);
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

export class AVLTree {
  root: AVLTreeNode | null;

  constructor() {
    this.root = null;
  }

  private height(node: AVLTreeNode | null): number {
    return node ? node.height : 0;
  }

  private updateHeight(node: AVLTreeNode) {
    node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
  }

  private getBalance(node: AVLTreeNode | null): number {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  private rightRotate(y: AVLTreeNode): AVLTreeNode {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  private leftRotate(x: AVLTreeNode): AVLTreeNode {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  insert(value: number) {
    this.root = this._insertNode(this.root, value);
  }

  private _insertNode(node: AVLTreeNode | null, value: number): AVLTreeNode {
    // 1. Perform normal BST insertion
    if (!node) return new AVLTreeNode(value);

    if (value < node.value) {
      node.left = this._insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._insertNode(node.right, value);
    } else {
      return node; // Duplicates are not allowed
    }

    // 2. Update height of this ancestor node
    this.updateHeight(node);

    // 3. Get the balance factor to check whether it became unbalanced
    const balance = this.getBalance(node);

    // Left Left Case
    if (balance > 1 && value < node.left!.value) {
      return this.rightRotate(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right!.value) {
      return this.leftRotate(node);
    }

    // Left Right Case
    if (balance > 1 && value > node.left!.value) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right!.value) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  delete(value: number) {
    this.root = this._deleteNode(this.root, value);
  }

  private _deleteNode(node: AVLTreeNode | null, value: number): AVLTreeNode | null {
    // 1. Perform standard BST delete
    if (!node) return null;

    if (value < node.value) {
      node.left = this._deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._deleteNode(node.right, value);
    } else {
      // Node with only one child or no child
      if (!node.left || !node.right) {
        node = node.left ? node.left : node.right;
      } else {
        // Node with two children: Get inorder successor
        const temp = this._findMin(node.right);
        node.value = temp.value; // Copy value 
        node.right = this._deleteNode(node.right, temp.value);
      }
    }

    // If the tree had only one node then return
    if (!node) return null;

    // 2. Update height of the current node
    this.updateHeight(node);

    // 3. Get balance factor to check whether it became unbalanced
    const balance = this.getBalance(node);

    // Left Left Case
    if (balance > 1 && this.getBalance(node.left) >= 0) {
      return this.rightRotate(node);
    }
    // Left Right Case
    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }
    // Right Right Case
    if (balance < -1 && this.getBalance(node.right) <= 0) {
      return this.leftRotate(node);
    }
    // Right Left Case
    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  private _findMin(node: AVLTreeNode): AVLTreeNode {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  search(value: number): { path: string[], found: boolean } {
    const path: string[] = [];
    let current = this.root;
    while (current) {
      path.push(current.id);
      if (value === current.value) return { path, found: true };
      if (value < current.value) current = current.left;
      else current = current.right;
    }
    return { path, found: false };
  }
}
