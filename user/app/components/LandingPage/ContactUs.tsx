import { Mail, MonitorSmartphone, Phone } from "lucide-react";
import React from "react";

export const ContactUs = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <h1 className="text-4xl text-indigo-50 mb-5 font-semibold">Contact Us</h1>
      <p className="text-md text-white mb-10">
        Reach out through any of the channels below.
      </p>

      <GlassCard className="px-12 py-15 text-white">
        <div className="flex text-md">
          <ContactColumn
            icon={<Phone size={24} />}
            label="Phone"
            value="(+976) 8811-1426"
            note="Available on business days during working hours."
          />
          <div className="w-px bg-white/8 " />
          <ContactColumn
            icon={<Mail size={24} />}
            label="Email"
            value="bb.munkhjin@gmail.com"
            note="Available on business days during working hours."
          />
          <div className="w-px bg-white/8 " />
          <ContactColumn
            icon={<MonitorSmartphone size={24} />}
            label="Socials"
            value="Instagram, Facebook"
            note="Available on business days during working hours."
          />
        </div>
      </GlassCard>
    </div>
  );
};

interface ContactColumnProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}

const ContactColumn: React.FC<ContactColumnProps> = ({
  icon,
  label,
  value,
  note,
}) => (
  <div className="flex flex-col gap-2 px-8">
    <div className="w-14 px-2 py-4 rounded-[10px] bg-indigo-900/15 border border-violet-400/25 flex items-center justify-center text-indigo-600 mb-1">
      {icon}
    </div>
    <p className="font-medium text-xl">{label}</p>
    <p className="text-lg">{value}</p>
    <p className="text-white/80">{note}</p>
  </div>
);

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`
        rounded-[34px]
        bg-white/6
        backdrop-blur-md
        saturate-[2]
        brightness-[1.15]
        contrast-[1]
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),inset_1.5px_1.5px_0_rgba(255,255,255,0.5),inset_0_0_12px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.2)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};
