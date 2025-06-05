import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DashboardSection = ({ title, icon, children, className }) => (
  <Card className={`shadow-lg hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm ${className}`}>
    <CardHeader>
      <CardTitle className="flex items-center text-xl sm:text-2xl">
        {icon && React.cloneElement(icon, { className: `${icon.props.className} mr-3`})}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

export default DashboardSection;