import { useRef } from "react";
import { ImCross } from "react-icons/im";

const Modal = ({ onClose, children }) => {
  const ModalRef = useRef();
  const closeModal = (e) => {
    if (ModalRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={ModalRef}
      onClick={closeModal}
      className="h-[100vh] fixed inset-0 bg-opacity-100 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="relative bg-white  rounded-lg shadow-md p-6 w-11/12 max-w-lg flex justify-center items-center">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 p-2 text-black rounded-full hover:bg-gray-200 transition duration-200"
          onClick={onClose}
        >
          <ImCross className="text-gray-700" />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
