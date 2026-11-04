import { makeButton, uid } from '../utils';
import { f, type Field } from './fields';

export interface SectionSchema {
  type: string;
  label: string;
  description: string;
  fields: Field[];
  /** False for sections whose own colours need a fixed dark background. */
  backgrounds?: boolean;
  /** Present on templates that can be added from the section library. */
  defaults?: () => any;
  /** Edits a shared value in global settings instead of section content. */
  sharedKey?: 'cta';
}

const stats = (key: string, label: string) =>
  f.list(key, label, 'statistic', (s) => s.label || 'Statistic', [
    f.number('value', 'Number', { half: true }),
    f.text('suffix', 'Suffix', { half: true, placeholder: '%' }),
    f.text('label', 'Label'),
    f.area('text', 'Description'),
    f.toggle('padZero', 'Pad with a leading zero', { half: true }),
    f.number('duration', 'Count-up seconds', { min: 0.2, max: 6, step: 0.1, half: true }),
  ], { newItem: () => ({ id: uid('stat'), value: 10, suffix: '', padZero: false, duration: 2, label: 'New statistic', text: '' }) });

const paragraphs = () =>
  f.list('paragraphs', 'Paragraphs', 'paragraph', (p) => (p.text || 'Paragraph').slice(0, 60), [f.area('text', 'Text')], {
    newItem: () => ({ id: uid('para'), text: 'New paragraph.' }),
  });

const headerFields = () => [f.text('eyebrow', 'Eyebrow'), f.text('heading', 'Heading'), f.area('description', 'Description')];

const pointFields = [
  f.text('number', 'Number', { half: true }),
  f.icon('icon', 'Icon', { half: true }),
  f.text('category', 'Category label'),
  f.text('title', 'Title'),
  f.area('text', 'Text'),
  f.text('highlight', 'Footer highlight'),
];

const northStarTab = (key: string, label: string, open = false) =>
  f.group(label, [
    f.text('tabLong', 'Tab label', { half: true }),
    f.text('tabShort', 'Tab label on mobile', { half: true }),
    f.image('image', 'Banner image'),
    f.text('badge', 'Banner badge'),
    f.text('statOne', 'Banner stat one', { half: true }),
    f.text('statTwo', 'Banner stat two', { half: true }),
    f.area('quote', 'Banner quote'),
    f.area('body', 'Banner description'),
    f.text('cornerNumber', 'Corner watermark number'),
    f.list('pills', 'Banner pills', 'pill', (p) => p.text || 'Pill', [f.icon('icon', 'Icon', { half: true }), f.text('text', 'Text', { half: true })], {
      newItem: () => ({ id: uid('pill'), icon: 'Leaf', text: 'New pill' }),
    }),
    f.list('points', `${label} cards`, 'card', (p) => `${p.number} · ${p.title}`, pointFields, {
      newItem: () => ({ id: uid('point'), number: '00', category: 'CATEGORY', title: 'New card', text: 'Card text.', highlight: 'Highlight', icon: 'Leaf' }),
    }),
  ], { key, open });

const pathwayTab = (key: string, label: string) =>
  f.group(label, [
    f.text('tabLong', 'Tab label', { half: true }),
    f.text('tabNumber', 'Tab number on mobile', { half: true }),
    f.text('tabShort', 'Tab label on mobile', { half: true }),
    f.text('tabShortest', 'Tab label on the smallest phones', { half: true }),
    f.text('tag', 'Tag'),
    f.text('title', 'Title'),
    f.area('text', 'Introduction'),
    f.image('image', 'Image'),
    f.icon('imageIcon', 'Image icon', { half: true }),
    f.text('imageEyebrow', 'Image label', { half: true }),
    f.text('imageCaption', 'Image caption'),
    f.text('pillarsHeading', 'Pillars heading'),
    f.list('pillars', 'Pillars', 'pillar', (p) => p.title || 'Pillar', [f.icon('icon', 'Icon'), f.text('title', 'Title'), f.area('text', 'Text')], {
      newItem: () => ({ id: uid('pillar'), icon: 'Leaf', title: 'New pillar', text: 'Pillar text.' }),
    }),
    f.area('footnote', 'Footnote'),
    f.text('ctaLabel', 'Button label', { half: true }),
    f.url('ctaUrl', 'Button URL', { half: true }),
  ], { key });

export const CTA_FIELDS: Field[] = [
  f.text('eyebrow', 'Eyebrow'),
  f.text('heading', 'Heading'),
  f.area('text', 'Description'),
  f.buttons('buttons', 'Buttons'),
  f.list('keywords', 'Keywords row', 'keyword', (k) => k.text || 'Keyword', [f.text('text', 'Text')], { newItem: () => ({ text: 'Keyword' }) }),
  f.color('background', 'Background colour'),
  f.image('texture', 'Background texture', { noAlt: true }),
  f.image('watermark', 'Corner watermark', { noAlt: true }),
];

const originals: SectionSchema[] = [
  {
    type: 'home-hero',
    label: 'Home Hero',
    description: 'Full-screen opening with the shrinking scroll effect.',
    backgrounds: false,
    fields: [
      f.text('eyebrow', 'Eyebrow'),
      f.group('Headline', [
        f.text('line1', 'Line one'),
        f.text('line2', 'Line two (olive accent)'),
        f.text('line3', 'Line three', { half: true }),
        f.text('line3b', 'Line three ending', { half: true }),
      ], { open: true }),
      f.buttons('buttons', 'Buttons'),
      f.image('image', 'Background image'),
      f.video('video', 'Background video', { help: 'Optional. When a video is chosen it replaces the background image.' }),
    ],
  },
  {
    type: 'brand-statement',
    label: 'Brand Statement',
    description: 'Counters beside the typewriter statement.',
    fields: [
      f.text('eyebrow', 'Eyebrow'),
      stats('stats', 'Counters'),
      f.group('Statement heading', [
        f.area('headingStart', 'Opening words'),
        f.text('headingHighlight', 'Highlighted words'),
        f.area('headingEnd', 'Closing words'),
      ], { open: true }),
      f.area('paragraphOne', 'First paragraph'),
      f.area('paragraphTwo', 'Second paragraph'),
      f.buttons('buttons', 'Buttons'),
    ],
  },
  {
    type: 'sanctuary-features',
    label: 'Sanctuary Features',
    description: 'Three-across image cards that drop in on scroll.',
    fields: [
      f.list('cards', 'Feature cards', 'card', (c) => c.title || 'Card', [
        f.text('title', 'Title'),
        f.area('description', 'Description'),
        f.image('image', 'Image'),
      ], { newItem: () => ({ id: uid('feature'), title: 'New sanctuary', description: 'Description.', image: { src: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760150/knowza/images/gallery/courtyard.jpg', alt: '' } }) }),
    ],
  },
  {
    type: 'offerings',
    label: 'Offerings',
    description: 'Hospitality and healing pathway cards.',
    fields: [
      f.text('tagline', 'Eyebrow'),
      f.text('heading', 'Heading'),
      f.area('subtitle', 'Subtitle'),
      f.list('cards', 'Offering cards', 'offering', (c) => c.title || 'Offering', [
        f.text('tag', 'Tag', { half: true }),
        f.text('badge', 'Image badge', { half: true }),
        f.icon('badgeIcon', 'Badge icon'),
        f.text('title', 'Title'),
        f.area('description', 'Description'),
        f.image('image', 'Image'),
        f.text('ctaText', 'Button label', { half: true }),
        f.url('ctaUrl', 'Button URL', { half: true }),
        f.select('buttonVariant', 'Button style', [['dark', 'Dark'], ['olive', 'Olive'], ['outline', 'Outline']]),
      ], { newItem: () => ({ id: uid('offering'), tag: '03 / NEW', badge: 'New offering', badgeIcon: 'Sparkles', title: 'New offering', description: 'Description.', image: { src: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760169/knowza/images/offerings/sanctuary-cabin.jpg', alt: '' }, ctaText: 'LEARN MORE', ctaUrl: '/contact', buttonVariant: 'dark' }) }),
    ],
  },
  {
    type: 'foundations',
    label: 'Foundations',
    description: 'Bento grid of the four guiding principles.',
    fields: [
      f.text('eyebrow', 'Eyebrow'),
      f.text('heading', 'Heading'),
      f.area('description', 'Description'),
      f.group('Card 1 · Rooted in Place', [f.text('tag', 'Tag'), f.text('title', 'Title'), f.area('text', 'Text')], { key: 'rooted' }),
      f.group('Card 2 · Shaped by Culture', [f.text('tag', 'Tag'), f.text('title', 'Title'), f.area('text', 'Text')], { key: 'culture' }),
      f.group('Card 3 · Connected by Heart', [f.text('tag', 'Tag'), f.text('title', 'Title'), f.area('text', 'Text'), f.image('image', 'Background image')], { key: 'connection' }),
      f.group('Card 4 · Thoughtfully Experienced', [
        f.text('tag', 'Tag'),
        f.text('title', 'Title'),
        f.area('text', 'Text'),
        f.text('subTitle', 'Lower heading'),
        f.area('subText', 'Lower text'),
        f.buttons('buttons', 'Buttons'),
      ], { key: 'experienced' }),
    ],
  },
  {
    type: 'moments',
    label: 'Moments from Knowza',
    description: 'Olive band with the scrolling photo marquee.',
    backgrounds: false,
    fields: [
      f.text('eyebrow', 'Eyebrow'),
      f.text('heading', 'Heading'),
      f.text('watermark', 'Background watermark word'),
      f.button('button', 'Button'),
      f.list('cards', 'Marquee cards', 'card', (c) => c.title || 'Card', [
        f.text('title', 'Title'),
        f.text('category', 'Category', { half: true }),
        f.url('url', 'Link', { half: true }),
        f.image('image', 'Image'),
      ], { newItem: () => ({ id: uid('moment'), title: 'New moment', category: 'PLACES', url: '/gallery', image: { src: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760150/knowza/images/gallery/peace-meadow.jpg', alt: '' } }) }),
    ],
  },
  {
    type: 'dispatches',
    label: 'Dispatches',
    description: 'Interactive card that cycles through published articles.',
    fields: [
      f.text('eyebrow', 'Eyebrow'),
      f.text('heading', 'Heading'),
      f.buttons('buttons', 'Buttons'),
      f.text('readLabel', 'Read button label', { half: true }),
      f.text('counterLabel', 'Counter text', { half: true, help: 'Use {current} and {total}.' }),
      f.number('limit', 'Articles to show', { min: 0, help: '0 shows every published article.' }),
    ],
  },
  {
    type: 'closing-cta',
    label: 'Closing Invitation',
    description: 'Shared closing call to action.',
    backgrounds: false,
    sharedKey: 'cta',
    fields: CTA_FIELDS,
  },
  {
    type: 'inner-hero',
    label: 'Page Hero',
    description: 'Editorial title with a parallax watermark.',
    fields: [
      f.text('watermark', 'Watermark word'),
      f.text('eyebrow', 'Eyebrow'),
      f.text('line1', 'Title line one'),
      f.text('highlight', 'Title highlight (olive)'),
      f.text('line2', 'Title line two'),
      f.area('subtitle', 'Subtitle'),
      f.toggle('compact', 'Reduce the space below the hero'),
    ],
  },
  {
    type: 'sanctuary-banner',
    label: 'Sanctuary Banner',
    description: 'Cinematic image banner with quote.',
    fields: [f.image('image', 'Banner image'), f.text('eyebrow', 'Eyebrow'), f.area('quote', 'Quote'), f.buttons('buttons', 'Buttons')],
  },
  {
    type: 'north-star',
    label: 'Vision, Mission & Values',
    description: 'Three-tab showcase with banner and cards.',
    fields: [
      f.text('eyebrow', 'Eyebrow'),
      f.text('heading', 'Heading'),
      f.area('description', 'Description'),
      f.text('watermark', 'Background watermark', { half: true }),
      f.text('pointLabel', 'Card number label', { half: true }),
      northStarTab('vision', 'Vision', true),
      northStarTab('mission', 'Mission'),
      northStarTab('values', 'Values'),
    ],
  },
  {
    type: 'roadmap',
    label: 'Growth & Expansion Roadmap',
    description: 'Photographic stages with a focus timeline.',
    fields: [
      ...headerFields(),
      f.text('watermark', 'Background watermark'),
      f.list('stages', 'Roadmap stages', 'stage', (s) => `${s.stageNumber} · ${s.title}`, [
        f.text('stageNumber', 'Number', { half: true }),
        f.text('durationBadge', 'Year badge', { half: true }),
        f.text('stageBadge', 'Stage badge', { half: true }),
        f.select('dotAccent', 'Badge dot colour', [['bronze', 'Bronze'], ['olive', 'Olive'], ['dark', 'Dark']], { half: true }),
        f.text('title', 'Title'),
        f.text('horizonTag', 'Tag'),
        f.area('quote', 'Quote'),
        f.image('image', 'Background image'),
        f.text('targetRegion', 'Viewfinder region', { half: true }),
        f.text('coordinates', 'Viewfinder coordinates', { half: true }),
        f.list('highlights', 'Highlights', 'highlight', (h) => (h.text || 'Highlight').slice(0, 50), [f.icon('icon', 'Icon'), f.area('text', 'Text')], {
          newItem: () => ({ id: uid('hl'), icon: 'Leaf', text: 'New highlight' }),
        }),
        f.text('phaseStatus', 'Status', { half: true }),
        f.text('timeframe', 'Timeframe', { half: true }),
      ], { newItem: () => ({ id: uid('stage'), stageNumber: '04', stageBadge: 'STAGE 04', durationBadge: 'YEAR', dotAccent: 'olive', title: 'New stage', horizonTag: '04 / NEW', quote: 'Stage quote.', image: { src: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760149/knowza/images/gallery/backwater.jpg', alt: '' }, targetRegion: 'Region', coordinates: '', highlights: [], phaseStatus: 'Planned', timeframe: 'Target' }) }),
    ],
  },
  {
    type: 'brand-soul',
    label: 'Brand Soul',
    description: 'Counters, typewriter heading and quote card.',
    fields: [
      f.text('eyebrow', 'Eyebrow'),
      stats('stats', 'Counters'),
      f.area('headingStart', 'Heading opening'),
      f.text('headingHighlight', 'Heading highlight'),
      f.area('paragraphOne', 'First paragraph'),
      f.area('paragraphTwo', 'Second paragraph'),
      f.text('quoteTitle', 'Quote card title'),
      f.area('quoteText', 'Quote card text'),
    ],
  },
  {
    type: 'curated-pathways',
    label: 'Curated Pathways',
    description: 'Two-tab pathway panel.',
    fields: [...headerFields(), pathwayTab('hospitality', 'Hospitality pathway'), pathwayTab('healing', 'Healing pathway')],
  },
  {
    type: 'experience-pillars',
    label: 'Pillars of Experience',
    description: 'Nature, Culture and Connection cards.',
    fields: [
      ...headerFields(),
      f.list('cards', 'Pillars', 'pillar', (c) => `${c.tag} · ${c.title}`, [f.text('tag', 'Tag'), f.text('title', 'Title'), f.area('text', 'Text'), f.image('image', 'Image')], {
        newItem: () => ({ id: uid('pillar'), tag: '04 / NEW', title: 'New pillar', text: 'Pillar text.', image: { src: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760150/knowza/images/gallery/courtyard.jpg', alt: '' } }),
      }),
    ],
  },
  {
    type: 'sustained-harmony',
    label: 'Sustained Harmony',
    description: 'Opposing-parallax image pair with story.',
    fields: [
      f.text('eyebrow', 'Eyebrow'),
      f.text('heading', 'Heading'),
      paragraphs(),
      f.image('imageLeft', 'Left image'),
      f.image('imageRight', 'Right image'),
      f.buttons('buttons', 'Buttons'),
    ],
  },
  {
    type: 'founder',
    label: 'Founder Section',
    description: "Founder's portrait, letter and charter.",
    fields: [
      f.group('Founder details', [
        f.image('portrait', 'Portrait'),
        f.text('name', 'Name', { half: true }),
        f.text('role', 'Role', { half: true }),
        f.text('origin', 'Origin line'),
        f.area('conviction', 'Conviction quote'),
        f.text('convictionLabel', 'Conviction label'),
      ], { open: true }),
      f.group("Founder's letter", [
        f.text('noteLabel', 'Note label'),
        f.area('headingStart', 'Heading opening'),
        f.area('headingHighlight', 'Heading highlight'),
        f.text('dropCap', 'Drop cap letter', { help: 'The first paragraph continues straight after this letter.' }),
        f.area('paragraphOne', 'First paragraph'),
        f.text('calloutLabel', 'Callout label'),
        f.area('callout', 'Callout'),
        f.area('paragraphTwo', 'Closing paragraph'),
        f.text('endorsementLabel', 'Signature label'),
        f.text('signatureName', 'Signature name', { half: true }),
        f.text('signatureRole', 'Signature role', { half: true }),
      ]),
      f.text('charterButton', 'Charter button label'),
      f.group('Founding Covenant & Earth Charter', [
        f.text('eyebrow', 'Eyebrow'),
        f.text('title', 'Title'),
        f.text('authorised', 'Authorised by'),
        f.list('articles', 'Charter articles', 'article', (a) => a.title || 'Article', [f.text('title', 'Title'), f.area('text', 'Text')], {
          newItem: () => ({ id: uid('article'), title: 'New article', text: 'Article text.' }),
        }),
        f.text('signName', 'Sign-off name', { half: true }),
        f.text('signRole', 'Sign-off role', { half: true }),
        f.text('seal', 'Seal text'),
      ], { key: 'charter' }),
    ],
  },
  {
    type: 'gallery-grid',
    label: 'Gallery & Filters',
    description: 'Filter bar and image grid. Images are managed in the Gallery manager.',
    fields: [
      f.select('layout', 'Layout', [['editorial', 'Editorial (original)'], ['grid', 'Even grid'], ['masonry', 'Masonry']]),
      f.text('allLabel', '"All" filter label'),
      f.toggle('showFilters', 'Show the filter bar', { half: true }),
      f.toggle('showCounts', 'Show filter counts', { half: true }),
    ],
  },
  {
    type: 'blog-listing',
    label: 'Article Listing',
    description: 'Category tabs, featured article and article grid. Articles are managed in Blog & Journal.',
    fields: [
      f.text('allLabel', '"All" filter label'),
      f.text('featuredBadge', 'Featured badge', { half: true }),
      f.text('featuredButton', 'Featured button label', { half: true }),
      f.text('cardBylinePrefix', 'Byline prefix', { half: true }),
      f.text('cardLinkLabel', 'Card link label', { half: true }),
      f.text('emptyMessage', 'Empty category message'),
    ],
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    description: 'Dark subscription panel.',
    fields: [
      f.text('eyebrow', 'Eyebrow'),
      f.text('heading', 'Heading'),
      f.area('text', 'Description'),
      f.text('placeholder', 'Email placeholder', { half: true }),
      f.text('button', 'Button label', { half: true }),
      f.text('success', 'Success message'),
    ],
  },
  {
    type: 'contact-main',
    label: 'Concierge & Enquiry Form',
    description: 'Concierge card, location, image and enquiry form.',
    fields: [
      f.group('Concierge desk', [
        f.text('eyebrow', 'Eyebrow', { half: true }),
        f.text('badge', 'Badge', { half: true }),
        f.text('heading', 'Heading'),
        f.area('text', 'Description'),
        f.text('generalLabel', 'General email label', { half: true }),
        f.text('directLabel', 'Direct email label', { half: true }),
        f.text('phoneLabel', 'Phone label', { half: true, help: 'Shown when a phone number is set.' }),
        f.text('addressLabel', 'Address label', { half: true, help: 'Shown when an address is set.' }),
      ], { key: 'desk', open: true, help: 'Email, phone, address and hours are set under Contact details.' }),
      f.group('Territory card', [f.text('eyebrow', 'Eyebrow'), f.text('heading', 'Heading')], { key: 'territory' }),
      f.group('Image vignette', [f.image('image', 'Image'), f.text('eyebrow', 'Label'), f.text('quote', 'Quote')], { key: 'vignette' }),
      f.group('Enquiry form', [
        f.text('eyebrow', 'Eyebrow'),
        f.text('heading', 'Heading'),
        f.area('description', 'Description'),
        f.text('purposeLabel', 'Purpose label'),
        f.list('purposes', 'Purpose options', 'option', (p) => p.text || 'Option', [f.text('text', 'Text')], { newItem: () => ({ id: uid('purpose'), text: 'New option' }) }),
        f.text('nameLabel', 'Name label', { half: true }),
        f.text('namePlaceholder', 'Name placeholder', { half: true }),
        f.text('nameError', 'Name error'),
        f.text('emailLabel', 'Email label', { half: true }),
        f.text('emailPlaceholder', 'Email placeholder', { half: true }),
        f.text('emailError', 'Missing email error', { half: true }),
        f.text('emailInvalidError', 'Invalid email error', { half: true }),
        f.text('phoneLabel', 'Phone label', { half: true }),
        f.text('phonePlaceholder', 'Phone placeholder', { half: true }),
        f.text('messageLabel', 'Message label', { half: true }),
        f.text('messagePlaceholder', 'Message placeholder', { half: true }),
        f.text('messageError', 'Message error'),
        f.text('submitLabel', 'Submit label', { half: true }),
        f.text('submittingLabel', 'Submitting label', { half: true }),
        f.text('failureMessage', 'Error message'),
        f.text('successHeading', 'Confirmation heading'),
        f.area('successText', 'Confirmation message', { help: 'Use {name} for the sender.' }),
        f.text('againLabel', 'Send another label'),
      ], { key: 'form' }),
    ],
  },
  {
    type: 'instagram-preview',
    label: 'Instagram Preview',
    description: 'Image tiles linking to Instagram. The link is set under Social Media.',
    fields: [
      f.text('eyebrow', 'Eyebrow'),
      f.text('heading', 'Heading'),
      f.text('buttonLabel', 'Button label'),
      f.list('tiles', 'Image tiles', 'tile', (t, i) => t.image?.alt || `Tile ${i + 1}`, [f.image('image', 'Image')], {
        newItem: () => ({ id: uid('tile'), image: { src: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760150/knowza/images/gallery/peace-meadow.jpg', alt: '' } }),
      }),
    ],
  },
];

const IMG = 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760150/knowza/images/gallery/courtyard.jpg';

const templates: SectionSchema[] = [
  {
    type: 'tpl-hero',
    label: 'Hero',
    description: 'Image-led banner with headline and buttons.',
    backgrounds: false,
    fields: [...headerFields(), f.image('image', 'Background image'), f.buttons('buttons', 'Buttons')],
    defaults: () => ({ eyebrow: 'EYEBROW', heading: 'A New Headline', description: 'A short supporting line.', image: { src: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760156/knowza/images/hero/hero-sanctuary.jpg', alt: '' }, buttons: [makeButton('Learn More', '/about', 'white-fill', 'up-right')] }),
  },
  {
    type: 'tpl-text',
    label: 'Text Block',
    description: 'Editorial heading with paragraphs.',
    fields: [...headerFields(), f.select('align', 'Alignment', [['center', 'Centred'], ['left', 'Left']]), paragraphs(), f.buttons('buttons', 'Buttons')],
    defaults: () => ({ eyebrow: 'EYEBROW', heading: 'A New Heading', description: '', align: 'center', paragraphs: [{ id: uid('para'), text: 'Write your text here.' }], buttons: [] }),
  },
  {
    type: 'tpl-image-text',
    label: 'Image with Text',
    description: 'Image beside a heading, text and buttons.',
    fields: [f.text('eyebrow', 'Eyebrow'), f.text('heading', 'Heading'), paragraphs(), f.image('image', 'Image', { ratio: true }), f.select('imageSide', 'Image side', [['left', 'Left'], ['right', 'Right']]), f.buttons('buttons', 'Buttons')],
    defaults: () => ({ eyebrow: 'EYEBROW', heading: 'A New Heading', paragraphs: [{ id: uid('para'), text: 'Write your text here.' }], image: { src: IMG, alt: '' }, imageSide: 'left', buttons: [] }),
  },
  {
    type: 'tpl-gallery',
    label: 'Image Gallery',
    description: 'Grid of captioned images.',
    fields: [...headerFields(), f.list('images', 'Images', 'image', (i, n) => i.caption || `Image ${n + 1}`, [f.image('image', 'Image', { ratio: true }), f.text('caption', 'Caption')], { newItem: () => ({ id: uid('img'), image: { src: IMG, alt: '' }, caption: '' }) })],
    defaults: () => ({ eyebrow: '', heading: 'Image Gallery', description: '', images: [{ id: uid('img'), image: { src: IMG, alt: '' }, caption: '' }] }),
  },
  {
    type: 'tpl-features',
    label: 'Feature Cards',
    description: 'Icon cards in a responsive grid.',
    fields: [...headerFields(), f.list('cards', 'Cards', 'card', (c) => c.title || 'Card', [f.icon('icon', 'Icon'), f.text('title', 'Title'), f.area('text', 'Text')], { newItem: () => ({ id: uid('card'), icon: 'Leaf', title: 'New feature', text: 'Feature text.' }) }), f.buttons('buttons', 'Buttons')],
    defaults: () => ({ eyebrow: 'FEATURES', heading: 'What Sets Us Apart', description: '', cards: [{ id: uid('card'), icon: 'Leaf', title: 'New feature', text: 'Feature text.' }], buttons: [] }),
  },
  {
    type: 'tpl-stats',
    label: 'Statistics',
    description: 'Animated counters.',
    fields: [...headerFields(), f.list('stats', 'Statistics', 'statistic', (s) => s.label || 'Statistic', [f.number('value', 'Number', { half: true }), f.text('suffix', 'Suffix', { half: true }), f.text('label', 'Label'), f.text('text', 'Description'), f.toggle('padZero', 'Pad with a leading zero')], { newItem: () => ({ id: uid('stat'), value: 10, suffix: '', label: 'New statistic', text: '', padZero: false }) })],
    defaults: () => ({ eyebrow: '', heading: 'In Numbers', description: '', stats: [{ id: uid('stat'), value: 10, suffix: '', label: 'New statistic', text: '', padZero: false }] }),
  },
  {
    type: 'tpl-testimonials',
    label: 'Testimonials',
    description: 'Guest quotes.',
    fields: [...headerFields(), f.list('items', 'Testimonials', 'testimonial', (t) => t.name || 'Testimonial', [f.area('quote', 'Quote'), f.text('name', 'Name', { half: true }), f.text('role', 'Role', { half: true })], { newItem: () => ({ id: uid('quote'), quote: 'Add a real guest quote here.', name: 'Guest name', role: '' }) })],
    defaults: () => ({ eyebrow: 'GUEST VOICES', heading: 'In Their Words', description: '', items: [{ id: uid('quote'), quote: 'Add a real guest quote here.', name: 'Guest name', role: '' }] }),
  },
  {
    type: 'tpl-cta',
    label: 'Call to Action',
    description: 'A separate CTA with its own text and buttons.',
    backgrounds: false,
    fields: CTA_FIELDS,
    defaults: () => ({ background: '#79864B', texture: { src: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760141/knowza/images/brand/forest-texture.png', alt: '' }, watermark: { src: 'https://res.cloudinary.com/mg4ku51f/image/upload/v1793760161/knowza/images/logo/knowza-mark-light.png', alt: '' }, eyebrow: 'AN INVITATION', heading: 'A New Invitation.', text: 'A short supporting line.', buttons: [makeButton('Contact Us', '/contact', 'white-fill', 'up-right')], keywords: [] }),
  },
  {
    type: 'tpl-video',
    label: 'Video',
    description: 'Framed video player.',
    fields: [...headerFields(), f.video('video', 'Video')],
    defaults: () => ({ eyebrow: '', heading: 'Watch', description: '', video: { src: '', poster: IMG, autoplay: false, muted: false, loop: false, controls: true } }),
  },
  {
    type: 'tpl-blog',
    label: 'Blog Showcase',
    description: 'Latest published articles.',
    fields: [...headerFields(), f.number('limit', 'Articles to show', { min: 1, max: 9 }), f.text('linkLabel', 'Link label')],
    defaults: () => ({ eyebrow: 'DISPATCHES', heading: 'Latest Stories', description: '', limit: 3, linkLabel: 'Read Article' }),
  },
];

export const SECTION_SCHEMAS: Record<string, SectionSchema> = Object.fromEntries(
  [...originals, ...templates].map((schema) => [schema.type, schema])
);

export const TEMPLATE_SCHEMAS = templates;

// ---------------------------------------------------------------------------
// Global settings schemas
// ---------------------------------------------------------------------------

const navList = (key: string, label: string) =>
  f.list(key, label, 'link', (l) => `${l.label || 'Link'} → ${l.url}`, [f.text('label', 'Label', { half: true }), f.url('url', 'URL', { half: true }), f.toggle('enabled', 'Visible')], {
    newItem: () => ({ id: uid('nav'), label: 'NEW LINK', url: '/', enabled: true }),
  });

export const BRAND_FIELDS: Field[] = [
  f.group('Identity', [f.text('brandName', 'Brand name')], { open: true }),
];

export const HEADER_FIELDS: Field[] = [
  f.toggle('visible', 'Show the header'),
  f.group('Logo', [
    f.imageUrl('logoLight', 'Logo on dark backgrounds'),
    f.imageUrl('logoDark', 'Logo on light backgrounds'),
    f.text('logoAlt', 'Logo alt text'),
    f.number('logoHeight', 'Logo height in pixels', { min: 0, max: 96, help: '0 keeps the original responsive size.' }),
  ], { open: true }),
  navList('nav', 'Navigation'),
  f.number('leftCount', 'Links left of the logo', { min: 0, max: 8, help: 'The remaining links sit to the right.' }),
  f.group('Header button', [f.toggle('ctaVisible', 'Show the button'), f.text('ctaLabel', 'Label', { half: true }), f.url('ctaUrl', 'URL', { half: true })]),
  f.group('Mobile menu', [
    f.text('mobileCtaLabel', 'Button label', { half: true }),
    f.url('mobileCtaUrl', 'Button URL', { half: true }),
    f.toggle('mobileShowNumbers', 'Show link numbers'),
    f.text('mobileFooterLeft', 'Footer text left', { half: true }),
    f.text('mobileFooterRight', 'Footer text right', { half: true }),
  ]),
];

export const FOOTER_FIELDS: Field[] = [
  f.group('Brand column', [f.imageUrl('logo', 'Footer logo'), f.text('logoAlt', 'Logo alt text'), f.area('description', 'Brand description'), f.text('tagline', 'Tagline'), f.color('background', 'Background colour')], { open: true }),
  f.group('Connect column', [f.text('connectHeading', 'Heading'), f.area('connectText', 'Text'), f.text('contactEmail', 'Email')], { help: 'Social links here come from Social Media.' }),
  f.group('Newsletter', [
    f.toggle('newsletterEnabled', 'Show a newsletter form in the footer'),
    f.text('newsletterHeading', 'Heading'),
    f.text('newsletterText', 'Text'),
    f.text('newsletterPlaceholder', 'Placeholder', { half: true }),
    f.text('newsletterButton', 'Button label', { half: true }),
    f.text('newsletterSuccess', 'Success message'),
  ]),
  f.group('Bottom bar', [
    f.text('copyright', 'Copyright', { help: 'Use {year} and {brand}.' }),
    f.text('creditLabel', 'Credit label', { half: true }),
    f.text('creditName', 'Credit name', { half: true }),
    f.url('creditUrl', 'Credit URL'),
    f.text('bottomLeft', 'Right text one', { half: true }),
    f.text('bottomRight', 'Right text two', { half: true }),
  ]),
];

export const CONTACT_DETAIL_FIELDS: Field[] = [
  f.text('generalEnquiries', 'General enquiries email', { half: true }),
  f.text('email', 'Concierge email', { half: true }),
  f.text('phone', 'Phone number', { half: true, help: 'Appears on the contact page when set.' }),
  f.text('officeSchedule', 'Business hours', { half: true }),
  f.area('address', 'Address', { help: 'Appears on the contact page when set.' }),
  f.area('locationContext', 'Location description'),
];

const FONT_OPTIONS: [string, string][] = [
  ['', 'Original (Tenor Sans)'],
  ['Tenor Sans', 'Tenor Sans'],
  ['Cormorant Garamond', 'Cormorant Garamond'],
  ['Playfair Display', 'Playfair Display'],
  ['Lora', 'Lora'],
  ['Montserrat', 'Montserrat'],
  ['DM Sans', 'DM Sans'],
  ['Manrope', 'Manrope'],
  ['Inter', 'Inter'],
];

export const TYPOGRAPHY_FIELDS: Field[] = [
  f.select('headingFont', 'Heading font', FONT_OPTIONS, { half: true }),
  f.select('bodyFont', 'Body font', FONT_OPTIONS, { half: true }),
  f.text('h1Size', 'H1 size', { half: true, placeholder: 'Original' }),
  f.text('h2Size', 'H2 size', { half: true, placeholder: 'Original' }),
  f.text('h3Size', 'H3 size', { half: true, placeholder: 'Original' }),
  f.text('paragraphSize', 'Paragraph size', { half: true, placeholder: 'Original' }),
  f.text('lineHeight', 'Paragraph line height', { half: true, placeholder: 'Original' }),
  f.text('letterSpacing', 'Heading letter spacing', { half: true, placeholder: 'Original' }),
  f.select('headingWeight', 'Heading weight', [['', 'Original'], ['300', 'Light'], ['400', 'Regular'], ['500', 'Medium'], ['600', 'Semibold'], ['700', 'Bold']], { half: true }),
  f.select('bodyWeight', 'Body weight', [['', 'Original'], ['300', 'Light'], ['400', 'Regular'], ['500', 'Medium'], ['600', 'Semibold']], { half: true }),
];

export const DESIGN_FIELDS: Field[] = [
  f.group('Brand colours', [
    f.color('olive', 'Olive Grove', { help: 'Original #79864B', half: true }),
    f.color('bronze', 'Warm Bronze', { help: 'Original #8A7D4C', half: true }),
    f.color('deep', 'Deep Forest', { help: 'Original #28351F', half: true }),
    f.color('dew', 'Morning Dew', { help: 'Original #EEE9BF', half: true }),
  ], { open: true, help: 'Leave a colour empty to keep the original.' }),
  f.group('Backgrounds and text', [
    f.color('canvas', 'Page background', { help: 'Original #F6F4DE', half: true }),
    f.color('surface', 'Card surface', { help: 'Original #FAF9F2', half: true }),
    f.color('text', 'Text', { help: 'Original #25271F', half: true }),
  ], { open: true }),
  f.group('Shapes and images', [
    f.text('buttonRadius', 'Button radius', { half: true, placeholder: 'Original' }),
    f.text('cardRadius', 'Card radius', { half: true, placeholder: 'Original' }),
    f.text('imageBrightness', 'Image brightness', { placeholder: 'Original', help: 'A multiplier such as 0.95.' }),
  ], { open: true }),
];

export const SYSTEM_FIELDS: Field[] = [
  f.group('404 page', [
    f.text('eyebrow', 'Eyebrow'),
    f.text('code', 'Large code'),
    f.text('heading', 'Heading'),
    f.area('text', 'Text'),
    f.text('buttonLabel', 'Button label', { half: true }),
    f.url('buttonUrl', 'Button URL', { half: true }),
  ], { key: 'notFound', open: true }),
  f.group('Article page', [
    f.text('backLabel', 'Back link label', { half: true }),
    f.url('backUrl', 'Back link URL', { half: true }),
    f.text('footerLabel', 'Article footer label'),
    f.text('relatedEyebrow', 'Related eyebrow', { half: true }),
    f.text('relatedHeading', 'Related heading', { half: true }),
    f.text('relatedLinkLabel', 'Related link label'),
    f.text('missingEyebrow', 'Missing article eyebrow', { half: true }),
    f.text('missingHeading', 'Missing article heading', { half: true }),
    f.area('missingText', 'Missing article text'),
    f.text('missingButton', 'Missing article button'),
  ], { key: 'blogDetail', open: true }),
];
