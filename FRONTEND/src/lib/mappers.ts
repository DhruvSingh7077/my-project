// src/lib/mappers.ts
import { Member, MembershipType, Sport } from "./types";

export interface SupabaseMemberRow {
  id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  referred_by?: string | null;
  membership_type: MembershipType;
  sports?: Sport[] | null;
  why_join?: string | null;
  contribution?: string | null;
  created_at: string;
}

export function mapMember(row: SupabaseMemberRow): Member {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    linkedin: row.linkedin ?? undefined,
    referredBy: row.referred_by ?? undefined,
    membership: row.membership_type,
    sports: row.sports ?? [],
    joiningReason: row.why_join ?? undefined,
    contribution: row.contribution ?? undefined,
    createdAt: row.created_at,
  };
}
