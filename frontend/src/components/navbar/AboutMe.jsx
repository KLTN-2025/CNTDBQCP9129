import React from "react";
import { Link } from "react-router-dom";
const AboutMe = ({ setIsOpenSidebar, sidebar = false }) => {
  return (
    <div>
      <Link to="/about-me">
        <span
          className="hover:text-green-700 cursor-pointer"
          onClick={() => {
            if (sidebar) {
              setIsOpenSidebar(false);
            }
          }}
        >
          VỀ COFFEE GO
        </span>
      </Link>
    </div>
  );
};

export default AboutMe;
