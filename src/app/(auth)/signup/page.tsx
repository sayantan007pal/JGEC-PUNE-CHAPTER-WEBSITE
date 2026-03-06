"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, UserPlus, Loader2, ChevronRight, ChevronLeft, UploadCloud, X } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import axios from "axios";
import apiClient from "@/lib/axios";
import { MAX_PHOTO_SIZE } from "@/constants/user";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const DEPARTMENTS = [
  "Computer Science & Engineering (CSE)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical Engineering (EE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Information Technology (IT)",
  "Other",
];

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  passingYear: string;
  department: string;
  phoneNumber: string;
  nickName: string;
  currentOrLastOrganization: string;
  designation: string;
  rolesAndResponsibility: string;
  tenureStartDate: string;
  tenureEndDate: string;
  isCurrentlyWorking: boolean;
  addressInPune: string;
  contributionInterest: string;
  bloodGroup: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    passingYear: "",
    department: "",
    phoneNumber: "",
    nickName: "",
    currentOrLastOrganization: "",
    designation: "",
    rolesAndResponsibility: "",
    tenureStartDate: "",
    tenureEndDate: "",
    isCurrentlyWorking: false,
    addressInPune: "",
    contributionInterest: "",
    bloodGroup: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName.trim()) { setError("Full name is required"); return false; }
        if (!formData.email.trim()) { setError("Email is required"); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError("Invalid email format"); return false; }
        if (formData.password.length < 6) { setError("Password must be at least 6 characters"); return false; }
        if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return false; }
        return true;
      case 2:
        if (!formData.passingYear.trim()) { setError("Passing year is required"); return false; }
        if (!formData.department) { setError("Department is required"); return false; }
        if (!formData.phoneNumber.trim()) { setError("Phone number is required"); return false; }
        if (!formData.bloodGroup) { setError("Blood group is required"); return false; }
        return true;
      case 3:
        if (!formData.currentOrLastOrganization.trim()) { setError("Organization is required"); return false; }
        if (!formData.designation.trim()) { setError("Designation is required"); return false; }
        if (!formData.rolesAndResponsibility.trim()) { setError("Roles & responsibilities are required"); return false; }
        if (!formData.tenureStartDate.trim()) { setError("Start date is required"); return false; }
        if (!formData.isCurrentlyWorking && !formData.tenureEndDate.trim()) { setError("End date is required if not currently working"); return false; }
        return true;
      case 4:
        if (!formData.addressInPune.trim()) { setError("Address in Pune is required"); return false; }
        if (!formData.contributionInterest.trim()) { setError("Please specify how you want to contribute"); return false; }
        if (!photoFile) { setError("Please upload a profile photo"); return false; }
        if (!photoFile.type.startsWith("image/")) { setError("File must be an image (JPG, PNG, etc.)"); return false; }
        if (photoFile.size > MAX_PHOTO_SIZE) { setError(`Photo must be ${MAX_PHOTO_SIZE / (1024 * 1024)} MB or smaller`); return false; }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    
    if (file && file.size > MAX_PHOTO_SIZE) {
      setError(`Photo must be ${MAX_PHOTO_SIZE / (1024 * 1024)} MB or smaller`);
      clearPhoto();
      return;
    }

    setPhotoFile(file);
    setError("");
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setError("");
    setIsLoading(true);

    try {
      // Build a native browser FormData (multipart/form-data)
      const fd = new window.FormData();
      const { confirmPassword, isCurrentlyWorking, ...rest } = formData;
      void confirmPassword;

      // Append all text fields
      (Object.keys(rest) as (keyof typeof rest)[]).forEach((key) => {
        fd.append(key, rest[key] as string);
      });
      fd.append("isCurrentlyWorking", String(isCurrentlyWorking));
      if (!isCurrentlyWorking) {
        fd.set("tenureEndDate", formData.tenureEndDate);
      }

      // Append the photo file — Axios will set multipart/form-data boundary automatically
      fd.append("photo", photoFile!);

      await apiClient.post("/api/auth/signup", fd);
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || "Registration failed");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = [
    "Account Details",
    "Personal Information",
    "Professional Details",
    "Additional Information",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-2/5 relative">
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
            Join Our Community
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Become a part of the JGEC Alumni Association, Pune Chapter. Connect,
            collaborate, and contribute to our growing network.
          </p>

          {/* Step indicator */}
          <div className="mt-8 flex items-center gap-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-all ${
                  s === step
                    ? "bg-accent w-8"
                    : s < step
                    ? "bg-accent/60"
                    : "bg-primary-foreground/30"
                }`}
              />
            ))}
          </div>
          <p className="text-primary-foreground/60 text-sm mt-3">
            Step {step} of 4: {stepTitles[step - 1]}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 flex items-start justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-xl py-4">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-serif font-bold text-xl">JG</span>
              </div>
              <div className="text-left">
                <h1 className="font-serif font-bold text-lg text-foreground">JGEC Alumni</h1>
                <p className="text-muted-foreground text-xs">Pune Chapter</p>
              </div>
            </Link>
          </div>

          {/* Mobile step indicator */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    s <= step ? "bg-accent" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Step {step} of 4: {stepTitles[step - 1]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-1">
                {stepTitles[step - 1]}
              </h2>
              <p className="text-muted-foreground text-sm">
                {step === 1 && "Set up your login credentials"}
                {step === 2 && "Tell us about yourself"}
                {step === 3 && "Share your professional background"}
                {step === 4 && "Almost there! A few more details"}
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            {/* Step 1: Account Details */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="e.g., Sayantan Pal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Confirm Password <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    placeholder="Re-enter your password"
                  />
                </div>
              </>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Passing Year <span className="text-destructive">*</span>
                    </label>
                    <Input
                      value={formData.passingYear}
                      onChange={(e) => updateField("passingYear", e.target.value)}
                      placeholder="e.g., 2015"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Blood Group <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => updateField("bloodGroup", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Department <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => updateField("department", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Phone Number (WhatsApp-enabled) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => updateField("phoneNumber", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Nickname <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    value={formData.nickName}
                    onChange={(e) => updateField("nickName", e.target.value)}
                    placeholder="What do friends call you?"
                  />
                </div>
              </>
            )}

            {/* Step 3: Professional Details */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Current / Last Organization <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.currentOrLastOrganization}
                    onChange={(e) => updateField("currentOrLastOrganization", e.target.value)}
                    placeholder="e.g., Tata Consultancy Services"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Designation <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => updateField("designation", e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Roles & Responsibilities <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={formData.rolesAndResponsibility}
                    onChange={(e) => updateField("rolesAndResponsibility", e.target.value)}
                    placeholder="Brief description of your key roles..."
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Tenure Start Date <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.tenureStartDate}
                    onChange={(e) => updateField("tenureStartDate", e.target.value)}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isCurrentlyWorking}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isCurrentlyWorking: e.target.checked,
                          tenureEndDate: e.target.checked ? "" : prev.tenureEndDate,
                        }))
                      }
                      className="rounded border-border"
                    />
                    <span className="text-sm font-medium text-foreground">
                      I am currently working here
                    </span>
                  </label>
                </div>

                {!formData.isCurrentlyWorking && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Tenure End Date <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.tenureEndDate}
                      onChange={(e) => updateField("tenureEndDate", e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            {/* Step 4: Additional Information */}
            {step === 4 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Address of Stay in Pune <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={formData.addressInPune}
                    onChange={(e) => updateField("addressInPune", e.target.value)}
                    placeholder="Your current address in Pune..."
                    rows={2}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    How do you want to contribute? <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={formData.contributionInterest}
                    onChange={(e) => updateField("contributionInterest", e.target.value)}
                    placeholder="e.g., Mentoring juniors, organizing events, sponsoring activities..."
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Profile Photo <span className="text-destructive">*</span>
                  </label>

                  {/* Hidden native file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={handlePhotoChange}
                  />

                  {photoPreview ? (
                    /* Preview card */
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border group">
                      <img
                        src={photoPreview}
                        alt="Profile photo preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Drop-zone / upload button */
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
                    >
                      <UploadCloud className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload a photo
                      </span>
                      <span className="text-xs text-muted-foreground">
                        JPG, PNG ... · max {MAX_PHOTO_SIZE / (1024 * 1024)} MB
                      </span>
                    </label>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="rounded border-border mt-1" required />
                    <span className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <a href="#" className="text-accent hover:underline">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button type="button" variant="outline" size="lg" onClick={handleBack} className="flex-1">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button type="button" variant="default" size="lg" onClick={handleNext} className="flex-1">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button type="submit" variant="default" size="lg" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <UserPlus className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent font-medium hover:underline">
                Login here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-accent">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
