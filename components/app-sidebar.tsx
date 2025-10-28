"use client";
import {
  ChartSpline,
  BookUser,
  Activity,
  Hospital,
  LogOut,
  ChevronDown,
  UserPlus,
  ClipboardList,
  Stethoscope,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { redirect, usePathname } from "next/navigation";
import { Logout } from "@/lib/logout";
import toast from "react-hot-toast";
import Logo from "@/public/waqar-logo.svg";
import Image from "next/image";
const userItems = [
  {
    title: "Users Lists",
    url: "/user/user-list",
    icon: ClipboardList,
  },
  {
    title: "Create User",
    url: "/user/create-user",
    icon: UserPlus,
  },
];

const patientItems = [
  {
    title: "Patient Lists",
    url: "/patient/patient-list",
    icon: ClipboardList,
  },
  {
    title: "Create Patient",
    url: "/patient/create-patient",
    icon: UserPlus,
  },
  {
    title: "Patient Checkup",
    url: "/patient/patient-checkup",
    icon: Stethoscope,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <>
      {pathname !== "/auth/login" && (
        <Sidebar
          side="left"
          collapsible="icon"
          variant="sidebar"
          className="text-customBlack"
        >
          <SidebarHeader className="bg-customSecondary-20">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="bg-customPrimary text-white hover:bg-customPrimary hover:text-white"
                >
                  <Link href="/">
                    {/* <Hospital strokeWidth={3} /> */}
                    <Image src={Logo} className="w-[50px]" alt="logo" />
                    <span className="font-bold text-[14px]">
                      Waqar Optical Center.
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarSeparator className="bg-tertiary" />
          <SidebarContent className="bg-customSecondary-20">
            <SidebarGroup className="pt-2">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="bg-customPrimary-20 hover:bg-customPrimary-80  hover:text-white"
                      isActive={pathname === "/"}
                      tooltip="Dashboard"
                    >
                      <Link href="/">
                        <ChartSpline />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <Collapsible className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="text-customBlack text-sm bg-customPrimary-20 hover:bg-customPrimary-80 hover:text-white group[data-collapsible='icon'] group-data-[collapsible=icon]:opacity-1 group-data-[collapsible=icon]:mt-0"
                >
                  <CollapsibleTrigger>
                    <BookUser />
                    <span className="ms-2 group-data-[collapsible=icon]:opacity-0">
                      User
                    </span>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {userItems.map((item) => (
                        <SidebarMenuItem
                          key={item.title}
                          className="first:pt-[0.25rem]"
                        >
                          <SidebarMenuButton
                            asChild
                            className="bg-customPrimary-20 hover:bg-customPrimary  hover:text-white"
                            isActive={pathname.startsWith(item.url)}
                            tooltip={item.title}
                          >
                            <Link href={item.url}>
                              <span
                                className={`bg-customBlack w-1 h-1 rounded-full ${
                                  state == "collapsed" ? "hidden" : "block"
                                }`}
                              ></span>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
            <Collapsible className="group/collapsible-2">
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="text-customBlack text-sm bg-customPrimary-20 hover:bg-customPrimary-80 hover:text-white group[data-collapsible='icon'] group-data-[collapsible=icon]:opacity-1 group-data-[collapsible=icon]:mt-0"
                >
                  <CollapsibleTrigger>
                    <Activity />
                    <span className="ms-2 group-data-[collapsible=icon]:opacity-0">
                      Patient
                    </span>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible-2:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {patientItems.map((item) => (
                        <SidebarMenuItem
                          key={item.title}
                          className="first:pt-[0.25rem]"
                        >
                          <SidebarMenuButton
                            asChild
                            className="bg-customPrimary-20 hover:bg-customPrimary  hover:text-white"
                            isActive={pathname.startsWith(item.url)}
                            tooltip={item.title}
                          >
                            <Link href={item.url}>
                              <span
                                className={`bg-customBlack w-1 h-1 rounded-full ${
                                  state == "collapsed" ? "hidden" : "block"
                                }`}
                              ></span>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
          <SidebarSeparator className="bg-tertiary" />
          <SidebarFooter className="bg-customSecondary-20">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                >
                  <button
                    onClick={async () => {
                      if (await Logout()) {
                        toast.success("Successfully Logout");
                        redirect("/auth/login");
                      }
                    }}
                  >
                    <LogOut />
                    <span className="">Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  );
}
