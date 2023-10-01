import AddEventModal from "./AddEventModal";
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function AddEvent({ onClose, open }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [participant, setParticipant] = useState("");
  const [deadline, setDeadline] = useState("");
  const [members, _setMembers] = useState([]);
  const [createdBy, _setCreatedBy] = useState("Thanh");
  const [note, setNote] = useState("");

  /* function to add new task to firestore */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), {
        title: title,
        time: new Date(time),
        description: description,
        amount: amount,
        members: members,
        createdBy: createdBy,
        completed: false,
        note: note,
        participant: participant,
        deadline: deadline,
        created: Timestamp.now(),
      });
      onClose();
    } catch (err) {
      alert("Create event failed: " + err);
    }
  };

  return (
    <AddEventModal modalLabel="Add Event" onClose={onClose} open={open} >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-semibold text-left mb-1"
          >
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={(e) => setTitle(e.target.value.toUpperCase())}
            value={title}
            required
            placeholder="THỨ 7, 2023/09/30, 19-21H"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="time"
            className="block text-gray-700 font-semibold text-left mb-1"
          >
            Thời gian
          </label>
          <input
            type="text"
            id="time"
            name="time"
            required
            onChange={(e) =>
              setTime(e.target.value)
            }
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
            Địa chỉ
          </label>
          <input
            id="description"
            type="text"
            required
            onChange={(e) => {
              setDescription(e.target.value);
              const timeDate = new Date(time);
              timeDate.setDate(timeDate.getDate() - 4);
              const formattedDeadline = `${timeDate.getFullYear()}/${(timeDate.getMonth() + 1)
                .toString()
                .padStart(2, '0')}/${timeDate.getDate().toString().padStart(2, '0')}`;
              setDeadline(formattedDeadline);
              setNote("Anh em nhớ đăng ký sớm trước " + time);
            }}
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
            Số sân
          </label>
          <input
            id="amount"
            required
            type="number"
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="2"
            value={amount}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none "
          ></input>
        </div>
        <div className="mb-4">
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
            onChange={(e) =>
              setParticipant(e.target.value)
            }
            placeholder="2"
            value={participant}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none "
          ></input>
        </div>
        <div className="mb-4">
          <label
            htmlFor="deadline"
            className="block text-gray-700 font-semibold text-left mb-1"
          >
            Hạn hủy sân
          </label>
          <input
            type="text"
            id="deadline"
            required
            name="deadline"
            onChange={(e) => setDeadline(e.target.value)}
            value={deadline}
            placeholder="2023/09/30"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="note"
            className="block text-gray-700 font-semibold text-left mb-1"
          >
            Ghi chú
          </label>
          <input
            id="note"
            type="text"
            required
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anh em nhớ đăng ký sớm trước 2023/09/30"
            value={note}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none "
          ></input>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition duration-300 ease-in-out"
        >
          Done
        </button>
      </form>
    </AddEventModal >
  );
}

export default AddEvent;
