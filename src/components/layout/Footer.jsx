
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare as BotMessageSquare, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center mb-6">
          <BotMessageSquare className="h-10 w-10 text-primary mr-3" />
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">MindZen</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Nurturing your mental well-being, one breath at a time.
        </p>
        <div className="flex justify-center space-x-6 mb-6">
          <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
            Contact Us
          </Link>
        </div>
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} MindZen. All rights reserved. 
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Made with <Heart className="inline h-4 w-4 text-red-500" /> for a calmer world.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;