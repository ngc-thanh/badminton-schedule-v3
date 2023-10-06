import EditEventModal from "./EditEventModal";
import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

function EditEvent({ onClose, open, event }) {
  const [amount, setAmount] = useState(event.data.amount);
  const [participant, setParticipant] = useState(event.data.participant);

  /* function to add new task to firestore */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventDocRef = doc(db, "events", event.id);
    try {
      await updateDoc(eventDocRef, {
        amount: amount,
        participant: participant,
        updated: Timestamp.now(),
      });

      onClose();
    } catch (err) {
      alert("Edit event failed: " + err);
    }
  };

  return (
    <EditEventModal modalLabel="SỬA THÔNG TIN SÂN" onClose={onClose} open={open}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="mb-1">
            <label
              htmlFor="amount"
              className="block text-gray-700 font-semibold text-left mb-1"
            >
              Số sân
            </label>
            <input
              id="amount"
              required
              type="number"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              placeholder="3"
              value={amount}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none h-12"
            ></input>
          </div>
          <div className="mb-1">
            <label
              htmlFor="participant"
              className="block text-gray-700 font-semibold text-left mb-1"
            >
              Giới hạn số người
            </label>
            <input
              id="participant"
              required
              type="number"
              onChange={(e) => setParticipant(e.target.value)}
              placeholder="16"
              value={participant}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none h-12"
            ></input>
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition duration-300 ease-in-out"
        >
          SỬA
        </button>
      </form>
    </EditEventModal>
  );
}

export default EditEvent;
