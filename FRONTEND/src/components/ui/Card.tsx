// src/components/ui/Card.tsx
'use client';
import React from 'react';
import clsx from 'clsx';

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-white p-4 rounded-2xl shadow-sm', className)}>
      {children}
    </div>
  );
}
