import Menu from "./Menu";
import BookingItem from "./BookingItem";
import BookingTable from "./BookingTable";
import UserLogin from "./UserLogin";
import Cart from "./Cart";
import AboutMe from "./AboutMe";
import Contact from "./Contact";
import { RxHamburgerMenu } from "react-icons/rx";
const NavbarHeader = ({isOpenSidebar, setIsOpenSidebar}) => {
  return (
    <div className="w-full bg-mainColor max-lg:py-2 py-4 flex whitespace-nowrap relative shadow-mainColor shadow-md">
      <div className="flex gap-x-5 items-center max-lg:justify-center max-lg:relative w-full xl:px-30 px-10">
        <div className="flex flex-items-center font-bold gap-x-10 max-lg:hidden w-full">
          <AboutMe />
          <Menu />
          <BookingItem />
          <BookingTable />
        </div>
        <img
          src="/logo_coffee.png"
          className="w-28 h-26 max-lg:w-16 max-lg:h-14 rounded-full object-cover cursor-pointer select-none"
          alt="logo coffee go"
        />
        <div className="flex items-center justify-end font-bold gap-x-12 max-xl:gap-x-3 w-full max-lg:hidden">
          <Contact/>
          <UserLogin />
          <Cart />
        </div>
        <RxHamburgerMenu className="lg:hidden absolute right-6 text-3xl cursor-pointer"
         onClick={() => setIsOpenSidebar(!isOpenSidebar)}
        />
      </div>
    </div>
  );
};

export default NavbarHeader;
