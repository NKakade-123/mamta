/**
 * MAMTA TOOLS - INDIA'S NO. 1 PRECISION CUTTING TOOLS
 * Interactive JavaScript Engine
 * Theme: White, Grey, and Orange
 * Features: Creative Slider, Clickable Portfolio Filtering, YouTube Video Modal,
 * Mega Menu Cursor Hover Preview, Product Detail Thumbnail Switcher,
 * Photo Gallery Lightbox (Next/Prev/Close), Milestone Counters, Off-Canvas Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initCreativeHeroSlider();
  initPortfolioFilters();
  initMegaMenuHoverPreview();
  initProductThumbnailSwitcher();
  initPhotoGalleryLightbox();
  initVideoModal();
  initAnimatedCounters();
  initClientMarquee();
  initBackToTop();
  initFormSubmissions();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION & DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const subToggles = document.querySelectorAll('[data-toggle="submenu"]');

  if (!drawer) return;

  const openDrawer = (e) => {
    if (e) e.stopPropagation();
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  subToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = toggle.closest('.mobile-nav-item');
      if (!parent) return;
      const subMenu = parent.querySelector('.mobile-sub-menu');
      if (subMenu) {
        subMenu.classList.toggle('open');
        toggle.classList.toggle('expanded');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. BIG CREATIVE HERO SLIDER
   ========================================================================== */
function initCreativeHeroSlider() {
  const sliderWrapper = document.querySelector('.hero-slider-wrapper');
  if (!sliderWrapper) return;

  const slides = sliderWrapper.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.slider-arrow-btn.prev');
  const nextBtn = document.querySelector('.slider-arrow-btn.next');
  const dots = document.querySelectorAll('.slider-dot');
  const progressBar = document.querySelector('.slider-progress-bar');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 5500; // 5.5 seconds
  let isPaused = false;
  let startX = 0;
  let endX = 0;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

    resetProgressBar();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function resetProgressBar() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    setTimeout(() => {
      if (!isPaused) {
        progressBar.style.transition = `width ${slideDuration}ms linear`;
        progressBar.style.width = '100%';
      }
    }, 40);
  }

  function startAutoplay() {
    stopAutoplay();
    resetProgressBar();
    slideInterval = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, slideDuration);
  }

  function stopAutoplay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(idx);
      startAutoplay();
    });
  });

  // Pause on hover
  sliderWrapper.addEventListener('mouseenter', () => {
    isPaused = true;
    if (progressBar) progressBar.style.animationPlayState = 'paused';
  });

  sliderWrapper.addEventListener('mouseleave', () => {
    isPaused = false;
    resetProgressBar();
    startAutoplay();
  });

  // Mobile Touch Swipe
  sliderWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  sliderWrapper.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      startAutoplay();
    }
  }, { passive: true });

  // Initialize
  goToSlide(0);
  startAutoplay();
}

/* ==========================================================================
   4. PRODUCT PORTFOLIO WITH FILTER TABS (CLICKABLE & FILTERABLE)
   ========================================================================== */
function initPortfolioFilters() {
  const filterTabs = document.querySelectorAll('.portfolio-tab-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterTabs.length === 0 || productCards.length === 0) return;

  filterTabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal || (cat && cat.includes(filterVal))) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. MEGA MENU CURSOR HOVER PRODUCT PREVIEW (RIGHT-SIDE DYNAMIC PANEL)
   ========================================================================== */
function initMegaMenuHoverPreview() {
  const productLinks = document.querySelectorAll('.mega-links-list a[data-preview-img]');
  const previewCard = document.getElementById('megaProductPreview');
  if (!previewCard || productLinks.length === 0) return;

  const previewImg = document.getElementById('megaPreviewImg');
  const previewTitle = document.getElementById('megaPreviewTitle');
  const previewDesc = document.getElementById('megaPreviewDesc');
  const previewBtn = document.getElementById('megaPreviewBtn');

  productLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const imgSrc = link.getAttribute('data-preview-img');
      const title = link.getAttribute('data-preview-title') || link.textContent.trim();
      const desc = link.getAttribute('data-preview-desc') || 'High precision tooling manufactured to tight ±0.005mm tolerances.';
      const href = link.getAttribute('data-preview-link') || link.getAttribute('href');

      productLinks.forEach(l => l.classList.remove('hovered'));
      link.classList.add('hovered');

      if (previewImg) {
        previewImg.style.opacity = '0';
        setTimeout(() => {
          previewImg.src = imgSrc;
          previewImg.alt = title;
          previewImg.style.opacity = '1';
        }, 120);
      }

      if (previewTitle) previewTitle.textContent = title;
      if (previewDesc) previewDesc.textContent = desc;
      if (previewBtn && href) previewBtn.setAttribute('href', href);
    });
  });
}

/* ==========================================================================
   6. PRODUCT DETAIL PAGE: THUMBNAIL SWITCHER
   ========================================================================== */
function initProductThumbnailSwitcher() {
  const mainImgCard = document.querySelector('.detail-main-img-card');
  const mainImg = mainImgCard ? mainImgCard.querySelector('img') : null;
  const thumbItems = document.querySelectorAll('.detail-thumb-item');

  if (!mainImg || thumbItems.length === 0) return;

  // Set first thumb active by default
  thumbItems[0].classList.add('active');

  thumbItems.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbItems.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const targetImg = thumb.querySelector('img');
      if (targetImg) {
        const newSrc = targetImg.getAttribute('src');
        const newAlt = targetImg.getAttribute('alt');

        // Smooth swap
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = newSrc;
          if (newAlt) mainImg.alt = newAlt;
          mainImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  // Clicking main image opens it in the photo lightbox
  mainImgCard.addEventListener('click', () => {
    openPhotoLightbox(mainImg.src, mainImg.alt || 'Precision Cutting Tool');
  });
}

/* ==========================================================================
   7. FULL PHOTO GALLERY LIGHTBOX (CLOSE, NEXT, PREV BUTTONS)
   ========================================================================== */
let galleryItemsList = [];
let currentGalleryIdx = 0;

function initPhotoGalleryLightbox() {
  // Check if lightbox DOM container exists, else build it
  let lbModal = document.getElementById('photoGalleryLightbox');
  if (!lbModal) {
    lbModal = document.createElement('div');
    lbModal.id = 'photoGalleryLightbox';
    lbModal.className = 'photogallery-lightbox';
    lbModal.innerHTML = `
      <div class="pg-modal-content">
        <button class="pg-close-btn" aria-label="Close Lightbox">&times;</button>
        <button class="pg-nav-btn prev" aria-label="Previous Image">&#10094;</button>
        <button class="pg-nav-btn next" aria-label="Next Image">&#10095;</button>
        <div class="pg-img-holder">
          <img id="pgModalImg" src="" alt="Precision Cutting Tool Gallery">
        </div>
        <div class="pg-info-bar">
          <div class="pg-caption" id="pgModalCaption"></div>
          <div class="pg-counter" id="pgModalCounter"></div>
        </div>
      </div>
    `;
    document.body.appendChild(lbModal);
  }

  // Find all gallery images on gallery.html or portfolio gallery
  const galleryImgs = document.querySelectorAll('.gallery-grid-item img, .gallery-card img, .portfolio-section .product-card-img img');
  galleryItemsList = [];

  galleryImgs.forEach((img, idx) => {
    galleryItemsList.push({
      src: img.src,
      alt: img.alt || `Mamta Tools Precision Tooling #${idx + 1}`
    });

    const parentClickable = img.closest('.gallery-card, .gallery-grid-item, .product-card-img');
    if (parentClickable && (window.location.href.toLowerCase().includes('gallery.html') || document.querySelector('.gallery-card'))) {
      parentClickable.style.cursor = 'zoom-in';
      parentClickable.addEventListener('click', (e) => {
        e.preventDefault();
        const foundIdx = galleryItemsList.findIndex(item => item.src === img.src);
        openPhotoLightboxAtIndex(foundIdx !== -1 ? foundIdx : idx);
      });
    }
  });

  // Controls bindings
  const closeBtn = lbModal.querySelector('.pg-close-btn');
  const prevBtn = lbModal.querySelector('.pg-nav-btn.prev');
  const nextBtn = lbModal.querySelector('.pg-nav-btn.next');

  if (closeBtn) closeBtn.addEventListener('click', closePhotoLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => stepPhotoLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => stepPhotoLightbox(1));

  lbModal.addEventListener('click', (e) => {
    if (e.target === lbModal) closePhotoLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lbModal.classList.contains('active')) return;
    if (e.key === 'Escape') closePhotoLightbox();
    if (e.key === 'ArrowLeft') stepPhotoLightbox(-1);
    if (e.key === 'ArrowRight') stepPhotoLightbox(1);
  });
}

function openPhotoLightboxAtIndex(index) {
  if (galleryItemsList.length === 0) return;
  currentGalleryIdx = (index + galleryItemsList.length) % galleryItemsList.length;
  updatePhotoLightboxContent();

  const lbModal = document.getElementById('photoGalleryLightbox');
  if (lbModal) {
    lbModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function openPhotoLightbox(src, caption) {
  // Single image preview fallback
  const lbModal = document.getElementById('photoGalleryLightbox');
  if (!lbModal) return;

  const imgEl = document.getElementById('pgModalImg');
  const captionEl = document.getElementById('pgModalCaption');
  const counterEl = document.getElementById('pgModalCounter');
  const prevBtn = lbModal.querySelector('.pg-nav-btn.prev');
  const nextBtn = lbModal.querySelector('.pg-nav-btn.next');

  if (imgEl) imgEl.src = src;
  if (captionEl) captionEl.textContent = caption;
  if (counterEl) counterEl.textContent = 'High-Resolution View';
  if (prevBtn) prevBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';

  lbModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function stepPhotoLightbox(direction) {
  if (galleryItemsList.length === 0) return;
  currentGalleryIdx = (currentGalleryIdx + direction + galleryItemsList.length) % galleryItemsList.length;
  updatePhotoLightboxContent();
}

function updatePhotoLightboxContent() {
  const item = galleryItemsList[currentGalleryIdx];
  const imgEl = document.getElementById('pgModalImg');
  const captionEl = document.getElementById('pgModalCaption');
  const counterEl = document.getElementById('pgModalCounter');
  const lbModal = document.getElementById('photoGalleryLightbox');

  if (lbModal) {
    const prevBtn = lbModal.querySelector('.pg-nav-btn.prev');
    const nextBtn = lbModal.querySelector('.pg-nav-btn.next');
    if (prevBtn) prevBtn.style.display = '';
    if (nextBtn) nextBtn.style.display = '';
  }

  if (imgEl && item) {
    imgEl.style.opacity = '0';
    setTimeout(() => {
      imgEl.src = item.src;
      imgEl.alt = item.alt;
      imgEl.style.opacity = '1';
    }, 150);
  }

  if (captionEl && item) captionEl.textContent = item.alt;
  if (counterEl) counterEl.textContent = `Image ${currentGalleryIdx + 1} of ${galleryItemsList.length}`;
}

function closePhotoLightbox() {
  const lbModal = document.getElementById('photoGalleryLightbox');
  if (lbModal) {
    lbModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   8. VIDEO SHOWCASE MODAL WITH REAL YOUTUBE EMBED
   ========================================================================== */
function initVideoModal() {
  const videoPlayBtn = document.querySelector('.video-play-btn');
  const modal = document.querySelector('.video-modal-backdrop');
  if (!modal) return;

  const modalFrame = modal.querySelector('iframe');
  const closeBtn = modal.querySelector('.video-modal-close');
  // High-precision CNC milling cutting tool video demonstration
  const workingVideoUrl = 'https://www.youtube.com/embed/5mCqPqVea7U?autoplay=1&rel=0';

  if (videoPlayBtn) {
    videoPlayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalFrame) {
        modalFrame.src = workingVideoUrl;
      }
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeModal = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
    if (modalFrame) {
      modalFrame.src = '';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. ANIMATED MILESTONE COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.counter-num[data-target]');
  if (counterElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateNumber(el, target, 2000);
        obs.unobserve(el);
      }
    });
  }, {
    threshold: 0.3
  });

  counterElements.forEach(el => observer.observe(el));
}

function animateNumber(element, target, duration) {
  let startTimestamp = null;
  function step(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    element.textContent = Math.floor(easeOutVal * target).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target.toLocaleString();
    }
  }
  requestAnimationFrame(step);
}

/* ==========================================================================
   10. CLIENT MARQUEE CONTROLS
   ========================================================================== */
function initClientMarquee() {
  const marqueeTrack = document.querySelector('.client-track');
  if (!marqueeTrack) return;

  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

/* ==========================================================================
   11. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.querySelector('.scroll-top-btn') || document.getElementById('backToTop');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }, { passive: true });

  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   12. INTERACTIVE FORM SUBMISSIONS & TOASTS
   ========================================================================== */
function initFormSubmissions() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';
      }

      setTimeout(() => {
        showSuccessToast('Thank you! Your inquiry has been sent to Mamta Tools. Our technical specialist will contact you shortly.');
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 1000);
    });
  });
}

function showSuccessToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.innerHTML = `
    <div style="color: var(--primary); font-size: 1.2rem; font-weight: 800;">✓</div>
    <div style="flex: 1;">${message}</div>
    <button style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #94a3b8;" onclick="this.parentElement.remove()">&times;</button>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}
