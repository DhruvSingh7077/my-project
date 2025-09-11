export async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in .env.local");
  }

  // Ensure no duplicate slashes when concatenating
  const url = `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  console.log("Fetching:", url);

  const res = await fetch(url, {
    credentials: "include", // send cookies
    headers: {
      "Content-Type": "application/json",
    },
    ...opts,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
