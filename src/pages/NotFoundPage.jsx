
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { AlertTriangle } from 'lucide-react';
    import { motion } from 'framer-motion';

    const NotFoundPage = () => {
      return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center py-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="p-6 mb-4"
          >
            <AlertTriangle className="h-24 w-24 text-destructive mx-auto" />
          </motion.div>
          <motion.h1 
            className="text-6xl font-extrabold text-primary mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            404
          </motion.h1>
          <motion.p 
            className="text-2xl text-muted-foreground mb-8"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Oops! The page you're looking for seems to have wandered off.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              <Link to="/">
                Go Back Home
              </Link>
            </Button>
          </motion.div>
        </div>
      );
    };

    export default NotFoundPage;
  