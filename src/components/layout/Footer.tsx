export function Footer() {
  return (
    <footer className="border-t border-black bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="font-mono text-xs text-[#888888] uppercase tracking-widest">
          © {new Date().getFullYear()} Flick. All rights reserved.
        </p>
        <p className="font-mono text-xs text-[#888888]">
          No app. No signup. Just scan and share.
        </p>
      </div>
    </footer>
  );
}
