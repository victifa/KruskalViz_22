# KruskalViz

🌐 [中文](README.md) / [English ](README_en.md)/ [日本語（にほんご）](README_jp.md)🌐

A visualization tool for Kruskal's algorithm (Minimum Spanning Tree), built with Vue 3. It supports dynamic node addition, edge weight editing, and step-by-step MST demonstration. Suitable for algorithm teaching, learning, and research reference.



## Project Overview

When learning graph algorithms, especially minimum spanning tree algorithms, there is often a lack of intuitive and interactive demonstration tools. KruskalViz aims to fill this gap:

- Users can **dynamically add/delete nodes** and **create/edit edges and their weights** via a visual interface.
- Supports both manual operation and automated demonstration modes: showing how Kruskal selects edges, merges connected components, and builds the MST step by step.
- User-friendly interface and clean code, suitable for teaching, classroom demonstrations, student practice, or research presentations.



## Key Features

- **Dynamic Node Operations**: Click on the canvas to create nodes, drag to move nodes.
- **Edge and Weight Editing**: Draw edges between nodes and edit weights via double-click or input box.
- **Algorithm Animation**: Click "Start Demo" to watch Kruskal's algorithm in action, including edge sorting, selection, skipping, and union-find operations.
- **Manual/Automatic Control**: Pause, step through, or set automatic playback speed.
- **Status Indicators**: Visual cues for currently processed edges, selected edges, skipped edges, and merge operations.
- **Reset/Edit Freely**: Clear the canvas or undo operations anytime to rebuild the graph.



## Preview

<img src="/preview/prev1.png" alt="Automatic Demo" style="zoom:75%;" />

![Manual Demo](/preview/prev2.png)

![Popup Hint](/preview/prev3.png)


## Getting Started

### Prerequisites

- Node.js installed (recommended v16 or above)
- Package manager such as npm or pnpm
- Basic understanding of Vue 3 project structure

### Installation and Running

1. Clone the repository:

   ```bash
   git clone git@github.com:victifa/KruskalViz_22.git
   cd KruskalViz_22

2. Install dependencies (using `pnpm` as an example):

   ```
   pnpm install
   ```

3. Run in development mode:

   ```
   pnpm run dev
   ```

4. Open in browser:

   Visit `http://localhost:3000` (or the address shown in the terminal) to see the interface.

### Build for Production

```
pnpm build
# The build output is usually in the dist/ directory and can be deployed to any static server or GitHub Pages
```

## Usage Guide

### Interface Overview

- **Toolbar (Left/Top)**: Contains buttons like "Add Node", "Add Edge", "Delete", "Reset", "Start Demo".
- **Canvas Area**: Displays nodes (dots) and edges (lines + weights).
- **Status Bar (Right/Bottom)**: Shows current algorithm step, list of selected edges, edges in the MST, skipped edges, etc.

### Operation Flow

1. Click "Add Node" and click anywhere on the canvas to create a node.
2. Switch to "Add Edge" mode and click two nodes to create an edge.
3. Double-click edge weight text or use the input panel to edit the weight.
4. After constructing the graph, click "Start Demo".
5. During the demo, control the flow with "Pause/Resume" or "Step" buttons.
6. After the demo, view the generated MST or click "Reset" to edit the graph again.

### Algorithm Demonstration Flow

- All edges are first read and sorted by weight in ascending order.
- A union-find structure checks whether each edge connects two different sets.
- If it connects, the edge is added to the MST and sets are merged; otherwise, the edge is skipped.
- Repeat until all nodes are connected or no selectable edges remain.
- On the screen, "currently processed edge" is highlighted, "selected edges" are shown in green, and "skipped edges" in gray.
- The final MST is highlighted with thicker lines or distinct colors.

------

## Future Plans

Potential future extensions include:

- Support **Prim's algorithm** visualization (for comparison with Kruskal)
- Support **random graph generation** (automatically generate nodes and edges)
- Support **graph import/export** (e.g., JSON / GraphML)
- Improve animations (smooth highlighting, color gradients)
- Support **teaching mode**: show pseudocode + annotations + step explanations
- Enhanced **union-find visualization**: show parent pointers, rank, path compression
- Responsive support (mobile/tablet)

------

## Contributing

Contributions are welcome! To participate:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: describe your change"`)
4. Push to your repository (`git push origin feature/your-feature`)
5. Open a Pull Request (PR) describing your changes and purpose

Please maintain code style, add necessary comments, and include screenshots/demos for visual modifications.

------

## License

This project is licensed under the **MIT License**. See the LICENSE file for details.
