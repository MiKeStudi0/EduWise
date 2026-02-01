import { Navbar } from "@/components/layout/Navbar";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}