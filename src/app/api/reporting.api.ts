/**
 * Reporting API
 * Report generation, templates, CSRD export, regulatory status
 */

import { api, simulateDelay, isMockMode, type ApiResponse } from './client';

export const reportingApi = {
  async getReports(params?: any): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: { items: [], total: 0 } };
    }
    return api.get('/reports', { params });
  },

  async getTemplates(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: [
          { id: 'tpl-1', name: 'CSRD/ESRS E1 Report', report_type: 'csrd', is_system: true },
          { id: 'tpl-2', name: 'Monthly Emissions Summary', report_type: 'emissions', is_system: true },
          { id: 'tpl-3', name: 'Annual Compliance Report', report_type: 'compliance', is_system: true },
          { id: 'tpl-4', name: 'Transport Mode Analysis', report_type: 'custom', is_system: false },
        ],
      };
    }
    return api.get('/reports/templates');
  },

  async generateReport(data: {
    title: string; report_type: string; template_id?: string;
    period_start?: string; period_end?: string;
    format?: string; parameters?: any;
  }): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay(500, 1500);
      return {
        success: true,
        data: {
          id: 'rpt-' + Date.now(),
          title: data.title,
          report_type: data.report_type,
          format: data.format || 'pdf',
          status: 'ready',
          file_url: '/reports/download',
          created_at: new Date().toISOString(),
        },
      };
    }
    return api.post('/reports/generate', data);
  },

  async getReport(reportId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: {} }; }
    return api.get(`/reports/${reportId}`);
  },

  async downloadReport(reportId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { message: 'Download ready' } }; }
    return api.get(`/reports/${reportId}/download`);
  },

  async exportCSRD(data: {
    reporting_year: number; format?: string; include_evidence?: boolean;
  }): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay(500, 2000);
      return {
        success: true,
        data: {
          id: 'csrd-' + Date.now(),
          reporting_year: data.reporting_year,
          status: 'in_progress',
          completeness_score: 78.5,
          data_quality_score: 76.0,
          disclosures_completed: 7,
          disclosures_total: 9,
        },
      };
    }
    return api.post('/reports/csrd-export', data);
  },

  async getRegulatoryStatus(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: [
          {
            framework: 'CSRD / ESRS E1', status: 'in_progress',
            deadline: '2027-06-30', completeness: 78.5,
            gaps: ['E1-9 incomplete', 'Data quality < 80%'],
            next_steps: ['Complete E1-9', 'Improve data quality', 'Schedule audit'],
          },
          {
            framework: 'EPA Climate Action Plan', status: 'compliant',
            deadline: '2026-12-31', completeness: 92.0,
            gaps: ['Annual report due Q4'],
            next_steps: ['Submit annual report by Dec 31'],
          },
        ],
      };
    }
    return api.get('/reports/regulatory-status');
  },
};
