import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { ChevronRight } from 'lucide-react';

export function TechBreadcrumbs() {
  const params = useParams();
  const { technologies, modules, topics, subtopics } = useApp();

  const crumbs: { label: string; path: string }[] = [
    { label: 'Technologies', path: '/technologies' },
  ];

  if (params.techId) {
    const tech = technologies.items.find(t => t.id === params.techId);
    crumbs.push({ label: tech?.name || '...', path: `/technologies/${params.techId}/modules` });
  }
  if (params.moduleId) {
    const mod = modules.items.find(m => m.id === params.moduleId);
    crumbs.push({ label: mod?.name || '...', path: `/technologies/${params.techId}/modules/${params.moduleId}/topics` });
  }
  if (params.topicId) {
    const topic = topics.items.find(t => t.id === params.topicId);
    crumbs.push({ label: topic?.name || '...', path: `/technologies/${params.techId}/modules/${params.moduleId}/topics/${params.topicId}/subtopics` });
  }
  if (params.subtopicId) {
    const sub = subtopics.items.find(s => s.id === params.subtopicId);
    crumbs.push({ label: sub?.name || '...', path: `/technologies/${params.techId}/modules/${params.moduleId}/topics/${params.topicId}/subtopics/${params.subtopicId}/lessons` });
  }

  return (
    <div className="flex items-center gap-1.5 text-sm flex-wrap sticky top-0 bg-background/80 backdrop-blur-sm py-2 -mt-2 z-10">
      {crumbs.map((crumb, i) => (
        <div key={crumb.path} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={13} className="text-muted-foreground" />}
          {i < crumbs.length - 1 ? (
            <Link to={crumb.path} className="text-muted-foreground hover:text-foreground transition-colors text-xs">{crumb.label}</Link>
          ) : (
            <span className="text-foreground font-medium text-xs">{crumb.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
