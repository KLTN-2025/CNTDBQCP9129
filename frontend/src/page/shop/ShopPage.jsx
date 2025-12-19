import React, { useState } from "react";
import { MdLocationPin, MdAccessTime } from "react-icons/md";
import { FaPhone, FaStore } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import { useEffect } from "react";

const ShopPage = () => {
  const shopImages = [
    "/view-shop4.jpg",
    "/view-shop5.jpg",
    "/view-shop6.jpg",
    "/view-shop7.jpg",
    "/view-shop8.jpg",
  ];
  const [pickedImage, setPickedImage] = useState(0);
  useEffect(() => {
      document.title = `Cửa hàng`;
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-white">
      {/* Hero Section */}
      <div className="relativepy-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <FaStore className="text-xl" />
            <span className="text-sm font-medium">Coffee Shop</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Cửa Hàng Bạch Đằng</h1>
          <p className="text-lg text-orange-600">Đà Nẵng - Hải Châu</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={shopImages[pickedImage]}
                alt="cửa hàng"
                className="object-cover w-full h-[400px] md:h-[500px] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-3">
              {shopImages.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setPickedImage(i)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                    pickedImage === i
                      ? "ring-4 ring-orange-500 scale-105"
                      : "ring-2 ring-gray-200 hover:ring-orange-300 hover:scale-105"
                  }`}
                >
                  <img
                    src={image}
                    className="object-cover w-full h-16 md:h-20"
                    alt={`thumbnail ${i + 1}`}
                  />
                  {pickedImage === i && (
                    <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                      <BsCheckCircleFill className="text-white text-2xl drop-shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Store Name Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Thông Tin Cửa Hàng</h2>
              
              {/* Address */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl mb-4 hover:shadow-md transition-shadow">
                <div className="bg-orange-500 p-3 rounded-full text-white shadow-md">
                  <MdLocationPin className="text-2xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium mb-1">Địa chỉ</p>
                  <p className="text-gray-800 font-medium">12 Bạch Đằng, Hải Châu, Đà Nẵng</p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-4 hover:shadow-md transition-shadow">
                <div className="bg-green-500 p-3 rounded-full text-white shadow-md">
                  <MdAccessTime className="text-2xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium mb-1">Giờ mở cửa</p>
                  <p className="text-gray-800 font-bold text-xl">08:00 - 23:00</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="bg-blue-500 p-3 rounded-full text-white shadow-md">
                  <FaPhone className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium mb-1">Hotline</p>
                  <a href="tel:0236123456" className="text-blue-600 font-medium hover:text-blue-700">
                    (0236) 123 456
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-orange-100 overflow-hidden">
              <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Bản đồ</h3>
              <div className="rounded-xl overflow-hidden shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8993396748873!2d108.22010877584654!3d16.056244984617168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c24ddc234b%3A0x90bb7a52c5557d5d!2zMTIgQuG6oWNoIMSQ4bq1bmcsIFRow6FjaCBUaOG6r25nLCBI4bqjaSBDaMOidSwgxJDDoCBO4bq1bmcgNTUwMDAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1733406000000!5m2!1svi!2s"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: "☕", title: "Cà phê nguyên chất", desc: "100% Arabica & Robusta" },
            { icon: "🎂", title: "Bánh tươi mỗi ngày", desc: "Nướng tươi hàng ngày" },
            { icon: "🌿", title: "Không gian xanh", desc: "Thư giãn & làm việc" }
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-orange-100"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;