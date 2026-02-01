"use client";

import { use } from "react";
import LearnPageContent from "./LearnPageContent"; // This is the sidebar + editor component

export default function InteractiveTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  // We unwrap the search term/topic from the URL
  // If the user picked 'html', this renders the HTML Workspace
  return (
    <div className="min-h-screen bg-background">
      <LearnPageContent params={params} />
    </div>
  );
}