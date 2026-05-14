import React from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface SparkleButtonProps {
  label?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

const styles = `
  .generate-btn {
    --active: 0;
    --border_radius: 9999px;
    --transition: 0.3s ease-in-out;
  }
  .generate-btn:hover,
  .generate-btn:focus-visible {
    --active: 1;
  }
  .generate-btn:active {
    transform: scale(1) !important;
  }

  /* Dark pill background */
  .generate-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: hsla(0 0% 12% / 1);
    border-radius: var(--border_radius);
    box-shadow:
      inset 0 0.5px hsl(0, 0%, 100%),
      inset 0 -1px 2px 0 hsl(0, 0%, 0%),
      0px 4px 10px -4px hsla(0 0% 0% / calc(1 - var(--active))),
      0 0 0 calc(var(--active) * 0.375rem) hsl(260 97% 50% / 0.75);
    transition: all var(--transition);
    z-index: 0;
  }

  /* Purple glow overlay */
  .generate-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: hsla(260 97% 61% / 0.75);
    background-image:
      radial-gradient(at 51% 89%, hsla(266, 45%, 74%, 1) 0px, transparent 50%),
      radial-gradient(at 100% 100%, hsla(266, 36%, 60%, 1) 0px, transparent 50%),
      radial-gradient(at 22% 91%, hsla(266, 36%, 60%, 1) 0px, transparent 50%);
    opacity: var(--active);
    border-radius: var(--border_radius);
    transition: opacity var(--transition);
    z-index: 2;
  }

  /* Spinning border light */
  .dots-border::before {
    content: "";
    position: absolute;
    top: 30%;
    left: 50%;
    transform: rotate(0deg);
    transform-origin: left;
    width: 100%;
    height: 2rem;
    background-color: white;
    mask: linear-gradient(transparent 0%, white 120%);
    -webkit-mask: linear-gradient(transparent 0%, white 120%);
    animation: btn-rotate 2s linear infinite;
  }

  @keyframes btn-rotate {
    to { transform: rotate(360deg); }
  }

  /* Sparkle path animation on hover */
  .generate-btn:hover .sparkle-path,
  .generate-btn:focus .sparkle-path {
    animation: sparkle-path 1.5s linear 0.5s infinite;
  }
  .sparkle-path:nth-child(1) { --scale-p: 1.2; }
  .sparkle-path:nth-child(2) { --scale-p: 1.2; }
  .sparkle-path:nth-child(3) { --scale-p: 1.2; }

  @keyframes sparkle-path {
    0%, 34%, 71%, 100% { transform: scale(1); }
    17%  { transform: scale(var(--scale-p, 1)); }
    49%  { transform: scale(var(--scale-p, 1)); }
    83%  { transform: scale(var(--scale-p, 1)); }
  }

  /* Gradient text */
  .btn-text {
    background-image: linear-gradient(
      90deg,
      hsla(0 0% 100% / 1) 0%,
      hsla(0 0% 100% / var(--active)) 120%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

export default function SparkleButton({
  label = "Generate Site",
  icon: Icon = Sparkles,
  onClick,
  className = "",
}: SparkleButtonProps) {
  return (
    <>
      <style>{styles}</style>

      <button
        type="button"
        onClick={onClick}
        className={`generate-btn relative flex items-center gap-2 cursor-pointer border-none bg-transparent px-8 py-4 rounded-full origin-center transition-transform duration-300 ease-in-out hover:scale-110 ${className}`}
      >
        {/* Spinning border */}
        <div
          className="dots-border overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-full -z-10"
          style={{ width: "calc(100% + 2px)", height: "calc(100% + 2px)" }}
        />

        {/* Icon */}
        <Icon
          className="relative z-10 text-white"
          size={28}
          aria-hidden="true"
        />

        {/* Label */}
        <span className="btn-text relative z-10 text-base">{label}</span>
      </button>
    </>
  );
}
