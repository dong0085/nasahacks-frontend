import { Link } from "react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-[#1C2026] backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to={"/Home"}>
          <div>
            <h1 className="text-base sm:text-lg font-semibold">
              NASA Research Assistant
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Explore Space Research Papers
            </p>
          </div>
        </Link>
        <div>
          <Link to={"/Home"}>
            <button className="rounded-lg px-3 py-1.5 text-sm cursor-pointer">
              New Chat
            </button>
          </Link>
          <Link to={"/About"}>
            <button className="rounded-lg px-3 py-1.5 text-sm cursor-pointer">
              About us
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
