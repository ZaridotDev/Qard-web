import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";
import MonthSelector from '../MonthSelector';

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const username = user?.user_metadata?.username || user?.email || "Usuario";
  const initial = username.charAt(0).toUpperCase();

  return (
    <header className="header">
      <div className="header-left">
      </div>

      <MonthSelector />

      <div className="header-right">
        <Link to="/dashboard" className="user-menu">
          <div className="user-avatar">{initial}</div>
          <span className="user-name">{username}</span>
        </Link>
      </div>
    </header>
  );
}