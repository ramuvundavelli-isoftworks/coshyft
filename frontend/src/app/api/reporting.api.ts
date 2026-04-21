/**
 * Reporting API
 * Report generation, templates, CSRD export, regulatory status
 */

import { api, type ApiResponse } from './client';

export const reportingApi = {
  async getReports(params?: any): Promise<ApiResponse> {
    return api.get('/reports', { params });
  },

  async getTemplates(): Promise<ApiResponse> {
    return api.get('/reports/templates');
  },

  async generateReport(data: {
    title: string; report_type: string; template_id?: string;
    period_start?: string; period_end?: string;
    format?: string; parameters?: any;
  }): Promise<ApiResponse> {
    return api.post('/reports/generate', data);
  },

  async getReport(reportId: string): Promise<ApiResponse> {
    return api.get(`/reports/${reportId}`);
  },

  async downloadReport(reportId: string): Promise<ApiResponse> {
    return api.get(`/reports/${reportId}/download`);
  },

  async exportCSRD(data: {
    reporting_year: number; format?: string; include_evidence?: boolean;
  }): Promise<ApiResponse> {
    return api.post('/reports/csrd-export', data);
  },

  async getRegulatoryStatus(): Promise<ApiResponse> {
    return api.get('/reports/regulatory-status');
  },
};
