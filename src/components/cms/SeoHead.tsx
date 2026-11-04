import React, { useEffect } from 'react';
import { useGlobal } from '../../cms/hooks/useSiteContent';
import type { SeoValue } from '../../cms/types';

const setMeta = (attribute: 'name' | 'property', key: string, value: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = value;
};

/** Page SEO values override the global defaults field by field. */
export const SeoHead: React.FC<{ seo?: Partial<SeoValue> }> = ({ seo }) => {
  const { defaultSeo } = useGlobal().brand;
  const title = seo?.title || defaultSeo.title;
  const description = seo?.description || defaultSeo.description;
  const image = seo?.image || defaultSeo.image;

  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:image', image);
  }, [title, description, image]);

  return null;
};
