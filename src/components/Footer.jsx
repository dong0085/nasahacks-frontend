import spaceImage from "../assets/space_image1.png";

export default function Footer() {
  return (
    <footer
      className="mt-auto border-t"
      style={{
        backgroundImage: `linear-gradient(rgba(28,32,38,0.9), rgba(28,32,38,0.9)), url(${spaceImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-200">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              NASA.gov
            </a>
            <a
              href="https://www.nasa.gov/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.nasa.gov/about/highlights/HP_Privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              Terms of Use
            </a>
          </div>

          <div className="text-center md:text-right text-neutral-300">
            <p>© 2025 NASA Research Assistant. For educational purposes.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
