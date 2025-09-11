// src/components/members/MemberList.tsx
'use client'; // ensure this component only renders on the client

import React from 'react';
import { Member } from '@/lib/types';

export default function MemberList({ members }: { members: Member[] }) {
  if (members.length === 0) return <div className="text-sm text-gray-600">No members yet.</div>;

  // helper to produce a deterministic, locale-independent format (24-hour, no AM/PM)
  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      // Use en-GB 24-hour style so there's no AM/PM casing differences
      return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full table-auto bg-white rounded-2xl">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="px-4 py-3 font-semibold text-gray-800">Name</th>
            <th className="px-4 py-3 font-semibold text-gray-800">Email</th>
            <th className="px-4 py-3 font-semibold text-gray-800">Membership</th>
            <th className="px-4 py-3 font-semibold text-gray-800">Added</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="px-4 py-3 text-black">{m.name}</td>
              <td className="px-4 py-3 text-black">{m.membership}</td>
              <td className="px-4 py-3 text-black">{m.email ?? '—'}</td>
              <td className="px-4 py-3 text-sm text-black">{formatDate(m.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
