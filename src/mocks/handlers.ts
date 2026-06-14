import { http, HttpResponse } from 'msw';
import type { AppItem, AppGraph } from '@/api/types';

const APPS: AppItem[] = [
  { id: 'supertokens-golang', name: 'supertokens-golang', icon: '🐹', color: '#7c3aed' },
  { id: 'supertokens-java', name: 'supertokens-java', icon: '☕', color: '#ef4444' },
  { id: 'supertokens-python', name: 'supertokens-python', icon: '🐍', color: '#f97316' },
  { id: 'supertokens-ruby', name: 'supertokens-ruby', icon: '💎', color: '#8b5cf6' },
  { id: 'supertokens-go', name: 'supertokens-go', icon: '🚀', color: '#06b6d4' },
];

const GRAPHS: Record<string, AppGraph> = {
  'supertokens-golang': {
    nodes: [
      {
        id: 'redis-1',
        position: { x: 80, y: 280 },
        type: 'serviceNode',
        data: {
          label: 'Redis',
          type: 'database',
          icon: '🔴',
          status: 'Error',
          cost: '$0.03/HR',
          metricValue: 42,
          activeTab: 'CPU',
          description: 'In-memory data store for caching sessions',
          region: 'us-east-1',
        },
      },
      {
        id: 'postgres-1',
        position: { x: 480, y: 80 },
        type: 'serviceNode',
        data: {
          label: 'Postgres',
          type: 'database',
          icon: '🐘',
          status: 'Success',
          cost: '$0.03/HR',
          metricValue: 65,
          activeTab: 'CPU',
          description: 'Primary relational database',
          region: 'us-east-1',
        },
      },
      {
        id: 'mongodb-1',
        position: { x: 480, y: 360 },
        type: 'serviceNode',
        data: {
          label: 'Mongodb',
          type: 'database',
          icon: '🍃',
          status: 'Error',
          cost: '$0.03/HR',
          metricValue: 78,
          activeTab: 'CPU',
          description: 'NoSQL document store',
          region: 'us-west-2',
        },
      },
      {
        id: 'api-1',
        position: { x: 80, y: 160 },
        type: 'serviceNode',
        data: {
          label: 'API Gateway',
          type: 'service',
          icon: '⚡',
          status: 'Healthy',
          cost: '$0.05/HR',
          metricValue: 23,
          activeTab: 'Memory',
          description: 'Main API gateway service',
          region: 'us-east-1',
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'api-1', target: 'postgres-1', animated: false, style: { stroke: '#4ade80', strokeWidth: 2 } },
      { id: 'e1-3', source: 'api-1', target: 'redis-1', animated: false, style: { stroke: '#60a5fa', strokeWidth: 2 } },
      { id: 'e2-3', source: 'api-1', target: 'mongodb-1', animated: false, style: { stroke: '#a78bfa', strokeWidth: 2 } },
    ],
  },
  'supertokens-java': {
    nodes: [
      {
        id: 'java-redis',
        position: { x: 100, y: 200 },
        type: 'serviceNode',
        data: {
          label: 'Redis Cache',
          type: 'database',
          icon: '🔴',
          status: 'Healthy',
          cost: '$0.02/HR',
          metricValue: 30,
          activeTab: 'Memory',
          description: 'Session cache for Java backend',
          region: 'eu-west-1',
        },
      },
      {
        id: 'java-pg',
        position: { x: 420, y: 120 },
        type: 'serviceNode',
        data: {
          label: 'PostgreSQL',
          type: 'database',
          icon: '🐘',
          status: 'Healthy',
          cost: '$0.04/HR',
          metricValue: 55,
          activeTab: 'CPU',
          description: 'Java app primary database',
          region: 'eu-west-1',
        },
      },
      {
        id: 'java-api',
        position: { x: 250, y: 20 },
        type: 'serviceNode',
        data: {
          label: 'Spring Boot',
          type: 'service',
          icon: '🌿',
          status: 'Healthy',
          cost: '$0.06/HR',
          metricValue: 48,
          activeTab: 'CPU',
          description: 'Java Spring Boot API service',
          region: 'eu-west-1',
        },
      },
    ],
    edges: [
      { id: 'j1', source: 'java-api', target: 'java-redis', animated: false, style: { stroke: '#4ade80', strokeWidth: 2 } },
      { id: 'j2', source: 'java-api', target: 'java-pg', animated: false, style: { stroke: '#60a5fa', strokeWidth: 2 } },
    ],
  },
  'supertokens-python': {
    nodes: [
      {
        id: 'py-django',
        position: { x: 200, y: 50 },
        type: 'serviceNode',
        data: {
          label: 'Django API',
          type: 'service',
          icon: '🐍',
          status: 'Degraded',
          cost: '$0.04/HR',
          metricValue: 89,
          activeTab: 'CPU',
          description: 'Python Django REST framework',
          region: 'ap-south-1',
        },
      },
      {
        id: 'py-pg',
        position: { x: 50, y: 280 },
        type: 'serviceNode',
        data: {
          label: 'Postgres',
          type: 'database',
          icon: '🐘',
          status: 'Healthy',
          cost: '$0.03/HR',
          metricValue: 40,
          activeTab: 'Disk',
          description: 'Primary database',
          region: 'ap-south-1',
        },
      },
      {
        id: 'py-celery',
        position: { x: 400, y: 280 },
        type: 'serviceNode',
        data: {
          label: 'Celery Worker',
          type: 'service',
          icon: '🌿',
          status: 'Error',
          cost: '$0.02/HR',
          metricValue: 95,
          activeTab: 'CPU',
          description: 'Async task worker',
          region: 'ap-south-1',
        },
      },
    ],
    edges: [
      { id: 'p1', source: 'py-django', target: 'py-pg', animated: false, style: { stroke: '#f97316', strokeWidth: 2 } },
      { id: 'p2', source: 'py-django', target: 'py-celery', animated: false, style: { stroke: '#ef4444', strokeWidth: 2 } },
    ],
  },
  'supertokens-ruby': {
    nodes: [
      {
        id: 'rb-rails',
        position: { x: 200, y: 60 },
        type: 'serviceNode',
        data: {
          label: 'Rails API',
          type: 'service',
          icon: '💎',
          status: 'Healthy',
          cost: '$0.05/HR',
          metricValue: 35,
          activeTab: 'Memory',
          description: 'Ruby on Rails REST API',
          region: 'us-west-2',
        },
      },
      {
        id: 'rb-pg',
        position: { x: 60, y: 300 },
        type: 'serviceNode',
        data: {
          label: 'PostgreSQL',
          type: 'database',
          icon: '🐘',
          status: 'Healthy',
          cost: '$0.03/HR',
          metricValue: 50,
          activeTab: 'CPU',
          description: 'Primary DB',
          region: 'us-west-2',
        },
      },
      {
        id: 'rb-redis',
        position: { x: 400, y: 300 },
        type: 'serviceNode',
        data: {
          label: 'Redis',
          type: 'database',
          icon: '🔴',
          status: 'Healthy',
          cost: '$0.02/HR',
          metricValue: 20,
          activeTab: 'Memory',
          description: 'Cache layer',
          region: 'us-west-2',
        },
      },
    ],
    edges: [
      { id: 'r1', source: 'rb-rails', target: 'rb-pg', animated: false, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
      { id: 'r2', source: 'rb-rails', target: 'rb-redis', animated: false, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    ],
  },
  'supertokens-go': {
    nodes: [
      {
        id: 'go-fiber',
        position: { x: 200, y: 60 },
        type: 'serviceNode',
        data: {
          label: 'Fiber API',
          type: 'service',
          icon: '🚀',
          status: 'Healthy',
          cost: '$0.03/HR',
          metricValue: 18,
          activeTab: 'CPU',
          description: 'Go Fiber high-performance API',
          region: 'us-east-1',
        },
      },
      {
        id: 'go-pg',
        position: { x: 50, y: 300 },
        type: 'serviceNode',
        data: {
          label: 'CockroachDB',
          type: 'database',
          icon: '🪳',
          status: 'Healthy',
          cost: '$0.06/HR',
          metricValue: 44,
          activeTab: 'Disk',
          description: 'Distributed SQL database',
          region: 'us-east-1',
        },
      },
      {
        id: 'go-nats',
        position: { x: 400, y: 300 },
        type: 'serviceNode',
        data: {
          label: 'NATS',
          type: 'service',
          icon: '📨',
          status: 'Healthy',
          cost: '$0.01/HR',
          metricValue: 12,
          activeTab: 'Memory',
          description: 'Message broker',
          region: 'us-east-1',
        },
      },
    ],
    edges: [
      { id: 'g1', source: 'go-fiber', target: 'go-pg', animated: false, style: { stroke: '#06b6d4', strokeWidth: 2 } },
      { id: 'g2', source: 'go-fiber', target: 'go-nats', animated: false, style: { stroke: '#06b6d4', strokeWidth: 2 } },
    ],
  },
};

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export const handlers = [
  http.get('/api/apps', async () => {
    await delay(400);
    return HttpResponse.json(APPS);
  }),

  http.get('/api/apps/:appId/graph', async ({ params }) => {
    await delay(600);
    const appId = params['appId'] as string;
    const graph = GRAPHS[appId];
    if (!graph) {
      return HttpResponse.json({ error: 'App not found' }, { status: 404 });
    }
    return HttpResponse.json(graph);
  }),
];
