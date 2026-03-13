// Comprehensive Action Modals Collection
// Centralized modals for all critical user actions across enwayu platform

// Phase 1 - Critical Business Operations
export { CreateBaselineModal } from './CreateBaselineModal';
export { CreateTargetModal } from './CreateTargetModal';
export { ManualDataEntryModal } from './ManualDataEntryModal';
export { CreatePolicyModal } from './CreatePolicyModal';
export { CreateTenantModal } from './CreateTenantModal';

// Phase 2 - Enhanced UX
export { BulkUploadModal } from './BulkUploadModal';
export { TemplateSelectionModal } from './TemplateSelectionModal';
export { ExportDataModal } from './ExportDataModal';
export { 
  QuickJoinCarpoolModal, 
  SendAnnouncementModal,
  QuickAddLocationModal 
} from './QuickActionsModals';
export {
  EditLocationModal,
  EditCommuteProfileModal,
  EditRideModal
} from './EditModals';

// Phase 3 - Audit & Compliance Workflows
export {
  ReviewCommentModal,
  ApprovalDecisionModal,
  FlagIssueModal
} from './AuditWorkflowModals';
export {
  UploadEvidenceModal,
  RequestClarificationModal
} from './EvidenceManagementModals';

// Type exports - Phase 1
export type { BaselineData } from './CreateBaselineModal';
export type { TargetData } from './CreateTargetModal';
export type { EmissionEntry } from './ManualDataEntryModal';
export type { PolicyData } from './CreatePolicyModal';
export type { TenantData } from './CreateTenantModal';

// Type exports - Phase 2
export type { UploadResult } from './BulkUploadModal';
export type { ReportTemplate } from './TemplateSelectionModal';
export type { ExportConfig } from './ExportDataModal';
export type { 
  CarpoolRequest, 
  AnnouncementData, 
  LocationData 
} from './QuickActionsModals';
export type {
  LocationEditData,
  CommuteProfileData,
  RideEditData
} from './EditModals';

// Type exports - Phase 3
export type {
  ReviewCommentData,
  ApprovalDecisionData,
  IssueData
} from './AuditWorkflowModals';
export type {
  EvidenceData,
  ClarificationRequest
} from './EvidenceManagementModals';