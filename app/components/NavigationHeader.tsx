"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function NavigationHeader() {
  const pathname = usePathname();
  const isActivitiesPage = pathname.startsWith("/activities");

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 p-1.5 rounded-lg overflow-hidden flex items-center justify-center bg-white/50">
              <Image
                src="/icon.png"
                alt="Third Places Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <span className="hidden md:inline text-xl font-semibold text-gray-900">
              Third Places: Centres
            </span>
          </Link>

          {/* Navigation Buttons */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/activities"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActivitiesPage
                  ? "bg-[#8b7360] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Activities
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-[#8b7360] transition-colors font-medium"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
