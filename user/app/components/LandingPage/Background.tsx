"use client";
import { useEffect, useRef } from "react";

export default function OrbLine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0,
      H = 0,
      animId: number;

    function resize() {
      const r = canvas!.getBoundingClientRect();
      W = canvas!.width = r.width * devicePixelRatio;
      H = canvas!.height = r.height * devicePixelRatio;
    }
    resize();
    window.addEventListener("resize", resize);

    function bezierPoint(
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number },
      t: number,
    ) {
      const mt = 1 - t;
      return {
        x:
          mt * mt * mt * p0.x +
          3 * mt * mt * t * p1.x +
          3 * mt * t * t * p2.x +
          t * t * t * p3.x,
        y:
          mt * mt * mt * p0.y +
          3 * mt * mt * t * p1.y +
          3 * mt * t * t * p2.y +
          t * t * t * p3.y,
      };
    }

    let t = 0;

    function draw() {
      t += 0.022;
      ctx.clearRect(0, 0, W, H);

      const p0 = { x: -W * 0.5, y: H * 1.5 };
      const p1 = { x: W * 0.2, y: H * 0.8 };
      const p2 = { x: W * 0.8, y: H * 0.2 };
      const p3 = { x: W * 1.5, y: H * -0.5 };

      const orb = bezierPoint(p0, p1, p2, p3, 0.5);

      const shift = (Math.sin(t) + 1) / 2;
      const s = shift * 0.6;

      const grad = ctx.createLinearGradient(p0.x, p0.y, p3.x, p3.y);
      grad.addColorStop(Math.max(0, s), "#9400ff");
      grad.addColorStop(Math.min(1, Math.max(0, s + 0.25)), "#d4007a");
      grad.addColorStop(Math.min(1, Math.max(0, s + 0.5)), "#ff4500");
      grad.addColorStop(Math.min(1, Math.max(0, s + 0.75)), "#ffb300");
      grad.addColorStop(Math.min(1, s + 1.0), "#ffe566");

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4 * devicePixelRatio;
      ctx.lineCap = "round";
      ctx.stroke();

      const pulse = (Math.sin(t * 1.4) + 1) / 2;

      // Outer ambient glow
      const bigR = (300 + pulse * 150) * devicePixelRatio;
      const bigGlow = ctx.createRadialGradient(
        orb.x,
        orb.y,
        0,
        orb.x,
        orb.y,
        bigR,
      );
      bigGlow.addColorStop(0, `rgba(255,255,255,${0.1 + pulse * 0.08})`);
      bigGlow.addColorStop(0.4, `rgba(255,255,255,${0.04 + pulse * 0.04})`);
      bigGlow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, bigR, 0, Math.PI * 2);
      ctx.fillStyle = bigGlow;
      ctx.fill();

      // Rings
      [180, 130, 85, 45].forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r * devicePixelRatio, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${0.03 + i * 0.025 + pulse * 0.04})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Arms
      const armLen = (120 + pulse * 60) * devicePixelRatio;
      const gap = 20 * devicePixelRatio;
      [-1, 1].forEach((sign) => {
        const x0 = orb.x + sign * gap;
        const x1 = orb.x + sign * (gap + armLen);
        const g2 = ctx.createLinearGradient(x0, orb.y, x1, orb.y);
        g2.addColorStop(0, `rgba(255,255,255,${0.85 + pulse * 0.15})`);
        g2.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.moveTo(x0, orb.y);
        ctx.lineTo(x1, orb.y);
        ctx.strokeStyle = g2;
        ctx.lineWidth = 1.5 * devicePixelRatio;
        ctx.stroke();
      });

      // Core glow
      const coreR = (60 + pulse * 10) * devicePixelRatio;
      const coreGlow = ctx.createRadialGradient(
        orb.x,
        orb.y,
        0,
        orb.x,
        orb.y,
        coreR,
      );
      coreGlow.addColorStop(0, "rgba(255,255,255,1)");
      coreGlow.addColorStop(0.3, `rgba(255,255,255,${0.7 + pulse * 0.3})`);
      coreGlow.addColorStop(0.7, `rgba(255,255,255,${0.2 + pulse * 0.2})`);
      coreGlow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, coreR, 0, Math.PI * 2);
      ctx.fillStyle = coreGlow;
      ctx.fill();

      // White dot
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 4.5 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = "#f9f6f3";
      ctx.fill();

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div>
      <div className="h-25 bg-black"></div>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "480px",
          background: "#000",
          borderRadius: "0",
        }}
      />
    </div>
  );
}
