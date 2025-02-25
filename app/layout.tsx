import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./_components/header";
import { Toaster } from "react-hot-toast";
import { GetUser } from "@/lib/get_user";
export const metadata: Metadata = {
  title: "Clinic-MS",
  description: "This is the web app for the clinic management systems",
};

const inter = Inter({ style: "normal", subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await GetUser();
  return (
    <html lang="en">
      <body className={`bg-backBg text-customBlack ${inter.className}`}>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full px-6">
            <SidebarTrigger className="absolute top-2" />
            <Header user={user} />
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 2500,
                style: {
                  background: "#7ca6f333",
                  color: "#7063d3",
                  fontWeight: "bold",
                },
              }}
            />
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
