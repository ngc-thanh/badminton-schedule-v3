function AddEventModal({ open, modalLabel, children, custom_modal, onClose }) {
  const handleClose = (e) => {
    if (e.target.className === "modalContainer") {
      onClose();
    }
    return null;
  };

  if (open) {
    return (
      <div
        onClick={handleClose}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-4 rounded-lg shadow-md w-11/12 lg:w-3/5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{modalLabel}</h2>
            <span
              onClick={onClose}
              className="cursor-pointer text-gray-600 hover:text-gray-800 text-lg"
            >
              x
            </span>
          </div>
          {children}
        </div>
      </div>
    );
  }
  return null;
}

export default AddEventModal;
