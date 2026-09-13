/**
 * BAHAGIA STUDIO - PORTFOLIO SHOWCASE PAGE MODULE
 * Handles category switching, media type filtering, batch loading with skeleton shimmer,
 * autoplay videos without controls, and custom independent scroll behavior.
 */

document.addEventListener('DOMContentLoaded', () => {
  const showcaseRight = document.querySelector('.porto-showcase-right');
  const sidebarLeft = document.querySelector('.porto-sidebar-left');
  const gridContainer = document.getElementById('portoGrid');
  const loadStatus = document.getElementById('loadStatus');
  const menuButtons = document.querySelectorAll('.porto-menu-item');
  const filterButtons = document.querySelectorAll('.porto-filter-btn');
  const footerSection = document.getElementById('contact');

  if (!gridContainer || !showcaseRight) return;

  // --- Portfolio Data Manifest ---
  const portfolioData = {
    wedding: {
      photo: [
        "assets/images/portofolio/wedding/nita/photo/DSC00007.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00009.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00021.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00033.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00041.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00048.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00067.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00083.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00102.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00120.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00133.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00168.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00173.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00175.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00182.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00186.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00208.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00215fix.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00226.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00230.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00231.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00234.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00268.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00275.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00333.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00827.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00833.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00837.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00843.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00847.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC00874.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09630.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09639.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09652.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09655.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09662 fix.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09668.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09671.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09675.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09677.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09767.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09779.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09874.jpg",
        "assets/images/portofolio/wedding/nita/photo/DSC09974.jpg"
      ],
      video: [
        {
          url: "https://www.youtube.com/embed/axC9tNMVDxI?autoplay=1",
          poster: "assets/images/portofolio/wedding/nita/photo/DSC00067.jpg",
          title: "Nita & Dhani - Wedding Film"
        }
      ],
      wcc: []
    },
    family: {
      photo: [
        "assets/images/portofolio/family/photo/IMG_2406.jpg",
        "assets/images/portofolio/family/photo/IMG_2504.jpg",
        "assets/images/portofolio/family/photo/IMG_2506.jpg",
        "assets/images/portofolio/family/photo/IMG_2525.jpg",
        "assets/images/portofolio/family/photo/IMG_2527.jpg",
        "assets/images/portofolio/family/photo/IMG_2548.jpg",
        "assets/images/portofolio/family/photo/IMG_2559.jpg",
        "assets/images/portofolio/family/photo/IMG_2565.jpg",
        "assets/images/portofolio/family/photo/IMG_2571.jpg",
        "assets/images/portofolio/family/photo/IMG_2684.jpg",
        "assets/images/portofolio/family/photo/IMG_2698.jpg",
        "assets/images/portofolio/family/photo/IMG_2714.jpg",
        "assets/images/portofolio/family/photo/IMG_2718.jpg",
        "assets/images/portofolio/family/photo/IMG_2738.jpg",
        "assets/images/portofolio/family/photo/IMG_2855.jpg",
        "assets/images/portofolio/family/photo/IMG_2861.jpg",
        "assets/images/portofolio/family/photo/IMG_2864.jpg",
        "assets/images/portofolio/family/photo/IMG_2870.jpg",
        "assets/images/portofolio/family/photo/IMG_2902.jpg",
        "assets/images/portofolio/family/photo/IMG_2924.jpg",
        "assets/images/portofolio/family/photo/IMG_2925.jpg",
        "assets/images/portofolio/family/photo/IMG_2926.jpg",
        "assets/images/portofolio/family/photo/IMG_2944.jpg",
        "assets/images/portofolio/family/photo/IMG_2948.jpg",
        "assets/images/portofolio/family/photo/IMG_2966.jpg",
        "assets/images/portofolio/family/photo/IMG_3205.jpg",
        "assets/images/portofolio/family/photo/IMG_3215.jpg",
        "assets/images/portofolio/family/photo/IMG_3233.jpg",
        "assets/images/portofolio/family/photo/IMG_3246.jpg",
        "assets/images/portofolio/family/photo/IMG_3265.jpg",
        "assets/images/portofolio/family/photo/IMG_3268.jpg",
        "assets/images/portofolio/family/photo/IMG_3280.jpg",
        "assets/images/portofolio/family/photo/IMG_3294.jpg",
        "assets/images/portofolio/family/photo/IMG_3297.jpg"
      ],
      video: [],
      wcc: []
    },
    couple: {
      photo: [
        "assets/images/portofolio/couple/photo/bahagiafix-1.jpg",
        "assets/images/portofolio/couple/photo/IMG_7985.JPG",
        "assets/images/portofolio/couple/photo/IMG_8050.jpg",
        "assets/images/portofolio/couple/photo/IMG_8089 (1).JPG",
        "assets/images/portofolio/couple/photo/IMG_8089.JPG",
        "assets/images/portofolio/couple/photo/IMG_8187.jpg",
        "assets/images/portofolio/couple/photo/IMG_8188.jpg",
        "assets/images/portofolio/couple/photo/IMG_8202.JPG",
        "assets/images/portofolio/couple/photo/IMG_8203.jpg",
        "assets/images/portofolio/couple/photo/IMG_8205.JPG",
        "assets/images/portofolio/couple/photo/IMG_8212.jpg"
      ],
      video: [
        {
          url: "https://www.youtube.com/embed/2N9vTwB-9sE?autoplay=1",
          poster: "assets/images/portofolio/couple/photo/IMG_8203.jpg",
          title: "Couple Stories in Motion"
        }
      ],
      wcc: []
    }
  };

  // --- State Variables ---
  let activeCategory = 'wedding';
  let activeFilter = 'photo'; // default active filter as shown in reference
  let currentMediaList = [];
  let loadedIndex = 0;
  const BATCH_SIZE = 8;
  let isLoadingBatch = false;

  // --- Functions ---
  function getFilteredItems() {
    const categoryObj = portfolioData[activeCategory] || {};
    let items = [];

    const mapVideo = (v) => typeof v === 'string' 
      ? { type: 'video', url: v, poster: 'assets/images/portofolio/wedding/nita/photo/DSC00067.jpg', title: 'Bahagia Studio Film' }
      : { type: 'video', ...v };

    if (activeFilter === 'photo') {
      items = (categoryObj.photo || []).map(url => ({ type: 'photo', url }));
    } else if (activeFilter === 'video') {
      items = (categoryObj.video || []).map(mapVideo);
    } else if (activeFilter === 'wcc') {
      items = (categoryObj.wcc || []).map(url => ({ type: 'wcc', url }));
    } else {
      // All
      const photos = (categoryObj.photo || []).map(url => ({ type: 'photo', url }));
      const videos = (categoryObj.video || []).map(mapVideo);
      const wccs = (categoryObj.wcc || []).map(url => ({ type: 'wcc', url }));
      items = [...photos, ...videos, ...wccs];
    }
    return items;
  }

  function resetAndRender() {
    gridContainer.innerHTML = '';
    currentMediaList = getFilteredItems();
    loadedIndex = 0;

    if (currentMediaList.length === 0) {
      gridContainer.innerHTML = `<div class="porto-load-status">Belum ada konten untuk kategori ini.</div>`;
      if (loadStatus) loadStatus.textContent = '';
      return;
    }

    renderNextBatch();
  }

  function renderNextBatch() {
    if (isLoadingBatch || loadedIndex >= currentMediaList.length) return;
    isLoadingBatch = true;

    const nextBatch = currentMediaList.slice(loadedIndex, loadedIndex + BATCH_SIZE);

    nextBatch.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'porto-card skeleton-shimmer';

      if (item.type === 'video') {
        const videoUrl = item.url;
        const posterUrl = item.poster || 'assets/images/portofolio/wedding/nita/photo/DSC00067.jpg';
        const titleText = item.title || 'Bahagia Studio Film';

        card.setAttribute('data-video', videoUrl);
        card.setAttribute('data-title', titleText);
        card.style.cursor = 'pointer';

        // Render high-res thumbnail image for immediate display without blank video frames
        const img = document.createElement('img');
        img.src = posterUrl;
        img.alt = titleText;
        img.className = 'porto-card-media';
        img.loading = 'lazy';
        img.decoding = 'async';

        img.addEventListener('load', () => {
          card.classList.remove('skeleton-shimmer');
        });

        img.addEventListener('error', () => {
          card.classList.remove('skeleton-shimmer');
        });

        card.appendChild(img);

        // Gold Play Button Overlay
        const playBtn = document.createElement('div');
        playBtn.className = 'porto-card-play-btn';
        playBtn.innerHTML = '&#9654;';
        card.appendChild(playBtn);

        // Tag
        const tag = document.createElement('span');
        tag.className = 'porto-card-type-tag';
        tag.textContent = 'VIDEO';
        card.appendChild(tag);
      } else {
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = 'Bahagia Studio Portfolio';
        img.className = 'porto-card-media';
        img.loading = 'lazy';
        img.decoding = 'async'; // Menggunakan dekode gambar asynchronous agar tidak mengganggu UI rendering thread

        img.addEventListener('load', () => {
          card.classList.remove('skeleton-shimmer');
        });

        img.addEventListener('error', () => {
          card.classList.remove('skeleton-shimmer');
        });

        card.appendChild(img);
      }

      gridContainer.appendChild(card);
    });

    loadedIndex += nextBatch.length;
    isLoadingBatch = false;

    if (loadStatus) {
      if (loadedIndex >= currentMediaList.length) {
        loadStatus.textContent = '— Semua portofolio telah ditampilkan —';
      } else {
        loadStatus.textContent = 'Scroll ke bawah untuk memuat portofolio lainnya...';
      }
    }
  }

  // --- Event Listeners for Left Menu ---
  menuButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      menuButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.getAttribute('data-category');
      showcaseRight.scrollTop = 0;
      resetAndRender();
    });
  });

  // --- Event Listeners for Right Filter Tabs ---
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeFilter = btn.getAttribute('data-filter');
      showcaseRight.scrollTop = 0;
      resetAndRender();
    });
  });

  // --- Infinite Scroll on Right Showcase Column ---
  showcaseRight.addEventListener('scroll', () => {
    const { scrollTop, clientHeight, scrollHeight } = showcaseRight;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      renderNextBatch();
    }
  });

  // --- Custom Independent Scroll Behavior ---
  // When cursor is over right column:
  // Scroll right column grid items first. When right column reaches bottom boundary,
  // subsequent scroll down seamlessly scrolls the window down to Section 3 (Footer).
  showcaseRight.addEventListener('wheel', (e) => {
    const isScrollingDown = e.deltaY > 0;
    const { scrollTop, clientHeight, scrollHeight } = showcaseRight;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

    if (isScrollingDown && isAtBottom && footerSection) {
      // Pass-through scroll to page window to move to footer
      window.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }
  }, { passive: true });

  // When cursor is over left sidebar:
  // Mouse wheel scroll immediately scrolls outer page down towards footer
  if (sidebarLeft && window.innerWidth > 1100) {
    sidebarLeft.addEventListener('wheel', (e) => {
      window.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }, { passive: true });
  }

  // --- Initial Render ---
  resetAndRender();
});
