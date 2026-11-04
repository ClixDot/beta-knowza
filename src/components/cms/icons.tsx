import React from 'react';
import {
  Activity,
  ArrowRight,
  Compass,
  Crosshair,
  Feather,
  Flame,
  Footprints,
  Globe,
  Heart,
  Leaf,
  Link2,
  MapPin,
  Moon,
  Mountain,
  Recycle,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  TreePine,
  TrendingUp,
  Users,
  Waves,
  Wind,
} from 'lucide-react';

export const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  ArrowRight,
  Compass,
  Crosshair,
  Feather,
  Flame,
  Footprints,
  Globe,
  Heart,
  Leaf,
  MapPin,
  Moon,
  Mountain,
  Recycle,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  TreePine,
  TrendingUp,
  Users,
  Waves,
  Wind,
};

export const ICON_NAMES = Object.keys(ICONS);

export const CmsIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} />;
};

const PATHS: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  youtube: (
    <>
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 21 12 11M8.7 13.5C7.2 10.5 9.2 7 12.5 7c2.6 0 4 1.8 4 3.8 0 2.6-1.4 4.7-3.4 4.7-1.1 0-1.9-.9-1.6-2" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.8 2.2 4.8 5 5" />,
};

export const SOCIAL_ICON_NAMES = [...Object.keys(PATHS), 'website', 'link'];

export const SocialIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-4 h-4' }) => {
  if (name === 'website') return <Globe className={className} aria-hidden="true" />;
  if (!PATHS[name]) return <Link2 className={className} aria-hidden="true" />;
  return (
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
      {PATHS[name]}
    </svg>
  );
};
