// Evidence & Document Management Modals
// For managing supporting documentation and evidence

import React, { useState, useRef } from 'react';
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
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  Link as LinkIcon,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

// ======================
// UPLOAD EVIDENCE MODAL
// ======================

interface UploadEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EvidenceData) => void;
  linkedTo?: {
    type: string;
    id: string;
    name: string;
  };
}

export interface EvidenceData {
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  description: string;
  tags: string[];
  linkedTo?: {
    type: string;
    id: string;
    name: string;
  };
  uploadedBy: string;
  uploadedAt: string;
}

const evidenceCategories = [
  'Emission Calculation',
  'Methodology Document',
  'Third-Party Verification',
  'Policy Document',
  'Meeting Minutes',
  'Email Correspondence',
  'Contract/Agreement',
  'Invoice/Receipt',
  'Technical Specification',
  'Other Supporting Document',
];

export function UploadEvidenceModal({ isOpen, onClose, onSubmit, linkedTo }: UploadEvidenceModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast.error('File size exceeds 25MB limit');
        return;
      }
      setSelectedFile(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSubmit = () => {
    if (!selectedFile || !formData.category || !formData.description) {
      toast.error('Please select file, category, and provide description');
      return;
    }

    const data: EvidenceData = {
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      category: formData.category,
      description: formData.description,
      tags: formData.tags,
      linkedTo,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
    };

    onSubmit(data);
    toast.success('Evidence uploaded successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-brand-500" />
            Upload Evidence
          </DialogTitle>
          <DialogDescription>
            {linkedTo 
              ? `Upload supporting documentation for: ${linkedTo.name}`
              : 'Upload supporting documentation'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload */}
          <div>
            <Label>Select File *</Label>
            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-brand-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, Word, Excel, Image (max 25MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
              </div>
            ) : (
              <div className="p-4 bg-background-subtle border border-border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedFile.type.includes('image') ? (
                    <Image className="h-8 w-8 text-info" />
                  ) : selectedFile.type.includes('pdf') ? (
                    <FileText className="h-8 w-8 text-destructive" />
                  ) : (
                    <File className="h-8 w-8 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Document Category *</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {evidenceCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this document contains and its relevance..."
              rows={4}
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (Optional)</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag and press Enter"
              />
              <Button onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-background-subtle">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Linked Item */}
          {linkedTo && (
            <div className="p-3 bg-info-subtle border border-info/25 rounded-lg">
              <div className="flex items-start gap-2">
                <LinkIcon className="h-4 w-4 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-info">Linked To</p>
                  <p className="text-xs text-info mt-1">
                    {linkedTo.type}: {linkedTo.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="p-3 bg-warning-subtle border border-warning/25 rounded-lg">
            <p className="text-xs text-warning">
              <strong>GDPR Notice:</strong> Ensure uploaded documents do not contain unnecessary personal data. All uploads are logged for audit purposes.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedFile || !formData.category || !formData.description}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Evidence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ======================
// REQUEST CLARIFICATION MODAL
// ======================

interface RequestClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClarificationRequest) => void;
  itemName: string;
  submitterName: string;
}

export interface ClarificationRequest {
  itemName: string;
  submitterName: string;
  questions: ClarificationQuestion[];
  priority: 'standard' | 'urgent';
  dueDate: string;
  additionalNotes?: string;
  requestedBy: string;
  requestedAt: string;
}

interface ClarificationQuestion {
  id: string;
  question: string;
  context?: string;
  required: boolean;
}

export function RequestClarificationModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  itemName,
  submitterName 
}: RequestClarificationModalProps) {
  const [questions, setQuestions] = useState<ClarificationQuestion[]>([
    { id: '1', question: '', context: '', required: true },
  ]);
  const [priority, setPriority] = useState<'standard' | 'urgent'>('standard');
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [additionalNotes, setAdditionalNotes] = useState('');

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), question: '', context: '', required: false },
    ]);
  };

  const updateQuestion = (id: string, field: keyof ClarificationQuestion, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleSubmit = () => {
    const validQuestions = questions.filter(q => q.question.trim() !== '');
    
    if (validQuestions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const data: ClarificationRequest = {
      itemName,
      submitterName,
      questions: validQuestions,
      priority,
      dueDate,
      additionalNotes,
      requestedBy: 'Current Auditor',
      requestedAt: new Date().toISOString(),
    };

    onSubmit(data);
    toast.success('Clarification request sent successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-brand-500" />
            Request Clarification
          </DialogTitle>
          <DialogDescription>
            Request clarification from {submitterName} about: <strong>{itemName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(v: 'standard' | 'urgent') => setPriority(v)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (7 days)</SelectItem>
                  <SelectItem value="urgent">Urgent (2 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">Response Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Questions */}
          <div>
            <Label className="mb-3 block">Questions to Address</Label>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 bg-background-subtle border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Question {index + 1}</span>
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      placeholder="What specific question needs to be answered?"
                      rows={2}
                    />

                    <Textarea
                      value={question.context || ''}
                      onChange={(e) => updateQuestion(question.id, 'context', e.target.value)}
                      placeholder="Provide context or background (optional)"
                      rows={2}
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`required-${question.id}`}
                        checked={question.required}
                        onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                        className="rounded"
                      />
                      <label 
                        htmlFor={`required-${question.id}`} 
                        className="text-sm text-foreground cursor-pointer"
                      >
                        Response required
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={addQuestion}
              className="mt-3"
            >
              + Add Another Question
            </Button>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any additional context or instructions..."
              rows={3}
            />
          </div>

          {/* Summary */}
          <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-info mb-2">Request Summary</p>
                <ul className="text-xs text-info space-y-1">
                  <li>• {questions.filter(q => q.question.trim()).length} question(s) to be answered</li>
                  <li>• Priority: {priority === 'urgent' ? 'Urgent' : 'Standard'}</li>
                  <li>• Due: {new Date(dueDate).toLocaleDateString('en-IE', { dateStyle: 'medium' })}</li>
                  <li>• Submitter will be notified immediately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={questions.filter(q => q.question.trim()).length === 0}
          >
            Send Clarification Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
