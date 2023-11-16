import React, { useState, useEffect } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { FiAlertTriangle } from "react-icons/fi";
import { FiX } from "react-icons/fi";

const Event = ({
  id,
  title,
  time,
  description,
  map,
  amount,
  members,
  completed,
  note,
  account,
  deadline,
  participant,
  isSameDay,
  onOkClick,
  onCancelClick,
  onDoneClick,
  onUpdateEvent,
  isAdmin,
}) => {
  const handleOkClick = () => {
    members.push(name);
    onOkClick({
      id,
      title,
      description,
      amount,
      members,
      completed,
      name,
      deadline,
      time,
    });
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

    const removeName = members[indexToRemove];
    members = updatedMembers;
    onCancelClick({
      id,
      title,
      description,
      amount,
      members,
      completed: false,
      removeName,
      deadline,
    });
  };

  const handleWarningClick = (idx) => {
    console.log("Warning!!!!");

    console.log(members);
    const memberToMove = members.find((_, index) => index === idx);

    // Remove the todo from the current position
    const updatedMembers = members.filter((_, index) => index !== idx);

    // Add the todo to the end of the list
    members = [...updatedMembers, memberToMove];
    console.log(members);

    onUpdateEvent({
      id,
      title,
      description,
      amount,
      members,
      completed,
      name,
      deadline,
      time,
    });
  };

  const handleDoneClick = () => {
    setDeleteModalOpen({
      open: true,
      type: "done",
    });
    setDeleteData({
      title: `${title}, ${amount} sân ${description}`,
    });
    // onDoneClick({ id, title, description, amount, members, completed });
  };

  const [isDeleteModalOpen, setDeleteModalOpen] = useState({
    open: false,
    type: "",
  });

  const handleDeleteClick = (index) => {
    setDeleteModalOpen({
      open: true,
      type: "delete",
    });
    setDeleteData({
      title: title,
      index: index,
      member: members[index],
    });
  };

  const handleDeleteConfirm = () => {
    // Handle delete logic here
    if (isDeleteModalOpen.type === "delete") {
      handleCancelClick(deleteData.index);
    } else {
      onDoneClick({
        id,
        title,
        description,
        amount,
        members,
        completed: true,
        deadline,
        time,
      });
    }

    // Close the modal
    setDeleteModalOpen(false);
  };

  const handleDeleteCancel = (member, index) => {
    // Close the modal without performing the delete action
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    setIsOver(members.length >= participant);
    // if (isSameDay) {
    //   members.sort();
    // }
  }, [members]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 h-full flex flex-col">
      <div className="mb-4 flex-grow">
        <div>
          <h2 className="text-xl font-semibold text-left">{title}</h2>
          <p className="text-gray-500 text-left">
            {description} ({account})
          </p>
          <a
            href={map}
            className="flex text-blue-500 hover:underline text-left"
          >
            Google map
          </a>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-left">
            {amount} sân (full {participant} người)
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-left">Ghi chú</h2>
          <p className="text-left">{note}</p>
        </div>
        {isAdmin && (
          <div className="mb-4 text-left">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={(e) => handleDoneClick(e)}
            >
              HUỶ SÂN
            </button>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-left">
            Đăng ký tham gia: {members.length}/{participant} người
          </h3>
          <ul className="list-disc list-inside list-none">
            {members &&
              members.map((member, index) => (
                <div key={index} className="flex justify-between mb-1">
                  <li className="text-left">
                    {index + 1}. {member}{" "}
                    {isOver && index + 1 > participant ? " (dự bị)" : ""}
                  </li>
                  <div className="flex items-center justify-center">
                    {/* {!isSameDay && ( */}
                      <button
                        className="pr-5 text-orange-500"
                        onClick={() => handleWarningClick(index)}
                      >
                        <FiAlertTriangle className="text-2xl" />
                      </button>
                    {/* )} */}
                    <button
                      className="pr-5 font-semibold text-lg text-red-500"
                      onClick={() => handleDeleteClick(index)}
                    >
                      <FiX className="text-3xl" />
                    </button>
                  </div>
                </div>
              ))}
          </ul>
        </div>
      </div>
      <div className="mt-auto">
        <input
          required
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
          {name ? "THAM GIA" : "HÃY NHẬP TÊN"}
        </button>
      </div>
      <ConfirmDeleteModal
        title="XÁC NHẬN HỦY"
        deleteData={deleteData}
        isOpen={isDeleteModalOpen.open}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Event;
