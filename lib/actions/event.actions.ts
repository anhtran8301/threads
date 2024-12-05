"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Community from "../models/community.model";
import Event from "../models/event.model";

export async function fetchEvents(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Event.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Event.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  eventName: string;
  author: string;
  communityId: string;
  startDate: Date;
  startTime: string;
  timezone: string;
  meetingType: "Online" | "Offline";
  location: string;
  description: string;
  path: string;
}

export async function createEvent({
  eventName,
  author,
  communityId,
  startDate,
  startTime,
  timezone,
  meetingType,
  location,
  description,
  path,
}: Params) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdEvent = await Event.create({
      eventName,
      author,
      startDate,
      startTime,
      timezone,
      meetingType,
      location,
      description,
      community: communityIdObject,
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdEvent._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdEvent._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
}

// async function fetchAllChildThreads(threadId: string): Promise<any[]> {
//   const childThreads = await Event.find({ parentId: threadId });

//   const descendantThreads = [];
//   for (const childThread of childThreads) {
//     const descendants = await fetchAllChildThreads(childThread._id);
//     descendantThreads.push(childThread, ...descendants);
//   }

//   return descendantThreads;
// }

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Event.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // // Extract the authorIds and communityIds to update User and Community models respectively
    // const uniqueAuthorIds = new Set(
    //   [
    //     ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
    //     mainThread.author?._id?.toString(),
    //   ].filter((id) => id !== undefined)
    // );

    // const uniqueCommunityIds = new Set(
    //   [
    //     ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
    //     mainThread.community?._id?.toString(),
    //   ].filter((id) => id !== undefined)
    // );

    // // Recursively delete child threads and their descendants
    // await Event.deleteMany({ _id: { $in: descendantThreadIds } });

    // // Update User model
    // await User.updateMany(
    //   { _id: { $in: Array.from(uniqueAuthorIds) } },
    //   { $pull: { threads: { $in: descendantThreadIds } } }
    // );

    // // Update Community model
    // await Community.updateMany(
    //   { _id: { $in: Array.from(uniqueCommunityIds) } },
    //   { $pull: { threads: { $in: descendantThreadIds } } }
    // );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

export async function fetchEventById(eventId: string) {
  connectToDB();

  try {
    const thread = await Event.findById(eventId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Event, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching event:", err);
    throw new Error("Unable to fetch event");
  }
}
