/* Main JavaScript Controller for S. Permpoon Heattech */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initNavigation();
  initLanguageSwitcher();
  initProductFilter();
});

/* Hero Slider Controller */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-arrow.prev, .slider-arrow-prev');
  const nextBtn = document.querySelector('.slider-arrow.next, .slider-arrow-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.getAttribute('data-index') || e.target.getAttribute('data-slide-to') || '0', 10);
      showSlide(slideIndex);
      startAutoPlay();
    });
  });

  const sliderWrap = document.querySelector('.hero-slider-container');
  if (sliderWrap) {
    sliderWrap.addEventListener('mouseenter', stopAutoPlay);
    sliderWrap.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

/* Navigation & Mobile Menu */
function initNavigation() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.main-navigation');

  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (nav && nav.classList.contains('is-open')) {
            nav.classList.remove('is-open');
          }
        }
      }
    });
  });
}

/* Language Switcher Controller - Strictly No Emojis */
function initLanguageSwitcher() {
  const langBtn = document.querySelector('.lang-btn');
  if (!langBtn) return;

  const globeSvg = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  `;
  const chevronSvg = `
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  `;

  langBtn.addEventListener('click', () => {
    const isThai = langBtn.innerText.includes('TH');
    if (isThai) {
      langBtn.innerHTML = `${globeSvg}<span>EN</span>${chevronSvg}`;
    } else {
      langBtn.innerHTML = `${globeSvg}<span>TH</span>${chevronSvg}`;
    }
  });
}

/* Product Category Filter for products.html */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.product-filter-btn');
  const productItems = document.querySelectorAll('.product-item-wrapper');
  const countBadge = document.querySelector('.products-count-badge');

  if (!filterBtns.length || !productItems.length) return;

  function filterCategory(category) {
    let visibleCount = 0;

    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    productItems.forEach(item => {
      const itemCat = item.getAttribute('data-category');
      if (category === 'all' || itemCat === category) {
        item.classList.remove('is-hidden');
        visibleCount++;
      } else {
        item.classList.add('is-hidden');
      }
    });

    if (countBadge) {
      countBadge.innerHTML = `แสดงผลิตภัณฑ์คุณภาพมาตรฐาน ส.เพิ่มพูน ฮีตเทค จำนวน <strong>${visibleCount}</strong> รายการ`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filterCategory(cat);
    });
  });

  // Check URL query parameter e.g. ?cat=sensor
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const matchingBtn = Array.from(filterBtns).find(btn => btn.getAttribute('data-filter') === catParam);
    if (matchingBtn) {
      filterCategory(catParam);
      return;
    }
  }

  // Default to all
  filterCategory('all');
}


