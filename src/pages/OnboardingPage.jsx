import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap, BarChart3, Brain, MessageSquare as MessageSquareHeart, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    // Mark onboarding as complete (e.g., in localStorage or user profile in a real app)
    // For this example, we'll just navigate.
    // localStorage.setItem(`onboardingComplete_${user.id}`, 'true');
    navigate(path);
  };

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Explore Meditations",
      description: "Discover guided sessions for stress relief, focus, and calm.",
      cta: "Explore Meditations",
      path: "/meditation"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-accent" />,
      title: "Log Your Mood",
      description: "Track your emotions and gain insights into your well-being.",
      cta: "Log My Mood",
      path: "/mood-tracker"
    },
    {
      icon: <MessageSquareHeart className="h-8 w-8 text-primary" />,
      title: "Inner Dialogues",
      description: "Listen to positive affirmations for growth and resilience.",
      cta: "Discover Dialogues",
      path: "/self-talk"
    },
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: "Track Your Progress",
      description: "See your journey unfold on your personal dashboard.",
      cta: "Go to Dashboard",
      path: "/dashboard"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        className="bg-card p-6 sm:p-8 md:p-12 rounded-xl shadow-2xl max-w-3xl w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div variants={itemVariants}>
          <Zap className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            Welcome to MindZen!
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            You're all set to begin your journey towards a more balanced and mindful life. Here’s how you can make the most of MindZen:
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-background/50 p-4 rounded-lg border border-border"
              variants={itemVariants}
            >
              <div className="flex items-center mb-2">
                {feature.icon}
                <h3 className="text-lg font-semibold ml-3 text-foreground">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`w-full justify-start text-sm ${index % 2 === 0 ? 'text-primary hover:text-primary' : 'text-accent hover:text-accent'}`}
                onClick={() => handleNavigation(feature.path)}
              >
                {feature.cta} <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:justify-center sm:space-x-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto text-base px-8 py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            onClick={() => handleNavigation('/meditation')}
          >
            Explore Meditations
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto text-base px-8 py-3"
            onClick={() => handleNavigation('/mood-tracker')}
          >
            Log My Mood
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Or, skip and go straight to Dashboard
            </Link>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default OnboardingPage;