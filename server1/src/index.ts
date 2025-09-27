import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./router/routes";

dotenv.config();

const app = express();
const PORT = process.env["PORT"] || 3001;

// 1. Session setup
app.use(
  session({
    secret: process.env["SESSION_SECRET"] || "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(cookieParser());

// 2. Passport initialize
app.use(passport.initialize());
app.use(passport.session());
app.use("/", router);

// 3. Google OAuth Strategy

// 4. Passport serialization
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

// 5. Routes
app.get("/", (_req, res) => {
  res.send("hello from dyzora server1");
});

app.listen(PORT, () => {
  console.log(`⚡ Server is running on http://localhost:${PORT}`);
});
