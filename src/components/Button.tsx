import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface ButtonProps {
  children?: React.ReactNode;
  to?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'light' | 'ghost' | 'liquid' | 'olive' | 'dark' | 'white' | 'white-fill';
  onClick?: () => void;
  className?: string;
  withArrow?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children = 'Hover me',
  to,
  href,
  variant = 'primary',
  onClick,
  className = '',
  withArrow = false,
  type = 'button',
  disabled = false,
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest-editorial font-medium px-6 sm:px-8 py-3.5 rounded-full cursor-pointer knowza-btn-liquid group whitespace-nowrap text-center select-none transition-all";
  
  const variants = {
    primary: "knowza-btn-liquid-primary shadow-md",
    secondary: "knowza-btn-liquid-secondary",
    light: "knowza-btn-liquid-olive",
    olive: "knowza-btn-liquid-olive-fill shadow-md",
    dark: "knowza-btn-liquid-dark",
    white: "knowza-btn-liquid-white",
    'white-fill': "knowza-btn-liquid-white-fill shadow-md",
    ghost: "bg-transparent text-knowza-dark hover:text-knowza-olive p-0",
    liquid: "knowza-btn-liquid-dark"
  };

  const content = (
    <>
      <span className="relative z-10 whitespace-nowrap">{children}</span>
      {withArrow && (
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 relative z-10" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${baseStyles} ${variants[variant]} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {content}
    </button>
  );
};

export default Button;
