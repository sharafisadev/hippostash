"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import { AuthModal } from "@/components/organisms/AuthModal";

export type AuthMode = "login" | "register";

interface OpenOptions {
  reason?: string;
  plan?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  open: (mode?: AuthMode, opts?: OpenOptions) => void;
  close: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [opts, setOpts] = useState<OpenOptions>({});

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const open = useCallback((m: AuthMode = "login", o: OpenOptions = {}) => {
    setMode(m);
    setOpts(o);
    setModalOpen(true);
  }, []);

  const close = useCallback(() => setModalOpen(false), []);

  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, open, close, signOut }}>
      {children}
      <AuthModal
        openState={modalOpen}
        mode={mode}
        reason={opts.reason}
        plan={opts.plan}
        onClose={close}
        onModeChange={setMode}
        onSuccess={() => {
          setModalOpen(false);
          // glide to the now-unlocked stash
          setTimeout(
            () =>
              document
                .getElementById("storage")
                ?.scrollIntoView({ behavior: "smooth", block: "start" }),
            350
          );
        }}
      />
    </AuthContext.Provider>
  );
}
