export type GalleryCategory = 'ALL' | 'NATURE' | 'CULTURE' | 'PLACES' | 'PEOPLE' | 'EXPERIENCES';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  description: string;
  image: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  location?: string;
  featured?: boolean;
}

export type BlogCategory = 'All' | 'Nature' | 'Culture' | 'Travel' | 'Experiences' | 'Knowza Stories';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  date: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  introduction: string;
  content: string[];
  inlineImages?: {
    src: string;
    caption: string;
  }[];
  pullQuote?: {
    text: string;
    author?: string;
  };
  relatedSlugs?: string[];
}

export interface NavLinkItem {
  name: string;
  path: string;
}

export interface BrandPrinciple {
  number: string;
  title: string;
  description: string;
  image?: string;
}

export interface FiveElement {
  name: string;
  geometry: string;
  description: string;
  meaning: string;
}
