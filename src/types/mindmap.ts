export interface MindMap {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface MindMapNode {
  id: string;
  map_id: string;
  parent_id: string | null;
  title: string;
  notes: string | null;
  color: string | null;
  tags: string[] | null;
  position_x: number;
  position_y: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface NodeWithChildren extends MindMapNode {
  children: NodeWithChildren[];
}

export const NODE_COLORS = [
  { name: 'Dourado', value: 'hsl(45, 80%, 50%)' },
  { name: 'Violeta', value: 'hsl(270, 60%, 50%)' },
  { name: 'Azul', value: 'hsl(210, 70%, 50%)' },
  { name: 'Verde', value: 'hsl(150, 60%, 45%)' },
  { name: 'Rosa', value: 'hsl(330, 70%, 55%)' },
  { name: 'Laranja', value: 'hsl(25, 80%, 55%)' },
  { name: 'Cinza', value: 'hsl(220, 10%, 50%)' },
];
