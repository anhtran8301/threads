import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true, minlength: 3 },
  startDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  timezone: { type: String, required: true },
  meetingType: { type: String, enum: ["Online", "Offline"], required: true },
  location: { type: String, required: true },
  description: { type: String, maxlength: 500 },
  accountId: { type: String, required: true },
  communityId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;
