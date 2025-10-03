import { ButtonHTMLAttributes, LabelHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

interface ButtonAsButtonProps extends BaseButtonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  asLabel?: false;
}

interface ButtonAsLabelProps extends BaseButtonProps, LabelHTMLAttributes<HTMLLabelElement> {
  asLabel: true;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLabelProps;

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-white/10 hover:bg-white/20 border-white/20 text-white",
  secondary: "bg-white/5 hover:bg-white/10 border-white/10 text-white/80",
  ghost: "bg-transparent hover:bg-white/5 border-transparent text-white/60 hover:text-white/80",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = forwardRef<HTMLButtonElement | HTMLLabelElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", disabled, children, asLabel, ...props }, ref) => {
    const baseClassName = `
      rounded-lg font-medium transition-colors backdrop-blur-sm border inline-block cursor-pointer
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    if (asLabel) {
      return (
        <label
          ref={ref as React.Ref<HTMLLabelElement>}
          className={baseClassName}
          {...(props as LabelHTMLAttributes<HTMLLabelElement>)}
        >
          {children}
        </label>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled}
        className={baseClassName}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
