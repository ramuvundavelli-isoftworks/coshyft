import { api, type ApiResponse } from './client';

export const auditorApi = {
  async getOverview(): Promise<ApiResponse> { return api.get('/auditor/overview'); },
  async reviewEmissions(year = 2026): Promise<ApiResponse> { return api.get('/auditor/emissions-review', { params: { year } }); },
  async reviewBaseline(): Promise<ApiResponse> { return api.get('/auditor/baseline-review'); },
  async reviewFactors(): Promise<ApiResponse> { return api.get('/auditor/factors-review'); },
  async reviewRisks(): Promise<ApiResponse> { return api.get('/auditor/risks-review'); },
  async getAuditTrail(params?: any): Promise<ApiResponse> { return api.get('/auditor/trail', { params }); },
  async exportAuditTrail(params?: any): Promise<ApiResponse> { return api.get('/auditor/trail/export', { params }); },
  async getEvidence(params?: any): Promise<ApiResponse> { return api.get('/auditor/evidence', { params }); },
  async uploadEvidence(data: any): Promise<ApiResponse> { return api.post('/auditor/evidence', data); },
  async verifyEvidence(evidenceId: string): Promise<ApiResponse> { return api.post(`/auditor/evidence/${evidenceId}/verify`); },
  async addFinding(data: any): Promise<ApiResponse> { return api.post('/auditor/findings', data); },
  async scheduleReview(data: any): Promise<ApiResponse> { return api.post('/auditor/reviews/schedule', data); },
  async addAuditNote(data: any): Promise<ApiResponse> { return api.post('/auditor/notes', data); },
  async approveReviewArea(area: string, data?: any): Promise<ApiResponse> { return api.put(`/auditor/reviews/${area}/approve`, data); },
  async getAuditReports(): Promise<ApiResponse> { return api.get('/auditor/reports'); },
  async createAuditReport(data: any): Promise<ApiResponse> { return api.post('/auditor/reports', data); },
};
