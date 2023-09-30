import { useState } from "react";

function UnlockModal({ open, modalLabel, onClose, onUnlock }) {
  const [password, setPassword] = useState("");

  const handleClose = (e) => {
    if (e.target.className === "modalContainer") {
      onClose();
    }
    return null;
  };

  const handleSubmit = (e) => {
    onUnlock(password);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold text-left mb-1"
              >
                MẬT KHẨU
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition duration-300 ease-in-out"
            >
              MỞ KHÓA
            </button>
          </form>
        </div>
      </div>
    );
  }
  return null;
}

export default UnlockModal;
