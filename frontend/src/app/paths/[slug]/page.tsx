import PathDetailClient from "./PathDetailClient";

const pathSlugs = ["frontend", "backend", "fullstack", "datascience"];

export function generateStaticParams() {
  return pathSlugs.map((slug) => ({ slug }));
}

export default function PathDetailPage({ params }: { params: { slug: string } }) {
  return <PathDetailClient slug={params.slug} />;
}
