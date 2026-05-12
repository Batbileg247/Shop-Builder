"use client";
import { Sparkle, Trophy } from "lucide-react";
import SparkleButton from "./SparkleButton";
import OrbLine from "./Background";

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="flex justify-between items-center px-30 py-10">
        <h1 className="font-mono font-medium text-white text-lg tracking-widest uppercase">
          Unlimited.
        </h1>
        <SparkleButton
          className="h-12 gap-3"
          label="Generate Site"
          icon={Sparkle}
        />
      </div>

      <div className="relative flex-1 flex justify-center items-center min-h-150 mt-70">
        <div className="absolute inset-0">
          <OrbLine />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pb-38">
          <GlassHero />
          <ScrollDown />
        </div>
      </div>
      <div></div>
    </div>
  );
};

function GlassHero() {
  return (
    <div
      className="mt-45 flex flex-col justify-center items-center
        relative w-full max-w-205 h-full text-center font-sans
        rounded-[28px] px-18 pt-25 pb-22
        border border-white/18
        backdrop-blur-lg
        shadow-[0_8px_48px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.05)]
        animate-fade-up
        before:absolute before:inset-0 before:rounded-[28px]
        // before:bg-linear-to-br before:from-white/10 before:to-transparent
        before:pointer-events-none
      "
    >
      <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-white/40 mb-5">
        No-code · Fast · Beautiful
      </p>

      <h1
        className="
          font-mono font-bold leading-[1.12] mb-6
          text-[clamp(2.4rem,6vw,3.5rem)]
          bg-linear-to-br from-white to-white/55
          bg-clip-text text-transparent
        "
      >
        Make your own
        <br />
        web site.
      </h1>

      <div className="w-12 h-px bg-white/25 mx-auto mb-6" />

      <p className="text-base font-light text-white/50 leading-[1.75] max-w-100 mx-auto">
        Launch something stunning in minutes. No experience needed — your
        vision, your domain, your rules.
      </p>

      <div className="flex flex-wrap gap-2.5 justify-center mt-10">
        {["Free to try", "Custom domain", "Mobile-ready", "SSL included"].map(
          (label) => (
            <span
              key={label}
              className="text-[11px] font-medium tracking-[0.06em] text-white/40 bg-white/6 border border-white/10 rounded-full px-4 py-1.5"
            >
              {label}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
const ScrollDown = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 mt-20">
      <div
        className="relative cursor-pointer rounded-[50px] border-[3px] border-indigo-600"
        style={{ width: "30px", height: "50px" }}
      >
        <div className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-indigo-800 shadow-[0px_-5px_3px_1px_rgba(42,84,112,0.4)] animate-[scrolldown-anim_2s_infinite]" />

        <div className="mt-12 flex -translate-x-0.75 flex-col items-center w-7.5">
          <div className="chevrondown animate-[pulse_500ms_ease_infinite_alternate]" />
          <div className="chevrondown animate-[pulse_500ms_ease_infinite_alternate_250ms]" />
        </div>
      </div>

      <style jsx>{`
        .chevrondown {
          margin-top: -6px;
          position: relative;
          border: solid indigo;
          border-width: 0 3px 3px 0;
          display: inline-block;
          width: 10px;
          height: 10px;
          transform: rotate(45deg);
        }

        @keyframes scrolldown-anim {
          0% {
            opacity: 0;
            height: 6px;
          }
          40% {
            opacity: 1;
            height: 10px;
          }
          80% {
            transform: translate(-50%, 20px);
            height: 10px;
            opacity: 0;
          }
          100% {
            height: 3px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollDown;
