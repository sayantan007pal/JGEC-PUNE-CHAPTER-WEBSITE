"use client";
// import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  Bell,
  Award,
  Users,
  MapPin,
  ExternalLink,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
// import { AuthUser } from "@/components/layout/Header";
import apiClient from "@/lib/axios";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Your JGEC Alumni Pune member dashboard",
// };

interface DashboardUser {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  bloodGroup?: string;
  addressInPune?: string;
  designation?: string;
  currentOrLastOrganization?: string;
  department?: string;
  passingYear?: string | number;
  photoLink?: string;
  authRole?: string;
}

interface RecentDonation {
  _id: string;
  amount: number;
  donationCategory: string;
  status: string;
  createdAt: string;
  proofSubmittedAt?: string;
}

interface AdminOverview {
  totalDonations: number;
  totalVerifiedAmount: number;
  pendingCount: number;
  verifiedCount: number;
}

interface AdminRecentPending {
  _id: string;
  amount: number;
  donationCategory: string;
  proofSubmittedAt?: string;
  donor?: { fullName?: string; email?: string };
}

interface DashboardData {
  user: DashboardUser;
  recentDonations: RecentDonation[];
  adminOverview: AdminOverview | null;
  adminRecentPending: AdminRecentPending[];
}

const CATEGORY_LABELS: Record<string, string> = {
  scholarship: "Scholarships",
  infrastructure: "Infrastructure",
  innovation: "Innovation",
  alumni_activities: "Alumni Activities",
  general: "General",
};

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const [userRes, donationsRes] = await Promise.allSettled([
      apiClient.get<{ user: DashboardUser }>("/api/auth/me"),
      apiClient.get<{ donations: RecentDonation[] }>(
        "/api/donations/my-donations?limit=3",
      ),
    ]);

    if (userRes.status !== "fulfilled") return null;

    const user: DashboardUser = userRes.value.data.user;

    const recentDonations: RecentDonation[] =
      donationsRes.status === "fulfilled"
        ? donationsRes.value.data.donations
        : [];

    let adminOverview: AdminOverview | null = null;
    let adminRecentPending: AdminRecentPending[] = [];

    if (user.authRole === "admin") {
      try {
        const analyticsRes = await apiClient.get<{
          overview: AdminOverview;
          recentPending: AdminRecentPending[];
        }>("/api/admin/donations/analytics");
        adminOverview = analyticsRes.data.overview;
        adminRecentPending = analyticsRes.data.recentPending;
      } catch {
        // admin analytics optional – not fatal
      }
    }

    return { user, recentDonations, adminOverview, adminRecentPending };
  } catch {
    return null;
  }
}

const quickLinks = [
  {
    name: "Upcoming Events",
    href: "/events",
    icon: Calendar,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    name: "Alumni Directory",
    href: "/about",
    icon: Users,
    color: "bg-green-500/10 text-green-600",
  },
  {
    name: "Achievements",
    href: "/achievements",
    icon: Award,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    name: "Gallery",
    href: "/gallery",
    icon: MapPin,
    color: "bg-purple-500/10 text-purple-600",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [adminOverview, setAdminOverview] = useState<AdminOverview | null>(
    null,
  );
  const [adminRecentPending, setAdminRecentPending] = useState<
    AdminRecentPending[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setUser(data?.user ?? null);
        setRecentDonations(data?.recentDonations ?? []);
        setAdminOverview(data?.adminOverview ?? null);
        setAdminRecentPending(data?.adminRecentPending ?? []);
      } catch {
        // Treat any fetch error as unauthenticated for dashboard rendering.
        setUser(null);
        setRecentDonations([]);
        setAdminOverview(null);
        setAdminRecentPending([]);
      }
    };

    fetchDashboardData();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="min-h-[80vh] bg-background">
      {/* Welcome Banner */}
      <section className="bg-primary py-12">
        <div className="container-custom px-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center ring-4 ring-accent/30 overflow-hidden">
              {user?.photoLink ? (
                <img
                  src={user.photoLink}
                  alt={user?.fullName ? getInitials(user.fullName) : "?"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-accent-foreground font-serif font-bold text-2xl">
                  {user?.fullName ? getInitials(user.fullName) : "?"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary-foreground">
                Welcome back, {user?.fullName?.split(" ")[0] || "Alumni"}!
              </h1>
              <p className="text-primary-foreground/70 mt-1">
                {user?.designation && user?.currentOrLastOrganization
                  ? `${user.designation} at ${user.currentOrLastOrganization}`
                  : "JGEC Alumni, Pune Chapter"}
              </p>
              {user?.department && user?.passingYear && (
                <p className="text-primary-foreground/50 text-sm mt-1">
                  {user.department} • Batch of {user.passingYear}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="container-custom px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Links */}
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">
                Quick Links
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl card-shadow hover:elevated-shadow transition-all duration-200 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center`}
                    >
                      <link.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-card-foreground group-hover:text-accent transition-colors">
                        {link.name}
                      </h3>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* WhatsApp Group */}
            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-6 border border-green-200 dark:border-green-900">
              <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                💬 Join Our WhatsApp Group
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Stay connected with fellow alumni. Get the latest updates on
                events, meetups, and opportunities.
              </p>
              <a
                href="https://chat.whatsapp.com/KTSiaiNkuEX9ytj1KLPLcY"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  Join WhatsApp Group
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* ── My Recent Donations (all users) ── */}
            <div className="bg-card rounded-xl p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif font-bold text-lg text-card-foreground flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent" />
                  My Recent Donations
                </h2>
                <Link
                  href="/dashboard/my-donations"
                  className="text-sm text-accent hover:underline"
                >
                  View all
                </Link>
              </div>
              {recentDonations.length === 0 ? (
                <div className="text-center py-6">
                  <Heart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No donations yet.
                  </p>
                  <Link href="/donate">
                    <Button variant="outline" size="sm" className="mt-3">
                      Make a Donation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDonations.map((d) => (
                    <div
                      key={d._id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          ₹{d.amount.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {CATEGORY_LABELS[d.donationCategory] ??
                            d.donationCategory}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          d.status === "verified"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : d.status === "pending"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : d.status === "rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                  ))}
                  <Link href="/dashboard/my-donations">
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View All Donations
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Admin Panel (admin only) ── */}
            {user?.authRole === "admin" && (
              <div className="bg-card rounded-xl p-6 card-shadow border-2 border-accent/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif font-bold text-lg text-card-foreground flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    Admin Overview
                  </h2>
                  <Link
                    href="/dashboard/admin"
                    className="text-sm text-accent hover:underline"
                  >
                    Full dashboard
                  </Link>
                </div>

                {adminOverview && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 text-center border border-amber-200 dark:border-amber-800">
                      <p className="text-2xl font-bold text-amber-600">
                        {adminOverview.pendingCount}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                        Pending
                      </p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 text-center border border-emerald-200 dark:border-emerald-800">
                      <p className="text-2xl font-bold text-emerald-600">
                        {adminOverview.verifiedCount}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                        Verified
                      </p>
                    </div>
                    <div className="bg-secondary rounded-lg p-3 text-center col-span-2">
                      <p className="text-sm font-semibold text-foreground flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4 text-accent" />₹
                        {adminOverview.totalVerifiedAmount.toLocaleString(
                          "en-IN",
                        )}{" "}
                        raised
                      </p>
                      <p className="text-xs text-muted-foreground">
                        across {adminOverview.totalDonations} donations
                      </p>
                    </div>
                  </div>
                )}

                {adminRecentPending.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Awaiting verification
                    </p>
                    <div className="space-y-2">
                      {adminRecentPending.slice(0, 3).map((d) => (
                        <div
                          key={d._id}
                          className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0"
                        >
                          <div>
                            <p className="font-medium text-card-foreground">
                              {d.donor?.fullName ?? "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ₹{d.amount.toLocaleString("en-IN")} ·{" "}
                              {CATEGORY_LABELS[d.donationCategory] ??
                                d.donationCategory}
                            </p>
                          </div>
                          <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminRecentPending.length === 0 && adminOverview && (
                  <p className="text-sm text-muted-foreground text-center py-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    No pending donations. All clear!
                  </p>
                )}

                <Link href="/dashboard/admin">
                  <Button variant="default" size="sm" className="w-full mt-4">
                    Open Admin Dashboard
                    <ShieldCheck className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-card rounded-xl p-6 card-shadow">
              <h3 className="font-serif font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-accent" />
                Your Profile
              </h3>
              <div className="space-y-3 text-sm">
                {user?.email && (
                  <div>
                    <span className="text-muted-foreground">Email</span>
                    <p className="text-card-foreground font-medium">
                      {user.email}
                    </p>
                  </div>
                )}
                {user?.phoneNumber && (
                  <div>
                    <span className="text-muted-foreground">Phone</span>
                    <p className="text-card-foreground font-medium">
                      {user.phoneNumber}
                    </p>
                  </div>
                )}
                {user?.bloodGroup && (
                  <div>
                    <span className="text-muted-foreground">Blood Group</span>
                    <p className="text-card-foreground font-medium">
                      {user.bloodGroup}
                    </p>
                  </div>
                )}
                {user?.addressInPune && (
                  <div>
                    <span className="text-muted-foreground">
                      Address in Pune
                    </span>
                    <p className="text-card-foreground font-medium">
                      {user.addressInPune}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications placeholder */}
            <div className="bg-card rounded-xl p-6 card-shadow">
              <h3 className="font-serif font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" />
                Notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                No new notifications. Check back later!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
