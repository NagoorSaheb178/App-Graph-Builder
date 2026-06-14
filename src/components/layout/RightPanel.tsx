import { useAppStore } from '@/store/useAppStore';
import { NodeInspector } from '@/components/inspector/NodeInspector';
import type { ServiceNodeData } from '@/api/types';

interface RightPanelProps {
  nodeDataMap: Record<string, ServiceNodeData>;
  onUpdateNode: (nodeId: string, patch: Partial<ServiceNodeData>) => void;
}

export function RightPanel({ nodeDataMap, onUpdateNode }: RightPanelProps) {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);

  // Don't render when nothing is selected
  if (!selectedNodeId) return null;

  return (
    <>
      {/* Mobile-only overlay — click to dismiss inspector */}
      <div
        className="panel-overlay"
        onClick={() => setSelectedNodeId(null)}
        aria-hidden="true"
      />

      <aside className="right-panel" aria-label="Node inspector">
        {/* Mobile-only close button */}
        <button
          className="right-panel__close"
          onClick={() => setSelectedNodeId(null)}
          aria-label="Close node inspector"
          id="close-inspector-btn"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <NodeInspector nodeDataMap={nodeDataMap} onUpdateNode={onUpdateNode} />
      </aside>
    </>
  );
}
