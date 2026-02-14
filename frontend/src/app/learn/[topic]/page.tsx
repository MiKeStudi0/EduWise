import LearnPageContent from "./LearnPageContent";

const learnTopics = ["html", "css", "javascript", "python"];

export function generateStaticParams() {
  return learnTopics.map((topic) => ({ topic }));
}

type LearnTopicPageProps = {
  params: Promise<{ topic: string }>;
};

export default async function InteractiveTopicPage({ params }: LearnTopicPageProps) {
  const { topic } = await params;

  return (
    <div className="min-h-screen bg-background">
      <LearnPageContent topic={topic} />
    </div>
  );
}
