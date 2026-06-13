import mongoose, { Schema, model, models } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number; // Stored as integer cents/paise
}

export interface IShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal: string;
  country: string;
}

export interface IOrder {
  _id: string;
  user?: mongoose.Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  stripePaymentId?: string;
  shippingAddress: IShippingAddress;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guestEmail: { type: String },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    stripePaymentId: { type: String },
    shippingAddress: {
      name: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal: { type: String, required: true },
      country: { type: String, required: true },
    },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;
