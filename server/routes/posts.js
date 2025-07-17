const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Post = require('/models/Post');
const Category = require('/models/Category');
const router = express.Router();

// GET /api/posts - Get all blog posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find().populate('category', 'name');
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:id - Get a specific blog post
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid post ID')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id).populate('category', 'name');
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/posts - Create a new blog post
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required').trim(),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').isMongoId().withMessage('Valid category ID is required'),
    body('author').notEmpty().withMessage('Author is required').trim(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, content, category, author } = req.body;
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
      const post = new Post({ title, content, category, author });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/posts/:id - Update an existing blog post
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid post ID'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('category').optional().isMongoId().withMessage('Valid category ID is required'),
    body('author').optional().notEmpty().withMessage('Author cannot be empty').trim(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, content, category, author } = req.body;
      if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(400).json({ message: 'Category not found' });
        }
      }
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { title, content, category, author },
        { new: true, runValidators: true }
      ).populate('category', 'name');
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/posts/:id - Delete a blog post
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid post ID')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .populate('category', 'name')
      .skip(skip)
      .limit(limit);
    const total = await Post.countDocuments();
    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

