import mongoose from "mongoose";

export const users = mongoose.model("users", {
  name: String,
  email: String,
  password: String,
  photo: String,
  role: String,
  tenant: [{ _id: String, name: String, from: String }],
  createdAt: Date,
  updatedAt: Date,
});
export const roles = mongoose.model("roles", {
  role: String,
  createdAt: Date,
  updatedAt: Date,
});

export const tenants = mongoose.model("tenants", {
  name: String,
  email: String,
  idUsers: String,
  from: String,
  createdAt: Date,
  updatedAt: Date,
});
