import mongoose, { Schema } from "mongoose";
const notificationSchema = new mongoose.Schema({
     userId: {
          type: Schema.Types.ObjectId,
          ref: "User"
     },
     notificationType: {
          type: String,
     },
     message: {
          type: String,
     }
},
     {
          timestamps: true
     });

export const Notification = mongoose.model("Notification", notificationSchema);