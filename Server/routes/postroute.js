const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post')

router.post("/createpost", requireLogin, (req, res) => {
    const { title, body, photo } = req.body;
    // if (!body||!photo) {
    //     res.status(420).json({ error: "Please fill all fields" })
    // }
    //console.log(req.user);

    const post = new Post({
        body,
        photo,
        postedby: req.user
    })

    post.save().then(result => {
        res.json({ message: result })
    }).catch(err => {
        console.log(err);
    })
})

router.get("/allpost", requireLogin, (req, res) => {
    Post.find()
        .populate("postedby", "_id name")
        .populate("comments.postedby", "_id name")
        .then(posts => {
            res.json(posts)
        }).catch(err => {
            console.log(err);
        })
})

router.get("/allsubpost", requireLogin, (req, res) => {
    Post.find({ postedby: { $in: req.user.following } })//if posted by in following
        .populate("postedby", "_id name")
        .populate("comments.postedby", "_id name")
        .then(posts => {
            res.json(posts)
        }).catch(err => {
            console.log(err);
        })
})

router.get("/mypost", requireLogin, (req, res) => {
    Post.find({ postedby: req.user._id })
        .populate("postedby", "_id name")
        .populate("comments.postedby", "_id name")
        .then(mypost => {
            res.json(mypost)
        }).catch(err => {
            console.log(err);
        })

})

router.put("/like", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true// add new data to array
    }).populate("postedby", "_id name")
        .populate("comments.postedby", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status().json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.put("/unlike", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true// add new data to array
    })
        .populate("postedby", "_id name")
        .populate("comments.postedby", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status().json({ error: err })
            } else {
                res.json(result)
            }
        })
})
router.put("/deletecomment", requireLogin, (req, res) => {

    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { comments: { _id: req.body.cid } }
    }, {
        new: true// add new data to array
    })
        .populate("postedby", "_id name")

        .exec((err, result) => {
            if (err) {
                return res.status().json({ error: err })
            } else {
                res.json(result)
            }
        })
})
router.put("/deleteallcomment", requireLogin, (req, res) => {
    console.log();
    Post.findByIdAndUpdate(req.body.postId, {
        $set: { comments: [] }
    }, {
        new: true// add new data to array
    })
        .exec((err, result) => {
            if (err) {
                return res.status().json({ error: err })
            } else {
                res.json(result)

            }
        })
})
router.put("/comment", requireLogin, (req, res) => {
    const comment = {
        Text: req.body.text,
        postedby: req.user
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true// add new data to array
    })
        .populate("postedby", "_id name")
        .populate("comments.postedby", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status().json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.delete("/deletepost/:id", requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .populate("postedby", "_id")
        .exec((err, post) => {

            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedby._id.toString() === req.user._id.toString()) {

                post.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err);
                    })
            }
            console.log("can not delete");
        })
})

router.delete("/deleteallpost", requireLogin, (req, res) => {
    Post.deleteMany({ postedby: req.user._id })
        .then(function () {
            console.log("Data deleted");
             res.json("deleted")
        }).catch(function (error) {
            console.log(error);
        })
})

module.exports = router;