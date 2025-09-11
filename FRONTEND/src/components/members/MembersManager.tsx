// src/components/members/MembersManager.tsx
"use client";

import React, { useEffect, useState } from "react";
import MemberForm from "./MemberForm";
import MemberList from "./MemberList";
import MemberStats from "./MemberStats";
import { Member } from "@/lib/types";
import Button from "@/components/ui/Button";
import { api, ApiError } from "@/lib/apiClient";

export default function MembersManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const data = await api<Member[]>("/users");
        setMembers(
          data.map((m) => ({
            ...m,
            createdAt: m.createdAt || new Date().toISOString(),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch members:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  async function addMember(m: Member) {
    try {
      const payload = {
        full_name: m.name?.trim(),
        email: m.email?.trim(),
        phone: m.phone?.trim() || undefined,
        linkedin: m.linkedin?.trim() || undefined,
        referred_by: m.referredBy?.trim() || undefined,
        membership_type: m.membership,
        sports: m.sports ?? [],
        why_join: m.joiningReason?.trim() || undefined,
        contribution: m.contribution?.trim() || undefined,
      };

      const savedUser = await api<Member>("/users/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setMembers((prev) => [savedUser, ...prev]);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        // Always log message + details
        console.error("Backend error:", err.message, err.details);
        // If details is array (class-validator errors), show first one
        if (Array.isArray(err.details)) {
          const firstError = err.details[0];
          const msg = firstError?.constraints
            ? Object.values(firstError.constraints)[0]
            : err.message;
          alert(`Error: ${msg}`);
        } else {
          alert(`Error: ${err.message || JSON.stringify(err.details)}`);
        }
      } else if (err instanceof Error) {
        alert(`Unexpected error: ${err.message}`);
      } else {
        alert("An unknown error occurred");
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Members</h2>
          <p className="text-sm text-gray-500">
            Manage members and membership types (local state only — v0).
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>Add Member</Button>
      </div>

      <MemberStats members={members} />
      {loading ? <p>Loading members...</p> : <MemberList members={members} />}

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
