import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((x) => x);

  // Mảng paths ví dụ: ["profile", "orders"]
  return (
    <nav className="text-sm text-gray-600 mb-4">
      <Link to="/" className="hover:underline">
        Trang chủ
      </Link>

      {paths.map((path, index) => {
        const to = "/" + paths.slice(0, index + 1).join("/");

        // Label hiển thị đẹp hơn
        const labelMap = {
          profile: "Tài khoản",
          orders: "Đơn hàng",
          "change-password": "Đổi mật khẩu",
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
