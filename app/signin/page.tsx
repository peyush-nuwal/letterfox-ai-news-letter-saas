"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, LogIn } from "lucide-react";
import { z, ZodError } from "zod";



const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(100, "Email must be under 100 characters")
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be under 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

const signUpSchema = signInSchema.extend({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces"),
});


export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({}); // field-level errors

  const supabase = createClient();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error while typing
  };

  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
    setMessage(null);
    setErrors({});
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      // validate with Zod
      const schema = isSignUp ? signUpSchema : signInSchema;
      schema.parse(formData);

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
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          // ✅ use `.issues` (not `.errors`)
          const field = issue.path[0];
          if (typeof field === "string") {
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
        setMessage("❌ Please fix the highlighted errors.");
      } else if (error instanceof Error) {
        setMessage(`❌ ${error.message || "Something went wrong"}`);
      } else {
        setMessage("❌ Something went wrong");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`❌ ${error.message || "Google login failed"}`);
      } else {
        setMessage("❌ Google login failed");
      }
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
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
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
                
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
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
                <div className="mt-2 mx-auto w-12/12 flex justify-between items-center gap-2 text-xs text-gray-500 mb-1">
                  <span>Weak</span>

                  <div className="h-[5px] w-full bg-zinc-200 rounded">
                    <div
                      className={`h-[6px] rounded transition-all duration-300 ease-in-out ${
                        formData.password.length < 6
                          ? "bg-red-500 w-1/4" // Weak
                          : formData.password.length < 10
                          ? "bg-yellow-400 w-2/4" // Medium
                          : "bg-green-500 w-full" // Strong
                      }`}
                    />
                  </div>
                  <span>Strong</span>
                </div>

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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
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
