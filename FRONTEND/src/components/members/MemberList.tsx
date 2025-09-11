// src/components/members/MemberList.tsx
'use client';

import React from 'react';
import { Member } from '@/lib/types';

export default function MemberList({ members }: { members: Member[] }) {
  if (members.length === 0) return <div className="text-sm text-gray-600">No members yet.</div>;

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
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
      <table className="min-w-full table-auto bg-white rounded-2xl overflow-hidden">
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
            <tr key={m.id} className="border-t last:border-b">
              <td className="px-4 py-3 text-black">{m.name}</td>
              <td className="px-4 py-3 text-black">{m.email ?? '—'}</td>
              <td className="px-4 py-3 text-black">{m.membership}</td>
              <td className="px-4 py-3 text-sm text-black">{formatDate(m.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
