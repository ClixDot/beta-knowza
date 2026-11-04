import React, { useEffect, useMemo } from 'react';
import { useGlobal } from '../../cms/hooks/useSiteContent';
import type { DesignSettings, TypographySettings } from '../../cms/types';

const ORIGINAL_COLORS: { key: keyof DesignSettings; hex: string; tokens: string[] }[] = [
  { key: 'olive', hex: '#79864B', tokens: ['knowza-olive', '[#79864B]'] },
  { key: 'bronze', hex: '#8A7D4C', tokens: ['knowza-bronze', '[#8A7D4C]'] },
  { key: 'deep', hex: '#28351F', tokens: ['knowza-deep', '[#28351F]'] },
  { key: 'dew', hex: '#EEE9BF', tokens: ['knowza-dew', '[#EEE9BF]'] },
  { key: 'canvas', hex: '#F6F4DE', tokens: ['knowza-canvas', '[#F6F4DE]'] },
  { key: 'surface', hex: '#FAF9F2', tokens: ['knowza-white', '[#FAF9F2]'] },
  { key: 'text', hex: '#25271F', tokens: ['knowza-dark'] },
];

const escapeClass = (name: string) => name.replace(/[[\]#/:.]/g, (c) => `\\${c}`);

const colorRules = (design: DesignSettings) =>
  ORIGINAL_COLORS.filter(({ key }) => design[key])
    .flatMap(({ key, tokens }) => {
      const value = design[key];
      return tokens.flatMap((token) => [
        `.bg-${escapeClass(token)}{background-color:${value}!important}`,
        `.text-${escapeClass(token)}{color:${value}!important}`,
        `.border-${escapeClass(token)}{border-color:${value}!important}`,
        `.hover\\:bg-${escapeClass(token)}:hover{background-color:${value}!important}`,
        `.hover\\:text-${escapeClass(token)}:hover{color:${value}!important}`,
      ]);
    })
    .concat(design.canvas ? [`body{background-color:${design.canvas}!important}`] : [])
    .concat(design.text ? [`body{color:${design.text}!important}`] : []);

const typographyRules = (t: TypographySettings) => {
  const rules: string[] = [];
  const scope = '#root';
  if (t.bodyFont) rules.push(`${scope},${scope} p,${scope} li,${scope} label,${scope} button,${scope} input,${scope} textarea,${scope} .font-sans{font-family:"${t.bodyFont}",sans-serif!important}`);
  if (t.headingFont) rules.push(`${scope} h1,${scope} h2,${scope} h3,${scope} h4,${scope} h5,${scope} h6,${scope} .font-serif,${scope} .font-display{font-family:"${t.headingFont}",serif!important}`);
  if (t.h1Size) rules.push(`${scope} h1{font-size:${t.h1Size}!important}`);
  if (t.h2Size) rules.push(`${scope} h2{font-size:${t.h2Size}!important}`);
  if (t.h3Size) rules.push(`${scope} h3{font-size:${t.h3Size}!important}`);
  if (t.paragraphSize) rules.push(`${scope} p{font-size:${t.paragraphSize}!important}`);
  if (t.lineHeight) rules.push(`${scope} p{line-height:${t.lineHeight}!important}`);
  if (t.headingWeight) rules.push(`${scope} h1,${scope} h2,${scope} h3,${scope} h4{font-weight:${t.headingWeight}!important}`);
  if (t.bodyWeight) rules.push(`${scope} p,${scope} li{font-weight:${t.bodyWeight}!important}`);
  if (t.letterSpacing) rules.push(`${scope} h1,${scope} h2,${scope} h3,${scope} h4{letter-spacing:${t.letterSpacing}!important}`);
  return rules;
};

/**
 * Applies global design settings. Empty settings produce no CSS at all, which
 * keeps the original stylesheet fully in charge until an admin opts in.
 */
export const GlobalStyles: React.FC = () => {
  const { typography, design } = useGlobal();

  const css = useMemo(() => {
    const rules = [...colorRules(design), ...typographyRules(typography)];
    if (design.buttonRadius) rules.push(`.knowza-btn-liquid{border-radius:${design.buttonRadius}!important}`);
    if (design.cardRadius) rules.push(`[class*="rounded-[28px]"],[class*="rounded-[32px]"],[class*="rounded-[36px]"]{border-radius:${design.cardRadius}!important}`);
    if (design.imageBrightness) rules.push(`main img{filter:brightness(${design.imageBrightness})!important}`);
    return rules.join('\n');
  }, [design, typography]);

  const families = [typography.headingFont, typography.bodyFont].filter((f) => f && f !== 'Tenor Sans');

  useEffect(() => {
    const links = families.map((family) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@300;400;500;600;700&display=swap`;
      document.head.appendChild(link);
      return link;
    });
    return () => links.forEach((link) => link.remove());
  }, [families.join('|')]);

  return css ? <style data-cms-global>{css}</style> : null;
};
