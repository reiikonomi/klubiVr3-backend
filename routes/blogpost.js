const express = require("express");
const router = express.Router();
const BlogPost = require("../models/blogpost.model");
const middleware = require("../middleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + ".jpg");
  },
});

const upload = multer({
  storage: storage,
});

router
  .route("/add/coverImage/:id")
  .patch(middleware.checkToken, upload.single("img"), (req, res) => {
    BlogPost.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          coverImage: req.file.path,
        },
      },
      { new: true },
      (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
      }
    );
  });
router.route("/Add").post(middleware.checkToken, (req, res) => {
  const blogpost = BlogPost({
    username: req.decoded.username,
    title: req.body.title,
    body: req.body.body,
  });
  blogpost
    .save()
    .then((result) => {
      res.json({ data: result["_id"] });
    })
    .catch((err) => {
      console.log(err), res.json({ err: err });
    });
});

router.route("/getOwnBlog").get(middleware.checkToken, (req, res) => {
  BlogPost.find({ username: req.decoded.username }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  }).sort({ createdAt: -1 });
});

router.route("/getOtherBlog").get(middleware.checkToken, (req, res) => {
  BlogPost.find({ username: { $ne: req.decoded.username } }, (err, result) => {
    if (err) return res.json(err);
    return res.json({ data: result });
  }).sort({ createdAt: -1 });
});

router.route("/delete/:id").delete(middleware.checkToken, (req, res) => {
  BlogPost.findOneAndDelete(
    {
      $and: [{ username: req.decoded.username }, { _id: req.params.id }],
    },
    (err, result) => {
      if (err) return res.json(err);
      else if (result) {
        console.log(result);
        return res.json("Blog deleted");
      }
      return res.json("Blog not deleted");
    }
  );
});

// added
router.route("/comment").put(middleware.checkToken, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.decoded.username,
  };
  BlogPost.findByIdAndUpdate(
    req.params.id,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

// router.put('/comment',requireLogin,(req,res)=>{
//   const comment = {
//       text:req.body.text,
//       postedBy:req.user._id
//   }
//   Post.findByIdAndUpdate(req.body.postId,{
//       $push:{comments:comment}
//   },{
//       new:true
//   })
//   .populate("comments.postedBy","_id name")
//   .populate("postedBy","_id name")
//   .exec((err,result)=>{
//       if(err){
//           return res.status(422).json({error:err})
//       }else{
//           res.json(result)
//       }
//   })
// })

// sortRecord = (req, res, next) => {
//   try {
//     BlogPost.find({})
//       .sort({ createdAt: -1 })
//       .exec((err, docs) => {
//         if (err) {
//           responseObj = {
//             status: "error",
//             msg: "Error occured.",
//             body: err,
//           };
//           res.status(500).send(responseObj);
//         } else {
//           responseObj = {
//             status: "success",
//             msg: "Fetch record",
//             body: docs,
//           };
//           res.status(200).send(responseObj);
//         }
//       });
//   } catch (error) {
//     console.log("Error", error);
//   }
// };

module.exports = router;
