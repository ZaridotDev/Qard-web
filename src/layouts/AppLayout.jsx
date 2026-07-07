import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Nav from "../components/layout/Nav";
import Footer from "../components/layout/Footer";
import "../styles/HomeStyles.css";

import { useEffect } from "react";
import useFinanceStore from "../store/financeStore";

export default function AppLayout() {
  const initFinance = useFinanceStore((s) => s.initFinance);

  useEffect(() => {
    initFinance();
  }, []);

  return (
    <>
      <Nav />
      <div className="app-wrapper">
        <Header />
        <main className="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}