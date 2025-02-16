import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 md:px-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* About Us */}
        <div>
          <h3 className="text-lg font-semibold mb-2">About Us</h3>
          <p className="text-sm text-gray-400">
            Cloud-K is your go-to platform for ordering delicious meals from top
            restaurants near you.
          </p>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-sm text-gray-400 my-2">
            📍 25 South Street, Swamimalai, Kumbakonam
          </p>
          <p className="text-sm text-gray-400 my-2">📞 +435 234590</p>
          <p className="text-sm text-gray-400 my-2">
            📧 cloudkhelpline@gmail.com
          </p>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Legal</h3>
          <ul className="text-sm  text-gray-400 space-y-1">
            <li>
              <a href="#" className="hover:text-white my-2">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white my-2">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white my-2">
                Refund Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Available Locations */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Available At</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>Swamimalai H/Q</li>
            <li>Kumbakonam</li>
            <li>Chennai</li>
            <li>Thanjavur</li>
          </ul>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-center space-x-6 mt-6">
        <a href="#" className="text-gray-400 hover:text-white text-xl">
          <FaFacebook />
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-xl">
          <FaTwitter />
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-xl">
          <FaInstagram />
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-xl">
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
