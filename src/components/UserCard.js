import React, { useState, useEffect } from "react";

const UserCard = ({
  bookingDetail
}) => {
  // console.log(bookingDetail);
  const handleOkClick = () => {
    // members.push(name);
    // onOkClick({ id, title, description, amount, members, completed, name });
    // setName("");
  };

  const updatedDatetime = new Date(bookingDetail.updated.toDate());
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false, // Use 24-hour format
  };
  const updatedAt = updatedDatetime.toLocaleString(undefined, options);

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
    // const updatedMembers = members.filter(
    //   (_, index) => index !== indexToRemove
    // );

    // const removeName = members[indexToRemove];
    // members = updatedMembers;
    // onCancelClick({
    //   id,
    //   title,
    //   description,
    //   amount,
    //   members,
    //   completed: false,
    //   removeName,
    // });
  };

  const handleDoneClick = () => {
    // setDeleteModalOpen({
    //   open: true,
    //   type: "done",
    // });
    // setDeleteData({
    //   title: `${title}, ${amount} sân ${description}`,
    // });
    // onDoneClick({ id, title, description, amount, members, completed });
  };

  const [isDeleteModalOpen, setDeleteModalOpen] = useState({
    open: false,
    type: "",
  });

  const handleDeleteClick = (index) => {
    // setDeleteModalOpen({
    //   open: true,
    //   type: "delete",
    // });
    // setDeleteData({
    //   title: title,
    //   index: index,
    //   member: members[index],
    // });
  };

  const handleDeleteConfirm = () => {
    // // Handle delete logic here
    // if (isDeleteModalOpen.type === "delete") {
    //   handleCancelClick(deleteData.index);
    // } else {
    //   onDoneClick({
    //     id,
    //     title,
    //     description,
    //     amount,
    //     members,
    //     completed: true,
    //   });
    // }

    // // Close the modal
    // setDeleteModalOpen(false);
  };

  const handleDeleteCancel = (member, index) => {
    // Close the modal without performing the delete action
    setDeleteModalOpen(false);
  };

  // useEffect(() => {
  //   setIsOver(members.length >= participant);
  // }, [members]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 h-full flex flex-col">
      <div className="flex-grow">
        <div>
          <h2 className="text-xl font-semibold text-left">
            {bookingDetail.userName}
            </h2>
          <p className="text-gray-500 text-left">
            {bookingDetail.type === 'OK' ? 'THAM GIA' : 'HUỶ'}
          </p>
        </div>
        <div>
          <p className="text-left">
            {updatedAt}
            </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
