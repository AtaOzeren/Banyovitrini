const Blog = require('../models/blogModel');
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbId");
const { error } = require('server/router');
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs');

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    } catch (erorr) {
        throw new Error(error);
    }
});

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBlog)
    } catch (erorr) {
        throw new Error(error);
    }
});

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes');
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 },
            },
            { new: true })
        res.json(getBlog)
    } catch (erorr) {
        throw new Error(error);
    }
});
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs)
    } catch (erorr) {
        throw new Error(error);
    }
});
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog)
    } catch (erorr) {
        throw new Error(error);
    }
});

const liketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    //Find the blog which you want to be Liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    //Find if the user liked the blog  
    const isLiked = blog?.isLiked;
    //Find if the user disliked the blog  
    const alreadyDisliked = blog?.dislikes?.find(
        (userId => userId?.toString() === loginUserId.toString)
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
        res.json(blog);
    };
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
        res.json(blog);
    }
    else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
                isLiked: true,
            }, { new: true });
        res.json(blog);
    }
});

const disliketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    //Find the blog which you want to be Liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    //Find if the user liked the blog  
    const isDisLiked = blog?.isDisLiked;
    //Find if the user disliked the blog  
    const alreadyLiked = blog?.likes?.find(
        (userId => userId?.toString() === loginUserId.toString)
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
        res.json(blog);
    };
    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
        res.json(blog);
    }
    else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId },
                isDisliked: true,
            }, { new: true });
        res.json(blog);
    }
})

const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await cloudinaryUploadImg(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map(url => ({ url })), // URL'leri nesne olarak kaydet
        }, {
            new: true
        });
        res.json(findBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Bir hata oluştu.' });
    }
});

module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, liketheBlog, disliketheBlog, uploadImages };