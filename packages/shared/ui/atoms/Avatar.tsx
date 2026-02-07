type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  const base =
    "inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--mc-bg-muted)] text-[var(--mc-text)] object-cover";
  const classes = [base, sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={classes}
        referrerPolicy="no-referrer"
      />
    );
  }

  return <div className={classes}>{fallback ?? ""}</div>;
}

export type { AvatarProps, AvatarSize };
