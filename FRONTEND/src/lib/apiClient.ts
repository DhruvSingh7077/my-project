// src/lib/apiClient.ts
export interface ApiErrorResponse {
  message?: string | string[];
  statusCode?: number;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  details?: ApiErrorResponse | string;

  constructor(
    status: number,
    message: string,
    details?: ApiErrorResponse | string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base)
    throw new Error("NEXT_PUBLIC_API_URL is not defined in .env.local");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(opts?.headers || {}),
  };

  const url = `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

  const res = await fetch(url, { ...opts, headers });

  if (!res.ok) {
    let errorBody: ApiErrorResponse | string = "";
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text();
    }

    let message = res.statusText;
    if (typeof errorBody !== "string" && errorBody?.message) {
      message = Array.isArray(errorBody.message)
        ? errorBody.message.join(", ")
        : errorBody.message;
    } else if (typeof errorBody === "string" && errorBody.trim()) {
      message = errorBody;
    }

    throw new ApiError(res.status, message, errorBody);
  }

  return (await res.json()) as T;
}
