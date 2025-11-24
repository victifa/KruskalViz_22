
interface node {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface edge {
  from: string;
  to: string;
  weight: number;
  selected: boolean;
}

interface Graph {
  nodes: node[];
  edges: edge[];
  selectedEdges: edge[];
}