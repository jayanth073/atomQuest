import type { Metadata } from "next";
import "./globals.css";
import Shell from "@/components/Shell";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "AtomQuest | Goal Setting & Tracking Portal",
  description: "Internal performance management portal for Atomberg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-surface-50 text-surface-900 selection:bg-surface-200 selection:text-surface-900">
        <ToastProvider>
          <Shell>
            {children}
          </Shell>
        </ToastProvider>
      </body>
    </html>
  );
}
