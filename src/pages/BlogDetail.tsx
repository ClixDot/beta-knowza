import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, ArrowUpRight, Share2, BookOpen } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { CTASection } from '../components/CTASection';
import { blogPosts } from '../data/blog';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#EDEABF] px-4 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block mb-2">
          SANCTUARY DISPATCH
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-knowza-dark mb-4">
          Story Not Found
        </h2>
        <p className="text-sm font-sans text-knowza-dark/70 mb-8 max-w-md">
          The dispatch you are seeking may have moved to another sanctuary or was archived.
        </p>
        <Link
          to="/blog"
          className="px-8 py-3.5 text-xs uppercase tracking-widest-editorial font-medium rounded-full shadow-md group knowza-btn-liquid knowza-btn-liquid-olive-fill"
        >
          <span>Return to All Stories</span>
        </Link>
      </div>
    );
  }

  // Related posts
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug && (post.relatedSlugs?.includes(p.slug) || p.category === post.category))
    .slice(0, 2);

  return (
    <article className="relative overflow-hidden bg-[#EDEABF] text-knowza-dark">
      {/* ========================================================
          01 HEADER / META SECTION
          ======================================================== */}
      <section className="pt-32 sm:pt-40 pb-12 md:pb-16 border-b border-black/5">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial text-knowza-dark/70 hover:text-knowza-dark transition-colors px-4 py-2 rounded-full bg-[#FAF9F2] border border-black/10 shadow-sm group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Stories</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest-editorial text-[#8A7D4C] font-semibold pt-2">
              <span className="bg-[#8A7D4C]/10 px-3 py-1 rounded-full border border-[#8A7D4C]/20">
                {post.category}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-knowza-dark/60 font-sans font-normal">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-knowza-dark/60 font-sans font-normal">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-sans font-medium uppercase text-knowza-dark tracking-tight leading-[1.14] break-words">
              {post.title}
            </h1>

            <p className="text-sm sm:text-xl font-serif italic text-knowza-forest font-light leading-relaxed pt-2 border-l-2 border-[#8A7D4C] pl-4 sm:pl-6 my-4">
              "{post.introduction}"
            </p>
          </div>
        </Container>
      </section>

      {/* ========================================================
          02 LARGE HERO IMAGE FRAME
          ======================================================== */}
      <section className="py-6 sm:py-10 md:py-14">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto h-[260px] sm:h-[400px] md:h-[580px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl border border-black/5 relative"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover filter brightness-[0.93] contrast-[1.05]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
        </Container>
      </section>

      {/* ========================================================
          03 EDITORIAL READING COLUMN
          ======================================================== */}
      <section className="pb-16 sm:pb-24 pt-2 sm:pt-4">
        <div className="max-w-[760px] mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8 text-knowza-dark/85 font-sans leading-relaxed text-sm sm:text-lg font-light">
          {post.content.map((paragraph, index) => (
            <React.Fragment key={index}>
              <p className="leading-[1.85] text-knowza-dark/85">{paragraph}</p>

              {/* Show first inline image after paragraph 1 */}
              {index === 1 && post.inlineImages && post.inlineImages[0] && (
                <figure className="my-8 sm:my-12 space-y-2 sm:space-y-3">
                  <div className="rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-lg border border-black/5">
                    <img
                      src={post.inlineImages[0].src}
                      alt={post.inlineImages[0].caption}
                      className="w-full h-[240px] sm:h-[380px] object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="text-xs font-sans text-knowza-dark/60 italic text-center">
                    {post.inlineImages[0].caption}
                  </figcaption>
                </figure>
              )}

              {/* Show pull quote after paragraph 2 */}
              {index === 2 && post.pullQuote && (
                <div className="my-10 sm:my-14 py-8 sm:py-10 px-5 sm:px-12 rounded-[24px] sm:rounded-[28px] bg-[#FAF9F2] border border-black/10 text-center space-y-3 shadow-md">
                  <blockquote className="text-lg sm:text-2xl md:text-3xl font-serif text-knowza-dark italic font-normal leading-relaxed">
                    "{post.pullQuote.text}"
                  </blockquote>
                  {post.pullQuote.author && (
                    <cite className="text-[11px] sm:text-xs uppercase tracking-widest-editorial text-[#8A7D4C] block font-semibold not-italic pt-1 sm:pt-2">
                      — {post.pullQuote.author}
                    </cite>
                  )}
                </div>
              )}

              {/* Show second inline image after paragraph 3 */}
              {index === 3 && post.inlineImages && post.inlineImages[1] && (
                <figure className="my-8 sm:my-12 space-y-2 sm:space-y-3">
                  <div className="rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-lg border border-black/5">
                    <img
                      src={post.inlineImages[1].src}
                      alt={post.inlineImages[1].caption}
                      className="w-full h-[240px] sm:h-[380px] object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="text-xs font-sans text-knowza-dark/60 italic text-center">
                    {post.inlineImages[1].caption}
                  </figcaption>
                </figure>
              )}
            </React.Fragment>
          ))}

          {/* Article Footer & Return Action */}
          <div className="pt-12 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-widest-editorial text-[#8A7D4C] font-semibold">
              Slow Travel Chronicles · Knowza Sanctuary
            </span>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF9F2] border border-black/10 shadow-sm text-xs uppercase tracking-widest-editorial font-medium text-knowza-dark hover:text-knowza-forest transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Stories</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          04 RELATED STORIES
          ======================================================== */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-[#EDEABF] border-t border-black/5">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto space-y-10"
            >
              <div className="text-center space-y-2">
                <SectionLabel label="FURTHER PERSPECTIVES" color="olive" alignment="center" />
                <h3 className="text-2xl sm:text-3xl font-serif text-knowza-dark font-normal">
                  Related Stories
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((related) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#FAF9F2] rounded-[28px] border border-black/10 overflow-hidden group hover:shadow-xl transition-all duration-500 shadow-sm flex flex-col justify-between p-4"
                  >
                    <div>
                      <div className="h-48 rounded-[20px] overflow-hidden shadow-sm">
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-4 sm:p-5 space-y-3">
                        <span className="text-[10px] uppercase tracking-widest-editorial text-[#8A7D4C] font-semibold block">
                          {related.category} · {related.date}
                        </span>
                        <h4 className="text-lg font-serif text-knowza-dark font-normal leading-snug group-hover:text-knowza-forest transition-colors">
                          <Link to={`/blog/${related.slug}`}>
                            {related.title}
                          </Link>
                        </h4>
                        <p className="text-xs font-sans text-knowza-dark/75 font-light line-clamp-2">
                          {related.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-3 pt-0">
                      <Link
                        to={`/blog/${related.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest-editorial font-medium text-knowza-olive hover:text-knowza-deep transition-colors"
                      >
                        <span>Read Article</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <CTASection />
    </article>
  );
};
