import React from "react";

const ConfirmDeleteModal = ({
  deleteData,
  title,
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
      <div className="bg-white p-4 rounded-lg shadow-md w-11/12 lg:w-3/5">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <p className="mb-4 text-lg">
          Bạn chắc chắn muốn xóa thông tin bên dưới phải không?
        </p>
        <div className="text-left ml-1 mb-4">
          <p className="text-xl font-bold text-center">{deleteData.title}</p>
          {deleteData.member && (
            <p className="text-base text-center">
              {deleteData.index + 1}. {deleteData.member}
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-3 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={onCancel}
          >
            QUAY LẠI
          </button>
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            onClick={onConfirm}
          >
            ĐỒNG Ý HỦY
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
