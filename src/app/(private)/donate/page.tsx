"use client";

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
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
} from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { QRCodeSVG } from "qrcode.react";

const donationAreas = [
  {
    icon: GraduationCap,
    title: "Student Scholarships",
    description:
      "Support deserving students with financial aid for their education and living expenses.",
  },
  {
    icon: Building2,
    title: "Infrastructure Development",
    description:
      "Help improve college facilities, laboratories, and learning spaces.",
  },
  {
    icon: Lightbulb,
    title: "Innovation Fund",
    description: "Support student projects, startups, and innovation initiatives.",
  },
  {
    icon: Users,
    title: "Alumni Activities",
    description:
      "Fund chapter events, networking programs, and community initiatives.",
  },
];

const impactNumbers = [
  { value: "₹50L+", label: "Raised to Date" },
  { value: "200+", label: "Students Supported" },
  { value: "15+", label: "Projects Funded" },
  { value: "5", label: "Labs Upgraded" },
];

const PRESET_AMOUNTS = [1000, 5000, 10000];

interface InitiatedPayment {
  upiUrl: string;
  qrValue: string;
  paymentRequestRef: string;
  amount: number;
  payment_type: "upi";
  validation_type: "manual";
}

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function DonatePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(PRESET_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState("");
  const [initiatedPayment, setInitiatedPayment] = useState<InitiatedPayment | null>(null);
  const [isInitiating, setIsInitiating] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [showProofForm, setShowProofForm] = useState(false);
  const [utr, setUtr] = useState("");
  const [payeeUpi, setPayeeUpi] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [proofImageFile, setProofImageFile] = useState<File | null>(null);
  const [proofImagePreview, setProofImagePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submittedDonationId, setSubmittedDonationId] = useState("");
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  const effectiveAmount = useMemo(() => {
    if (customAmount.trim()) return Number(customAmount);
    return selectedAmount ?? 0;
  }, [customAmount, selectedAmount]);

  const qrValue = useMemo(
    () => initiatedPayment?.qrValue || initiatedPayment?.upiUrl || "",
    [initiatedPayment],
  );

  const resetProofState = () => {
    setUtr("");
    setPayeeUpi("");
    setDonorMessage("");
    setSubmitError("");
    setProofImageFile(null);
    setProofImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAmountPresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setPaymentError("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    setPaymentError("");
  };

  const clearProofImage = () => {
    setProofImageFile(null);
    setProofImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleProofImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_PHOTO_SIZE) {
      setSubmitError(`Proof image must be ${MAX_PHOTO_SIZE / (1024 * 1024)} MB or smaller`);
      clearProofImage();
      return;
    }

    setProofImageFile(file);
    setSubmitError("");

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProofImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setProofImagePreview(null);
    }
  };

  const handleInitiatePayment = async () => {
    setPaymentError("");
    setSubmitError("");
    setSubmitSuccess("");
    setSubmittedDonationId("");

    if (!Number.isFinite(effectiveAmount) || effectiveAmount <= 0) {
      setPaymentError("Please enter a valid amount greater than 0.");
      return;
    }

    setIsInitiating(true);
    try {
      const { data } = await apiClient.post<InitiatedPayment>("/api/donations/initiate", {
        amount: effectiveAmount,
      });

      setInitiatedPayment(data);
      setShowProofForm(false);
      resetProofState();

      if (isMobileDevice()) {
        window.location.href = data.upiUrl;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setPaymentError(error.response.data?.error || "Failed to initiate payment.");
      } else {
        setPaymentError("Failed to initiate payment.");
      }
    } finally {
      setIsInitiating(false);
    }
  };

  const handleOpenUpiApp = () => {
    if (!initiatedPayment) return;
    window.location.href = initiatedPayment.upiUrl;
  };

  const handleSubmitProof = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!initiatedPayment) {
      setSubmitError("Please initiate payment first.");
      return;
    }
    if (!utr.trim()) {
      setSubmitError("UTR is required.");
      return;
    }
    if (!proofImageFile) {
      setSubmitError("Payment proof screenshot is required.");
      return;
    }
    if (!proofImageFile.type.startsWith("image/")) {
      setSubmitError("Payment proof must be an image file.");
      return;
    }
    if (proofImageFile.size > MAX_PHOTO_SIZE) {
      setSubmitError(`Proof image must be ${MAX_PHOTO_SIZE / (1024 * 1024)} MB or smaller`);
      return;
    }

    setIsSubmittingProof(true);
    try {
      const formData = new window.FormData();
      formData.append("amount", String(initiatedPayment.amount));
      formData.append("paymentRequestRef", initiatedPayment.paymentRequestRef);
      formData.append("utr", utr.trim());
      if (payeeUpi.trim()) formData.append("payeeUpi", payeeUpi.trim());
      if (donorMessage.trim()) formData.append("donorMessage", donorMessage.trim());
      formData.append("proofImage", proofImageFile);

      const { data } = await apiClient.post<{ message: string; donationId: string }>(
        "/api/donations",
        formData,
      );

      setSubmitSuccess(data.message);
      setSubmittedDonationId(data.donationId);
      setShowProofForm(false);
      resetProofState();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setSubmitError(error.response.data?.error || "Failed to submit donation proof.");
      } else {
        setSubmitError("Failed to submit donation proof.");
      }
    } finally {
      setIsSubmittingProof(false);
    }
  };

  return (
    <div>
      <section className="relative py-32 overflow-hidden">
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
            Your contribution makes a difference in the lives of current and future JGECians
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                Make an Impact
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">
                Why Your Support Matters
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                As alumni, we have a unique opportunity to give back to the institution that shaped
                our careers and lives. Your contributions directly impact current students, faculty,
                and the overall development of JGEC.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether it is funding scholarships for underprivileged students, upgrading
                laboratory equipment, or supporting innovative student projects, every rupee you
                donate creates lasting change.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {impactNumbers.map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-secondary rounded-xl">
                    <div className="text-2xl font-serif font-bold text-accent">{stat.value}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 card-shadow space-y-6">
              <div>
                <Heart className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-2xl font-serif font-bold text-card-foreground mb-2">
                  Make a Donation
                </h3>
                <p className="text-muted-foreground text-sm">
                  Step 1: Select amount and pay via UPI. Step 2: Submit UTR and screenshot for
                  manual verification.
                </p>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {PRESET_AMOUNTS.map((amount) => {
                    const active = selectedAmount === amount && !customAmount.trim();
                    return (
                      <button
                        type="button"
                        key={amount}
                        onClick={() => handleAmountPresetClick(amount)}
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
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="Enter amount"
                    className="pl-8"
                  />
                </div>
              </div>

              {paymentError && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                  {paymentError}
                </div>
              )}

              <Button
                variant="default"
                size="lg"
                className="w-full"
                onClick={handleInitiatePayment}
                disabled={isInitiating}
              >
                {isInitiating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Initiating...
                  </>
                ) : (
                  <>
                    Pay / Donate
                    <Heart className="w-4 h-4" />
                  </>
                )}
              </Button>

              {initiatedPayment && (
                <div className="space-y-4 rounded-xl border border-border p-4 bg-secondary/40">
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-semibold">Amount:</span> ₹
                      {initiatedPayment.amount.toLocaleString("en-IN")}
                    </p>
                    <p className="break-all">
                      <span className="font-semibold">Payment Ref (tr):</span>{" "}
                      {initiatedPayment.paymentRequestRef}
                    </p>
                    <p>
                      <span className="font-semibold">Payment Type:</span>{" "}
                      {initiatedPayment.payment_type}
                    </p>
                    <p>
                      <span className="font-semibold">Validation Type:</span>{" "}
                      {initiatedPayment.validation_type}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={handleOpenUpiApp}>
                      Open UPI App
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setShowProofForm((prev) => !prev)}
                    >
                      I Have Paid, Submit Proof
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-accent" />
                      Desktop users: scan this QR with any UPI app
                    </p>
                    <div className="max-w-[260px] mx-auto overflow-hidden rounded-lg border border-border bg-white p-2">
                      <QRCodeSVG
                        value={qrValue}
                        size={240}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        marginSize={2}
                        title="UPI payment QR code"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              )}

              {showProofForm && initiatedPayment && (
                <form onSubmit={handleSubmitProof} className="space-y-4 rounded-xl border border-border p-4">
                  <h4 className="font-semibold text-card-foreground">Submit payment proof</h4>

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
                      placeholder="e.g., jgecchapter@okhdfcbank"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donor-message">Message (Optional)</Label>
                    <Textarea
                      id="donor-message"
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      placeholder="Any note for the admin team"
                      rows={3}
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
                          aria-label="Remove payment proof"
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
                        <span className="text-sm text-muted-foreground">Upload payment screenshot</span>
                        <span className="text-xs text-muted-foreground">
                          Image file only - max {MAX_PHOTO_SIZE / (1024 * 1024)} MB
                        </span>
                      </label>
                    )}
                  </div>

                  {submitError && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                      {submitError}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmittingProof}>
                    {isSubmittingProof ? (
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

              {submitSuccess && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 text-emerald-900 text-sm">
                  <p className="font-semibold">{submitSuccess}</p>
                  <p className="mt-1 break-all">Donation ID: {submittedDonationId}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Donations are reviewed manually after proof submission.
              </p>
            </div>
          </div>
        </div>
      </section>

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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationAreas.map((area) => (
              <div
                key={area.title}
                className="bg-card rounded-xl p-6 card-shadow text-center hover:elevated-shadow transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <area.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-serif font-bold text-card-foreground mb-2">
                  {area.title}
                </h3>
                <p className="text-muted-foreground text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                We appreciate every contribution and recognize our donors through various programs
                and initiatives.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-8">
              <ul className="space-y-4">
                {[
                  "Tax benefits under Section 80G",
                  "Recognition on donor wall at college",
                  "Invitation to exclusive donor events",
                  "Certificate of appreciation",
                  "Regular updates on fund utilization",
                  "Naming opportunities for major donors",
                  "Priority access to alumni events",
                  "Feature in alumni newsletter",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-primary-foreground/90">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Other Ways to Contribute
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Cannot donate money? There are other meaningful ways to support our community.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Mentor Students",
                description: "Guide current students in their career paths",
              },
              {
                title: "Offer Internships",
                description: "Provide opportunities at your organization",
              },
              {
                title: "Share Expertise",
                description: "Conduct workshops and training sessions",
              },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl p-6 card-shadow">
                <h3 className="font-serif font-bold text-card-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/contact">
              <Button variant="default" size="lg">
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
