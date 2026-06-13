import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { items, email, userId, paymentMethod, shippingAddress, subtotal, shipping, total } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No items in cart" }, { status: 400 });
    }

    if (paymentMethod === "Cash on Delivery") {
      await dbConnect();

      const orderItems = items.map((i: any) => ({
        product: i.product.id || i.product._id,
        name: i.product.name,
        image: i.product.images?.[0] || "",
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.product.price,
      }));

      const order = await Order.create({
        user: userId ? userId : undefined,
        guestEmail: userId ? undefined : email,
        items: orderItems,
        subtotal: subtotal || 0,
        shipping: shipping || 0,
        tax: 0,
        total: total || 0,
        status: "confirmed",
        shippingAddress: {
          name: `${shippingAddress?.firstName || ""} ${shippingAddress?.lastName || ""}`.trim() || "Customer",
          line1: shippingAddress?.address || "",
          city: shippingAddress?.city || "",
          state: shippingAddress?.state || "",
          postal: shippingAddress?.pin || "",
          country: shippingAddress?.country || "India",
        },
        paymentMethod: "Cash on Delivery",
      });

      // Update stock
      for (const item of items) {
        const product = await Product.findById(item.product.id || item.product._id);
        if (product) {
          const variants = product.variants.map((v: any) => {
            if (v.size === item.size && v.color === item.color) {
              return { ...v, stock: Math.max(0, v.stock - item.quantity) };
            }
            return v;
          });
          product.variants = variants;
          await product.save();
        }
      }

      // Save address to user profile if logged in
      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          const newAddress = {
            name: `${shippingAddress?.firstName || ""} ${shippingAddress?.lastName || ""}`.trim() || "Customer",
            line1: shippingAddress?.address || "",
            city: shippingAddress?.city || "",
            state: shippingAddress?.state || "",
            postal: shippingAddress?.pin || "",
            country: shippingAddress?.country || "India",
          };

          // Basic check to prevent exact duplicates
          const isDuplicate = user.savedAddresses?.some(
            (addr: any) =>
              addr.line1 === newAddress.line1 &&
              addr.postal === newAddress.postal
          );

          if (!isDuplicate) {
            user.savedAddresses = user.savedAddresses || [];
            user.savedAddresses.push(newAddress);
            await user.save();
          }
        }
      }

      return NextResponse.json({ url: `/checkout?success=true&order_id=${order._id}` });
    }

    const lineItems = items.map((item: any) => {
      const imageUrl = item.product.images?.[0] || "";
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: `${item.product.name} (${item.size} / ${item.color})`,
            images: imageUrl ? [imageUrl] : [],
            description: item.product.description || undefined,
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cart`,
      customer_email: email || undefined,
      metadata: {
        userId: userId || "",
        guestEmail: email || "",
        items: JSON.stringify(
          items.map((i: any) => ({
            productId: i.product.id || i.product._id,
            name: i.product.name,
            image: i.product.images?.[0] || "",
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            price: i.product.price,
          }))
        ),
      },
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "CA", "GB"],
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to create checkout session" }, { status: 500 });
  }
}
