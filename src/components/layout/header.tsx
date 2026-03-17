"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/studio": "Studio",
  "/voice-cloning": "Voice Cloning",
  "/voice-design": "Voice Design",
  "/dialogue": "Dialogue",
  "/voice-library": "Voice Library",
  "/history": "History",
  "/about": "About",
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pageTitle = pageTitles[pathname] || "AI Voice Studio";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/40 bg-background/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <SidebarTrigger className="md:hidden h-9 w-9" />
        <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
          {pageTitle}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-400 animate-ping" />
          </div>
          <span className="text-sm text-muted-foreground">API Ready</span>
        </div>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "rounded-lg transition-all duration-200 h-9 w-9",
              "hover:bg-white/10 dark:hover:bg-white/10"
            )}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
      </div>
    </header>
  );
}
