// src/components/members/MemberForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Member, MembershipType, Sport } from "@/lib/types";
import { api } from "@/lib/apiClient"; //

const sportsList: Sport[] = [
  "Tennis",
  "Badminton",
  "Squash",
  "Pickleball",
  "Padel",
];
const membershipOptions: MembershipType[] = [
  "Active",
  "Premium",
  "VIP",
  "Basic",
];

const schema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  linkedin: z.string().optional().or(z.literal("")),
  referredBy: z.string().optional().or(z.literal("")),
  membership: z.enum(["Active", "Premium", "VIP", "Basic"]),
  sports: z
    .array(z.enum(["Tennis", "Badminton", "Squash", "Pickleball", "Padel"]))
    .optional(),
  joiningReason: z.string().max(1000).optional().or(z.literal("")),
  contribution: z.string().max(1000).optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  onAdd: (member: Member) => void;
  onClose: () => void;
};

export default function MemberForm({ onAdd, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      membership: "Basic",
      sports: [],
      linkedin: "",
      referredBy: "",
      joiningReason: "",
      contribution: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        linkedin: data.linkedin || undefined,
        referred_by: data.referredBy || undefined,
        membership_type: data.membership,
        sports: data.sports ?? [],
        why_join: data.joiningReason || undefined,
        contribution: data.contribution || undefined,
      };

      const savedUser = await api<Member>("/users/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      onAdd(savedUser);
      reset();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to save member:", err);
        alert(`Failed to save member: ${err.message}`);
      } else {
        console.error("Unknown error:", err);
        alert("An unknown error occurred while saving member.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-gray-600">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-serif font-semibold">Add New Member</h2>
        <p className="text-sm">
          Add a new member to the Rackets and Returns community. Fill out their
          information below.
        </p>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">👤</span>
          <div>
            <div className="font-medium">Personal Information</div>
            <div className="text-sm">
              Basic member details and contact information
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Full Name *</label>
            <input
              {...register("name")}
              placeholder="Enter full name"
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Email Address *</label>
            <input
              {...register("email")}
              placeholder="your.email@example.com"
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Phone Number *</label>
            <input
              {...register("phone")}
              placeholder="+91 98765 43210"
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              LinkedIn Profile
            </label>
            <input
              {...register("linkedin")}
              placeholder="linkedin.com/in/yourprofile"
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Referred By</label>
            <input
              {...register("referredBy")}
              placeholder="Name of referring member"
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Membership Type *
            </label>
            <select
              {...register("membership")}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            >
              {membershipOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sports Preferences */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">🏸</span>
          <div>
            <div className="font-medium">Sports Preferences</div>
            <div className="text-sm">
              Select the sports this member is interested in
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sportsList.map((s) => (
            <label key={s} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                value={s}
                {...register("sports")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">📝</span>
          <div>
            <div className="font-medium">Additional Information</div>
            <div className="text-sm">Optional details about the member</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">
              Why joining the club?
            </label>
            <textarea
              {...register("joiningReason")}
              placeholder="Member's motivation for joining..."
              rows={4}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
            {errors.joiningReason && (
              <p className="text-sm text-red-600 mt-1">
                {errors.joiningReason.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              What they bring to the community?
            </label>
            <textarea
              {...register("contribution")}
              placeholder="Skills, experience, or value they add..."
              rows={4}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
            {errors.contribution && (
              <p className="text-sm text-red-600 mt-1">
                {errors.contribution.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer action bar (dark green like screenshot) */}
      <div className="sticky bottom-4">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 px-6 py-4 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">*</span> Required fields — The member
            will be added with active status.
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="bg-white/10 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-white text-emerald-800 px-4 py-2 rounded-md font-medium"
            >
              Add Member
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
