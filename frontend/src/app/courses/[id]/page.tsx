import CourseDetailClient from "./CourseDetailClient";

const courseIds = ["1", "2", "3", "4", "5", "6"];

export function generateStaticParams() {
  return courseIds.map((id) => ({ id }));
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  return <CourseDetailClient id={params.id} />;
}
