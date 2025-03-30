"use client";

import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  FaEnvelope,
  FaPhone,
  FaSignOutAlt,
  FaTelegramPlane,
} from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

export const Footer = () => {
  const { isLoaded, userId } = useAuth();
  const isAuthorized = isLoaded && userId;

  const handleUpArrow = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      <div className="footer-container">
        <div className="flex items-center justify-around md:py-4 text-sm font-bold md:flex-row-reverse relative">
          <div className="flex flex-col items-center space-y-2 sm:mt-2">
            <Link
              href={
                isAuthorized
                  ? `/manage-your-account`
                  : "/sign-up"
              }
              className="footer-links sm:hidden"
            >
              {isAuthorized ? "Manage your account" : "Sign up"}
            </Link>
            <Link
              href="mailto:sadkalshayee@gmail.com"
              target="_blank"
              className="flex space-x-2 items-center"
            >
              <FaEnvelope size={20} style={{ color: "blue" }} />
              <p className="hidden sm:block footer-links">Email</p>
            </Link>
            <Link
              href="tel: +251968350741"
              target="_blank"
              className="flex space-x-2 items-center"
            >
              <FaPhone size={20} style={{ color: "green" }} />
              <p className="hidden sm:block footer-links">Phone</p>
            </Link>
            <Link
              href="tg://resolve?domain=Silent7951"
              target="_blank"
              className="flex space-x-2 items-center"
            >
              <FaTelegramPlane size={24} style={{ color: "purple" }} />
              <p className="footer-links hidden sm:block">Telegram</p>
            </Link>
            {/* Sign out icon */}
            <SignedIn>
              <SignOutButton>
                <FaSignOutAlt
                  title="sign out"
                  color="red"
                  size={20}
                  className="sm:hidden"
                />
              </SignOutButton>
            </SignedIn>
          </div>
          <div className="text-center font-bold hidden md:block">
            © 2024 Kalab. All rights reserved.
            {/* Sign out */}
            <SignedIn>
              <SignOutButton>
                <FaSignOutAlt
                  title="sign out"
                  color="red"
                  size={20}
                  className="inline ml-1 mb-0.5"
                />
              </SignOutButton>
            </SignedIn>
          </div>
          <div className="hidden sm:block">
            <div className="flex flex-col items-center space-y-2 sm:mt-2">
              <Link
                href={
                  isAuthorized ? `/manage-your-account/` : "/"
                }
                className="footer-links"
              >
                {isAuthorized ? "Manage your account" : "Discover our platform"}
              </Link>
              <Link
                href={isAuthorized ? `/about-us` : "/sign-up"}
                className="footer-links"
              >
                {isAuthorized ? "About us" : "Get Started"}
              </Link>
              <Link
                href={isAuthorized ? `/contact-us` : "/sign-in"}
                className="footer-links"
              >
                {isAuthorized ? "Contact us" : "Sign in"}
              </Link>
            </div>
          </div>
          <FaArrowUp
            title="^To the top^"
            onClick={handleUpArrow}
            className="absolute right-4 top-1 text-xl text-yellow-700 md:right-[48%]"
          />
        </div>
        <div className="text-center font-bold md:hidden">
          © 2024 Kalab. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
