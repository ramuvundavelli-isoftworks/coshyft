/**
 * ═══════════════════════════════════════════════════════════════
 * CoShift API Layer — Quick Reference
 * ═══════════════════════════════════════════════════════════════
 *
 * ENVIRONMENT VARIABLES (add to .env at project root):
 *
 *   VITE_USE_MOCK=true          # true = mock mode (default), false = live backend
 *   VITE_API_BASE_URL=http://localhost:8000/api/v1   # FastAPI backend URL
 *
 * ─────────────────────────────────────────────────────────────
 * USAGE EXAMPLES:
 * ─────────────────────────────────────────────────────────────
 *
 * // 1. Auto-fetching hook (GET-style)
 * import { useApi, emissionsApi } from '../api';
 *
 * function MyComponent() {
 *   const { data, loading, error, refetch } = useApi(
 *     () => emissionsApi.getSummary(2026)
 *   );
 *   if (loading) return <Spinner />;
 *   return <div>{data?.total_emissions_kg}</div>;
 * }
 *
 * // 2. Mutation hook (POST/PUT/DELETE)
 * import { useApiMutation, commuteApi } from '../api';
 *
 * function LogForm() {
 *   const { mutate, loading } = useApiMutation(
 *     (data) => commuteApi.logCommute(data)
 *   );
 *   const handleSubmit = async () => {
 *     const result = await mutate({ date: '2026-03-02', ... });
 *     if (result.success) toast.success('Logged!');
 *   };
 * }
 *
 * // 3. Direct API call (no hook)
 * import { carpoolingApi } from '../api';
 *
 * async function findRides() {
 *   const result = await carpoolingApi.findRides({
 *     origin_lat: 53.3498, origin_lng: -6.2603,
 *     destination_lat: 53.3382, destination_lng: -6.2591,
 *   });
 * }
 *
 * // 4. Auth
 * import { useAuth } from '../context/AuthContext';
 *
 * function LoginPage() {
 *   const { login, logout, user, isAuthenticated } = useAuth();
 *   await login('email@company.ie', 'password123');
 * }
 *
 * ─────────────────────────────────────────────────────────────
 * AVAILABLE APIs:
 * ─────────────────────────────────────────────────────────────
 *
 * authApi            — login, register, logout, getMe, GDPR consent
 * commuteApi         — log commute, history, stats, transport modes, emission calc
 * emissionsApi       — summary, trends, mode split, location performance
 * carpoolingApi      — offer/find rides, requests, recurring templates, active trips
 * adminApi           — overview, participation, users, locations, policies, benefits
 * sustainabilityApi  — baselines, targets, scenarios, initiatives, risks, CSRD
 * auditorApi         — overview, reviews, audit trail, evidence
 * superadminApi      — dashboard, tenants, usage, health, settings
 * gamificationApi    — OxyPoints profile, achievements, leaderboard, challenges
 * messagingApi       — threads, messages, read/pin
 * alertsApi          — get/resolve/dismiss alerts
 * emissionFactorsApi — CRUD emission factors, approval workflow
 * reportingApi       — generate reports, CSRD export, regulatory status
 *
 * ─────────────────────────────────────────────────────────────
 * BACKEND STARTUP:
 * ─────────────────────────────────────────────────────────────
 *
 * Option A: Docker Compose (recommended)
 *   cd backend
 *   docker compose up -d
 *   python -m seed.seed_data
 *
 * Option B: Manual
 *   cd backend
 *   pip install -r requirements.txt
 *   # Start PostgreSQL separately
 *   python -m seed.seed_data
 *   uvicorn main:app --reload
 *
 * Then set VITE_USE_MOCK=false in frontend .env
 */

export {};
