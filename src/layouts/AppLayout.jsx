import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Nav from "../components/layout/Nav";
import Footer from "../components/layout/Footer";
import '../styles/HomeStyles.css';

export default function AppLayout() {
  return (
    <>
      <Header className="header" />
      <Nav className="nav-main"/>

      <main className="main">
        <Outlet />
      </main>

      <Footer className="footer" />
    </>
  );
}