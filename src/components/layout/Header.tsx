import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Achievements", path: "/achievements" },
  { name: "Chapters", path: "/chapters" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md shadow-lg">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-serif font-bold text-xl">JG</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-primary-foreground font-serif font-bold text-lg leading-tight">
                JGEC Alumni
              </h1>
              <p className="text-primary-foreground/70 text-xs">
                Pune Chapter
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.path
                    ? "text-accent bg-white/10"
                    : "text-primary-foreground/90 hover:text-accent hover:bg-white/5"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/donate">
              <Button variant="gold" size="sm">
                Donate
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="heroOutline" size="sm">
                Alumni Login
              </Button>
            </Link>
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
          "lg:hidden overflow-hidden transition-all duration-300 bg-primary",
          isOpen ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <nav className="container-custom px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-4 py-3 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.path
                  ? "text-accent bg-white/10"
                  : "text-primary-foreground/90 hover:text-accent hover:bg-white/5"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Link to="/donate" onClick={() => setIsOpen(false)}>
              <Button variant="gold" size="lg" className="w-full">
                Donate
              </Button>
            </Link>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button variant="heroOutline" size="lg" className="w-full">
                Alumni Login
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
