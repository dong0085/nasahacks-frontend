import { Routes, Route, Navigate } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1C2026]">
      <Header />
      <main className="flex-1 flex">
        <div className="flex-1 flex mx-auto max-w-7xl px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}
