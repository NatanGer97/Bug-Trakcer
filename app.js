var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");
const eventLogger = require("./middlewares/logEvents");
const verifyJWT = require("./middlewares/auth/verifyJwt");

var app = express();

const mongoURI = "mongodb://127.0.0.1:27017/bug-tracker";
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on("error", () => {
  console.log("error");
});

db.once("open", () => {
  console.log("DB Connected");
});

// cross origin resource sharing
const whiteList = [
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://localhost:3001",
  "https://www.google.com/",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by CORS"));
    }
  },
  credentials:true,
  optionSuccessStatus: 200,
};
// app.use(cors());
app.use(cors(corsOptions));

// custom middleware logger
// app.use(eventLogger);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use("/register", require("./routes/registerRouter"));
app.use("/auth", require("./routes/authRouter"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logoutRout"));
app.use("/roles", require("./routes/RoleRouter"));
app.use(verifyJWT);
app.use("/teams", require("./routes/TeamRouter"));
app.use("/users", usersRouter);

app.all("*", (req, res, next) => {
  res.status(404).send("Page not found");
});

app.use(errorHandler);

module.exports = app;
