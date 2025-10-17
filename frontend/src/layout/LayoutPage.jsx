import  { useState } from "react";
import NavbarHeader from "../components/navbar/NavbarHeader";
import Sidebar from "../components/sidebar/Sidebar";
const LayoutPage = ({children}) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  return (
    <div className="w-full flex flex-col">
      <div>
        <NavbarHeader
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
      </div>
      {isOpenSidebar && (
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
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default LayoutPage;
