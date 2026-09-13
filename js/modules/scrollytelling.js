/* ==========================================================================
   SCROLLYTELLING CANVAS IMAGE SEQUENCE MODULE
   Bahagia Studio — js/modules/scrollytelling.js
   ========================================================================== */

export function initScrollytelling() {

  /* ── DOM References ─────────────────────────────────────────────────── */
  const section = document.getElementById('scrollytelling');
  const canvas = document.getElementById('seq-canvas');
  const preloadOverlay = document.getElementById('seqPreloadOverlay');
  const preloadBar = document.getElementById('seqPreloadBar');
  const preloadLabel = document.getElementById('seqPreloadLabel');
  const ctaBtn = document.getElementById('seq-cta-btn');
  const dotsWrapper = document.querySelector('.seq-progress-dots');
  const dots = document.querySelectorAll('.seq-dot');
  const panel1 = document.getElementById('seq-panel-1');
  const panel2 = document.getElementById('seq-panel-2');
  const panel3 = document.getElementById('seq-panel-3');

  // Guard: exit if section doesn't exist on this page
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');

  /* ── Config ─────────────────────────────────────────────────────────── */
  const TOTAL_FRAMES = 150;
  const FOLDER = 'assets/images/Comp2_full150_jpg/';
  const FILE_PREFIX = 'frame_';

  // Checkpoints presisi untuk 150 frame berdasarkan step scroll:
  // Scroll 1 (Step 0): Hilangkan gradient pembatas (Frame 0)
  // Scroll 2 (Step 1): Frame 0 -> 4
  // Scroll 3 (Step 2): Frame 4 -> 47
  // Scroll 4 (Step 3): Frame 47 -> 149 (Frame Terakhir + Teks & CTA)
  // Scroll 5 (Step 4): Bergulir halus ke section Footer (#contact)
  const CHECKPOINT_TARGETS = [0, 4, 47, 149, 149];

  /* ── Durasi & Kecepatan Animasi (Bisa Disesuaikan) ───────────────────────
     - ANIMATION_DURATION: Durasi transisi frame (dalam detik). 
       Bisa dinaikkan (misal 2.2 atau 2.5) agar lebih lambat & sinematik.
     - EASE_TYPE: Easing curves ('power2.out', 'power3.out', 'cubic-bezier', dsb).
  ────────────────────────────────────────────────────────────────────────── */
  const ANIMATION_DURATION = 2.2; // Durasi animasi dari satu checkpoint ke checkpoint berikutnya (dalam detik)
  const EASE_TYPE = 'power2.out'; // Kurva animasi sinematik yang mulus

  /* ── State ──────────────────────────────────────────────────────────── */
  const frames = new Array(TOTAL_FRAMES);
  let currentFrame = 0;
  let ctaRevealed = false;
  const renderObj = { frame: 0 };
  let frameTween = null;
  let isAnimating = false;

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function padIndex(n) {
    return String(n).padStart(3, '0');
  }

  function frameSrc(index) {
    return `${FOLDER}${FILE_PREFIX}${padIndex(index)}.jpg`;
  }

  /* ── Canvas Resize ───────────────────────────────────────────────────── */
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (frames[currentFrame] && frames[currentFrame].complete) {
      drawFrame(currentFrame);
    }
  }

  /* ── Canvas Draw (object-fit: cover logic) ───────────────────────────── */
  function drawFrame(index) {
    const img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const dx = (cw - iw * scale) / 2;
    const dy = (ch - ih * scale) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, iw * scale, ih * scale);
  }

  /* ── Immediate Preloader ─────────────────────────────────────────────── */
  function preloadAllFrames() {
    return new Promise((resolve) => {
      let loaded = 0;

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = frameSrc(i);
        frames[i] = img;

        img.onload = img.onerror = () => {
          loaded++;
          const pct = Math.round((loaded / TOTAL_FRAMES) * 100);

          if (preloadBar) preloadBar.style.width = pct + '%';
          if (preloadLabel) preloadLabel.textContent = `Memuat animasi… ${pct}%`;

          if (loaded === TOTAL_FRAMES) {
            resolve();
          }
        };
      }
    });
  }

  /* ── Panel Visibility (Hanya muncul di Scroll ke-4 / Step 3) ──────────── */
  function updatePanels(stepIndex) {
    // Panel 3 (Teks Overlay) hanya aktif pada Scroll ke-4 (Step 3)
    const inS4 = stepIndex >= 3;

    panel1 && panel1.classList.toggle('is-active', false);
    panel2 && panel2.classList.toggle('is-active', false);
    panel3 && panel3.classList.toggle('is-active', inS4);
  }

  /* ── Progress Dots ───────────────────────────────────────────────────── */
  function updateDots(stepIndex) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === Math.min(stepIndex, dots.length - 1));
    });
  }

  /* ── CTA Reveal (Hanya di scroll ke-4 / Step 3) ─────────────────────── */
  function updateCTA(stepIndex) {
    if (!ctaBtn) return;

    if (stepIndex >= 3 && !ctaRevealed) {
      ctaRevealed = true;
      gsap.to(ctaBtn, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power2.out',
      });
    } else if (stepIndex < 3 && ctaRevealed) {
      ctaRevealed = false;
      gsap.to(ctaBtn, {
        opacity: 0,
        y: 20,
        duration: 0.35,
        ease: 'power2.in',
      });
    }
  }

  const FPS_STANDARD = 24; // Standar 24 FPS sinematik

  /* ── Animate Frame Smoothly to Target Checkpoint ────────────────────── */
  function animateFrameTo(targetFrame, onCompleteCallback) {
    if (frameTween) frameTween.kill();
    isAnimating = true;

    // Hitung selisih frame yang akan dijalankan
    const frameDistance = Math.abs(targetFrame - currentFrame);

    // Perhitungan durasi presisi berdasarkan aturan 24 FPS:
    // Khusus 4 frame (Step 1): 4 / 24 = 0.167 detik (Sesuai FPS riil, sangat smooth & tidak patah)
    let calculatedDuration = frameDistance / FPS_STANDARD;
    
    // Beri batas durasi sinematik yang seimbang
    calculatedDuration = Math.max(0.16, Math.min(calculatedDuration, 1.8));

    frameTween = gsap.to(renderObj, {
      frame: targetFrame,
      duration: calculatedDuration,
      ease: 'power1.out',
      onUpdate: () => {
        const newFrame = Math.round(renderObj.frame);
        if (newFrame !== currentFrame) {
          currentFrame = newFrame;
          drawFrame(currentFrame);
        }
      },
      onComplete: () => {
        isAnimating = false;
        if (onCompleteCallback) onCompleteCallback();
      }
    });
  }

  /* ── Main Init (runs immediately after preload) ─────────────────────── */
  function initAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    drawFrame(0);
    canvas.classList.add('is-ready');

    /* ── ScrollTrigger Snap ke 5 Checkpoint Presisi [0, 0.25, 0.5, 0.75, 1] ──── */
    let lastStep = -1;

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      // Snap tepat ke 5 posisi checkpoint asli (0, 0.25, 0.5, 0.75, 1)
      snap: {
        snapTo: [0, 0.25, 0.5, 0.75, 1],
        duration: { min: 0.4, max: 0.9 },
        delay: 0.1,
        ease: 'power2.inOut'
      },
      onUpdate: (self) => {
        const progress = self.progress;
        let step = 0;

        if (progress >= 0.92) {
          step = 4; // Scroll ke-5 -> Footer
        } else if (progress >= 0.68) {
          step = 3; // Scroll ke-4 -> Frame 149 (Klimaks + Teks & CTA)
        } else if (progress >= 0.42) {
          step = 2; // Scroll ke-3 -> Frame 47
        } else if (progress >= 0.18) {
          step = 1; // Scroll ke-2 -> Frame 4 (Khusus 4 frame 0.167s)
        } else {
          step = 0; // Scroll ke-1 -> Frame 0
        }

        // Hitung ulang hanya jika berpindah step
        if (step !== lastStep) {
          lastStep = step;

          // Gradasi pembatas top fade out jika step >= 1
          if (step >= 1) {
            section.classList.add('hide-top-gradient');
          } else {
            section.classList.remove('hide-top-gradient');
          }

          // Scroll ke-5 (Step 4): Meluncur halus ke footer #contact
          if (step === 4) {
            const footer = document.getElementById('contact');
            if (footer) footer.scrollIntoView({ behavior: 'smooth' });
          }

          // Jalankan animasi ke target frame checkpoint persis dengan durasi 24 FPS
          const targetFrame = CHECKPOINT_TARGETS[step];
          animateFrameTo(targetFrame);

          updatePanels(step);
          updateDots(step);
          updateCTA(step);
        }
      },
      onEnter: () => {
        dotsWrapper && dotsWrapper.classList.add('is-visible');
      },
      onLeave: () => {
        dotsWrapper && dotsWrapper.classList.remove('is-visible');
      },
      onEnterBack: () => {
        dotsWrapper && dotsWrapper.classList.add('is-visible');
      },
      onLeaveBack: () => {
        dotsWrapper && dotsWrapper.classList.remove('is-visible');
      },
    });

    /* ── Canvas z-index management ───────────────────────────────────── */
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => {
        canvas.style.zIndex = '-1';
      },
      onEnterBack: () => {
        canvas.style.zIndex = '1';
      },
      onToggle: (self) => {
        canvas.style.zIndex = self.isActive ? '1' : '-1';
      },
    });

    updatePanels(0);
    updateDots(0);
  }

  /* ── Boot Sequence: Immediate Load on Page Startup ──────────────────── */
  // Preload gambar langsung saat awal halaman di-load tanpa menunggu scroll
  preloadAllFrames().then(() => {
    if (preloadOverlay) {
      preloadOverlay.classList.add('is-hidden');
    }
    setTimeout(initAnimation, 300);
  });
}
