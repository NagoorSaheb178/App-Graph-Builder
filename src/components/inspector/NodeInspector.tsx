import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAppGraph } from '@/api/queries';
import type { ServiceNodeData, NodeStatus, ResourceTab } from '@/api/types';

type InspectorTab = 'config' | 'runtime';

// These callbacks update node data via the parent canvas
type UpdateFn = (nodeId: string, patch: Partial<ServiceNodeData>) => void;

function StatusPill({ status }: { status: NodeStatus }) {
  const styles: Record<NodeStatus, string> = {
    Healthy: 'pill--green',
    Success: 'pill--green',
    Degraded: 'pill--yellow',
    Down: 'pill--red',
    Error: 'pill--red',
  };
  return (
    <span className={`status-pill ${styles[status]}`}>
      <span className="status-pill__dot" />
      {status}
    </span>
  );
}

function ConfigTabContent({
  data,
  nodeId,
  onUpdate,
}: {
  data: ServiceNodeData;
  nodeId: string;
  onUpdate: UpdateFn;
}) {
  const [name, setName] = useState(data.label);
  const [desc, setDesc] = useState(data.description);

  const statusOptions: NodeStatus[] = ['Healthy', 'Success', 'Degraded', 'Down', 'Error'];

  return (
    <div className="inspector-tab-content">
      <div className="field-group">
        <label className="field-label">Service Name</label>
        <input
          className="field-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => onUpdate(nodeId, { label: name })}
          placeholder="Service name..."
        />
      </div>
      <div className="field-group">
        <label className="field-label">Description</label>
        <textarea
          className="field-textarea"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={() => onUpdate(nodeId, { description: desc })}
          placeholder="Describe this service..."
          rows={3}
        />
      </div>
      <div className="field-group">
        <label className="field-label">Region</label>
        <input
          className="field-input field-input--readonly"
          value={data.region}
          readOnly
        />
      </div>
      <div className="field-group">
        <label className="field-label">Status Override</label>
        <div className="status-select-row">
          {statusOptions.map((s) => (
            <button
              key={s}
              className={`status-select-btn${data.status === s ? ' status-select-btn--active' : ''}`}
              onClick={() => onUpdate(nodeId, { status: s })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="field-group">
        <label className="field-label">Type</label>
        <div className="type-toggle">
          {(['service', 'database'] as const).map((t) => (
            <button
              key={t}
              className={`type-btn${data.type === t ? ' type-btn--active' : ''}`}
              onClick={() => onUpdate(nodeId, { type: t })}
            >
              {t === 'service' ? '⚡ Service' : '🗄️ Database'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RuntimeTabContent({
  data,
  nodeId,
  onUpdate,
}: {
  data: ServiceNodeData;
  nodeId: string;
  onUpdate: UpdateFn;
}) {
  const [sliderVal, setSliderVal] = useState(data.metricValue);
  const [inputVal, setInputVal] = useState(String(data.metricValue));

  const handleSlider = useCallback(
    (val: number) => {
      const c = Math.max(0, Math.min(100, val));
      setSliderVal(c);
      setInputVal(String(c));
      onUpdate(nodeId, { metricValue: c });
    },
    [nodeId, onUpdate],
  );

  const handleInput = useCallback(
    (raw: string) => {
      setInputVal(raw);
      const n = parseInt(raw, 10);
      if (!isNaN(n)) {
        const c = Math.max(0, Math.min(100, n));
        setSliderVal(c);
        onUpdate(nodeId, { metricValue: c });
      }
    },
    [nodeId, onUpdate],
  );

  const tabs: ResourceTab[] = ['CPU', 'Memory', 'Disk', 'Region'];

  return (
    <div className="inspector-tab-content">
      <div className="field-group">
        <label className="field-label">Active Metric</label>
        <div className="resource-tabs">
          {tabs.map((t) => (
            <button
              key={t}
              className={`resource-tab${data.activeTab === t ? ' resource-tab--active' : ''}`}
              onClick={() => onUpdate(nodeId, { activeTab: t })}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="field-group">
        <div className="slider-header">
          <label className="field-label">Usage ({data.activeTab})</label>
          <span className="slider-pct">{sliderVal}%</span>
        </div>
        <div className="inspector-slider-wrap">
          <div
            className="inspector-slider-track"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #22c55e 30%, #eab308 70%, #ef4444 100%)`,
            }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={sliderVal}
            className="inspector-slider-input"
            onChange={(e) => handleSlider(Number(e.target.value))}
          />
        </div>
        <div className="slider-input-row">
          <span className="slider-label">0</span>
          <input
            type="number"
            min={0}
            max={100}
            value={inputVal}
            className="field-input field-input--small"
            onChange={(e) => handleInput(e.target.value)}
            onBlur={() => {
              const n = parseInt(inputVal, 10);
              if (isNaN(n)) setInputVal(String(sliderVal));
            }}
          />
          <span className="slider-label">100</span>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Cost</label>
        <div className="cost-display">
          <span className="cost-badge">{data.cost}</span>
        </div>
      </div>

      <div className="runtime-stats">
        <div className="stat-card">
          <span className="stat-label">CPU</span>
          <div className="stat-bar-wrap">
            <div className="stat-bar-fill" style={{ width: '35%' }} />
          </div>
          <span className="stat-val">35%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Memory</span>
          <div className="stat-bar-wrap">
            <div className="stat-bar-fill" style={{ width: '62%', background: '#22c55e' }} />
          </div>
          <span className="stat-val">0.05 GB</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Disk</span>
          <div className="stat-bar-wrap">
            <div className="stat-bar-fill" style={{ width: '80%', background: '#eab308' }} />
          </div>
          <span className="stat-val">10.00 GB</span>
        </div>
      </div>
    </div>
  );
}

interface NodeInspectorProps {
  nodeDataMap: Record<string, ServiceNodeData>;
  onUpdateNode: UpdateFn;
}

export function NodeInspector({ nodeDataMap, onUpdateNode }: NodeInspectorProps) {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const selectedAppId = useAppStore((s) => s.selectedAppId);
  const activeTab = useAppStore((s) => s.activeInspectorTab) as InspectorTab;
  const setActiveTab = useAppStore((s) => s.setActiveInspectorTab);

  const { data: graphData } = useAppGraph(selectedAppId);

  if (!selectedNodeId) {
    return (
      <div className="inspector-empty">
        <div className="inspector-empty__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <p className="inspector-empty__text">Select a node to inspect</p>
        <span className="inspector-empty__hint">Click any node on the canvas</span>
      </div>
    );
  }

  // Prefer live node data (from ReactFlow state), fall back to query data
  const nodeData =
    nodeDataMap[selectedNodeId] ??
    (graphData?.nodes.find((n) => n.id === selectedNodeId)?.data as ServiceNodeData | undefined);

  if (!nodeData) return null;

  return (
    <div className="node-inspector">
      {/* Header */}
      <div className="inspector-header">
        <div className="inspector-title">
          <span className="inspector-icon">{nodeData.icon}</span>
          <div>
            <h3 className="inspector-name">{nodeData.label}</h3>
            <p className="inspector-type">{nodeData.type}</p>
          </div>
        </div>
        <StatusPill status={nodeData.status} />
      </div>

      {/* Tabs */}
      <div className="inspector-tabs">
        {(['config', 'runtime'] as InspectorTab[]).map((t) => (
          <button
            key={t}
            className={`inspector-tab-btn${activeTab === t ? ' inspector-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(t)}
            id={`inspector-tab-${t}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'config' && (
        <ConfigTabContent data={nodeData} nodeId={selectedNodeId} onUpdate={onUpdateNode} />
      )}
      {activeTab === 'runtime' && (
        <RuntimeTabContent data={nodeData} nodeId={selectedNodeId} onUpdate={onUpdateNode} />
      )}

      {/* Mobile-friendly Delete Button */}
      <div className="inspector-footer">
        <button
          className="inspector-delete-btn"
          onClick={() => window.dispatchEvent(new Event('delete-node'))}
          title="Delete selected node"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete Node
        </button>
      </div>
    </div>
  );
}
