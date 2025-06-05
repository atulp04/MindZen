import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { LogIn, UserPlus, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signInWithGoogle, user, loading: authLoading, refreshUser } = useAuth(); // Added refreshUser

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const from = location.state?.from?.pathname || "/start"; // Default to /start after login/signup

  // If user is already authenticated, redirect them.
  // This handles cases where user navigates to /auth directly while logged in.
  useEffect(() => {
    if (user && !authLoading) {
      // Check if onboarding is complete. For now, we assume it's not for a fresh login via /auth.
      // In a real app: check a flag like localStorage.getItem(`onboardingComplete_${user.id}`)
      // If onboarding is complete, navigate to /dashboard, otherwise to /start.
      const onboardingComplete = localStorage.getItem(`onboardingComplete_${user.id}`) === 'true';
      if (onboardingComplete) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/start", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);


  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        toast({ title: "Success", description: "Account created! Please check your email to verify." });
        // Don't navigate immediately, user needs to verify email.
        // Or, if auto-verification is on / not required for basic access:
        // await refreshUser(); // Refresh user state
        // navigate(from, { replace: true }); 
      }
    } catch (error) {
      toast({ title: "Sign Up Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        toast({ title: "Success", description: "Signed in successfully!" });
        await refreshUser(); // Refresh user state to ensure AuthContext is updated
        // The useEffect above will handle redirection based on onboarding status
      }
    } catch (error) {
      toast({ title: "Sign In Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // signInWithGoogle in AuthContext should handle navigation or the useEffect will catch the user change
      // No explicit navigation here needed if AuthContext handles it or useEffect catches it.
      // await refreshUser(); // Refresh user state
    } catch (error) {
      toast({ title: "Google Sign In Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="border-border shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold flex items-center justify-center">
                  <LogIn className="mr-3 h-8 w-8 text-primary" /> Sign In
                </CardTitle>
                <CardDescription>Welcome back! Access your MindZen sanctuary.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="email-signin" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="password-signin" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                    Sign In
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.95-4.27 1.95-5.07 0-9.2-3.91-9.2-8.77s4.13-8.77 9.2-8.77c2.6 0 4.52.99 5.99 2.32l2.44-2.44C19.43 1.99 16.56 0 12.48 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.91 0 11.71-4.76 11.71-11.99 0-.62-.05-1.25-.16-1.84H12.48z"></path></svg>}
                  Sign in with Google
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="border-border shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold flex items-center justify-center">
                  <UserPlus className="mr-3 h-8 w-8 text-primary" /> Create Account
                </CardTitle>
                <CardDescription>Join MindZen and start your wellness journey today.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                     <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="email-signup" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="password-signup" type={showPassword ? "text" : "password"} placeholder="•••••••• (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 pr-10" />
                       <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-signup">Confirm Password</Label>
                     <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="confirm-password-signup" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="pl-10 pr-10" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    Sign Up
                  </Button>
                </form>
              </CardContent>
               <CardFooter className="flex flex-col space-y-4">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.95-4.27 1.95-5.07 0-9.2-3.91-9.2-8.77s4.13-8.77 9.2-8.77c2.6 0 4.52.99 5.99 2.32l2.44-2.44C19.43 1.99 16.56 0 12.48 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.91 0 11.71-4.76 11.71-11.99 0-.62-.05-1.25-.16-1.84H12.48z"></path></svg>}
                  Sign up with Google
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AuthPage;