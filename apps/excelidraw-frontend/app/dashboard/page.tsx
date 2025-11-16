
import { CommandPalette } from "../components/section/CommandPalette";
import { Footer } from "../components/section/Footer";
import { Hero } from "../components/section/Hero";
import { Inspired } from "../components/section/Inspired";
import { Navigate } from "../components/section/Navigate";
import { Shortcuts } from "../components/section/Shortcuts";
import { TopNavbar } from "../components/section/TopNavbar";
import { Whiteboard } from "../components/section/Whiteboard";

export default function dashboard() {
  return (
    <div className="bg-[#f8fff8]">
      <TopNavbar />
      <Hero />
      <Inspired />
      <Shortcuts />
      <CommandPalette />
      <Navigate />
      <Whiteboard />
      <Footer />
    </div>
  );
}
