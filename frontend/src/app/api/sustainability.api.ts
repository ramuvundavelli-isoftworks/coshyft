/**
 * Sustainability API
 * Baselines, targets, scenarios, initiatives, risks, CSRD compliance, data quality
 */

import { api, type ApiResponse } from './client';

export const sustainabilityApi = {
  async getOverview(): Promise<ApiResponse> {
    return api.get('/sustainability/overview');
  },

  // Baselines
  async getBaselines(): Promise<ApiResponse> {
    return api.get('/sustainability/baseline');
  },

  async createBaseline(data: any): Promise<ApiResponse> {
    return api.post('/sustainability/baseline', data);
  },

  async lockBaseline(baselineId: string, data: any): Promise<ApiResponse> {
    return api.put(`/sustainability/baseline/${baselineId}/lock`, data);
  },

  // Targets
  async getTargets(): Promise<ApiResponse> {
    return api.get('/sustainability/targets');
  },

  async createTarget(data: {
    baseline_year: number;
    target_year: number;
    target_reduction_percent: number;
    methodology?: string;
    notes?: string;
  }): Promise<ApiResponse> {
    return api.post('/sustainability/targets', data);
  },

  async updateTarget(targetId: string, data: {
    target_reduction_percent?: number;
    target_year?: number;
    methodology?: string;
    notes?: string;
  }): Promise<ApiResponse> {
    return api.put(`/sustainability/targets/${targetId}`, data);
  },

  // Scenarios
  async getScenarios(): Promise<ApiResponse> {
    return api.get('/sustainability/scenarios');
  },

  async createScenario(data: any): Promise<ApiResponse> {
    return api.post('/sustainability/scenarios', data);
  },

  async runScenario(scenarioId: string): Promise<ApiResponse> {
    return api.post(`/sustainability/scenarios/${scenarioId}/run`);
  },

  async deleteScenario(scenarioId: string): Promise<ApiResponse> {
    return api.delete(`/sustainability/scenarios/${scenarioId}`);
  },

  // Initiatives
  async getInitiatives(): Promise<ApiResponse> {
    return api.get('/sustainability/initiatives');
  },

  async createInitiative(data: any): Promise<ApiResponse> {
    return api.post('/sustainability/initiatives', data);
  },

  async updateInitiative(id: string, data: any): Promise<ApiResponse> {
    return api.put(`/sustainability/initiatives/${id}`, data);
  },

  async deleteInitiative(id: string): Promise<ApiResponse> {
    return api.delete(`/sustainability/initiatives/${id}`);
  },

  // Risks
  async getRisks(): Promise<ApiResponse> {
    return api.get('/sustainability/risks');
  },

  async createRisk(data: any): Promise<ApiResponse> {
    return api.post('/sustainability/risks', data);
  },

  async updateRisk(id: string, data: any): Promise<ApiResponse> {
    return api.put(`/sustainability/risks/${id}`, data);
  },

  async deleteRisk(id: string): Promise<ApiResponse> {
    return api.delete(`/sustainability/risks/${id}`);
  },

  // CSRD / Data Quality / Climate Action Plan
  async getCSRDCompliance(): Promise<ApiResponse> {
    return api.get('/sustainability/csrd-compliance');
  },

  async getDataQuality(): Promise<ApiResponse> {
    return api.get('/sustainability/data-quality');
  },

  async getClimateActionPlan(): Promise<ApiResponse> {
    return api.get('/sustainability/climate-action-plan');
  },

  // Organisational Boundary
  async getBoundary(): Promise<ApiResponse> {
    return api.get('/sustainability/boundary');
  },

  async setBoundary(data: {
    approach: string;
    included_entities?: any[];
    excluded_entities?: any[];
    exclusion_rationale?: string;
  }): Promise<ApiResponse> {
    return api.post('/sustainability/boundary', data);
  },

  // Methodology & DPIA
  async getMethodology(): Promise<ApiResponse> {
    return api.get('/sustainability/methodology');
  },

  async getDPIA(): Promise<ApiResponse> {
    return api.get('/sustainability/dpia');
  },

  // Approvals
  async getApprovals(params?: any): Promise<ApiResponse> {
    return api.get('/sustainability/approvals', { params });
  },

  async approveRequest(approvalId: string, comments?: string): Promise<ApiResponse> {
    return api.post(`/sustainability/approvals/${approvalId}/approve`, { comments });
  },

  async rejectRequest(approvalId: string, comments?: string): Promise<ApiResponse> {
    return api.post(`/sustainability/approvals/${approvalId}/reject`, { comments });
  },
};
