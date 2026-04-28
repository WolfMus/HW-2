import mongoose, { model } from "mongoose";
import { User } from "../type/user.type";

const emailConfirmationSchema = new mongoose.Schema({
  confirmationCode: { type: String, required: true },
  expirationCode: { type: Date, required: true },
  isConfirmed: { type: Boolean, required: true },
});

const usersSchema = new mongoose.Schema<User>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  createdAt: { type: Date, required: true },
  emailConfirmation: { emailConfirmationSchema },
});

export const usersModel = model<User>("Users", usersSchema);
