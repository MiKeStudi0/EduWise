export interface SeoMetadata {
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[] | null;
  canonicalUrl: string | null;
  robots: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogType: string | null;
  ogUrl: string | null;
  ogSiteName: string | null;
  ogImageUrl: string | null;
  ogImageWidth: number | null;
  ogImageHeight: number | null;
  ogImageAlt: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
}

export interface Technology {
  id: number;
  roadmap_id: number;
  slug: string;
  name: string;
  description: string | null;
  seo_id: number | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  roadmap_id: number;
  technology_id: number;
  slug: string;
  title: string;
  description: string | null;
  seo_id: number | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: number;
  roadmap_id: number;
  technology_id: number;
  module_id: number;
  slug: string;
  title: string;
  description: string | null;
  is_active: boolean;
  order_index: number;
  
  // JSON metadata mapped from backend
  examples: any | null;
  image_banner_url: string | null;
  images: any | null;
  video_url: string | null;
  when_to_use: string[] | null;
  when_to_avoid: string[] | null;
  problems: string | null;
  mental_models: string | null;
  common_mistakes: string[] | null;
  bonus_tips: string | null;
  related_topics: string[] | null;

  seo_id: number | null;
  seo: SeoMetadata | null;
  created_at: string;
  updated_at: string;
}
