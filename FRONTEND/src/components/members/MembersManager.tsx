// src/components/members/MembersManager.tsx
"use client";

import React, { useEffect, useState } from "react";
import MemberForm from "./MemberForm";
import MemberList from "./MemberList";
import MemberStats from "./MemberStats";
import { Member, MembershipType, Sport } from "@/lib/types";
import Button from "@/components/ui/Button";
import { api, ApiError } from "@/lib/apiClient";

/**
 * Backend response shape (snake_case) — replace `any` usage with this type.
 */
type ApiMember = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  referred_by?: string;
  membership_type: string;
  sports?: string[];
  why_join?: string | null;
  contribution?: string | null;
  created_at?: string;
  error?: string;
  message?: string;
};

export default function MembersManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // helper to map API (snake_case) -> Member (camelCase)
  function mapApiToMember(apiUser: ApiMember): Member {
    return {
      id: apiUser.id,
      name: apiUser.full_name,
      email: apiUser.email,
      phone: apiUser.phone,
      linkedin: apiUser.linkedin,
      referredBy: apiUser.referred_by,
      membership: apiUser.membership_type as MembershipType,
      sports: (apiUser.sports ?? []) as Sport[],
      joiningReason: apiUser.why_join ?? "",
      contribution: apiUser.contribution ?? "",
      createdAt: apiUser.created_at ?? new Date().toISOString(),
    };
  }

  async function fetchMembers() {
    try {
      setLoading(true);
      setError("");
      const data = await api<ApiMember[]>("/users");
      if (!data || !Array.isArray(data)) {
        setError("Failed to load members: invalid response");
        return;
      }
      setMembers(data.map(mapApiToMember));
    } catch (err) {
      console.error("Failed to fetch members:", err);
      setError(
        err instanceof ApiError ? err.message : "Failed to load members"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  async function addMember(m: Member) {
    try {
      if (!m.name?.trim() || !m.email?.trim()) {
        setError("Name and email are required");
        return;
      }

      const payload = {
        full_name: m.name.trim(),
        email: m.email.trim().toLowerCase(), // Ensure lowercase
        phone: m.phone?.trim() || undefined,
        linkedin: m.linkedin?.trim() || undefined,
        referred_by: m.referredBy?.trim() || undefined,
        membership_type: m.membership,
        sports: m.sports ?? [],
        why_join: m.joiningReason?.trim() || undefined,
        contribution: m.contribution?.trim() || undefined,
      };

      // First check if email exists
      const existingMembers = await api<ApiMember[]>("/users");
      const emailExists = existingMembers.some(
        (m) => m.email.toLowerCase() === payload.email.toLowerCase()
      );

      if (emailExists) {
        setError(`Email ${payload.email} is already registered`);
        return;
      }

      // If email doesn't exist, proceed with registration
      const savedUser = await api<ApiMember>("/users/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const newMember = mapApiToMember(savedUser);
      setMembers((prev) => [newMember, ...prev]);
      setError("");
      setShowAdd(false);
    } catch (err: unknown) {
      console.error("Failed to add member:", err);

      if (err instanceof ApiError) {
        // Handle specific API errors
        const message = err.message || "Failed to add member";
        setError(message);

        // If it's a conflict error, refresh the members list
        if (err.status === 409) {
          await fetchMembers();
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Members</h2>
          <p className="text-sm text-gray-500">
            Manage members and membership types
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>Add Member</Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <MemberStats members={members} />
      {loading ? (
        <div className="text-center py-4">
          <p>Loading members...</p>
        </div>
      ) : members.length === 0 && !error ? (
        <p className="text-center py-4 text-gray-500">No members found</p>
      ) : (
        <MemberList members={members} />
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowAdd(false)}
          />
          <div className="relative z-10 w-full max-w-4xl p-6">
            <div className="bg-[color:var(--color-background)] rounded-2xl shadow-lg max-h-[90vh] overflow-auto">
              <div className="p-6">
                <MemberForm
                  onAdd={addMember}
                  onClose={() => setShowAdd(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
