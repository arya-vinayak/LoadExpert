import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import { GoHome, GoHomeFill } from "react-icons/go";
import { SideNavItemType } from "@/types/SideNavBarTypes";
import { BiLogInCircle, BiSolidLogIn } from "react-icons/bi";
import { RiLoginBoxLine, RiLoginBoxFill } from "react-icons/ri"; // Add this import
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const sidebarItmes: SideNavItemType[] = [
  {
    icon: {
      icon: <GoHome />,
      fillIcon: <GoHomeFill />,
    },
    label: "Home",
    href: "/",
  },

  {
    icon: {
      icon: <BiLogInCircle />,
      fillIcon: <BiSolidLogIn />,
    },
    label: "Test Bed",
    href: "/test",
  },
  {
    icon: {
      icon: <RiLoginBoxLine />,
      fillIcon: <RiLoginBoxFill />,
    },
    label: "Monitor",
    href: "/monitor",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="flex">
          <Sidebar sidebarItems={sidebarItmes} />{" "}
          {/* Add the Sidebar component here */}
          <main className="flex-1">{children}</main>
          <Toaster />
          
        </div>
      </body>
    </html>
  );
}
