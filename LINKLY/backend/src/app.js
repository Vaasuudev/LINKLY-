import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();

app.use(bodyParser.json({ limit: '5mb' }));
app.get("/", (req, res) => res.send("Hello"));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

import authenticationRouter from "./routers/authentication.router.js";
import SubscriptionRouter from "./routers/subscription.router.js";
import paymentRouter from "./routers/payment.router.js";
import redirectRouter from "./routers/redirect.router.js"

app.use('/', SubscriptionRouter);
app.use('/', authenticationRouter);
app.use('/', paymentRouter);
app.use('/',redirectRouter);

export default app;
