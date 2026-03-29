const { Category } = require('../models');

// GET all categories (public)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};

// GET single category (public)
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST create category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    let image = null;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const category = await Category.create({ name, slug, description, image });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating category' });
  }
};

// PUT update category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (description) category.description = description;

    if (req.file) {
      category.image = `/uploads/${req.file.filename}`;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating category' });
  }
};

// DELETE category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting category' });
  }
};
