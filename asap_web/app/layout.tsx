import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers/Provider";
import { SnackbarProvider } from './shared/SnackbarProvider';


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
        <Providers>
        <SnackbarProvider>
        {children}
        </SnackbarProvider>
        </Providers>
      </body>
    </html>
  );
}

