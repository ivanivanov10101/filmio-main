import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header.tsx";
import FooterComponent from "../components/FooterComponent.tsx";
import { useEffect } from "react";

const Layout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-gray-100 dark:text-neutral-50 dark:bg-zinc-800">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <FooterComponent />
    </div>
  );
};

export default Layout;
