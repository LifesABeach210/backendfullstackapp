var express = require("express");
var router = express.Router();
const { blogsDB } = require("../mongo");

router.get("/hello-blogs", function (req, res, next) {
  res.send({ message: "hello from express" });
});

router.get("/all-blogs", async function (req, res, next) {
  const limit = Number(req.query.limit);
  const skip = Number(req.query.limit)(Number(req.query.page) - 1);
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder;
  const filterField = req.query.filterField;
  const filterValue = req.query.filterValue;

  try {
    const collection = await blogsDB().collection("post");
    const allBlogs = await collection.find().toArray();
    res.json(allBlogs);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
