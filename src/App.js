import React, { useState, useEffect } from "react";
import FacebookLogin from "react-facebook-login";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

import AddEvent from "./components/AddEvent";
import Event from "./components/Event";
import "./App.css";

const FACEBOOK_ID = process.env.REACT_APP_FACEBOOK_ID;

function App() {
  const [fbLogin, setFBLogin] = useState(false);
  const [fbData, setDataFB] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [events, setEvents] = useState([]);
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
    handleUpdate(cardData);
    console.log("OK button clicked with card data:", cardData);
  };

  const handleCancelClick = (cardData) => {
    handleUpdate(cardData);
  };

  const handleUpdate = async (cardData) => {
    const eventDocRef = doc(db, "events", cardData.id);
    try {
      await updateDoc(eventDocRef, {
        members: cardData.members,
      });
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    const taskColRef = query(
      collection(db, "events"),
      orderBy("created", "desc")
    );
    onSnapshot(taskColRef, (snapshot) => {
      setEvents(
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
        <button
          onClick={() => setOpenAddModal(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition duration-300 ease-in-out w-30"
        >
          Thêm sân +
        </button>
      </div>
      {openAddModal && (
        <AddEvent
          onClose={() => setOpenAddModal(false)}
          open={openAddModal}
          facebookData={facebookData}
        />
      )}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {events.map((event) => (
            <Event
              id={event.id}
              key={event.id}
              time={event.data.title}
              description={event.data.description}
              amount={event.data.amount}
              members={event.data.members}
              onOkClick={handleOkClick}
              onCancelClick={handleCancelClick}
              facebookData={fbData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
