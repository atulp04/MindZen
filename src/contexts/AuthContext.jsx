import React, { createContext, useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const { toast } = useToast();

      const handleUserSession = useCallback((sessionUser) => {
        if (sessionUser) {
          const appRole = sessionUser.app_metadata?.role || sessionUser.user_metadata?.app_role;
          const enrichedUser = {
            ...sessionUser,
            app_metadata: {
              ...sessionUser.app_metadata,
              role: appRole || 'user' 
            }
          };
          setUser(enrichedUser);
        } else {
          setUser(null);
        }
      }, []);

      useEffect(() => {
        const getSession = async () => {
          setLoading(true);
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
              console.error("Error getting session:", error.message);
              if (error.message !== "Failed to fetch") { // Avoid toast for network errors on initial load
                toast({ variant: "destructive", title: "Auth Error", description: "Could not retrieve initial session." });
              }
            }
            handleUserSession(session?.user || null);
          } catch (e) {
            console.error("Catch: Error getting session:", e.message);
            if (e.message !== "Failed to fetch") {
              toast({ variant: "destructive", title: "Auth Error", description: "Unexpected error retrieving session." });
            }
            handleUserSession(null);
          } finally {
            setLoading(false);
          }
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setLoading(true);
            handleUserSession(session?.user || null);
            setLoading(false);
          }
        );

        return () => {
          if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
          }
        };
      }, [toast, handleUserSession]);

      const login = async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          setLoading(false);
          toast({ variant: "destructive", title: "Login Failed", description: error.message });
          return null;
        }
        if (data.user) {
          // onAuthStateChange will handle setting user and loading states
          // We can remove direct setUser and setLoading(false) here if onAuthStateChange is reliable
          // For immediate feedback, we can keep it, but ensure it doesn't conflict.
          // Let's rely on onAuthStateChange for consistency.
          // handleUserSession(data.user); // This will be handled by onAuthStateChange
          toast({ title: "Login Successful!", description: `Welcome back, ${data.user.user_metadata?.full_name || data.user.email}!` });
          setLoading(false); // Set loading false after toast
          return data.user;
        }
        setLoading(false);
        return null;
      };

      const signup = async (email, password, fullName) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            // app_metadata is typically set server-side or via Supabase UI for security.
            // We'll ensure 'user' role is default if not specified or if this method doesn't allow it.
          }
        });

        if (error) {
          setLoading(false);
          toast({ variant: "destructive", title: "Signup Failed", description: error.message });
          return null;
        }
        if (data.user) {
          // As with login, onAuthStateChange should handle this.
          // handleUserSession(data.user); 
          toast({ title: "Signup Successful!", description: "Welcome to MindZen! Please check your email to confirm your account." });
          setLoading(false);
          return data.user;
        }
        setLoading(false);
        return null;
      };

      const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        
        // onAuthStateChange will handle setUser(null) and subsequent setLoading(false)
        // However, to ensure the toast shows correctly and loading is managed:
        if (error) {
          setLoading(false); // Set loading false before toast
          if (error.message !== "Session from session_id claim in JWT does not exist" && error.message !== "Auth session not found" && error.message !== "Failed to fetch") {
            toast({ variant: "destructive", title: "Logout Failed", description: error.message });
          } else {
            console.warn("Supabase signOut warning/info:", error.message); 
            // If it's a benign error or network issue, still show positive logout toast
            // as client state will be cleared by onAuthStateChange.
            toast({ title: "Logged Out", description: "You have been successfully logged out." });
          }
        } else {
          setLoading(false); // Set loading false after successful operation
          toast({ title: "Logged Out", description: "You have been successfully logged out." });
        }
        // setUser(null) will be triggered by onAuthStateChange
        // setLoading(false) will be triggered by onAuthStateChange or here.
        // To avoid race conditions, ensure loading is false after operation.
      };
      
      const value = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.app_metadata?.role === 'admin', 
        loading,
        login,
        signup,
        logout,
        supabase
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export default AuthContext;