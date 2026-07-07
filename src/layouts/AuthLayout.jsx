import { Outlet } from "react-router-dom";
import "../styles/AuthStyles.css";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
}