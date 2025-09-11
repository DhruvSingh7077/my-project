// src/app/(admin)/page.tsx
import React from 'react';
import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Card container to make it look organised like your reference */}
      <div className="bg-white/5 rounded-2xl p-6 md:p-10 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-3">
          Admin Dashboard
        </h1>

        <p className="text-md text-gray-300 max-w-2xl leading-relaxed mb-6">
          This is the Rackets &amp; Returns admin frontend. Use the Members tab to add and preview members locally.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/members" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Go to Members
          </Link>

          {/* quick stats preview (optional) */}
          <div className="ml-4 text-sm text-gray-300">
            <div className="bg-white/5 rounded px-4 py-2 inline-block">Total members: <strong className="text-white">1</strong></div>
          </div>
        </div>
      </div>

      {/* Optional: add more sections beneath card for quick links / recent activity */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="bg-white/5 rounded-2xl p-6 text-white/90">Quick actions and stats here.</div>
        <div className="bg-white/5 rounded-2xl p-6 text-white/90">More admin widgets here.</div>
      </div>
    </div>
  );
}
