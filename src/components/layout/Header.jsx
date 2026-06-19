import logo from '../../assets/logo-Qard.png'
import useAuthStore from "../../store/authStore";
// import "../../styles/HomeStyles.css";
import { Link } from "react-router-dom";
import { User } from "lucide-react";  
import MonthSelector from '../MonthSelector';

export default function Header() {
  const username = useAuthStore((state) => state.user.user_metadata.username)
  const email = useAuthStore((state) => state.user.email)
  console.log(username)
  return (
    <header className="header">

      <div className="header-left">
        <img src={logo} alt="logo" width="50" height="50" />
        <h1>QARD</h1>
      </div>

      <MonthSelector />

      <div className="header-right">
        <Link to="/login" className="link-user">
        <span style={{color: "white"}}>{username || email}</span>
        <button className="user-icon" to="/Login">
          <User size={30} color='white'/>  
        </button>
        </Link>
      </div>

    </header>
  );
}