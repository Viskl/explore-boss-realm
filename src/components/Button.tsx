
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = "primary", 
    size = "md", 
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:brightness-105 shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "bg-transparent border border-input hover:bg-muted/50",
      ghost: "bg-transparent hover:bg-muted/50",
      link: "bg-transparent underline-offset-4 hover:underline text-primary",
    };
    
    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-10 px-4 py-2 rounded-md",
      lg: "h-12 px-6 py-3 rounded-lg text-lg",
      icon: "h-10 w-10 rounded-full p-0 flex items-center justify-center",
    };
    
    const loadingStyles = isLoading 
      ? "opacity-80 pointer-events-none relative" 
      : "";
    
    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed pointer-events-none"
      : "";
    
    const widthStyles = fullWidth ? "w-full" : "";
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
          variantStyles[variant],
          sizeStyles[size],
          loadingStyles,
          disabledStyles,
          widthStyles,
          className
        )}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
          </div>
        )}
        <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
