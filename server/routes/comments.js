const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET /api/comments/:postId - Get comments for a post
router.get('/:postId', async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username');
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

// POST /api/comments/:postId - Add a comment
router.post(
  '/:postId',
  authMiddleware,
  [body('content').notEmpty().withMessage('Comment content is required').trim()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { content } = req.body;
      const comment = new Comment({
        content,
        post: req.params.postId,
        author: req.user.userId,
      });
      await comment.save();
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;