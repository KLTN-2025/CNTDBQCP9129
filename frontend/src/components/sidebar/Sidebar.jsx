import UserLogin from "../navbar/UserLogin";
import AboutMe from "../navbar/AboutMe";
import Menu from "../navbar/Menu";
import News from "../navbar/News";
import BookingTable from "../navbar/BookingTable";
import Contact from "../navbar/Contact";
import Cart from "../navbar/Cart";
const NavbarHeader = () => {
  return (
    <div className="bg-secondaryColor w-full font-bold rounded-tr-xs rounded-br-xs">
      <div className="w-full py-4 border-b-2 px-2 border-black">
        <UserLogin />
      </div>
      <div className="w-full py-4 border-b-2 px-2 border-black cursor-pointer">
        <Cart />
      </div>
      <div className="w-full py-4 border-b-2 px-2 border-black cursor-pointer">
        <AboutMe />
      </div>
      <div className="w-full py-2 border-b-2 px-2 border-black cursor-pointer">
        <Menu />
      </div>
      <div className="w-full py-2 border-b-2 px-2 border-black cursor-pointer">
        <News />
      </div>
      <div className="w-full py-2 border-b-2 px-2 border-black cursor-pointer">
        <BookingTable />
      </div>
      <div className="w-full py-2 border-b-2 px-2 border-black cursor-pointer">
        <Contact />
      </div>
    </div>
  );
};

export default NavbarHeader;
