import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { sendOrderTrackingEmail } from "@/lib/email";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized — Admin only" }, { status: 401 });
    }

    await dbConnect();
    const { status, trackingNumber } = await req.json();
    const { id } = await params;

    const existingOrder = await Order.findById(id).populate('user');
    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Check if tracking number is being updated
    if (trackingNumber && trackingNumber !== existingOrder.trackingNumber) {
      const emailToSendTo = existingOrder.guestEmail || (existingOrder.user as any)?.email;
      const customerName = existingOrder.shippingAddress?.name || "Customer";
      
      if (emailToSendTo) {
        // Async fire and forget so we don't block the request
        sendOrderTrackingEmail(emailToSendTo, id, trackingNumber, customerName).catch(console.error);
      }
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status, trackingNumber },
      { new: true }
    );

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to update order" }, { status: 500 });
  }
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return PATCH(req, { params });
}
