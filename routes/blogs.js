const express = require('express');
const router = express.Router();
const path = require('path');
const Blog = require('../models/blog');
const { auth, authRole } = require('../auth/auth');
const User = require('../models/user');
const layout = path.join('layouts', 'index')


router.get('/auth/profile/userblogs', auth, async (req, res) => {
    const user = await User.findById({ _id: req.user });
    try {
        let blogs = await Blog.find({ userId: req.user }).populate(req.user).sort({ _id: -1 });
        console.log(blogs);
        const data = {
            title: `${user.firstName}'s blogpost`,
            layout,
            blogs
        };
        // console.log(data)
        res.render('userblogs', {
            title: `${user.firstName}'s blogpost`,
            layout,
            blogs, user
        });
    } catch (error) {
        console.log(error)
        throw error;
    }

});


// ---------------User WRITE BLOG page - GET----------------- //
router.get('/auth/profile/writeblog', auth, (req, res) => {
    res.render('writeblog', { layout, title: "Write blog here" })
})

router.post('/auth/profile/writeblog', auth, async (req, res) => {

    try {
        console.log(req.body);
        const blog = new Blog({
            title: req.body.title,
            description: req.body.description,
            body: req.body.body,
            genre: req.body.genre,
            userId: req.user
        });

        await blog.save();
        console.log(blog)
        const data = {
            title: `Blog saved`,
            layout,
            blog
        };

        res.render('writeblog', data);

    } catch (error) {
        if (error) {
            console.log("Error: ", error.message);
            throw error;
        }
    }

});

router.get('/auth/user/userblogs/:id', auth, async (req, res) => {
    const blog = await Blog.findById({ _id: req.params.id });
    console.log(blog);
    const user = await User.findById({ _id: req.user });
    res.render('blogs', { title: `${blog.title}`, layout, blog, user });
})

router.get('/readblogs/:id', async (req, res) => {
    const blog = await Blog.findById({ _id: req.params.id });
    // console.log(blog);
    res.render('blogs', { layout, title: `${blog.title}`, blog })
})

router.get('/auth/profile/editblog/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findbyId({_id:req.params.id});
        res.render('writeblog', { title: "Edit blog", layout, blog })
    } catch (error) {
        if (error) console.log(error.message);
        throw error;
    }
})

router.post('/auth/profile/editblog/:id', auth, (req, res) => {

});

router.post('/addcomment/:id', async (req, res) => {
    try {
        const blog = await Blog.findById({ _id: req.params.id });
        console.log(blog);
        blog.comments.push({
            name: req.body.name,
            comment: req.body.comment
        });

        await blog.save();

        res.redirect(`/readblogs/${req.params.id}`);
    } catch (error) {
        console.log(error.message);
        throw error;
    };

});

module.exports = router;