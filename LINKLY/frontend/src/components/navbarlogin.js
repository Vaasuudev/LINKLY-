import React from "react";
import { LuLogIn } from "react-icons/lu";
import axios from "axios";
import { BACKEND_URL } from "../constants";
// import { Link, Routes } from 'react-router-dom';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function Navbar() {
  const redirect_home = () => {
    try {
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };
  const redirect_logout = async () => {
    try {
      // Get the JWT token from localStorage or wherever you store it
      const token = localStorage.getItem("jwtToken"); // Assuming you stored it in localStorage

      // Make a POST request to the logout endpoint with the JWT token in the headers
      await axios.post(
        `${BACKEND_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Ensure credentials are sent with the request
        }
      );

      // Clear the token from localStorage or wherever you stored it
      localStorage.removeItem("jwtToken");

      // Redirect to a desired location (e.g., home page)
      window.location.href = "/";
    } catch (err) {
      console.error(err);
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
        <button className="navbar-button" id="login" onClick={redirect_logout}>
          Sign Out <LuLogIn />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
