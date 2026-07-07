import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Ocurrió un error al enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      {success ? (
        <div className="auth-success">
          <h1>¡Correo enviado!</h1>
          <p>
            Te hemos enviado un correo electrónico con las instrucciones para restablecer tu contraseña.
          </p>
          <Link to="/login">Volver al inicio de sesión</Link>
        </div>
      ) : (
        <>
          <h1>Recuperar Contraseña</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem", textAlign: "center" }}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>

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

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login">Volver a iniciar sesión</Link>
          </div>
        </>
      )}
    </div>
  );
}