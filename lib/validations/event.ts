import * as z from "zod";

export const EventValidation = z.object({
  eventName: z.string().min(1, "Event name is required."),
  startDate: z.date().refine((date) => {
    // Compare only the date part, ignoring the time
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00
    return date > currentDate;
  }, {
    message: "Event date must be in the future.",
  }),
  
  startTime: z.string().min(1, "Event time is required."),
  timezone: z.string().min(1, "Timezone is required."),
  meetingType: z.enum(["Online", "Offline"]).default("Online"),
  location: z.string().min(1, "Location is required."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  accountId: z.string().min(1, "User ID is required."),
  communityId: z.string().min(1, "Community ID is required."),
});
