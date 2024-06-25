import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dashboard_Loginned from "../components/Dashboard_Loginned";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const HomePageLoggedin = () => {
  const [user, setUser] = useState(null);
  const [inputUrl, setInputUrl] = useState(""); // State to hold input URL

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${BACKEND_URL}/authenticate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        console.log(err);
        window.location.href = "/login";
      }
    };
    authenticateUser();
  }, []);

  // Event handler for Shorten Now button click
  const handleShortenNow = async () => {
    if (
      user.Links.oldLink !== null &&
      user.Links.oldLink.length >= 100 &&
      (user.subscription === "Free" ||
        user.subscription === null ||
        new Date(user.endDateOfSubscription) < new Date())
    ) {
      alert("You have reached the maximum limit of 100 shortened links.");
      window.location.href = "/loggedin/" + user._id + "/subscription";
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");

      const response = await axios.patch(
        `${BACKEND_URL}/loggedin/${user._id}/redirect`,
        { oldLink: inputUrl }, // Send input URL in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Link shortened successfully!");
      setInputUrl(""); // Clear the input field after successful shortening
    } catch (err) {
      console.error(err);
      alert("Failed to shorten link. Please try again.");
    }
  };

  return (
    <div className="home-container">
      <div className="home-item-box">
        {user ? (
          <>
            <h2>Welcome, {user.username}!</h2>
            <h1>Shorten Your Loooong Links :)</h1>
          </>
        ) : (
          <h1>Loading...</h1>
        )}
        <p style={{ marginTop: "25px" }}>
          Linkly is an efficient and easy-to-use URL shortening service that
          streamlines your online experience.
        </p>
        <div className="wrapper">
          <input
            type="text"
            placeholder="Your URL here"
            value={inputUrl} // Bind input value to state
            onChange={(e) => setInputUrl(e.target.value)} // Update inputUrl state on change
          />
          <button
            type="submit"
            className="abs-submit"
            onClick={handleShortenNow}
          >
            Shorten Now!
          </button>
        </div>
        {user &&
          (user.subscription === "Free" ||
            user.subscription === null ||
            new Date(user.endDateOfSubscription) < new Date()) && (
            <p>
              You can create{" "}
              <span
                style={{
                  color: "skyblue",
                  fontSize: "1.1rem",
                  fontWeight: "30",
                }}
              >
                {100 - user.Links.oldLink.length}
              </span>{" "}
              more links. <br />
              <Link
                to={`/loggedin/${user._id}/subscription`}
                className="register-link"
              >
                Get Premium
              </Link>{" "}
              to enjoy Unlimited Usage !!!
            </p>
          )}
      </div>
      {user &&
        (user.subscription === "Free" ||
          user.subscription === null ||
          new Date(user.endDateOfSubscription) < new Date()) && (
          <div className="home-premium-box">
            <h2>Want More?</h2>
            <h1>Go Premium!</h1>
            <div className="button-container">
              <button
                className="create-free"
                onClick={() =>
                  (window.location.href = `/loggedin/${user._id}/subscription`)
                }
              >
                Go Premium
              </button>
            </div>
          </div>
        )}
      <Dashboard_Loginned />
    </div>
  );
};

export default HomePageLoggedin;
