import AddEventModal from "./AddEventModal";
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function AddEvent({ onClose, open }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState([]);
  const [createdBy, setCreatedBy] = useState("Thanh");
  const [note, setNote] = useState("");

  /* function to add new task to firestore */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), {
        title: title,
        time: Timestamp.fromDate(time),
        description: description,
        amount: amount,
        members: members,
        createdBy: createdBy,
        completed: false,
        note: note,
        created: Timestamp.now(),
      });
      onClose();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <AddEventModal modalLabel="Add Event" onClose={onClose} open={open}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-semibold text-left mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={(e) => setTitle(e.target.value.toUpperCase())}
            value={title}
            placeholder="THỨ 7, 30/9, 19-21H"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="time"
            className="block text-gray-700 font-semibold text-left mb-1"
          >
            Time
          </label>
          <input
            type="text"
            id="time"
            name="time"
            onChange={(e) => setTime(e.target.value)}
            value={time}
            placeholder="2023/09/30"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold text-left mb-1"
          >
            Description
          </label>
          <input
            id="description"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="戸田スポーツセンター"
            value={description}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
          ></input>
        </div>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 font-semibold text-left mb-1"
          >
            Amount
          </label>
          <input
            id="amount"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="2"
            value={amount}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none "
          ></input>
        </div>
        <div className="mb-4">
          <label
            htmlFor="note"
            className="block text-gray-700 font-semibold text-left mb-1"
          >
            Ghi chú
          </label>
          <textarea
            id="note"
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anh em nhớ đăng ký sớm"
            value={note}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none "
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition duration-300 ease-in-out"
        >
          Done
        </button>
      </form>
    </AddEventModal>
  );
}

export default AddEvent;
