// Bulk Upload Modal
// For bulk importing emission data from CSV/Excel files

import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, X, FileText } from 'lucide-react';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UploadResult) => void;
  uploadType: 'emissions' | 'users' | 'locations' | 'policies';
}

export interface UploadResult {
  fileName: string;
  rowsProcessed: number;
  rowsSuccess: number;
  rowsFailed: number;
  errors: UploadError[];
  data: any[];
}

interface UploadError {
  row: number;
  field: string;
  message: string;
}

const templates = {
  emissions: {
    name: 'Emissions Data Template',
    description: 'Upload employee commute emission data in bulk',
    columns: ['Date', 'Employee ID', 'Location', 'Transport Mode', 'Distance (km)', 'Emissions (kg CO₂e)', 'Data Quality'],
    example: 'emissions_template.xlsx',
  },
  users: {
    name: 'User Import Template',
    description: 'Bulk import employee users',
    columns: ['Email', 'First Name', 'Last Name', 'Role', 'Location', 'Department', 'Start Date'],
    example: 'users_template.xlsx',
  },
  locations: {
    name: 'Locations Template',
    description: 'Import office locations and details',
    columns: ['Location Name', 'Address', 'City', 'Country', 'Capacity', 'Parking Spaces'],
    example: 'locations_template.xlsx',
  },
  policies: {
    name: 'Policies Template',
    description: 'Bulk import workplace policies',
    columns: ['Policy Name', 'Type', 'Description', 'Effective Date', 'Applicable To', 'Status'],
    example: 'policies_template.xlsx',
  },
};

export function BulkUploadModal({ isOpen, onClose, onSubmit, uploadType }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const template = templates[uploadType];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['.csv', '.xlsx', '.xls'];
      const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExt)) {
        toast.error('Invalid file type. Please upload CSV or Excel files only.');
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit.');
        return;
      }

      setFile(selectedFile);
      setValidationResults(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setValidationResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateUpload = async () => {
    // Simulate file processing
    setUploading(true);
    setProgress(0);

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    // Mock validation results
    const mockResult: UploadResult = {
      fileName: file!.name,
      rowsProcessed: 250,
      rowsSuccess: 242,
      rowsFailed: 8,
      errors: [
        { row: 12, field: 'Distance', message: 'Invalid distance value: must be numeric' },
        { row: 45, field: 'Transport Mode', message: 'Unknown transport mode: "Helicopter"' },
        { row: 67, field: 'Date', message: 'Invalid date format: use DD/MM/YYYY' },
        { row: 89, field: 'Employee ID', message: 'Employee not found in system' },
        { row: 123, field: 'Emissions', message: 'Missing emission value' },
        { row: 156, field: 'Location', message: 'Location not configured' },
        { row: 189, field: 'Data Quality', message: 'Invalid quality level' },
        { row: 234, field: 'Transport Mode', message: 'Transport mode required' },
      ],
      data: [], // Would contain actual parsed data
    };

    setValidationResults(mockResult);
    setUploading(false);
    setProgress(100);
  };

  const handleUpload = async () => {
    if (!file) return;
    await simulateUpload();
  };

  const handleConfirm = () => {
    if (validationResults) {
      onSubmit(validationResults);
      toast.success(`Successfully imported ${validationResults.rowsSuccess} records`);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setValidationResults(null);
    setUploading(false);
    setProgress(0);
    onClose();
  };

  const downloadTemplate = () => {
    toast.info(`Downloading ${template.example}...`);
    // In real app, trigger actual file download
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-brand-500" />
            Bulk Upload - {template.name}
          </DialogTitle>
          <DialogDescription>
            {template.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Template Info */}
          <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-info mb-2">Required Columns</p>
                <div className="flex flex-wrap gap-2">
                  {template.columns.map((col, idx) => (
                    <Badge key={idx} variant="outline" className="bg-card text-info border-info/40">
                      {col}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="link"
                  onClick={downloadTemplate}
                  className="mt-3 p-0 h-auto text-info"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Template File
                </Button>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          {!file && !validationResults && (
            <div
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-brand-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileSpreadsheet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                CSV, XLSX, or XLS (max 10MB)
              </p>
              <Button variant="outline">
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Selected File */}
          {file && !validationResults && (
            <div className="p-4 bg-background-subtle border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-success" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {uploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Processing...</p>
                    <p className="text-sm font-medium text-foreground">{progress}%</p>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          )}

          {/* Validation Results */}
          {validationResults && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
                  <p className="text-sm text-info mb-1">Total Rows</p>
                  <p className="text-2xl font-bold text-info">
                    {validationResults.rowsProcessed}
                  </p>
                </div>
                <div className="p-4 bg-success-subtle border border-success/25 rounded-lg">
                  <p className="text-sm text-success mb-1">Successful</p>
                  <p className="text-2xl font-bold text-success">
                    {validationResults.rowsSuccess}
                  </p>
                </div>
                <div className="p-4 bg-destructive-subtle border border-destructive/25 rounded-lg">
                  <p className="text-sm text-destructive mb-1">Failed</p>
                  <p className="text-2xl font-bold text-destructive">
                    {validationResults.rowsFailed}
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {validationResults.rowsSuccess > 0 && (
                <div className="p-4 bg-success-subtle border border-success/25 rounded-lg flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-success">
                      {validationResults.rowsSuccess} records validated successfully
                    </p>
                    <p className="text-xs text-success mt-1">
                      These records are ready to be imported into the system.
                    </p>
                  </div>
                </div>
              )}

              {/* Errors */}
              {validationResults.rowsFailed > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      Validation Errors ({validationResults.errors.length})
                    </p>
                    <Badge variant="outline" className="bg-destructive-subtle text-destructive border-destructive/25">
                      Requires Attention
                    </Badge>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {validationResults.errors.map((error, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-destructive-subtle border border-destructive/25 rounded-lg flex items-start gap-2"
                      >
                        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-destructive">
                            Row {error.row}: {error.field}
                          </p>
                          <p className="text-xs text-destructive mt-1">{error.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Fix these errors in your file and re-upload, or proceed to import only the valid records.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-warning-subtle border border-warning/25 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">Important Notes</p>
                <ul className="text-xs text-warning mt-2 space-y-1 ml-4 list-disc">
                  <li>Ensure your file matches the template format exactly</li>
                  <li>Date format: DD/MM/YYYY</li>
                  <li>All required columns must be present</li>
                  <li>Invalid rows will be skipped and reported</li>
                  <li>Maximum file size: 10MB</li>
                  <li>This action will create an audit trail entry</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {!validationResults && (
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Validating...' : 'Validate File'}
            </Button>
          )}
          {validationResults && (
            <>
              <Button
                variant="outline"
                onClick={handleRemoveFile}
              >
                Upload Different File
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={validationResults.rowsSuccess === 0}
              >
                Import {validationResults.rowsSuccess} Records
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
