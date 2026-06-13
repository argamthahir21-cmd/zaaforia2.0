import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ message: "Stripe webhook secret is missing" }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ message: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    try {
      await dbConnect();

      const items = JSON.parse(session.metadata.items || "[]");
      const userId = session.metadata.userId;
      const guestEmail = session.metadata.guestEmail || session.customer_details?.email;

      const shippingAddress = {
        name: session.shipping_details?.name || session.customer_details?.name || "Customer",
        line1: session.shipping_details?.address?.line1 || "",
        line2: session.shipping_details?.address?.line2 || "",
        city: session.shipping_details?.address?.city || "",
        state: session.shipping_details?.address?.state || "",
        postal: session.shipping_details?.address?.postal_code || "",
        country: session.shipping_details?.address?.country || "",
      };

      const orderItems = items.map((item: any) => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      }));

      // Create Order
      const order = await Order.create({
        user: userId ? userId : undefined,
        guestEmail: userId ? undefined : guestEmail,
        items: orderItems,
        subtotal: session.amount_subtotal / 100,
        shipping: (session.total_details?.amount_shipping || 0) / 100,
        tax: (session.total_details?.amount_tax || 0) / 100,
        total: session.amount_total / 100,
        status: "confirmed",
        stripePaymentId: session.payment_intent as string,
        shippingAddress,
      });

      // Update variant stock in Mongoose
      for (const item of items) {
        const product = await Product.findById(item.productId);
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

      console.log(`Order successfully created for Session ID: ${session.id}, Order ID: ${order._id}`);
      return NextResponse.json({ received: true, orderId: order._id });
    } catch (error: any) {
      console.error("Webhook processing failed:", error);
      return NextResponse.json({ message: "Webhook processing failed", error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
