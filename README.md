# Tree Visualization & Comparative Analysis Engine

A high-fidelity, highly educational React/Vite web application demonstrating the mathematical structures and auto-balancing traits of major binary and frequency trees. Built with D3.js and Framer Motion algorithms to ensure real-time geometric calculation backed by buttery smooth transitions.

## Live Features
- **Dynamic Insert/Delete Rendering:** Visualizes operations frame-by-frame on Data Structures. 
- **Comparison Engine:** Side-by-side split screen evaluating algorithmic divergence on identical insertion streams (e.g. `AVL` naturally diverging from a skewed `BST`). **How to Use:** Click the `[|]` icon in the top left Sidebar to split the view. Select a Primary and Secondary tree type. Enter a series of numbers into the Primary input box, and watch how both trees handle the insertions and rotations identically side-by-side!
- **Dashboard Synchronization:** Tracks the running `Node Count`, `Height` of tree, and physical outputs of `Inorder`, `Preorder`, and `Postorder` traversals in real-time.
- **Dual Heaps Array Mapping:** Physically renders Min/Max Heaps visually above their 1-to-1 Array index mappings.
- **Huffman Auto-Player:** Compiles frequency distributions into step-by-step interactive Node-merging playback. **How to Decode:** After building a tree using a standard string (like `BANNANA`), enter binary strings (like `010`) into the Decode Path field and click Find. The UI will trace the 0s and 1s physically down the left and right edges until it reaches the targeted character.

---

## Data Structure Complexities

Below are the Big-O Time Complexities of the algorithms implemented within this Visualizer.  

| Data Structure       | Average Search / Access | Average Insert | Average Delete  | Worst Case Insert/Delete        | Core Mechanism                       |
|----------------------|-----------------------|----------------|-----------------|---------------------------------|--------------------------------------|
| **Binary Search Tree**| $O(\log n)$           | $O(\log n)$    | $O(\log n)$     | $O(n)$ (Skewed line tree)       | Follows `< Left`, `> Right` logic.    |
| **AVL Tree**         | $O(\log n)$           | $O(\log n)$    | $O(\log n)$     | $O(\log n)$                     | Height checks & LL/RR/LR/RL rotations.|
| **Min/Max Heap**     | $O(1)$ (Find Peak)    | $O(\log n)$    | $O(\log n)$     | $O(\log n)$                     | Complete trees stored in Array.       |
| **Splay Tree**       | $O(\log n)$ Amortized | $O(\log n)$ Amort| $O(\log n)$ Amort| $O(n)$                          | Zig, Zig-Zig, Zig-Zag to root memory. |
| **Huffman Tree**     | N/A                   | $O(n \log n)$  | N/A             | $O(n \log n)$                   | Greedy frequency generation.          |

*Note: Splay trees provide $O(\log n)$ amortized limits across sequences, pulling commonly accessed nodes immediately to the root level.*

## Development & Usage

### Running Locally
```bash
npm install
npm run dev
```

### Stack
- Vite
- React (TypeScript)
- D3-hierarchy (Physical Geometry)
- Framer Motion (Transitions)
- Tailwind CSS v4
