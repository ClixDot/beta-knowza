import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ButtonStyle, ButtonValue } from '../../cms/types';
import { isExternalUrl, isSchemeUrl, safeUrl } from '../../cms/utils';

interface CmsLinkProps {
  url: string;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  'aria-label'?: string;
}

/** Renders a router link for internal paths and a safe anchor for everything else. */
export const CmsLink: React.FC<CmsLinkProps> = ({ url, className, children, onClick, 'aria-label': ariaLabel }) => {
  const href = safeUrl(url);
  if (isExternalUrl(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  if (isSchemeUrl(href) || href === '#') {
    return (
      <a href={href} className={className} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
};

const STYLE_CLASSES: Record<ButtonStyle, string> = {
  'white-fill': 'knowza-btn-liquid knowza-btn-liquid-white-fill',
  white: 'knowza-btn-liquid knowza-btn-liquid-white',
  dark: 'knowza-btn-liquid knowza-btn-liquid-dark',
  olive: 'knowza-btn-liquid knowza-btn-liquid-olive',
  'olive-fill': 'knowza-btn-liquid knowza-btn-liquid-olive-fill',
  primary: 'knowza-btn-liquid knowza-btn-liquid-primary',
  secondary: 'knowza-btn-liquid knowza-btn-liquid-secondary',
  plain: '',
};

export const buttonStyleClass = (style: ButtonStyle) => STYLE_CLASSES[style] ?? '';

interface CmsButtonProps {
  button: ButtonValue;
  className: string;
  arrowClass?: string;
  plainClass?: string;
}

/** A CMS-configured button: label, URL, visual style and arrow all come from content. */
export const CmsButton: React.FC<CmsButtonProps> = ({ button, className, arrowClass = 'w-3.5 h-3.5', plainClass = '' }) => {
  const styleClass = button.style === 'plain' ? plainClass : buttonStyleClass(button.style);
  return (
    <CmsLink url={button.url} className={`${className} ${styleClass}`}>
      <span>{button.label}</span>
      {button.arrow === 'up-right' && <ArrowUpRight className={arrowClass} />}
      {button.arrow === 'right' && <ArrowRight className={arrowClass} />}
    </CmsLink>
  );
};
