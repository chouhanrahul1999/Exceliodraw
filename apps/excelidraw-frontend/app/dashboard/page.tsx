
import { Hero } from "../components/section/Hero";
import { Inspired } from "../components/section/Inspired";
import { Shortcuts } from "../components/section/Shortcuts";
import { TopNavbar } from "../components/section/TopNavbar";

export default function dashboard() {
  return (
    <div className="bg-[#f8fff8]">
      <TopNavbar />
      <Hero />
      <Inspired />
      <Shortcuts />
    </div>
  );
}
