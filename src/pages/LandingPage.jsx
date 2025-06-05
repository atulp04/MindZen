import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Zap, BarChart3, Brain, MessageSquare as MessageSquareHeart } from 'lucide-react';

    const LandingPage = () => {
      return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              <span className="block">Welcome to</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-fade-in">MindZen</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your personal sanctuary for mental wellness. Discover guided meditations, track your mood, and explore inner dialogues for a balanced life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="mb-12"
          >
            {/* The "Begin Your Journey" button still links to /auth. 
                AuthPage will handle redirecting to /start if it's a new user or onboarding is needed. */}
            <Link to="/auth">
              <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                Begin Your Journey <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl w-full"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.2, delayChildren: 0.8 } }
            }}
          >
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-primary" />}
              title="Guided Meditations"
              description="Explore diverse sessions for stress relief, focus, and sleep."
              linkTo="/meditation"
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-accent" />}
              title="Mood Tracker"
              description="Log your emotions and visualize your mental well-being over time."
              linkTo="/mood-tracker"
            />
            <FeatureCard
              icon={<MessageSquareHeart className="h-10 w-10 text-primary" />}
              title="Inner-Dialogues Library"
              description="Access positive affirmations and self-guided audio sessions."
              linkTo="/self-talk"
            />
          </motion.div>
          
          <div className="mt-16 w-full max-w-5xl">
             <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl">
              <img  
                className="w-full h-full object-cover"
                alt="Calm nature scene with a person meditating peacefully by a lake at sunset, representing tranquility and mental wellness."
                src="https://images.unsplash.com/photo-1584086431904-4a2f62b5cf8e" />
            </div>
          </div>
        </div>
      );
    };

    const FeatureCard = ({ icon, title, description, linkTo }) => (
      <motion.div 
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
        }}
      >
        <Link to={linkTo} className="block h-full">
          <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center h-full">
            <div className="mb-4 p-3 bg-primary/10 rounded-full">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </Link>
      </motion.div>
    );

    export default LandingPage;