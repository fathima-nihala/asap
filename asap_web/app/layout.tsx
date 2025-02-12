import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./shared/Header";
import Sidebar from "./component/Sidebar";
import Profile from "./component/Profile";
import Footer from "./shared/Footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "ASAP",
  description: "ASAP-SDA Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Header />
        <div className="flex container mx-auto py-2 lg:flex-row flex-col">
          <Profile/>
          <main className="flex-1 p-4">{children}</main>
          <Sidebar />
        </div>
        <Footer/>
      </body>
    </html>
  );
}
