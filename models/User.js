const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    email: String,
    name: String,
    picture: String,

    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "User" }],

    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: "User" }],

    socketId: String,

    inviteNumber: { type: String, unique: true, index: true,immutable: true },
  },
  { timestamps: true },
);

/**
 *  @description UserSchema
 *  @borrows Google
 *  @alias GoogleId  `Logged in` Users google auth id
 * @alias email
 * @alias picture
 *
 * @example UserSchema :{
 *  googleId,
 * email,
 * name,
 * picture,
 * friends,
 * chats,
 * friendsRequestsSent,
 * friendsRequestsReceived,
 * socketId
 *  }
 *
 */
const User = mongoose.model("User", userSchema);

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  broadcastId: { type: Schema.Types.ObjectId, ref: "Broadcast" },
});

/**
 * @description `ChatSchema` that allow user chat with each others and Store chat history
 */
const chatSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [messageSchema],
    isGroup: { type: Boolean, default: false },
    name: { type: String },
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);

const broadcast = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    recipients: [{ type: Schema.Types.ObjectId, ref: "User" }],
    seenCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Broadcast = mongoose.model("Broadcast", broadcast);

const broadcastSeenSchema = new Schema(
  {
    broadcastId: {
      type: Schema.Types.ObjectId,
      ref: "Broadcast",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },
  },
  { timestamps: true },
);
const BroadcastSeen = mongoose.model("BroadcastSeen", broadcastSeenSchema);

module.exports = { User, Chat, Broadcast, BroadcastSeen };

function generateInviteNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}


