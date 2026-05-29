import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { trpc } from "@/providers/trpc";
import { LOGIN_PATH } from "@/const";

type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: any;
  logout: () => Promise<void>;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const utils = trpc.useUtils();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  useEffect(() => {
    console.log("[AuthProvider] Initializing onAuthStateChanged listener...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("[AuthProvider] onAuthStateChanged fired. User:", user?.email || "null");
      setFirebaseUser(user);
      setFirebaseLoaded(true);
    });
    return unsubscribe;
  }, []);

  const {
    data: dbUser,
    isLoading: apiLoading,
    error,
    refetch,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: firebaseLoaded && !!firebaseUser,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const logout = async () => {
    await auth.signOut();
    await logoutMutation.mutateAsync();
  };

  const user = dbUser ?? (firebaseUser ? ({ 
    id: firebaseUser.uid, 
    unionId: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0], 
    email: firebaseUser.email, 
    avatar: firebaseUser.photoURL 
  } as any) : null);

  const isLoading = (!firebaseLoaded) || (apiLoading && !!firebaseUser) || logoutMutation.isPending;

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    logout,
    refresh: refetch,
  }), [user, isLoading, error, refetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } = options ?? {};

  useEffect(() => {
    if (redirectOnUnauthenticated && !context.isLoading && !context.isAuthenticated) {
      navigate(redirectPath);
    }
  }, [redirectOnUnauthenticated, context.isLoading, context.isAuthenticated, navigate, redirectPath]);

  return context;
}
