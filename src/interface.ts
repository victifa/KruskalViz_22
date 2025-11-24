interface node {
  id: string;
  x: number;
  y: number;
}

interface edge {
  from: node;
  to: node;
  weight: number;
}
