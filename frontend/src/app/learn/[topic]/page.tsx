import LearnPageContent from "./LearnPageContent";

const learnTopics = ["html", "css", "javascript", "python"];

export function generateStaticParams() {
  return learnTopics.map((topic) => ({ topic }));
}

export default function InteractiveTopicPage({ params }: { params: { topic: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <LearnPageContent params={params} />
    </div>
  );
}
