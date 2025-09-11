// src/lib/types.ts
export type MembershipType = 'Active' | 'Premium' | 'VIP' | 'Basic';

export type Sport =
  | 'Tennis'
  | 'Badminton'
  | 'Squash'
  | 'Pickleball'
  | 'Padel';

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  referredBy?: string;
  membership: MembershipType;
  sports?: Sport[];
  joiningReason?: string;
  contribution?: string;
  createdAt: string;
}
