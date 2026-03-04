"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import axios from "axios";
import apiClient from "@/lib/axios";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await apiClient.post("/api/auth/verify-email", { email, otp });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || "Verification failed");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    setIsResending(true);
    setError("");

    try {
      await apiClient.post("/api/auth/resend-otp", { email });
      setCooldown(60);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || "Failed to resend code");
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
          Email Verified! 🎉
        </h2>
        <p className="text-muted-foreground mb-2">
          Welcome to JGEC Alumni Pune! A welcome email with the WhatsApp group link has been
          sent to your inbox.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting to login page...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
          Verify Your Email
        </h2>
        <p className="text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="font-medium text-foreground mt-1">{email}</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2 text-center">
          Verification Code
        </label>
        <Input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setOtp(val);
            setError("");
          }}
          placeholder="Enter 6-digit code"
          className="text-center text-2xl tracking-[0.5em] font-mono"
        />
      </div>

      <Button type="submit" variant="default" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Email"
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Didn&apos;t receive the code?
        </p>
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={cooldown > 0 || isResending}
          className="text-sm text-accent hover:underline disabled:opacity-50 disabled:no-underline inline-flex items-center gap-1"
        >
          {isResending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
        </button>
      </div>
    </form>
  );
}

export default function VerifyEmailPage() {
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
            Almost There!
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Just one more step to join the JGEC Alumni community in Pune.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>}>
            <VerifyEmailContent />
          </Suspense>
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-accent">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
