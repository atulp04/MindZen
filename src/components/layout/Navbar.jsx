
    import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { useAuth } from '@/hooks/useAuth';
    import { LogIn, LogOut, UserCircle, ShieldCheck, Brain, Activity, Home, Settings, Loader2, MessageSquare as MessageSquareHeart } from 'lucide-react';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

    const Navbar = () => {
      const { isAuthenticated, user, logout, isAdmin, loading: authLoading } = useAuth();
      const navigate = useNavigate();
      const [isLoggingOut, setIsLoggingOut] = React.useState(false);

      const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
          await logout();
          navigate('/'); 
        } catch (error) {
          console.error("Navbar logout error:", error);
        } finally {
          setIsLoggingOut(false);
        }
      };
      
      const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
      const userInitial = userName?.charAt(0).toUpperCase();

      return (
        <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link to="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">MindZen</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <NavLink to="/"> <Home className="mr-1 h-4 w-4 inline-block"/>Home</NavLink>
                <NavLink to="/meditation"><Brain className="mr-1 h-4 w-4 inline-block"/>Meditate</NavLink>
                <NavLink to="/mood-tracker"><Activity className="mr-1 h-4 w-4 inline-block"/>Mood Log</NavLink>
                <NavLink to="/self-talk"><MessageSquareHeart className="mr-1 h-4 w-4 inline-block"/>Inner Dialogues</NavLink>
                {isAuthenticated && <NavLink to="/dashboard"><UserCircle className="mr-1 h-4 w-4 inline-block"/>Dashboard</NavLink>}
                {isAdmin && <NavLink to="/admin?admin=true"><ShieldCheck className="mr-1 h-4 w-4 inline-block"/>Admin</NavLink>}
              </div>
              <div className="flex items-center space-x-3">
                {isAuthenticated ? (
                  <>
                    <Avatar>
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={userName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{userInitial}</AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" onClick={handleLogout} disabled={isLoggingOut || authLoading} className="transition-colors hover:text-destructive">
                      {isLoggingOut ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogOut className="mr-2 h-5 w-5" />} Logout
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" disabled={authLoading}>
                    {authLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />} Login / Sign Up
                  </Button>
                )}
                <div className="md:hidden">
                   <Button variant="ghost" size="icon">
                     <Settings className="h-6 w-6" />
                   </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      );
    };

    const NavLink = ({ to, children }) => (
      <Link to={to} className="text-foreground/80 hover:text-primary font-medium transition-colors duration-300 flex items-center">
        {children}
      </Link>
    );

    export default Navbar;
  