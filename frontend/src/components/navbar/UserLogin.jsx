import { FaRegUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
const UserLogin = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { setCart } = useCartStore();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setCart([]);
    logout();
    navigate("/");
  };
  return (
    <div className="flex items-center gap-x-4">
      <FaRegUserCircle className="text-3xl text-green-700" />
      <div className="flex flex-col font-normal">
        <Link to="/profile">
          <button className="text-sm hover:text-green-700 cursor-pointer font-semibold">
            Tài khoản
          </button>
        </Link>

        {!user ? (
          <Link to="/account/login">
            <button className="text-xs hover:text-green-700 cursor-pointer">
              Đăng nhập
            </button>
          </Link>
        ) : (
          <button
            className="text-xs hover:text-green-700 cursor-pointer"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        )}
      </div>
    </div>
  );
};

export default UserLogin;
