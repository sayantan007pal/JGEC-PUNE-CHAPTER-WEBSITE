"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import axios from "axios";
import apiClient from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await apiClient.post("/api/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || "Something went wrong");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner.src})` }}
        />
        <div className="absolute inset-0 overlay-gradient" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6">
            <span className="text-accent-foreground font-serif font-bold text-3xl">JG</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary-foreground mb-4">
            Forgot Password?
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            No worries! We&apos;ll send you a link to reset your password.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                Check Your Email
              </h2>
              <p className="text-muted-foreground mb-6">
                If an account exists with <strong>{email}</strong>, we&apos;ve sent a password
                reset link to your inbox. Please check your email and follow the instructions.
              </p>
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-accent hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                  Reset Password
                </h2>
                <p className="text-muted-foreground">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-accent hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
