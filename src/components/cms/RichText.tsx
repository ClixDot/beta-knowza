import React from 'react';
import { isExternalUrl, safeUrl } from '../../cms/utils';

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

/**
 * Renders the small inline format used by article paragraphs: **bold**, *italic*
 * and [text](url). It builds React elements, so stored content can never inject HTML.
 */
export const RichText: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(TOKEN).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = safeUrl(link[2]);
        return (
          <a
            key={index}
            href={href}
            className="underline decoration-knowza-olive underline-offset-4 hover:text-knowza-forest transition-colors"
            {...(isExternalUrl(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {link[1]}
          </a>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    })}
  </>
);
