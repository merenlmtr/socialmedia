const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//Create Post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Update Post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post Updated successfully!")
        } else {
            res.status(403).json("You do not have permission for this action")
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//Delete Post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Post Deleted successfully!")
        } else {
            res.status(403).json("You do not have permission for this action")
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//Like/Dislike a Post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("Post has been liked!")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("Post has been disliked!")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get Post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Get all users and followings Post(TimeLine)
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendsPost = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPosts.concat(...friendsPost));
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router