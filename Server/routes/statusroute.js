const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Status = mongoose.model('Status')

router.post("/createstatus", requireLogin, (req, res) => {
    const { status } = req.body;
    console.log(status);
    const data = new Status({
        status: status, 
        postedby: req.user
    })
    data.save().then(result => {
        res.json({ message: result })
       // console.log(result);
    }).catch(err => {
        console.log(err);
    })
})
router.get("/allsubstatus", requireLogin, (req, res) => {
    Status.find({$or :[{postedby: { $in: req.user.following} },
    {postedby:req.user._id}]})//if posted by in following
        .populate("postedby", "_id name")
        .then(status => {
            res.json(status)
        }).catch(err => {
            console.log(err);
        })
})

router.delete("/deletestatus/:id", requireLogin, (req, res) => {
    Status.findOne({ _id: req.params.id })
        .populate("postedby", "_id")
        .exec((err, st) => {

            if (err || !st) {
                return res.status(422).json({ error: err })
            }
            if (st.postedby._id.toString() === req.user._id.toString()) {

                st.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err);
                    })
            }
            else{
                console.log("can not delete");

            }
        })
})

module.exports = router;