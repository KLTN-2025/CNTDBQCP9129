import UserLogin from "../navbar/UserLogin";
import AboutMe from "../navbar/AboutMe";
import Menu from "../navbar/Menu";
import News from "../navbar/News";
import BookingTable from "../navbar/BookingTable";
import Contact from "../navbar/Contact";
import Cart from "../navbar/Cart";
const NavbarHeader = ({setIsOpenSidebar}) => {
  return (
    <div className="bg-secondaryColor w-full font-bold rounded-tr-xs rounded-br-xs">
      <div className="w-full py-4 border-b-2 px-2 border-black">
        <UserLogin setIsOpenSidebar={setIsOpenSidebar}/>
      </div>
      <div className="w-full py-4 border-b-2 px-2 border-black cursor-pointer">
        <Cart setIsOpenSidebar={setIsOpenSidebar}/>
      </div>
      <div className="w-full py-4 border-b-2 px-2 border-black cursor-pointer">
        <AboutMe setIsOpenSidebar={setIsOpenSidebar}/>
      </div>
      <div className="w-full py-2 border-b-2 px-2 border-black cursor-pointer">
        <Menu setIsOpenSidebar={setIsOpenSidebar}/>
      </div>
      <div className="w-full py-2 border-b-2 px-2 border-black cursor-pointer">
        <News setIsOpenSidebar={setIsOpenSidebar}/>
      </div>
      <div className="w-full py-2 border-b-2 px-2 border-black cursor-pointer">
        <BookingTable setIsOpenSidebar={setIsOpenSidebar}/>
      </div>
      <div className="w-full py-2 border-b-2 px-2 border-black cursor-pointer">
        <Contact setIsOpenSidebar={setIsOpenSidebar}/>
      </div>
    </div>
  );
};

export default NavbarHeader;
