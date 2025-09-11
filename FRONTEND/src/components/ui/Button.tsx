// src/components/ui/Button.tsx
'use client';
import React from 'react';
import clsx from 'clsx';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' };

export default function Button({ variant = 'primary', className, children, ...rest }: Props) {
  const base = 'px-4 py-2 rounded-2xl text-sm font-medium shadow-sm';
  const v = variant === 'primary'
    ? 'bg-blue-600 text-white hover:bg-blue-700'
    : 'bg-transparent text-gray-700 hover:bg-gray-100';
  return (
    <button className={clsx(base, v, className)} {...rest}>
      {children}
    </button>
  );
}
