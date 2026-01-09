import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Globe, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  LifeBuoy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Help = () => {
  const contactMethods = [
    {
      title: 'Phone Support',
      description: 'Call us for urgent queries',
      value: '+91 9876543210',
      icon: Phone,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Email Support',
      description: 'Response within 24 hours',
      value: 'support@parameshwari.com',
      icon: Mail,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'WhatsApp',
      description: 'Quick chat for support',
      value: '+91 9876543210',
      icon: MessageSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Website',
      description: 'Visit our portal',
      value: 'www.parameshwari.com',
      icon: Globe,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const faqs = [
    {
      question: 'How to add a new tenant?',
      answer: 'Go to Tenants > Add Tenant in the sidebar. Fill in the required details like name, phone, room selection, and KYC documents, then click "Add Tenant".'
    },
    {
      question: 'How to generate monthly bills?',
      answer: 'Navigate to Billing > Generate Bills. You can select a specific floor or tenant to generate their monthly rent and utility bills.'
    },
    {
      question: 'How to verify tenant KYC?',
      answer: 'Go to Tenants > KYC Documents. Here you can review uploaded documents and either approve or reject the verification request.'
    },
    {
      question: 'What to do for complaints?',
      answer: 'The Complaints section tracks all issues raised by tenants. You can update their status to "In Progress" or "Resolved" as work continues.'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Help & Support</h1>
        <p className="text-muted-foreground">Everything you need to manage your PG system efficiently</p>
      </div>

      {/* Quick Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactMethods.map((method, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-xl ${method.bgColor} flex items-center justify-center mb-4`}>
                <method.icon className={`w-6 h-6 ${method.color}`} />
              </div>
              <h3 className="font-semibold text-foreground">{method.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
              <p className="text-sm font-medium text-primary break-all">{method.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQs Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b pb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b-border/50">
                <AccordionTrigger className="hover:no-underline font-medium text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Support Resources */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-2">
            <LifeBuoy className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Resources</h2>
          </div>

          <div className="space-y-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Safe & Secure</h4>
                    <p className="text-sm text-muted-foreground">All your data is encrypted and backed up daily on MongoDB Atlas.</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">View Security Manual</Button>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System Version</p>
                  <p className="text-xs text-muted-foreground">v1.2.4 (Latest)</p>
                </div>
                <Badge variant="secondary">Stable</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
