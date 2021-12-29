const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const app = express();
var cors = require("cors");

mongoose.connect(
  process.env.MONGO_URI ||
    "mongodb+srv://rei:pussyhunter69@cluster0.evcnj.mongodb.net/blogs?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDb connected");
});

//middleware
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user", userRoute);
const profileRoute = require("./routes/profile");
app.use("/profile", profileRoute);
const blogRoute = require("./routes/blogpost");
app.use("/blogPost", blogRoute);

data = {
  msg: "Welcome on OnomDev Blog App",
  info: "This is a root endpoint",
  Working: "Documentations of other endpoints will be release soon :)",
  request:
    "Hey if you did'nt subscribed my YouTube channle please subscribe it",
};

app.route("/").get((req, res) => res.json(data));

app.listen(port, () => console.log(`welcome your listinnig at port ${port}`));
