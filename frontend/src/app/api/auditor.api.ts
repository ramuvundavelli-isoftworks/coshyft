/**
 * Auditor API
 * Reviews, audit trail, evidence, reports
 */

import { api, type ApiResponse } from './client';

export const auditorApi = {
  async getOverview(): Promise<ApiResponse> {
    return api.get('/auditor/overview');
  },

  async reviewEmissions(year = 2026): Promise<ApiResponse> {
    return api.get('/auditor/emissions-review', { params: { year } });
  },

  async reviewBaseline(): Promise<ApiResponse> {
    return api.get('/auditor/baseline-review');
  },

  async reviewFactors(): Promise<ApiResponse> {
    return api.get('/auditor/factors-review');
  },

  async reviewRisks(): Promise<ApiResponse> {
    return api.get('/auditor/risks-review');
  },

  async getAuditTrail(params?: any): Promise<ApiResponse> {
    return api.get('/auditor/trail', { params });
  },

  async getEvidence(params?: any): Promise<ApiResponse> {
    return api.get('/auditor/evidence', { params });
  },

  async uploadEvidence(data: any): Promise<ApiResponse> {
    return api.post('/auditor/evidence', data);
  },

  async verifyEvidence(evidenceId: string): Promise<ApiResponse> {
    return api.post(`/auditor/evidence/${evidenceId}/verify`);
  },

  async addFinding(data: { area: string; description: string; severity?: string }): Promise<ApiResponse> {
    return api.post('/auditor/findings', data);
  },

  async scheduleReview(data: { area: string; date?: string; notes?: string }): Promise<ApiResponse> {
    return api.post('/auditor/reviews/schedule', data);
  },

  async addAuditNote(data: { area: string; note: string }): Promise<ApiResponse> {
    return api.post('/auditor/notes', data);
  },

  async requestClarification(data: { area: string; question?: string }): Promise<ApiResponse> {
    return api.post('/auditor/clarification-requests', data);
  },

  async approveReviewArea(area: string, data?: { comments?: string }): Promise<ApiResponse> {
    return api.put(`/auditor/reviews/${area}/approve`, data);
  },

  async flagIssue(data: { sample_id: string; description?: string }): Promise<ApiResponse> {
    return api.post('/auditor/issues', data);
  },

  async requestEvidence(data: { sample_id: string; description?: string }): Promise<ApiResponse> {
    return api.post('/auditor/evidence-requests', data);
  },

  async addFactorComment(factorId: string, comment: string): Promise<ApiResponse> {
    return api.post(`/auditor/factors/${factorId}/comments`, { comment });
  },

  async requestFactorDocs(factorId: string, description?: string): Promise<ApiResponse> {
    return api.post(`/auditor/factors/${factorId}/doc-requests`, { description });
  },

  async approveFactor(factorId: string): Promise<ApiResponse> {
    return api.put(`/auditor/factors/${factorId}/approve`);
  },
};
