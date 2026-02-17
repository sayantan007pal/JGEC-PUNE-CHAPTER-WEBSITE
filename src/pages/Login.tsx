import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="absolute inset-0 overlay-gradient" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6">
            <span className="text-accent-foreground font-serif font-bold text-3xl">JG</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary-foreground mb-4">
            Welcome Back!
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Connect with your fellow alumni, access exclusive resources, and stay 
            updated with the latest from JGEC Alumni Association.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-serif font-bold text-2xl">JG</span>
              </div>
              <div className="text-left">
                <h1 className="font-serif font-bold text-xl text-foreground">JGEC Alumni</h1>
                <p className="text-muted-foreground text-sm">Pune Chapter</p>
              </div>
            </Link>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-secondary rounded-lg p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Register
            </button>
          </div>

          {isLogin ? (
            /* Login Form */
            <form className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                  Alumni Login
                </h2>
                <p className="text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-sm text-accent hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full">
                Login
                <LogIn className="w-4 h-4" />
              </Button>
            </form>
          ) : (
            /* Registration Form */
            <form className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                  Create Account
                </h2>
                <p className="text-muted-foreground">
                  Join the JGEC Alumni network today
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <Input type="text" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <Input type="text" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input type="email" placeholder="your.email@example.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Batch Year
                  </label>
                  <Input type="text" placeholder="e.g., 2010" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Branch
                  </label>
                  <Input type="text" placeholder="e.g., CSE" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="rounded border-border mt-1" />
                  <span className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-accent hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full">
                Create Account
                <UserPlus className="w-4 h-4" />
              </Button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-accent">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
