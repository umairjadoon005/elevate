"use client";

import Link from "next/link";
import { LayoutDashboard, Calendar, Gift } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#E9E8E1] via-[#D8D9CC] to-[#C8CABB]">

      {/* Sidebar */}
      <aside className="w-[240px] p-5 border-r border-white/40 bg-white/60 backdrop-blur-xl shadow-sm">

        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-xl font-semibold text-[#2F2F2F]">
            Elevate
          </h1>
          <p className="text-xs text-[#6F6F6F]">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="space-y-2">

          <SidebarLink href="/admin/dashboard" icon={<LayoutDashboard size={18} />}>
            Events
          </SidebarLink>

          <SidebarLink href="/admin/rewards" icon={<Gift size={18} />}>
            Rewards
          </SidebarLink>

        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

/* Sidebar Link */
function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 rounded-xl text-[#4F4F4F] hover:bg-white/60 hover:text-[#2F2F2F] transition"
    >
      {icon}
      <span className="text-sm">{children}</span>
    </Link>
  );
}