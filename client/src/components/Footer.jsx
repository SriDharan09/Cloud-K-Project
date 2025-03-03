import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 mb-10 lg:mb-0 md:mb-0 text-white py-10 px-6 sm:px-10 lg:px-20">
      {/* Footer Grid Layout */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* About Us */}
        <div>
          <h3 className="text-lg font-semibold mb-3">About Us</h3>
          <p className="text-sm text-gray-400">
            Cloud-K is your go-to platform for ordering delicious meals from top
            restaurants near you.
          </p>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-sm text-gray-400">
            📍 25 South Street, Swamimalai
          </p>
          <p className="text-sm text-gray-400">📞 +435 234590</p>
          <p className="text-sm text-gray-400">📧 cloudkhelpline@gmail.com</p>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Legal</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Refund Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Available Locations */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Available At</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>Swamimalai H/Q</li>
            <li>Kumbakonam</li>
            <li>Chennai</li>
            <li>Thanjavur</li>
          </ul>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-700 my-6"></div>

      {/* Social Media Links */}
      <div className="flex justify-center space-x-6">
        <a
          href="#"
          className="text-gray-400 hover:text-white text-2xl transition"
        >
          <FaFacebook />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-white text-2xl transition"
        >
          <FaTwitter />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-white text-2xl transition"
        >
          <FaInstagram />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-white text-2xl transition"
        >
          <FaYoutube />
        </a>
      </div>

      {/* Copyright */}
      <p className="text-center text-sm text-gray-500 mt-6">
        © 2025 VRS Catering | All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
