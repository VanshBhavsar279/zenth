import mongoose from 'mongoose';

const colorVariantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['Hoodies', 'Tees', 'Caps', 'Bottoms', 'Accessories'],
    },
    price: { type: Number, required: true, min: 0 },
    sizes: [{ type: String }],
    colors: [colorVariantSchema],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
