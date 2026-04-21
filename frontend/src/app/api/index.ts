/**
 * CoShift API - Barrel Export
 *
 * Usage:
 *   import { authApi, commuteApi, emissionsApi } from './api';
 *
 * Configure VITE_API_BASE_URL in .env to point at the backend (default: http://localhost:8000/api/v1)
 */

// Core client
export { api, getToken, setTokens, clearTokens } from './client';
export type { ApiResponse, PaginatedResponse, RequestConfig } from './client';

// Hooks
export { useApi, useApiMutation, usePaginatedApi } from './useApi';

// Domain APIs
export { authApi } from './auth.api';
export { commuteApi } from './commute.api';
export { emissionsApi } from './emissions.api';
export { carpoolingApi } from './carpooling.api';
export { adminApi } from './admin.api';
export { sustainabilityApi } from './sustainability.api';
export { auditorApi } from './auditor.api';
export { superadminApi } from './superadmin.api';
export { gamificationApi } from './gamification.api';
export { messagingApi } from './messaging.api';
export { alertsApi } from './alerts.api';
export { emissionFactorsApi } from './emission-factors.api';
export { reportingApi } from './reporting.api';