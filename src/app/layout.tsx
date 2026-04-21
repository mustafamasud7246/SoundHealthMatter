import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import GuestOnboarding from "@/components/GuestOnboarding";
import { CursorProvider } from "@/context/CursorContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoundHealthMatter | Your Smart Health Companion",
  description: "Global-level health-tech platform providing personalized wellness tracking, tools, and premium health content.",
  keywords: "health, wellness, tracking, BMI, fitness, nutrition, nextjs, mental health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-transparent antialiased selection:bg-primary/30`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CursorProvider>
              <GuestOnboarding />
              <div className="fixed inset-0 -z-10 bg-background">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
            </div>
            <div className="flex flex-col min-h-screen">
              <CustomCursor />
              <Navbar />
              <main className="relative pt-20 flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            </CursorProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
