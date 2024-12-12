"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useOrganization,currentUser } from "@clerk/nextjs";
import moment from "moment";

import { EventValidation } from "@/lib/validations/event";
import { createEvent } from "@/lib/actions/event.actions";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CldUploadWidget } from "next-cloudinary";
import z from "zod/lib";
interface Props {
  userId: string;
}

const PostEvent: React.FC<Props> = ({ userId }) => {
  const router = useRouter();
  const { organization } = useOrganization();
  const [startDate, setStartDate] = useState<Date | null>(null);

  const form = useForm<z.infer<typeof EventValidation>>({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      eventName: "",
      startDate: moment().toDate(),
      startTime: moment().add(1, "hour").startOf("hour").format("HH:mm"),
      timezone: "UTC+07",
      meetingType: "Online",
      location: "",
      description: "",
      accountId: userId,
      communityId: organization ? organization.id : "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof EventValidation>) => {
    console.log(values)
  //   const user = await currentUser();
  //   if (!user) return null;
  // console.log("goddddđ")
  //   const path = "/events"; // Adjust path if needed
  //   try {
  //     await createEvent({
  //       ...values,
  //       communityId: organization ? organization.id : "",
  //       author: user?.id,
  //       path: path,
  //     });
  //     console.log("124125342534")
  //   } catch (error) {
  //     console.error("Error creating event:", error);
  //   }
  };
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-10">
        {/* <CldUploadWidget signatureEndpoint="/api/sign-image">
          {({ open }) => (
            <Button type="button" onClick={() => open()} className="bg-primary-500">
              Upload Event Image
            </Button>
          )}
        </CldUploadWidget> */}

        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
              <Input
  type="date"
  name="startDate"
  value={startDate ? startDate.toString().split('T')[0] : ''}
  onChange={(e) => setStartDate(new Date(e.target.value))}
/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Type</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<Button
  onClick={() => form.handleSubmit(onSubmit)()}
  className="bg-primary-500"
>
  Post Event
</Button>

      </form>
    </Form>
  );
};

export default PostEvent;
