import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CalloutCard = ({ icon, title, description, actionText, onClick, href, external = false }) => {
  const buttonContent = (
    <Button 
      onClick={!href ? onClick : undefined} 
      size="sm" 
      variant="default" 
      className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90"
    >
      {actionText}
    </Button>
  );

  return (
    <Card className="flex flex-col justify-between text-center items-center p-6 bg-gradient-to-br from-card via-background/50 to-card hover:shadow-lg transition-shadow">
      <div className="p-3 bg-primary/10 rounded-full mb-4">
        {icon}
      </div>
      <CardTitle className="text-lg mb-2 text-center justify-center">{title}</CardTitle>
      <CardDescription className="text-xs mb-4 text-center">{description}</CardDescription>
      {href ? (
        <a 
          href={href} 
          target={external ? "_blank" : "_self"} 
          rel={external ? "noopener noreferrer" : undefined}
          className="w-full sm:w-auto"
        >
          {buttonContent}
        </a>
      ) : (
        buttonContent
      )}
    </Card>
  );
};

export default CalloutCard;