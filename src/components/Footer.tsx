import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from './Container';
import { useGlobal } from '../cms/hooks/useSiteContent';
import { saveSubscriber } from '../cms/services/submissions';

export const Footer: React.FC = () => {
  const { footer, socials, brand } = useGlobal();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const copyright = footer.copyright.replace('{year}', String(currentYear)).replace('{brand}', brand.brandName);
  const liveSocials = socials.filter((social) => social.enabled && social.url);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSubscriber(email).catch(() => undefined);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer
      style={footer.background && footer.background !== '#28351F' ? { backgroundColor: footer.background } : undefined}
      className="bg-[#28351F] text-[#FAF9F2] pt-20 pb-12 border-t border-black/10 relative overflow-hidden"
    >
      {/* Subtle organic watermark in background */}
      <div
        className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none"
        aria-hidden="true"
      />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/15"
        >
          {/* Brand Column */}
          <div className="md:col-span-7 space-y-6">
            <Link to="/" className="inline-block" aria-label="KNOWZA Home">
              <img
                src={footer.logo}
                alt={footer.logoAlt}
                className="h-16 md:h-20 w-auto object-contain filter brightness-[1.05]"
              />
            </Link>
            <p className="text-sm font-sans text-[#FAF9F2]/80 max-w-sm leading-relaxed font-light">
              {footer.description}
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] uppercase tracking-widest-editorial text-[#FAF9F2]/90 font-medium bg-black/10 px-3 py-1 rounded-full">
                {footer.tagline}
              </span>
            </div>
          </div>

          {/* Editorial / Connect Column */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-xs uppercase tracking-widest-editorial text-[#FAF9F2] font-semibold">
              {footer.connectHeading}
            </h4>
            <p className="text-xs font-sans text-[#FAF9F2]/80 leading-relaxed font-light">
              {footer.connectText}
            </p>
            <div className="pt-2 space-y-2">
              {footer.contactEmail && (
                <div>
                  <a
                    href={`mailto:${footer.contactEmail}`}
                    className="text-xs font-sans text-[#FAF9F2] hover:text-white transition-colors duration-200 block font-medium"
                  >
                    {footer.contactEmail}
                  </a>
                </div>
              )}
              {liveSocials.map((social) => (
                <div key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest-editorial text-[#FAF9F2]/90 hover:text-white transition-colors duration-200 group"
                  >
                    <span>{social.label} {social.handle}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              ))}
            </div>

            {footer.newsletterEnabled && (
              <div className="pt-4 space-y-2">
                <h5 className="text-xs uppercase tracking-widest-editorial text-[#FAF9F2] font-semibold">{footer.newsletterHeading}</h5>
                <p className="text-xs font-sans text-[#FAF9F2]/80 font-light">{footer.newsletterText}</p>
                {subscribed ? (
                  <p className="text-xs text-knowza-dew font-light">{footer.newsletterSuccess}</p>
                ) : (
                  <form onSubmit={subscribe} className="flex items-center gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={footer.newsletterPlaceholder}
                      aria-label={footer.newsletterPlaceholder}
                      className="min-w-0 flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs font-sans focus:outline-none focus:border-knowza-cream"
                    />
                    <button type="submit" aria-label={footer.newsletterButton} className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] tracking-widest-editorial uppercase text-[#FAF9F2]/65 gap-4"
        >
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-center md:text-left">
            <span>{copyright}</span>
            {footer.creditName && (
              <>
                <span className="text-white/40 hidden sm:inline">·</span>
                <a
                  href={footer.creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#FAF9F2]/80 hover:text-white transition-colors duration-200 group"
                  aria-label={`${footer.creditLabel} ${footer.creditName}`}
                >
                  <span>{footer.creditLabel}</span>
                  <span className="text-white font-medium tracking-wider lowercase group-hover:underline decoration-white/60 underline-offset-4">
                    {footer.creditName}
                  </span>
                </a>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1 text-[10px] text-center">
            <span>{footer.bottomLeft}</span>
            <span className="text-white/40">·</span>
            <span>{footer.bottomRight}</span>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
};
