// src/components/members/MemberStats.tsx
'use client';
import React from 'react';
import { Member } from '@/lib/types';
import Card from '@/components/ui/Card';

export default function MemberStats({ members }: { members: Member[] }) {
  const total = members.length;
  const active = members.filter(m => m.membership === 'Active').length;
  const premium = members.filter(m => m.membership === 'Premium').length;
  const vip = members.filter(m => m.membership === 'VIP').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <Card><div className="text-sm text-black">Total</div><div className="text-2xl font-bold text-gray-600">{total}</div></Card>
      <Card><div className="text-sm text-black">Active</div><div className="text-2xl font-bold text-gray-600">{active}</div></Card>
      <Card><div className="text-sm text-black">Premium</div><div className="text-2xl font-bold text-gray-600">{premium}</div></Card>
      <Card><div className="text-sm text-black">VIP</div><div className="text-2xl font-bold text-gray-600">{vip}</div></Card>
    </div>
  );
}
