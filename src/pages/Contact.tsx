import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Calendar, ArrowUpRight, CheckCircle2, Clock, Phone, Sparkles } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { InnerPageHero } from '../components/InnerPageHero';
import { CTASection } from '../components/CTASection';
import { siteConfig } from '../data/site';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const PURPOSES = [
  'Stay / Experience',
  'Private Retreat',
  'Cultural Partnership',
  'Media & Editorial',
  'General Enquiry'
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  purpose: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    purpose: 'Stay / Experience',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) errs.message = 'Please share your enquiry or message.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  return (
    <div className="relative overflow-hidden bg-[#EDEABF] text-knowza-dark">
      {/* ========================================================
          01 ARCHITECTURAL CONCIERGE HERO
          ======================================================== */}
      <InnerPageHero
        watermarkTop="CONTACT"
        titleLine1="BEGIN YOUR JOURNEY"
        titleHighlight="INTO DELIBERATE STILLNESS"
      />

      {/* ========================================================
          02 CONCIERGE & INQUIRY SPLIT SECTION
          ======================================================== */}
      <section className="py-14 sm:py-20 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Column: Dark Concierge Monolith & Sanctuary Info */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              {/* Dark Luxury Concierge Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-[#28351F] via-[#1E2717] to-[#141A10] text-[#F4F0D5] p-6 sm:p-8 md:p-10 rounded-[28px] sm:rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden"
              >
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#8A7D4C]/20 blur-[60px] pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative z-10 space-y-5 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-knowza-bronze font-semibold">
                      DIRECT DESK
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-sans text-[#F4F0D5]/70 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      Replies within 24h
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
                    Sanctuary Liaison Desk
                  </h3>

                  <p className="text-xs sm:text-sm font-sans text-[#F4F0D5]/80 font-light leading-relaxed">
                    Every reservation and dialogue is handled individually by our resident hosts to ensure
                    your stay aligns with personal pace and ecological respect.
                  </p>

                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-knowza-bronze shrink-0 mt-1" />
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-knowza-bronze block font-medium">
                          General Enquiries
                        </span>
                        <a
                          href={`mailto:${siteConfig.contact.generalEnquiries}`}
                          className="text-xs sm:text-sm font-sans text-white hover:text-knowza-dew transition-colors block break-all"
                        >
                          {siteConfig.contact.generalEnquiries}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-knowza-bronze shrink-0 mt-1" />
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-knowza-bronze block font-medium">
                          Concierge Direct
                        </span>
                        <a
                          href={`mailto:${siteConfig.contact.email}`}
                          className="text-xs sm:text-sm font-sans text-white hover:text-knowza-dew transition-colors block break-all"
                        >
                          {siteConfig.contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Territory Presence Card */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="p-6 sm:p-8 bg-[#FAF9F2] rounded-[24px] sm:rounded-[28px] border border-black/10 shadow-sm space-y-3 sm:space-y-4"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest-editorial text-[#8A7D4C] font-semibold">
                  <MapPin className="w-4 h-4 text-knowza-olive" />
                  <span>Territory & Presence</span>
                </div>
                <h4 className="text-lg sm:text-xl font-serif text-knowza-dark font-normal">
                  Immersed in Southern Wilderness
                </h4>
                <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                  {siteConfig.contact.locationContext}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-knowza-dark/60 font-sans">
                  <Clock className="w-3.5 h-3.5 text-knowza-olive" />
                  <span>{siteConfig.contact.officeSchedule}</span>
                </div>
              </motion.div>

              {/* Serene Sanctuary Vignette Image */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.75, delay: 0.2 }}
                className="rounded-[24px] sm:rounded-[28px] overflow-hidden aspect-[16/9] shadow-md relative border border-black/5 group"
              >
                <img
                  src="/images/gallery/courtyard.jpg"
                  alt="Heritage courtyard sanctuary"
                  className="w-full h-full object-cover filter brightness-[0.9] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-knowza-bronze block">
                    HERITAGE RETREAT
                  </span>
                  <p className="text-xs font-serif text-white/90 italic">
                    "Doors crafted from reclaimed timber, welcoming quiet minds."
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Luxury Enquiry Form */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.85, delay: 0.15 }}
              className="lg:col-span-7 bg-[#FAF9F2] p-6 sm:p-10 md:p-14 rounded-[28px] sm:rounded-[32px] border border-black/10 shadow-xl"
            >
              {isSubmitted ? (
                <div className="py-16 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-[#8A7D4C]/15 text-[#8A7D4C] flex items-center justify-center mx-auto border border-[#8A7D4C]/30 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-serif text-knowza-dark font-normal">
                    Your Enquiry is Received
                  </h3>
                  <p className="text-sm font-sans text-knowza-dark/80 font-light max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-medium text-knowza-dark">{formData.name}</span>. A sanctuary host
                    will review your message and reach out with thoughtful details within 24 hours.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          purpose: 'Stay / Experience',
                          message: '',
                        });
                      }}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-8 py-3.5 rounded-full shadow-md group knowza-btn-liquid knowza-btn-liquid-dark"
                    >
                      <span>Send Another Enquiry</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7" noValidate>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                      ENGAGE WITH US
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-knowza-dark font-normal">
                      Sanctuary Enquiry Form
                    </h3>
                    <p className="text-xs sm:text-sm font-sans text-knowza-dark/65 font-light">
                      Please share your travel dates, preferred sanctuary, or collaboration ideas.
                    </p>
                  </div>

                  {/* Purpose Selector Chips */}
                  <div className="space-y-2.5">
                    <label className="text-xs uppercase tracking-widest-editorial font-semibold text-knowza-dark/80 block">
                      Purpose of Enquiry
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PURPOSES.map((purpose) => {
                        const isSelected = formData.purpose === purpose;
                        return (
                          <button
                            key={purpose}
                            type="button"
                            onClick={() => setFormData({ ...formData, purpose })}
                            className={`px-4 py-2 rounded-full text-xs font-sans transition-all duration-300 border ${
                              isSelected
                                ? 'bg-knowza-deep text-white border-knowza-deep shadow-sm font-medium'
                                : 'bg-[#EDEABF] text-knowza-dark/70 border-black/10 hover:border-black/30'
                            }`}
                          >
                            {purpose}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-xs uppercase tracking-widest-editorial font-semibold text-knowza-dark/80 block"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maya Sundaram"
                      className={`w-full px-5 py-3.5 rounded-xl bg-[#EDEABF]/40 border text-sm font-sans text-knowza-dark placeholder-knowza-dark/40 focus:outline-none transition-colors ${
                        errors.name
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-black/10 focus:border-knowza-olive'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 font-sans mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs uppercase tracking-widest-editorial font-semibold text-knowza-dark/80 block"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="maya@example.com"
                        className={`w-full px-5 py-3.5 rounded-xl bg-[#EDEABF]/40 border text-sm font-sans text-knowza-dark placeholder-knowza-dark/40 focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-black/10 focus:border-knowza-olive'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 font-sans mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="text-xs uppercase tracking-widest-editorial font-semibold text-knowza-dark/80 block"
                      >
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 (0) 00000 00000"
                        className="w-full px-5 py-3.5 rounded-xl bg-[#EDEABF]/40 border border-black/10 text-sm font-sans text-knowza-dark placeholder-knowza-dark/40 focus:outline-none focus:border-knowza-olive transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-xs uppercase tracking-widest-editorial font-semibold text-knowza-dark/80 block"
                    >
                      Message / Journey Intentions *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your intended season, number of travelers, retreat goals, or questions..."
                      className={`w-full px-5 py-3.5 rounded-xl bg-[#EDEABF]/40 border text-sm font-sans text-knowza-dark placeholder-knowza-dark/40 focus:outline-none transition-colors resize-y ${
                        errors.message
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-black/10 focus:border-knowza-olive'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-600 font-sans mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-widest-editorial font-medium rounded-full shadow-md group disabled:opacity-50 knowza-btn-liquid knowza-btn-liquid-olive-fill"
                    >
                      <span>{isSubmitting ? 'Transmitting...' : 'Send Sanctuary Enquiry'}</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ========================================================
          03 INSTAGRAM & VISUAL CONNECTIONS
          ======================================================== */}
      <section className="py-20 bg-[#EDEABF] border-t border-black/5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <SectionLabel label="VISUAL CONNECTIONS" color="olive" />
              <h3 className="text-2xl sm:text-3xl font-serif text-knowza-dark font-normal mt-2">
                Follow @knowzagroup
              </h3>
            </div>
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-6 py-2.5 rounded-full bg-[#FAF9F2] border border-black/10 shadow-sm text-knowza-dark hover:text-knowza-forest transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Connect on Instagram</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Clean 4-Image Instagram Preview Grid with rounded-[20px] sm:rounded-[24px] */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative rounded-[20px] sm:rounded-[24px] overflow-hidden h-36 sm:h-52 md:h-60 shadow-sm border border-black/5"
            >
              <img
                src="/images/nature/fern.png"
                alt="Nature moments"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-knowza-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <InstagramIcon className="w-6 h-6" />
              </div>
            </a>

            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative rounded-[20px] sm:rounded-[24px] overflow-hidden h-36 sm:h-52 md:h-60 shadow-sm border border-black/5"
            >
              <img
                src="/images/culture/meditation.png"
                alt="Mindfulness moments"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-knowza-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <InstagramIcon className="w-6 h-6" />
              </div>
            </a>

            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative rounded-[20px] sm:rounded-[24px] overflow-hidden h-36 sm:h-52 md:h-60 shadow-sm border border-black/5"
            >
              <img
                src="/images/gallery/tea-hills.jpg"
                alt="Western Ghats tea hills"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-knowza-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <InstagramIcon className="w-6 h-6" />
              </div>
            </a>

            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative rounded-[20px] sm:rounded-[24px] overflow-hidden h-36 sm:h-52 md:h-60 shadow-sm border border-black/5"
            >
              <img
                src="/images/connection/connection-hands.jpg"
                alt="Human connection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-knowza-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <InstagramIcon className="w-6 h-6" />
              </div>
            </a>
          </motion.div>
        </Container>
      </section>

      {/* Closing CTA Section */}
      <CTASection />
    </div>
  );
};
