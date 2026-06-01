import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback, type MouseEvent, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Register the GSAP plugin
gsap.registerPlugin(useGSAP);

const features = [
  {
    title: "Infinite Variations",
    description: "Generate multiple unique branches of your story from a single starting prompt. Explore every creative possibility.",
    bgClass: "bg-gradient-to-br from-blue-900 to-sky-600/70 dark:from-blue-950 dark:to-sky-800/90",
    icon: (
      <svg className="w-7 h-7 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )
  },
  {
    title: "AI Co-Writer",
    description: "Stuck on a paragraph? Let our advanced AI models suggest the next perfect sentence to keep your momentum going.",
    bgClass: "bg-gradient-to-br from-indigo-900 to-purple-600/70 dark:from-indigo-950 dark:to-purple-800/90",
    icon: (
      <svg className="w-7 h-7 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Community Driven",
    description: "Publish your stories, gather likes, and interact with other creators in a thriving, collaborative ecosystem.",
    bgClass: "bg-gradient-to-br from-fuchsia-900 to-pink-600/70 dark:from-fuchsia-950 dark:to-pink-800/90",
    icon: (
      <svg className="w-7 h-7 text-pink-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

interface Feature {
  title: string;
  description: string;
  bgClass: string;
  icon: ReactNode;
}

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (rafId !== null) return; // skip if frame pending
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Parallax effect on inner content
        gsap.to(contentRef.current, {
          x: x * 0.15,
          y: y * 0.15,
          ease: "power2.out",
          duration: 0.3,
        });

        // Slight 3D tilt on the card itself
        gsap.to(card, {
          rotateY: (x / rect.width) * 15,
          rotateX: -(y / rect.height) * 15,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.3,
        });
      });
    };

    const handleMouseLeave = () => {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      gsap.to(contentRef.current, {
        x: 0,
        y: 0,
        ease: "power2.out",
        duration: 0.7,
      });

      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        ease: "power2.out",
        duration: 0.7,
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div style={{ perspective: "1000px" }} className="h-full">
      <div
        ref={cardRef}
        className={`motion-card relative overflow-hidden backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-shadow duration-500 shadow-xl group cursor-pointer ${feature.bgClass} hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] h-full`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div ref={contentRef} className="relative z-10 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">{feature.title}</h3>
          <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">{feature.description}</p>
        </div>
      </div>
    </div>
  );
};

/* Ambient Particle System - GSAP powered */
const PARTICLE_CONFIG = [
  { color: "#60a5fa", size: 14, left: "8%", top: "18%", xMove: 40, yMove: -60, dur: 5 },
  { color: "#a78bfa", size: 10, left: "22%", top: "55%", xMove: -30, yMove: -70, dur: 6 },
  { color: "#f472b6", size: 12, left: "68%", top: "12%", xMove: 50, yMove: -40, dur: 4.5 },
  { color: "#34d399", size: 8, left: "82%", top: "42%", xMove: -40, yMove: -50, dur: 7 },
  { color: "#fb923c", size: 11, left: "48%", top: "72%", xMove: 35, yMove: -55, dur: 5.5 },
  { color: "#38bdf8", size: 10, left: "12%", top: "78%", xMove: -25, yMove: -65, dur: 6.5 },
  { color: "#818cf8", size: 16, left: "58%", top: "50%", xMove: 45, yMove: -35, dur: 4 },
  { color: "#c084fc", size: 9, left: "38%", top: "28%", xMove: -35, yMove: -45, dur: 7.5 },
  { color: "#67e8f9", size: 12, left: "88%", top: "68%", xMove: 30, yMove: -50, dur: 5.8 },
  { color: "#fbbf24", size: 13, left: "32%", top: "8%", xMove: -20, yMove: -70, dur: 6.2 },
  { color: "#86efac", size: 8, left: "76%", top: "82%", xMove: 50, yMove: -30, dur: 5 },
  { color: "#f9a8d4", size: 10, left: "4%", top: "48%", xMove: -45, yMove: -55, dur: 8 },
  { color: "#93c5fd", size: 18, left: "52%", top: "38%", xMove: 0, yMove: -25, dur: 9 },
  { color: "#c4b5fd", size: 15, left: "18%", top: "32%", xMove: 0, yMove: -30, dur: 10 },
  { color: "#fda4af", size: 12, left: "72%", top: "22%", xMove: 0, yMove: -20, dur: 8 },
];

const HeroParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = container.querySelectorAll(".gsap-particle");
    particles.forEach((particle, i) => {
      const config = PARTICLE_CONFIG[i];
      const tween = gsap.to(particle, {
        x: config.xMove,
        y: config.yMove,
        scale: 1.4,
        opacity: 0.9,
        duration: config.dur / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.3,
      });
      tweensRef.current.push(tween);
    });

    // Pause animations when hero is scrolled off-screen (saves CPU)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tweensRef.current.forEach((t) => t.play());
        } else {
          tweensRef.current.forEach((t) => t.pause());
        }
      },
      { threshold: 0.05 },
    );
    if (container) observer.observe(container);

    return () => {
      observer.disconnect();
      tweensRef.current.forEach((t) => t.kill());
      tweensRef.current = [];
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
      {PARTICLE_CONFIG.map((p, i) => (
        <span
          key={i}
          className="gsap-particle"
          style={{
            position: "absolute",
            borderRadius: "9999px",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: 0.3,
            background: `radial-gradient(circle, ${p.color}, ${p.color}88, transparent)`,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}, 0 0 ${p.size * 8}px ${p.color}44`,
          }}
        />
      ))}
    </div>
  );
};

const HeroSectionComponent = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const nextStarId = useRef(1);
  const starTimers = useRef<number[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);

  // GSAP badge: merge all 3 tweens into a single timeline (less overhead)
  useGSAP(() => {
    const badge = badgeRef.current;
    if (!badge) return;

    const tl = gsap.timeline({ repeat: -1 });

    // Floating side-to-side
    gsap.to(badge, {
      x: 10,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Color-cycling border + glow in one tween
    tl.to(badge, {
      duration: 1,
      borderColor: "rgba(167, 139, 250, 0.8)",
      boxShadow: "0 0 16px rgba(139,92,246,0.45), 0 0 40px rgba(139,92,246,0.2)",
      ease: "none",
    })
    .to(badge, {
      duration: 1,
      borderColor: "rgba(244, 114, 182, 0.8)",
      boxShadow: "0 0 16px rgba(244,114,182,0.45), 0 0 40px rgba(244,114,182,0.2)",
      ease: "none",
    })
    .to(badge, {
      duration: 1,
      borderColor: "rgba(52, 211, 153, 0.8)",
      boxShadow: "0 0 8px rgba(52,211,153,0.3), 0 0 20px rgba(52,211,153,0.1)",
      ease: "none",
    })
    .to(badge, {
      duration: 1,
      borderColor: "rgba(59, 130, 246, 0.8)",
      boxShadow: "0 0 16px rgba(59,130,246,0.45), 0 0 40px rgba(139,92,246,0.2)",
      ease: "none",
    });
  });

  // Throttled star cursor: only updates state at max 30fps via rAF flag
  const rafPendingRef = useRef(false);
  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (rafPendingRef.current) return; // skip if a frame is already pending
    rafPendingRef.current = true;
    requestAnimationFrame(() => {
      rafPendingRef.current = false;
      const rect = event.currentTarget?.getBoundingClientRect();
      if (!rect) return;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = nextStarId.current++;
      const size = 8 + Math.floor(Math.random() * 8);

      setStars((prev) => {
        // Cap at 8 stars max (was 18) to keep DOM lean
        const next = [...prev, { id, x, y, size }];
        return next.slice(-8);
      });

      const timerId = window.setTimeout(() => {
        setStars((prev) => prev.filter((star) => star.id !== id));
        starTimers.current = starTimers.current.filter((timer) => timer !== timerId);
      }, 650);
      starTimers.current.push(timerId);
    });
  }, []);

  useEffect(() => {
    return () => {
      starTimers.current.forEach((timerId) => window.clearTimeout(timerId));
      starTimers.current = [];
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      {/* ── Ambient mesh gradient background ─────────────────────────────── */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "-15%", left: "-10%",
            width: "55vw", height: "55vw",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)",
            animation: "float-slow 12s ease-in-out infinite",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "30%", right: "-15%",
            width: "45vw", height: "45vw",
            background: "radial-gradient(ellipse, rgba(168,85,247,0.14) 0%, transparent 70%)",
            animation: "float-slow 15s ease-in-out infinite reverse",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            bottom: "0", left: "35%",
            width: "40vw", height: "40vw",
            background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
            animation: "float-slow 10s ease-in-out infinite 2s",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none dark:opacity-100 opacity-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <HeroParticles />

      <div className="relative overflow-hidden" onMouseMove={handleMouseMove}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">

          {/* ── Live badge ──────────────────────────────────────────────── */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/70 border border-blue-400/40 dark:border-indigo-500/40 backdrop-blur-xl mb-10 shadow-lg shadow-blue-500/10 cursor-pointer transition-all duration-300"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
              ✦ StorySparkAI v2.0 is live
            </span>
            <span className="hidden sm:flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-500/15 px-2.5 py-1 rounded-full border border-indigo-200/50 dark:border-indigo-500/30">
              NEW
            </span>
          </div>

          {/* ── Hero heading ─────────────────────────────────────────────── */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="block text-slate-900 dark:text-white mb-1">Ignite Your</span>
            <span className="hero-gradient-text pb-2 block">
              Imagination
            </span>
            <span className="block text-slate-700 dark:text-slate-300 text-4xl sm:text-5xl lg:text-6xl font-bold mt-1">
              with AI Storytelling
            </span>
          </h1>

          {/* ── Subtitle ─────────────────────────────────────────────────── */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-8 transition-colors duration-300">
            Generate multiple story variations from a single prompt.
            Remix, translate, collaborate — all powered by{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Google Gemini</span>.
          </p>
          {/* ── CTA Buttons ──────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link to="/stories">
              <button className="group relative px-8 py-4 rounded-2xl font-bold text-white text-base overflow-hidden shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center gap-2.5 cursor-pointer">
                <span
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed, #6366f1)",
                    backgroundSize: "200% 200%",
                    animation: "border-gradient 4s ease infinite",
                  }}
                />
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
                <i className="fa fa-wand-magic-sparkles relative z-10" />
                <span className="relative z-10">Start Writing Free</span>
                <span className="relative z-10 text-indigo-200 group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </Link>

            <Link to="/collab">
              <button className="px-8 py-4 rounded-2xl font-bold text-slate-700 dark:text-white text-base bg-white/90 dark:bg-white/8 backdrop-blur-xl border border-slate-200/80 dark:border-white/12 shadow-lg hover:bg-white dark:hover:bg-white/14 hover:border-indigo-300/60 dark:hover:border-indigo-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2.5 cursor-pointer">
                <span>✍️</span>
                <span>Collab Room</span>
              </button>
            </Link>
          </div>

          {/* ── Stats Row ────────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { value: "50K+",  label: "Stories Generated" },
              { value: "12",    label: "Languages" },
              { value: "Free",  label: "To Get Started" },
              { value: "5",     label: "AI Writing Modes" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span
                  className="text-2xl sm:text-3xl font-extrabold"
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cursor stars */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="hero-cursor-stars absolute inset-0" aria-hidden="true">
            {stars.map((star) => (
              <span
                key={star.id}
                className={`hero-cursor-star ${star.size > 12 ? "hero-cursor-star-large" : ""}`}
                style={{ left: star.x, top: star.y, width: star.size, height: star.size }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Feature Cards ─────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard feature={feature} key={feature.title} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionComponent;
