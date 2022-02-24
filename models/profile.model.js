const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const Profile = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    DOB: String,
    about: String,
    img: {
      type: String,
      default: "",
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Profile", Profile);