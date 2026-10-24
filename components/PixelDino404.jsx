"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const DINO_BODY = [
  "            ###      ",
  "           ##o#######",
  "           ##########",
  "           ##########",
  "           ##########",
  "           ####      ",
  "           ####      ",
  " #        ######     ",
  " #       ######      ",
  " ##     #######      ",
  " ###   ########      ",
  " ##############      ",
  "  ############       ",
  "   ###########       ",
  "    ##########       ",
  "     ########        "
];

const LEGS_STEP1 = [
  "      ###  #         ",
  "      ##   ##        ",
  "      #              ",
  "      ##             "
];

const LEGS_STEP2 = [
  "      #  ###         ",
  "      ##   ##        ",
  "            #        ",
  "            ##       "
];

const LEGS_JUMP = [
  "      ###  ##        ",
  "      ##    ##       ",
  "                     ",
  "                     "
];

export default function PixelDino404() {
  const canvasRef = useRef(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const bgImageRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/404-bg-teal.png";
    img.onload = () => {
      bgImageRef.current = img;
      setBgLoaded(true);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Dino state
    const DINO_BASE_X = 328;
    const DINO_BASE_Y = 214;
    const BLOCK = 7; // each block is 7x7 px
    
    let dinoY = DINO_BASE_Y;
    let dinoVY = 0;
    const GRAVITY = 0.55;
    let isJumping = false;
    let stepFrame = 0;
    let lastStepTime = 0;
    const STEP_INTERVAL = 110; // ms per footstep

    // Dust particles from running feet
    let dustParticles = [];

    // Ground segments
    let groundDashes = [
      { x: 260, w: 28, y: 355 },
      { x: 300, w: 14, y: 366 },
      { x: 325, w: 22, y: 355 },
      { x: 360, w: 32, y: 362 },
      { x: 410, w: 18, y: 355 },
      { x: 440, w: 42, y: 355 },
      { x: 495, w: 26, y: 364 },
      { x: 535, w: 35, y: 355 },
      { x: 585, w: 20, y: 358 },
    ];

    // Meteors
    let meteors = [
      { x: 415, y: 110, vx: -1.4, vy: 1.9, size: 28, trail: [] },
      { x: 375, y: 140, vx: -1.2, vy: 1.6, size: 18, trail: [] },
    ];

    let animId;

    const handleJump = () => {
      if (!isJumping) {
        dinoVY = -9.2;
        isJumping = true;
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    let lastTime = performance.now();

    const render = (currentTime) => {
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      // Update footstep frame
      if (currentTime - lastStepTime > STEP_INTERVAL) {
        stepFrame = (stepFrame + 1) % 2;
        lastStepTime = currentTime;

        // Emit dust on stride if on ground
        if (!isJumping) {
          dustParticles.push({
            x: DINO_BASE_X + 46,
            y: DINO_BASE_Y + 138,
            vx: -1.5 - Math.random() * 1.5,
            vy: -0.5 - Math.random() * 0.8,
            life: 1.0,
          });
        }
      }

      // Physics for jump
      if (isJumping) {
        dinoY += dinoVY;
        dinoVY += GRAVITY;
        if (dinoY >= DINO_BASE_Y) {
          dinoY = DINO_BASE_Y;
          dinoVY = 0;
          isJumping = false;
        }
      }

      // Scroll ground dashes
      const groundSpeed = 3.5;
      groundDashes.forEach((d) => {
        d.x -= groundSpeed;
        if (d.x + d.w < 200) {
          d.x = 610 + Math.random() * 20;
        }
      });

      // Update dust particles
      dustParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
      });
      dustParticles = dustParticles.filter((p) => p.life > 0);

      // Update meteors
      meteors.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        // Keep trail
        m.trail.unshift({ x: m.x, y: m.y, alpha: 1 });
        if (m.trail.length > 14) m.trail.pop();
        m.trail.forEach((t) => (t.alpha -= 0.07));

        // Respawn when meteor hits bottom
        if (m.y > 330 || m.x < 240) {
          m.x = 400 + Math.random() * 60;
          m.y = 80 + Math.random() * 40;
          m.trail = [];
        }
      });

      // DRAW CANVAS
      ctx.clearRect(0, 0, 800, 600);

      // 1. Draw static background (404 and "Page not found" in teal)
      if (bgImageRef.current) {
        ctx.drawImage(bgImageRef.current, 0, 0, 800, 600);
      }

      // 2. Draw ground dashes
      ctx.fillStyle = "#222629";
      groundDashes.forEach((d) => {
        ctx.fillRect(Math.round(d.x), d.y, d.w, 4);
      });

      // 3. Draw dust particles
      dustParticles.forEach((p) => {
        ctx.fillStyle = `rgba(34, 38, 41, ${p.life * 0.7})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 4, 4);
      });

      // 4. Draw meteors with pixel trails
      meteors.forEach((m) => {
        // Trail
        m.trail.forEach((t, i) => {
          if (t.alpha > 0) {
            ctx.fillStyle = `rgba(34, 38, 41, ${t.alpha * 0.8})`;
            const size = Math.max(3, 7 - Math.floor(i / 2));
            ctx.fillRect(Math.round(t.x + (i * 2.5)), Math.round(t.y - (i * 3)), size, size);
          }
        });

        // Diamond head
        const hx = Math.round(m.x);
        const hy = Math.round(m.y);
        ctx.fillStyle = "#222629";
        // 3x3 diamond shape
        ctx.fillRect(hx + 3, hy, 4, 10);
        ctx.fillRect(hx, hy + 3, 10, 4);
        ctx.fillRect(hx + 2, hy + 2, 6, 6);
      });

      // 5. Draw Animated Dinosaur
      // Body bobs by 2px on alternating step if on ground
      const bob = isJumping ? 0 : (stepFrame === 1 ? -2 : 0);
      const curDinoY = Math.round(dinoY + bob);

      // Choose leg sprite
      let currentLegs = isJumping ? LEGS_JUMP : (stepFrame === 0 ? LEGS_STEP1 : LEGS_STEP2);
      const fullDino = [...DINO_BODY, ...currentLegs];

      for (let row = 0; row < fullDino.length; row++) {
        const line = fullDino[row];
        for (let col = 0; col < line.length; col++) {
          const char = line[col];
          const px = DINO_BASE_X + col * BLOCK;
          const py = curDinoY + row * BLOCK;

          if (char === "#") {
            ctx.fillStyle = "#222629"; // Chrome Dino dark charcoal
            ctx.fillRect(px, py, BLOCK, BLOCK);
          } else if (char === "o") {
            ctx.fillStyle = "#FFFFFF"; // Eye
            ctx.fillRect(px, py, BLOCK, BLOCK);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animId);
    };
  }, [bgLoaded]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={540}
        onClick={() => {
          // Trigger jump on click / tap
          const event = new KeyboardEvent("keydown", { code: "Space" });
          window.dispatchEvent(event);
        }}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "620px",
          display: "block",
          cursor: "pointer",
          imageRendering: "pixelated",
        }}
        title="Click or press Space to jump!"
      />

      <Link
        href="/"
        style={{
          marginTop: "14px",
          color: "#0F172A",
          fontSize: "1rem",
          fontWeight: 500,
          textDecoration: "none",
          padding: "8px 18px",
          borderRadius: "8px",
          transition: "color 0.2s ease, transform 0.15s ease",
          display: "inline-block",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#14B8A6";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#0F172A";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Go to home
      </Link>
    </div>
  );
}
