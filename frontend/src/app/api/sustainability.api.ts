/**
 * Sustainability API
 * Baselines, targets, scenarios, initiatives, risks, CSRD compliance, data quality
 */

import { api, simulateDelay, isMockMode, type ApiResponse } from './client';
import { mockBaseline, mockInitiatives, mockScenarios, mockRisks } from '../data/mockData';

export const sustainabilityApi = {
  async getOverview(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          baselines_count: 1,
          active_initiatives: mockInitiatives.filter(i => i.status === 'active').length,
          open_risks: mockRisks.filter(r => r.status !== 'closed').length,
          offices_count: 5,
          total_budget: mockInitiatives.reduce((sum, i) => sum + i.budget, 0),
          total_expected_reduction: mockInitiatives.reduce((sum, i) => sum + i.expectedReduction, 0),
          total_actual_reduction: mockInitiatives.reduce((sum, i) => sum + i.actualReduction, 0),
        },
      };
    }
    return api.get('/sustainability/overview');
  },

  // Baselines
  async getBaselines(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: [mockBaseline] }; }
    return api.get('/sustainability/baseline');
  },

  async createBaseline(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 'bl-' + Date.now(), ...data } }; }
    return api.post('/sustainability/baseline', data);
  },

  async lockBaseline(baselineId: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/sustainability/baseline/${baselineId}/lock`, data);
  },

  // Targets
  async getTargets(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          baseline_year: 2023, baseline_emissions: 2847,
          target_year: 2030, target_reduction_percent: 42,
          target_emissions: 1651, current_emissions: 1900,
          trajectory_status: 'on_track',
        },
      };
    }
    return api.get('/sustainability/targets');
  },

  // Scenarios
  async getScenarios(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: mockScenarios }; }
    return api.get('/sustainability/scenarios');
  },

  async createScenario(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 's-' + Date.now(), ...data } }; }
    return api.post('/sustainability/scenarios', data);
  },

  async runScenario(scenarioId: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          scenario_id: scenarioId, emissions_reduced: 387, roi: 2.4, payback: 3.2,
          breakdown: { carpool: 100, remote_work: 87, ev_adoption: 150, public_transport: 50 },
          recommendations: ['Increase carpooling by 5%', 'Add 1 remote day per week'],
        },
      };
    }
    return api.post(`/sustainability/scenarios/${scenarioId}/run`);
  },

  async deleteScenario(scenarioId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.delete(`/sustainability/scenarios/${scenarioId}`);
  },

  // Initiatives
  async getInitiatives(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: mockInitiatives }; }
    return api.get('/sustainability/initiatives');
  },

  async createInitiative(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 'i-' + Date.now(), ...data } }; }
    return api.post('/sustainability/initiatives', data);
  },

  async updateInitiative(id: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/sustainability/initiatives/${id}`, data);
  },

  // Risks
  async getRisks(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: mockRisks }; }
    return api.get('/sustainability/risks');
  },

  async createRisk(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 'r-' + Date.now(), ...data } }; }
    return api.post('/sustainability/risks', data);
  },

  async updateRisk(id: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/sustainability/risks/${id}`, data);
  },

  // CSRD / Data Quality / Climate Action Plan
  async getCSRDCompliance(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          overall_status: 'in_progress', completeness_score: 78.5, data_quality_score: 76.0,
          disclosures_completed: 7, disclosures_total: 9,
          gaps: [
            { id: 'E1-9', name: 'Financial risk assessment', description: 'Incomplete' },
          ],
          recommendations: ['Complete E1-9 disclosure', 'Improve data quality to 80%+'],
        },
      };
    }
    return api.get('/sustainability/csrd-compliance');
  },

  async getDataQuality(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: { overall_score: 78.5, criteria: [] },
      };
    }
    return api.get('/sustainability/data-quality');
  },

  async getClimateActionPlan(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: {} }; }
    return api.get('/sustainability/climate-action-plan');
  },

  // Approvals
  async getApprovals(params?: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: [] }; }
    return api.get('/sustainability/approvals', { params });
  },

  async approveRequest(approvalId: string, comments?: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/sustainability/approvals/${approvalId}/approve`, { comments });
  },

  async rejectRequest(approvalId: string, comments?: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/sustainability/approvals/${approvalId}/reject`, { comments });
  },
};