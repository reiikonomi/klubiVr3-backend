const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const BlogPost = Schema({
  username: String,
  title: String,
  body: String,
  coverImage: {
    type: String,
    default: "",
  },
  like: {
    type: Number,
    default: 0,
  },
  share: {
    type: Number,
    default: 0,
  },
  comment: {
    type: Number,
    default: 0,
  },
  // added 
  comments: [
    {
      text: String,
      postedBy: { type: ObjectId, ref: "Profile" },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BlogPost", BlogPost);
