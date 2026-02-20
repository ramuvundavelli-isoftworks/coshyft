# MODAL WIRING IMPLEMENTATION GUIDE

## ✅ Complete Implementation Instructions

This guide shows you exactly how to wire every modal to its respective pages across the enwayu platform.

---

## 📋 MODAL INTEGRATION CHECKLIST

### **Phase 1: Critical Business Operations**

#### 1. **ManualDataEntryModal**
**Pages:** EmissionsOverview, DataCollection

```typescript
import { ManualDataEntryModal } from '../components/modals';
import { useState } from 'react';

function EmissionsOverview() {
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);

  const handleManualEntry = (data: EmissionEntry) => {
    // Save to your data store/API
    console.log('New emission entry:', data);
    // Refresh data
  };

  return (
    <>
      <Button onClick={() => setIsManualEntryOpen(true)}>
        + Add Manual Entry
      </Button>

      <ManualDataEntryModal
        isOpen={isManualEntryOpen}
        onClose={() => setIsManualEntryOpen(false)}
        onSubmit={handleManualEntry}
      />
    </>
  );
}
```

---

#### 2. **CreateBaselineModal**
**Pages:** BaselineSetup

```typescript
import { CreateBaselineModal } from '../components/modals';

function BaselineSetup() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateBaseline = (data: BaselineData) => {
    console.log('New baseline:', data);
    // API call: POST /api/baselines
    // Update state
  };

  return (
    <>
      <Button onClick={() => setIsCreateOpen(true)}>
        Establish Baseline Year
      </Button>

      <CreateBaselineModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateBaseline}
      />
    </>
  );
}
```

---

#### 3. **CreateTargetModal**
**Pages:** TargetsTrajectory

```typescript
import { CreateTargetModal } from '../components/modals';

function TargetsTrajectory() {
  const [isCreateTargetOpen, setIsCreateTargetOpen] = useState(false);
  const baselineYear = 2024;
  const baselineEmissions = 452.75; // From your data

  const handleCreateTarget = (data: TargetData) => {
    console.log('New target:', data);
    // API call: POST /api/targets
  };

  return (
    <>
      <Button onClick={() => setIsCreateTargetOpen(true)}>
        + Set New Target
      </Button>

      <CreateTargetModal
        isOpen={isCreateTargetOpen}
        onClose={() => setIsCreateTargetOpen(false)}
        onSubmit={handleCreateTarget}
        baselineYear={baselineYear}
        baselineEmissions={baselineEmissions}
      />
    </>
  );
}
```

---

#### 4. **CreatePolicyModal**
**Pages:** AdminPolicies

```typescript
import { CreatePolicyModal } from '../components/modals';

function AdminPolicies() {
  const [isCreatePolicyOpen, setIsCreatePolicyOpen] = useState(false);

  const handleCreatePolicy = (data: PolicyData) => {
    console.log('New policy:', data);
    // API call: POST /api/policies
  };

  return (
    <>
      <Button onClick={() => setIsCreatePolicyOpen(true)}>
        + Create Policy
      </Button>

      <CreatePolicyModal
        isOpen={isCreatePolicyOpen}
        onClose={() => setIsCreatePolicyOpen(false)}
        onSubmit={handleCreatePolicy}
      />
    </>
  );
}
```

---

#### 5. **CreateTenantModal**
**Pages:** TenantManagement (SuperAdmin)

```typescript
import { CreateTenantModal } from '../components/modals';

function TenantManagement() {
  const [isCreateTenantOpen, setIsCreateTenantOpen] = useState(false);

  const handleCreateTenant = (data: TenantData) => {
    console.log('New tenant:', data);
    // API call: POST /api/tenants
  };

  return (
    <>
      <Button onClick={() => setIsCreateTenantOpen(true)}>
        + Add New Tenant
      </Button>

      <CreateTenantModal
        isOpen={isCreateTenantOpen}
        onClose={() => setIsCreateTenantOpen(false)}
        onSubmit={handleCreateTenant}
      />
    </>
  );
}
```

---

### **Phase 2: Enhanced UX Features**

#### 6. **BulkUploadModal**
**Pages:** EmissionsOverview, AdminPolicies, AdminLocations, UserManagement

```typescript
import { BulkUploadModal } from '../components/modals';

function EmissionsOverview() {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const handleBulkUpload = (result: UploadResult) => {
    console.log('Bulk upload result:', result);
    // API call: POST /api/bulk-upload
    // Refresh data
  };

  return (
    <>
      <Button onClick={() => setIsBulkUploadOpen(true)}>
        <Upload className="h-4 w-4 mr-2" />
        Bulk Import
      </Button>

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSubmit={handleBulkUpload}
        uploadType="emissions" // or 'users', 'locations', 'policies'
      />
    </>
  );
}
```

---

#### 7. **TemplateSelectionModal**
**Pages:** ReportBuilder, all report pages

```typescript
import { TemplateSelectionModal } from '../components/modals';

function ReportBuilder() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const handleSelectTemplate = (template: ReportTemplate) => {
    console.log('Selected template:', template);
    // Load template into report builder
  };

  return (
    <>
      <Button onClick={() => setIsTemplateModalOpen(true)}>
        Choose Template
      </Button>

      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleSelectTemplate}
        templateType="all" // or 'csrd', 'regulatory', 'custom'
      />
    </>
  );
}
```

---

#### 8. **ExportDataModal**
**Pages:** ALL data pages (can be added to any page)

```typescript
import { ExportDataModal } from '../components/modals';

function EmissionsOverview() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const totalRecords = 1250; // From your data

  const handleExport = (config: ExportConfig) => {
    console.log('Export config:', config);
    // API call: POST /api/export
    // Download file
  };

  return (
    <>
      <Button onClick={() => setIsExportModalOpen(true)}>
        <Download className="h-4 w-4 mr-2" />
        Export Data
      </Button>

      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        dataType="emissions" // or 'users', 'trips', 'policies', etc.
        totalRecords={totalRecords}
      />
    </>
  );
}
```

---

#### 9. **QuickJoinCarpoolModal**
**Pages:** EmployeeDashboard

```typescript
import { QuickJoinCarpoolModal } from '../components/modals';

function EmployeeDashboard() {
  const [isQuickCarpoolOpen, setIsQuickCarpoolOpen] = useState(false);

  const handleQuickCarpool = (data: CarpoolRequest) => {
    console.log('Carpool request:', data);
    // API call: POST /api/carpool-requests
  };

  return (
    <>
      <Button onClick={() => setIsQuickCarpoolOpen(true)}>
        Quick Join Carpool
      </Button>

      <QuickJoinCarpoolModal
        isOpen={isQuickCarpoolOpen}
        onClose={() => setIsQuickCarpoolOpen(false)}
        onSubmit={handleQuickCarpool}
      />
    </>
  );
}
```

---

#### 10. **SendAnnouncementModal**
**Pages:** AdminOverview

```typescript
import { SendAnnouncementModal } from '../components/modals';

function AdminOverview() {
  const [isSendAnnouncementOpen, setIsSendAnnouncementOpen] = useState(false);

  const handleSendAnnouncement = (data: AnnouncementData) => {
    console.log('Announcement:', data);
    // API call: POST /api/announcements
  };

  return (
    <>
      <Button onClick={() => setIsSendAnnouncementOpen(true)}>
        <Send className="h-4 w-4 mr-2" />
        Send Announcement
      </Button>

      <SendAnnouncementModal
        isOpen={isSendAnnouncementOpen}
        onClose={() => setIsSendAnnouncementOpen(false)}
        onSubmit={handleSendAnnouncement}
      />
    </>
  );
}
```

---

#### 11. **EditLocationModal**
**Pages:** AdminLocations

```typescript
import { EditLocationModal } from '../components/modals';

function AdminLocations() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationEditData | null>(null);

  const handleEdit = (id: string) => {
    // Fetch location data
    const location = locations.find(l => l.id === id);
    setSelectedLocation(location);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (data: LocationEditData) => {
    console.log('Updated location:', data);
    // API call: PUT /api/locations/${data.id}
  };

  return (
    <>
      <Button onClick={() => handleEdit('location-id')}>
        Edit
      </Button>

      <EditLocationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
        location={selectedLocation}
      />
    </>
  );
}
```

---

#### 12. **EditCommuteProfileModal**
**Pages:** CommuteProfile

```typescript
import { EditCommuteProfileModal } from '../components/modals';

function CommuteProfile() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<CommuteProfileData | null>(null);

  const handleUpdateProfile = (data: CommuteProfileData) => {
    console.log('Updated profile:', data);
    // API call: PUT /api/profile
  };

  return (
    <>
      <Button onClick={() => setIsEditProfileOpen(true)}>
        Edit Profile
      </Button>

      <EditCommuteProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onUpdate={handleUpdateProfile}
        profile={currentProfile}
      />
    </>
  );
}
```

---

#### 13. **EditRideModal**
**Pages:** OfferRide, RideOperations, RecurringRides

```typescript
import { EditRideModal } from '../components/modals';

function OfferRide() {
  const [isEditRideOpen, setIsEditRideOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<RideEditData | null>(null);

  const handleEditRide = (ride: RideEditData) => {
    setSelectedRide(ride);
    setIsEditRideOpen(true);
  };

  const handleUpdateRide = (data: RideEditData) => {
    console.log('Updated ride:', data);
    // API call: PUT /api/rides/${data.id}
  };

  return (
    <>
      <Button onClick={() => handleEditRide(ride)}>
        Edit Ride
      </Button>

      <EditRideModal
        isOpen={isEditRideOpen}
        onClose={() => setIsEditRideOpen(false)}
        onUpdate={handleUpdateRide}
        ride={selectedRide}
      />
    </>
  );
}
```

---

### **Phase 3: Audit & Compliance Workflows**

#### 14. **ReviewCommentModal**
**Pages:** EmissionsReview, ReportReview, ComplianceAudit (Auditor pages)

```typescript
import { ReviewCommentModal } from '../components/modals';

function EmissionsReview() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingItem, setReviewingItem] = useState({ type: '', name: '' });

  const handleAddComment = (data: ReviewCommentData) => {
    console.log('Review comment:', data);
    // API call: POST /api/review-comments
  };

  return (
    <>
      <Button onClick={() => {
        setReviewingItem({ type: 'emission', name: 'February 2026 Emissions' });
        setIsReviewModalOpen(true);
      }}>
        Add Comment
      </Button>

      <ReviewCommentModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleAddComment}
        itemType="emission" // or 'report', 'target', 'baseline', 'policy'
        itemName={reviewingItem.name}
      />
    </>
  );
}
```

---

#### 15. **ApprovalDecisionModal**
**Pages:** ReportReview, TargetReview, BaselineReview, TenantManagement

```typescript
import { ApprovalDecisionModal } from '../components/modals';

function ReportReview() {
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');

  const handleApproval = (data: ApprovalDecisionData) => {
    console.log('Approval decision:', data);
    // API call: POST /api/approvals
  };

  return (
    <>
      <Button onClick={() => {
        setApprovalAction('approve');
        setIsApprovalModalOpen(true);
      }}>
        Approve
      </Button>

      <Button variant="destructive" onClick={() => {
        setApprovalAction('reject');
        setIsApprovalModalOpen(true);
      }}>
        Reject
      </Button>

      <ApprovalDecisionModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onSubmit={handleApproval}
        itemType="report"
        itemName="CSRD Annual Report 2025"
        action={approvalAction}
      />
    </>
  );
}
```

---

#### 16. **FlagIssueModal**
**Pages:** All Auditor pages, EmissionsReview, ReportReview

```typescript
import { FlagIssueModal } from '../components/modals';

function EmissionsReview() {
  const [isFlagIssueOpen, setIsFlagIssueOpen] = useState(false);

  const handleFlagIssue = (data: IssueData) => {
    console.log('Flagged issue:', data);
    // API call: POST /api/issues
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setIsFlagIssueOpen(true)}>
        <AlertTriangle className="h-4 w-4 mr-2" />
        Flag Issue
      </Button>

      <FlagIssueModal
        isOpen={isFlagIssueOpen}
        onClose={() => setIsFlagIssueOpen(false)}
        onSubmit={handleFlagIssue}
        itemType="emission"
        itemName="February 2026 Emissions"
      />
    </>
  );
}
```

---

#### 17. **UploadEvidenceModal**
**Pages:** EvidenceLibrary, EmissionsReview, all audit pages

```typescript
import { UploadEvidenceModal } from '../components/modals';

function EvidenceLibrary() {
  const [isUploadEvidenceOpen, setIsUploadEvidenceOpen] = useState(false);

  const handleUploadEvidence = (data: EvidenceData) => {
    console.log('Evidence uploaded:', data);
    // API call: POST /api/evidence (with FormData for file)
  };

  return (
    <>
      <Button onClick={() => setIsUploadEvidenceOpen(true)}>
        <Upload className="h-4 w-4 mr-2" />
        Upload Evidence
      </Button>

      <UploadEvidenceModal
        isOpen={isUploadEvidenceOpen}
        onClose={() => setIsUploadEvidenceOpen(false)}
        onSubmit={handleUploadEvidence}
        linkedTo={{
          type: 'baseline',
          id: 'baseline-2024',
          name: 'FY2024 Baseline'
        }}
      />
    </>
  );
}
```

---

#### 18. **RequestClarificationModal**
**Pages:** All Auditor pages

```typescript
import { RequestClarificationModal } from '../components/modals';

function EmissionsReview() {
  const [isClarificationOpen, setIsClarificationOpen] = useState(false);

  const handleRequestClarification = (data: ClarificationRequest) => {
    console.log('Clarification request:', data);
    // API call: POST /api/clarification-requests
  };

  return (
    <>
      <Button onClick={() => setIsClarificationOpen(true)}>
        Request Clarification
      </Button>

      <RequestClarificationModal
        isOpen={isClarificationOpen}
        onClose={() => setIsClarificationOpen(false)}
        onSubmit={handleRequestClarification}
        itemName="February 2026 Emissions"
        submitterName="John Doe"
      />
    </>
  );
}
```

---

## 🎯 COMPLETE PAGE INTEGRATION EXAMPLES

See the `/MODAL_WIRING_EXAMPLES.tsx` file for full page examples with multiple modals integrated.

---

## 📝 NOTES

1. **State Management:** All examples use local `useState`. For production, consider using:
   - React Context for global state
   - Zustand/Redux for complex state
   - TanStack Query for API data

2. **API Integration:** Replace `console.log` with actual API calls:
   ```typescript
   const response = await fetch('/api/endpoint', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data),
   });
   ```

3. **Error Handling:** Add try-catch blocks and error toasts:
   ```typescript
   try {
     await handleSubmit(data);
     toast.success('Success!');
   } catch (error) {
     toast.error('Failed to save');
   }
   ```

4. **Loading States:** Add loading indicators:
   ```typescript
   const [isLoading, setIsLoading] = useState(false);
   // Show spinner while isLoading is true
   ```

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Wire Phase 1 modals (5 modals)
- [ ] Wire Phase 2 modals (11 modals)
- [ ] Wire Phase 3 modals (5 modals)
- [ ] Test all modal open/close flows
- [ ] Implement API integration
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test validation
- [ ] Test success/error toasts
- [ ] Review UX flow

**Total Integration Time Estimate:** 4-6 hours for all 21 modals

---

**Status: Ready for Implementation** ✅
