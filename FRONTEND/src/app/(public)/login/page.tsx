"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/apiClient";

type LoginResponse = {
  access_token?: string;
  message?: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    try {
      const response = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (response.access_token) {
        localStorage.setItem("adminToken", response.access_token);
        router.push("/members");
      } else {
        setError("Login failed - Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-10">
      <div className="flex flex-col items-center">
        {/* Keeping your existing icon */}
        <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-6">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="9" stroke="black" strokeWidth="1" />
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="black"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="text-3xl text-gray-600 font-extrabold mb-6">
          Admin Login
        </h1>

        <form className="w-full max-w-xl" onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-black">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full border rounded-lg p-4 mb-2 placeholder:italic placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />

          <label className="block mb-2 font-medium text-black">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full border rounded-lg p-4 mb-6 placeholder:italic placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />

          {error && <div className="mb-4 text-red-600">{error}</div>}

          <button
            type="submit"
            className={`w-full py-4 rounded-xl text-white text-lg font-semibold ${
              loading ? "opacity-60" : "bg-black"
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          Designed for Rackets & Returns Admin Panel — v0
        </p>
      </div>
    </div>
  );
}
