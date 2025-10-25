import React from "react";
import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
const ModalPreviewBlog = ({
  isOpenModalPreviewBlog,
  setIsOpenModalPreviewBlog,
  dataBlog,
}) => {
  useLockBodyScroll(isOpenModalPreviewBlog);
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalPreviewBlog}
      onRequestClose={() => setIsOpenModalPreviewBlog(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "5rem",
          left: "auto",
          right: "auto",
          bottom: "auto",
          padding: 0,
          border: "none",
          background: "white",
           overflow: "auto",
          borderRadius: "0.5rem",
          width: "100%",
          maxWidth: "800px",
          minHeight: "80vh"
        },
      }}
    >
      <div
        className="bg-color-dash rounded-2xl w-full flex flex-col items-center gap-y-2 p-4 select-none"
      >
        <h1 className="text-xl font-bold">{dataBlog.title}</h1>
        <div className="flex flex-col w-full items-center">
          <img src="/view-shop1.png" className="w-full object-center h-[300px]" alt="ảnh chính"/>
          <div className="max-w-md flex flex-col">
            <p className="font-medium text-yellow-500">{dataBlog.content.intro.highlight}</p>
            <p>{dataBlog.content.intro.text}</p>
            <img src="/view-shop2.png" alt="ảnh phụ"/>
            <p className="font-medium text-yellow-500">{dataBlog.content.body.highlight}</p>
            <p>{dataBlog.content.body.text}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPreviewBlog;
