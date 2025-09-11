// src/components/members/MembersManager.tsx
"use client";
import React, { useEffect, useState } from "react";
import MemberForm from "./MemberForm";
import MemberList from "./MemberList";
import MemberStats from "./MemberStats";
import { Member } from "@/lib/types";
import Button from "@/components/ui/Button";
import { fetchMembers } from "@/lib/apiClient";

export default function MembersManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await fetchMembers();
        setMembers(data);
      } catch (err) {
        console.error("Failed to load members:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  function addMember(m: Member) {
    // Optimistic update
    setMembers((prev) => [m, ...prev]);
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

        <div>
          <Button onClick={() => setShowAdd(true)}>Add Member</Button>
        </div>
      </div>

      <MemberStats members={members} />

      <MemberList members={members} />

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowAdd(false)}
          />
          <div className="relative z-10 w-full max-w-3xl p-6">
            <div className="bg-transparent rounded-2xl">
              <div className="bg-[color:var(--color-background)] rounded-2xl shadow-lg">
                <div className="p-6">
                  <MemberForm
                    onAdd={addMember}
                    onClose={() => setShowAdd(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
