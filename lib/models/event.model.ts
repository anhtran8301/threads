import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    minlength: 3
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  meetingType: {
    type: String,
    enum: ["Offline", "Online"],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  }
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
