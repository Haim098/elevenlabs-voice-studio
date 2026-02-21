"use client";

import * as React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { AudioPlayerBar } from "@/components/layout/audio-player-bar";
import { useAudioPlayerStore } from "@/stores/audio-player-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentTrack = useAudioPlayerStore((state) => state.currentTrack);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main
            className={`flex-1 overflow-auto ${
              currentTrack ? "pb-24" : "pb-4"
            }`}
          >
            {children}
          </main>
          <AudioPlayerBar />
        </div>
      </div>
    </SidebarProvider>
  );
}