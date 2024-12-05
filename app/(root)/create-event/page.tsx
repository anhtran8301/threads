
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import PostEvent from "@/components/forms/PostEvent";

import { CldUploadWidget } from "next-cloudinary";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Event</h1>
      <PostEvent userId={userInfo._id} />
      
    </>
  );
}

export default Page;
