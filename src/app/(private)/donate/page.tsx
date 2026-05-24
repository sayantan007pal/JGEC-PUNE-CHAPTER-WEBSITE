"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/axios";
import { MAX_PHOTO_SIZE } from "@/constants/user";
import {
  Heart,
  GraduationCap,
  Building2,
  Lightbulb,
  Users,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  X,
  Loader2,
  QrCode,
  ExternalLink,
  Clock,
} from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { QRCodeSVG } from "qrcode.react";
import type { DonationCategory } from "@/models/Donation";

// ─── Static data ─────────────────────────────────────────────────────────────

const CATEGORIES: {
  value: DonationCategory;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    value: "scholarship",
    label: "Student Scholarships",
    icon: GraduationCap,
    description:
      "Support deserving students with financial aid",
  },
  {
    value: "infrastructure",
    label: "Infrastructure",
    icon: Building2,
    description:
      "Help improve college facilities, laboratories.",
  },
  {
    value: "innovation",
    label: "Innovation Fund",
    icon: Lightbulb,
    description:
      "Support student innovation and startups",
  },
  {
    value: "alumni_activities",
    label: "Alumni Activities",
    icon: Users,
    description:
      "Fund chapter events and community initiatives.",
  },
  {
    value: "general",
    label: "General",
    icon: Heart,
    description: "Where it's needed most",
  },
];

const impactNumbers = [
  { value: "₹50L+", label: "Raised to Date" },
  { value: "200+", label: "Students Supported" },
  { value: "15+", label: "Projects Funded" },
  { value: "5", label: "Labs Upgraded" },
];

const PRESET_AMOUNTS = [1000, 5000, 10000];

// ─── Types ───────────────────────────────────────────────────────────────────

type PagePhase = "select" | "initiating" | "payment" | "submitting" | "done";

interface InitiatedPayment {
  donationId: string;
  upiUrl: string;
  qrValue: string;
  paymentRequestRef: string;
  amount: number;
  donationCategory: DonationCategory;
}

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DonatePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1: selection
  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    PRESET_AMOUNTS[0],
  );
  const [customAmount, setCustomAmount] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<DonationCategory>("scholarship");
  const [initiateError, setInitiateError] = useState("");

  // Phase state machine
  const [phase, setPhase] = useState<PagePhase>("select");
  const [payment, setPayment] = useState<InitiatedPayment | null>(null);
  const [showProofForm, setShowProofForm] = useState(false);

  // Proof fields
  const [utr, setUtr] = useState("");
  const [payeeUpi, setPayeeUpi] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [proofImageFile, setProofImageFile] = useState<File | null>(null);
  const [proofImagePreview, setProofImagePreview] = useState<string | null>(
    null,
  );
  const [proofError, setProofError] = useState("");

  // Done
  const [donationId, setDonationId] = useState("");

  // ─── Derived ──────────────────────────────────────────────────────────────

  const effectiveAmount = useMemo(() => {
    if (customAmount.trim()) return Number(customAmount);
    return selectedAmount ?? 0;
  }, [customAmount, selectedAmount]);

  const qrValue = payment?.qrValue ?? payment?.upiUrl ?? "";

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const resetProof = () => {
    setUtr("");
    setPayeeUpi("");
    setDonorMessage("");
    setProofError("");
    setProofImageFile(null);
    setProofImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearProofImage = () => {
    setProofImageFile(null);
    setProofImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleProofImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_PHOTO_SIZE) {
      setProofError(
        `Proof image must be ${MAX_PHOTO_SIZE / (1024 * 1024)} MB or smaller`,
      );
      clearProofImage();
      return;
    }
    setProofImageFile(file);
    setProofError("");
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProofImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setProofImagePreview(null);
    }
  };

  const handleInitiate = async () => {
    setInitiateError("");
    if (!Number.isFinite(effectiveAmount) || effectiveAmount <= 0) {
      setInitiateError("Please enter a valid amount greater than ₹0.");
      return;
    }
    setPhase("initiating");
    try {
      const { data } = await apiClient.post<InitiatedPayment>(
        "/api/donations/initiate",
        {
          amount: effectiveAmount,
          donationCategory: selectedCategory,
        },
      );
      setPayment(data);
      setShowProofForm(false);
      resetProof();
      setPhase("payment");
      if (isMobileDevice()) window.location.href = data.upiUrl;
    } catch (error) {
      setPhase("select");
      if (axios.isAxiosError(error) && error.response) {
        setInitiateError(
          error.response.data?.error || "Failed to initiate payment.",
        );
      } else {
        setInitiateError("Failed to initiate payment.");
      }
    }
  };

  const handleSubmitProof = async (e: FormEvent) => {
    e.preventDefault();
    setProofError("");
    if (!payment) return;
    if (!utr.trim()) {
      setProofError("UTR is required.");
      return;
    }
    if (!proofImageFile) {
      setProofError("Payment screenshot is required.");
      return;
    }
    if (!proofImageFile.type.startsWith("image/")) {
      setProofError("File must be an image.");
      return;
    }
    if (proofImageFile.size > MAX_PHOTO_SIZE) {
      setProofError(
        `Image must be ${MAX_PHOTO_SIZE / (1024 * 1024)} MB or smaller`,
      );
      return;
    }

    setPhase("submitting");
    try {
      const formData = new window.FormData();
      formData.append("utr", utr.trim());
      if (payeeUpi.trim()) formData.append("payeeUpi", payeeUpi.trim());
      if (donorMessage.trim())
        formData.append("donorMessage", donorMessage.trim());
      formData.append("proofImage", proofImageFile);

      const { data } = await apiClient.patch<{
        message: string;
        donationId: string;
      }>(`/api/donations/${payment.donationId}/proof`, formData);
      setDonationId(data.donationId);
      setPhase("done");
    } catch (error) {
      setPhase("payment");
      if (axios.isAxiosError(error) && error.response) {
        setProofError(
          error.response.data?.error || "Failed to submit donation proof.",
        );
      } else {
        setProofError("Failed to submit donation proof.");
      }
    }
  };

  const handleReset = () => {
    setPhase("select");
    setPayment(null);
    setDonationId("");
    setSelectedAmount(PRESET_AMOUNTS[0]);
    setCustomAmount("");
    setSelectedCategory("scholarship");
    setInitiateError("");
    resetProof();
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner.src})` }}
        />
        <div className="absolute inset-0 overlay-gradient" />
        <div className="relative z-10 container-custom px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
            Support Our Alma Mater
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Your contribution makes a difference in the lives of current and
            future JGECians
          </p>
        </div>
      </section>

      {/* Donation section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: impact copy */}
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                Make an Impact
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">
                Why Your Support Matters
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                As alumni, we have a unique opportunity to give back to the
                institution that shaped our careers and lives. Your
                contributions directly impact current students, faculty, and the
                overall development of JGEC.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether it is funding scholarships for underprivileged students,
                upgrading laboratory equipment, or supporting innovative student
                projects, every rupee you donate creates lasting change.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {impactNumbers.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-4 bg-secondary rounded-xl"
                  >
                    <div className="text-2xl font-serif font-bold text-accent">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: donation card */}
            <div className="bg-card rounded-2xl p-8 card-shadow space-y-6">
              {/* ── Done state ── */}
              {phase === "done" && (
                <div className="text-center space-y-4 py-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                  <h3 className="text-2xl font-serif font-bold text-card-foreground">
                    Proof Submitted!
                  </h3>
                  <p className="text-muted-foreground">
                    Your donation is under review. You will receive an email
                    once it is verified.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 text-left">
                    <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                      Donation ID
                    </p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 break-all mt-1">
                      {donationId}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Link href="/dashboard/my-donations">
                      <Button variant="default">
                        Track Status
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={handleReset}>
                      Donate Again
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Select phase ── */}
              {(phase === "select" || phase === "initiating") && (
                <>
                  <div>
                    <Heart className="w-12 h-12 text-accent mb-4" />
                    <h3 className="text-2xl font-serif font-bold text-card-foreground mb-1">
                      Make a Donation
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Step 1: Choose a cause and amount. Step 2: Pay via UPI.
                      Step 3: Submit proof for verification.
                    </p>
                  </div>

                  {/* Category tiles */}
                  <div>
                    <Label className="mb-3 block font-medium">
                      Choose a cause
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CATEGORIES.map(
                        ({ value, label, icon: Icon, description }) => {
                          const active = selectedCategory === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setSelectedCategory(value)}
                              className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all ${
                                active
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-border hover:border-accent/50 text-foreground"
                              }`}
                            >
                              <Icon
                                className={`w-5 h-5 ${active ? "text-accent" : "text-muted-foreground"}`}
                              />
                              <span className="font-medium text-sm leading-tight">
                                {label}
                              </span>
                              <span className="text-xs text-muted-foreground leading-tight hidden sm:block">
                                {description}
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {/* Amount presets */}
                  <div>
                    <Label className="mb-3 block font-medium">
                      Select amount
                    </Label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {PRESET_AMOUNTS.map((amount) => {
                        const active =
                          selectedAmount === amount && !customAmount.trim();
                        return (
                          <button
                            type="button"
                            key={amount}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount("");
                              setInitiateError("");
                            }}
                            className={`py-3 px-4 border-2 rounded-lg font-medium transition-colors ${
                              active
                                ? "bg-accent text-accent-foreground border-accent"
                                : "border-accent/30 text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent"
                            }`}
                          >
                            ₹{amount.toLocaleString("en-IN")}
                          </button>
                        );
                      })}
                    </div>
                    <Label htmlFor="custom-amount" className="mb-2 block">
                      Or enter custom amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        id="custom-amount"
                        type="number"
                        min={1}
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                          setInitiateError("");
                        }}
                        placeholder="Enter amount"
                        className="pl-8"
                      />
                    </div>
                  </div>

                  {initiateError && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                      {initiateError}
                    </div>
                  )}

                  {/* PROCEED TO PAY BUTTON DISABLED - Uncomment below to re-enable */}
                  {/* <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={handleInitiate}
                    disabled={phase === "initiating"}
                  >
                    {phase === "initiating" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Initiating...
                      </>
                    ) : (
                      <>
                        Proceed to Pay
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button> */}
                </>
              )}

              {/* ── Payment phase ── */}
              {(phase === "payment" || phase === "submitting") && payment && (
                <>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-card-foreground mb-1">
                      Complete Your Payment
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Scan the QR or open your UPI app, then submit proof below.
                    </p>
                  </div>

                  {/* Payment summary */}
                  <div className="rounded-xl border border-border p-4 bg-secondary/40 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-semibold">
                        {
                          CATEGORIES.find(
                            (c) => c.value === payment.donationCategory,
                          )?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reference</span>
                      <span className="font-mono text-xs break-all">
                        {payment.paymentRequestRef}
                      </span>
                    </div>
                  </div>

                  {/* QR code */}
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-accent" />
                      Scan with any UPI app
                    </p>
                    <div className="max-w-[220px] mx-auto overflow-hidden rounded-lg border border-border bg-white p-2">
                      {/* QR CODE DISABLED - Uncomment below to re-enable */}
                      {/* <QRCodeSVG
                        value={qrValue}
                        size={200}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        marginSize={2}
                        title="UPI payment QR code"
                        className="w-full h-auto"
                      /> */}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        window.location.href = payment.upiUrl;
                      }}
                    >
                      Open UPI App
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setShowProofForm((p) => !p)}
                    >
                      I Have Paid
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Proof form */}
                  {showProofForm && (
                    <form
                      onSubmit={handleSubmitProof}
                      className="space-y-4 rounded-xl border border-border p-4"
                    >
                      <h4 className="font-semibold text-card-foreground">
                        Submit payment proof
                      </h4>

                      <div className="space-y-2">
                        <Label htmlFor="utr">UTR / Transaction ID *</Label>
                        <Input
                          id="utr"
                          value={utr}
                          onChange={(e) => setUtr(e.target.value)}
                          placeholder="Enter UTR from your UPI app"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payee-upi">Payee UPI (Optional)</Label>
                        <Input
                          id="payee-upi"
                          value={payeeUpi}
                          onChange={(e) => setPayeeUpi(e.target.value)}
                          placeholder="e.g., johndoe@oksbi"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="donor-message">
                          Message (Optional)
                        </Label>
                        <Textarea
                          id="donor-message"
                          value={donorMessage}
                          onChange={(e) => setDonorMessage(e.target.value)}
                          placeholder="Any note or message you'd like to share"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Screenshot *</Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="payment-proof-image"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProofImageChange}
                        />
                        {proofImagePreview ? (
                          <div className="relative w-36 h-36 rounded-lg overflow-hidden border border-border group">
                            <img
                              src={proofImagePreview}
                              alt="Payment proof preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={clearProofImage}
                              className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove proof image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="payment-proof-image"
                            className="flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
                          >
                            <UploadCloud className="w-7 h-7 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Upload payment screenshot
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Image only — max {MAX_PHOTO_SIZE / (1024 * 1024)}{" "}
                              MB
                            </span>
                          </label>
                        )}
                      </div>

                      {proofError && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                          {proofError}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={phase === "submitting"}
                      >
                        {phase === "submitting" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit for Verification
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Start over with a different amount
                  </button>
                </>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Donations are reviewed manually after proof submission.{" "}
                <Link
                  href="/dashboard/my-donations"
                  className="underline underline-offset-2"
                >
                  Track your donations
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of support */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Where Your Money Goes
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Areas of Support
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {CATEGORIES.map(({ value, label, icon: Icon, description }) => (
              <div
                key={value}
                className="bg-card rounded-xl p-6 card-shadow text-center hover:elevated-shadow transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-base font-serif font-bold text-card-foreground mb-2">
                  {label}
                </h3>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donor benefits */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                Donor Benefits
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mt-3 mb-6">
                Recognition for Your Generosity
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-8">
                We appreciate every contribution and recognise our donors
                through various programs and initiatives.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8">
              <ul className="space-y-4">
                {[
                  "Tax benefits under Section 80G",
                  "Recognition on donor wall at college",
                  "Annual impact report and updates",
                  "Invitation to special alumni events",
                  "Feature in alumni newsletter",
                ].map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-3 text-primary-foreground/90"
                  >
                    <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
