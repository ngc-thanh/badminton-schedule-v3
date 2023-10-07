import EditUserModal from "./EditUserModal";
import { useState, useEffect } from "react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

function EditUser({ onClose, open, user }) {
  // Create state for user checkboxes
  const [statusRadio, setStatusRadio] = useState({
    active: user.data.active,
    deactive: !user.data.active,
  });

  // Define an array of users
  const statuses = [
    { id: "active", name: "Active" },
    { id: "deactive", name: "Deactive" },
  ];

  //   const [amount, setAmount] = useState(event.data.amount);
  //   const [participant, setParticipant] = useState(event.data.participant);

  /* function to add new task to firestore */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userDocRef = doc(db, "users", user.id);
    try {
      await updateDoc(userDocRef, {
        active: statusRadio.active,
        updated: Timestamp.now(),
      });

      onClose();
    } catch (err) {
      alert("Edit user failed: " + err);
    }
  };

  const handleRadioChange = (e) => {
    const name = e.target.name;
    if (name === "active") {
        setStatusRadio({
            active: true,
            deactive: false,
        })
    } else {
        setStatusRadio({
            active: false,
            deactive: true,
        })
    }
  };

  return (
    <EditUserModal
      modalLabel="SỬA THÔNG TIN USER"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="mb-1">
            <label
              htmlFor="amount"
              className="block text-gray-700 font-semibold text-left mb-1"
            >
              STATUS
            </label>
            {statuses &&
              statuses.map((status) => (
                <label key={status.id} className="flex items-center">
                  <input
                    type="radio"
                    name={status.id}
                    checked={statusRadio[status.id]}
                    onChange={handleRadioChange}
                    className="mr-2"
                  />
                  {status.name}
                </label>
              ))}
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition duration-300 ease-in-out"
        >
          SỬA
        </button>
      </form>
    </EditUserModal>
  );
}

export default EditUser;
