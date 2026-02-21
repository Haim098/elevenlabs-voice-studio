"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mic,
  Copy,
  Wand2,
  MessageSquare,
  Library,
  Clock,
  AudioWaveform,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Studio",
    href: "/studio",
    icon: Mic,
  },
  {
    title: "Voice Cloning",
    href: "/voice-cloning",
    icon: Copy,
  },
  {
    title: "Voice Design",
    href: "/voice-design",
    icon: Wand2,
  },
  {
    title: "Dialogue",
    href: "/dialogue",
    icon: MessageSquare,
  },
  {
    title: "Voice Library",
    href: "/voice-library",
    icon: Library,
  },
  {
    title: "History",
    href: "/history",
    icon: Clock,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-white/10 bg-sidebar dark:bg-black/50">
      <SidebarHeader className="border-b border-white/10 p-4">
        <Link href="/studio" className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-lg">
            <AudioWaveform className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            ElevenLabs
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "relative h-10 w-full rounded-lg transition-all duration-200",
                    "hover:bg-white/5 dark:hover:bg-white/5",
                    isActive && "bg-white/10 dark:bg-white/10"
                  )}
                >
                  <Link href={item.href}>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full gradient-primary" />
                    )}
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "ml-3 text-sm font-medium transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-4">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>API Connected</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}