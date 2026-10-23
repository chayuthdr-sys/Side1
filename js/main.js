/* Main JavaScript Controller for S. Permpoon Heattech */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initNavigation();
  initLanguageSwitcher();
  initProductFilter();
  initProductModal();
  initSpecPhraseWrapping();
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
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownItem = dropdownToggle ? dropdownToggle.closest('.nav-item.dropdown') : null;

  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });
  }

  // Mobile Dropdown Accordion Toggle (tap on 'สินค้า' opens/closes category list)
  if (dropdownToggle && dropdownItem) {
    dropdownToggle.addEventListener('click', (e) => {
      const isMobile = window.innerWidth <= 991 || (nav && nav.classList.contains('is-open'));
      if (isMobile) {
        e.preventDefault();
        dropdownItem.classList.toggle('is-dropdown-open');
        const isOpen = dropdownItem.classList.contains('is-dropdown-open');
        dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  }

  // Handle Dropdown Category Links Click
  document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
      }
      if (dropdownItem) {
        dropdownItem.classList.remove('is-dropdown-open');
      }

      // If already on products page, switch category smoothly without reload
      const isProductsPage = window.location.pathname.endsWith('products.html') || window.location.pathname.endsWith('/products');
      if (isProductsPage && typeof window.switchProductCategory === 'function') {
        const href = link.getAttribute('href');
        const url = new URL(href, window.location.origin);
        const cat = url.searchParams.get('cat') || 'all';
        e.preventDefault();
        window.switchProductCategory(cat);
        window.history.pushState({}, '', href);
      }
    });
  });

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

  // Expose globally for header category switching
  window.switchProductCategory = filterCategory;

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

/* Products Database for Interactive Modal */
const PRODUCTS_DATA = {
  thermocouple: {
    id: 'thermocouple',
    title: 'Thermocouple',
    subtitle: 'เซนเซอร์วัดอุณหภูมิเทอร์โมคับเปิ้ล',
    category: 'หัววัดอุณหภูมิและเซนเซอร์',
    image: 'assets/images/Thermocouple1.jpg',
    images: [
      'assets/images/Thermocouple1.jpg',
      'assets/images/Thermocouple2.jpg',
      'assets/images/Thermocouple3.jpg'
    ],
    desc: 'เซนเซอร์วัดอุณหภูมิที่ทำจากโลหะต่างชนิดกัน 2 เส้น ประกอบด้วยขั้วบวกและขั้วลบ ใช้หลักการเปลี่ยนแปลงค่าอุณหภูมิเป็นค่าความต่างศักย์',
    specs: [
      { name: 'ชนิด Type', val: 'K, J, R, S, T, E' },
      { name: 'วัสดุ', val: 'สแตนเลส SUS304, SUS316, SUS310S, Incoloy600, Incoloy610' },
      { name: 'ย่านวัดอุณหภูมิ', val: '-40 ถึง 1600 °C' }
    ]
  },
  rtd: {
    id: 'rtd',
    title: 'RTD PT-100',
    subtitle: 'หัววัดอุณหภูมิความละเอียดสูง PT-100',
    category: 'หัววัดอุณหภูมิและเซนเซอร์',
    image: 'assets/images/RTD%20PT-100(1).jpg',
    images: [
      'assets/images/RTD%20PT-100(1).jpg',
      'assets/images/RTD%20PT-100(2).jpg',
      'assets/images/RTD%20PT-100(3).jpg',
      'assets/images/RTD%20PT-100(4).jpg'
    ],
    desc: 'อุปกรณ์วัดอุณหภูมิที่มีค่าความต้านทาน 100 โอห์มที่ 0 °C โครงสร้างหลักเป็นขดลวดแพลทินัมจึงให้ความแม่นยำและเสถียรสูง เหมาะกับงานที่ต้องการควบคุมคุณภาพในอุตสาหกรรม',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส SUS304, SUS316' },
      { name: 'ย่านวัดอุณหภูมิ', val: '-200 ถึง 500 °C' }
    ]
  },
  'band-heater': {
    id: 'band-heater',
    title: 'Band Heater',
    subtitle: 'ฮีตเตอร์รัดท่อ',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/Band%20Heater1.jpg',
    images: [
      'assets/images/Band%20Heater1.jpg',
      'assets/images/Band%20Heater2.jpg',
      'assets/images/Band%20Heater3.jpg',
      'assets/images/Band%20Heater4.jpg'
    ],
    desc: 'เป็นอุปกรณ์ให้ความร้อนแบบทรงกระบอก โดยใช้หลักการนำความร้อนผ่านการรัดรอบท่อหรือรอบถังทรงกระบอก',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส, ซิ้งค์, ทองเหลือง' },
      { name: 'ลักษณะขั้วต่อไฟ', val: 'ออกขั้วสาย, ออกขั้วปลั๊ก, ออกขั้วเต๋า, ออกขั้วน็อต' },
      { name: 'ผลิตแรงดันไฟฟ้า', val: '55 VDC/AC – 420 VDC/AC' }
    ]
  },
  'ceramic-band-heater': {
    id: 'ceramic-band-heater',
    title: 'Ceramic Band Heater',
    subtitle: 'ฮีตเตอร์รัดท่อแบบเซรามิค',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/Ceramic%20Band%20Heater1.jpg',
    images: [
      'assets/images/Ceramic%20Band%20Heater1.jpg',
      'assets/images/Ceramic%20Band%20Heater2.jpg',
      'assets/images/Ceramic%20Band%20Heater3.jpg',
      'assets/images/Ceramic%20Band%20Heater4.jpg',
      'assets/images/Ceramic%20Band%20Heater5.jpg',
      'assets/images/Ceramic%20Band%20Heater6.jpg'
    ],
    desc: 'คือ อุปกรณ์ให้ความร้อนในอุณหภูมิปานกลางถึงอุณหภูมิสูงแก่ชิ้นงานที่มีลักษณะเป็นทรงกระบอก เช่น ท่อ ถัง หรือหัวฉีดเครื่องจักร โดยใช้หลักการนำความร้อน',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส พร้อมฉนวนเซรามิคทนความร้อนสูง' },
      { name: 'ลักษณะขั้วต่อไฟ', val: 'ออกขั้วสาย, ออกขั้วปลั๊ก, ออกขั้วเต๋า, ออกขั้วน็อต' },
      { name: 'ผลิตแรงดันไฟฟ้า', val: '55 VDC/AC – 420 VDC/AC' }
    ]
  },
  'immersion-heater': {
    id: 'immersion-heater',
    title: 'Immersion Heater',
    subtitle: 'ฮีตเตอร์ต้มน้ำ',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/Immersion%20Heater2.jpg',
    images: [
      'assets/images/Immersion%20Heater2.jpg',
      'assets/images/Immersion%20Heater1.jpg',
      'assets/images/Immersion%20Heater3.jpg'
    ],
    desc: 'อุปกรณ์ทำความร้อนไฟฟ้าที่ใช้สำหรับจุ่มลงไปในของเหลวโดยตรง เช่น น้ำ น้ำประปา น้ำมัน หรือสารเคมีบางชนิด เพื่อเปลี่ยนพลังงานไฟฟ้าเป็นความร้อนและถ่ายเทเข้าสู่ของเหลวนั้นๆ ได้อย่างรวดเร็วและสม่ำเสมอ',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส SUS304, SUS316, SUS310S, Incoloy840, Incoloy800' },
      { name: 'ผลิตแรงดันไฟฟ้า', val: '55 VDC/AC – 420 VDC/AC' },
      { name: 'รูปแบบท่อ U', val: '1U, 2U, 3U, 6U, 9U, 12U, 15U, 18U' },
      { name: 'การต่อสะพานไฟ', val: 'แบบสตาร์ 220 หรือ 380 โวลต์ และ แบบเดลต้า 380 โวลต์' }
    ]
  },
  'cartridge-heater': {
    id: 'cartridge-heater',
    title: 'Cartridge Heater',
    subtitle: 'ฮีตเตอร์แท่ง',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/Cartridge%20Heater1.jpg',
    images: [
      'assets/images/Cartridge%20Heater1.jpg',
      'assets/images/Cartridge%20Heater2.jpg',
      'assets/images/Cartridge%20Heater3.jpg'
    ],
    desc: 'อุปกรณ์ให้ความร้อนแก่ชิ้นงานโดยใช้หลักการนำความร้อน แปลงพลังงานไฟฟ้าเป็นความร้อนผ่านขดลวดนิโครมที่อยู่ภายในปลอกโลหะทรงกระบอก',
    specs: [
      { name: 'วัสดุปลอก', val: 'สแตนเลส SUS304, SUS316L หรือ Incoloy' },
      { name: 'ผลิตแรงดันไฟฟ้า', val: '55 VDC/AC – 420 VDC/AC' }
    ]
  },
  'finned-heater': {
    id: 'finned-heater',
    title: 'Finned Heater',
    subtitle: 'ฮีตเตอร์ครีบ',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/Finned%20Heater1.jpg',
    images: [
      'assets/images/Finned%20Heater1.jpg',
      'assets/images/Finned%20Heater2.jpg',
      'assets/images/Finned%20Heater3.jpg',
      'assets/images/Finned%20Heater4.jpg',
      'assets/images/Finned%20Heater5.jpg'
    ],
    desc: 'คืออุปกรณ์ให้ความร้อนในงานอุตสาหกรรมที่พัฒนามาจากฮีตเตอร์ท่อกลม โดยมีการติดตั้งแผ่นครีบเพิ่มรอบตัวท่อ เพื่อช่วยเพิ่มพื้นที่ผิวและระบายความร้อนสู่อากาศได้รวดเร็วและสม่ำเสมอยิ่งขึ้นและมีอายุการใช้งานที่ยาวนานขึ้น ซึ่งสามารถผลิตได้หลากหลายรูปแบบ ทั้งแบบตัวไอ ดัดเป็นตัวยู ดัดเป็นตัวดับบลิว รวมถึงดัดเป็นรูปทรงต่างๆ ตามต้องการ',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส SUS304, SUS316, SUS310S, Incoloy840, Incoloy800' },
      { name: 'ผลิตแรงดันไฟฟ้า', val: '55 VDC/AC – 420 VDC/AC' },
      { name: 'การต่อสะพานไฟ', val: 'แบบสตาร์ 220 หรือ 380 โวลต์ และ แบบเดลต้า 380 โวลต์' }
    ]
  },
  'tubular-heater': {
    id: 'tubular-heater',
    title: 'Tubular Heater',
    subtitle: 'ฮีตเตอร์ท่อกลม',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/Tubular%20Heater1.jpg',
    images: [
      'assets/images/Tubular%20Heater1.jpg',
      'assets/images/Tubular%20Heater2.jpg',
      'assets/images/Tubular%20Heater3.jpg',
      'assets/images/Tubular%20Heater4.jpg',
      'assets/images/Tubular%20Heater5.jpg'
    ],
    desc: 'อุปกรณ์ให้ความร้อนในงานอุตสาหกรรม และงานระบบต่างๆ ที่เปลี่ยนพลังงานไฟฟ้าเป็นพลังงานความร้อน โดยมีลักษณะเป็นท่อโลหะรูปทรงกระบอก สามารถดัดโค้งงอเป็นรูปทรงต่างๆ ได้ตามความต้องการ',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส SUS304, SUS316L หรือ Incoloy' },
      { name: 'ขนาดท่อ', val: '8 mm, 11 mm, 14 mm' },
      { name: 'กำลังไฟฟ้า', val: '110 VAC – 420 VAC' }
    ]
  },
  'strip-heater': {
    id: 'strip-heater',
    title: 'Strip Heater',
    subtitle: 'ฮีตเตอร์แผ่น',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/Strip%20Heater1.jpg',
    images: [
      'assets/images/Strip%20Heater1.jpg',
      'assets/images/Strip%20Heater2.jpg',
      'assets/images/Strip%20Heater3.jpg',
      'assets/images/Strip%20Heater4.jpg'
    ],
    desc: 'อุปกรณ์ให้ความร้อนในงานอุตสาหกรรมที่มีโครงสร้างแผ่นเรียบ เหมาะสำหรับติดตั้งแนบสนิทกับแม่พิมพ์ แผ่นโลหะ หรือถังเหลี่ยม เพื่อถ่ายเทความร้อนโดยตรง',
    specs: [
      { name: 'วัสดุแผ่นโครงสร้าง', val: 'สแตนเลส, ซิ้งค์, แผ่นทองเหลือง' },
      { name: 'ลักษณะขั้วต่อไฟ', val: 'ออกขั้วสาย, ออกขั้วปลั๊ก, ออกขั้วเต๋า, ออกขั้วน็อต' },
      { name: 'ผลิตแรงดันไฟฟ้า', val: '55 VDC/AC – 420 VDC/AC' }
    ]
  },
  'level-switch': {
    id: 'level-switch',
    title: 'Level Switch',
    subtitle: 'ลูกลอย Float Switch',
    category: 'ลูกลอยวัดระดับของเหลว',
    image: 'assets/images/cropped-image-20-1.png',
    images: [
      'assets/images/cropped-image-20-1.png'
    ],
    desc: 'อุปกรณ์ตรวจจับระดับของเหลว เช่น น้ำหรือน้ำมัน ภายในถังเก็บหรือบ่อน้ำ เพื่อทำหน้าที่เปิดหรือปิดวงจรไฟฟ้าอัตโนมัติ โดยใช้ระดับน้ำเป็นตัวกำหนดการทำงาน เพื่อควบคุมปั๊มน้ำ วาล์ว หรือระบบสัญญาณเตือนภัย',
    specs: [
      { name: 'วัสดุโครงสร้าง', val: 'สแตนเลส SUS304, SUS316 Food Grade' },
      { name: 'ระบบการทำงาน', val: 'สวิตช์ลูกลอยแม่เหล็กไฟฟ้าความแม่นยำสูง' },
      { name: 'การนำไปใช้งาน', val: 'ควบคุมปั๊มน้ำ วาล์ว และระบบสัญญาณเตือนภัยระดับของเหลว' }
    ]
  },
  'infrared-heater': {
    id: 'infrared-heater',
    title: 'Infrared Heater',
    subtitle: 'ฮีตเตอร์อินฟราเรด',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/Infrared%20Heater1.jpg',
    images: [
      'assets/images/Infrared%20Heater1.jpg',
      'assets/images/Infrared%20Heater2.jpg',
      'assets/images/Infrared%20Heater3.jpg'
    ],
    desc: 'อุปกรณ์ที่เปลี่ยนพลังงานไฟฟ้าให้กลายเป็นพลังงานความร้อนในรูปของรังสีอินฟราเรด ซึ่งเป็นคลื่นแม่เหล็กไฟฟ้าชนิดหนึ่ง',
    specs: [
      { name: 'ประเภทความร้อน', val: 'รังสีความร้อนอินฟราเรด คลื่นแม่เหล็กไฟฟ้า' },
      { name: 'การนำไปใช้งาน', val: 'งานอบแห้งสี อบไล่ความชื้น งานอบชิ้นส่วนอุตสาหกรรม' }
    ],
    features: [
      { title: 'ประหยัดพลังงาน', desc: 'อัตราความเฉื่อยความร้อนต่ำมาก' },
      { title: 'ทำความร้อนรวดเร็ว', desc: 'แผ่รังสีอินฟราเรด ส่งผ่านความร้อนตรงสู่ชิ้นงานโดยตรงโดยไม่ต้องใช้อากาศเป็นตัวกลาง' },
      { title: 'เหมาะกับงานอบแห้งทุกประเภท', desc: 'เหมาะกับงานสี อาหาร และพลาสติก' }
    ]
  },
  'aluminium-heater': {
    id: 'aluminium-heater',
    title: 'Aluminium Heater',
    subtitle: 'ฮีตเตอร์หล่ออะลูมิเนียม',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/Aluminium%20Heater1.jpg',
    images: [
      'assets/images/Aluminium%20Heater1.jpg',
      'assets/images/Aluminium%20Heater2.jpg',
      'assets/images/Aluminium%20Heater3.jpg',
      'assets/images/Aluminium%20Heater4.jpg'
    ],
    desc: 'อุปกรณ์ทำความร้อนประเภทหนึ่ง ที่นำเอาขดลวดหรือท่อฮีตเตอร์มาฝังหรือหลอมรวมเป็นเนื้อเดียวกับอะลูมิเนียมด้วยกระบวนการหล่อ ออกมาเป็นรูปทรงตามต้องการ',
    specs: [
      { name: 'วัสดุเนื้อหล่อ', val: 'อะลูมิเนียมเกรดหล่อขึ้นรูป ทนความร้อนสูง' },
      { name: 'โครงสร้างภายใน', val: 'ฝังท่อฮีตเตอร์ท่อกลมเนื้อสแตนเลส พร้อมท่อน้ำหล่อเย็นในตัว' }
    ],
    features: [
      { title: 'กระจายความร้อนสม่ำเสมอ', desc: 'รวดเร็วทั่วถึงทุกพื้นผิว' },
      { title: 'ความทนทานสูง', desc: 'เนื้อหล่อป้องกันแรงกระแทก ยืดอายุใช้งาน' },
      { title: 'ทนความร้อนสูง', desc: 'รองรับวัตต์สูง และทำท่อน้ำหล่อเย็นในตัวได้' },
      { title: 'สั่งทำตามแบบได้', desc: 'หล่อทรงกลม ทรงเหลี่ยม ตามแบบแม่พิมพ์' }
    ]
  },
  'heater-coil': {
    id: 'heater-coil',
    title: 'Heater Coil',
    subtitle: 'ฮีตเตอร์คอยล์',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/Heater%20Coil1.jpg',
    images: [
      'assets/images/Heater%20Coil1.jpg',
      'assets/images/Heater%20Coil2.jpg',
      'assets/images/Heater%20Coil3.jpg'
    ],
    desc: 'อุปกรณ์ทำความร้อนประเภทหนึ่งที่ใช้ลวดความต้านทานไฟฟ้า เช่น ลวดนิโครม มาขดเป็นเกลียวหรือรูปทรงคอยล์ เหมาะกับงานที่ต้องการลมร้อนสูง',
    specs: [
      { name: 'วัสดุลวดนำความร้อน', val: 'ลวดความต้านทานนิโครมคุณภาพสูง' },
      { name: 'ลักษณะทางกายภาพ', val: 'ขดเป็นเกลียวหรือรูปทรงคอยล์' },
      { name: 'การนำไปใช้งาน', val: 'เหมาะกับงานที่ต้องการลมร้อนสูง และระบบเป่าความร้อน' }
    ]
  }
};

/* Product Detail Interactive Modal Controller with Gallery Slider */
function initProductModal() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('closeProductModal');

  if (!modal) return;

  const modalImg = document.getElementById('modalProductImg');
  const modalTitle = document.getElementById('modalProductTitle');
  const modalSubtitle = document.getElementById('modalProductSubtitle');
  const modalCategory = document.getElementById('modalProductCategory');
  const modalDesc = document.getElementById('modalProductDesc');
  const modalSpecs = document.getElementById('modalProductSpecs');
  const modalFeatures = document.getElementById('modalProductFeatures');

  const sliderPrev = document.getElementById('modalSliderPrev');
  const sliderNext = document.getElementById('modalSliderNext');
  const sliderCounter = document.getElementById('modalSliderCounter');
  const thumbnailsWrap = document.getElementById('modalThumbnails');

  let currentImages = [];
  let currentIdx = 0;

  function updateGallery(idx) {
    if (!currentImages.length) return;
    currentIdx = (idx + currentImages.length) % currentImages.length;
    if (modalImg) {
      modalImg.style.opacity = '0.35';
      modalImg.src = currentImages[currentIdx];
      modalImg.onload = () => { modalImg.style.opacity = '1'; };
    }
    if (sliderCounter) {
      sliderCounter.innerText = `${currentIdx + 1} / ${currentImages.length}`;
    }
    if (thumbnailsWrap) {
      const thumbs = thumbnailsWrap.querySelectorAll('.modal-thumb-btn');
      thumbs.forEach((t, i) => {
        if (i === currentIdx) {
          t.classList.add('active');
          t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          t.classList.remove('active');
        }
      });
    }
  }

  function openModal(productId) {
    const data = PRODUCTS_DATA[productId];
    if (!data) return;

    currentImages = data.images && data.images.length ? data.images : [data.image];
    currentIdx = 0;

    if (modalTitle) modalTitle.innerText = data.title;
    if (modalSubtitle) modalSubtitle.innerText = data.subtitle;
    if (modalCategory) modalCategory.innerText = data.category;
    if (modalDesc) modalDesc.innerText = data.desc;

    // Render Slider Controls & Thumbnails
    if (currentImages.length > 1) {
      if (sliderPrev) sliderPrev.style.display = 'flex';
      if (sliderNext) sliderNext.style.display = 'flex';
      if (sliderCounter) sliderCounter.style.display = 'block';
      if (thumbnailsWrap) {
        thumbnailsWrap.style.display = 'flex';
        thumbnailsWrap.innerHTML = currentImages.map((src, i) => `
          <button type="button" class="modal-thumb-btn ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="ดูรูปที่ ${i + 1}">
            <img src="${src}" alt="Thumbnail ${i + 1}">
          </button>
        `).join('');
        thumbnailsWrap.querySelectorAll('.modal-thumb-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            updateGallery(parseInt(btn.getAttribute('data-idx')));
          });
        });
      }
    } else {
      if (sliderPrev) sliderPrev.style.display = 'none';
      if (sliderNext) sliderNext.style.display = 'none';
      if (sliderCounter) sliderCounter.style.display = 'none';
      if (thumbnailsWrap) {
        thumbnailsWrap.style.display = 'none';
        thumbnailsWrap.innerHTML = '';
      }
    }
    updateGallery(0);

    // Render Specs Table
    if (modalSpecs) {
      if (data.specs && data.specs.length) {
        let tableHtml = '<table class="product-modal-spec-table"><tbody>';
        data.specs.forEach(spec => {
          let valHtml = spec.val;
          if (typeof valHtml === 'string' && valHtml.includes(',')) {
            valHtml = valHtml.split(',').map((part, idx, arr) => {
              const trimmed = part.trim();
              const separator = idx < arr.length - 1 ? ',' : '';
              return `<span class="spec-phrase">${trimmed}${separator}</span>`;
            }).join(' ');
          }
          tableHtml += `<tr><td class="spec-name">${spec.name}</td><td class="spec-val">${valHtml}</td></tr>`;
        });
        tableHtml += '</tbody></table>';
        modalSpecs.innerHTML = tableHtml;
        modalSpecs.style.display = 'block';
      } else {
        modalSpecs.innerHTML = '';
        modalSpecs.style.display = 'none';
      }
    }

    // Render Key Features / Badges if any
    if (modalFeatures) {
      if (data.features && data.features.length) {
        let featHtml = '<div class="product-modal-features-head"><h4 class="product-modal-features-title">จุดเด่น</h4></div><div class="product-modal-features-badges">';
        data.features.forEach(feat => {
          let title = '';
          let desc = '';
          if (typeof feat === 'object') {
            title = feat.title || '';
            desc = feat.desc || '';
          } else if (typeof feat === 'string') {
            if (feat.includes(':')) {
              const parts = feat.split(':');
              title = parts[0].trim();
              desc = parts.slice(1).join(':').trim();
            } else {
              title = feat.trim();
            }
          }

          featHtml += `
            <div class="feature-badge-card">
              <span class="feature-badge-icon-wrap">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <div class="feature-badge-text-wrap">
                <span class="feature-badge-title">${title}</span>
                ${desc ? `<span class="feature-badge-desc">${desc}</span>` : ''}
              </div>
            </div>
          `;
        });
        featHtml += '</div>';
        modalFeatures.innerHTML = featHtml;
        modalFeatures.style.display = 'block';
      } else {
        modalFeatures.innerHTML = '';
        modalFeatures.style.display = 'none';
      }
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  if (sliderPrev) {
    sliderPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGallery(currentIdx - 1);
    });
  }

  if (sliderNext) {
    sliderNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGallery(currentIdx + 1);
    });
  }

  // Keyboard navigation for slider
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft') {
      updateGallery(currentIdx - 1);
    } else if (e.key === 'ArrowRight') {
      updateGallery(currentIdx + 1);
    } else if (e.key === 'Escape') {
      closeModal();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.querySelectorAll('.product-item-wrapper[data-product-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-slider-nav')) return;
      e.preventDefault();
      const productId = card.getAttribute('data-product-id');
      if (productId) {
        openModal(productId);
      }
    });
  });

  initCardSliders();
}

/* Interactive Card Sliders on Catalog Grid */
function initCardSliders() {
  document.querySelectorAll('.product-item-wrapper[data-product-id]').forEach(card => {
    const productId = card.getAttribute('data-product-id');
    const data = PRODUCTS_DATA[productId];
    if (!data || !data.images || data.images.length <= 1) return;

    const imgWrapper = card.querySelector('.product-img-wrapper');
    const imgEl = imgWrapper ? imgWrapper.querySelector('img') : null;
    if (!imgWrapper || !imgEl) return;

    if (imgWrapper.querySelector('.card-slider-nav')) return;

    imgWrapper.style.position = 'relative';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'card-slider-nav card-slider-prev';
    prevBtn.setAttribute('aria-label', 'รูปก่อนหน้า');
    prevBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'card-slider-nav card-slider-next';
    nextBtn.setAttribute('aria-label', 'รูปถัดไป');
    nextBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

    const badge = document.createElement('span');
    badge.className = 'card-slider-badge';
    badge.innerText = `1/${data.images.length}`;

    imgWrapper.appendChild(prevBtn);
    imgWrapper.appendChild(nextBtn);
    imgWrapper.appendChild(badge);

    let cardIdx = 0;
    function setCardImage(newIdx) {
      cardIdx = (newIdx + data.images.length) % data.images.length;
      imgEl.src = data.images[cardIdx];
      badge.innerText = `${cardIdx + 1}/${data.images.length}`;
    }

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setCardImage(cardIdx - 1);
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setCardImage(cardIdx + 1);
    });
  });
}

/* Ensure comma-separated spec phrases never break mid-word */
function initSpecPhraseWrapping() {
  document.querySelectorAll('.product-card-spec-val').forEach(el => {
    const text = el.innerText || '';
    if (text.includes(',')) {
      const parts = text.split(',').map((part, idx, arr) => {
        const trimmed = part.trim();
        const sep = idx < arr.length - 1 ? ',' : '';
        return `<span class="spec-phrase">${trimmed}${sep}</span>`;
      });
      el.innerHTML = parts.join(' ');
    }
  });
}


