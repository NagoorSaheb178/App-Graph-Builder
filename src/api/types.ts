// API types for the App Graph Builder

export type NodeStatus = 'Healthy' | 'Degraded' | 'Down' | 'Success' | 'Error';
export type NodeType = 'service' | 'database';
export type ResourceTab = 'CPU' | 'Memory' | 'Disk' | 'Region';

export interface AppItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Must be compatible with ReactFlow's Record<string, unknown> data constraint
export interface ServiceNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  icon: string;
  status: NodeStatus;
  cost: string;
  metricValue: number;
  activeTab: ResourceTab;
  description: string;
  region: string;
}

export interface AppGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  position: { x: number; y: number };
  data: ServiceNodeData;
  type: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, unknown>;
}
