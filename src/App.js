import React, { useState, useEffect } from "react";
import FacebookLogin from "react-facebook-login";

import "./App.css";

const FACEBOOK_ID = process.env.REACT_APP_FACEBOOK_ID;

function App() {
  const [fbLogin, setFBLogin] = useState(false);
  const [fbData, setDataFB] = useState({});

  const responseFacebook = (response) => {
    setDataFB(response);
    if (response.accessToken) {
      setFBLogin(true);
    } else {
      setFBLogin(false);
    }
  };

  return (
    <div className="App">
      {!fbLogin && (
        <FacebookLogin
          appId={FACEBOOK_ID}
          autoLoad={true}
          fields="name,email,picture"
          scope="public_profile,user_friends"
          callback={responseFacebook}
          icon="fa-facebook"
          className="my-2"
        />
      )}

      {fbLogin && (
        <div className="my-2">
          <h1 className="text-3xl font-semibold text-center mt-2">
            Hello, {fbData.name}
          </h1>
        </div>
      )}
    </div>
  );
}

export default App;
