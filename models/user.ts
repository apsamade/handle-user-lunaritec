import { Document, Schema, model, models, Model } from "mongoose";
import bcrypt from "bcryptjs"

export interface UserProps extends Document {
  _id: Schema.Types.ObjectId;
  email: string;
  name?: string;
  image?: string;
  admin: boolean;
  password?: string;
  verified: boolean;
  pendingEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
    {
    email: {
      type: String,
      required: [true, "Email obligatoire !"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    pendingEmail: {
      type: String,
      required: false,
    },
  })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

const User: Model<UserProps> = models.User || model<UserProps>("User", userSchema, "users");

export default User;
