import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const EventValidation = z.object({
  eventName: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  startDate: z.date({ required_error: "Start date is required." }),
  startTime: z.string().nonempty({ message: "Start time is required." }),
  timezone: z.string().nonempty({ message: "Timezone is required." }),
  meetingType: z.enum(["Offline", "Online"], {
    invalid_type_error: "Meeting type is required."
  }),
  location: z.string().nonempty({ message: "Location is required." }).optional(),
  description: z.string().max(500, { message: "Description can't exceed 500 characters." }).optional(),
  accountId: z.string(),

});

export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});
