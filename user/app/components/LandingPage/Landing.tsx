"use client";
import { Sparkle } from "lucide-react";
import SparkleButton from "./SparkleButton";
import OrbLine from "./Background";
import Link from "next/link";
import MinimalDarkBackground from "./Background2";
import { Questions } from "./Q&A";
import { AboutUs } from "./AboutUs";
import { ContactUs } from "./ContactUs";
import { Footer } from "./Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-full bg-black ">
      <div className="flex justify-center sticky z-50 top-7">
        <div
          className="w-350 flex justify-between items-center px-6 md:px-12 py-3 
             bg-white/10 backdrop-blur-sm border border-white/20 
             rounded-full shadow-xl shadow-white/10"
          id="hero"
        >
          <h1 className="font-mono font-medium text-white text-lg tracking-widest uppercase">
            Unlimited.
          </h1>
          <div className="flex gap-6 justify-center items-center">
            <Link href={"/builder"}>
              <SparkleButton
                className="h-12 gap-3"
                label="Generate Site"
                icon={Sparkle}
              />
            </Link>
            <Link href={"/signin"}>
              <AvatarDemo />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex justify-center items-center min-h-150 mt-50">
        <div className="absolute inset-0">
          <OrbLine />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <GlassHero />
          <ScrollDown />
        </div>
      </div>

      <div className="relative flex flex-col items-center mt-40">
        <div className="absolute inset-0 z-0">
          <MinimalDarkBackground />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <div
            className="flex text-white justify-center text-2xl py-20 w-full scroll-mt-[20vh]"
            id="faq"
          >
            <Questions />
          </div>

          <div className="py-20 w-full scroll-mt-[20vh]" id="about">
            <AboutUs />
          </div>

          <div className="py-20 mb-40 w-full scroll-mt-[20vh]" id="contact">
            <ContactUs />
          </div>
          <div className=" w-full scroll-mt-[20vh]" id="footer">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};
function GlassHero() {
  return (
    <div
      className=" mt-59 flex flex-col justify-center items-center
        // relative w-full max-w-205 text-center font-sans
        rounded-[28px] px-8 md:px-18 py-10 md:pt-25 md:pb-22
        border border-white/10
        backdrop-blur-lg
        shadow-[0_8px_48px_rgba(0,0,0,0.4)]
        animate-fade-up
      "
    >
      <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-white/50 mb-5">
        No-code · Fast · Beautiful
      </p>

      <h1
        className="
          font-mono font-bold leading-[1.12] mb-6
          text-[clamp(2rem,6vw,3.5rem)]
          bg-linear-to-br from-white to-white/40
          bg-clip-text text-transparent
        "
      >
        Make your own
        <br />
        web site.
      </h1>

      <div className="w-115 h-px bg-white/20 mx-auto mb-6" />

      <p className="text-base font-light text-white/40 leading-[1.75] max-w-100 mx-auto">
        Launch something stunning in minutes. No experience needed — your
        vision, your domain, your rules.
      </p>

      <div className="flex flex-wrap gap-2.5 justify-center mt-10">
        {["Free to try", "Custom domain", "Mobile-ready", "SSL included"].map(
          (label) => (
            <span
              key={label}
              className="
          text-[12px] font-medium tracking-[0.06em] 
          text-white/50 bg-white/8 border border-white/12 
          rounded-full px-5 py-2
          cursor-default
          transition-all duration-300 ease-in-out
          hover:text-white/85 
          hover:bg-white/25 
          hover:border-white/40 
          hover:scale-105
          hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]
        "
            >
              {label}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
const AvatarDemo = () => {
  return (
    <Avatar className="size-11">
      <AvatarImage src="/3g.jpeg" alt="@shadcn" className="grayscale" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

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
