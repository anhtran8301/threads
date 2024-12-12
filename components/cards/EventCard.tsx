import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";

interface Props {
  id: string;
  eventName: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  startDate: string;
  startTime: string;
  timezone: string;
  location: string;
  description: string;
}

function EventCard({
  id,
  eventName,
  author,
  community,
  startDate,
  startTime,
  timezone,
  location,
  description,
}: Props) {
  return (
    <article className="flex w-full flex-col rounded-xl bg-dark-2 p-7">
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="author_image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/events/${id}`} className="w-fit flex">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {eventName}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">
              Organized by{" "}
              <Link href={`/profile/${author.id}`} className="text-highlight">
                {author.name}
              </Link>
            </p>

            <p className="mt-2 text-small-regular text-light-2">
              {startDate} at {startTime} {timezone}
            </p>

            <p className="mt-2 text-small-regular text-light-2">
              Location: {location}
            </p>

            <p className="mt-2 text-small-regular text-light-2">
              {description}
            </p>

            {community && (
              <Link
                href={`/communities/${community.id}`}
                className="mt-5 flex items-center"
              >
                <p className="text-subtle-medium text-gray-1">
                  Part of {community.name} Community
                </p>
                <Image
                  src={community.image}
                  alt={community.name}
                  width={14}
                  height={14}
                  className="ml-1 rounded-full object-cover"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
