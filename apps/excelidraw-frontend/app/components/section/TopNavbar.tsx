"use client";
import { ExButton } from "../ui/ExButton";
import { useEffect, useState } from "react";

export const TopNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`navbar font-virgil sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="flex px-10 py-7 justify-between items-center">
        <div className="flex gap-20 ">
          <div>
            <img src="	https://plus.excalidraw.com/images/logo.svg" alt="" />
          </div>
          <div className="gap-10 flex text-gray-900 justify-center items-center text-sm font-sans                       font-normal ">
            <a href="#">Pricing</a>
            <a href="#">Terms</a>
            <a href="#">Roadmap</a>
          </div>
        </div>

        <div className="gap-3 flex">
          <ExButton
            text="Sign in"
            size="sm"
            variant="secondary"
            onClick={() => {}}
          />
          <ExButton
            text="Free whiteboard"
            size="sm"
            variant="primary"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
