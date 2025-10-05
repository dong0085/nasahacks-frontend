import { Link } from "react-router";
import spaceImage from "../assets/space_image1.jpg";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{
        backgroundImage: `linear-gradient(rgba(28,32,38,0.9), rgba(28,32,38,0.9)), url(${spaceImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to={"/Home"}>
          <div>
            <h1 className="text-base sm:text-lg font-semibold">
              Nucleus - NASA Research Librarian
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Explore Unknown
            </p>
          </div>
        </Link>
        <div>
          <Link to={"/About"}>
            <button className="rounded-lg px-3 py-1.5 text-sm cursor-pointer hover:underline">
              About us
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
