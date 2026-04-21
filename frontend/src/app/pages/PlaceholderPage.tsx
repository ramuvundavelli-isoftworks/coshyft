import React from 'react';
import { useLocation } from 'react-router';
import { Card } from '../components/ui/card';
import { Construction } from 'lucide-react';

export default function PlaceholderPage() {
  const location = useLocation();
  const pageName = location.pathname.split('/').filter(Boolean).join(' / ');

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-12 text-center max-w-md">
        <div className="p-4 bg-info-subtle rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Construction className="h-10 w-10 text-info" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Page Under Construction</h1>
        <p className="text-muted-foreground mb-4">
          The <span className="font-medium">{pageName}</span> page is part of the full platform.
        </p>
        <p className="text-sm text-muted-foreground">
          This is a demo showcasing the core modules and navigation structure.
        </p>
      </Card>
    </div>
  );
}
