const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  featuredImage: {
    type: String, // Store image URL or path
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);
// ... (other imports)
const upload = require('../middleware/upload');

// POST /api/posts
router.post(
  '/',
  authMiddleware,
  upload.single('featuredImage'),
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
      const post = new Post({
        title,
        content,
        category,
        author,
        featuredImage: req.file ? `/uploads/${req.file.filename}` : '',
      });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/posts/:id
router.put(
  '/:id',
  authMiddleware,
  upload.single('featuredImage'),
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
      const updateData = { title, content, category, author };
      if (req.file) {
        updateData.featuredImage = `/uploads/${req.file.filename}`;
      }
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        updateData,
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

// ... (other routes unchanged)