import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Voice Studio - Text to Speech & Voice Cloning",
  description:
    "AI Voice Studio is a startup building AI-powered voice generation tools including text-to-speech, voice cloning, and voice design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1 min-h-0">{children}</div>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "glass-morphism dark:glass-morphism-dark",
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
