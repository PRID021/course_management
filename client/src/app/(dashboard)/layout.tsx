"use client";

import AppSidebar from "@/components/custom/AppSidebar";
import Loading from "@/components/custom/Loading";
import NavBar from "@/components/custom/NavBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const [courseId, setCourseId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please signin to access this page.</div>;

  return (
    <SidebarProvider>
      <div className="dashboard">
        <AppSidebar />

        <div className="dashboard__content">
          <div
            className={cn("dashboard__main")}
            style={{
              height: "100vh",
            }}
          >
            <NavBar isCoursePage={false} />
            <main className="dashboard__body">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
