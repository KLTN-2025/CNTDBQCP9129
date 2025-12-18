import React from "react";
import { Link } from "react-router-dom";
const Contact = ({ setIsOpenSidebar }) => {
  return (
    <div className="flex items-center gap-x-4 mr-8">
      <img src="/operator.png" alt="liên hệ" className="w-8 h-6 object-cover" />
      <Link to="/contact">
        <span
          className="hover:text-green-700 cursor-pointer"
          onClick={() => setIsOpenSidebar(false)}
        >
          Liên hệ
        </span>
      </Link>
    </div>
  );
};

export default Contact;
