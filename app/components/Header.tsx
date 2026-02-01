"use client";

export function Header() {
  return (
    <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#8b7360] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">
                home_work
              </span>
            </div>
            <span className="font-serif italic text-xl tracking-tight text-stone-900">
              Third Places Vancouver
            </span>
          </div>
          <nav className="flex items-center space-x-8">
            <a
              className="text-xs uppercase tracking-widest font-semibold text-stone-500 hover:text-[#8b7360] transition-colors"
              href="#"
            >
              About
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
