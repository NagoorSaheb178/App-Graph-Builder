import { useState, useCallback, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TopBar } from '@/components/layout/TopBar';
import { LeftRail } from '@/components/layout/LeftRail';
import { RightPanel } from '@/components/layout/RightPanel';
import { AppList } from '@/components/apps/AppList';
import { AppCanvasInner } from '@/components/canvas/AppCanvas';
import type { ServiceNodeData } from '@/api/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [nodeDataMap, setNodeDataMap] = useState<Record<string, ServiceNodeData>>({});

  const updateNodeDataRef = useRef<((nodeId: string, patch: Partial<ServiceNodeData>) => void) | null>(null);

  const handleNodesUpdate = useCallback((map: Record<string, ServiceNodeData>) => {
    setNodeDataMap(map);
  }, []);

  const handleRegisterUpdate = useCallback(
    (fn: (nodeId: string, patch: Partial<ServiceNodeData>) => void) => {
      updateNodeDataRef.current = fn;
    },
    [],
  );

  const handleUpdateNode = useCallback(
    (nodeId: string, patch: Partial<ServiceNodeData>) => {
      updateNodeDataRef.current?.(nodeId, patch);
    },
    [],
  );

  return (
    <div className="app-root">
      <TopBar />

      {/* Floating app-selector panel — self-positions via position:fixed */}
      <AppList />

      <div className="app-body">
        <LeftRail />
        <main className="app-main">
          <AppCanvasInner
            onNodesUpdate={handleNodesUpdate}
            onRegisterUpdate={handleRegisterUpdate}
          />
        </main>
        <RightPanel nodeDataMap={nodeDataMap} onUpdateNode={handleUpdateNode} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <AppContent />
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}
