"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/axios";
import logo from "@/assets/Jalpaiguri-engineers-association.jpg";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Blogs", path: "/blogs" },
  { name: "Benefits", path: "/benefits" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

export interface AuthUser {
  fullName: string;
  email: string;
  photoLink?: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check auth status on mount and pathname change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await apiClient.get<{ user: AuthUser }>(
          "/api/auth/me",
        );
        setUser(data.user);
      } catch {
        // axios throws on non-2xx — treat any error as unauthenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
      setUser(null);
      setIsOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      // Silently fail
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md shadow-lg">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={logo}
                alt="JGEC Alumni Association Pune"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="block">
              <h1 className="text-primary-foreground font-serif font-bold text-sm sm:text-lg leading-tight">
                JGEC Alumni Association
              </h1>
              <p className="text-primary-foreground/70 text-xs">Pune Chapter</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.path
                    ? "text-accent bg-white/10"
                    : "text-primary-foreground/90 hover:text-accent hover:bg-white/5",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              <div className="w-20 h-9 bg-white/10 rounded-md animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="heroOutline" size="sm" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                    {user.photoLink ? (
                      <img
                        src={user.photoLink}
                        alt={getInitials(user.fullName)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-accent-foreground font-bold text-xs">
                        {getInitials(user.fullName)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-primary-foreground/70 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-white/5"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="heroOutline" size="sm">
                  Alumni Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-primary-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden bg-primary transition-[max-height] duration-300",
          isOpen
            ? "max-h-[calc(100dvh-5rem)] overflow-y-auto"
            : "max-h-0 overflow-hidden",
        )}
      >
        <nav className="container-custom px-4 py-4 space-y-2 overflow-x-hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-4 py-3 text-sm font-medium rounded-md transition-colors",
                pathname === item.path
                  ? "text-accent bg-white/10"
                  : "text-primary-foreground/90 hover:text-accent hover:bg-white/5",
              )}
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-4 flex flex-col gap-3">
            {!isLoading && user ? (
              <>
                {/* Logged-in user info on mobile */}
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                    {user.photoLink ? (
                      <img
                        src={user.photoLink}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-accent-foreground font-bold text-sm">
                        {getInitials(user.fullName)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-primary-foreground font-medium text-sm truncate">
                      {user.fullName}
                    </p>
                    <p className="text-primary-foreground/60 text-xs break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block w-full"
                >
                  <Button
                    variant="heroOutline"
                    size="lg"
                    className="w-full gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="heroOutline"
                  size="lg"
                  className="w-full gap-2 text-red-400 border-red-400/30 hover:bg-red-400/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full"
              >
                <Button variant="heroOutline" size="lg" className="w-full">
                  Alumni Login
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
