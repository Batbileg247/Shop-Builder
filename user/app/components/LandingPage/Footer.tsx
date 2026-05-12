import { Separator } from "@/ui/separator";
import Link from "next/link";
import { Instagram } from "../PixeledIcons/InstagramIcon";
import { Facebook } from "../PixeledIcons/Facebook";

export const Footer = () => {
  return (
    <div className=" bg-[#060116] py-10 pt-20 px-60 flex flex-col text-gray-200 items-center rounded-t-[150px]">
      <div className="grid grid-cols-3 gap-80">
        <div className="flex flex-col">
          <a
            href="#hero"
            className="font-mono text-2xl font-extrabold text-indigo-200 p-1"
          >
            UNLIMITED.
          </a>
          <h2 className="p-1">Web maker platform.</h2>
          <div className="flex gap-3 p-1">
            <Link
              href={
                "https://www.instagram.com/code3g.dev?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              }
              className="text-indigo-50 "
            >
              <Instagram />
            </Link>
            <Link
              href={"https://www.facebook.com/munkhjin.batbold.717535"}
              className="text-indigo-50 "
            >
              <Facebook />
            </Link>
          </div>
          <h3 className="text-xl font-medium pt-3 pb-1 px-1">Phone</h3>
          <p className="px-1">(+976) 8811-1426</p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold ">Company</h1>
          <a href="#about">About Us</a>
          <a href="#contact">Contact Us</a>
          <h2>Pricing Plans</h2>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold ">Check-Outs</h1>
          <h2>Terms of Service</h2>
          <a href="#faq">Frequently Asked Questions</a>
          <h2>Privacy Policy</h2>
        </div>
      </div>
      <div className=" mt-10 border-t-2 border-gray-800">
        <h1 className="flex justify-center items-center font-mono text-gray-500 pt-6 w-450">
          UNLIMITED. LLC
        </h1>
      </div>
    </div>
  );
};
