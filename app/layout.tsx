import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "MockIt - Conservation Geography",
  description: "Practice exam web app for Conservation Geography (Weeks 0-12)",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6">{children}</main>
      </body>
    </html>
  );
}
