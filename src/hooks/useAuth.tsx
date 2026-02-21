import { createContext, useContext, useEffect, useState, useRef, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  waitForAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  waitForAuth: () => Promise.resolve(null),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Set up the auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      // Only set loading false after initial getSession has run
      if (initializedRef.current) {
        setLoading(false);
      }
    });

    // Then check the current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      initializedRef.current = true;
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const waitForAuth = useCallback((): Promise<User | null> => {
    return new Promise((resolve) => {
      // If already resolved, return immediately
      if (initializedRef.current && !loading) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          resolve(session?.user ?? null);
        });
        return;
      }
      // Otherwise wait for auth state change
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        subscription.unsubscribe();
        resolve(session?.user ?? null);
      });
      // Fallback timeout
      setTimeout(() => {
        subscription.unsubscribe();
        supabase.auth.getSession().then(({ data: { session } }) => {
          resolve(session?.user ?? null);
        });
      }, 3000);
    });
  }, [loading]);

  return (
    <AuthContext.Provider value={{ user, session, loading, waitForAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
