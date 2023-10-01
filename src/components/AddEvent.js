import AddEventModal from "./AddEventModal";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function AddEvent({ onClose, open }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [participant, setParticipant] = useState("");
  const [deadline, setDeadline] = useState("");
  const [members, setMembers] = useState([]);
  const [createdBy, _setCreatedBy] = useState("Thanh");
  const [note, setNote] = useState("");

  // Create state for user checkboxes
  const [userCheckboxes, setUserCheckboxes] = useState({
    member1: true,
    member2: true,
    member3: true,
    member4: true,
    member5: true,
    member6: true,
  });

  // Define an array of users
  const users = [
    { id: 'member1', name: 'Thanh' },
    { id: 'member2', name: 'Thế Anh' },
    { id: 'member3', name: 'Văn Tiến' },
    { id: 'member4', name: 'Hoàng Kool' },
    { id: 'member5', name: 'Phú' },
    { id: 'member6', name: 'Duy' },
  ];

  // Function to handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUserCheckboxes({
      ...userCheckboxes,
      [name]: checked,
    });
  };

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

  const getSelectedMembers = () => {
    const selectedMembers = Object.keys(userCheckboxes)
      .filter((userId) => userCheckboxes[userId])
      .map((userId) => {
        const user = users.find((u) => u.id === userId);
        return user ? user.name : '';
      });

    // Update the members state with the selected members
    setMembers(selectedMembers);
  }

  useEffect(() => {
    getSelectedMembers();
  }, [userCheckboxes]);

  return (
    <AddEventModal modalLabel="THÊM SÂN" onClose={onClose} open={open} >
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
            type="date"
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
              const parsedDate = new Date(time);
              parsedDate.setDate(parsedDate.getDate() - 4);
              const formattedDate = parsedDate.toISOString().split('T')[0];
              setDeadline(formattedDate);
              setNote("Anh em nhớ đăng ký sớm trước " + formattedDate.replace(/-/g, '/') + " nha");
            }}
            placeholder="戸田スポーツセンター"
            value={description}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
          ></input>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        <div className="mb-4">
          <label
            htmlFor="deadline"
            className="block text-gray-700 font-semibold text-left mb-1"
          >
            Hạn hủy sân
          </label>
          <input
            type="date"
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
          <textarea
            id="note"
            type="text"
            required
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anh em nhớ đăng ký sớm trước 2023/09/30"
            value={note}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none "
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold text-left">Thành viên cố định:</label>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {users.map((user) => (
              <label key={user.id} className="flex items-center">
                <input
                  type="checkbox"
                  name={user.id}
                  checked={userCheckboxes[user.id] || false}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {user.name}
              </label>
            ))}

          </div>
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
