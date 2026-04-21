// Audit & Review Workflow Modals
// Comprehensive modals for auditor workflows and approval processes

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Upload,
  Star,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

// ======================
// REVIEW & COMMENT MODAL
// ======================

interface ReviewCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewCommentData) => void;
  itemType: 'emission' | 'report' | 'target' | 'baseline' | 'policy';
  itemName: string;
}

export interface ReviewCommentData {
  itemType: string;
  itemName: string;
  commentType: 'question' | 'observation' | 'concern' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  comment: string;
  requiresResponse: boolean;
  suggestedAction?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: string;
}

const commentTypes = [
  { value: 'question', label: 'Question', icon: MessageSquare, color: 'bg-info-subtle text-info' },
  { value: 'observation', label: 'Observation', icon: Info, color: 'bg-muted text-foreground' },
  { value: 'concern', label: 'Concern', icon: AlertTriangle, color: 'bg-warning-subtle text-warning' },
  { value: 'recommendation', label: 'Recommendation', icon: Star, color: 'bg-info-subtle text-info' },
];

const severityLevels = [
  { value: 'low', label: 'Low Priority', color: 'bg-muted text-foreground' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-info-subtle text-info' },
  { value: 'high', label: 'High Priority', color: 'bg-warning-subtle text-warning' },
  { value: 'critical', label: 'Critical', color: 'bg-destructive-subtle text-destructive' },
];

const categoryOptions = {
  emission: ['Data Quality', 'Methodology', 'Evidence', 'Calculation', 'Classification'],
  report: ['Completeness', 'Accuracy', 'Compliance', 'Formatting', 'Disclosure'],
  target: ['Ambition Level', 'Feasibility', 'Alignment', 'Timeline', 'Methodology'],
  baseline: ['Data Sources', 'Boundary', 'Verification', 'Documentation', 'Quality'],
  policy: ['Scope', 'Implementation', 'Monitoring', 'Effectiveness', 'Compliance'],
};

export function ReviewCommentModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  itemType,
  itemName 
}: ReviewCommentModalProps) {
  const [formData, setFormData] = useState({
    commentType: 'question' as 'question' | 'observation' | 'concern' | 'recommendation',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    category: '',
    comment: '',
    requiresResponse: false,
    suggestedAction: '',
  });

  const handleSubmit = () => {
    if (!formData.comment || !formData.category) {
      toast.error('Please provide category and comment');
      return;
    }

    const data: ReviewCommentData = {
      itemType,
      itemName,
      ...formData,
      createdBy: 'Current Auditor',
      createdAt: new Date().toISOString(),
    };

    onSubmit(data);
    toast.success('Review comment added successfully');
    onClose();
  };

  const categories = categoryOptions[itemType] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-500" />
            Add Review Comment
          </DialogTitle>
          <DialogDescription>
            Reviewing: <strong>{itemName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Comment Type */}
          <div>
            <Label className="mb-2 block">Comment Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {commentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, commentType: type.value as any })}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      formData.commentType === type.value
                        ? 'border-brand-500 bg-success-subtle'
                        : 'border-border hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${type.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-sm">{type.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select 
                value={formData.severity} 
                onValueChange={(v: any) => setFormData({ ...formData, severity: v })}
              >
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <Badge variant="outline" className={level.color}>
                        {level.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Comment *</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Provide detailed feedback, questions, or concerns..."
              rows={5}
            />
          </div>

          {/* Suggested Action */}
          <div>
            <Label htmlFor="action">Suggested Action (Optional)</Label>
            <Textarea
              id="action"
              value={formData.suggestedAction}
              onChange={(e) => setFormData({ ...formData, suggestedAction: e.target.value })}
              placeholder="Recommend specific actions to address this comment..."
              rows={2}
            />
          </div>

          {/* Requires Response */}
          <div className="flex items-center gap-2 p-3 bg-background-subtle rounded-lg">
            <input
              type="checkbox"
              id="requiresResponse"
              checked={formData.requiresResponse}
              onChange={(e) => setFormData({ ...formData, requiresResponse: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="requiresResponse" className="text-sm text-foreground cursor-pointer">
              Requires formal response from data owner
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!formData.comment || !formData.category}>
            Add Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ======================
// APPROVE/REJECT MODAL
// ======================

interface ApprovalDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApprovalDecisionData) => void;
  itemType: 'report' | 'target' | 'baseline' | 'policy' | 'tenant';
  itemName: string;
  action: 'approve' | 'reject';
}

export interface ApprovalDecisionData {
  itemType: string;
  itemName: string;
  action: 'approve' | 'reject';
  decision: string;
  conditions?: string;
  nextSteps?: string;
  auditNotes?: string;
  approvedBy: string;
  approvedAt: string;
}

export function ApprovalDecisionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  itemType,
  itemName,
  action 
}: ApprovalDecisionModalProps) {
  const [formData, setFormData] = useState({
    decision: '',
    conditions: '',
    nextSteps: '',
    auditNotes: '',
  });

  const handleSubmit = () => {
    if (!formData.decision) {
      toast.error('Please provide a decision rationale');
      return;
    }

    const data: ApprovalDecisionData = {
      itemType,
      itemName,
      action,
      ...formData,
      approvedBy: 'Current User',
      approvedAt: new Date().toISOString(),
    };

    onSubmit(data);
    toast.success(`${action === 'approve' ? 'Approved' : 'Rejected'} successfully`);
    onClose();
  };

  const isApproval = action === 'approve';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApproval ? (
              <CheckCircle className="h-6 w-6 text-success" />
            ) : (
              <XCircle className="h-6 w-6 text-destructive" />
            )}
            {isApproval ? 'Approve' : 'Reject'} {itemType}
          </DialogTitle>
          <DialogDescription>
            {itemName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Decision Banner */}
          <div className={`p-4 rounded-lg border-2 ${
            isApproval 
              ? 'bg-success-subtle border-success/25' 
              : 'bg-destructive-subtle border-destructive/25'
          }`}>
            <p className={`text-sm font-medium ${
              isApproval ? 'text-success' : 'text-destructive'
            }`}>
              {isApproval 
                ? 'You are approving this item for publication/implementation'
                : 'You are rejecting this item and requiring revisions'
              }
            </p>
          </div>

          {/* Decision Rationale */}
          <div>
            <Label htmlFor="decision">
              {isApproval ? 'Approval' : 'Rejection'} Rationale *
            </Label>
            <Textarea
              id="decision"
              value={formData.decision}
              onChange={(e) => setFormData({ ...formData, decision: e.target.value })}
              placeholder={isApproval 
                ? "Explain why this meets requirements and is approved..."
                : "Explain why this does not meet requirements..."
              }
              rows={4}
            />
          </div>

          {/* Conditions (for approvals) */}
          {isApproval && (
            <div>
              <Label htmlFor="conditions">Conditions or Recommendations (Optional)</Label>
              <Textarea
                id="conditions"
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                placeholder="Any conditions, caveats, or recommendations for future improvements..."
                rows={3}
              />
            </div>
          )}

          {/* Next Steps */}
          <div>
            <Label htmlFor="nextSteps">Next Steps (Optional)</Label>
            <Textarea
              id="nextSteps"
              value={formData.nextSteps}
              onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
              placeholder={isApproval
                ? "Outline what should happen next after approval..."
                : "Outline required changes and resubmission process..."
              }
              rows={3}
            />
          </div>

          {/* Audit Notes */}
          <div>
            <Label htmlFor="auditNotes">Internal Audit Notes (Optional)</Label>
            <Textarea
              id="auditNotes"
              value={formData.auditNotes}
              onChange={(e) => setFormData({ ...formData, auditNotes: e.target.value })}
              placeholder="Internal notes for audit trail (not visible to submitter)..."
              rows={2}
            />
          </div>

          {/* Warning */}
          <div className={`p-3 rounded-lg border flex items-start gap-2 ${
            isApproval 
              ? 'bg-info-subtle border-info/25' 
              : 'bg-warning-subtle border-warning/25'
          }`}>
            <Info className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
              isApproval ? 'text-info' : 'text-warning'
            }`} />
            <p className={`text-xs ${
              isApproval ? 'text-info' : 'text-warning'
            }`}>
              {isApproval
                ? 'This action will mark the item as approved and notify relevant stakeholders.'
                : 'This action will return the item to the submitter for revisions and send detailed feedback.'
              }
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.decision}
            variant={isApproval ? 'default' : 'destructive'}
          >
            {isApproval ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ======================
// FLAG ISSUE MODAL
// ======================

interface FlagIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IssueData) => void;
  itemType: string;
  itemName: string;
}

export interface IssueData {
  itemType: string;
  itemName: string;
  issueType: 'data-quality' | 'compliance' | 'methodology' | 'fraud' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence?: string;
  recommendedAction: string;
  escalate: boolean;
  flaggedBy: string;
  flaggedAt: string;
}

const issueTypes = [
  { value: 'data-quality', label: 'Data Quality', color: 'bg-info-subtle text-info' },
  { value: 'compliance', label: 'Compliance Violation', color: 'bg-destructive-subtle text-destructive' },
  { value: 'methodology', label: 'Methodology Error', color: 'bg-warning-subtle text-warning' },
  { value: 'fraud', label: 'Potential Fraud', color: 'bg-info-subtle text-info' },
  { value: 'other', label: 'Other Issue', color: 'bg-muted text-foreground' },
];

export function FlagIssueModal({ isOpen, onClose, onSubmit, itemType, itemName }: FlagIssueModalProps) {
  const [formData, setFormData] = useState({
    issueType: 'data-quality' as 'data-quality' | 'compliance' | 'methodology' | 'fraud' | 'other',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    title: '',
    description: '',
    evidence: '',
    recommendedAction: '',
    escalate: false,
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.recommendedAction) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data: IssueData = {
      itemType,
      itemName,
      ...formData,
      flaggedBy: 'Current Auditor',
      flaggedAt: new Date().toISOString(),
    };

    onSubmit(data);
    toast.success('Issue flagged successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Flag Issue
          </DialogTitle>
          <DialogDescription>
            Report a significant issue with: <strong>{itemName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Issue Type */}
          <div>
            <Label className="mb-2 block">Issue Type *</Label>
            <div className="grid grid-cols-2 gap-2">
              {issueTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFormData({ ...formData, issueType: type.value as any })}
                  className={`p-3 border-2 rounded-lg transition-all text-left ${
                    formData.issueType === type.value
                      ? 'border-brand-500 bg-success-subtle'
                      : 'border-border hover:border-border'
                  }`}
                >
                  <Badge variant="outline" className={type.color}>
                    {type.label}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <Label htmlFor="severity">Severity *</Label>
            <Select 
              value={formData.severity} 
              onValueChange={(v: any) => setFormData({ ...formData, severity: v })}
            >
              <SelectTrigger id="severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {severityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <Badge variant="outline" className={level.color}>
                      {level.label}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief summary of the issue"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide comprehensive details about the issue..."
              rows={5}
            />
          </div>

          {/* Evidence */}
          <div>
            <Label htmlFor="evidence">Supporting Evidence (Optional)</Label>
            <Textarea
              id="evidence"
              value={formData.evidence}
              onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
              placeholder="Reference supporting documents, data points, or observations..."
              rows={3}
            />
          </div>

          {/* Recommended Action */}
          <div>
            <Label htmlFor="action">Recommended Action *</Label>
            <Textarea
              id="action"
              value={formData.recommendedAction}
              onChange={(e) => setFormData({ ...formData, recommendedAction: e.target.value })}
              placeholder="What actions should be taken to resolve this issue..."
              rows={3}
            />
          </div>

          {/* Escalate */}
          <div className="flex items-center gap-2 p-3 bg-destructive-subtle border border-destructive/25 rounded-lg">
            <input
              type="checkbox"
              id="escalate"
              checked={formData.escalate}
              onChange={(e) => setFormData({ ...formData, escalate: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="escalate" className="text-sm text-destructive cursor-pointer font-medium">
              Escalate to senior management immediately
            </label>
          </div>

          {/* Warning */}
          <div className="p-3 bg-warning-subtle border border-warning/25 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-warning">
              Flagging an issue will immediately notify relevant stakeholders and may pause related processes pending resolution.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.title || !formData.description || !formData.recommendedAction}
            variant="destructive"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Flag Issue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
