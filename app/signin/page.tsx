"use client";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, LogIn } from "lucide-react";

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const supabase = createClient();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
    setMessage(null);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { name: formData.name } },
        });
        if (error) throw error;
        setMessage("✅ Check your email for a confirmation link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        setMessage("🎉 Signed in successfully!");
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message || "Something went wrong"}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage(`❌ ${error.message || "Google login failed"}`);
    }
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

          {/* Message */}
          {message && (
            <p
              className={`px-4 py-2 rounded-xl mb-4 ${
                message.startsWith("✅") || message.startsWith("🎉")
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {message}
            </p>
          )}

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
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-1"
              >
                Your Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="w-full pl-10 pr-10 py-2 border border-border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
                <span
                  onClick={toggleShowPassword}
                  className="absolute top-2.5 right-3 text-gray-500 hover:text-primary cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition cursor-pointer"
            >
              <LogIn className="h-5 w-5" />
              {!isSignUp ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            Continue with Google
          </button>

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
