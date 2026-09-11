import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { learner, loading } = useAuth();
  if (loading) return <div className="loading-state">Loading your session…</div>;
  if (!learner) return <Navigate to="/auth" replace />;
  return children;
}
