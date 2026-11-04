import type { ArticleBlock, BlogPostDoc, CMSDocument, GalleryItemDoc, PageDoc } from '../../types';
import { blogPosts } from '../../../data/blog';
import { galleryItems } from '../../../data/gallery';


const hero = (id: string, watermark: string, line1: string, highlight: string) => ({
  id,
  type: 'inner-hero',
  label: 'Page Hero',
  enabled: true,
  content: { watermark, eyebrow: '', line1, highlight, line2: '', subtitle: '', compact: false },
});

const closing = (id: string) => ({ id, type: 'closing-cta', label: 'Closing Invitation', enabled: true, content: {} });

export const seedGalleryPage = (): PageDoc => ({
  id: 'gallery',
  title: 'Gallery',
  path: '/gallery',
  status: 'published',
  seo: { title: '', description: '', image: '' },
  sections: [
    hero('gallery-hero', 'GALLERY', 'MOMENTS, PLACES &', 'QUIET ENCOUNTERS'),
    {
      id: 'gallery-grid',
      type: 'gallery-grid',
      label: 'Gallery & Filters',
      enabled: true,
      content: { layout: 'editorial', allLabel: 'ALL', showFilters: true, showCounts: true },
    },
    closing('gallery-closing'),
  ],
});

export const seedBlogPage = (): PageDoc => ({
  id: 'blog',
  title: 'Blog & Journal',
  path: '/blog',
  status: 'published',
  seo: { title: '', description: '', image: '' },
  sections: [
    hero('blog-hero', 'BLOG', 'STORIES FROM', 'THE LIVING JOURNEY'),
    {
      id: 'blog-listing',
      type: 'blog-listing',
      label: 'Article Listing',
      enabled: true,
      content: {
        allLabel: 'All',
        featuredBadge: 'SPOTLIGHT DISPATCH',
        featuredButton: 'Read Full Story',
        cardBylinePrefix: 'By',
        cardLinkLabel: 'Read',
        emptyMessage: 'No stories have been published in this category yet.',
      },
    },
    {
      id: 'blog-newsletter',
      type: 'newsletter',
      label: 'Newsletter',
      enabled: true,
      content: {
        eyebrow: 'THE SLOW DISPATCH',
        heading: 'Receive Essays on Nature & Culture',
        text: 'We send occasional letters reflecting on quiet living, seasonal rituals, and the keepers of ancient crafts. No noise, just deliberate stories.',
        placeholder: 'Enter your email address',
        button: 'Subscribe',
        success: 'Thank you. You have been welcomed into our journal circle.',
      },
    },
    closing('blog-closing'),
  ],
});

const instagramTile = (id: string, src: string, alt: string) => ({ id, image: { src, alt } });

export const seedContactPage = (): PageDoc => ({
  id: 'contact',
  title: 'Contact',
  path: '/contact',
  status: 'published',
  seo: { title: '', description: '', image: '' },
  sections: [
    hero('contact-hero', 'CONTACT', 'BEGIN YOUR JOURNEY', 'INTO DELIBERATE STILLNESS'),
    {
      id: 'contact-main',
      type: 'contact-main',
      label: 'Concierge & Enquiry Form',
      enabled: true,
      content: {
        desk: {
          eyebrow: 'DIRECT DESK',
          badge: 'Replies within 24h',
          heading: 'Sanctuary Liaison Desk',
          text: 'Every reservation and dialogue is handled individually by our resident hosts to ensure your stay aligns with personal pace and ecological respect.',
          generalLabel: 'General Enquiries',
          directLabel: 'Concierge Direct',
          phoneLabel: 'Phone',
          addressLabel: 'Address',
        },
        territory: {
          eyebrow: 'Territory & Presence',
          heading: 'Immersed in Southern Wilderness',
        },
        vignette: {
          image: { src: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760150/knowza/images/gallery/courtyard.jpg', alt: 'Heritage courtyard sanctuary' },
          eyebrow: 'HERITAGE RETREAT',
          quote: '"Doors crafted from reclaimed timber, welcoming quiet minds."',
        },
        form: {
          eyebrow: 'ENGAGE WITH US',
          heading: 'Sanctuary Enquiry Form',
          description: 'Please share your travel dates, preferred sanctuary, or collaboration ideas.',
          purposeLabel: 'Purpose of Enquiry',
          purposes: [
            { id: 'purpose-1', text: 'Stay / Experience' },
            { id: 'purpose-2', text: 'Private Retreat' },
            { id: 'purpose-3', text: 'Cultural Partnership' },
            { id: 'purpose-4', text: 'Media & Editorial' },
            { id: 'purpose-5', text: 'General Enquiry' },
          ],
          nameLabel: 'Full Name *',
          namePlaceholder: 'e.g. Maya Sundaram',
          nameError: 'Please provide your full name.',
          emailLabel: 'Email Address *',
          emailPlaceholder: 'maya@example.com',
          emailError: 'Please provide your email address.',
          emailInvalidError: 'Please enter a valid email address.',
          phoneLabel: 'Phone Number (Optional)',
          phonePlaceholder: '+91 (0) 00000 00000',
          messageLabel: 'Message / Journey Intentions *',
          messagePlaceholder: 'Share your intended season, number of travelers, retreat goals, or questions...',
          messageError: 'Please share your enquiry or message.',
          submitLabel: 'Send Sanctuary Enquiry',
          submittingLabel: 'Transmitting...',
          failureMessage: 'Your enquiry could not be saved. Please try again or write to us directly.',
          successHeading: 'Your Enquiry is Received',
          successText: 'Thank you, {name}. A sanctuary host will review your message and reach out with thoughtful details within 24 hours.',
          againLabel: 'Send Another Enquiry',
        },
      },
    },
    {
      id: 'contact-instagram',
      type: 'instagram-preview',
      label: 'Instagram Preview',
      enabled: true,
      content: {
        eyebrow: 'VISUAL CONNECTIONS',
        heading: 'Follow @knowzagroup',
        buttonLabel: 'Connect on Instagram',
        tiles: [
          instagramTile('tile-1', 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760165/knowza/images/nature/fern.png', 'Nature moments'),
          instagramTile('tile-2', 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760148/knowza/images/culture/meditation.png', 'Mindfulness moments'),
          instagramTile('tile-3', 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760153/knowza/images/gallery/tea-hills.jpg', 'Western Ghats tea hills'),
          instagramTile('tile-4', 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760147/knowza/images/connection/connection-hands.jpg', 'Human connection'),
        ],
      },
    },
    closing('contact-closing'),
  ],
});

export const seedGallery = (): CMSDocument['gallery'] => ({
  categories: ['NATURE', 'CULTURE', 'PLACES', 'PEOPLE', 'EXPERIENCES'].map((name) => ({
    id: `gcat-${name.toLowerCase()}`,
    name,
    description: '',
    enabled: true,
  })),
  items: galleryItems.map(
    (item): GalleryItemDoc => ({
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description,
      caption: '',
      image: item.image,
      alt: item.title,
      aspectRatio: item.aspectRatio ?? 'landscape',
      location: item.location ?? '',
      featured: Boolean(item.featured),
      enabled: true,
    })
  ),
});

const toBlocks = (post: (typeof blogPosts)[number]): ArticleBlock[] => {
  const blocks: ArticleBlock[] = [];
  post.content.forEach((text, index) => {
    blocks.push({ id: `${post.id}-p${index + 1}`, type: 'paragraph', text });
    // Same placement rules the original article template used.
    const inline = index === 1 ? post.inlineImages?.[0] : index === 3 ? post.inlineImages?.[1] : undefined;
    if (inline) {
      blocks.push({ id: `${post.id}-img${index}`, type: 'image', src: inline.src, alt: inline.caption, caption: inline.caption });
    }
    if (index === 2 && post.pullQuote) {
      blocks.push({ id: `${post.id}-quote`, type: 'quote', text: post.pullQuote.text, author: post.pullQuote.author ?? '' });
    }
  });
  return blocks;
};

export const seedBlog = (): CMSDocument['blog'] => ({
  categories: ['Nature', 'Culture', 'Travel', 'Experiences'].map((name) => ({
    id: `bcat-${name.toLowerCase()}`,
    name,
    description: '',
    enabled: true,
  })),
  posts: blogPosts.map(
    (post, index): BlogPostDoc => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      category: post.category,
      author: 'Knowza Curators',
      date: post.date,
      readTime: post.readTime,
      coverImage: post.coverImage,
      coverAlt: post.title,
      excerpt: post.excerpt,
      introduction: post.introduction,
      body: toBlocks(post),
      relatedSlugs: post.relatedSlugs ?? [],
      status: 'published',
      publishAt: '',
      featured: index === 0,
      seo: { title: '', description: '', image: '' },
    })
  ),
});


