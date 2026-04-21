import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    height: { type: Number },
    weight: { type: Number },
    age: { type: Number },
    gender: { type: String },
    steps: { type: Number, default: 0 },
    savedPosts: [{ type: Schema.Types.ObjectId, ref: "Blog" }]
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
