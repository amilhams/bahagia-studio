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
  // Scroll 1 (Step 0): Frame 0
  // Scroll 2 (Step 1): Frame 4
  // Scroll 3 (Step 2): Frame 47
  // Scroll 4 (Step 3): Frame 149 (Frame Terakhir + Teks & CTA)
  // Scroll 5 (Step 4): Meluncur ke Footer
  const CHECKPOINT_TARGETS = [0, 4, 47, 149, 149];

  const ANIMATION_DURATION = 2.2;
  const EASE_TYPE = 'power2.out';

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
    drawFrame(currentFrame);
  }

  /* ── Canvas Draw (object-fit: cover logic + fallback) ───────────────────── */
  function drawFrame(index) {
    let img = frames[index];

    // Fallback: Jika frame yang diminta belum selesai diload oleh browser,
    // cari frame terdekat yang sudah ter-load agar canvas TIDAK BLANK.
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Cari ke belakang dulu
      for (let i = index - 1; i >= 0; i--) {
        if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) {
          img = frames[i];
          break;
        }
      }
      // Jika belum ketemu, cari ke depan
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = index + 1; i < TOTAL_FRAMES; i++) {
          if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) {
            img = frames[i];
            break;
          }
        }
      }
    }

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

  /* ── Progressive Preloader: muat frame 0 dulu, sisanya di background ── */
  function preloadFirstFrame() {
    return new Promise((resolve) => {
      const img0 = new Image();
      img0.decoding = 'async';
      img0.src = frameSrc(0);
      frames[0] = img0;
      img0.onload = img0.onerror = () => resolve();
    });
  }

  function preloadRemainingFrames() {
    const BATCH_SIZE = 12;
    let loaded = 1;

    function loadChunk(startIndex) {
      const endIndex = Math.min(TOTAL_FRAMES, startIndex + BATCH_SIZE);

      for (let i = startIndex; i < endIndex; i++) {
        if (frames[i]) {
          loaded++;
          continue;
        }

        const img = new Image();
        img.decoding = 'async';
        img.loading = 'lazy';
        img.src = frameSrc(i);
        frames[i] = img;

        img.onload = img.onerror = () => {
          loaded++;
          const pct = Math.round((loaded / TOTAL_FRAMES) * 100);

          if (preloadBar) preloadBar.style.width = pct + '%';
          if (preloadLabel) preloadLabel.textContent = `Memuat animasi… ${pct}%`;

          // Jika frame saat ini sedang perlu di-render ulang
          if (Math.round(renderObj.frame) === i) {
            drawFrame(i);
          }

          if (loaded >= TOTAL_FRAMES) {
            if (preloadOverlay) preloadOverlay.classList.add('is-hidden');
          }
        };
      }

      if (endIndex < TOTAL_FRAMES) {
        requestAnimationFrame(() => loadChunk(endIndex));
      }
    }

    loadChunk(1);
  }

  /* ── Panel Visibility ────────────────────────────────────────────────── */
  function updatePanels(stepIndex) {
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

  /* ── CTA Reveal ─────────────────────────────────────────────────────── */
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

  const FPS_STANDARD = 24;

  /* ── Animate Frame Smoothly to Target Checkpoint ────────────────────── */
  function animateFrameTo(targetFrame, onCompleteCallback) {
    if (frameTween) frameTween.kill();
    isAnimating = true;

    const frameDistance = Math.abs(targetFrame - currentFrame);
    let calculatedDuration = frameDistance / FPS_STANDARD;
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

  /* ── Main Init ───────────────────────────────────────────────────────── */
  function initAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    drawFrame(0);
    canvas.classList.add('is-ready');

    let lastStep = -1;

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
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
          step = 4;
        } else if (progress >= 0.68) {
          step = 3;
        } else if (progress >= 0.42) {
          step = 2;
        } else if (progress >= 0.18) {
          step = 1;
        } else {
          step = 0;
        }

        if (step !== lastStep) {
          lastStep = step;

          if (step >= 1) {
            section.classList.add('hide-top-gradient');
          } else {
            section.classList.remove('hide-top-gradient');
          }

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
    ScrollTrigger.refresh();
  }

  /* ── Boot Sequence: Non-blocking Immediate Load ─────────────────────── */
  preloadFirstFrame().then(() => {
    initAnimation();

    if (preloadOverlay) {
      setTimeout(() => {
        preloadOverlay.classList.add('is-hidden');
      }, 600);
    }

    preloadRemainingFrames();
  });
}
