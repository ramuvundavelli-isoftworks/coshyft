/**
 * Auditor API
 * Reviews, audit trail, evidence, reports
 */

import { api, simulateDelay, isMockMode, type ApiResponse } from './client';

export const auditorApi = {
  async getOverview(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          total_findings: 12, critical_findings: 2,
          open_reviews: 5, completed_reviews: 18,
          evidence_items: 34, verified_evidence: 28,
          compliance_score: 78.5,
        },
      };
    }
    return api.get('/auditor/overview');
  },

  async reviewEmissions(year = 2026): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: {} }; }
    return api.get('/auditor/emissions-review', { params: { year } });
  },

  async reviewBaseline(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: [] }; }
    return api.get('/auditor/baseline-review');
  },

  async reviewFactors(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: [] }; }
    return api.get('/auditor/factors-review');
  },

  async reviewRisks(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: [] }; }
    return api.get('/auditor/risks-review');
  },

  async getAuditTrail(params?: any): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: { items: [], total: 0, page: 1, page_size: 50, total_pages: 0 } };
    }
    return api.get('/auditor/trail', { params });
  },

  async getEvidence(params?: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: [] }; }
    return api.get('/auditor/evidence', { params });
  },

  async uploadEvidence(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 'ev-' + Date.now() } }; }
    return api.post('/auditor/evidence', data);
  },

  async verifyEvidence(evidenceId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/auditor/evidence/${evidenceId}/verify`);
  },

  // Findings
  async addFinding(data: { area: string; description: string; severity?: string }): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 'f-' + Date.now(), ...data } }; }
    return api.post('/auditor/findings', data);
  },

  // Review scheduling
  async scheduleReview(data: { area: string; date?: string; notes?: string }): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post('/auditor/reviews/schedule', data);
  },

  // Baseline review actions
  async addAuditNote(data: { area: string; note: string }): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post('/auditor/notes', data);
  },

  async requestClarification(data: { area: string; question?: string }): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post('/auditor/clarification-requests', data);
  },

  async approveReviewArea(area: string, data?: { comments?: string }): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/auditor/reviews/${area}/approve`, data);
  },

  // Emissions review actions
  async flagIssue(data: { sample_id: string; description?: string }): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post('/auditor/issues', data);
  },

  async requestEvidence(data: { sample_id: string; description?: string }): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post('/auditor/evidence-requests', data);
  },

  // Factors review actions
  async addFactorComment(factorId: string, comment: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/auditor/factors/${factorId}/comments`, { comment });
  },

  async requestFactorDocs(factorId: string, description?: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/auditor/factors/${factorId}/doc-requests`, { description });
  },

  async approveFactor(factorId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/auditor/factors/${factorId}/approve`);
  },
};