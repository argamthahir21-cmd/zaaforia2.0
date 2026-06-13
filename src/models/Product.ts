import mongoose, { Schema, model, models } from "mongoose";

export interface IVariant {
  size: string;
  color: string;
  stock: number;
  sku?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  category?: string;
  collectionId?: mongoose.Types.ObjectId;
  images: string[];
  variants: IVariant[];
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  metadata?: {
    material?: string;
    care?: string;
    origin?: string;
    fit?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    category: { type: String },
    collectionId: { type: Schema.Types.ObjectId, ref: "Collection" },
    images: [{ type: String }],
    variants: [
      {
        size: String,
        color: String,
        stock: Number,
        sku: String,
      },
    ],
    tags: [String],
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    metadata: {
      material: String,
      care: String,
      origin: String,
      fit: String,
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Add search indexes
ProductSchema.index({ name: "text", description: "text", tags: "text" });

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
