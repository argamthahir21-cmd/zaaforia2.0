import mongoose, { Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  description?: string;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String },
    description: { type: String },
    productCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Add text index for search if needed later
CategorySchema.index({ name: 'text', description: 'text' });

export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
