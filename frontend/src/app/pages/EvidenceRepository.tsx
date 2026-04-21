import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { FileText, Upload, Download, Eye, Trash2, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Evidence {
  id: string;
  name: string;
  type: 'document' | 'data' | 'report' | 'certificate';
  category: 'baseline' | 'emissions' | 'factors' | 'methodology' | 'audit';
  uploadedBy: string;
  uploadDate: string;
  size: string;
  status: 'verified' | 'pending' | 'rejected';
}

const mockEvidence: Evidence[] = [
  { id: 'e1', name: 'Baseline Calculation Workbook.xlsx', type: 'data', category: 'baseline', uploadedBy: 'John Smith', uploadDate: '2026-02-01', size: '2.4 MB', status: 'verified' },
  { id: 'e2', name: 'DEFRA 2024 Factors.pdf', type: 'document', category: 'factors', uploadedBy: 'Sarah Johnson', uploadDate: '2026-02-05', size: '1.2 MB', status: 'verified' },
  { id: 'e3', name: 'Q4 Emissions Report.pdf', type: 'report', category: 'emissions', uploadedBy: 'Mike Chen', uploadDate: '2026-02-10', size: '3.8 MB', status: 'verified' },
  { id: 'e4', name: 'ISO 14064 Certificate.pdf', type: 'certificate', category: 'audit', uploadedBy: 'Emily Davis', uploadDate: '2026-02-12', size: '856 KB', status: 'verified' },
  { id: 'e5', name: 'Employee Survey Results.csv', type: 'data', category: 'emissions', uploadedBy: 'David Wilson', uploadDate: '2026-02-15', size: '145 KB', status: 'pending' },
];

export default function EvidenceRepository() {
  const [evidence, setEvidence] = useState<Evidence[]>(mockEvidence);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [uploadData, setUploadData] = useState({ name: '', type: 'document', category: 'emissions', description: '' });

  const handleUpload = () => {
    const newEvidence: Evidence = {
      id: `e-${Date.now()}`,
      name: uploadData.name,
      type: uploadData.type as any,
      category: uploadData.category as any,
      uploadedBy: 'Current User',
      uploadDate: new Date().toISOString().split('T')[0],
      size: '1.5 MB',
      status: 'pending',
    };
    setEvidence([...evidence, newEvidence]);
    setIsUploadDialogOpen(false);
    setUploadData({ name: '', type: 'document', category: 'emissions', description: '' });
    toast.success('Evidence uploaded successfully');
  };

  const handleDelete = () => {
    if (selectedEvidence) {
      setEvidence(evidence.filter(e => e.id !== selectedEvidence.id));
      setIsDeleteDialogOpen(false);
      toast.success('Evidence deleted');
    }
  };

  const filteredEvidence = evidence.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         e.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSize = evidence.reduce((sum, e) => sum + parseFloat(e.size), 0).toFixed(1);
  const verifiedCount = evidence.filter(e => e.status === 'verified').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Evidence Repository</h1>
          <p className="text-muted-foreground mt-1">
            Centralized document management and evidence tracking
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Evidence
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <FileText className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-bold text-foreground">{evidence.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg">
              <FileText className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-success">{verifiedCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <FileText className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Storage</p>
              <p className="text-2xl font-bold text-foreground">{totalSize} MB</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <FileText className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold text-foreground">5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search evidence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="baseline">Baseline</SelectItem>
              <SelectItem value="emissions">Emissions</SelectItem>
              <SelectItem value="factors">Factors</SelectItem>
              <SelectItem value="methodology">Methodology</SelectItem>
              <SelectItem value="audit">Audit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Evidence Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Evidence Documents</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvidence.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-muted text-foreground">{item.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-info-subtle text-info">{item.category}</Badge>
                </TableCell>
                <TableCell>{item.uploadedBy}</TableCell>
                <TableCell>{item.uploadDate}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>
                  <Badge className={
                    item.status === 'verified' ? 'bg-success-subtle text-success' :
                    item.status === 'pending' ? 'bg-warning-subtle text-warning' :
                    'bg-destructive-subtle text-destructive'
                  }>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEvidence(item);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEvidence(item);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Evidence</DialogTitle>
            <DialogDescription>Add new evidence document</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="file">Select File *</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setUploadData({ ...uploadData, name: file.name });
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select value={uploadData.type} onValueChange={(val) => setUploadData({ ...uploadData, type: val })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={uploadData.category} onValueChange={(val) => setUploadData({ ...uploadData, category: val })}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baseline">Baseline</SelectItem>
                    <SelectItem value="emissions">Emissions</SelectItem>
                    <SelectItem value="factors">Factors</SelectItem>
                    <SelectItem value="methodology">Methodology</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                placeholder="Brief description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!uploadData.name}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evidence Details</DialogTitle>
            <DialogDescription>{selectedEvidence?.name}</DialogDescription>
          </DialogHeader>
          {selectedEvidence && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Type</Label>
                  <p className="font-medium text-foreground mt-1">{selectedEvidence.type}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Category</Label>
                  <p className="font-medium text-foreground mt-1">{selectedEvidence.category}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Upload Date</Label>
                  <p className="font-medium text-foreground mt-1">{selectedEvidence.uploadDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Size</Label>
                  <p className="font-medium text-foreground mt-1">{selectedEvidence.size}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Uploaded By</Label>
                <p className="font-medium text-foreground mt-1">{selectedEvidence.uploadedBy}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-foreground mt-1">{selectedEvidence.status}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              toast.success('Downloading...');
            }}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Evidence</DialogTitle>
            <DialogDescription>Remove {selectedEvidence?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete this evidence document. This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
