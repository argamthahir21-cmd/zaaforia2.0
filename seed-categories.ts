import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String },
    description: { type: String },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const fallbackCategories = [
  { name: "Dresses", slug: "dresses", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=480&q=80", productCount: 156 },
  { name: "Ethnic Wear", slug: "ethnic-wear", image: "https://images.unsplash.com/photo-1583396082781-f0e97c25b3c8?w=480&q=80", productCount: 89 },
  { name: "Western Wear", slug: "western-wear", image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=480&q=80", productCount: 234 },
  { name: "Tops", slug: "tops", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=480&q=80", productCount: 312 },
  { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=480&q=80", productCount: 178 },
  { name: "Footwear", slug: "footwear", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=480&q=80", productCount: 92 },
];

async function seed() {
  try {
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    for (const cat of fallbackCategories) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }
    
    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
