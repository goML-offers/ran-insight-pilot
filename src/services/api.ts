import axios from 'axios';
import { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } from '@aws-sdk/client-bedrock-agentcore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// AWS Bedrock AgentCore client
const bedrockClient = new BedrockAgentCoreClient({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
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

// Agent Chat
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

export interface ChatRequest {
  input: {
    prompt: string;
  };
}

export interface ChatResponse {
  output: {
    message: ChatMessage;
  };
}

// Generate a session ID (minimum 33 characters)
const generateSessionId = (): string => {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};

export const sendChatMessage = async (prompt: string): Promise<ChatMessage> => {
  const runtimeSessionId = generateSessionId();
  
  const input = {
    runtimeSessionId: runtimeSessionId,
    agentRuntimeArn: "arn:aws:bedrock-agentcore:ap-south-1:767828738296:runtime/ran_copilot-VJ4L3nAF4C",
    qualifier: "DEFAULT",
    payload: new TextEncoder().encode(JSON.stringify({ input: { prompt } })),
  };

  const command = new InvokeAgentRuntimeCommand(input);
  const response = await bedrockClient.send(command);
  const textResponse = await response.response?.transformToString();
  
  // Parse the response
  if (textResponse) {
    try {
      const parsedResponse = JSON.parse(textResponse);
      return parsedResponse.message || {
        role: 'assistant',
        content: parsedResponse.content || textResponse,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        role: 'assistant',
        content: textResponse,
        timestamp: new Date().toISOString(),
      };
    }
  }
  
  return {
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString(),
  };
};

// Health Check
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await apiClient.get('/ping');
  return response.data;
};
