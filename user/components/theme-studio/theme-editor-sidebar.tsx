// "use client";

// import * as React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Box, Layers, Sparkles } from "lucide-react";

// import { useShop } from "@/app/hooks/useShop";
// import { useDashboard } from "@/context/DashboardContext";
// import { getAuthSession } from "@/lib/auth-session";
// import { BUILDER_PREVIEW_BASE, PATHS } from "@/lib/site-paths";
// import { buildHeroCarouselUrls } from "@/lib/shop-theme";
// import { useThemeStore, type ThemePresetId } from "@/stores/useThemeStore";
// import { Button } from "@/ui/button";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarInput,
//   SidebarProvider,
//   SidebarSeparator,
// } from "@/ui/sidebar";
// import { cn } from "@/lib/utils";

// const themes: { id: ThemePresetId; label: string; icon: typeof Layers }[] = [
//   { id: "minimal", label: "Minimal", icon: Layers },
//   { id: "glass", label: "Glass", icon: Sparkles },
//   { id: "neumorph", label: "Neumorph", icon: Box },
// ];

// const base = BUILDER_PREVIEW_BASE;

// function normalizeSlug(input: string) {
//   return input
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "")
//     .replace(/-+/g, "-")
//     .replace(/^-|-$/g, "");
// }
// function shortId() {
//   return Math.random().toString(36).slice(2, 8);
// }

// export function ThemeEditorSidebar() {
//   const { activeShop } = useDashboard();
//   const brand = activeShop.brandColor;

//   const preset = useThemeStore((s) => s.preset);
//   const setPreset = useThemeStore((s) => s.setPreset);
//   const heroTitle = useThemeStore((s) => s.heroTitle);
//   const setHeroTitle = useThemeStore((s) => s.setHeroTitle);
//   const heroImage = useThemeStore((s) => s.heroImage);
//   const setHeroImage = useThemeStore((s) => s.setHeroImage);
//   const heroGallery = useThemeStore((s) => s.heroGallery);
//   const addHeroGalleryImage = useThemeStore((s) => s.addHeroGalleryImage);
//   const removeHeroGalleryAt = useThemeStore((s) => s.removeHeroGalleryAt);
//   const shopName = useThemeStore((s) => s.shopName);
//   const setShopName = useThemeStore((s) => s.setShopName);
//   const heroAnnouncement = useThemeStore((s) => s.heroAnnouncement);
//   const setHeroAnnouncement = useThemeStore((s) => s.setHeroAnnouncement);
//   const radius = useThemeStore((s) => s.radius);
//   const setRadius = useThemeStore((s) => s.setRadius);
//   const cardContentPaddingRem = useThemeStore((s) => s.cardContentPaddingRem);
//   const setCardContentPaddingRem = useThemeStore(
//     (s) => s.setCardContentPaddingRem,
//   );
//   const productGridGapRem = useThemeStore((s) => s.productGridGapRem);
//   const setProductGridGapRem = useThemeStore((s) => s.setProductGridGapRem);
//   const primaryColor = useThemeStore((s) => s.primaryColor);
//   const backgroundColor = useThemeStore((s) => s.backgroundColor);
//   const textColor = useThemeStore((s) => s.textColor);
//   const font = useThemeStore((s) => s.font);
//   const resetTheme = useThemeStore((s) => s.reset);

//   const shop = useShop();
//   const cartCount = shop.cartItems.reduce((s, i) => s + i.quantity, 0);

//   const heroSlideCount = React.useMemo(
//     () => buildHeroCarouselUrls({ heroImage, heroGallery }).length,
//     [heroImage, heroGallery],
//   );

//   const [ownerId, setOwnerId] = React.useState("");
//   const [storeName, setStoreName] = React.useState("My Store");
//   const [storeSlug, setStoreSlug] = React.useState("");
//   const [publishStatus, setPublishStatus] = React.useState<
//     "idle" | "creating" | "created" | "error"
//   >("idle");
//   const [publishError, setPublishError] = React.useState<string | null>(null);

//   React.useEffect(() => {
//     const s = getAuthSession();
//     if (s?.user?.id) setOwnerId((p) => (p.trim() ? p : s.user.id));
//   }, []);

//   async function handleCreateStore() {
//     const platformBase = process.env.NEXT_PUBLIC_PLATFORM_API_URL?.trim();
//     if (!platformBase) {
//       setPublishError("NEXT_PUBLIC_PLATFORM_API_URL тохируулаагүй байна.");
//       setPublishStatus("error");
//       return;
//     }
//     if (!ownerId.trim()) {
//       setPublishError("Owner ID шаардлагатай.");
//       setPublishStatus("error");
//       return;
//     }
//     if (buildHeroCarouselUrls({ heroImage, heroGallery }).length < 3) {
//       setPublishError("Hero зураг дор хаяж 3 байх ёстой.");
//       setPublishStatus("error");
//       return;
//     }
//     setPublishError(null);
//     setPublishStatus("creating");
//     const slug = `${normalizeSlug(storeName) || `my-store-${shortId()}`}-${shortId()}`;
//     try {
//       const res = await fetch(`${platformBase}/stores`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ownerId: ownerId.trim(),
//           name: storeName.trim() || "My Store",
//           slug,
//           themeConfig: {
//             builderTheme: preset,
//             heroTitle,
//             heroImage,
//             heroGallery,
//             shopName,
//             heroAnnouncement,
//             primaryColor,
//             backgroundColor,
//             textColor,
//             font,
//             layout: {
//               radiusPx: radius,
//               cardContentPaddingRem,
//               productGridGapRem,
//             },
//           },
//         }),
//       });
//       const data = (await res.json().catch(() => null)) as {
//         error?: string;
//         slug?: string;
//       } | null;
//       if (!res.ok) {
//         setPublishError(data?.error || `Алдаа (${res.status})`);
//         setPublishStatus("error");
//         return;
//       }
//       setStoreSlug(String(data?.slug ?? slug));
//       setPublishStatus("created");
//     } catch (e) {
//       setPublishError(e instanceof Error ? e.message : "Сүлжээний алдаа");
//       setPublishStatus("error");
//     }
//   }

//   return (
//     <SidebarProvider
//       defaultOpen
//       style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
//       className="h-full w-72 min-w-0 shrink-0"
//     >
//       <Sidebar
//         collapsible="none"
//         className="h-full w-72 shrink-0 border-r border-neutral-200 bg-white text-neutral-900"
//         data-theme="minimal"
//       >
//         {/* ── Header ── */}
//         <SidebarHeader className="border-b border-neutral-200 bg-white px-5 py-4">
//           <div className="flex items-center gap-3">
//             <div
//               className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
//               style={{ backgroundColor: brand }}
//             >
//               TS
//             </div>
//             <div>
//               <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
//                 Theme editor
//               </p>
//               <p className="text-base font-black tracking-tight text-neutral-900">
//                 Shop Builder
//               </p>
//             </div>
//           </div>

//           <div className="mt-4 flex gap-2">
//             <Link
//               href={`${base}?cart=open`}
//               className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
//             >
//               Сагс
//               {cartCount > 0 && (
//                 <span className="rounded-md bg-neutral-900 px-1.5 py-0.5 text-xs font-black text-white tabular-nums">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//             <Link
//               href={base}
//               className="flex flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
//             >
//               Дэлгүүр
//             </Link>
//           </div>
//         </SidebarHeader>

//         {/* ── Body ── */}
//         <SidebarContent className="overflow-y-auto bg-white">
//           {/* — Site settings — */}
//           <SidebarGroup className="px-5 py-5">
//             <SidebarGroupLabel className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
//               Site settings
//             </SidebarGroupLabel>
//             <SidebarGroupContent className="space-y-4">
//               {(
//                 [
//                   {
//                     id: "shop-name",
//                     label: "Shop name",
//                     val: shopName,
//                     set: setShopName,
//                     ph: "Nomad Goods",
//                   },
//                   {
//                     id: "hero-announcement",
//                     label: "Announcement",
//                     val: heroAnnouncement,
//                     set: setHeroAnnouncement,
//                     ph: "Free delivery in UB…",
//                   },
//                   {
//                     id: "hero-title",
//                     label: "Tagline",
//                     val: heroTitle,
//                     set: setHeroTitle,
//                     ph: "Subtitle under shop name…",
//                   },
//                 ] as const
//               ).map(({ id, label, val, set, ph }) => (
//                 <div key={id} className="space-y-1.5">
//                   <label
//                     htmlFor={id}
//                     className="text-sm font-medium text-neutral-500"
//                   >
//                     {label}
//                   </label>
//                   <SidebarInput
//                     id={id}
//                     value={val}
//                     placeholder={ph}
//                     onChange={(e) => set(e.target.value)}
//                     className="h-10 rounded-xl border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-neutral-300"
//                   />
//                 </div>
//               ))}

//               <div className="space-y-1.5">
//                 <label
//                   htmlFor="hero-image"
//                   className="text-sm font-medium text-neutral-500"
//                 >
//                   Hero image URL
//                 </label>
//                 <SidebarInput
//                   id="hero-image"
//                   value={heroImage}
//                   placeholder="https://…"
//                   onChange={(e) => setHeroImage(e.target.value)}
//                   className="h-10 rounded-xl border-neutral-200 bg-neutral-50 font-mono text-xs text-neutral-900 placeholder:text-neutral-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-neutral-300"
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <span className="text-sm font-medium text-neutral-500">
//                   Primary hero upload
//                 </span>
//                 <input
//                   accept="image/*"
//                   type="file"
//                   className="block w-full text-xs text-neutral-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-neutral-200 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-neutral-700 file:transition file:hover:bg-neutral-50"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     e.target.value = "";
//                     if (!file) return;
//                     const r = new FileReader();
//                     r.onload = () => setHeroImage(String(r.result ?? ""));
//                     r.readAsDataURL(file);
//                   }}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <span className="text-sm font-medium text-neutral-500">
//                   Hero gallery
//                 </span>
//                 {heroGallery.length > 0 && (
//                   <div className="flex flex-wrap gap-2">
//                     {heroGallery.map((url, i) => (
//                       <div
//                         key={`${url.slice(0, 48)}-${i}`}
//                         className="relative size-14 overflow-hidden rounded-xl border border-neutral-200"
//                       >
//                         <Image
//                           alt=""
//                           className="object-cover"
//                           fill
//                           sizes="56px"
//                           src={url}
//                           unoptimized
//                         />
//                         <button
//                           type="button"
//                           className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-bold text-white opacity-0 transition hover:opacity-100"
//                           onClick={() => removeHeroGalleryAt(i)}
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <input
//                   accept="image/*"
//                   type="file"
//                   className="block w-full text-xs text-neutral-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-neutral-200 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-neutral-700 file:transition file:hover:bg-neutral-50"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     e.target.value = "";
//                     if (!file) return;
//                     const r = new FileReader();
//                     r.onload = () =>
//                       addHeroGalleryImage(String(r.result ?? ""));
//                     r.readAsDataURL(file);
//                   }}
//                 />
//               </div>

//               {/* Slide counter */}
//               <div
//                 className={cn(
//                   "rounded-xl px-3.5 py-3 text-sm",
//                   heroSlideCount >= 3
//                     ? "border border-green-100 bg-green-50 text-green-800"
//                     : "border border-amber-100 bg-amber-50 text-amber-800",
//                 )}
//               >
//                 <p className="font-bold">Hero slides: {heroSlideCount} / 3</p>
//                 <p className="mt-0.5 text-xs font-medium opacity-80">
//                   {heroSlideCount >= 3
//                     ? "Ready — carousel has enough slides."
//                     : "Primary + gallery must reach 3 images."}
//                 </p>
//               </div>
//             </SidebarGroupContent>
//           </SidebarGroup>

//           <SidebarSeparator className="bg-neutral-100" />

//           {/* — Style selection — */}
//           <SidebarGroup className="px-5 py-5">
//             <SidebarGroupLabel className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
//               Style
//             </SidebarGroupLabel>
//             <SidebarGroupContent className="space-y-2">
//               {themes.map(({ id, label, icon: Icon }) => {
//                 const active = preset === id;
//                 return (
//                   <button
//                     key={id}
//                     type="button"
//                     onClick={() => setPreset(id)}
//                     className={cn(
//                       "flex h-11 w-full items-center gap-3 rounded-xl px-4 text-sm font-semibold transition",
//                       active
//                         ? "bg-neutral-900 text-white"
//                         : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
//                     )}
//                   >
//                     <span
//                       className={cn(
//                         "flex size-7 items-center justify-center rounded-lg",
//                         active
//                           ? "bg-white/15 text-white"
//                           : "bg-neutral-100 text-neutral-500",
//                       )}
//                     >
//                       <Icon className="size-4 shrink-0" aria-hidden />
//                     </span>
//                     {label}
//                   </button>
//                 );
//               })}
//             </SidebarGroupContent>
//           </SidebarGroup>

//           <SidebarSeparator className="bg-neutral-100" />

//           {/* — Layout sliders — */}
//           <SidebarGroup className="px-5 py-5">
//             <SidebarGroupLabel className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
//               Layout
//             </SidebarGroupLabel>
//             <SidebarGroupContent className="space-y-5">
//               {[
//                 {
//                   id: "radius-theme",
//                   label: "Булангийн радиус",
//                   value: radius,
//                   display: `${radius}px`,
//                   min: 2,
//                   max: 40,
//                   step: 1,
//                   onChange: (v: number) => setRadius(v),
//                 },
//                 {
//                   id: "card-pad",
//                   label: "Картын доторх зай",
//                   value: cardContentPaddingRem,
//                   display: `${cardContentPaddingRem.toFixed(2)}rem`,
//                   min: 0.5,
//                   max: 2,
//                   step: 0.0625,
//                   onChange: (v: number) => setCardContentPaddingRem(v),
//                 },
//                 {
//                   id: "grid-gap",
//                   label: "Торын зай",
//                   value: productGridGapRem,
//                   display: `${productGridGapRem.toFixed(2)}rem`,
//                   min: 0.375,
//                   max: 2.5,
//                   step: 0.0625,
//                   onChange: (v: number) => setProductGridGapRem(v),
//                 },
//               ].map(
//                 ({ id, label, value, display, min, max, step, onChange }) => (
//                   <div key={id} className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <label
//                         htmlFor={id}
//                         className="text-sm font-medium text-neutral-600"
//                       >
//                         {label}
//                       </label>
//                       <span className="text-xs font-semibold tabular-nums text-neutral-400">
//                         {display}
//                       </span>
//                     </div>
//                     <input
//                       id={id}
//                       type="range"
//                       min={min}
//                       max={max}
//                       step={step}
//                       value={value}
//                       onChange={(e) =>
//                         onChange(Number.parseFloat(e.target.value))
//                       }
//                       className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-900"
//                     />
//                   </div>
//                 ),
//               )}
//             </SidebarGroupContent>
//           </SidebarGroup>

//           <SidebarSeparator className="bg-neutral-100" />

//           {/* — Publish — */}
//           <SidebarGroup className="px-5 py-5">
//             <SidebarGroupLabel className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
//               Дэлгүүр үүсгэх
//             </SidebarGroupLabel>
//             <SidebarGroupContent className="space-y-4">
//               <p className="text-xs leading-relaxed text-neutral-400">
//                 Platform API дээр дэлгүүр үүсгээд public storefront нээнэ.
//               </p>

//               {(
//                 [
//                   {
//                     id: "owner-id",
//                     label: "Owner ID",
//                     val: ownerId,
//                     set: setOwnerId,
//                     ph: "merchant user UUID",
//                     mono: true,
//                   },
//                   {
//                     id: "store-name",
//                     label: "Дэлгүүрийн нэр",
//                     val: storeName,
//                     set: setStoreName,
//                     ph: "My Store",
//                     mono: false,
//                   },
//                 ] as const
//               ).map(({ id, label, val, set, ph, mono }) => (
//                 <div key={id} className="space-y-1.5">
//                   <label
//                     htmlFor={id}
//                     className="text-sm font-medium text-neutral-500"
//                   >
//                     {label}
//                   </label>
//                   <SidebarInput
//                     id={id}
//                     value={val}
//                     placeholder={ph}
//                     onChange={(e) => set(e.target.value)}
//                     className={cn(
//                       "h-10 rounded-xl border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-neutral-300",
//                       mono && "font-mono text-xs",
//                     )}
//                   />
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={handleCreateStore}
//                 disabled={publishStatus === "creating"}
//                 className="h-11 w-full rounded-xl bg-neutral-900 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
//               >
//                 {publishStatus === "creating"
//                   ? "Үүсгэж байна…"
//                   : "Шинэ дэлгүүр үүсгэх"}
//               </button>

//               {publishStatus === "created" && storeSlug && (
//                 <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
//                   <p className="text-sm font-bold text-neutral-900">
//                     Дэлгүүр үүслээ
//                   </p>
//                   <p className="mt-1 break-all font-mono text-xs text-neutral-400">
//                     slug: {storeSlug}
//                   </p>
//                   <Link
//                     href={`/s/${encodeURIComponent(storeSlug)}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="mt-3 flex w-full items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800"
//                   >
//                     Public дэлгүүр нээх
//                   </Link>
//                 </div>
//               )}

//               {publishError && (
//                 <p className="text-xs font-semibold text-red-500">
//                   {publishError}
//                 </p>
//               )}
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarContent>

//         {/* ── Footer ── */}
//         <SidebarFooter className="border-t border-neutral-200 bg-white px-5 py-4">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => resetTheme()}
//             className="h-10 w-full rounded-xl border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
//           >
//             Reset to default
//           </Button>
//           <Link
//             href={PATHS.adminOverview}
//             className="mt-2 block rounded-lg py-2 text-center text-xs font-semibold text-neutral-400 transition hover:text-neutral-700"
//           >
//             Өмнөх builder
//           </Link>
//         </SidebarFooter>
//       </Sidebar>
//     </SidebarProvider>
//   );
// }
