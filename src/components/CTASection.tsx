import React from 'react';
import { motion } from 'framer-motion';
import { Container } from './Container';
import { SectionLabel } from './SectionLabel';
import { Button } from './Button';
import { useGlobal } from '../cms/hooks/useSiteContent';
import { isExternalUrl, safeUrl } from '../cms/utils';

/** Shared closing invitation. Pass content for a standalone CTA; otherwise it uses the global one. */
export const CTASection: React.FC<{ content?: any }> = ({ content }) => {
  const globalCta = useGlobal().cta;
  const cta = content ?? globalCta;

  return (
    <div className="px-3 sm:px-5 md:px-7 lg:px-8 py-10 md:py-16">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={cta.background && cta.background !== '#79864B' ? { backgroundColor: cta.background } : undefined}
        className="relative bg-[#79864B] text-white py-14 sm:py-20 lg:py-28 px-4 sm:px-8 overflow-hidden rounded-[28px] sm:rounded-[40px] md:rounded-[48px] shadow-2xl border border-[#8C9A5C]/40"
      >
        {/* Subtle organic texture in background */}
        {cta.texture?.src && (
          <div
            className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-cover bg-center"
            style={{ backgroundImage: `url('${cta.texture.src}')` }}
          />
        )}

        {/* Decorative brand stroke watermark */}
        {cta.watermark?.src && (
          <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 pointer-events-none">
            <img
              src={cta.watermark.src}
              alt={cta.watermark.alt}
              className="w-full h-full object-contain filter invert"
            />
          </div>
        )}

        <Container className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <SectionLabel light className="justify-center mb-6">
              {cta.eyebrow}
            </SectionLabel>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white mb-4 sm:mb-6 leading-tight uppercase break-words"
          >
            {cta.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-white/90 font-light max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          >
            {cta.text}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto"
          >
            {cta.buttons.map((button: any) => {
              const url = safeUrl(button.url);
              const variant = button.style === 'olive-fill' ? 'olive' : button.style === 'olive' ? 'light' : button.style === 'plain' ? 'ghost' : button.style;
              const target = isExternalUrl(url) || /^(mailto|tel):/i.test(url) ? { href: url } : { to: url };
              return (
                <Button key={button.id} {...target} variant={variant} withArrow={button.arrow !== 'none'} className="w-full sm:w-auto">
                  {button.label}
                </Button>
              );
            })}
          </motion.div>

          {cta.keywords?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/20 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs uppercase tracking-widest text-[#EEE9BF]"
            >
              {cta.keywords.map((keyword: any, index: number) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#EEE9BF]" />}
                  <span>{keyword.text}</span>
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </Container>
      </motion.section>
    </div>
  );
};
