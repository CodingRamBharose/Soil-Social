import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AuthProvider from "@/context/AuthProvider";
import { NotificationProvider } from "@/context/NotificationContext";
import { SocketProvider } from "@/context/SocketContext";
import { Toaster } from "@/components/ui/sonner";
import NavbarWrapper from "@/components/navbars/NavbarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soil Social",
  description: "The farming social platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NotificationProvider>
              <SocketProvider>
                <NavbarWrapper />
                <main className="flex-1 pt-0">
                  {children}
                </main>
                <Toaster position="top-center" />
              </SocketProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
