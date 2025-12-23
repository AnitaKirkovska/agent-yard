import { cn } from "@/lib/utils";

interface SnowflakeProps {
  className?: string;
  delay?: number;
  size?: "sm" | "md" | "lg";
  left?: string;
}

export const Snowflake = ({ className, delay = 0, size = "md", left = "50%" }: SnowflakeProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div
      className={cn(
        "absolute text-accent/40 pointer-events-none animate-snowfall",
        sizeClasses[size],
        className
      )}
      style={{
        left,
        animationDelay: `${delay}s`,
        animationDuration: `${8 + Math.random() * 6}s`,
      }}
    >
      ❄
    </div>
  );
};
