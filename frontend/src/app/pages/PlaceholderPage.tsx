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
        <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Construction className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Under Construction</h1>
        <p className="text-gray-600 mb-4">
          The <span className="font-medium">{pageName}</span> page is part of the full platform.
        </p>
        <p className="text-sm text-gray-500">
          This is a demo showcasing the core modules and navigation structure.
        </p>
      </Card>
    </div>
  );
}
