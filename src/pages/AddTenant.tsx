import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User,
  Phone,
  Upload,
  FileText,
  BedDouble,
  Save,
  ArrowLeft,
  AlertCircle,
  Loader2,
  X,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Room {
  _id: string;
  roomNumber: string;
  floorId?: { floorNumber: number };
}

interface Bed {
  _id: string;
  bedNumber: string;
  roomId?: { _id: string; roomNumber: string };
  status: string;
}

interface FilePreview {
  name: string;
  data: string;
  type: string;
}

const AddTenant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    occupation: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    roomId: '',
    bedId: '',
    checkInDate: '',
    rentAmount: '',
    depositAmount: '',
    rentDueDate: '',
    mealPlan: '',
    aadharNumber: '',
    idNumber: ''
  });

  const [files, setFiles] = useState<{
    aadhar: FilePreview | null;
    photoId: FilePreview | null;
    photo: FilePreview | null;
  }>({
    aadhar: null,
    photoId: null,
    photo: null
  });

  const aadharInputRef = useRef<HTMLInputElement>(null);
  const photoIdInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const { data: rooms = [] } = useQuery<Room[]>({ queryKey: ['/api/rooms'] });
  const { data: vacantBeds = [] } = useQuery<Bed[]>({ queryKey: ['/api/beds/vacant'] });

  const createTenantMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/tenants', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tenants'] });
      queryClient.invalidateQueries({ queryKey: ['/api/beds'] });
      toast({ title: 'Tenant registered successfully!' });
      navigate('/tenants');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (type: 'aadhar' | 'photoId' | 'photo', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum file size is 5MB', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFiles(prev => ({
        ...prev,
        [type]: {
          name: file.name,
          data: reader.result as string,
          type: file.type
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type: 'aadhar' | 'photoId' | 'photo') => {
    setFiles(prev => ({ ...prev, [type]: null }));
  };

  const handleSubmit = () => {
    if (!termsAccepted) {
      toast({ title: 'Please accept terms and conditions', variant: 'destructive' });
      return;
    }

    const documents = [];
    if (files.aadhar) {
      documents.push({ type: 'aadhar', filename: files.aadhar.name, data: files.aadhar.data });
    }
    if (files.photoId) {
      documents.push({ type: 'photoId', filename: files.photoId.name, data: files.photoId.data });
    }

    const tenantData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      aadharNumber: formData.aadharNumber,
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relation: formData.emergencyRelation
      },
      roomId: formData.roomId || undefined,
      bedId: formData.bedId || undefined,
      joinDate: formData.checkInDate || new Date().toISOString(),
      rentAmount: parseFloat(formData.rentAmount) || 0,
      depositAmount: parseFloat(formData.depositAmount) || 0,
      status: formData.bedId ? 'active' : 'inactive',
      documents,
      photo: files.photo?.data,
      occupation: formData.occupation,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      kycStatus: documents.length > 0 ? 'pending' : undefined
    };

    createTenantMutation.mutate(tenantData);
  };

  const filteredBeds = vacantBeds.filter(bed => 
    !formData.roomId || bed.roomId?._id === formData.roomId
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenants')} data-testid="button-back">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">Add New Tenant</h1>
          <p className="text-muted-foreground mt-1">Register a new tenant with complete details</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
              data-testid={`step-${s}`}
            >
              {s}
            </div>
            <span className={`text-sm hidden sm:block ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s === 1 ? 'Personal' : s === 2 ? 'Contact' : s === 3 ? 'Room' : 'Documents'}
            </span>
            {s < 4 && <div className={`w-8 lg:w-16 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Enter tenant's basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input 
                  placeholder="Enter first name" 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  data-testid="input-firstname"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input 
                  placeholder="Enter last name" 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  data-testid="input-lastname"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input 
                  type="date" 
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  data-testid="input-dob"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                  <SelectTrigger data-testid="select-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={(v) => handleInputChange('bloodGroup', v)}>
                  <SelectTrigger data-testid="select-bloodgroup">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a+">A+</SelectItem>
                    <SelectItem value="a-">A-</SelectItem>
                    <SelectItem value="b+">B+</SelectItem>
                    <SelectItem value="b-">B-</SelectItem>
                    <SelectItem value="ab+">AB+</SelectItem>
                    <SelectItem value="ab-">AB-</SelectItem>
                    <SelectItem value="o+">O+</SelectItem>
                    <SelectItem value="o-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Occupation *</Label>
                <Select value={formData.occupation} onValueChange={(v) => handleInputChange('occupation', v)}>
                  <SelectTrigger data-testid="select-occupation">
                    <SelectValue placeholder="Select occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="working">Working Professional</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>College/Company Name</Label>
                <Input 
                  placeholder="Enter institute or company name" 
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  data-testid="input-company"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setStep(2)} className="btn-gradient" data-testid="button-next-step1">
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Enter contact and address details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input 
                  placeholder="+91 XXXXX XXXXX" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  data-testid="input-phone"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input 
                  type="email" 
                  placeholder="email@example.com" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  data-testid="input-email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Permanent Address *</Label>
              <Input 
                placeholder="Enter complete address" 
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                data-testid="input-address"
              />
            </div>
            <Separator />
            <h4 className="font-medium">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Contact Name *</Label>
                <Input 
                  placeholder="Enter name" 
                  value={formData.emergencyName}
                  onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                  data-testid="input-emergency-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone *</Label>
                <Input 
                  placeholder="+91 XXXXX XXXXX" 
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  data-testid="input-emergency-phone"
                />
              </div>
              <div className="space-y-2">
                <Label>Relation *</Label>
                <Select value={formData.emergencyRelation} onValueChange={(v) => handleInputChange('emergencyRelation', v)}>
                  <SelectTrigger data-testid="select-relation">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(1)} data-testid="button-prev-step2">
                Previous
              </Button>
              <Button onClick={() => setStep(3)} className="btn-gradient" data-testid="button-next-step2">
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="w-5 h-5" />
              Room & Payment Details
            </CardTitle>
            <CardDescription>Assign room and set payment terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Room Number</Label>
                <Select value={formData.roomId} onValueChange={(v) => handleInputChange('roomId', v)}>
                  <SelectTrigger data-testid="select-room">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room._id} value={room._id}>
                        Room {room.roomNumber} (Floor {room.floorId?.floorNumber || '?'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bed</Label>
                <Select value={formData.bedId} onValueChange={(v) => handleInputChange('bedId', v)}>
                  <SelectTrigger data-testid="select-bed">
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBeds.map(bed => (
                      <SelectItem key={bed._id} value={bed._id}>
                        Bed {bed.bedNumber} - Room {bed.roomId?.roomNumber || '?'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Check-in Date *</Label>
                <Input 
                  type="date" 
                  value={formData.checkInDate}
                  onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                  data-testid="input-checkin-date"
                />
              </div>
              <div className="space-y-2">
                <Label>Rent Amount (Rs) *</Label>
                <Input 
                  type="number" 
                  placeholder="8500" 
                  value={formData.rentAmount}
                  onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                  data-testid="input-rent"
                />
              </div>
              <div className="space-y-2">
                <Label>Security Deposit (Rs) *</Label>
                <Input 
                  type="number" 
                  placeholder="17000" 
                  value={formData.depositAmount}
                  onChange={(e) => handleInputChange('depositAmount', e.target.value)}
                  data-testid="input-deposit"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rent Due Date *</Label>
                <Select value={formData.rentDueDate} onValueChange={(v) => handleInputChange('rentDueDate', v)}>
                  <SelectTrigger data-testid="select-due-date">
                    <SelectValue placeholder="Select due date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st of every month</SelectItem>
                    <SelectItem value="5">5th of every month</SelectItem>
                    <SelectItem value="10">10th of every month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Meal Plan</Label>
                <Select value={formData.mealPlan} onValueChange={(v) => handleInputChange('mealPlan', v)}>
                  <SelectTrigger data-testid="select-meal-plan">
                    <SelectValue placeholder="Select meal plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Meal Plan</SelectItem>
                    <SelectItem value="full">Full Board (Rs 4500/mo)</SelectItem>
                    <SelectItem value="half">Half Board (Rs 3000/mo)</SelectItem>
                    <SelectItem value="breakfast">Breakfast Only (Rs 1500/mo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(2)} data-testid="button-prev-step3">
                Previous
              </Button>
              <Button onClick={() => setStep(4)} className="btn-gradient" data-testid="button-next-step3">
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              KYC Documents
            </CardTitle>
            <CardDescription>Upload required identity and address documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Document Requirements</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Please upload clear, colored scans of the following documents. Files should be less than 5MB each.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Aadhar Card *</Label>
                  <input 
                    type="file" 
                    ref={aadharInputRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('aadhar', e)}
                    data-testid="input-file-aadhar"
                  />
                  {files.aadhar ? (
                    <div className="border-2 border-success rounded-lg p-4 flex items-center justify-between bg-success/5">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <span className="text-sm font-medium truncate max-w-[150px]">{files.aadhar.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFile('aadhar')}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => aadharInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Aadhar Number *</Label>
                  <Input 
                    placeholder="XXXX XXXX XXXX" 
                    value={formData.aadharNumber}
                    onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                    data-testid="input-aadhar-number"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Photo ID (College/Office ID)</Label>
                  <input 
                    type="file" 
                    ref={photoIdInputRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('photoId', e)}
                    data-testid="input-file-photoid"
                  />
                  {files.photoId ? (
                    <div className="border-2 border-success rounded-lg p-4 flex items-center justify-between bg-success/5">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <span className="text-sm font-medium truncate max-w-[150px]">{files.photoId.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFile('photoId')}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => photoIdInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>ID Number</Label>
                  <Input 
                    placeholder="Enter ID number" 
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                    data-testid="input-id-number"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Passport Size Photo *</Label>
              <input 
                type="file" 
                ref={photoInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('photo', e)}
                data-testid="input-file-photo"
              />
              {files.photo ? (
                <div className="w-32 h-40 border-2 border-success rounded-lg overflow-hidden relative bg-success/5">
                  <img src={files.photo.data} alt="Preview" className="w-full h-full object-cover" />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1 right-1 w-6 h-6"
                    onClick={() => removeFile('photo')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="w-32 h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Upload Photo</p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                data-testid="checkbox-terms"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                I confirm that all the information provided is accurate and I agree to the PG rules and regulations.
              </Label>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(3)} data-testid="button-prev-step4">
                Previous
              </Button>
              <Button 
                className="btn-gradient" 
                onClick={handleSubmit}
                disabled={createTenantMutation.isPending}
                data-testid="button-submit"
              >
                {createTenantMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save & Register Tenant</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddTenant;
