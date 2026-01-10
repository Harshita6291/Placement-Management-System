import { useState } from "react";
import auth from "@/lib/auth";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/banasthali-logo.jpg";

const roleLabels: Record<string, string> = {
  student: "Student",
  tpo: "TPO",
  faculty: "Faculty",
  admin: "Admin",
};

const Login = () => {
  const { role = "student" } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roleLabel = roleLabels[role] || "User";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Use role-agnostic login which returns { role, user }
      const res = await fetch(`http://localhost:5000/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Invalid credentials");
      }

      // Persist returned user and role
      const returnedRole = data.role || role;
      const returnedUser = data.user || data[returnedRole] || {};
      auth.saveUser(returnedUser, returnedRole);

      toast({ title: "Login Successful", description: `Welcome back, ${roleLabel}!` });

      // Route to appropriate dashboard based on role
      if (returnedRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(`/dashboard/${returnedRole}`);
      }
    } catch (err: any) {
      toast({ title: "Login Error", description: err?.message || "Login failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-login flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-2xl p-8 animate-scale-in">
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="PMS Logo"
              className="w-28 h-28 mx-auto rounded-xl border-4 border-primary/20 shadow-lg mb-4"
            />
            <h1 className="text-2xl font-display font-bold text-foreground">
              {roleLabel} Login
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="login" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Log In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Create new account
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            © AI-Powered Placement Management System 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
