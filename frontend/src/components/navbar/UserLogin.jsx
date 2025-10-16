import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
const UserLogin = () => {
  return (
    <div className="flex items-center gap-x-4">
      <FaRegUserCircle className="text-3xl text-red-700" />
      <div className="flex flex-col font-normal">
        <button className="text-sm hover:text-red-700 cursor-pointer font-semibold">
          Tài khoản
        </button>
        <Link to="/account/login">
          <button className="text-xs hover:text-red-700 cursor-pointer">
            Đăng nhập
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
