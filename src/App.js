import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  where,
  getDocs,
  updateDoc,
  addDoc,
  Timestamp,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

import EditEvent from "./components/EditEvent";
import AddEvent from "./components/AddEvent";
import Event from "./components/Event";
import EventTable from "./components/EventTable";
import User from "./components/User";
import UnlockModal from "./components/UnlockModal";
import "./App.css";

function App() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editEvent, setEditEvent] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUnlockModal, setOpenUnlockModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentIp, setCurrentIp] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const handleOkClick = (cardData) => {
    checkRecordExists("users", "ipAddress", localStorage.getItem("NS_KWGC"))
      .then((exists) => {
        setIsNewUser(exists);
      })
      .catch((error) => {
        console.error("checkRecordExists Error:", error);
      });

    if (!isNewUser) {
      createUser(cardData.name);
      setIsNewUser(false);
    }

    handleUpdateEvent(cardData);
    handleUpdateUser(1, 0, isWithin4Days(cardData.time) ? 0 : 1);
    createBookingDetail(true, cardData.title, cardData.id);
  };

  const isWithin4Days = (timestampField) => {
    if (!timestampField) {
      return false;
    }

    const currentTime = new Date();
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    return currentTime < timestampField && timestampField > fourDaysAgo;
  };

  const handleCancelClick = (cardData) => {
    checkRecordExists("users", "ipAddress", localStorage.getItem("NS_KWGC"))
      .then((exists) => {
        setIsNewUser(exists);
      })
      .catch((error) => {
        console.error("checkRecordExists Error:", error);
      });
    if (!isNewUser) {
      createUser(cardData.removeName);
      setIsNewUser(false);
    }

    handleUpdateEvent(cardData);
    handleUpdateUser(0, 1, isWithin4Days(cardData.time) ? 0 : 1);
    createBookingDetail(false, cardData.title, cardData.id);
  };

  const handleDoneClick = (cardData) => {
    handleUpdateEvent(cardData);
  };

  const handleUnlockClick = (password) => {
    if (password === process.env.REACT_APP_PASSWORD) {
      setOpenUnlockModal(false);
      setIsAdmin(true);
    }
  };

  const handleEditEventClick = (data) => {
    setOpenEditModal(true);
    setEditEvent(data);
  };

  const handleUpdateUser = async (ok, cancel, delay) => {
    const fieldNameToQuery = "ipAddress";

    const q = query(
      collection(db, "users"),
      where(fieldNameToQuery, "==", currentIp),
      limit(1)
    );

    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((_doc) => {
          const data = _doc.data();
          const docRef = doc(db, "users", _doc.id);
          updateDoc(docRef, {
            ok: data.ok + ok,
            cancel: data.cancel + cancel,
            delay: data.delay + delay,
            updated: Timestamp.now(),
          })
            .then(() => {
              console.log("Document updated successfully.");
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error querying Firestore:", error);
      });
  };
  const handleUpdateEvent = async (cardData) => {
    const eventDocRef = doc(db, "events", cardData.id);
    try {
      await updateDoc(eventDocRef, {
        completed: cardData.completed,
        members: cardData.members,
        updated: Timestamp.now(),
      });
    } catch (err) {
      alert("handleUpdateEvent error: " + err);
    }
  };

  const createBookingDetail = async (ok, title, eventId) => {
    try {
      await addDoc(collection(db, "booking_details"), {
        type: ok ? "OK" : "CANCEL",
        title: title,
        ipAddress: currentIp,
        eventId: eventId,
        created: Timestamp.now(),
        updated: Timestamp.now(),
      });
    } catch (err) {
      alert("createBookingDetail error: " + err);
    }
  };

  const createUser = async (newMember) => {
    try {
      const createNewUser = await addDoc(collection(db, "users"), {
        ipAddress: currentIp,
        name: newMember,
        ok: 0,
        cancel: 0,
        delay: 0,
        point: 0,
        active: true,
        created: Timestamp.now(),
        updated: Timestamp.now(),
      });
      console.log(createNewUser);
    } catch (err) {
      alert("createUser error: " + err);
    }
  };

  const checkRecordExists = (
    collectionName,
    fieldNameToCheck,
    valueToCheck
  ) => {
    const q = query(
      collection(db, collectionName),
      where(fieldNameToCheck, "==", valueToCheck),
      limit(1)
    );

    // Return a promise that resolves to true if the record exists, false otherwise
    return getDocs(q)
      .then((querySnapshot) => !querySnapshot.empty)
      .catch((error) => {
        console.error("Error checkRecordExists: ", error);
        return false; // Return false in case of an error
      });
  };

  const addNewFieldToExistDocument = (updateCollection, newField, newValue) => {
    const collectionName = updateCollection;

    // Reference the collection
    const collectionRef = collection(db, collectionName);

    // Use a query to fetch all documents in the collection
    const q = query(collectionRef);

    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((_doc) => {
          // Use the update method to add the new field to each document
          const docRef = doc(db, collectionName, _doc.id);
          updateDoc(docRef, {
            [newField]: newValue,
          });
        });
      })
      .then(() => {
        console.log("Added the new field to all documents in the collection.");
      })
      .catch((error) => {
        console.error("Error adding the new field: ", error);
      });
  };

  const updateData = async (_collection) => {
    try {
      const collectionRef = collection(db, _collection); // Replace with your collection name
      const querySnapshot = await getDocs(collectionRef);

      const batch = [];
      querySnapshot.forEach((_doc) => {
        const acc = _doc.data().account;
        const desc = _doc.data().description;
        const newValue = `${desc} (${acc})`;

        // const oldValue = _doc.data().time.toDate(); // Replace with your field name
        // const parsedDate = new Date(oldValue);
        // parsedDate.setDate(parsedDate.getDate() - 4);
        // const newValue = parsedDate;

        const docRef = doc(db, _collection, _doc.id); // Replace with your collection name
        batch.push(updateDoc(docRef, { description: newValue })); // Replace with your field name
      });

      await Promise.all(batch);

      console.log("All documents updated successfully.");
    } catch (error) {
      console.log(`Error updating documents: ${error.message}`);
    }
  };

  useEffect(() => {
    // addNewFieldToExistDocument('events', 'reservedTime', '');
    // updateData('events');

    const localStorageIpAddress = localStorage.getItem("NS_KWGC");
    const eventColRef = query(
      collection(db, "events"),
      orderBy("reservedDate")
    );
    onSnapshot(eventColRef, (snapshot) => {
      const data = [];
      snapshot.docs.map((_doc) => {
        data.push({
          id: _doc.id,
          data: _doc.data(),
        });
      });

      data.sort((a, b) => {
        const dateA = a.data.title.split(", ")[1];
        const dateB = b.data.title.split(", ")[1];
        if (dateA === dateB) {
          return a.data.reservedTime.localeCompare(b.data.reservedTime);
        }
      });

      setEvents(data);
    });

    const userColRef = query(
      collection(db, "users"),
      where("active", "==", true),
      orderBy("updated", "desc")
    );

    getDocs(userColRef)
      .then((querySnapshot) => {
        const activeUsers = [];
        querySnapshot.forEach((_doc) => {
          const data = {
            id: _doc.id,
            data: _doc.data(),
          };

          activeUsers.push(data);
        });

        setUsers(activeUsers);
      })
      .catch((error) => {
        console.log("Error getting documents:", error);
      });

    if (localStorageIpAddress) {
      setCurrentIp(localStorageIpAddress);
      setIsAdmin(localStorageIpAddress === process.env.REACT_APP_IPV4_ADDRESS);
    } else {
      fetch("https://api.db-ip.com/v2/free/self")
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("NS_KWGC", data.ipAddress);
          setCurrentIp(data.ipAddress);
          setIsAdmin(data.ipAddress === process.env.REACT_APP_IPV4_ADDRESS);
        });
    }
  }, []);

  return (
    <div className="App">
      <div className="flex flex-col justify-center items-center">
        {isAdmin ? (
          <button
            onClick={() => setOpenAddModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition duration-300 ease-in-out w-30 mt-5"
          >
            Thêm sân +
          </button>
        ) : (
          <button
            onClick={() => setOpenUnlockModal(true)}
            className="px-4 py-2 bg-red-300 hover:bg-red-600 text-white rounded-md font-semibold transition duration-300 ease-in-out w-30 mt-5"
          >
            MỞ KHÓA
          </button>
        )}
      </div>
      {openAddModal && (
        <AddEvent onClose={() => setOpenAddModal(false)} open={openAddModal} />
      )}

      {openUnlockModal && (
        <UnlockModal
          onClose={() => setOpenUnlockModal(false)}
          open={openUnlockModal}
          onUnlock={handleUnlockClick}
        />
      )}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8">
          {events.map((event) => {
            return (
              !event.data.completed && (
                <Event
                  id={event.id}
                  key={event.id}
                  title={event.data.title}
                  description={event.data.description}
                  amount={event.data.amount}
                  members={event.data.members}
                  completed={event.data.completed}
                  note={event.data.note}
                  deadline={event.data.deadline}
                  participant={event.data.participant}
                  onOkClick={handleOkClick}
                  onCancelClick={handleCancelClick}
                  onDoneClick={handleDoneClick}
                  isAdmin={isAdmin}
                />
              )
            );
          })}
        </div>
        {isAdmin && (
          <div className="mt-10">
            {openEditModal && (
              <EditEvent
                onClose={() => setOpenEditModal(false)}
                open={openEditModal}
                event={editEvent}
              />
            )}
            <EventTable events={events} onClickRow={handleEditEventClick} />
          </div>
        )}
        {isAdmin && (
          <div className="mt-10">
            <User users={users} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
