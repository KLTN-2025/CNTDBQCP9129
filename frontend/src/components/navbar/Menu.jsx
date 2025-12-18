import React from "react";
import { Link } from "react-router-dom";
const Menu = ({setIsOpenSidebar}) => {
  return (
    <div>
      <Link to='/menu'>
       <span className="hover:text-green-700 cursor-pointer"
        onClick={() => setIsOpenSidebar(false)}
       >THỰC ĐƠN</span>
      </Link>
    </div>
  );
};

export default Menu;
