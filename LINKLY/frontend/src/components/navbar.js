import React from "react";
import { LuLogIn } from "react-icons/lu";
function Navbar() {
  const redirect_home = () => {
    try {
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };
  const redirect_login = () => {
    try {
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };
  const redirect_register = () => {
    try {
      window.location.href = "/signup";
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="navbar">
      <div
        className="text-wrapper"
        onClick={redirect_home}
        style={{ cursor: "pointer" }}
      >
        Linkly
      </div>
      <div className="navbar-buttons">
        {/* <button className="navbar-button" id="home" onClick={redirect_home}>
          Home
        </button> */}
        <button className="navbar-button" id="login" onClick={redirect_login}>
          Login <LuLogIn />
        </button>
        <button
          className="navbar-button"
          id="register"
          onClick={redirect_register}
        >
          Register Now
        </button>
      </div>
    </div>
  );
}

export default Navbar;
