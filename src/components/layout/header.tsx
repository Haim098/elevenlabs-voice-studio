"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/studio": "Studio",
  "/voice-cloning": "Voice Cloning",
  "/voice-design": "Voice Design",
  "/dialogue": "Dialogue",
  "/voice-library": "Voice Library",
  "/history": "History",
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pageTitle = pageTitles[pathname] || "ElevenLabs";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold gradient-text">{pageTitle}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
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
              "rounded-lg transition-all duration-200",
              "hover:bg-white/10 dark:hover:bg-white/10"
            )}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
      </div>
    </header>
  );
}