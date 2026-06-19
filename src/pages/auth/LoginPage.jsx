import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../../api/auth";
import useAuthStore from "../../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await signIn(email, password);
      await setSession(data.session);
      navigate("/dashboard");
    } catch (err) {
      setError("Email o contraseña incorrectos.", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        <Link to="/register">¿No tenés cuenta? Registrate</Link>
      </div>
    </div>
  );
}