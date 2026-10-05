import React from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-sm",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends BaseProps {
  to?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

interface ButtonAsLink extends BaseProps {
  to: string;
  type?: undefined;
  disabled?: undefined;
  loading?: undefined;
  onClick?: () => void;
  ariaLabel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

function classes(variant: Variant, size: Size, className: string) {
  return `${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();
}

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children } = props;
  const classNames = classes(variant, size, className);

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} className={classNames} aria-label={props.ariaLabel}>
        {children}
      </Link>
    );
  }

  const { type = "button", disabled = false, loading = false, onClick, ariaLabel } = props as ButtonAsButton;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={classNames}
    >
      {loading && <Loader2 size={15} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}