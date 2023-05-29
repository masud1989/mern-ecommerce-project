const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');


exports.createBlog = asyncHandler( async (req, res) => {
    try {
        const  postBody = req.body;
        const newBlog = await Blog.create(postBody)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
});

exports.updateBlog = asyncHandler( async (req, res) => {
    const id = req.params.id;
    const postBody = req.body;
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id,postBody)
        res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
});

exports.getBlog = asyncHandler( async (req, res) => {
    const id = req.params.id;
    try {
        const getBlog = await Blog.findById(id)
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {$inc: {numViews: 1}}
        )
        res.json(updateViews)
    } catch (error) {
        throw new Error(error)
    }
});

exports.getAllBlogs = asyncHandler( async (req, res) => {
    try {
        const allBlogs = await Blog.find()
        res.json({total:allBlogs.length, data:allBlogs})
    } catch (error) {
        throw new Error(error)
    }
});

exports.deleteBlog = asyncHandler( async (req, res) => {
    const id = req.params.id;
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id)
        res.json(deletedBlog)
    } catch (error) {
        throw new Error(error)
    }
});

exports.likeBlog = asyncHandler( async (req, res) => {
    // console.log(req.body)
    const {blogId} = req.body;
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.disLikes?.find(
        (userId => userId.toString() === loginUserId?.toString())
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
          blogId,
          {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
          },
          { new: true }
        );
        res.json(blog);
      }
      if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
          blogId,
          {
            $pull: { likes: loginUserId },
            isLiked: false,
          },
          { new: true }
        );
        res.json(blog);
      } else {
        const blog = await Blog.findByIdAndUpdate(
          blogId,
          {
            $push: { likes: loginUserId },
            isLiked: true,
          },
          { new: true }
        );
        res.json(blog);
      }


});
exports.disLikeBlog = asyncHandler( async (req, res) => {
    // console.log(req.body)
    const { blogId } = req.body;
  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isDisLiked = blog?.isDisliked;
  // find if the user has disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }


});