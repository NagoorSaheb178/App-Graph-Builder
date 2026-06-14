import { memo, useCallback, useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import type { ServiceNodeData, ResourceTab, NodeStatus } from '@/api/types';

type TabDef = { id: ResourceTab; label: string };
const TABS: TabDef[] = [
  { id: 'CPU', label: 'CPU' },
  { id: 'Memory', label: 'Memory' },
  { id: 'Disk', label: 'Disk' },
  { id: 'Region', label: 'Region' },
];

function TabIcon({ id }: { id: ResourceTab }) {
  if (id === 'CPU') {
    return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
        <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" />
        <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" />
      </svg>
    );
  }
  if (id === 'Memory') {
    return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="10" rx="2" />
        <line x1="7" y1="7" x2="7" y2="4" /><line x1="12" y1="7" x2="12" y2="4" /><line x1="17" y1="7" x2="17" y2="4" />
        <line x1="7" y1="17" x2="7" y2="20" /><line x1="12" y1="17" x2="12" y2="20" /><line x1="17" y1="17" x2="17" y2="20" />
      </svg>
    );
  }
  if (id === 'Disk') {
    return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    );
  }
  // Region
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
  );
}

function StatusBadge({ status }: { status: NodeStatus }) {
  const isGood = status === 'Success' || status === 'Healthy';
  const isBad = status === 'Error' || status === 'Down';
  const isDeg = status === 'Degraded';

  let cls = 'sn-status';
  if (isGood) cls += ' sn-status--success';
  else if (isBad) cls += ' sn-status--error';
  else if (isDeg) cls += ' sn-status--degraded';

  return (
    <div className={cls}>
      {isGood ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" stroke="currentColor" />
          <polyline points="8,12 11,15 16,9" stroke="currentColor" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" />
          <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      )}
      <span>{status}</span>
    </div>
  );
}

function AwsLogo() {
  return (
    <div className="sn-aws">
      <span className="aws-text">aws</span>
      <svg width="36" height="12" viewBox="0 0 90 22" fill="none">
        <path d="M8 11 Q28 20 45 18 Q62 16 82 11" stroke="#ff9900" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M74 6 L82 11 L74 16" stroke="#ff9900" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

export const ServiceNode = memo(function ServiceNode({ data, id, selected }: NodeProps) {
  const nd = data as unknown as ServiceNodeData;
  const { updateNodeData } = useReactFlow();

  // Derive activeTab directly from node data — no local state needed
  const activeTab: ResourceTab = nd.activeTab ?? 'CPU';

  // Keep a local slider value only for smooth dragging; sync from node data
  const [sliderValue, setSliderValue] = useState(nd.metricValue ?? 0);
  // Use the authoritative node data value unless user is currently dragging
  const displaySlider = sliderValue !== nd.metricValue ? sliderValue : (nd.metricValue ?? 0);

  const handleSlider = useCallback(
    (val: number) => {
      const v = Math.max(0, Math.min(100, val));
      setSliderValue(v);
      updateNodeData(id, { metricValue: v });
    },
    [id, updateNodeData],
  );

  const handleTab = useCallback(
    (tab: ResourceTab) => {
      updateNodeData(id, { activeTab: tab });
    },
    [id, updateNodeData],
  );


  return (
    <div
      className={[
        'service-node',
        selected ? 'service-node--selected' : '',
        nd.type === 'database' ? 'service-node--db' : 'service-node--svc',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width: 292 }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      {/* ── Header ── */}
      <div className="sn-header">
        <div className="sn-title">
          <span className="sn-icon">{nd.icon}</span>
          <span className="sn-name">{nd.label}</span>
        </div>
        <div className="sn-right">
          <span className="sn-cost">{nd.cost}</span>
          <button className="sn-gear" onClick={(e) => e.stopPropagation()} title="Settings">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Metric labels ── */}
      <div className="sn-metrics">
        <span className="sn-metric">0.02</span>
        <span className="sn-metric">0.05 GB</span>
        <span className="sn-metric">10.00 GB</span>
        <span className="sn-metric">1</span>
      </div>

      {/* ── Resource tabs ── */}
      <div className="sn-tabs" onClick={(e) => e.stopPropagation()}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`sn-tab${activeTab === t.id ? ' sn-tab--active' : ''}`}
            onClick={() => handleTab(t.id)}
          >
            <TabIcon id={t.id} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Gradient slider + value ── */}
      <div className="sn-slider-row" onClick={(e) => e.stopPropagation()}>
        <div className="sn-slider-wrap">
          <div className="sn-slider-track" />
          <input
            type="range"
            min={0}
            max={100}
            value={displaySlider}
            className="sn-slider-input"
            onChange={(e) => handleSlider(Number(e.target.value))}
          />
        </div>
        <span className="sn-slider-val">{(0.005 + displaySlider * 0.0005).toFixed(2)}</span>
      </div>

      {/* ── Footer: status + AWS ── */}
      <div className="sn-footer">
        <StatusBadge status={nd.status} />
        <AwsLogo />
      </div>
    </div>
  );
});
