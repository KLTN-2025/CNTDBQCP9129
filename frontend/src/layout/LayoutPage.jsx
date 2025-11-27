import { useState } from "react";
import NavbarHeader from "../components/navbar/NavbarHeader";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/Footer";
const LayoutPage = ({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <div className="w-full flex flex-col mx-auto">
      {!isAdminRoute && (
        <NavbarHeader
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
      )}

      {isOpenSidebar && !isAdminRoute && (
        <div
          className="fixed inset-0 bg-black opacity-70 z-40 lg:hidden"
          onClick={() => setIsOpenSidebar(false)}
        ></div>
      )}

      <div
        className={`fixed w-[300px] z-50 lg:hidden transform transition-transform duration-300  ${
          isOpenSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>
      <div className={`w-full pb-20 min-h-screen ${!isAdminRoute ? "pt-20" : "pt-0"} `}>{children}</div>
      {!isAdminRoute && (
        <div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default LayoutPage;
