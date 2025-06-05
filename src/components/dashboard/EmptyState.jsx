import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EmptyState = ({ text, link, linkText }) => (
  <div className="text-center py-6">
    <p className="text-muted-foreground mb-3">{text}</p>
    {link && linkText && (
      <Button variant="outline" size="sm" asChild>
        <Link to={link}>{linkText}</Link>
      </Button>
    )}
  </div>
);

export default EmptyState;