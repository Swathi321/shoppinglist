const express = require("express");
const router = express.Router();
const Item = require("../../models/Item");
const auth = require("../middleware/auth");
//get /api/items
//get items
router.get("/", (req, res) => {
  const userEmail = req.params.email;
  //console.log(userEmail);
  Item.find()
    .sort({ date: -1 })
    .then(items => res.json(items));
});

// adding items

router.post("/add", auth, (req, res) => {
  // console.log(req.body);
  const newItem = new Item({
    name: req.body.name,
    userEmail: req.body.email
  });
  newItem.save().then(item => res.json(item));
});

// router.get('/del/:id',(req,res)=>{
//     const id=req.params.id;
//     Item.findByIdAndDelete(id)
//     .then(item=>res.json(item))
// })
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  // console.log(id)

  Item.findById(id).then(item => res.json(item));
});

router.post("/update/:id", (req, res) => {
  const newbody = req.body;
  console.log(newbody);
  const id = req.params.id;
  Item.findById(id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      result.name = req.body.name;
      result.save().then(item => res.json(item));
      console.log(result);
    }
  });
});
// router.post('/update/:id', (req, res) => {
//     const id = req.params.id;
//     const newItem = new Item({
//         name: req.body.name
//     })
//     newItem.save()
//         .then((item) => res.json(item));

// });

router.delete("/:id", auth, (req, res) => {
  const id = req.params.id;
  Item.findById(id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(() => res.status(404).json({ success: false }));
});

module.exports = router;
