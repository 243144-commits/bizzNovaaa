import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Lightbulb, Target, TrendingUp, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useApp();
  const { user } = useAuth();

  // Ref for the scroll container to track progress
  const heroRef = useRef<HTMLDivElement>(null);

  // Track scroll progress for the hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  // Frames and Audio setup
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [audioDuration, setAudioDuration] = useState(10); // fallback

  const totalFrames = 300;
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(6, '0');
      img.src = `/frames/frame_${paddedIndex}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Handle scroll update for canvas and audio
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // 1. Draw Canvas Frame
      if (imagesLoaded && canvasRef.current && imagesRef.current.length > 0) {
        const frameIndex = Math.min(
          totalFrames - 1,
          Math.floor(latest * totalFrames)
        );
        const ctx = canvasRef.current.getContext('2d');
        const img = imagesRef.current[frameIndex];

        if (ctx && img && img.complete) {
          // Object-fit: cover implementation for canvas
          const canvas = canvasRef.current;
          const cw = canvas.width;
          const ch = canvas.height;
          const iw = img.width;
          const ih = img.height;

          const scale = Math.max(cw / iw, ch / ih);
          const x = (cw / 2) - (iw / 2) * scale;
          const y = (ch / 2) - (ih / 2) * scale;

          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(img, x, y, iw * scale, ih * scale);
        }
      }

      // 2. Play audio if not muted (sync logic removed to prevent fast skipping)
      if (audioRef.current && !isMuted) {
        // The audio will just play naturally via the scroll event listener below
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, imagesLoaded, isMuted]);

  // Audio play/pause handling based on scroll speed
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (audioRef.current && !isMuted) {
        const currentScrollY = window.scrollY;

        // Play audio if scrolling down
        if (currentScrollY > lastScrollY) {
          audioRef.current.play().catch(() => { });
        } else {
          // Pause if scrolling up to prevent weird backwards playback logic
          audioRef.current.pause();
        }
        lastScrollY = currentScrollY;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          audioRef.current?.pause();
        }, 150);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;

        // Force a redraw of the current frame
        const currentProgress = scrollYProgress.get();
        const frameIndex = Math.min(totalFrames - 1, Math.floor(currentProgress * totalFrames));
        const ctx = canvasRef.current.getContext('2d');
        const img = imagesRef.current[frameIndex];

        if (ctx && img && img.complete) {
          const cw = canvasRef.current.width;
          const ch = canvasRef.current.height;
          const iw = img.width;
          const ih = img.height;
          const scale = Math.max(cw / iw, ch / ih);
          const x = (cw / 2) - (iw / 2) * scale;
          const y = (ch / 2) - (ih / 2) * scale;
          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(img, x, y, iw * scale, ih * scale);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Init size
    return () => window.removeEventListener('resize', handleResize);
  }, [scrollYProgress]);

  // Map scroll progress (0 to 1) to a 10-second-like visual sequence.
  // We compressed the sequence so the text comes in quickly and leaves quickly.

  // Sequence 1: Badge fades in and slides up (0.0 to 0.03)
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.01, 0.03], [0, 1, 1]);
  const badgeY = useTransform(scrollYProgress, [0, 0.03], [30, 0]);

  // Sequence 2: Heading scales and fades in (0.02 to 0.06)
  const headingOpacity = useTransform(scrollYProgress, [0.02, 0.04, 0.06], [0, 1, 1]);
  const headingScale = useTransform(scrollYProgress, [0.02, 0.06], [0.9, 1]);

  // Sequence 3: Description fades in (0.04 to 0.08)
  const descOpacity = useTransform(scrollYProgress, [0.04, 0.06, 0.08], [0, 1, 1]);
  const descY = useTransform(scrollYProgress, [0.04, 0.08], [20, 0]);

  // Sequence 4: Buttons fade in (0.06 to 0.10)
  const buttonsOpacity = useTransform(scrollYProgress, [0.06, 0.08, 0.10], [0, 1, 1]);
  const buttonsY = useTransform(scrollYProgress, [0.06, 0.10], [20, 0]);

  // Sequence 5: Entire hero zooms and fades out to transition out (0.15 to 0.25)
  const heroOpacity = useTransform(scrollYProgress, [0.15, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0.15, 0.25], [1, 1.05]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 relative">

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/voiceover.mp3"
        preload="auto"
        onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
      />

      {/* Floating Audio Control */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleMute}
          className="p-4 bg-white/90 backdrop-blur-md text-slate-800 rounded-full shadow-lg border border-slate-200 hover:bg-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
          aria-label={isMuted ? "Enable Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto bg-gradient-to-b from-black/80 to-transparent border-none">
        <div className="text-xl font-bold tracking-tight text-white">
          BizzNova
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Home</a>
          <a href="#features" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Features</a>
          <a href="#about" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">About</a>
          {user ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-sm font-medium text-cyan-300 hover:text-white transition-colors cursor-pointer"
            >
              Open Command OS
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="text-sm font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              Log in
            </button>
          )}
        </div>
        <button
          onClick={() => setActiveTab(user ? 'dashboard' : 'signup')}
          className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
        >
          {user ? 'Go to Command OS' : 'Get Started'}
        </button>
      </nav>

      {/* HERO SECTION - Scroll Animation Container */}
      {/* 500vh ensures a long scroll area to simulate a "10-second" scroll journey */}
      <section id="home" ref={heroRef} className="relative h-[500vh] bg-transparent">

        {/* Pinned/Sticky Container */}
        <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden bg-black">

          {/* Background Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />

          {/* Subtle Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40" />

          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto w-full"
          >

            <motion.div
              style={{ opacity: badgeOpacity, y: badgeY }}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-blue-400/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Startup Assistant
            </motion.div>

            <motion.h1
              style={{ opacity: headingOpacity, scale: headingScale }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 drop-shadow-lg"
            >
              Turn Your Startup Idea <br className="hidden md:block" /> Into Reality.
            </motion.h1>

            <motion.p
              style={{ opacity: descOpacity, y: descY }}
              className="text-lg text-slate-200 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow"
            >
              BizzNova helps you organize your startup ideas, explore new opportunities, and plan your next steps with intelligent, data-driven guidance.
            </motion.p>

            <motion.div
              style={{ opacity: buttonsOpacity, y: buttonsY }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
            >
              <button
                onClick={() => setActiveTab(user ? 'dashboard' : 'signup')}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {user ? 'Go to Command OS' : 'Get Started'}
              </button>
              <button
                onClick={() => setActiveTab('idea-analyzer')}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 text-base font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Explore Features
              </button>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 bg-slate-50/50 border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to launch</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Smart Idea Discovery</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Validate and refine your concepts with AI-driven insights to ensure market viability.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Startup Planning</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Build structured roadmaps, define customer personas, and establish a clear business model.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">AI-Powered Guidance</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Get step-by-step assistance in navigating complex startup challenges and financial modeling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about" className="py-8 px-6 border-t border-slate-200 text-center relative z-10 bg-slate-100">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-lg font-bold text-slate-900">BizzNova</div>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} BizzNova. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
