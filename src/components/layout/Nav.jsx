import {LayoutDashboard, ArrowLeftRight, Wallet, Tag, RefreshCw} from "lucide-react";  
import { NavLink } from "react-router-dom";
import "../../styles/NavStyles.css"

export default function Nav() {
  return (
    <nav className="nav">
      <NavLink 
        to={"/"}
        className="navlink"
      >
        <div className="navitem">
          <LayoutDashboard className="icon"/>
          <span className="text">DASHBOARD</span>
        </div>
      </NavLink>

        <NavLink 
          to={"/transactions"}
          className="navlink">
          <div className="navitem">
            <ArrowLeftRight className="icon"/>
            <span className="text">TRANSACCIONES</span>
          </div>
        </NavLink>

        <NavLink 
          to={"/payment-methods"}
          className="navlink">
          <div className="navitem">
            <Wallet className="icon"/>
            <span className="text">METODOS DE PAGO</span>
          </div>
        </NavLink>

        <NavLink 
          to={"/categories"}
          className="navlink">
          <div className="navitem">
            <Tag className="icon"/>
            <span className="text">CATEGORIAS</span>
          </div>
        </NavLink>

        <NavLink 
          to={"/recurrents"}
          className="navlink" color="white">
          <div className="navitem">
            <RefreshCw className="icon"/>
            <span className="text">RECURRENTES</span>
          </div>
        </NavLink>
      
    </nav>
  )
}