import React, { useState, useEffect } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Event = ({
  id,
  title,
  description,
  amount,
  members,
  completed,
  note,
  deadline,
  participant,
  onOkClick,
  onCancelClick,
  onDoneClick,
  isAdmin,
}) => {
  const handleOkClick = () => {
    members.push(name);
    onOkClick({ id, title, description, amount, members, completed });
    setName("");
  };

  const [isOver, setIsOver] = useState(false);

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      // If the Enter key is pressed, submit the form
      handleOkClick();
    }
  };

  const [name, setName] = useState("");
  const [deleteData, setDeleteData] = useState({});

  const handleCancelClick = (indexToRemove) => {
    const updatedMembers = members.filter(
      (_, index) => index !== indexToRemove
    );
    members = updatedMembers;
    onCancelClick({ id, title, description, amount, members, completed });
  };

  const handleDoneClick = () => {
    completed = true;
    onDoneClick({ id, title, description, amount, members, completed });
  };

  const handleEditClick = () => {
    // completed = true;
    // onDoneClick({ id, title, description, amount, members, completed });
  };

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteClick = (index) => {
    setDeleteModalOpen(true);
    setDeleteData({
      title: title,
      index: index,
      member: members[index],
    });
  };

  const handleDeleteConfirm = () => {
    // Handle delete logic here
    handleCancelClick(deleteData.index);

    // Close the modal
    setDeleteModalOpen(false);
  };

  const handleDeleteCancel = (member, index) => {
    // Close the modal without performing the delete action
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    setIsOver(members.length >= amount * 4 + 4);
  }, [members]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 h-full flex flex-col">
      <div className="mb-4 flex-grow">
        <div>
          <h2 className="text-xl font-semibold text-left">{title}</h2>
          <p className="text-gray-500 text-left">{description}</p>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-left">
            {amount} sân (full {amount * 4 + 4} người)
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-left">Ghi chú</h2>
          <p className="text-left">{note}</p>
        </div>
        {isAdmin && (
          <div className="mb-4 text-left">
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
              onClick={handleEditClick}
            >
              SỬA
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={handleDoneClick}
            >
              HUỶ SÂN
            </button>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-left">Đăng ký tham gia:</h3>
          <ul className="list-disc list-inside list-none">
            {members &&
              members.map((member, index) => (
                <div key={index} className="flex justify-between mb-1">
                  <li className="text-left">
                    {index + 1}. {member} {isOver && index + 1 > participant ? ' (dự bị)' : ''}
                  </li>
                  <button
                    className="pr-5 font-semibold text-lg text-red-500"
                    onClick={() => handleDeleteClick(index)}
                  >
                    ❌
                  </button>
                </div>
              ))}
          </ul>
        </div>
      </div>
      <div className="mt-auto">
        <input
          id="name"
          placeholder="Nhập tên của bạn..."
          onChange={(e) => setName(e.target.value)}
          rows="4"
          value={name}
          onKeyPress={handleInputKeyPress}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none mb-3"
        ></input>
        <button
          className={`text-white px-4 py-2 rounded-md mr-2 ${
            name
              ? "bg-green-500 hover:bg-green-600"
              : "opacity-50 cursor-not-allowed bg-gray-500"
          }`}
          onClick={handleOkClick}
          disabled={name ? false : true}
        >
          {name ? 'THAM GIA' : 'HÃY NHẬP TÊN'}
        </button>
      </div>
      <ConfirmDeleteModal
        title="XÁC NHẬN HỦY"
        deleteData={deleteData}
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Event;
