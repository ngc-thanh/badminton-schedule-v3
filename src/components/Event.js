import React, { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const Event = ({
  id,
  title,
  description,
  amount,
  members,
  completed,
  note,
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
    // ...

    // Close the modal
    setDeleteModalOpen(false);
  };

  const handleDeleteCancel = (member, index) => {
    // Close the modal without performing the delete action
    setDeleteModalOpen(false);
    // handleCancelClick(index);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 h-full flex flex-col">
      <div className="mb-4 flex-grow">
        <div>
          <h2 className="text-xl font-semibold text-left">{title}</h2>
          <p className="text-gray-500 text-left">{description}</p>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-left">{amount} sân</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-left">Ghi chú</h2>
          <p className="text-left">{note}</p>
        </div>
        {isAdmin && (
          <div className="mb-4 text-left">
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
                <div key={index} className="flex justify-between">
                  <li className="text-left">
                    {index + 1}. {member}
                  </li>
                  <button
                    className="pr-5 font-semibold text-lg text-red-500"
                    onClick={() => handleDeleteClick(index)}
                  >
                    X
                  </button>
                </div>
              ))}
          </ul>
        </div>
      </div>
      <div className="mt-auto">
        <input
          id="name"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          rows="4"
          value={name}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none mb-3"
        ></input>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600 tex"
          onClick={handleOkClick}
        >
          THAM GIA
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
