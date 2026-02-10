import { problems } from "../data";
import { ProblemPageClient } from "./ProblemPageClient";

export function generateStaticParams() {
  return problems.map((problem) => ({ id: problem.id.toString() }));
}

export default function ProblemPage({ params }: { params: { id: string } }) {
  return <ProblemPageClient id={params.id} />;
}
