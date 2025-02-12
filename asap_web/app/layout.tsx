import type { Metadata } from "next";
import "./globals.css";
import Header from "./shared/Header";
import Sidebar from "./component/Sidebar";
import Profile from "./component/Profile";
import Footer from "./shared/Footer";



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
      {/* <body className="bg-gray-100">
        <Header />
        <div className="flex container mx-auto py-2 lg:flex-row flex-col">
          <Profile/>
          <main className="md:flex-1 p-4">{children}</main>
          <Sidebar />
        </div>
        <Footer/>
      </body> */}

      <body className="bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4">
            <Profile />
          </div>
          <main className="lg:w-1/2">{children}</main>
          <div className="lg:w-1/4">
            <Sidebar />
          </div>
        </div>
        <Footer />
      </body>

    </html>
  );
}
