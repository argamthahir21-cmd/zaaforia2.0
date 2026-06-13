import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    let items: any[] = [];

    if (session && session.user) {
      const user = await User.findById(session.user.id).populate("watchHistory");
      if (user && user.watchHistory && user.watchHistory.length > 0) {
        // Collect categories from watched history
        const categories = user.watchHistory.map((p: any) => p.category).filter(Boolean);
        const uniqueCategories = Array.from(new Set(categories));
        
        // Find products in those categories, excluding ones already seen recently
        const recentViewedIds = user.watchHistory.slice(0, 5).map((p: any) => p._id);

        items = await Product.find({
          category: { $in: uniqueCategories },
          _id: { $nin: recentViewedIds }
        }).limit(10).sort({ rating: -1 });
      }
    }

    // Fallback if no history or less than 5 items found
    if (items.length < 5) {
      const fallbackItems = await Product.find({ 
        $or: [{ isBestseller: true }, { isFeatured: true }] 
      }).limit(10 - items.length);
      
      items = [...items, ...fallbackItems];
    }

    // Remove duplicates
    const uniqueItems = Array.from(new Map(items.map(item => [item._id.toString(), item])).values());

    const content = uniqueItems.map((item: any) => {
      const doc = item.toObject ? item.toObject() : item;
      return { ...doc, id: doc._id.toString() };
    });

    return NextResponse.json(content);
  } catch (error: any) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ message: "Failed to fetch recommendations" }, { status: 500 });
  }
}
