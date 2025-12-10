import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((x) => x);
  return (
    <nav className="text-sm text-gray-600 mb-4">
      <Link to="/" className="hover:underline">
        Trang chủ
      </Link>

      {paths.map((path, index) => {
        const to = "/" + paths.slice(0, index + 1).join("/");
        const labelMap = {
          profile: "Tài khoản",
          "change-password": "Đổi mật khẩu",
          "orders-history": "Lịch sử đơn hàng"
        };

        return (
          <span key={to}>
            {" / "}
            {index === paths.length - 1 ? (
              <span className="font-medium text-gray-800">
                {labelMap[path] || path}
              </span>
            ) : (
              <Link to={to} className="hover:underline">
                {labelMap[path] || path}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
