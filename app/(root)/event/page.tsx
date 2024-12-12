import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import EventCard from "@/components/cards/EventCard"; // Custom card for displaying events

import Pagination from "@/components/shared/Pagination";

import { fetchEvents } from "@/lib/actions/event.actions";
import { fetchUser } from "@/lib/actions/user.actions";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch events with pagination
  const result = await fetchEvents(
    searchParams.page ? +searchParams.page : 1,
    30
  );

  return (
    <>
      <h1 className="head-text text-left">Events</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No events found</p>
        ) : (
          <>
            {result.posts.map((event) => (
  <EventCard
    key={event._id}
    id={event._id}
    eventName={event.eventName}
    author={{
      name: event.author.name,
      image: event.author.image,
      id: event.author.id,
    }}
    community={event.community}
    startDate={event.startDate}
    startTime={event.startTime}
    timezone={event.timezone}
    location={event.location}
    description={event.description}
  />
))}

          </>
        )}
      </section>

      <Pagination
        path="/events"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Page;
