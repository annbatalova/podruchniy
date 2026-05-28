import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost' | 'light' | 'pill';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
  id?: string;
  disabled?: boolean;
  onClick?: any;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  key?: any;
}

export default function Button({
  variant = 'solid',
  size = 'md',
  isActive = false,
  className = '',
  children,
  id,
  disabled = false,
  ...props
}: ButtonProps) {
  // Let's generate a unique fallback ID if none is provided, to satisfy guidelines
  const buttonId = id || `btn_${Math.random().toString(36).substr(2, 9)}`;

  // Size classes mapping
  const sizeClasses = {
    xs: 'px-2 py-1 text-[10px] rounded-lg gap-1',
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2.5 text-xs rounded-2xl gap-2',
    lg: 'px-5 py-3 text-sm rounded-2xl gap-2.5',
  };

  // Base state definition, focused entirely on sky-blue/blue hues for ultimate aesthetic consistency
  const baseClasses = 'inline-flex items-center justify-center font-bold tracking-tight transition duration-150 cursor-pointer outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant class mapping
  let variantClasses = '';

  if (variant === 'solid') {
    variantClasses = isActive || !disabled
      ? 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-sm shadow-sky-500/10'
      : 'bg-sky-305 bg-sky-300 text-white';
  } else if (variant === 'outline') {
    if (isActive) {
      variantClasses = 'border-2 border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-500/20';
    } else {
      variantClasses = 'border border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/5 hover:bg-sky-500/10 hover:border-sky-500/50';
    }
  } else if (variant === 'ghost') {
    if (isActive) {
      variantClasses = 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-extrabold';
    } else {
      variantClasses = 'text-sky-600 dark:text-sky-400 hover:bg-sky-500/8 hover:text-sky-700 dark:hover:text-sky-300';
    }
  } else if (variant === 'light') {
    if (isActive) {
      variantClasses = 'bg-sky-500 text-white shadow-sm';
    } else {
      variantClasses = 'bg-sky-50 dark:bg-sky-950/45 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-950/65';
    }
  } else if (variant === 'pill') {
    // Elegant pill styling, used e.g. for years selector/tabs
    if (isActive) {
      variantClasses = 'bg-sky-500 text-white border-transparent shadow-sm shadow-sky-500/15 font-black';
    } else {
      variantClasses = 'bg-sky-50/70 dark:bg-sky-900/40 hover:bg-sky-100/80 dark:hover:bg-sky-900/60 border border-sky-500/20 text-sky-700 dark:text-sky-300';
    }
  }

  // Combine and tidy classes
  const combinedClasses = `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses} ${className}`.trim();

  return (
    <button id={buttonId} className={combinedClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
