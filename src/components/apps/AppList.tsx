import { useState } from 'react';
import { useApps } from '@/api/queries';
import { useAppStore } from '@/store/useAppStore';
import type { AppItem } from '@/api/types';

function AppSkeleton() {
  return (
    <div className="app-skeleton">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="app-skeleton__item">
          <div className="app-skeleton__icon skeleton-pulse" />
          <div className="app-skeleton__text skeleton-pulse" />
        </div>
      ))}
    </div>
  );
}

function AppListItem({ app, isSelected }: { app: AppItem; isSelected: boolean }) {
  const setSelectedAppId = useAppStore((s) => s.setSelectedAppId);
  return (
    <button
      className={`app-item${isSelected ? ' app-item--selected' : ''}`}
      onClick={() => setSelectedAppId(app.id)}
      id={`app-item-${app.id}`}
    >
      <div className="app-item__icon">
        <span>{app.icon}</span>
      </div>
      <span className="app-item__name">{app.name}</span>
      <svg
        className="app-item__chevron"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

export function AppList() {
  const [search, setSearch] = useState('');
  const selectedAppId = useAppStore((s) => s.selectedAppId);
  const isAppPanelOpen = useAppStore((s) => s.isAppPanelOpen);
  const setAppPanelOpen = useAppStore((s) => s.setAppPanelOpen);
  const simulateError = useAppStore((s) => s.simulateError);
  const toggleSimulateError = useAppStore((s) => s.toggleSimulateError);

  const { data: apps, isLoading, isError, refetch } = useApps();

  const filtered = (apps ?? []).filter((a: AppItem) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (!isAppPanelOpen) return null;

  return (
    <>
      {/* Click-away backdrop */}
      <div
        className="app-panel-backdrop"
        onClick={() => setAppPanelOpen(false)}
        aria-hidden="true"
      />

      {/* Floating panel */}
      <div className="app-panel" role="dialog" aria-label="Application selector" aria-modal="true">

        {/* Header */}
        <div className="app-panel__header">
          <h2 className="app-panel__title">Application</h2>
          <button
            className="app-panel__close-btn"
            onClick={() => setAppPanelOpen(false)}
            aria-label="Close application panel"
            id="app-panel-close-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="app-panel__search-row">
          <div className="search-wrap">
            <span className="search-icon-inner">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              id="app-search"
              className="search-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button
            className="add-btn"
            title="Add Node"
            id="add-node-dropdown-btn"
            aria-label="Add Node"
            onClick={() => window.dispatchEvent(new Event('add-node'))}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Simulate error toggle */}
        <div className="app-panel__footer">
          <label className="error-toggle-row">
            <input
              type="checkbox"
              id="simulate-error-toggle"
              checked={simulateError}
              onChange={toggleSimulateError}
              className="toggle-check"
            />
            <span className="toggle-switch" />
            <span className="toggle-text">Simulate Error</span>
          </label>
        </div>

        {/* App list */}
        <div className="app-panel__items">
          {isLoading && <AppSkeleton />}
          {isError && (
            <div className="app-panel__error">
              <p>Failed to load apps</p>
              <button className="retry-btn" onClick={() => void refetch()}>
                Retry
              </button>
            </div>
          )}
          {!isLoading &&
            !isError &&
            filtered.map((app: AppItem) => (
              <AppListItem key={app.id} app={app} isSelected={app.id === selectedAppId} />
            ))}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="app-panel__empty">No apps found</p>
          )}
        </div>
      </div>
    </>
  );
}
