import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Quote } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { Counter } from '../components/Counter';
import { CTASection } from '../components/CTASection';
import { CmsButton } from '../components/cms/CmsLink';
import { CmsIcon } from '../components/cms/icons';
import { useLivePosts } from '../cms/hooks/useSiteContent';
import { imageStyle } from '../cms/utils';

// Controlled templates admins can add to any page. They reuse the site's tokens,
// containers and buttons so new sections stay inside the KNOWZA design system.

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8 },
};

const SectionHeader: React.FC<{ content: any; center?: boolean }> = ({ content, center = true }) =>
  content.eyebrow || content.heading || content.description ? (
    <motion.div {...reveal} className={`max-w-3xl mb-10 sm:mb-14 space-y-4 ${center ? 'mx-auto text-center' : ''}`}>
      {content.eyebrow && <SectionLabel label={content.eyebrow} color="olive" alignment={center ? 'center' : 'left'} />}
      {content.heading && (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal tracking-tight">{content.heading}</h2>
      )}
      {content.description && (
        <p className="text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">{content.description}</p>
      )}
    </motion.div>
  ) : null;

const Buttons: React.FC<{ buttons?: any[]; center?: boolean }> = ({ buttons, center }) =>
  buttons?.length ? (
    <div className={`pt-2 flex flex-wrap gap-3 ${center ? 'justify-center' : ''}`}>
      {buttons.map((button) => (
        <CmsButton
          key={button.id}
          button={button}
          className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs uppercase tracking-wider font-medium group"
          arrowClass="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
          plainClass="text-knowza-dark hover:text-knowza-forest"
        />
      ))}
    </div>
  ) : null;

const shell = 'py-16 sm:py-20 md:py-28 bg-[#F6F4DE] border-t border-black/5 relative overflow-hidden';

export const HeroTemplate: React.FC<{ content: any }> = ({ content }) => (
  <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-knowza-deep text-white px-4 py-28 sm:py-36">
    {content.image?.src && (
      <img
        src={content.image.src}
        alt={content.image.alt}
        style={imageStyle(content.image)}
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.78] contrast-[1.08]"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/55" />
    <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
      {content.eyebrow && (
        <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.28em] text-knowza-cream/80 block font-medium">{content.eyebrow}</span>
      )}
      <h1 className="font-display font-black italic uppercase text-3xl sm:text-5xl lg:text-[62px] text-[#ECE7D7] tracking-[0.03em] leading-[1.02]">{content.heading}</h1>
      {content.description && <p className="text-sm sm:text-base font-sans text-white/85 font-light leading-relaxed max-w-2xl mx-auto">{content.description}</p>}
      <Buttons buttons={content.buttons} center />
    </div>
  </section>
);

export const TextBlockTemplate: React.FC<{ content: any }> = ({ content }) => (
  <section className={shell}>
    <Container>
      <SectionHeader content={content} center={content.align !== 'left'} />
      <div className={`max-w-3xl space-y-5 ${content.align !== 'left' ? 'mx-auto text-center' : ''}`}>
        {content.paragraphs?.map((p: any) => (
          <p key={p.id} className="text-sm sm:text-base font-sans text-knowza-dark/80 font-light leading-relaxed">{p.text}</p>
        ))}
        <Buttons buttons={content.buttons} center={content.align !== 'left'} />
      </div>
    </Container>
  </section>
);

export const ImageTextTemplate: React.FC<{ content: any }> = ({ content }) => (
  <section className={shell}>
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        <motion.div
          {...reveal}
          className={`lg:col-span-6 rounded-[28px] overflow-hidden shadow-md border border-black/5 bg-knowza-deep ${content.imageSide === 'right' ? 'lg:order-2' : ''}`}
          style={{ aspectRatio: content.image?.ratio || '4 / 3' }}
        >
          <img src={content.image?.src} alt={content.image?.alt} style={imageStyle(content.image)} className="w-full h-full object-cover" loading="lazy" />
        </motion.div>
        <div className="lg:col-span-6 space-y-5">
          {content.eyebrow && <SectionLabel label={content.eyebrow} color="olive" />}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-knowza-dark font-normal leading-tight">{content.heading}</h2>
          {content.paragraphs?.map((p: any) => (
            <p key={p.id} className="text-sm md:text-base font-sans text-knowza-dark/75 font-light leading-relaxed">{p.text}</p>
          ))}
          <Buttons buttons={content.buttons} />
        </div>
      </div>
    </Container>
  </section>
);

export const ImageGalleryTemplate: React.FC<{ content: any }> = ({ content }) => (
  <section className={shell}>
    <Container>
      <SectionHeader content={content} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {content.images?.map((item: any) => (
          <motion.figure key={item.id} {...reveal} className="space-y-2">
            <div className="rounded-[24px] overflow-hidden shadow-sm border border-black/5 bg-knowza-deep" style={{ aspectRatio: item.image?.ratio || '4 / 3' }}>
              <img src={item.image?.src} alt={item.image?.alt} style={imageStyle(item.image)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            {item.caption && <figcaption className="text-xs font-sans text-knowza-dark/70 text-center italic">{item.caption}</figcaption>}
          </motion.figure>
        ))}
      </div>
    </Container>
  </section>
);

export const FeatureCardsTemplate: React.FC<{ content: any }> = ({ content }) => (
  <section className={shell}>
    <Container>
      <SectionHeader content={content} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {content.cards?.map((card: any) => (
          <motion.div key={card.id} {...reveal} className="p-7 rounded-[28px] bg-[#FAF9F2] border border-black/10 shadow-sm hover:shadow-xl transition-all duration-500 space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#79864B]/15 flex items-center justify-center text-[#79864B]">
              <CmsIcon name={card.icon} className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-normal text-knowza-dark">{card.title}</h3>
            <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed">{card.text}</p>
          </motion.div>
        ))}
      </div>
      <Buttons buttons={content.buttons} center />
    </Container>
  </section>
);

export const StatisticsTemplate: React.FC<{ content: any }> = ({ content }) => (
  <section className={shell}>
    <Container>
      <SectionHeader content={content} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {content.stats?.map((stat: any) => (
          <motion.div key={stat.id} {...reveal} className="text-center space-y-1">
            <span className="text-4xl sm:text-5xl font-serif font-normal text-knowza-dark block tracking-tight">
              <Counter value={Number(stat.value) || 0} suffix={stat.suffix} padZero={stat.padZero} duration={2} />
            </span>
            <span className="text-xs uppercase tracking-wider text-knowza-dark/70 font-medium block">{stat.label}</span>
            {stat.text && <p className="text-xs font-sans text-knowza-dark/60 font-light">{stat.text}</p>}
          </motion.div>
        ))}
      </div>
    </Container>
  </section>
);

export const TestimonialsTemplate: React.FC<{ content: any }> = ({ content }) => (
  <section className={shell}>
    <Container>
      <SectionHeader content={content} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {content.items?.map((item: any) => (
          <motion.figure key={item.id} {...reveal} className="p-7 rounded-[28px] bg-[#FAF9F2] border border-black/10 shadow-sm space-y-4">
            <Quote className="w-5 h-5 text-[#8A7D4C]" />
            <blockquote className="text-base font-serif italic text-knowza-dark leading-relaxed">{item.quote}</blockquote>
            <figcaption>
              <span className="text-sm font-serif font-medium text-knowza-dark block">{item.name}</span>
              {item.role && <span className="text-[11px] uppercase tracking-widest text-[#8A7D4C] font-semibold">{item.role}</span>}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Container>
  </section>
);

export const CtaTemplate: React.FC<{ content: any }> = ({ content }) => <CTASection content={content} />;

export const VideoTemplate: React.FC<{ content: any }> = ({ content }) => (
  <section className={shell}>
    <Container>
      <SectionHeader content={content} />
      <motion.div {...reveal} className="rounded-[28px] overflow-hidden shadow-xl border border-black/5 bg-knowza-deep aspect-video max-w-5xl mx-auto">
        {content.video?.src ? (
          <video
            src={content.video.src}
            poster={content.video.poster}
            autoPlay={content.video.autoplay}
            muted={content.video.muted}
            loop={content.video.loop}
            controls={content.video.controls}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : content.video?.poster ? (
          <img src={content.video.poster} alt="" className="w-full h-full object-cover" />
        ) : null}
      </motion.div>
    </Container>
  </section>
);

export const BlogShowcaseTemplate: React.FC<{ content: any }> = ({ content }) => {
  const posts = useLivePosts().slice(0, Number(content.limit) || 3);
  return (
    <section className={shell}>
      <Container>
        <SectionHeader content={content} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <motion.article key={post.id} {...reveal} className="bg-[#FAF9F2] rounded-[28px] border border-black/10 overflow-hidden p-4 group shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="h-52 rounded-[20px] overflow-hidden">
                <img src={post.coverImage} alt={post.coverAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
              <div className="p-4 space-y-3">
                <span className="text-[10px] uppercase tracking-widest-editorial text-[#8A7D4C] font-semibold block">{post.category} · {post.date}</span>
                <h3 className="text-xl font-serif text-knowza-dark font-normal leading-snug group-hover:text-knowza-forest transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest-editorial font-medium text-knowza-olive hover:text-knowza-deep transition-colors">
                  <span>{content.linkLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
};
