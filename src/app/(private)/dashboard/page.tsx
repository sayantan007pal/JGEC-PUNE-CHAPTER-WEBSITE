import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  User,
  Calendar,
  Settings,
  Bell,
  Award,
  Users,
  MapPin,
  LogOut,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your JGEC Alumni Pune member dashboard",
};

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
}

async function getUser(): Promise<DashboardUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jgec-auth-token")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret-change-me"
    );
    const { payload } = await jwtVerify(token, secret);

    // Fetch user data from the API internally
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
    try {
      const { data } = await axios.get<{ user: DashboardUser }>(
        `${baseUrl}/api/auth/me`,
        {
          headers: { Cookie: `jgec-auth-token=${token}` },
        }
      );
      return data.user;
    } catch {
      // API error – fall back to JWT payload
      return { email: payload.email as string | undefined };
    }
  } catch {
    return null;
  }
}

const quickLinks = [
  { name: "Upcoming Events", href: "/events", icon: Calendar, color: "bg-blue-500/10 text-blue-600" },
  { name: "Alumni Directory", href: "/about", icon: Users, color: "bg-green-500/10 text-green-600" },
  { name: "Achievements", href: "/achievements", icon: Award, color: "bg-amber-500/10 text-amber-600" },
  { name: "Gallery", href: "/gallery", icon: MapPin, color: "bg-purple-500/10 text-purple-600" },
];

export default async function DashboardPage() {
  const user = await getUser();

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
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">Quick Links</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl card-shadow hover:elevated-shadow transition-all duration-200 group"
                  >
                    <div className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center`}>
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
                Stay connected with fellow alumni. Get the latest updates on events, meetups, and opportunities.
              </p>
              <a
                href="https://chat.whatsapp.com/KTSiaiNkuEX9ytj1KLPLcY"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 gap-2">
                  Join WhatsApp Group
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
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
                    <p className="text-card-foreground font-medium">{user.email}</p>
                  </div>
                )}
                {user?.phoneNumber && (
                  <div>
                    <span className="text-muted-foreground">Phone</span>
                    <p className="text-card-foreground font-medium">{user.phoneNumber}</p>
                  </div>
                )}
                {user?.bloodGroup && (
                  <div>
                    <span className="text-muted-foreground">Blood Group</span>
                    <p className="text-card-foreground font-medium">{user.bloodGroup}</p>
                  </div>
                )}
                {user?.addressInPune && (
                  <div>
                    <span className="text-muted-foreground">Address in Pune</span>
                    <p className="text-card-foreground font-medium">{user.addressInPune}</p>
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
