import { useAppStore } from '@/store/useAppStore';
import { useApps } from '@/api/queries';
import type { AppItem } from '@/api/types';

export function TopBar() {
  const selectedAppId = useAppStore((s) => s.selectedAppId);
  const isAppPanelOpen = useAppStore((s) => s.isAppPanelOpen);
  const toggleAppPanel = useAppStore((s) => s.toggleAppPanel);

  const { data: apps } = useApps();
  const selectedApp = apps?.find((a: AppItem) => a.id === selectedAppId);

  return (
    <header className="top-bar" role="banner">
      <div className="top-bar__left">
        {/* ── Brand Logo ── */}
        <div className="top-bar__logo" aria-label="Ainyx">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="1" width="22" height="22" rx="4" fill="white" />
            <path d="M1 23 Q 12 23 23 1 V23 H1 Z" fill="black" />
          </svg>
        </div>

        {/* ── App selector button ── */}
        <button
          className={`top-bar__selector${isAppPanelOpen ? ' top-bar__selector--active' : ''}`}
          onClick={toggleAppPanel}
          id="app-selector-btn"
          aria-label="Select application"
          aria-expanded={isAppPanelOpen}
          aria-haspopup="listbox"
        >
          <div className="top-bar__selector-icon">
            <span>{selectedApp?.icon ?? '⚡'}</span>
          </div>
          <span className="top-bar__selector-name">{selectedApp?.name ?? 'Select app'}</span>
          <div className="top-bar__selector-arrows" aria-hidden="true">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M1 5 5 1 9 5" />
            </svg>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M1 1 5 5 9 1" />
            </svg>
          </div>
        </button>

        {/* ── More / kebab ── */}
        <button
          className="top-bar__more"
          id="app-more-btn"
          aria-label="More options"
          title="More options"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* ── Spacer ── */}
      <div className="top-bar__spacer" aria-hidden="true" />

      {/* ── Right actions ── */}
      <div className="top-bar__right">
        {/* Segmented control for actions */}
        <div className="top-bar__actions-group">
          {/* Share */}
          <button className="top-bar__action" id="share-btn" title="Share">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>

          {/* Moon (Active in screenshot) */}
          <button className="top-bar__action top-bar__action--active" id="theme-moon-btn" title="Dark theme">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          {/* Sun */}
          <button className="top-bar__action" id="theme-sun-btn" title="Light theme">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </button>

          {/* Avatar (inside group per Image 3) */}
          <button
            className="top-bar__avatar"
            id="user-avatar-btn"
            title="User profile"
            aria-label="User profile"
          >
            <div className="top-bar__avatar-gradient">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
