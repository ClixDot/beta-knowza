import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, ArrowUpRight, CheckCircle2, Clock, Phone } from 'lucide-react';
import { Container } from '../components/Container';
import { SectionLabel } from '../components/SectionLabel';
import { CmsLink } from '../components/cms/CmsLink';
import { SocialIcon } from '../components/cms/icons';
import { useGlobal } from '../cms/hooks/useSiteContent';
import { saveEnquiry } from '../cms/services/submissions';
import { imageStyle } from '../cms/utils';

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

const fieldClass = (hasError: boolean, extra = '') =>
  `w-full px-5 py-3.5 rounded-xl bg-[#F6F4DE]/40 border text-sm font-sans text-knowza-dark placeholder-knowza-dark/40 focus:outline-none transition-colors ${extra} ${
    hasError ? 'border-red-500 focus:border-red-600' : 'border-black/10 focus:border-knowza-olive'
  }`;

export const ContactMainSection: React.FC<{ content: any }> = ({ content }) => {
  const { contact } = useGlobal();
  const { desk, territory, vignette, form } = content;
  const firstPurpose = form.purposes[0]?.text ?? '';

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    purpose: firstPurpose,
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = form.nameError;
    if (!formData.email.trim()) {
      errs.email = form.emailError;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = form.emailInvalidError;
    }
    if (!formData.message.trim()) errs.message = form.messageError;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitFailed(false);
    try {
      await saveEnquiry(formData);
      setIsSubmitted(true);
    } catch {
      setSubmitFailed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [thanksBefore, thanksAfter] = form.successText.split('{name}');

  return (
    <section className="py-14 sm:py-20 md:py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Dark Concierge Monolith & Sanctuary Info */}
          <div className="order-2 lg:order-1 lg:col-span-5 space-y-6 sm:space-y-8">
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
                    {desk.eyebrow}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-sans text-[#F4F0D5]/70 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    {desk.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">{desk.heading}</h3>

                <p className="text-xs sm:text-sm font-sans text-[#F4F0D5]/80 font-light leading-relaxed">{desk.text}</p>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-knowza-bronze shrink-0 mt-1" />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-knowza-bronze block font-medium">
                        {desk.generalLabel}
                      </span>
                      <a
                        href={`mailto:${contact.generalEnquiries}`}
                        className="text-xs sm:text-sm font-sans text-white hover:text-knowza-dew transition-colors block break-all"
                      >
                        {contact.generalEnquiries}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-knowza-bronze shrink-0 mt-1" />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-knowza-bronze block font-medium">
                        {desk.directLabel}
                      </span>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-xs sm:text-sm font-sans text-white hover:text-knowza-dew transition-colors block break-all"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>

                  {contact.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-knowza-bronze shrink-0 mt-1" />
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-knowza-bronze block font-medium">
                          {desk.phoneLabel}
                        </span>
                        <a
                          href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                          className="text-xs sm:text-sm font-sans text-white hover:text-knowza-dew transition-colors block break-all"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-knowza-bronze shrink-0 mt-1" />
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-knowza-bronze block font-medium">
                          {desk.addressLabel}
                        </span>
                        <span className="text-xs sm:text-sm font-sans text-white block">{contact.address}</span>
                      </div>
                    </div>
                  )}
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
                <span>{territory.eyebrow}</span>
              </div>
              <h4 className="text-lg sm:text-xl font-serif text-knowza-dark font-normal">{territory.heading}</h4>
              <p className="text-xs sm:text-sm font-sans text-knowza-dark/75 font-light leading-relaxed">
                {contact.locationContext}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-knowza-dark/60 font-sans">
                <Clock className="w-3.5 h-3.5 text-knowza-olive" />
                <span>{contact.officeSchedule}</span>
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
                src={vignette.image.src}
                alt={vignette.image.alt}
                style={imageStyle(vignette.image)}
                className="w-full h-full object-cover filter brightness-[0.9] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-knowza-bronze block">{vignette.eyebrow}</span>
                <p className="text-xs font-serif text-white/90 italic">{vignette.quote}</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Luxury Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.85, delay: 0.15 }}
            className="order-1 lg:order-2 lg:col-span-7 bg-[#FAF9F2] p-6 sm:p-10 md:p-14 rounded-[28px] sm:rounded-[32px] border border-black/10 shadow-xl"
          >
            {isSubmitted ? (
              <div className="py-16 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#8A7D4C]/15 text-[#8A7D4C] flex items-center justify-center mx-auto border border-[#8A7D4C]/30 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-serif text-knowza-dark font-normal">{form.successHeading}</h3>
                <p className="text-sm font-sans text-knowza-dark/80 font-light max-w-md mx-auto leading-relaxed">
                  {thanksBefore}
                  {thanksAfter !== undefined && (
                    <>
                      <span className="font-medium text-knowza-dark">{formData.name}</span>
                      {thanksAfter}
                    </>
                  )}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', purpose: firstPurpose, message: '' });
                    }}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-8 py-3.5 rounded-full shadow-md group knowza-btn-liquid knowza-btn-liquid-dark"
                  >
                    <span>{form.againLabel}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7" noValidate>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A7D4C] font-semibold block">
                    {form.eyebrow}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-knowza-dark font-normal">{form.heading}</h3>
                  <p className="text-xs sm:text-sm font-sans text-knowza-dark/65 font-light">{form.description}</p>
                </div>

                {/* Purpose Selector Chips */}
                <div className="space-y-2.5">
                  <label className="text-xs uppercase tracking-widest-editorial font-semibold text-knowza-dark/80 block">
                    {form.purposeLabel}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {form.purposes.map(({ id, text: purpose }: any) => {
                      const isSelected = formData.purpose === purpose;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setFormData({ ...formData, purpose })}
                          className={`px-4 py-2 rounded-full text-xs font-sans transition-all duration-300 border ${
                            isSelected
                              ? 'bg-knowza-deep text-white border-knowza-deep shadow-sm font-medium'
                              : 'bg-[#F6F4DE] text-knowza-dark/70 border-black/10 hover:border-black/30'
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
                  <label htmlFor="name" className="text-xs uppercase tracking-widest-editorial font-semibold text-knowza-dark/80 block">
                    {form.nameLabel}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={form.namePlaceholder}
                    className={fieldClass(Boolean(errors.name))}
                  />
                  {errors.name && <p className="text-xs text-red-600 font-sans mt-1">{errors.name}</p>}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs uppercase tracking-widest-editorial font-semibold text-knowza-dark/80 block">
                      {form.emailLabel}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={form.emailPlaceholder}
                      className={fieldClass(Boolean(errors.email))}
                    />
                    {errors.email && <p className="text-xs text-red-600 font-sans mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs uppercase tracking-widest-editorial font-semibold text-knowza-dark/80 block">
                      {form.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={form.phonePlaceholder}
                      className={fieldClass(false)}
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs uppercase tracking-widest-editorial font-semibold text-knowza-dark/80 block">
                    {form.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={form.messagePlaceholder}
                    className={fieldClass(Boolean(errors.message), 'resize-y')}
                  />
                  {errors.message && <p className="text-xs text-red-600 font-sans mt-1">{errors.message}</p>}
                </div>

                {submitFailed && <p role="alert" className="text-xs text-red-600 font-sans">{form.failureMessage}</p>}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-widest-editorial font-medium rounded-full shadow-md group disabled:opacity-50 knowza-btn-liquid knowza-btn-liquid-olive-fill"
                  >
                    <span>{isSubmitting ? form.submittingLabel : form.submitLabel}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export const InstagramPreviewSection: React.FC<{ content: any }> = ({ content }) => {
  const { socials } = useGlobal();
  const instagram = socials.find((s) => s.platform === 'instagram');
  const url = instagram?.url || '#';

  return (
    <section className="py-20 bg-[#F6F4DE] border-t border-black/5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <SectionLabel label={content.eyebrow} color="olive" />
            <h3 className="text-2xl sm:text-3xl font-serif text-knowza-dark font-normal mt-2">{content.heading}</h3>
          </div>
          <CmsLink
            url={url}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest-editorial font-medium px-6 py-2.5 rounded-full bg-[#FAF9F2] border border-black/10 shadow-sm text-knowza-dark hover:text-knowza-forest transition-colors"
          >
            <SocialIcon name="instagram" className="w-4 h-4" />
            <span>{content.buttonLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </CmsLink>
        </motion.div>

        {/* Clean Instagram Preview Grid with rounded-[20px] sm:rounded-[24px] */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {content.tiles.map((tile: any) => (
            <CmsLink
              key={tile.id}
              url={url}
              className="group block relative rounded-[20px] sm:rounded-[24px] overflow-hidden h-36 sm:h-52 md:h-60 shadow-sm border border-black/5"
            >
              <img
                src={tile.image.src}
                alt={tile.image.alt}
                style={imageStyle(tile.image)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-knowza-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <SocialIcon name="instagram" className="w-6 h-6" />
              </div>
            </CmsLink>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
