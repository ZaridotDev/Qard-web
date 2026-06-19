import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../../api/auth";

export default function RegisterPage() {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (username.trim().length < 2) {
      setError("El nombre de usuario debe tener al menos 2 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, username.trim());
      setSuccess(true);
    } catch (err) {
      setError("No se pudo crear la cuenta. Intentá de nuevo.", err);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <h1>¡Cuenta creada!</h1>
        <p>Te enviamos un email de confirmación. Revisá tu casilla y confirmá tu cuenta para poder ingresar.</p>
        <Link to="/login">Ir al login</Link>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h1>Crear cuenta</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Tu nombre"
          />
        </div>

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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/login">¿Ya tenés cuenta? Ingresá</Link>
      </div>
    </div>
  );
}