const { Product, Category, ProductMedia, ProductVariant } = require('../models');

// GET all products (public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: ProductMedia, as: 'media' },
        { model: ProductVariant, as: 'variants' }
      ]
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// GET single product (public)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: ProductMedia, as: 'media' },
        { model: ProductVariant, as: 'variants' }
      ]
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category_id, description, stock } = req.body;
    let colors = [];
    let sizes = [];
    let attributes = [];

    if (req.body.colors) colors = JSON.parse(req.body.colors);
    if (req.body.sizes) sizes = JSON.parse(req.body.sizes);
    if (req.body.attributes) attributes = JSON.parse(req.body.attributes);

    let image = null;
    if (req.files && req.files.length > 0) {
      // Keep main image backward compatibility
      image = `/uploads/${req.files[0].filename}`;
    }

    const product = await Product.create({
      name,
      price,
      category_id,
      description,
      stock,
      colors,
      sizes,
      attributes,
      image,
      rating: 5.0
    });

    if (req.body.variants) {
      const variantsData = JSON.parse(req.body.variants);
      const variantsToCreate = variantsData.map(v => ({
        product_id: product.id,
        attributes: v.attributes,
        price: v.price || price,
        stock: v.stock || 0,
        sku: v.sku || null
      }));
      await ProductVariant.bulkCreate(variantsToCreate);
    }

    if (req.files && req.files.length > 0) {
      const mediaData = req.files.map((file, index) => ({
        product_id: product.id,
        url: `/uploads/${file.filename}`,
        type: file.mimetype.startsWith('video/') ? 'video' : 'image',
        sort_order: index
      }));
      await ProductMedia.bulkCreate(mediaData);
    }

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// PUT update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category_id, description, stock } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name) product.name = name;
    if (price) product.price = price;
    if (category_id) product.category_id = category_id;
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = stock;
    
    if (req.body.colors) product.colors = JSON.parse(req.body.colors);
    if (req.body.sizes) product.sizes = JSON.parse(req.body.sizes);
    if (req.body.attributes) product.attributes = JSON.parse(req.body.attributes);

    if (req.body.deleteMainImage === 'true') {
      product.image = null;
    }
    if (req.body.setMainImageUrl) {
      product.image = req.body.setMainImageUrl;
    }

    let usedFirstFileAsMain = false;
    if (req.files && req.files.length > 0) {
      if (!product.image) {
        product.image = `/uploads/${req.files[0].filename}`;
        usedFirstFileAsMain = true;
      }
    }

    await product.save();
    
    // Process variants (upsert logic)
    if (req.body.variants) {
      let variantsData = [];
      try {
        variantsData = JSON.parse(req.body.variants);
      } catch(e) { console.error("Error parsing variants", e); }
      
      const existingVariants = await ProductVariant.findAll({ where: { product_id: product.id } });
      const existingIds = existingVariants.map(v => v.id);
      
      const variantsToKeepIds = variantsData.filter(v => v.id).map(v => v.id);
      const variantsToDelete = existingIds.filter(id => !variantsToKeepIds.includes(id));
      
      if (variantsToDelete.length > 0) {
        await ProductVariant.destroy({ where: { id: variantsToDelete } });
      }
      
      for (const vData of variantsData) {
        if (vData.id) {
          await ProductVariant.update({
            attributes: vData.attributes,
            price: vData.price,
            stock: vData.stock,
            sku: vData.sku
          }, { where: { id: vData.id } });
        } else {
          await ProductVariant.create({
            product_id: product.id,
            attributes: vData.attributes,
            price: vData.price,
            stock: vData.stock,
            sku: vData.sku
          });
        }
      }
    }

    // Add new media
    if (req.files && req.files.length > 0) {
      const currentMediaCount = await ProductMedia.count({ where: { product_id: product.id } });
      
      // If we used the first file as the main image, we skip adding it to the ProductMedia gallery
      const filesToAdd = usedFirstFileAsMain ? req.files.slice(1) : req.files;
      
      const mediaData = filesToAdd.map((file, index) => ({
        product_id: product.id,
        url: `/uploads/${file.filename}`,
        type: file.mimetype.startsWith('video/') ? 'video' : 'image',
        sort_order: currentMediaCount + index
      }));
      if (mediaData.length > 0) {
        await ProductMedia.bulkCreate(mediaData);
      }
    }

    // Fetch updated product with category and media
    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: ProductMedia, as: 'media' },
        { model: ProductVariant, as: 'variants' }
      ]
    });
    
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// DELETE product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

// DELETE product media item (Admin only)
exports.deleteProductMedia = async (req, res) => {
  try {
    const media = await ProductMedia.findByPk(req.params.mediaId);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    await media.destroy();
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting media' });
  }
};
