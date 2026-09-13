/* ==========================================================================
   BAHAGIA STUDIO - MAIN JS ENTRY POINT
   ========================================================================== */

import { initNavbar } from './modules/navbar.js';
import { initVideoModal } from './modules/video-modal.js';
import { initScrollytelling } from './modules/scrollytelling.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('✨ Bahagia Studio Luxury Web initialized.');
  
  initNavbar();
  initVideoModal();
  initScrollytelling();
  initSmoothScroll();
});
