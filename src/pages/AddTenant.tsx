import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Upload,
  FileText,
  BedDouble,
  IndianRupee,
  Save,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

const AddTenant = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenants')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Add New Tenant</h1>
          <p className="text-muted-foreground mt-1">Register a new tenant with complete details</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
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

      {/* Step 1: Personal Details */}
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
                <Input placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input placeholder="Enter last name" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select>
                  <SelectTrigger>
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
                <Select>
                  <SelectTrigger>
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
                <Select>
                  <SelectTrigger>
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
                <Input placeholder="Enter institute or company name" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setStep(2)} className="btn-gradient">
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Contact Details */}
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
                <Input placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>
            </div>
            
            <Separator />
            
            <h4 className="font-semibold text-foreground">Permanent Address</h4>
            <div className="space-y-2">
              <Label>Address Line *</Label>
              <Textarea placeholder="Enter full address" rows={2} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>City *</Label>
                <Input placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input placeholder="State" />
              </div>
              <div className="space-y-2">
                <Label>PIN Code *</Label>
                <Input placeholder="PIN Code" />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input defaultValue="India" />
              </div>
            </div>

            <Separator />

            <h4 className="font-semibold text-foreground">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Contact Name *</Label>
                <Input placeholder="Guardian/Parent name" />
              </div>
              <div className="space-y-2">
                <Label>Relation *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Previous
              </Button>
              <Button onClick={() => setStep(3)} className="btn-gradient">
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Room & Rent */}
      {step === 3 && (
        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="w-5 h-5" />
              Room Allocation & Rent
            </CardTitle>
            <CardDescription>Assign room and set rent details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Floor *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                    <SelectItem value="3">Floor 3</SelectItem>
                    <SelectItem value="4">Floor 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Room Number *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="101">Room 101 (1 bed vacant)</SelectItem>
                    <SelectItem value="103">Room 103 (Fully vacant)</SelectItem>
                    <SelectItem value="202">Room 202 (1 bed vacant)</SelectItem>
                    <SelectItem value="302">Room 302 (Fully vacant)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bed *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Bed A</SelectItem>
                    <SelectItem value="B">Bed B</SelectItem>
                    <SelectItem value="C">Bed C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Check-in Date *</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Rent Amount (₹) *</Label>
                <Input type="number" placeholder="8500" />
              </div>
              <div className="space-y-2">
                <Label>Security Deposit (₹) *</Label>
                <Input type="number" placeholder="17000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rent Due Date *</Label>
                <Select>
                  <SelectTrigger>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Meal Plan</SelectItem>
                    <SelectItem value="full">Full Board (₹4500/mo)</SelectItem>
                    <SelectItem value="half">Half Board (₹3000/mo)</SelectItem>
                    <SelectItem value="breakfast">Breakfast Only (₹1500/mo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Previous
              </Button>
              <Button onClick={() => setStep(4)} className="btn-gradient">
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Documents */}
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
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Aadhar Number *</Label>
                  <Input placeholder="XXXX XXXX XXXX" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Photo ID (College/Office ID)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>ID Number</Label>
                  <Input placeholder="Enter ID number" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Passport Size Photo *</Label>
              <div className="w-32 h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Upload Photo</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                I confirm that all the information provided is accurate and I agree to the PG rules and regulations.
              </Label>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>
                Previous
              </Button>
              <Button className="btn-gradient">
                <Save className="w-4 h-4 mr-2" />
                Save & Register Tenant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddTenant;
