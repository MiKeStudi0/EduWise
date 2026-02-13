import type { Metadata } from 'next';

import roadmapDataSource from '@/json/server-side-game-developer.json';

import FrontendRoadmapPageClient from './components/FrontendRoadmapPage';

type RoadmapSeoData = {
  roadmap?: {
    title?: string;
    description?: string;
    seo?: {
      meta_title?: string;
      meta_description?: string;
      keywords?: string[];
      canonical?: string;
      robots?: string;
      open_graph?: {
        title?: string;
        description?: string;
        type?: 'website';
        url?: string;
        site_name?: string;
        image?: {
          url?: string;
          width?: number;
          height?: number;
          alt?: string;
        };
      };
      twitter?: {
        card?: 'summary' | 'summary_large_image' | 'app' | 'player';
        title?: string;
        description?: string;
        image?: string;
      };
    };
  };
};

const roadmapConfig = (roadmapDataSource as RoadmapSeoData).roadmap;
const seoConfig = roadmapConfig?.seo;
const pageTitle = seoConfig?.meta_title ?? roadmapConfig?.title ?? 'Server Side Game Developer Roadmap';
const pageDescription =
  seoConfig?.meta_description ??
  roadmapConfig?.description ??
  'Interactive Server Side Game Developer roadmap covering core skills, projects, and best practices.';
const canonicalUrl = seoConfig?.canonical ?? '/roadmap/server-side-game-developer';
const openGraphConfig = seoConfig?.open_graph;
const twitterConfig = seoConfig?.twitter;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: seoConfig?.keywords,
  alternates: {
    canonical: canonicalUrl,
  },
  robots: (seoConfig?.robots ?? 'index, follow') as Metadata['robots'],
  openGraph: {
    title: openGraphConfig?.title ?? pageTitle,
    description: openGraphConfig?.description ?? pageDescription,
    type: openGraphConfig?.type ?? 'website',
    url: openGraphConfig?.url ?? canonicalUrl,
    siteName: openGraphConfig?.site_name,
    images: openGraphConfig?.image?.url
      ? [
          {
            url: openGraphConfig.image.url,
            width: openGraphConfig.image.width,
            height: openGraphConfig.image.height,
            alt: openGraphConfig.image.alt,
          },
        ]
      : undefined,
  },
  twitter: {
    card: twitterConfig?.card ?? 'summary_large_image',
    title: twitterConfig?.title ?? pageTitle,
    description: twitterConfig?.description ?? pageDescription,
    images: twitterConfig?.image ? [twitterConfig.image] : undefined,
  },
};

export default function Page() {
  return <FrontendRoadmapPageClient />;
}
