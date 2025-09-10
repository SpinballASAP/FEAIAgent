import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/providers/QueryProvider";
import Layout from "@/components/layout/Layout";
import { ToastProvider } from "@/components/ui/Toast";
import GlobalAiAgent from "@/components/ai/GlobalAiAgent";
import FloatingMenu from "@/components/ui/FloatingMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TMS AI Tools",
  description: "ระบบจัดการการขนส่งพร้อม AI Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ToastProvider>
            <Layout>
              {children}
              <FloatingMenu />
              <GlobalAiAgent />
            </Layout>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
