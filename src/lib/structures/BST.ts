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

export class BST {
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
    this._insertNode(this.root, newNode);
  }

  private _insertNode(node: TreeNode, newNode: TreeNode) {
    if (newNode.value < node.value) {
      if (!node.left) {
        node.left = newNode;
      } else {
        this._insertNode(node.left, newNode);
      }
    } else if (newNode.value > node.value) {
      if (!node.right) {
        node.right = newNode;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
    // We ignore duplicate values (newNode.value === node.value)
  }

  delete(value: number) {
    this.root = this._deleteNode(this.root, value);
  }

  private _deleteNode(node: TreeNode | null, value: number): TreeNode | null {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._deleteNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this._deleteNode(node.right, value);
      return node;
    } else {
      // Node to delete found
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Node has 2 children, get inorder successor
      const minRight = this._findMin(node.right);
      node.value = minRight.value; // Copy value
      node.right = this._deleteNode(node.right, minRight.value);
      return node;
    }
  }

  private _findMin(node: TreeNode): TreeNode {
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
