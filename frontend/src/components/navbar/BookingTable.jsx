import React from "react";
import { Link } from "react-router-dom";
const BookingTable = ({ setIsOpenSidebar }) => {
  return (
    <div>
      <Link to="/reservation">
        <span
          className="hover:text-green-700 cursor-pointer"
          onClick={() => setIsOpenSidebar(false)}
        >
          ĐẶT BÀN
        </span>
      </Link>
    </div>
  );
};

export default BookingTable;
