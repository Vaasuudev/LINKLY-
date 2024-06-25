import { User } from "../models/User.js";
import { ApiError } from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || username.trim() === "") throw new ApiError(500, "Name is required");
  if (!email || email.trim() === "")
    throw new ApiError(501, "Email is required");
  if (!password || password.trim() === "")
    throw new ApiError(502, "Password is required");
  try {
    const existedUser = await User.findOne({
      email: email,
    });
    if (existedUser) {
      throw new ApiError(409, "Unable to create user, user already exists");
    }
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(503).json({
          error: err
        });
      }
      const user = new User({
        username: username,
        email: email,
        password: hash,
        subscription: "Free",
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "user created"
          });
        })
        .catch(err => {
          console.error("Error saving user:", err);
          res.status(504).json({
            error: err
          });
        });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || email.trim() === "") {
    throw new ApiError(400, "Email is required");
  }
  if (!password || password.trim() === "") {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({
    email: email,
  })
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      throw new ApiError(401, "Invalid credentials");
    }
    if (result) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id
        },
        process.env.JWT_KEY,
      );
      res.cookie('jwtToken', token, {
        sameSite: 'None', httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600*1000*2
      });
      return res.status(200).send({
        message: 'Auth successful',
        token: token,
        user,
      });
    }
    return res.status(401).json({
      message: 'Auth failed'
    });
  });
});

export const authenticateUser = asyncHandler(async (req, res) => {
  try {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decodedToken.userId).populate('subscription')
    res.status(200).json({
      "user": user,
    });
  }
  catch {
    res.status(401).send({
      message: "Some Error Occurred"
    });
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwtToken');
  res.redirect(200, 'http://localhost:3000/');
});