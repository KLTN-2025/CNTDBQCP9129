import React from "react";
import { Coffee, Clock, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto w-full max-w-screen-xl p-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo và slogan */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-600 p-3 rounded-full">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-400">
                  Coffee Go
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Hương vị đậm đà - Phong cách hiện đại
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Không gian ấm cúng, cà phê thơm ngon. Đến Coffee Go để tận hưởng những giây phút thư giãn tuyệt vời cùng bạn bè và người thân.
            </p>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-amber-900 dark:text-amber-400">
              Liên hệ
            </h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>12 Bạch Đằng, Đà Nẵng</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <a href="tel:0236123456" className="hover:text-amber-600 transition-colors">
                  (0236) 123 456
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <span>8:00 - 23:00 hàng ngày</span>
              </li>
            </ul>
          </div>

          {/* Menu nhanh */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-amber-900 dark:text-amber-400">
              Mục
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <a href="/menu" className="hover:text-amber-600 transition-colors inline-block">
                  Thực đơn
                </a>
              </li>
              <li>
                <a href="/menu" className="hover:text-amber-600 transition-colors inline-block">
                  Khuyến mãi
                </a>
              </li>
              <li>
                <a href="/about-me" className="hover:text-amber-600 transition-colors inline-block">
                  Về chúng tôi
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-amber-200 dark:border-gray-700" />

        {/* Bottom section */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © 2025{" "}
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              Coffee Go
            </span>
            . Hân hạnh phục vụ quý khách.
          </span>
          <div className="flex mt-4 gap-4 sm:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              aria-label="Zalo"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer