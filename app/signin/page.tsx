"use client";
import Image from "next/image";
import { useState } from "react";

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // logs in browser console
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side */}
      <div className="flex-1 hidden lg:flex items-center justify-center bg-surface p-8">
        <div className="max-w-md text-center">
          <Image
            src={!isSignUp ? "/sign-in.svg" : "/sign-up.svg"}
            alt={isSignUp ? "sign up" : "sign in"}
            width={450}
            height={450}
            className="mx-auto mb-6"
          />
          <p className="text-text-muted text-lg font-medium">
            {!isSignUp
              ? "Access the latest AI insights and stay ahead of the curve."
              : "Be part of a global community sharing knowledge that matters."}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center bg-primary p-8 rounded-none lg:rounded-t-none lg:rounded-l-4xl">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-semibold text-black mb-2">
            {!isSignUp ? "Welcome back" : "Join the community"}
          </h1>
          <p className="text-text-muted mb-6">
            {!isSignUp
              ? "Sign in to continue your journey and stay connected."
              : "Create your account and start sharing with the world."}
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-1"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1"
              >
                Password
              </label>
              <div className="relative w-full ">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
                <span
                  onClick={toggleShowPassword}
                  className="absolute top-2 right-4 text-black hover:text-primary cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}{" "}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition cursor-pointer"
            >
              {!isSignUp ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle Auth */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleAuthMode}
              className="text-sm font-medium text-black transition cursor-pointer"
            >
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <span className="text-primary hover:text-secondary cursor-pointer">
                    Sign in
                  </span>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <span className="text-primary hover:text-secondary cursor-pointer">
                    Sign up
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
