"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    // Log the error to the console just like your original code
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        {/* Visual Element */}
        <div className="relative mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <FileQuestion className="w-12 h-12 text-primary" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-7xl font-bold tracking-tighter gradient-text">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight">Oops! Page not found</h2>
          <p className="text-muted-foreground max-w-[400px] mx-auto">
            The page you are looking for at <code className="bg-secondary px-1 rounded text-primary">{pathname}</code> doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild variant="hero" size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}