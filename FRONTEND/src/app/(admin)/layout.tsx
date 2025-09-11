import Link from "next/link";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold">Rackets &amp; Returns <span className="text-sm font-normal ml-2">admin</span></div>
          <nav className="space-x-6">
            <Link href="/members" className="text-sm hover:underline">Members</Link>
            <Link href="/" className="text-sm hover:underline">Home</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
