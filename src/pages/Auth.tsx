
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import Button from "@/components/Button";
import { Input } from "@/components/ui/input";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
        navigate("/profile");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (error: any) {
      setError(error.message || "Google sign in failed");
    }
  };
  
  const toggleView = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{isSignUp ? "Create Account" : "Sign In"}</h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Join the boss hunting adventure" : "Continue your boss hunting journey"}
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md mb-4 flex items-center">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium block mb-1">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              {!isSignUp && (
                <a href="#" className="text-sm text-primary">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <Button
            fullWidth
            size="lg"
            isLoading={isLoading}
            type="submit"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <Button
            fullWidth
            variant="outline"
            onClick={handleGoogleSignIn}
            type="button"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.3 11.7c0-.7.1-1.3.3-1.9l-3-2.3C1.9 8.9 1.5 10.4 1.5 12s.4 3.1 1.1 4.5l3-2.3c-.2-.6-.3-1.3-.3-2"
              />
              <path
                fill="#FBBC05"
                d="M12 5.5c1.5 0 2.8.5 3.8 1.5l2.5-2.5C16.5 2.7 14.4 1.5 12 1.5c-3.6 0-6.7 2-8.2 5l3 2.3c.7-2.1 2.7-3.8 5.2-3.8"
              />
              <path
                fill="#4285F4"
                d="M12 18.5c-2.5 0-4.5-1.6-5.2-3.8l-3 2.3c1.6 3 4.6 5 8.2 5 2.2 0 4.3-1 5.8-2.7L15 16.4c-1 .7-2.1 1.1-3 1.1"
              />
              <path
                fill="#34A853"
                d="M18.5 12c0-.6-.1-1.2-.2-1.8h-6.3v3.8h3.6c-.3 1.3-1.1 2.4-2.1 3.1l2.8 2.2c1.7-1.6 2.7-4 2.7-6.8"
              />
            </svg>
            Google
          </Button>
          
          <p className="text-center text-sm mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={toggleView}
              className="text-primary font-medium"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
