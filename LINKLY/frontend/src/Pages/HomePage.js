import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../components/DashBoard";

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [listUrls, setListUrls] = useState([]);

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem("urls")) || [];
    setListUrls(storedUrls);
  }, []);

  const getUsageCount = () => {
    return parseInt(localStorage.getItem("usageCount")) || 0;
  };

  const incrementUsageCount = () => {
    let count = getUsageCount();
    localStorage.setItem("usageCount", count + 1);
  };

  const handleShortenLink = async () => {
    const count = getUsageCount();
    if (count >= 15) {
      alert("You have reached the maximum limit of 15 shortened links.");
      window.location.href = "/signup";
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("Please enter a valid URL starting with 'http://' or 'https://'.");
      return;
    }

    if (listUrls.some((item) => item.longUrl === url)) {
      alert("This URL is already shortened.");
      return;
    }

    try {
      let random_string;
      let shortUrl;
      do {
        random_string = Math.random().toString(36).substring(2, 7);
        shortUrl = "http://localhost:3000/linkly/" + random_string;
      } while (listUrls.some((item) => item.shortUrl === shortUrl));

      const newUrl = { longUrl: url, shortUrl: shortUrl };

      const updatedUrls = [...listUrls, newUrl];
      localStorage.setItem("urls", JSON.stringify(updatedUrls));
      setListUrls(updatedUrls);
      incrementUsageCount();
      setUrl("");
    } catch (error) {
      console.error("Error shortening the URL", error);
    }
  };

  return (
    <div className="home-container">
      <div className="home-item-box">
        <h1>Shorten Your Loooong Links :)</h1>
        <p style={{ marginTop: "25px" }}>
          Linkly is an efficient and easy-to-use URL shortening service that
          streamlines your online experience.
        </p>
        <div className="wrapper">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Your URL here"
          />

          <button
            type="button"
            className="abs-submit"
            onClick={handleShortenLink}
          >
            Shorten Now!
          </button>
        </div>
        <p>
          You can create{" "}
          <span
            style={{ color: "skyblue", fontSize: "1.1rem", fontWeight: "30" }}
          >
            {15 - getUsageCount()}
          </span>{" "}
          more links. <br />
          <Link to="/signup" className="register-link">
            Register Now
          </Link>{" "}
          {/* <br /> */}
          to create more links and enjoy many more free services !!!
        </p>
      </div>

      <Dashboard urls={listUrls} />

      <p className="home-bottom">
        <Link to="/signup" className="register-link">
          Register Now
        </Link>{" "}
        to create more links and enjoy many more free services !!!
      </p>
    </div>
  );
};

export default HomePage;
