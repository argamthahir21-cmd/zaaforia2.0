import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// ─── Comprehensive seed data covering every page section ──────────────
const SEED_DATA = [
  // ─── HOME: Hero Section ───
  { key: "home.hero.label", value: "Maison Zaaforia", type: "text", fieldType: "label", page: "home", section: "Hero Section", label: "Top Label", order: 1 },
  { key: "home.hero.heading", value: "The Art of\nCouture", type: "text", fieldType: "heading", page: "home", section: "Hero Section", label: "Main Heading", order: 2 },
  { key: "home.hero.description", value: "An invitation to timeless elegance, exquisite craftsmanship, and contemporary silhouettes designed for the modern woman.", type: "text", fieldType: "body", page: "home", section: "Hero Section", label: "Description Text", order: 3 },
  { key: "home.hero.cta1_text", value: "Discover Collection", type: "text", fieldType: "cta_text", page: "home", section: "Hero Section", label: "Primary Button Text", order: 4 },
  { key: "home.hero.cta1_link", value: "/shop", type: "url", fieldType: "cta_link", page: "home", section: "Hero Section", label: "Primary Button Link", order: 5 },
  { key: "home.hero.cta2_text", value: "Explore Jewelry", type: "text", fieldType: "cta_text", page: "home", section: "Hero Section", label: "Secondary Button Text", order: 6 },
  { key: "home.hero.cta2_link", value: "/shop?category=Accessories", type: "url", fieldType: "cta_link", page: "home", section: "Hero Section", label: "Secondary Button Link", order: 7 },
  { key: "home.hero.image", value: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=80", type: "image", fieldType: "image", page: "home", section: "Hero Section", label: "Hero Image", order: 8 },

  // ─── HOME: Promo Banner ───
  { key: "home.promo.discount", value: "20% Off", type: "text", fieldType: "heading", page: "home", section: "Promo Banner", label: "Discount Text", order: 1 },
  { key: "home.promo.offer", value: "Your First Order", type: "text", fieldType: "subheading", page: "home", section: "Promo Banner", label: "Offer Label", order: 2 },
  { key: "home.promo.badge", value: "Limited Time Only", type: "text", fieldType: "label", page: "home", section: "Promo Banner", label: "Badge Text", order: 3 },
  { key: "home.promo.code", value: "ZAAFORIA20", type: "text", fieldType: "body", page: "home", section: "Promo Banner", label: "Promo Code", order: 4 },
  { key: "home.promo.shipping", value: "Free shipping above ₹2,999", type: "text", fieldType: "body", page: "home", section: "Promo Banner", label: "Shipping Info", order: 5 },

  // ─── HOME: Editorial Banner ───
  { key: "home.editorial.left_label", value: "Festive Edit", type: "text", fieldType: "label", page: "home", section: "Editorial Banner", label: "Left Card Label", order: 1 },
  { key: "home.editorial.left_title", value: "Ethnic Royale", type: "text", fieldType: "heading", page: "home", section: "Editorial Banner", label: "Left Card Title", order: 2 },
  { key: "home.editorial.left_desc", value: "Exquisite embroideries, rich fabrics and timeless silhouettes for your most special moments.", type: "text", fieldType: "body", page: "home", section: "Editorial Banner", label: "Left Card Description", order: 3 },
  { key: "home.editorial.left_image", value: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80", type: "image", fieldType: "image", page: "home", section: "Editorial Banner", label: "Left Card Image", order: 4 },
  { key: "home.editorial.left_link", value: "/shop?category=Ethnic+Wear", type: "url", fieldType: "cta_link", page: "home", section: "Editorial Banner", label: "Left Card Link", order: 5 },
  { key: "home.editorial.right_label", value: "New Season", type: "text", fieldType: "label", page: "home", section: "Editorial Banner", label: "Right Card Label", order: 6 },
  { key: "home.editorial.right_title", value: "Western Edit", type: "text", fieldType: "heading", page: "home", section: "Editorial Banner", label: "Right Card Title", order: 7 },
  { key: "home.editorial.right_desc", value: "Sharp tailoring meets effortless silhouettes — power dressing for the modern woman.", type: "text", fieldType: "body", page: "home", section: "Editorial Banner", label: "Right Card Description", order: 8 },
  { key: "home.editorial.right_image", value: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=80", type: "image", fieldType: "image", page: "home", section: "Editorial Banner", label: "Right Card Image", order: 9 },
  { key: "home.editorial.right_link", value: "/shop?category=Western+Wear", type: "url", fieldType: "cta_link", page: "home", section: "Editorial Banner", label: "Right Card Link", order: 10 },

  // ─── HOME: Style Edit ───
  { key: "home.style.section_label", value: "The Edit", type: "text", fieldType: "label", page: "home", section: "Style Edit", label: "Section Label", order: 1 },
  { key: "home.style.section_title", value: "Style Stories", type: "text", fieldType: "heading", page: "home", section: "Style Edit", label: "Section Title", order: 2 },
  { key: "home.style.card1_title", value: "Textural Minimalism", type: "text", fieldType: "subheading", page: "home", section: "Style Edit", label: "Card 1 Title", order: 3 },
  { key: "home.style.card1_desc", value: "Poetics and artistic details that elevate everyday dressing.", type: "text", fieldType: "body", page: "home", section: "Style Edit", label: "Card 1 Description", order: 4 },
  { key: "home.style.card1_image", value: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80", type: "image", fieldType: "image", page: "home", section: "Style Edit", label: "Card 1 Image", order: 5 },
  { key: "home.style.card2_title", value: "Off-Duty Luxe", type: "text", fieldType: "subheading", page: "home", section: "Style Edit", label: "Card 2 Title", order: 6 },
  { key: "home.style.card2_desc", value: "For days when comfort comes first, but looking good never takes a day off.", type: "text", fieldType: "body", page: "home", section: "Style Edit", label: "Card 2 Description", order: 7 },
  { key: "home.style.card2_image", value: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80", type: "image", fieldType: "image", page: "home", section: "Style Edit", label: "Card 2 Image", order: 8 },
  { key: "home.style.card3_title", value: "Ethnic Elegance", type: "text", fieldType: "subheading", page: "home", section: "Style Edit", label: "Card 3 Title", order: 9 },
  { key: "home.style.card3_desc", value: "Heritage craftsmanship meets the modern silhouette — timeless and bold.", type: "text", fieldType: "body", page: "home", section: "Style Edit", label: "Card 3 Description", order: 10 },
  { key: "home.style.card3_image", value: "https://images.unsplash.com/photo-1583396082781-f0e97c25b3c8?w=600&q=80", type: "image", fieldType: "image", page: "home", section: "Style Edit", label: "Card 3 Image", order: 11 },

  // ─── HOME: Trust Strip ───
  { key: "home.trust.item1", value: "Free Shipping Above ₹2,999", type: "text", fieldType: "body", page: "home", section: "Trust Strip", label: "Trust Point 1", order: 1 },
  { key: "home.trust.item2", value: "Easy 30-Day Returns", type: "text", fieldType: "body", page: "home", section: "Trust Strip", label: "Trust Point 2", order: 2 },
  { key: "home.trust.item3", value: "100% Authentic Products", type: "text", fieldType: "body", page: "home", section: "Trust Strip", label: "Trust Point 3", order: 3 },
  { key: "home.trust.item4", value: "Secure Checkout", type: "text", fieldType: "body", page: "home", section: "Trust Strip", label: "Trust Point 4", order: 4 },

  // ─── HOME: Intro ───
  { key: "home.intro.welcome", value: "Welcome to", type: "text", fieldType: "label", page: "home", section: "Intro Screen", label: "Welcome Text", order: 1 },
  { key: "home.intro.brand", value: "ZAAFORIA", type: "text", fieldType: "heading", page: "home", section: "Intro Screen", label: "Brand Name", order: 2 },

  // ─── FOOTER ───
  { key: "footer.tagline", value: "Wear the Future. Own the Moment.", type: "text", fieldType: "heading", page: "global", section: "Footer", label: "Footer Tagline", order: 1 },
  { key: "footer.description", value: "Premium fashion destination for the modern woman. Curated collections of ethnic wear, western wear, and accessories.", type: "text", fieldType: "body", page: "global", section: "Footer", label: "Footer Description", order: 2 },

  // ─── NAVBAR ───
  { key: "navbar.promo1", value: "USE CODE ZAAFORIA20", type: "text", fieldType: "body", page: "global", section: "Announcement Bar", label: "Promo Text 1", order: 1 },
  { key: "navbar.promo2", value: "EASY 30-DAY RETURNS", type: "text", fieldType: "body", page: "global", section: "Announcement Bar", label: "Promo Text 2", order: 2 },
  { key: "navbar.promo3", value: "NEW ARRIVALS EVERY WEEK", type: "text", fieldType: "body", page: "global", section: "Announcement Bar", label: "Promo Text 3", order: 3 },
  { key: "navbar.promo4", value: "FREE SHIPPING ON ORDERS ABOVE ₹2,999", type: "text", fieldType: "body", page: "global", section: "Announcement Bar", label: "Promo Text 4", order: 4 },

  // ─── HOME: Instagram Feed ───
  { key: "instagram.feed.1", value: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 1", order: 1 },
  { key: "instagram.feed.2", value: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 2", order: 2 },
  { key: "instagram.feed.3", value: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 3", order: 3 },
  { key: "instagram.feed.4", value: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 4", order: 4 },
  { key: "instagram.feed.5", value: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 5", order: 5 },
  { key: "instagram.feed.6", value: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 6", order: 6 },
];

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    const section = url.searchParams.get("section");

    const query: any = {};
    if (page) query.page = page;
    if (section) query.section = section;

    let contents = await SiteContent.find(query).sort({ page: 1, section: 1, order: 1 });

    // Auto-seed if empty
    if (contents.length === 0 && !page && !section) {
      await SiteContent.insertMany(SEED_DATA, { ordered: false }).catch(() => {});
      contents = await SiteContent.find(query).sort({ page: 1, section: 1, order: 1 });
    }

    return NextResponse.json(contents);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized — Admin only" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Support creating a new content entry
    const { key, value, type, fieldType, page, section, label, order } = body;

    if (!key || !value) {
      return NextResponse.json({ message: "Key and value are required" }, { status: 400 });
    }

    const content = await SiteContent.findOneAndUpdate(
      { key },
      { value, type: type || "text", fieldType: fieldType || "body", page: page || "home", section: section || "General", label, order: order || 0 },
      { new: true, upsert: true }
    );

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/shop");

    return NextResponse.json(content, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to create content" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized — Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { key, value } = await req.json();

    if (!key) {
      return NextResponse.json({ message: "Content key is required" }, { status: 400 });
    }

    const content = await SiteContent.findOneAndUpdate(
      { key },
      { value },
      { new: true }
    );

    if (!content) {
      return NextResponse.json({ message: "Content not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/shop");

    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to update content" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized — Admin only" }, { status: 401 });
    }

    await dbConnect();
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return NextResponse.json({ message: "Content key is required" }, { status: 400 });
    }

    await SiteContent.findOneAndDelete({ key });

    revalidatePath("/");
    return NextResponse.json({ message: "Content deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to delete content" }, { status: 500 });
  }
}
