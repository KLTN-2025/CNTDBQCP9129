import Modal from "react-modal";
import { motion } from "framer-motion";
const ModalCreateBlogCategory = () => {
  // const { handeEditNameCollection, isEditing } =
  //   useEditNameCollection(collectionId);
  // useLockBodyScroll(ModalCreateNameCollection);
  // const handleOnChangeCreateName = (e) => {
  //   setNameCollectionInput(e.target.value);
  // };
  // const handleClickContinue = () => {
  //   if (nameCollectionInput.trim().length > 0) {
  //     setIsOpenModalShowSavePostsToPick(true);
  //     setIsOpenModalCreateNameCollection(false);
  //   }
  // };
  // const handeClickEditName = async () => {
  //   if (nameCollectionInput.trim().length > 0) {
  //     await handeEditNameCollection(nameCollectionInput);
  //     setIsOpenModalCreateNameCollection(false);
  //   }
  // };
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalCreateNameCollection}
      onRequestClose={() => setIsOpenModalCreateNameCollection(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "8rem",
          left: "auto",
          right: "auto",
          bottom: "auto",
          padding: 0,
          border: "none",
          background: "transparent",
          borderRadius: "0.5rem",
          overflow: "visible",
          width: "100%",
          maxWidth: "460px",
        },
      }}
    >
      <motion.div className="bg-color-dash text-white overflow-hidden rounded-md w-full flex flex-col  select-none">
        <div className="w-full bg-color-dash py-2 flex justify-center relative">
          <p className="font-bold">Bộ sưu tập mới</p>
        </div>
        <div className="py-8 border border-t-color-input-gray border-b-color-input-gray px-4 border-l-0 border-r-0 flex items-center justify-center">
          <input
            type="text"
            value={nameCollectionInput}
            onChange={handleOnChangeCreateName}
            className="rounded-md w-full px-2 py-5 h-3 border border-black  focus:border-color-input-gray focus:outline-none bg-black"
            placeholder="Tên bộ sưu tập"
          />
        </div>
        {isEditName ? (
          <button
            className="w-full bg-color-dash py-2 flex justify-center cursor-pointer relative active:bg-color-note"
            onClick={handeClickEditName}
          >
            {isEditing ? (
              <img
                className="object-cover w-7 h-7 rounded-full"
                src={`${import.meta.env.BASE_URL}loading.gif`}
                alt="gif"
              />
            ) : (
              <p className="font-bold text-blue-500">Xong</p>
            )}
          </button>
        ) : (
          <button
            className="w-full bg-color-dash py-2 flex justify-center cursor-pointer relative active:bg-color-note"
            onClick={handleClickContinue}
          >
            <p className="font-bold">Tiếp</p>
          </button>
        )}
      </motion.div>
    </Modal>
  );
};

export default ModalCreateBlogCategory;
