import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import HomePageLoggedin from "./Pages/HomePageLoggedin";
import Subscription from "./Pages/Subscription";
import Navbar from "./components/navbar";
import NavbarLoggedin from "./components/navbarlogin";
import LoginPage from "./Pages/login";
import SignUp from "./Pages/signup";
import Redirect_URL from "./Pages/redirect_url";
import Qrdisplayer from "./Pages/qrdisplayer";
import { BACKEND_URL } from "./constants";

function App() {
  return (
    <>
      <Router>
        <Navbars />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loggedin/:user_id/subscription" element={<Subscription />} />
          <Route path="/loggedin/:user_id" element={<HomePageLoggedin />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/linkly/:shortUrl" element={<Redirect_URL />} />
          <Route path="/linkly/qr/:web_id" element = {<Qrdisplayer />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Router>
    </>
  );
}

function Navbars() {
  const location = useLocation();
  
  // Display NavbarLoggedin only on the loggedin homepage route
  if (location.pathname.startsWith('/loggedin')||location.pathname.startsWith('/linkly')) {
    return <NavbarLoggedin />;
  }

  // Display the default Navbar for all other routes
  return <Navbar />;
}

export default App;
