import { useEffect } from "react";
import AppRouter from "./router/index";
import useAuthStore from "./store/authStore";

export default function App() {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, []);

  return <AppRouter />;
}