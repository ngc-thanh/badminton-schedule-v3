import React, { useState, useEffect } from "react";

const Card = ({
  id,
  time,
  description,
  amount,
  members,
  onOkClick,
  onCancelClick,
  facebookData,
}) => {
  const handleOkClick = () => {
    const name = facebookData.name + '-' + facebookData.id;
    const newMembers = [...members, name];
    members = newMembers;
    onOkClick({ id, time, description, amount, members });
  };

  const handleCancelClick = () => {
    const newMembers = members.filter((member) => !member.includes(facebookData.id))
    members = newMembers;
    onCancelClick({ id, time, description, amount, members });
  };

  let isDisplayed = false;

  if (members && members.length > 0) {
    for (let i = 0; i < members.length; i++) {
      if (members[i].includes(facebookData.id)) {
        isDisplayed = true;
        break;
      }
    }
  }

  useEffect(() => {
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 h-full flex flex-col">
      <div className="mb-4 flex-grow">
        <div>
          <h2 className="text-xl font-semibold text-left">{time}</h2>
          <p className="text-gray-500 text-left">{description}</p>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-left">{amount} sân</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-left">Đăng ký tham gia:</h3>
          <ul className="list-disc list-inside">
            {members &&
              members.map((member, index) => {
                const name = member.split("-")[0];
                return (
                  <li key={index} className="text-left">
                    {name}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
      <div className="mt-auto">
        {isDisplayed ? (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={handleCancelClick}
          >
            HUỶ
          </button>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600"
            onClick={handleOkClick}
          >
            THAM GIA
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
