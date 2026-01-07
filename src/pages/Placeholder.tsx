import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const Placeholder = () => {
  const location = useLocation();
  const pageName = location.pathname.split('/').filter(Boolean).join(' / ');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground capitalize">
          {pageName.replace(/-/g, ' ') || 'Page'}
        </h1>
        <p className="text-muted-foreground mt-1">This section is under development</p>
      </div>

      <Card className="stat-card">
        <CardContent className="py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Construction className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            This feature is currently being built. Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Placeholder;
