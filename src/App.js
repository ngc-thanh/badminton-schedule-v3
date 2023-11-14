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
import EditUser from "./components/EditUser";
import AddEvent from "./components/AddEvent";
import Event from "./components/Event";
import EventCard from "./components/EventCard";
import UserCard from "./components/UserCard";
import EventTable from "./components/EventTable";
import User from "./components/User";
import UnlockModal from "./components/UnlockModal";
import "./App.css";

function App() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editEvent, setEditEvent] = useState({});
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUnlockModal, setOpenUnlockModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookingDetails, setBookingDetails] = useState([]);

  const handleOkClick = (cardData) => {
    checkRecordExists("users", "ipAddress", localStorage.getItem("NS_KWGC"))
      .then((exists) => {
        if (!exists) {
          createUser(cardData.name);
        }
      })
      .catch((error) => {
        alert("checkRecordExists Error:", error);
      });

    handleUpdateEvent(cardData);
    handleUpdateUser(1, 0, isWithin4Days(cardData.time) ? 0 : 1);
    createBookingDetail(true, cardData.title, cardData.id, cardData.name);
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
        if (!exists) {
          createUser(cardData.removeName);
        }
      })
      .catch((error) => {
        alert("checkRecordExists Error:", error);
      });

    handleUpdateEvent(cardData);
    handleUpdateUser(0, 1, isWithin4Days(cardData.time) ? 0 : 1);
    createBookingDetail(false, cardData.title, cardData.id, cardData.removeName);
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

  const handleEditUserClick = (data) => {
    setOpenEditUserModal(true);
    setEditUser(data);
  };

  const handleUpdateUser = async (ok, cancel, delay) => {
    const fieldNameToQuery = "ipAddress";

    const q = query(
      collection(db, "users"),
      where(fieldNameToQuery, "==", localStorage.getItem("NS_KWGC")),
      where("active", "==", true),
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
              alert("Error updating document:", error);
            });
        });
      })
      .catch((error) => {
        alert("Error querying Firestore:", error);
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

  const createBookingDetail = async (ok, title, eventId, name) => {
    try {
      await addDoc(collection(db, "booking_details"), {
        type: ok ? "OK" : "CANCEL",
        title: title,
        ipAddress: localStorage.getItem("NS_KWGC"),
        eventId: eventId,
        name: name,
        created: Timestamp.now(),
        updated: Timestamp.now(),
      });
    } catch (err) {
      alert("createBookingDetail error: " + err);
    }
  };

  const createUser = async (newMember) => {
    try {
      await addDoc(collection(db, "users"), {
        ipAddress: localStorage.getItem("NS_KWGC"),
        name: newMember,
        ok: 0,
        cancel: 0,
        delay: 0,
        point: 0,
        active: true,
        created: Timestamp.now(),
        updated: Timestamp.now(),
      });
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
      where("active", "==", true),
      limit(1)
    );

    // Return a promise that resolves to true if the record exists, false otherwise
    return getDocs(q)
      .then((querySnapshot) => !querySnapshot.empty)
      .catch((error) => {
        alert("Error checkRecordExists: ", error);
        return false; // Return false in case of an error
      });
  };

  const googleMaps = {
    "戸田スポーツセンター": "https://maps.app.goo.gl/gLnQ2cNd6dMsWBJW9",
    "西スポーツセンター": "https://maps.app.goo.gl/EgsquvSXjHhQqiEa8",
    "体育武道センター": "https://maps.app.goo.gl/Gba8wyF9FUMftkHZ7",
    "戸塚スポーツセンター": "https://maps.app.goo.gl/KGdkLbNwQP6kH5Dp9",
    "北スポーツセンター": "https://maps.app.goo.gl/fHzGe57Byc5RVqpU9",
    "芝スポーツセンター": "https://maps.app.goo.gl/f6t3UEiKs6FVm7ZZ9",
    "東スポーツセンター": "https://maps.app.goo.gl/zEbJjoUi2nJ7tfSM9",
    "安行スポーツセンター": "https://maps.app.goo.gl/yruzsYEVJzjw5j2e9",
    "鳩ヶ谷スポーツセンター": "https://maps.app.goo.gl/XLTH1qyLJMoAMjvf9",
  }

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
          // const addr = _doc.data().description;
          // newValue = googleMaps[addr];
          const ip = _doc.data().ipAddress;
          // console.log(obj[ip]);
          // newValue = getFirstUser(ip);
          // console.log(newValue);

          // const getFirstUser = (ipAddress) => {
            const fieldNameToQuery = "ipAddress";
        
            const q = query(
              collection(db, "users"),
              where(fieldNameToQuery, "==", ip),
              where("active", "==", true),
              limit(1)
            );
        
            getDocs(q)
              .then((_querySnapshot) => {
                _querySnapshot.forEach((__doc) => {
                  const data = __doc.data();
                  newValue = data.name;
                  console.log(newValue);
                  // console.log(data.name);
                  // return data.name;
                  // obj[data.ipAddress] = data.name;
                            updateDoc(docRef, {
                          [newField]: newValue,
                          //   // updated: Timestamp.now(),
                          });
                });
              })
              .catch((error) => {
                alert("Error querying Firestore:", error);
              });
          // }
        });
      })
      .then(() => {
        console.log("Added the new field to all documents in the collection.");
      })
      .catch((error) => {
        alert("Error adding the new field: ", error);
      });
  };

  const updateData = async (_collection) => {
    try {
      const collectionRef = collection(db, _collection); // Replace with your collection name
      const querySnapshot = await getDocs(collectionRef);

      const batch = [];
      querySnapshot.forEach((_doc) => {
        // const acc = _doc.data().account;
        // const desc = _doc.data().description;
        // const newValue = desc.split(" ")[0];
        const ip = _doc.data().ipAddress;
        // const newValue = getFirstUser(ip);
        // console.log(newValue);

        // const oldValue = _doc.data().time.toDate(); // Replace with your field name
        // const parsedDate = new Date(oldValue);
        // parsedDate.setDate(parsedDate.getDate() - 4);
        // const newValue = parsedDate;

        const docRef = doc(db, _collection, _doc.id); // Replace with your collection name
        batch.push(updateDoc(docRef, { userName: 'Thanh' })); // Replace with your field name
      });

      console.log(batch);

      // await Promise.all(batch);

      console.log("All documents updated successfully.");
    } catch (error) {
      alert(`Error updating documents: ${error.message}`);
    }
  };

  useEffect(() => {
    // addNewFieldToExistDocument('booking_details', 'userName', '');
    // updateData('booking_details');

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
      orderBy("updated", "desc")
    );
    onSnapshot(userColRef, (snapshot) => {
      const data = [];
      snapshot.docs.map((_doc) => {
        data.push({
          id: _doc.id,
          data: _doc.data(),
        });
      });

      setUsers(data);
    });

    const bookingDetailsColRef = query(
      collection(db, "booking_details"),
      orderBy("updated", "desc"),
      limit(9),
    );
    onSnapshot(bookingDetailsColRef, (snapshot) => {
      const data = [];
      snapshot.docs.map((_doc) => {
        data.push({
          id: _doc.id,
          data: _doc.data(),
        });
      });

      setBookingDetails(data);
    });

    fetch("https://api.db-ip.com/v2/free/self")
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("NS_KWGC", data.ipAddress);
        setIsAdmin(data.ipAddress === process.env.REACT_APP_IPV4_ADDRESS);
      });
  }, []);

  // console.log(bookingDetails);

  return (
    // <
    // <div className="App">
      <div className="flex flex-col items-center justify-center mt-10 text-2xl">
        <h1>QUÁN TẠM ĐÓNG CỬA, MIỄN TIẾP KHÁCH</h1>
        <h1>HẸN QUÝ KHÁCH VÀO NGÀY MAI</h1>
        <h1>FirebaseError: Quota exceeded</h1>
      </div>
    // </div>
  );
}

export default App;
