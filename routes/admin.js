var express = require("express");
var router = express.Router();
const { blogsDB } = require("../mongo");
const { serverCheckBlogIsValid } = require("../util/validation");
router.get("/blog-list", async function (req, res, next) {
    try {
        const collection = await blogsDB().collection("post")
        const post = await collection.find({},).project({
            title: 1,
            author: 1,
            createdAt: 1,
            lastModified: 1,
            id: 1
        })
            .toArray();
        res.status(200).json({ message: post, success: true })
    }
    catch (e) {
        res.status(500).json({ message: "Error fetching posts.", success: false })
    }
})



router.put('/edit-blog', async function (req, res) {
    try {
        const updateBlogIsValid = serverCheckBlogIsValid(req.body);
        if (!updateBlogIsValid) {
            res.status(400).json({ message: "Blog update is not valid.", success: false })
        }
        const newPostData = req.body;
        const date = new Date();
        const updateBlog = { ...newPostData, lastModified: date };
        const collection = await blogsDB().collection("post")


        await collection.updateOne({ id: req.body.id }, { $set: { ...updateBlog } });
        res.status(200).json({ message: "Blog updated successfully.", message: true });
        // }

    } catch (error) {
        res.status(500).send("Error updating blog." + error);
    }
});

router.delete("/delete-blog/:blogId", async (req, res) => {
    try {
        const collection = await blogsDB().collection('post');
        const blogId = Number(req.params.blogId);
        const blogToDelete = await collection.deleteOne({ id: blogId });

        if (blogToDelete.deletedCount === 1) {
            res.status(200).json({ message: "Successfully deleted.", message: true });
        } else {
            res.status(204).json({ message: "Delete unsuccessful.", success: false });
        }

    } catch (error) {
        res.status(500).json({ message: "Error" + error, success: false });
    }
})







module.exports = router
