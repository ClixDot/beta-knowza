import React from 'react';
import { CTASection } from '../components/CTASection';
import { OfferingsSection } from '../components/OfferingsSection';
import { CuratedPathwaysSection } from '../components/CuratedPathwaysSection';
import { SeoHead } from '../components/cms/SeoHead';
import { previewSectionId, useSiteContent } from '../cms/hooks/useSiteContent';
import type { PageId, SectionInstance } from '../cms/types';
import { NotFound } from '../pages/NotFound';
import {
  BrandSoulSection,
  ExperiencePillarsSection,
  FounderSection,
  NorthStarSection,
  RoadmapSection,
  SanctuaryBannerSection,
  SustainedHarmonySection,
} from './AboutSections';
import { ContactMainSection, InstagramPreviewSection } from './ContactSections';
import {
  BrandStatementSection,
  DispatchesSection,
  FoundationsSection,
  HomeHeroSection,
  MomentsSection,
  SanctuaryFeaturesSection,
} from './HomeSections';
import { BlogListingSection, GalleryGridSection, InnerHeroSection, NewsletterSection } from './ListingSections';
import {
  BlogShowcaseTemplate,
  CtaTemplate,
  FeatureCardsTemplate,
  HeroTemplate,
  ImageGalleryTemplate,
  ImageTextTemplate,
  StatisticsTemplate,
  TestimonialsTemplate,
  TextBlockTemplate,
  VideoTemplate,
} from './TemplateSections';

const REGISTRY: Record<string, React.ComponentType<{ content: any }>> = {
  'home-hero': HomeHeroSection,
  'brand-statement': BrandStatementSection,
  'sanctuary-features': SanctuaryFeaturesSection,
  offerings: OfferingsSection,
  foundations: FoundationsSection,
  moments: MomentsSection,
  dispatches: DispatchesSection,
  'closing-cta': () => <CTASection />,
  'inner-hero': InnerHeroSection,
  'sanctuary-banner': SanctuaryBannerSection,
  'north-star': NorthStarSection,
  roadmap: RoadmapSection,
  'brand-soul': BrandSoulSection,
  'curated-pathways': CuratedPathwaysSection,
  'experience-pillars': ExperiencePillarsSection,
  'sustained-harmony': SustainedHarmonySection,
  founder: FounderSection,
  'gallery-grid': GalleryGridSection,
  'blog-listing': BlogListingSection,
  newsletter: NewsletterSection,
  'contact-main': ContactMainSection,
  'instagram-preview': InstagramPreviewSection,
  'tpl-hero': HeroTemplate,
  'tpl-text': TextBlockTemplate,
  'tpl-image-text': ImageTextTemplate,
  'tpl-gallery': ImageGalleryTemplate,
  'tpl-features': FeatureCardsTemplate,
  'tpl-stats': StatisticsTemplate,
  'tpl-testimonials': TestimonialsTemplate,
  'tpl-cta': CtaTemplate,
  'tpl-video': VideoTemplate,
  'tpl-blog': BlogShowcaseTemplate,
};

const SectionView: React.FC<{ section: SectionInstance }> = ({ section }) => {
  const Component = REGISTRY[section.type];
  if (!Component) return null;
  const hasBackground = section.background && section.background !== 'default';
  return (
    <div data-cms-section={section.id} data-section-bg={hasBackground ? section.background : undefined} style={{ display: 'contents' }}>
      <Component content={section.content} />
    </div>
  );
};

export const PageRenderer: React.FC<{ pageId: PageId }> = ({ pageId }) => {
  const doc = useSiteContent();
  const page = doc.pages[pageId];
  const onlySection = previewSectionId();

  if (!page || page.status === 'unpublished') return <NotFound />;

  const sections = onlySection
    ? page.sections.filter((section) => section.id === onlySection)
    : page.sections.filter((section) => section.enabled);

  return (
    <div className="relative overflow-hidden bg-[#F6F4DE] text-knowza-dark">
      <SeoHead seo={page.seo} />
      {sections.map((section) => (
        <SectionView key={section.id} section={section} />
      ))}
    </div>
  );
};
