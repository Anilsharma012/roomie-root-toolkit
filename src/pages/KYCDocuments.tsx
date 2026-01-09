import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  User,
  Loader2,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Tenant {
  _id: string;
  name: string;
  phone: string;
  aadharNumber: string;
  status: string;
  documents: {
    type: string;
    filename: string;
    uploadedAt: string;
  }[];
  kycStatus?: 'pending' | 'verified' | 'rejected';
  photo?: string;
}

const KYCDocuments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading } = useQuery<Tenant[]>({ queryKey: ['/api/tenants'] });

  const updateKYCMutation = useMutation({
    mutationFn: async ({ id, kycStatus }: { id: string; kycStatus: string }) => {
      return api.put(`/tenants/${id}`, { kycStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tenants'] });
      setIsViewDialogOpen(false);
      toast({ title: 'KYC status updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = 
      tenant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || (tenant.kycStatus || 'pending') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const verifiedCount = tenants.filter(t => t.kycStatus === 'verified').length;
  const pendingCount = tenants.filter(t => !t.kycStatus || t.kycStatus === 'pending').length;
  const rejectedCount = tenants.filter(t => t.kycStatus === 'rejected').length;

  const getKYCBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const handleViewTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsViewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">KYC Documents</h1>
          <p className="text-muted-foreground mt-1">Verify tenant identity documents</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-xl font-bold text-success" data-testid="text-verified">{verifiedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-warning" data-testid="text-pending">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-xl font-bold text-destructive" data-testid="text-rejected">{rejectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="stat-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Tenant Documents</CardTitle>
            <div className="flex gap-3">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32" data-testid="select-status">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTenants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tenants found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Aadhar</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant._id} data-testid={`row-tenant-${tenant._id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{tenant.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{tenant.phone}</TableCell>
                      <TableCell className="font-mono">{tenant.aadharNumber || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          <FileText className="w-3 h-3 mr-1" />
                          {tenant.documents?.length || 0} docs
                        </Badge>
                      </TableCell>
                      <TableCell>{getKYCBadge(tenant.kycStatus)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewTenant(tenant)}
                          data-testid={`button-view-${tenant._id}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              KYC Verification - {selectedTenant?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedTenant && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedTenant.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedTenant.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aadhar Number</p>
                  <p className="font-medium font-mono">{selectedTenant.aadharNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  {getKYCBadge(selectedTenant.kycStatus)}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Uploaded Documents</p>
                {selectedTenant.documents && selectedTenant.documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {selectedTenant.documents.map((doc, idx) => (
                      <div key={idx} className="flex flex-col p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{doc.type}</p>
                            <p className="text-xs text-muted-foreground">{doc.filename}</p>
                          </div>
                        </div>
                        {doc.filename && (
                          <div className="rounded-md overflow-hidden bg-white border border-border flex items-center justify-center relative group min-h-[300px]">
                            {doc.filename.toLowerCase().endsWith('.pdf') ? (
                              <div className="flex flex-col items-center gap-2 p-8">
                                <FileText className="w-16 h-16 text-destructive" />
                                <span className="text-sm font-medium">PDF Document</span>
                              </div>
                            ) : (
                              <img 
                                src={`/api/tenants/uploads/${doc.filename}`} 
                                alt={doc.type}
                                className="w-full h-auto max-h-[600px] object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            )}
                            <a 
                              href={`/api/tenants/uploads/${doc.filename}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2"
                            >
                              <Eye className="w-5 h-5" />
                              View Full Size
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No documents uploaded</p>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  className="flex-1 bg-success hover:bg-success/90 text-white"
                  onClick={() => updateKYCMutation.mutate({ id: selectedTenant._id, kycStatus: 'verified' })}
                  disabled={updateKYCMutation.isPending}
                  data-testid="button-verify"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verify KYC
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1"
                  onClick={() => updateKYCMutation.mutate({ id: selectedTenant._id, kycStatus: 'rejected' })}
                  disabled={updateKYCMutation.isPending}
                  data-testid="button-reject"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KYCDocuments;
