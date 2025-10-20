import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout for agent responses
});

// Dashboard KPIs
export interface DashboardKPIs {
  rrc_success_rate: number;
  active_cells: number;
  critical_alarms: number;
  network_load: number;
  status: 'Operational' | 'Degraded' | 'Critical';
}

export const getDashboardKPIs = async (): Promise<DashboardKPIs> => {
  const response = await apiClient.get('/api/dashboard/kpis');
  return response.data;
};

// Cell Status
export interface CellStatus {
  cell_id: string;
  latitude: number;
  longitude: number;
  status: 'Optimal' | 'Degraded' | 'Critical';
  load_percentage: number;
  rrc_success_rate: number;
}

export const getCellStatus = async (): Promise<CellStatus[]> => {
  const response = await apiClient.get('/api/cells/status');
  return response.data;
};

// Time-series Analytics
export interface TimeSeriesData {
  timestamp: string;
  rrc_success_rate: number;
  handover_success_rate: number;
  throughput_mbps: number;
}

export const getTimeSeries = async (hours: number = 24): Promise<TimeSeriesData[]> => {
  const response = await apiClient.get('/api/analytics/timeseries', {
    params: { hours }
  });
  return response.data;
};

// Cell Performance
export interface CellPerformance {
  cell_id: string;
  rrc_success_rate: number;
  handover_success_rate: number;
  network_load: number;
  active_alarms: number;
  status: 'Optimal' | 'Degraded' | 'Critical';
}

export const getCellPerformance = async (limit: number = 100): Promise<CellPerformance[]> => {
  const response = await apiClient.get('/api/cells/performance', {
    params: { limit }
  });
  return response.data;
};

// Agent Chat Interfaces
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  recommendation?: {
    title: string;
    description: string;
    impact: string;
  };
}

export interface AgentInvokeRequest {
  prompt: string;
  sessionId?: string;
}

export interface AgentInvokeResponse {
  completion: string;
  sessionId: string;
}

// Store session ID in memory for conversation continuity
let currentSessionId: string | null = null;

export const sendChatMessage = async (prompt: string, sessionId?: string): Promise<ChatMessage> => {
  try {
    const requestBody: AgentInvokeRequest = {
      prompt,
      sessionId: sessionId || currentSessionId || undefined
    };

    console.log('Sending chat message:', { prompt, sessionId: requestBody.sessionId });

    const response = await apiClient.post<AgentInvokeResponse>('/api/agent/invoke', requestBody);
    
    // Store session ID for future messages
    if (response.data.sessionId) {
      currentSessionId = response.data.sessionId;
    }

    console.log('Agent Response:', response.data);

    return {
      role: 'assistant',
      content: response.data.completion || 'No response received from agent',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error invoking agent:', error);
    throw error;
  }
};

// Reset the chat session (start a new conversation)
export const resetChatSession = (): void => {
  currentSessionId = null;
};

// KPI Heatmap
export interface HeatmapFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    kpi_value: number;
  };
}

export interface HeatmapData {
  type: 'FeatureCollection';
  features: HeatmapFeature[];
}

export const getKPIHeatmap = async (kpiName: string = 'throughput_mbps'): Promise<HeatmapData> => {
  const response = await apiClient.get('/api/kpi/heatmap', {
    params: { kpi_name: kpiName }
  });
  return response.data;
};

// Health Check
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await apiClient.get('/ping');
  return response.data;
};
