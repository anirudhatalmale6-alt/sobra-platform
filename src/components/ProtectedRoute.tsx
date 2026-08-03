import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { ready, user, backendReady } = useAuth();

  if (!ready) return <div className="spinner" />;

  // In preview mode there is no auth; send to the login page which explains it.
  if (!backendReady || !user) return <Navigate to="/entrar" replace />;

  return <>{children}</>;
}
