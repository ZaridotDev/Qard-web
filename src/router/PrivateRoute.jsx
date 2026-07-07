import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore((state) => state);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg-deep)",
          gap: "1rem",
        }}
      >
        <div className="spinner" />
        <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", letterSpacing: "0.1em" }}>
          CARGANDO…
        </span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}