import React from 'react';

export interface SectionLabelProps {
  label?: string;
  children?: React.ReactNode;
  light?: boolean;
  color?: 'olive' | 'bronze' | 'light';
  alignment?: 'left' | 'center' | 'right';
  className?: string;
  withLine?: boolean;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  label,
  children,
  light = false,
  color = 'olive',
  alignment = 'left',
  className = '',
  withLine = true,
}) => {
  const content = label || children;

  const textColor =
    light || color === 'light'
      ? 'text-knowza-dew/85'
      : color === 'bronze'
      ? 'text-knowza-bronze'
      : 'text-knowza-forest';

  const lineColor =
    light || color === 'light'
      ? 'bg-knowza-cream'
      : color === 'bronze'
      ? 'bg-knowza-bronze'
      : 'bg-knowza-olive';

  const alignmentClass =
    alignment === 'center'
      ? 'justify-center mx-auto'
      : alignment === 'right'
      ? 'justify-end'
      : 'justify-start';

  return (
    <div
      className={`inline-flex items-center gap-3 text-xs tracking-widest-editorial uppercase font-medium ${textColor} ${alignmentClass} ${className}`}
    >
      {withLine && <span className={`w-6 h-[1.5px] ${lineColor}`} />}
      <span>{content}</span>
      {alignment === 'center' && withLine && <span className={`w-6 h-[1.5px] ${lineColor}`} />}
    </div>
  );
};
