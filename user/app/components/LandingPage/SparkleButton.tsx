import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface SparkleButtonProps {
  label?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
  /** When set, renders as a Next.js link with the same visual style as the button. */
  href?: string;
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
      0 0 0 calc(var(--active) * 0.12rem) hsla(255, 55%, 55%, 0.9),
      0 0 0 calc(var(--active) * 0.28rem) hsla(250, 45%, 35%, 0.4);
    transition: all var(--transition);
    z-index: 0;
  }

  /* Deep indigo-purple glow overlay */
  .generate-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: hsla(250, 45%, 22%, 0.85);
    background-image:
      radial-gradient(at 51% 89%, hsla(258, 40%, 38%, 1) 0px, transparent 50%),
      radial-gradient(at 100% 100%, hsla(245, 35%, 30%, 1) 0px, transparent 50%),
      radial-gradient(at 22% 91%, hsla(255, 38%, 32%, 1) 0px, transparent 50%);
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

  /* Text — always white */
  .btn-text {
    color: white;
  }
`;

const sparkleSurfaceClassName =
  "generate-btn relative flex items-center gap-2 border-none bg-transparent px-5 py-5 rounded-full origin-center transition-transform duration-300 ease-in-out hover:scale-110";

function SparkleInner({
  label,
  Icon,
}: {
  label: string;
  Icon: LucideIcon;
}) {
  return (
    <>
      <div
        className="dots-border overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-full -z-10"
        style={{ width: "calc(100% + 2px)", height: "calc(100% + 2px)" }}
      />
      <Icon
        className="relative z-10 text-white"
        size={22}
        aria-hidden="true"
      />
      <span className="btn-text relative z-10 text-base">{label}</span>
    </>
  );
}

export default function SparkleButton({
  label = "Generate Site",
  icon: Icon = Sparkles,
  onClick,
  className = "",
  href,
}: SparkleButtonProps) {
  const surface = `${sparkleSurfaceClassName} ${className}`.trim();

  return (
    <>
      <style>{styles}</style>
      {href ? (
        <Link href={href} className={`${surface} cursor-pointer no-underline`}>
          <SparkleInner label={label} Icon={Icon} />
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={`${surface} cursor-pointer`}>
          <SparkleInner label={label} Icon={Icon} />
        </button>
      )}
    </>
  );
}
