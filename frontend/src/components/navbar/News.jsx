import { Link } from "react-router-dom";

const News = ({ setIsOpenSidebar, sidebar = false }) => {
  return (
    <div>
      <Link
        to="/blogs/coffeeholic"
        onClick={() => {
          if (sidebar) {
            setIsOpenSidebar(false);
          }
        }}
      >
        <span className="hover:text-green-700 cursor-pointer">TIN TỨC</span>
      </Link>
    </div>
  );
};

export default News;
