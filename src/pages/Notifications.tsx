import { useState } from 'react';
import { 
  Bell,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  Megaphone,
  CheckCircle2,
  Clock,
  MoreVertical,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

const notifications = [
  {
    id: 1,
    type: 'reminder',
    title: 'Rent Due Reminder',
    message: 'Your rent for February is due on 5th. Please pay to avoid late fee.',
    recipients: 'All Tenants',
    channel: 'WhatsApp',
    sentAt: '2024-02-03T10:00:00',
    status: 'sent',
    readBy: 85,
  },
  {
    id: 2,
    type: 'announcement',
    title: 'Water Supply Interruption',
    message: 'Water supply will be interrupted on 6th Feb from 10 AM to 2 PM for maintenance.',
    recipients: 'All Tenants',
    channel: 'SMS',
    sentAt: '2024-02-04T14:30:00',
    status: 'sent',
    readBy: 92,
  },
  {
    id: 3,
    type: 'notice',
    title: 'New Rules Update',
    message: 'Please note the updated visitor timing rules effective from 10th February.',
    recipients: 'All Tenants',
    channel: 'Email',
    sentAt: '2024-02-05T09:00:00',
    status: 'scheduled',
    readBy: 0,
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Overdue Payment Alert',
    message: 'Your payment is overdue by 5 days. Please clear dues immediately.',
    recipients: '5 Tenants',
    channel: 'WhatsApp',
    sentAt: '2024-02-05T11:00:00',
    status: 'sent',
    readBy: 100,
  },
];

const announcements = [
  {
    id: 1,
    title: 'Holi Celebration',
    message: 'Join us for Holi celebration on 25th March in the common area. Snacks will be provided.',
    postedAt: '2024-02-05T10:00:00',
    expiresAt: '2024-03-26',
    pinned: true,
  },
  {
    id: 2,
    title: 'Maintenance Schedule',
    message: 'Monthly pest control will be done on 10th February. Please cooperate with the team.',
    postedAt: '2024-02-03T14:00:00',
    expiresAt: '2024-02-11',
    pinned: false,
  },
  {
    id: 3,
    title: 'New Mess Menu',
    message: 'Check out our updated mess menu starting from Monday. Feedback welcome!',
    postedAt: '2024-02-01T09:00:00',
    expiresAt: '2024-02-28',
    pinned: false,
  },
];

const Notifications = () => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WhatsApp':
        return <Smartphone className="w-4 h-4 text-success" />;
      case 'SMS':
        return <MessageSquare className="w-4 h-4 text-accent" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'announcement':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'notice':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Notifications & Alerts</h1>
          <p className="text-muted-foreground mt-1">Send notifications and manage announcements</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Megaphone className="w-4 h-4 mr-2" />
                Post Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Post Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Announcement title" />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea placeholder="Write your announcement..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Expires On</Label>
                  <Input type="date" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="pinned" />
                  <Label htmlFor="pinned" className="text-sm">Pin this announcement</Label>
                </div>
                <Button className="w-full btn-gradient" onClick={() => setIsAnnouncementOpen(false)}>
                  Post Announcement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tenants</SelectItem>
                      <SelectItem value="dues">Tenants with Dues</SelectItem>
                      <SelectItem value="floor1">Floor 1 Tenants</SelectItem>
                      <SelectItem value="floor2">Floor 2 Tenants</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reminder">Payment Reminder</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="notice">Notice</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Smartphone className="w-4 h-4 mr-1" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      SMS
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Notification title" />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea placeholder="Write your message..." rows={4} />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Schedule
                  </Button>
                  <Button className="flex-1 btn-gradient" onClick={() => setIsComposeOpen(false)}>
                    Send Now
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sent Today</p>
                <p className="text-xl font-bold text-foreground">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-xl font-bold text-success">98%</p>
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
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-xl font-bold text-foreground">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Notices</p>
                <p className="text-xl font-bold text-foreground">{announcements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sent">Sent Notifications</TabsTrigger>
          <TabsTrigger value="announcements">Notice Board</TabsTrigger>
        </TabsList>

        <TabsContent value="sent">
          <Card className="stat-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Notifications</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search notifications..." className="pl-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
                    {getChannelIcon(notification.channel)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      <Badge className={getTypeColor(notification.type)}>{notification.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>To: {notification.recipients}</span>
                      <span>Via: {notification.channel}</span>
                      <span>
                        {new Date(notification.sentAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {notification.status === 'sent' ? (
                      <Badge className="bg-success/10 text-success border-success/20">Sent</Badge>
                    ) : (
                      <Badge className="bg-warning/10 text-warning border-warning/20">Scheduled</Badge>
                    )}
                    {notification.readBy > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.readBy}% read
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card className="stat-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Notice Board</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-lg border ${
                    announcement.pinned 
                      ? 'border-primary/30 bg-primary/5' 
                      : 'border-border bg-muted/50'
                  } animate-slide-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {announcement.pinned && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">📌 Pinned</Badge>
                        )}
                        <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>
                          Posted: {new Date(announcement.postedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        <span>
                          Expires: {new Date(announcement.expiresAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>{announcement.pinned ? 'Unpin' : 'Pin'}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
