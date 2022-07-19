var express = require("express");
var router = express.Router();
const { blogsDB } = require("../mongo");
const { serverCheckBlogIsValid } = require("../util/validation");

router.get("/hello-blogs", function (req, res, next) {
  res.json({ message: "hello from express" });
});

router.get("/all-blogs", async function (req, res, next) {
  const limit = Number(req.query.limit);
  const skip = Number(req.query.limit) * (Number(req.query.page)- 1);
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1;
  const filterField = req.query.filterField;
  const filterValue = req.query.filterValue;
console.log(req.query);
  try {
    const collection = await blogsDB().collection("post");
    let filterObj = {};
    if (filterField && filterValue) {
      filterObj = { [filterField]: filterValue };
    }
    let sortObj = {};
    if (sortField && sortOrder) {
      sortObj = { [sortField]: sortOrder };
    }

    const allBlogs = await collection
      .find(filterObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();
    res.json(allBlogs);
  } catch (e) {
    console.error("error with all blogs back end"+e);
  }
});

router.get("/single-blog/:blogId", async (req, res) => {
    try {
        const blogId = Number(req.params.blogId);
        const collection = await blogsDB().collection("post")
        const blogPost = await collection.findOne({ id: blogId })
        res.status(200).json({ message: blogPost, success: true })

    } catch (error) {
        res.status(500).send({ message: "Error getting post.", success: false })
    }
})

router.post("/blog-submit", async (req, res) => {
    try {
      const blogIsValid = serverCheckBlogIsValid(req.body);
  
      console.log(blogIsValid);
  
      if (!blogIsValid) {
        res.status(400).json({
          message:
            "To submit a blog you must include Title, Author, Category, and Text.",
          success: false,
        });
        return;
      }
  
      const collection = await blogsDB().collection("post");
      const sortedBlogArr = await collection.find({}).sort({ id: 1 }).toArray();
      const lastBlog = sortedBlogArr[sortedBlogArr.length - 1];
      const title = req.body.title;
      const text = req.body.text;
      const author = req.body.author;
      const category = req.body.category;
;
      const blogPost = {
        
        title: title,
        text: text,
        author: author,
        category: category,
        createdAt: new Date(),
        lastModified: new Date(),
        id: Number(lastBlog.id + 1),
      };
      await collection.insertOne(blogPost);
      res.status(200).json({ message: "Successfully Posted", success: true });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error posting blog." + error, success: false });
    }
  });
  
  module.exports = router;


