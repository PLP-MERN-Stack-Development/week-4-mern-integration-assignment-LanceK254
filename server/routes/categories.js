const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('/models/Category');
const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// POST /api/categories - Create a new category
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Category name is required').trim(),
    body('description').optional().trim(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, description } = req.body;
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }
      const category = new Category({ name, description });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;