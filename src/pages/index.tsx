import "../app/globals.css";

import React, { useEffect, useState } from "react";
import { FaUserSecret, FaTrashAlt, FaToggleOn } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen">
      <div className="bg-red-500 text-white w-full p-4">
        <div className="marquee">
          <p>
            This is a test SaaS, not a real company. However, the system is
            secure and fully functional. For support, contact the creator,
            Da4ndo, at contact@da4ndo.com.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-1 py-5">
        {" "}
        {/* Reduced padding here */}
        {/* Navigation */}
        <nav className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/myalias-removebg.png"
              alt="myalias logo"
              className="w-full h-20 mr-4 bg-gray-100 bg-opacity-100 rounded"
            />
          </div>
          <div>
            <a
              href="/login"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-150">
              Login
            </a>
            <a
              href="/signup"
              className="ml-4 px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100 transition duration-150">
              Join Waitlist
            </a>
          </div>
        </nav>
        {/* Hero Section */}
        <header className="mt-10 md:mt-16 relative bg-blue-500 rounded-lg p-8">
          {" "}
          {/* Reduced margin and padding here */}
          <img
            src="/background-image.jpg"
            alt="Background Image"
            className="w-full h-64 md:h-[400px] object-cover mb-3 rounded"
          />{" "}
          {/* Placeholder for a background image */}
          <div className="container mx-auto relative z-20">
            <div className="text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="space-y-8 md:space-y-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {" "}
                  {/* Reduced font size here */}
                  Reimagine Your Email Workflow
                </h1>
                <p className="text-lg md:text-xl text-white leading-relaxed">
                  {" "}
                  {/* Reduced font size here */}
                  With myalias, take control of your email. Create and manage
                  aliases seamlessly, ensuring your main email stays
                  clutter-free.
                </p>
                <div className="mt-6">
                  {" "}
                  {/* Reduced margin here */}
                  <a
                    href="/signup"
                    className="inline-block px-8 py-3 text-lg bg-white text-blue-600 rounded-full shadow-lg hover:bg-gray-200 transition duration-200">
                    Join Waitlist
                  </a>
                </div>
              </div>
              <div className="hidden md:block mt-6">
                {" "}
                {/* Reduced margin here */}
                {/* Placeholder for an illustration */}
              </div>
            </div>
          </div>
        </header>
        {/* Features Section */}
        <section className="mt-20 py-16 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 px-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full mb-8 flex items-center justify-center">
                <FaUserSecret className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Alias</h3>
              <p className="text-gray-600">
                Create unique aliases for different purposes, keeping your main
                email clutter-free.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full mb-8 flex items-center justify-center">
                <FaTrashAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Delete Alias</h3>
              <p className="text-gray-600">
                Easily delete aliases that are no longer needed, managing your
                email workflow efficiently.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full mb-8 flex items-center justify-center">
                <FaToggleOn className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Enable/Disable Alias
              </h3>
              <p className="text-gray-600">
                Enable or disable aliases as per your needs, giving you full
                control over your email.
              </p>
            </div>
            {/* ... Add more features if needed */}
          </div>
        </section>
        {/* Plans Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">
            Choose Your Plan
          </h2>
          <div className="flex space-x-8">
            {/* Free Plan */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 text-center transition transform hover:scale-105">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <ul className="text-gray-600 mb-8 text-lg">
                <li className="mb-2">✔ Instant Email Forwarding</li>
                <li className="mb-2">✔ Limited alias creation (10)</li>
                <li className="mb-2">✔ Encrypted emails</li>
                <li className="mb-2">✔ We do not peek into your emails</li>
                <li className="mb-2">✔ We do not store your emails</li>

                {/* ... Add more features */}
              </ul>
              <a
                href="/signup"
                className="inline-block px-8 py-3 text-lg bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-150">
                Get Started
              </a>
            </div>

            {/* Plus Plan */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 text-center transition transform hover:scale-105">
              <h3 className="text-2xl font-bold mb-1 text-blue-500">Plus</h3>
              <p className="text-lg text-gray-700 mb-3">$10/mo</p>
              <ul className="text-gray-600 mb-8 text-lg">
                <li className="mb-2">✔ Unlimited alias creation</li>
                <li className="mb-2">✔ Advanced spam filter</li>
                <li className="mb-2">✔ 24/7 premium live support</li>
                <li className="mb-2">✔ Custom alias email</li>
                {/* ... Add more features */}
              </ul>
              <button
                disabled
                className="inline-block px-8 py-3 text-lg bg-gray-500 text-white rounded-full cursor-not-allowed hover:bg-gray-600 transition duration-150">
                Coming Soon
              </button>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="mt-20">
          <p className="text-center text-gray-300">
            © 2023 myalias.pro All rights reserved.
          </p>
          <p className="text-center text-gray-300">
            <a
              href="/terms-of-service"
              className="text-gray-300 hover:underline">
              Terms of Service
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
