import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function useAuthenticated() {
  const [session, setSession] = useState<Session | null | undefined>(undefined); 

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erreur lors de la récupération de la session :", error.message);
        return;
      }
      setSession(data?.session || null);
    };

    fetchSession(); 

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return session;
}