
    import React from 'react';
    import { Outlet } from 'react-router-dom';
    import Navbar from '@/components/layout/Navbar';
    import Footer from '@/components/layout/Footer';
    import { Toaster } from '@/components/ui/toaster';
    import { motion } from 'framer-motion';

    const MainLayout = () => {
      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
          <Navbar />
          <motion.main 
            className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.main>
          <Footer />
          <Toaster />
        </div>
      );
    };

    export default MainLayout;
  