"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Bell, BookOpen } from "lucide-react";
import Link from "next/link";

export default function NonDashBoardNavBar() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  console.log("userRole: ", userRole);

  return (
    <nav className="nondashboard-navbar">
      <div className="nondashboard-navbar__container">
        <div className="nondashboard-navbar__search">
          <Link
            scroll={false}
            href={"/"}
            className="nondashboard-navbar__brand"
          >
            HOPH
          </Link>

          <div className="flex items-center gap-4 mr-2">
            <div className="relative group">
              <Link
                scroll={false}
                href={"/search"}
                className="nondashboard-navbar__search-input"
              >
                <span className="hidden lg:inline">Search Courses</span>
                <span className="lg:hidden">Search</span>
              </Link>
              <BookOpen
                className="nondashboard-navbar__search-icon"
                size={18}
              />
            </div>
          </div>
        </div>

        <div className="nondashboard-navbar__actions">
          {/* <button className="nondashboard-navbar__notification-button  ">
            <span className="nondashboard-navbar__notification-indicator " />
            <Bell className="nondashboard-navbar__notification-icon " />
          </button> */}

          <button className="hidden  relative sm:flex items-center justify-center w-7 h-7 bg-gray-800 rounded-full">
            <span className="absolute top-1 right-1 bg-blue-500 h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full" />
            <Bell className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonOuterIdentifier: "text-customgreys-dirtyGrey",
                  userButtonBox: "scale-90 sm:scale-100",
                },
              }}
              showName={true}
              userProfileMode="navigation"
              userProfileUrl={
                userRole === "teacher" ? "/teacher/profile" : "/user/profile"
              }
            />
          </SignedIn>

          <SignedOut>
            <Link
              scroll={false}
              href={"/signin"}
              className="nondashboard-navbar__auth-button--login"
            >
              Login
            </Link>

            <Link
              scroll={false}
              href={"/signup"}
              className="nondashboard-navbar__auth-button--signup"
            >
              SignUp
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
