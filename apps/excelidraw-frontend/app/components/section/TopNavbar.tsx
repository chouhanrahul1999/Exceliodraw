"use client";
import { ExButton } from "../ui/ExButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export const TopNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

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

        <div className="gap-3 flex items-center">
          {mounted && user ? (
            <>
              <div className="w-9 h-9 pt-1 rounded-full bg-blue-500 flex items-center justify-center font-sans text-white text-sm font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <ExButton
                text="Sign out"
                size="sm"
                variant="secondary"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              />
            </>
          ) : (
            <>
              <ExButton
                text="Sign in"
                size="sm"
                variant="secondary"
                onClick={() => {
                  router.push("/signin");
                }}
              />
              <ExButton
                text="Free whiteboard"
                size="sm"
                variant="primary"
                onClick={() => {
                  router.push("/signup");
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
