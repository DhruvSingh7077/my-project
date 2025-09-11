
import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome — Admin Panel</h1>
      <p className="text-sm text-black max-w-xl">
        This is the Rackets & Returns admin frontend. Use the Members tab to add and preview members locally.
      </p>

      <div className="flex gap-3">
        <Link href="/members" className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white">Go to Members</Link>
      </div>
    </div>
  );
}
