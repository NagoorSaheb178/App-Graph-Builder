import { useCallback, useRef, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type OnNodesChange,
  type OnEdgesChange,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ServiceNode } from './ServiceNode';
import { useAppStore } from '@/store/useAppStore';
import { useAppGraph } from '@/api/queries';
import type { ServiceNodeData } from '@/api/types';

const NODE_TYPES = { serviceNode: ServiceNode };

let nodeIdCounter = 100;

interface AppCanvasInnerProps {
  onNodesUpdate: (map: Record<string, ServiceNodeData>) => void;
  onRegisterUpdate: (fn: (nodeId: string, patch: Partial<ServiceNodeData>) => void) => void;
}

export function AppCanvasInner({ onNodesUpdate, onRegisterUpdate }: AppCanvasInnerProps) {
  const { fitView } = useReactFlow();
  const selectedAppId = useAppStore((s) => s.selectedAppId);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);

  const { data: graphData, isLoading, isError } = useAppGraph(selectedAppId);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const didFitRef = useRef(false);

  // Load graph data
  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes as unknown as Node[]);
      setEdges(graphData.edges as unknown as Edge[]);
      didFitRef.current = false;
    }
  }, [graphData, setNodes, setEdges]);

  // Fit view after nodes load
  useEffect(() => {
    if (nodes.length > 0 && !didFitRef.current) {
      didFitRef.current = true;
      setTimeout(() => fitView({ padding: 0.5, duration: 600 }), 100);
    }
  }, [nodes, fitView]);

  // Push node data map upward for inspector
  useEffect(() => {
    const map: Record<string, ServiceNodeData> = {};
    nodes.forEach((n) => {
      map[n.id] = n.data as unknown as ServiceNodeData;
    });
    onNodesUpdate(map);
  }, [nodes, onNodesUpdate]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId],
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'Escape') {
        setSelectedNodeId(null);
      }
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey) {
        fitView({ padding: 0.2, duration: 600 });
      }
      // Delete / Backspace removes selected node
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        window.dispatchEvent(new Event('delete-node'));
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [selectedNodeId, setNodes, setEdges, setSelectedNodeId, fitView]);

  const addNewNode = useCallback(() => {
    const newId = `node-${++nodeIdCounter}`;
    const newNode: Node = {
      id: newId,
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      type: 'serviceNode',
      data: {
        label: 'New Service',
        type: 'service',
        icon: '⚡',
        status: 'Healthy',
        cost: '$0.02/HR',
        metricValue: 0,
        activeTab: 'CPU',
        description: '',
        region: 'us-east-1',
      } satisfies ServiceNodeData,
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  useEffect(() => {
    const handleAddNode = () => addNewNode();
    window.addEventListener('add-node', handleAddNode);
    return () => window.removeEventListener('add-node', handleAddNode);
  }, [addNewNode]);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) =>
        eds.filter((ed) => ed.source !== selectedNodeId && ed.target !== selectedNodeId),
      );
      setSelectedNodeId(null);
    }
  }, [selectedNodeId, setNodes, setEdges, setSelectedNodeId]);

  useEffect(() => {
    const handleDelete = () => deleteSelectedNode();
    window.addEventListener('delete-node', handleDelete);
    return () => window.removeEventListener('delete-node', handleDelete);
  }, [deleteSelectedNode]);

  // Update node data from inspector
  const updateNodeData = useCallback(
    (nodeId: string, patch: Partial<ServiceNodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n,
        ),
      );
    },
    [setNodes],
  );

  // Register update function with parent
  useEffect(() => {
    onRegisterUpdate(updateNodeData);
  }, [updateNodeData, onRegisterUpdate]);

  // Expose updateNodeData via global ref pattern is now replaced by onRegisterUpdate

  // Expose updateNodeData via global ref pattern is now replaced by onRegisterUpdate

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const styledNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === selectedNodeId,
      })),
    [nodes, selectedNodeId],
  );

  const typedOnNodesChange: OnNodesChange = onNodesChange;
  const typedOnEdgesChange: OnEdgesChange = onEdgesChange;

  if (isLoading) {
    return (
      <div className="canvas-state">
        <div className="canvas-spinner" />
        <p>Loading graph...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="canvas-state canvas-state--error">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <p>Failed to load graph</p>
        <span>Toggle &quot;Simulate Error&quot; to retry</span>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={styledNodes}
      edges={edges}
      onNodesChange={typedOnNodesChange}
      onEdgesChange={typedOnEdgesChange}
      onNodesDelete={(deletedNodes) => {
        if (deletedNodes.some((n) => n.id === selectedNodeId)) {
          setSelectedNodeId(null);
        }
      }}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      onPaneClick={handlePaneClick}
      nodeTypes={NODE_TYPES}
      fitView
      deleteKeyCode={null}  // We manage deletion ourselves
      selectionKeyCode="Shift"
      multiSelectionKeyCode="Shift"
      className="app-canvas"
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#2a2a2a" />
      <Controls className="flow-controls" />
      <MiniMap
        className="flow-minimap"
        nodeColor="#1a1a1a"
        maskColor="rgba(0,0,0,0.6)"
      />
    </ReactFlow>
  );
}
