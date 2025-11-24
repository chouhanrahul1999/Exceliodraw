import React, { useState, useEffect } from 'react';
import { Menu, X, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check login status on mount
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleSignout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    window.location.reload();
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Pencil className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Excelidraw</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            {loggedIn ? (
              <button
                className="bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                onClick={handleSignout}
              >
                Signout
              </button>
            ) : (
              <>
                <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                  onClick={() => router.push('/signin')}
                >
                  Signin
                </button>
              </>
            )}
          </div>
          
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
          <div className="p-4 space-y-4">
            <a 
              href="#features" 
              className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            {loggedIn ? (
              <button
                className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  handleSignout();
                  setIsOpen(false);
                }}
              >
                Signout
              </button>
            ) : (
              <button
                className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  router.push('/signin');
                  setIsOpen(false);
                }}
              >
                Signin
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;