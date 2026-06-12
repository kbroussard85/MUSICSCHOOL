import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg";
  const variants = {
    primary: "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-violet-500/10",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-white/5",
    danger: "bg-rose-500/15 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
