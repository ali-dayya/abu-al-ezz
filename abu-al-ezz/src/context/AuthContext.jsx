"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabaseBrowserClient();
    } catch {
      setLoading(false);
      return;
    }

    const loadProfile = async (sessionUser) => {
      if (!sessionUser) {
        setProfile(null);
        setIsAdmin(false);
        return;
      }

      const [{ data: customer }, { data: admin }] = await Promise.all([
        supabase.from("customers").select("*").eq("id", sessionUser.id).maybeSingle(),
        supabase.from("admins").select("id").eq("id", sessionUser.id).maybeSingle(),
      ]);

      setProfile(customer);
      setIsAdmin(!!admin);
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null);
      await loadProfile(session?.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      await loadProfile(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
