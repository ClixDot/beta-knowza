import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Clock, Calendar, BookOpen, Send } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { InnerPageHero } from '../components/InnerPageHero';
import { CTASection } from '../components/CTASection';
import { blogPosts } from '../data/blog';
import { BlogCategory } from '../types';

const CATEGORIES: BlogCategory[] = ['All', 'Nature', 'Culture', 'Travel', 'Experiences'];

export const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return blogPosts;
    return blogPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory]);

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#EDEABF] text-knowza-dark">
      {/* ========================================================
          01 ARCHITECTURAL EDITORIAL HERO
          ======================================================== */}
      <InnerPageHero
        watermarkTop="BLOG"
        titleLine1="STORIES FROM"
        titleHighlight="THE LIVING JOURNEY"
      />

      {/* ========================================================
          02 PILL CATEGORY NAVIGATION TABS
          ======================================================== */}
      <section className="sticky top-[68px] md:top-[80px] z-30 bg-[#EDEABF]/90 backdrop-blur-md border-b border-black/5 py-3 sm:py-4">
        <Container>
          <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-2.5 py-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const count = cat === 'All' ? blogPosts.length : blogPosts.filter((p) => p.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={(e) => {
                    setActiveCategory(cat);
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }}
                  className={`relative h-9 sm:h-9.5 px-4 sm:px-5 rounded-full text-xs uppercase tracking-widest-editorial font-medium transition-all duration-300 whitespace-nowrap focus:outline-none inline-flex items-center justify-center gap-2 shrink-0 select-none shadow-sm ${
                    isActive
                      ? 'bg-knowza-deep text-white ring-1 ring-knowza-deep shadow-md'
                      : 'bg-[#EDEABF] text-knowza-dark/75 hover:text-knowza-dark hover:bg-black/[0.04] border border-black/10'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="relative z-10 leading-none">{cat}</span>
                  <span
                    className={`relative z-10 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-sans font-semibold tracking-normal leading-none rounded-full transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-knowza-dark/60'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ========================================================
          03 FEATURED POST & ARTICLE ARCHITECTURE
          ======================================================== */}
      <section className="py-12 sm:py-16 md:py-24">
        <Container>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="space-y-12 sm:space-y-16"
            >
              {/* Featured Dispatch Monolith */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.85 }}
                  className="bg-[#FAF9F2] rounded-[28px] sm:rounded-[32px] border border-black/10 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-7 h-[260px] sm:h-[360px] md:h-[480px] overflow-hidden relative group">
                      <Link to={`/blog/${featuredPost.slug}`} className="block w-full h-full">
                        <img
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest-editorial text-white bg-black/50 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/20 font-medium">
                            SPOTLIGHT DISPATCH
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="lg:col-span-5 p-6 sm:p-10 md:p-12 lg:p-14 space-y-4 sm:space-y-6">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs uppercase tracking-widest-editorial text-[#8A7D4C] font-semibold">
                        <span>{featuredPost.category}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-knowza-dark/60 font-sans font-normal">
                          <Calendar className="w-3 h-3" />
                          {featuredPost.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-knowza-dark/60 font-sans font-normal">
                          <Clock className="w-3 h-3" />
                          {featuredPost.readTime}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif text-knowza-dark font-normal leading-tight">
                        <Link
                          to={`/blog/${featuredPost.slug}`}
                          className="hover:text-knowza-forest transition-colors"
                        >
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                        {featuredPost.excerpt}
                      </p>

                      <div className="pt-2">
                        <Link
                          to={`/blog/${featuredPost.slug}`}
                          className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-md group knowza-btn-liquid knowza-btn-liquid-olive-fill whitespace-nowrap"
                        >
                          <span>Read Full Story</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Grid of Remaining Articles */}
              {regularPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.5 }}
                      className="bg-[#FAF9F2] rounded-[28px] border border-black/10 overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-500 p-4"
                    >
                      <div>
                        <div className="h-56 rounded-[20px] overflow-hidden shadow-sm relative">
                          <Link to={`/blog/${post.slug}`}>
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                          </Link>
                          <div className="absolute top-3 left-3">
                            <span className="text-[9px] uppercase tracking-widest text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 font-medium">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 space-y-3">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest-editorial text-[#8A7D4C] font-semibold">
                            <span>{post.date}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1 font-sans text-knowza-dark/60 font-normal">
                              <Clock className="w-3 h-3" />
                              {post.readTime}
                            </span>
                          </div>

                          <h3 className="text-xl font-serif text-knowza-dark font-normal leading-snug group-hover:text-knowza-forest transition-colors">
                            <Link to={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>

                          <p className="text-xs sm:text-sm font-sans text-knowza-dark/70 font-light leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 sm:px-5 pb-3 pt-3 border-t border-black/5 flex items-center justify-between">
                        <span className="text-xs font-sans text-knowza-dark/50 font-light">
                          By Knowza Curators
                        </span>

                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest-editorial font-medium text-knowza-olive hover:text-knowza-deep transition-colors group-hover:translate-x-1 duration-300"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Container>
      </section>

      {/* ========================================================
          04 LITERARY JOURNAL SUBSCRIPTION MONOLITH
          ======================================================== */}
      <section className="px-3 sm:px-6 md:px-10 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85 }}
          className="relative rounded-[28px] sm:rounded-[40px] bg-gradient-to-br from-[#28351F] via-[#1E2717] to-[#141A10] text-[#F4F0D5] py-12 sm:py-20 px-5 sm:px-10 md:px-16 overflow-hidden shadow-2xl border border-white/10 max-w-6xl mx-auto"
        >
          {/* Ambient luminous glow */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#8A7D4C]/20 blur-[80px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
            <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-knowza-bronze font-semibold block">
              THE SLOW DISPATCH
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white font-normal">
              Receive Essays on Nature & Culture
            </h2>
            <p className="text-xs sm:text-sm md:text-base font-sans text-[#F4F0D5]/80 font-light leading-relaxed max-w-xl mx-auto">
              We send occasional letters reflecting on quiet living, seasonal rituals, and the keepers
              of ancient crafts. No noise, just deliberate stories.
            </p>

            {newsletterSubscribed ? (
              <div className="p-4 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm text-knowza-dew font-light inline-block">
                Thank you. You have been welcomed into our journal circle.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs sm:text-sm font-sans focus:outline-none focus:border-knowza-cream transition-colors"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-medium knowza-btn-liquid knowza-btn-liquid-primary"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};
