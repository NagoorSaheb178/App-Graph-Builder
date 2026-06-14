import { useQuery } from '@tanstack/react-query';
import type { AppItem, AppGraph } from './types';
import { useAppStore } from '@/store/useAppStore';

export function useApps() {
  const simulateError = useAppStore((s) => s.simulateError);

  return useQuery<AppItem[]>({
    queryKey: ['apps', simulateError],
    queryFn: async () => {
      const res = await fetch('/api/apps');
      if (!res.ok || simulateError) {
        throw new Error('Failed to load apps');
      }
      return res.json() as Promise<AppItem[]>;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useAppGraph(appId: string | null) {
  const simulateError = useAppStore((s) => s.simulateError);

  return useQuery<AppGraph>({
    queryKey: ['graph', appId, simulateError],
    queryFn: async () => {
      if (!appId) throw new Error('No app selected');
      const res = await fetch(`/api/apps/${appId}/graph`);
      if (!res.ok || simulateError) {
        throw new Error('Failed to load graph');
      }
      return res.json() as Promise<AppGraph>;
    },
    enabled: !!appId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}
