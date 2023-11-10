import React, { useState, useEffect } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const EventCard = ({
  id,
  title,
  description,
  amount,
  members,
  completed,
  note,
  account,
  deadline,
  participant,
  onOkClick,
  onCancelClick,
  onDoneClick,
  isAdmin,
}) => {
  const handleOkClick = () => {
    members.push(name);
    onOkClick({ id, title, description, amount, members, completed, name });
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
  }, [members]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 h-full flex flex-col">
      <div className="flex-grow">
        <div>
          <h2 className="text-xl font-semibold text-left">{title}</h2>
          <p className="text-gray-500 text-left">
            {description} ({account})
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-left">
            {amount} sân (full {participant} người)
          </p>
        </div>
        <div className="mb-4">
          <p className="text-left">{note}</p>
        </div>
        {isAdmin && (
          <div className="text-left">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={(e) => handleDoneClick(e)}
            >
              HUỶ SÂN
            </button>
          </div>
        )}
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

export default EventCard;
