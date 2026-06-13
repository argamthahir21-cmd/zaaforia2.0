import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  adminRole?: "primary" | "secondary" | null;
  invitedBy?: string;
  image?: string;
  savedAddresses?: Array<{
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  }>;
  watchHistory?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    adminRole: { type: String, enum: ["primary", "secondary", null], default: null },
    invitedBy: { type: String },
    image: { type: String },
    savedAddresses: [
      {
        name: { type: String, required: true },
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postal: { type: String, required: true },
        country: { type: String, required: true },
      }
    ],
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
