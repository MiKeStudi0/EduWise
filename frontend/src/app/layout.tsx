import { Providers } from "@/components/Providers";
import "./globals.css"; // Ensure your Tailwind/CSS is imported here

export const metadata = {
  title: "CodePath - Learn to Code",
  description: "Documentation, coding challenges, and courses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}