import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Settings } from "@/models/Settings";

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return NextResponse.json({
      deliveryAmount: settings.deliveryAmount,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
