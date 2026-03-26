export interface GenericNode {
  value: number | string;
  left: GenericNode | null;
  right: GenericNode | null;
}

export class TreeUtils {
  static getHeight(node: GenericNode | null): number {
    if (!node) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  static getNodeCount(node: GenericNode | null): number {
    if (!node) return 0;
    return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right);
  }

  static getInorder(node: GenericNode | null, result: any[] = []): any[] {
    if (node) {
      this.getInorder(node.left, result);
      result.push(node.value);
      this.getInorder(node.right, result);
    }
    return result;
  }

  static getPreorder(node: GenericNode | null, result: any[] = []): any[] {
    if (node) {
      result.push(node.value);
      this.getPreorder(node.left, result);
      this.getPreorder(node.right, result);
    }
    return result;
  }

  static getPostorder(node: GenericNode | null, result: any[] = []): any[] {
    if (node) {
      this.getPostorder(node.left, result);
      this.getPostorder(node.right, result);
      result.push(node.value);
    }
    return result;
  }
}
