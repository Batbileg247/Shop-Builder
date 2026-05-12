"use client";
import { useEffect, useRef } from "react";

const PALETTES = [
  ["#004e92", "#000428"],
  ["#430089", "#110011"],
  ["#004d40", "#000000"],
  ["#310e0e", "#000000"],
];

class Orb {
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  r: number;
  pal: string[];
  phase: number;
  speed: number;

  constructor(W: number, H: number, dpr: number, i: number) {
    this.anchorX = Math.random() * W;
    this.anchorY = (H / 10) * i + (Math.random() * H) / 10;
    this.x = this.anchorX;
    this.y = this.anchorY;

    this.r = (80 + Math.random() * 100) * dpr;
    this.pal = PALETTES[i % PALETTES.length];
    this.phase = Math.random() * Math.PI * 2;
    this.speed = 0.0003 + Math.random() * 0.005;
  }

  update(t: number) {
    this.x = this.anchorX + Math.cos(t * this.speed + this.phase) * 70;
    this.y = this.anchorY + Math.sin(t * this.speed * 0.8 + this.phase) * 50;
  }

  draw(ctx: CanvasRenderingContext2D, dpr: number) {
    const pulse = (Math.sin(Date.now() * 0.001 + this.phase) + 1) / 2;
    const r = this.r + pulse * 20 * dpr;

    const g = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      r * 3,
    );
    g.addColorStop(0, this.pal[0] + "33");
    g.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 3, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + pulse * 0.1})`;
    ctx.fill();
  }
}

export default function MinimalDarkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0,
      H = 0,
      animId: number,
      t = 0;
    let orbs: Orb[] = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      W = canvas.width = rect.width * dpr;
      H = canvas.height = rect.height * dpr;

      const count = Math.min(Math.floor(H / 200), 10);
      orbs = Array.from({ length: count }, (_, i) => new Orb(W, H, dpr, i));
    }

    window.addEventListener("resize", resize);
    resize();

    function draw() {
      t += 1;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      orbs.forEach((o) => {
        o.update(t);
        o.draw(ctx, window.devicePixelRatio || 1);
      });

      const overlay = ctx.createLinearGradient(0, 0, 0, H * 0.01);
      overlay.addColorStop(0, "rgba(0,0,0,1)");
      overlay.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, W, H * 0.2);

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{
        display: "block",
        background: "#000000",
        pointerEvents: "none",
      }}
    />
  );
}
