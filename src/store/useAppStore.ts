import { create } from 'zustand';

type InspectorTab = 'config' | 'runtime';

interface AppStore {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
  simulateError: boolean;
  isAppPanelOpen: boolean;

  setSelectedAppId: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  toggleMobilePanel: () => void;
  setMobilePanelOpen: (open: boolean) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  toggleSimulateError: () => void;
  setAppPanelOpen: (open: boolean) => void;
  toggleAppPanel: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedAppId: 'supertokens-golang',
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  simulateError: false,
  isAppPanelOpen: false,

  setSelectedAppId: (id) => set({ selectedAppId: id, selectedNodeId: null, isAppPanelOpen: false }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  toggleMobilePanel: () => set((s) => ({ isMobilePanelOpen: !s.isMobilePanelOpen })),
  setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
  toggleSimulateError: () => set((s) => ({ simulateError: !s.simulateError })),
  setAppPanelOpen: (open) => set({ isAppPanelOpen: open }),
  toggleAppPanel: () => set((s) => ({ isAppPanelOpen: !s.isAppPanelOpen })),
}));
