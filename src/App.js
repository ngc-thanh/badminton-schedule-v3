import React, { useState, useEffect } from "react";
import FacebookLogin from "react-facebook-login";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

import AddEvent from "./components/AddEvent";
import Event from "./components/Event";
import User from "./components/User";
import "./App.css";

const FACEBOOK_ID = process.env.REACT_APP_FACEBOOK_ID;
const FACEBOOK_ADMIN_ID = process.env.REACT_APP_FACEBOOK_ADMIN_ID;

function App() {
  const [fbLogin, setFBLogin] = useState(false);
  const [fbData, setDataFB] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const responseFacebook = (response) => {
    setDataFB(response);
    if (response.accessToken) {
      setFBLogin(true);
    } else {
      setFBLogin(false);
    }
  };

  const handleOkClick = (cardData) => {
    // Handle the OK button click event with card data
    // console.log(cardData);
    // updateData(cardData);
    if (users.length === 0) {
      createUser(fbData);
    } else {
      let isNewUser = false;

      for (let i = 0; i < users.length; i++) {
        if (users[i].includes(fbData.id)) {
          break;
        }

        isNewUser = true;
      }

      if (isNewUser) {
        createUser();
      }
    }

    handleUpdate(cardData);
    console.log("OK button clicked with card data:", cardData);
  };

  const handleCancelClick = (cardData) => {
    handleUpdate(cardData);
  };

  const handleDoneClick = (cardData) => {
    console.log("hadnle done app");
    console.log(cardData);
    handleUpdate(cardData);
  };

  const handleUpdate = async (cardData) => {
    const eventDocRef = doc(db, "events", cardData.id);
    try {
      await updateDoc(eventDocRef, {
        completed: cardData.completed,
        members: cardData.members,
      });
    } catch (err) {
      alert(err);
    }
  };

  const isAdmin = fbData.id === FACEBOOK_ADMIN_ID;
  const createUser = async (fbData) => {
    try {
      const newUser = await addDoc(collection(db, "users"), {
        fbId: fbData.id,
        name: fbData.name,
        point: 0,
        active: true,
        created: Timestamp.now(),
      });
      console.log(newUser);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    const eventColRef = query(
      collection(db, "events"),
      orderBy("created", "desc")
    );
    onSnapshot(eventColRef, (snapshot) => {
      setEvents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    const userColRef = query(
      collection(db, "users"),
      orderBy("created", "desc")
    );
    onSnapshot(userColRef, (snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className="App">
      <div className="flex flex-col justify-center items-center">
        {!fbLogin && (
          <div className="my-5">
            <FacebookLogin
              appId={FACEBOOK_ID}
              autoLoad={true}
              fields="name,email,picture"
              scope="public_profile,user_friends"
              callback={responseFacebook}
              icon="fa-facebook"
            />
          </div>
        )}

        {fbLogin && (
          <div className="my-2">
            <h1 className="text-3xl font-semibold text-center mt-2">
              Hello, {fbData.name}
            </h1>
          </div>
        )}
        {isAdmin && (
          <button
            onClick={() => setOpenAddModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition duration-300 ease-in-out w-30"
          >
            Thêm sân +
          </button>
        )}
      </div>
      {openAddModal && (
        <AddEvent
          onClose={() => setOpenAddModal(false)}
          open={openAddModal}
          fbData={fbData}
        />
      )}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {events.map(
            (event) =>
              !event.data.completed && (
                <Event
                  id={event.id}
                  key={event.id}
                  time={event.data.title}
                  description={event.data.description}
                  amount={event.data.amount}
                  members={event.data.members}
                  onOkClick={handleOkClick}
                  onCancelClick={handleCancelClick}
                  onDoneClick={handleDoneClick}
                  fbData={fbData}
                  isAdmin={isAdmin}
                />
              )
          )}
        </div>
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
