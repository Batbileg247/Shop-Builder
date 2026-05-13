"use client";

import { useState } from "react";

// --- Дүрст дүрслэлүүд (Icons) ---

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

// --- Төрлүүд ---
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  const set =
    (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const passwordMatchError =
    form.password &&
    form.confirmPassword &&
    form.password !== form.confirmPassword;

  // Бүртгүүлэх товч дарах үед
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Нууц үг таарахгүй байна");
      return;
    }

    setLoading(true);
    setError("");

    // Энд та өөрийн API-г дуудна (Жишээ нь: fetch('/api/signup', ...))
    setTimeout(() => {
      setLoading(false);
      setVerifying(true); // Код оруулах хэсгийг харуулна
    }, 1500);
  };

  // Код баталгаажуулах үед
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Энд та кодыг шалгах API дуудна
    setTimeout(() => {
      setLoading(false);
      alert("Амжилттай бүртгэгдлээ!");
    }, 1500);
  };

  // --- И-мэйл баталгаажуулах дэлгэц ---
  //   if (verifying) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
  //         <Blobs />
  //         <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
  //           <Shine />
  //           <div className="mb-7">
  //             <p className="mb-1 text-xs font-medium uppercase tracking-widest text-indigo-300/70">
  //               Бараг боллоо
  //             </p>
  //             <h1 className="text-2xl font-semibold tracking-tight text-white">
  //               И-мэйл баталгаажуулах
  //             </h1>
  //             <p className="mt-1 text-sm text-white/40">
  //               <span className="text-white/60">{form.email}</span> хаяг руу код
  //               илгээлээ
  //             </p>
  //           </div>

  //           <form onSubmit={handleVerify} className="flex flex-col gap-4">
  //             <div className="flex flex-col gap-1.5">
  //               <label className="text-xs font-medium uppercase tracking-wide text-white/50">
  //                 Баталгаажуулах код
  //               </label>
  //               <input
  //                 type="text"
  //                 placeholder="123456"
  //                 value={code}
  //                 onChange={(e) => setCode(e.target.value)}
  //                 maxLength={6}
  //                 required
  //                 className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-xl font-mono tracking-[0.5em] text-white placeholder-white/20 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20"
  //               />
  //             </div>

  //             <button
  //               type="submit"
  //               disabled={loading || code.length < 6}
  //               className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
  //             >
  //               {loading ? <Spinner /> : "Баталгаажуулах"}
  //             </button>

  //             <button
  //               type="button"
  //               onClick={() => setVerifying(false)}
  //               className="text-xs text-white/30 transition hover:text-white/60"
  //             >
  //               ← Буцах
  //             </button>
  //           </form>
  //         </div>
  //       </div>
  //     );
  //   }

  // --- Бүртгүүлэх үндсэн дэлгэц ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <Blobs />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <Shine />

        <div className="mb-6">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/70">
              Let's start
            </p>
            <button className="text-xl text-white/80 transition hover:text-white">
              Sign in
            </button>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Sign up
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name">
              <input
                type="text"
                placeholder="Батболд"
                value={form.lastName}
                onChange={set("lastName")}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Name">
              <input
                type="text"
                placeholder="Мөнхжин"
                value={form.firstName}
                onChange={set("firstName")}
                required
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Email">
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              required
              className={inputCls}
            />
          </Field>

          <Field label="Phone number">
            <input
              type="tel"
              placeholder="+976 8800 0000"
              value={form.phone}
              onChange={set("phone")}
              required
              className={inputCls}
            />
          </Field>

          <Field label="Password">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
                required
                className={`${inputCls} pr-10`}
              />
              <ToggleEye
                show={showPass}
                onToggle={() => setShowPass((v) => !v)}
              />
            </div>
          </Field>

          <Field label="Confirm password">
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                required
                className={`${inputCls} pr-10 ${
                  passwordMatchError
                    ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
                    : ""
                }`}
              />
              <ToggleEye
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
              />
            </div>
            {passwordMatchError && (
              <p className="mt-1 text-xs text-red-400">
                Нууц үг таарахгүй байна
              </p>
            )}
          </Field>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || !!passwordMatchError}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-2.5 text-base font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Spinner /> : "Sign up →"}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-xs text-white/25">or</span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-base text-white/70 transition hover:bg-white/10 hover:text-white active:scale-[0.98]"
          >
            <img src="/googleIcon.svg" />
            Sign up with Google
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Туслах Компонентууд ---

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-500/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleEye({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/60"
    >
      <EyeIcon open={show} />
    </button>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function Blobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl" />
    </div>
  );
}

function Shine() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent rounded-t-2xl" />
  );
}
