import { FaXTwitter } from "react-icons/fa6";
import { VscGithubAlt } from "react-icons/vsc";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer>
      <div className="bg-[url(https://as2.ftcdn.net/v2/jpg/05/19/73/39/1000_F_519733913_rsuvNKC76m4RWgKwrQz8sOteM8HpnAT5.jpg)] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-gray-950 opacity-60"></div>
        <div className="h-fit flex justify-between relative z-10">
          <div className="p-24">
            <div>
              <img
                src="https://plus.excalidraw.com/images/logo-dark.svg"
                alt=""
              />
            </div>
            <div className="pt-10 flex gap-4">
              <span className="w-fit bg-black p-2 rounded-md">
                <FaXTwitter size={20} color="white" />
              </span>
              <span className="w-fit bg-black p-2 rounded-md">
                <VscGithubAlt size={20} color="white" />
              </span>
              <span className="w-fit bg-black p-2 rounded-md">
                <FaLinkedin size={20} color="white" />
              </span>
              <span className="w-fit bg-black p-2 rounded-md">
                <FaInstagram size={20} color="white" />
              </span>
            </div>
          </div>
          <div className="flex gap-16 p-24 text-white">
            {/* Explore */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">Explore</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Libraries
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Use Cases
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security & Compliance
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white">
                    Terms of use
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    How to start
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    For Teams
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    For Education
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Release notes
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact us */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">Contact us</h3>
              <p className="text-gray-400">
                <a
                  href="mailto:support@excalidraw.com"
                  className="hover:text-white"
                >
                  support@excalidraw.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
