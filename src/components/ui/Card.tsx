import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      // twMerge lets callers override the default padding (e.g. "p-0").
      className={twMerge(clsx(
        "rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] dark:border-white/10 dark:bg-gray-900",
        className
      ))}
      {...props}
    >
      {children}
    </div>
  );
}
