/* ==========================================================================
   VIDEO MODAL LIGHTBOX JS MODULE
   ========================================================================== */

export function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const modalContainer = document.getElementById('videoModalContainer');
  const closeBtn = document.getElementById('videoModalClose');

  if (!modal || !modalContainer) return;

  // Open modal helper function
  window.openVideoModal = function(videoSrc, videoTitle = 'Bahagia Studio Film') {
    // Pause all background videos to free up browser network & video decoders
    document.querySelectorAll('video').forEach(v => {
      if (!v.closest('#videoModalContainer')) {
        v.pause();
      }
    });

    const isDirectVideo = videoSrc.match(/\.(mp4|webm|ogg)($|\?)/i);

    if (isDirectVideo) {
      modalContainer.innerHTML = `
        <div class="video-loader-spinner" id="videoModalSpinner">
          <div class="spinner-circle"></div>
          <span>Memuat Video...</span>
        </div>
        <video 
          src="${encodeURI(videoSrc)}" 
          preload="auto"
          controls 
          autoplay 
          playsinline
          style="width:100%; height:100%; max-height:85vh; object-fit:contain; background:#000; border-radius:12px; outline:none; display:none;">
        </video>
      `;

      const videoEl = modalContainer.querySelector('video');
      const spinnerEl = modalContainer.querySelector('#videoModalSpinner');

      if (videoEl) {
        const showVideo = () => {
          if (spinnerEl) spinnerEl.style.display = 'none';
          videoEl.style.display = 'block';
        };

        videoEl.addEventListener('playing', showVideo);
        videoEl.addEventListener('canplay', showVideo);
        videoEl.addEventListener('loadeddata', showVideo);

        // Fallback display video after short timeout if events fired early
        setTimeout(showVideo, 600);

        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
      }
    } else {
      modalContainer.innerHTML = `
        <iframe 
          width="100%" 
          height="100%" 
          src="${videoSrc}" 
          title="${videoTitle}"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Event delegation to catch clicks on any video trigger (static or dynamically added)
  document.addEventListener('click', (e) => {
    const targetCard = e.target.closest('[data-video], .motion-card, .cms-video-container, .porto-card');
    if (!targetCard) return;

    const videoSrc = targetCard.dataset.video;
    if (!videoSrc) return;

    e.preventDefault();
    const videoTitle = targetCard.dataset.title || 'Bahagia Studio Film';
    window.openVideoModal(videoSrc, videoTitle);
  });

  // Close modal function
  const closeModal = () => {
    modal.classList.remove('active');
    modalContainer.innerHTML = '';
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC key listener to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
