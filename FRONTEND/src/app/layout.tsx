// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Rackets & Returns — Admin',
  description: 'Admin panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-foreground)]">
          <header className="bg-gray/900 backdrop-blur-sm border-b">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="font-semibold text-lg">Rackets & Returns</Link>
                <span className="text-xs text-gray-500">admin</span>
              </div>

              <nav className="flex items-center gap-4 text-sm">
                <Link href="/members" className="text-gray-600 hover:text-gray-900">Members</Link>
                <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              </nav>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
