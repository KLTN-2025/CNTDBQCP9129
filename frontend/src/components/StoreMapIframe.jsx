import { useState } from "react";

export default function MapViewer() {
  const [showMap, setShowMap] = useState(false);

  // Google Maps embed link cho địa chỉ: 12 Bạch Đằng, Hải Châu, Đà Nẵng
  const embedSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.123456789!2d108.214023!3d16.067786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219fdded12345%3A0xabcdef1234567890!2s12%20Bach%20Dang%2C%20Hai%20Chau%2C%20Da%20Nang!5e0!3m2!1sen!2s!4v1699999999999";

  return (
    <div className="my-4">
      {!showMap && (
        <button
          onClick={() => setShowMap(true)}
          className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-2xl shadow-md transition-all cursor-pointer"
        >
          Xem bản đồ
        </button>
      )}

      {showMap && (
        <div className="mt-4 w-full h-80 rounded-lg overflow-hidden shadow-lg">
          <iframe
            title="Cửa hàng coffee"
            src={embedSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );
}
