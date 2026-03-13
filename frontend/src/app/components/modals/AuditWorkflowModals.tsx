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
  { value: 'question', label: 'Question', icon: MessageSquare, color: 'bg-blue-100 text-blue-700' },
  { value: 'observation', label: 'Observation', icon: Info, color: 'bg-gray-100 text-gray-700' },
  { value: 'concern', label: 'Concern', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700' },
  { value: 'recommendation', label: 'Recommendation', icon: Star, color: 'bg-purple-100 text-purple-700' },
];

const severityLevels = [
  { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'High Priority', color: 'bg-orange-100 text-orange-700' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' },
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
            <MessageSquare className="h-5 w-5 text-[#00bc7d]" />
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
                        ? 'border-[#00bc7d] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
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
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="requiresResponse"
              checked={formData.requiresResponse}
              onChange={(e) => setFormData({ ...formData, requiresResponse: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="requiresResponse" className="text-sm text-gray-700 cursor-pointer">
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
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
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
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`text-sm font-medium ${
              isApproval ? 'text-green-900' : 'text-red-900'
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
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <Info className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
              isApproval ? 'text-blue-600' : 'text-amber-600'
            }`} />
            <p className={`text-xs ${
              isApproval ? 'text-blue-800' : 'text-amber-800'
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
  { value: 'data-quality', label: 'Data Quality', color: 'bg-blue-100 text-blue-700' },
  { value: 'compliance', label: 'Compliance Violation', color: 'bg-red-100 text-red-700' },
  { value: 'methodology', label: 'Methodology Error', color: 'bg-orange-100 text-orange-700' },
  { value: 'fraud', label: 'Potential Fraud', color: 'bg-purple-100 text-purple-700' },
  { value: 'other', label: 'Other Issue', color: 'bg-gray-100 text-gray-700' },
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
            <AlertTriangle className="h-6 w-6 text-red-600" />
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
                      ? 'border-[#00bc7d] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
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
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <input
              type="checkbox"
              id="escalate"
              checked={formData.escalate}
              onChange={(e) => setFormData({ ...formData, escalate: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="escalate" className="text-sm text-red-700 cursor-pointer font-medium">
              Escalate to senior management immediately
            </label>
          </div>

          {/* Warning */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
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
