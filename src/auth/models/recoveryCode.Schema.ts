import mongoose, { model } from "mongoose";

const recoveryCodeSchema = new mongoose.Schema({
    recoveryCode: {type: String, required: true},
    expirationDate:{type: Date, required: true},
    email:{type: String, required: true},
})

export const recoveryCodeModel = model("Recovery Code", recoveryCodeSchema);