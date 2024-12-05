"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";

import { sidebarLinks } from "@/constants";

import { Protect } from "@clerk/nextjs";

type TLink = {
  imgURL: string;
  route: string;
  label: string;
};

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useAuth();

  const isActive = (route: string) => {
    return (pathname.includes(route) && route.length > 1) || pathname === route;
  };

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          if (link.route === "/profile") link.route = `${link.route}/${userId}`;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${
                isActive(link.route) && "bg-primary-500 "
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />

              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}

        {/* Create event -> Only admin can see */}
        <Protect condition={(has) => has({ role: "org:admin" })}>
          <Link
            href="/create-event"
            key="Create Event"
            className={`leftsidebar_link ${
              isActive("create-event") && "bg-primary-500 "
            }`}
          >
            <Image
              src="/assets/create.svg"
              alt="Create Event"
              width={24}
              height={24}
            />

            <p className="text-light-1 max-lg:hidden">Create Event</p>
          </Link>
        </Protect>
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />

              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
