"use client";
import type { Resolver } from "react-hook-form";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Member, MembershipType, Sport } from "@/lib/types";
import { api, ApiError } from "@/lib/apiClient";

// Type for backend class-validator errors
// type ValidationError = {
//   property: string;
//   constraints?: Record<string, string>;
// };

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
  name: z
    .string()
    .min(1, "Full name is required")
    .transform((val) => val.trim()),
  email: z
    .string()
    .email("Enter a valid email")
    .transform((val) => val.trim()),
  phone: z
    .string()
    .min(6, "Enter a valid phone number")
    .transform((val) => val.trim()),
  linkedin: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val?.trim()),
  referredBy: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val?.trim()),
  membership: z.enum(membershipOptions),
  sports: z.array(z.enum(sportsList)).optional(),
  joiningReason: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal(""))
    .transform((val) => val?.trim()),
  contribution: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal(""))
    .transform((val) => val?.trim()),
});

type FormValues = z.input<typeof schema>;

type Props = {
  onAdd: (member: Member) => void;
  onClose: () => void;
};

export default function MemberForm({ onAdd, onClose }: Props) {
  const resolver: Resolver<FormValues> = zodResolver(schema);
  const {
    register,
    handleSubmit,
    formState: { errors },

    reset,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      membership: "Basic",
      sports: [],
      linkedin: "",
      referredBy: "",
      joiningReason: "",
      contribution: "",
    },
  });

  const [formError, setFormError] = useState("");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("=== Form Submitted Data ===", data);
    try {
      setFormError("");

      //Step 1: Ensure full_name is non-empty
      const fullName = data.name?.trim();
      // console.log("Trimmed fullName:", fullName);
      // if (!fullName) {
      //   setFormError("Full name is required");
      //   console.warn("Full name is empty!");
      //   return; // stop submission
      // }

      // ✅ Step 2: Prepare payload and optionally log it
      const payload = {
        full_name: fullName, // already trimmed
        email: data.email, // already trimmed
        phone: data.phone || undefined,
        linkedin: data.linkedin || undefined,
        referred_by: data.referredBy || undefined,
        membership_type: data.membership,
        sports: data.sports ?? [],
        why_join: data.joiningReason || undefined,
        contribution: data.contribution || undefined,
      };

      console.log("Sending payload:", payload);

      const savedUser = await api<Member>("/users/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      console.log("Backend response:", savedUser);

      onAdd(savedUser);
      reset();
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        // Log backend error for debugging
        console.error("Backend error:", err.message, err.details);

        // Only show generic form error, ignore field-level backend validation
        setFormError(err.message || "Something went wrong.");
      } else if (err instanceof Error) {
        setFormError(err.message || "Something went wrong.");
      } else {
        setFormError("An unknown error occurred.");
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 text-gray-600 relative pb-28"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-white text-2xl font-serif font-semibold">
          Add New Member
        </h2>
        <p className="text-white text-sm">
          Add a new member to the Rackets and Returns community. Fill out their
          information below.
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow p-6">
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
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">
              Why joining the club?
            </label>
            <textarea
              {...register("joiningReason")}
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

      {/* Form error */}
      {formError && (
        <p className="text-sm text-red-600 text-center">{formError}</p>
      )}

      {/* Footer */}
      <div className="sticky bottom-0 left-0 right-0">
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
              className="bg-white px-4 py-2 rounded-md text-emerald-800 font-medium"
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
