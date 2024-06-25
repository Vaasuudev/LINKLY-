import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { BACKEND_URL } from "../constants";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirect_login = () => {
    window.location.href = "/login";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const resp = await axios.post(`${BACKEND_URL}/register`, {
        username,
        email,
        password,
      },
        { withCredentials: true }
      );

      if (resp.status === 201) {
        alert("Successfully Signed Up! Please Sign In to Enjoy the Services!!");
        window.location.href = "/login";
      }
    } catch (err) {
      alert("Error signing up", err);
      console.log(err);
    }
  };

  const responseGoogle = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);
      const { email, name } = decoded;

      try {
        const registerResp = await axios.post(`${BACKEND_URL}/register`, {
          email,
          username: name,
          password: "abcd", // Consider using a more secure approach for passwords
        },
          { withCredentials: true }
        );

        if (registerResp.status === 201) {
          alert("Successfully Signed Up! Please Sign In to Enjoy the Services!!");
          window.location.href = "/login";
        }
      } catch (registerErr) {
        alert("Error sign up with Google", registerErr);
        console.log(registerErr);
      }
    } catch (decodeErr) {
      console.error("JWT decode error:", decodeErr);
    }
  };

  return (
    <Container className="signup-box">
      <h1>Sign Up</h1>
      <GoogleOAuthProvider clientId="452039880540-839i29lt3kh4for9f2jidk9hns0fkp3v.apps.googleusercontent.com">
        <div className="google-loginbox">
          <GoogleLogin
            onSuccess={responseGoogle}
            buttonText="Signup with Google"
            onError={(err) => {
              if (err.error === "popup_closed_by_user") {
                alert("Popup closed by user before completing login.");
              } else if (err.error === "idpiframe_initialization_failed") {
                alert("Initialization failed. Please check your Client ID and authorized origins.");
              } else {
                console.error("Google login error:", err);
              }
            }}
          />
        </div>
      </GoogleOAuthProvider>
      <div className="login-form">
        <Form onSubmit={handleSignUp}>
          <Form.Group controlId="formBasicName">
            <Form.Control
              className="username"
              placeholder="Enter User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              className="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Control
              className="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button className="signup-button" type="submit" variant="primary">
            SignUp
          </Button>
        </Form>
      </div>
      <div className="noaccount">
        <p>
          Already have an account?{" "}
          <span className="gotosignup" onClick={redirect_login}>
            Sign In
          </span>
        </p>
      </div>
    </Container>
  );
};

export default SignUp;
