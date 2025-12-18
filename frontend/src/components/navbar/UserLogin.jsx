import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
const UserLogin = ({setIsOpenSidebar}) => {
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
    <div className="flex items-center gap-x-2 mr-10" >
      <img src="/user.png" className="w-8 h-8 object-cover mt-1" alt="tài khoản" />
      <div className="flex flex-col font-normal">
        <Link to="/profile">
          <button className="text-sm hover:text-green-700 cursor-pointer font-semibold"
           onClick={() => setIsOpenSidebar(false)}
          >
            Tài khoản
          </button>
        </Link>

        {!user ? (
        <Link to={`/account/login?redirect=${location.pathname}${location.search}`}>
          <button className="text-xs hover:text-green-700 cursor-pointer"
           onClick={() => setIsOpenSidebar(false)}
          >
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
