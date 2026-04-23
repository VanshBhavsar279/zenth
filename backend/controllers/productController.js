import Product from '../models/Product.js';

const normalizeColorStocks = (product) => {
  if (!product?.colors?.length) return;
  product.colors.forEach((color) => {
    if (Array.isArray(color.sizeStock) && color.sizeStock.length > 0) {
      color.stock = color.sizeStock.reduce((sum, row) => sum + Number(row.stock || 0), 0);
      return;
    }
    // Backward compatibility: migrate legacy color.stock to sizeStock.
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      color.sizeStock = [{ size: product.sizes[0], stock: Number(color.stock || 0) }];
    } else {
      color.sizeStock = [{ size: 'ONE SIZE', stock: Number(color.stock || 0) }];
    }
  });
};

const buildProductFilter = (query, { includeHidden = false } = {}) => {
  const filter = {};

  if (!includeHidden) {
    filter.isVisible = true;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.size) {
    const sizes = Array.isArray(query.size) ? query.size : [query.size];
    filter.sizes = { $in: sizes };
  }

  if (query.color) {
    const colors = Array.isArray(query.color)
      ? query.color
      : String(query.color)
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);
    filter.$or = [
      { 'colors.name': { $in: colors } },
      { 'colors.hex': { $in: colors } },
    ];
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice !== undefined) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.featured === 'true') {
    filter.isFeatured = true;
  }

  return filter;
};

const getSort = (sort) => {
  switch (sort) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const filter = buildProductFilter(req.query, { includeHidden: false });
    const sort = getSort(req.query.sort);

    const products = await Product.find(filter).sort(sort).lean();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductsAdmin = async (req, res, next) => {
  try {
    const filter = {};
    const { q, category } = req.query;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const isAdmin = Boolean(req.admin);
    if (!product.isVisible && !isAdmin) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    normalizeColorStocks(product);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    Object.assign(product, req.body);
    normalizeColorStocks(product);
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

export const patchStock = async (req, res, next) => {
  try {
    const { colorId, size, stock, delta } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const variant = product.colors.id(colorId);
    if (!variant) return res.status(404).json({ message: 'Color variant not found' });

    if (size) {
      if (!Array.isArray(variant.sizeStock)) variant.sizeStock = [];
      const row = variant.sizeStock.find((s) => s.size === size);
      if (row) {
        if (delta !== undefined) {
          row.stock = Math.max(0, Number(row.stock || 0) + Number(delta));
        } else {
          row.stock = Math.max(0, Number(stock || 0));
        }
      } else {
        variant.sizeStock.push({
          size,
          stock: Math.max(0, delta !== undefined ? Number(delta) : Number(stock || 0)),
        });
      }
      variant.stock = variant.sizeStock.reduce((sum, s) => sum + Number(s.stock || 0), 0);
    } else {
      variant.stock = Math.max(0, Number(stock || 0));
      variant.sizeStock = [{ size: product.sizes?.[0] || 'ONE SIZE', stock: variant.stock }];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const toggleVisibility = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isVisible = !product.isVisible;
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const toggleFeatured = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isFeatured = !product.isFeatured;
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};
