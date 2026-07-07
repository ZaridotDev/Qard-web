import { LayoutDashboard, ArrowLeftRight, Wallet, Tag, RefreshCw, LogOut } from "lucide-react";  
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo-Qard.png";
import "../../styles/NavStyles.css";
import { signOut } from "../../api/auth";
import useAuthStore from "../../store/authStore";

export default function Nav() {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);

  async function handleLogout() {
    try {
      await signOut();
      clearSession();
      navigate("/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }

  return (
    <nav className="nav">
      <NavLink to="/dashboard" className="nav-logo">
        <img src={logo} alt="Qard Logo" />
        <span className="nav-logo-text">QARD</span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/dashboard" className="navlink">
          <LayoutDashboard className="icon" />
          <span className="text">DASHBOARD</span>
        </NavLink>

        <NavLink to="/transactions" className="navlink">
          <ArrowLeftRight className="icon" />
          <span className="text">TRANSACCIONES</span>
        </NavLink>

        <NavLink to="/payment-methods" className="navlink">
          <Wallet className="icon" />
          <span className="text">MÉTODOS DE PAGO</span>
        </NavLink>

        <NavLink to="/categories" className="navlink">
          <Tag className="icon" />
          <span className="text">CATEGORÍAS</span>
        </NavLink>

        <NavLink to="/recurrents" className="navlink">
          <RefreshCw className="icon" />
          <span className="text">RECURRENTES</span>
        </NavLink>
      </div>

      <div className="nav-footer">
        <button onClick={handleLogout} className="navlink" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut className="icon" style={{ color: 'var(--expense-color)' }} />
          <span className="text" style={{ color: 'var(--expense-color)' }}>CERRAR SESIÓN</span>
        </button>
      </div>
    </nav>
  );
}