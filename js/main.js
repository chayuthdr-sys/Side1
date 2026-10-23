/* Main JavaScript Controller for S. Permpoon Heattech */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initNavigation();
  initLanguageSwitcher();
  initProductFilter();
  initProductModal();
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

/* Products Database for Interactive Modal */
const PRODUCTS_DATA = {
  thermocouple: {
    id: 'thermocouple',
    title: 'Thermocouple',
    subtitle: 'เซนเซอร์วัดอุณหภูมิเทอร์โมคับเปิ้ล',
    category: 'หัววัดอุณหภูมิและเซนเซอร์',
    image: 'assets/images/image-28.png',
    desc: 'เซนเซอร์วัดอุณหภูมิที่ทำจากโลหะต่างชนิดกัน 2 เส้น (ขั้วบวกขั้วลบ) ใช้หลักการเปลี่ยนแปลงค่าอุณหภูมิเป็นค่าความต่างศักย์',
    specs: [
      { name: 'Type', val: 'K, J, R, S, T,E' },
      { name: 'วัสดุ', val: 'สแตนเลส SUS304, SUS316, SUS310S, Incoloy600, Incoloy610' },
      { name: 'ย่านวัดอุณหภูมิ ( ºC)', val: '-40 ถึง 1600' }
    ]
  },
  rtd: {
    id: 'rtd',
    title: 'RTD PT-100',
    subtitle: 'อุปกรณ์วัดอุณหภูมิความแม่นยำสูง',
    category: 'หัววัดอุณหภูมิและเซนเซอร์',
    image: 'assets/images/image-28.png',
    desc: 'อุปกรณ์วัดอุณหภูมิที่มีค่าความต้านทาน 100 โอห์มที่ 0°C โครงสร้างหลักเป็นขดลวดแพลทินัมจึงให้ความแม่นยำและเสถียรสูง เหมาะกับงานที่ต้องการควบคุมคุณภาพในอุตสาหกรรม',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส SUS304, SUS316' },
      { name: 'ย่านวัดอุณหภูมิ ( ºC)', val: '-200 ถึง 500' }
    ]
  },
  'band-heater': {
    id: 'band-heater',
    title: 'Band Heater',
    subtitle: 'ฮีตเตอร์รัดท่อ',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/cropped-image-19-e1752382785519-1.png',
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
    image: 'assets/images/cropped-image-19-e1752382785519-1.png',
    desc: 'คือ อุปกรณ์ให้ความร้อนในอุณหภูมิปานกลางถึงอุณหภูมิสูงแก่ชิ้นงานที่มีลักษณะเป็นทรงกระบอก เช่น ท่อ ถัง หรือหัวฉีดเครื่องจักร โดยใช้หลักการนำความร้อน',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส' },
      { name: 'ลักษณะขั้วต่อไฟ', val: 'ออกขั้วสาย, ออกขั้วปลั๊ก, ออกขั้วเต๋า, ออกขั้วน็อต' },
      { name: 'ผลิตแรงดันไฟฟ้า', val: '55 VDC/AC – 420 VDC/AC' }
    ]
  },
  'immersion-heater': {
    id: 'immersion-heater',
    title: 'Immersion Heater',
    subtitle: 'ฮีตเตอร์ต้มน้ำ',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/cropped-image-22-1.png',
    desc: 'อุปกรณ์ทำความร้อนไฟฟ้าที่ใช้สำหรับจุ่มลงไปในของเหลวโดยตรง (เช่น น้ำ น้ำประปา น้ำมัน หรือสารเคมีบางชนิด) เพื่อเปลี่ยนพลังงานไฟฟ้าเป็นความร้อนและถ่ายเทเข้าสู่ของเหลวนั้น ๆ ได้อย่างรวดเร็วและสม่ำเสมอ',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส SUS304, SUS316, SUS310S, Incoloy840, Incoloy800' },
      { name: 'ผลิตแรงดันไฟฟ้า', val: '55 VDC/AC – 420 VDC/AC' },
      { name: 'U', val: '1U, 2U, 3U, 6U, 9U, 12U, 15U, 18U' },
      { name: 'ลักษณะการต่อสะพานไฟ', val: 'แบบสตาร์ (220/380V) และ แบบเดลตต้า (380V)' }
    ]
  },
  'cartridge-heater': {
    id: 'cartridge-heater',
    title: 'Cartridge Heater',
    subtitle: 'ฮีตเตอร์แท่ง',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/spt-banner-products-4k.png',
    desc: 'อุปกรณ์ให้ความร้อนแก่ชิ้นงานโดยใช้หลักการนำความร้อน แปลงพลังงานไฟฟ้าเป็นความร้อนผ่านขดลวดนิโครม (Ni-Cr) ที่อยู่ภายในปลอกโลหะทรงกระบอก',
    specs: [
      { name: 'วัสดุปลอก', val: 'สแตนเลส (SUS304, SUS316L) หรือ Incoloy' },
      { name: 'ผลิตแรงดันไฟฟ้า', val: '55 VDC/AC – 420 VDC/AC' }
    ]
  },
  'finned-heater': {
    id: 'finned-heater',
    title: 'Finned Heater',
    subtitle: 'ฮีตเตอร์ครีบ',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/cropped-image-22-1.png',
    desc: 'คืออุปกรณ์ให้ความร้อนในงานอุตสาหกรรมที่พัฒนามาจากฮีตเตอร์ท่อกลม (Tubular Heater) โดยมีการติดตั้งแผ่นครีบ (Fins) เพิ่มรอบตัวท่อ เพื่อช่วยเพิ่มพื้นที่ผิวและระบายความร้อนสู่อากาศได้รวดเร็วและสม่ำเสมอยิ่งขึ้นและมีอายุการใช้งานที่ยาวนานขึ้น ซึ่งสามารถผลิตได้หลากหลายรูปแบบ ทั้งแบบตัวไอ (I) ดัดเป็นตัวยู (U) ดัดเป็นตัวดับบลิว (W) รวมถึงดัดเป็นรูป ตามต้องการ',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส SUS304, SUS316, SUS310S, Incoloy840, Incoloy800' },
      { name: 'ผลิตแรงดันไฟฟ้า', val: '55 VDC/AC – 420 VDC/AC' },
      { name: 'ลักษณะการต่อสะพานไฟ', val: 'แบบสตาร์ (220/380V) และ แบบเดลตต้า (380V)' }
    ]
  },
  'tubular-heater': {
    id: 'tubular-heater',
    title: 'Tubular Heater',
    subtitle: 'ฮีตเตอร์ท่อกลม',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/cropped-image-22-1.png',
    desc: 'อุปกรณ์ให้ความร้อนในงานอุตสาหกรรม และงานระบบต่างๆ ที่เปลี่ยนพลังงานไฟฟ้าเป็นพลังงานความร้อน โดยมีลักษณะเป็นท่อโลหะรูปทรงกระบอก สามารถดัดโค้งงอเป็นรูปทรงต่างๆ ได้ตามความต้องการ',
    specs: [
      { name: 'วัสดุ', val: 'สแตนเลส (SUS304, SUS316L) หรือ Incoloy' },
      { name: 'ขนาดท่อ', val: '8 mm, 11 mm., 14 mm.' },
      { name: 'กำลังไฟฟ้า', val: '110VAC – 420 VAC' }
    ]
  },
  'level-switch': {
    id: 'level-switch',
    title: 'Level Switch',
    subtitle: 'ลูกลอย (Float Switch)',
    category: 'ลูกลอยวัดระดับของเหลว',
    image: 'assets/images/cropped-image-20-1.png',
    desc: 'อุปกรณ์ตรวจจับระดับของเหลว เช่น น้ำหรือน้ำมัน ภายในถังเก็บหรือบ่อน้ำ เพื่อทำหน้าที่เปิดหรือปิดวงจรไฟฟ้าอัตโนมัติ โดยใช้ระดับน้ำเป็นตัวกำหนดการทำงาน เพื่อควบคุมปั๊มน้ำ วาล์ว หรือระบบสัญญาณเตือนภัย',
    features: [
      'ตรวจจับระดับของเหลว เช่น น้ำหรือน้ำมัน ภายในถังเก็บหรือบ่อน้ำ',
      'ทำหน้าที่เปิดหรือปิดวงจรไฟฟ้าอัตโนมัติ โดยใช้ระดับน้ำเป็นตัวกำหนดการทำงาน',
      'ควบคุมปั๊มน้ำ วาล์ว หรือระบบสัญญาณเตือนภัย'
    ]
  },
  'infrared-heater': {
    id: 'infrared-heater',
    title: 'Infrared Heater',
    subtitle: 'ฮีตเตอร์อินฟราเรด',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/spt-banner-products-4k.png',
    desc: 'อุปกรณ์ที่เปลี่ยนพลังงานไฟฟ้าให้กลายเป็นพลังงานความร้อนในรูปของ รังสีอินฟราเรด (Infrared Radiation) ซึ่งเป็นคลื่นแม่เหล็กไฟฟ้าชนิดหนึ่ง',
    features: [
      'ประหยัดพลังงานความร้อน',
      'ให้ความร้อนได้รวดเร็ว',
      'ใช้ในงานอบแห้งต่างๆ'
    ]
  },
  'aluminium-heater': {
    id: 'aluminium-heater',
    title: 'Aluminium Heater',
    subtitle: 'ฮีตเตอร์หล่ออะลูมิเนียม',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/cropped-image-19-e1752382785519-1.png',
    desc: 'อุปกรณ์ทำความร้อนประเภทหนึ่ง ที่นำเอาขดลวดหรือท่อฮีตเตอร์ (Tubular Heater) มาฝังหรือหลอมรวมเป็นเนื้อเดียวกับอลูมิเนียมด้วยกระบวนการหล่อ ออกมาเป็นรูปทรงตามต้องการ',
    features: [
      'การกระจายความร้อนสม่ำเสมอ: ตัวอลูมิเนียมช่วยนำและกระจายความร้อนออกไปได้อย่างรวดเร็วและทั่วถึงทุกพื้นผิว',
      'ความทนทานสูง: แข็งแรงทนทานกว่าฮีตเตอร์ทั่วไป เพราะมีเนื้ออลูมิเนียมห่อหุ้มช่วยป้องกันการกระแทกและยืดอายุการใช้งาน',
      'รับวัตต์และอุณหภูมิได้สูง: สามารถทนกำลังวัตต์และอุณหภูมิสูงได้ดี และอาจมีการออกแบบให้ทำท่อน้ำสำหรับระบายความร้อน (Cooling) ในตัวเดียวกันได้',
      'สั่งทำตามแบบได้: สามารถหล่อขึ้นรูปได้หลายรูปแบบ เช่น ทรงกลม ทรงเหลี่ยม หรือตามลักษณะแม่พิมพ์และเครื่องจักรที่ต้องการใช้งาน'
    ]
  },
  'coil-heater': {
    id: 'coil-heater',
    title: 'Coil Heater',
    subtitle: 'ฮีตเตอร์คอยล์',
    category: 'ฮีตเตอร์อุตสาหกรรม',
    image: 'assets/images/spt-banner-products-4k.png',
    desc: 'อุปกรณ์ทำความร้อนประเภทหนึ่งที่ใช้ลวดความต้านทานไฟฟ้า (เช่น ลวดนิโครม) มาขดเป็นเกลียวหรือรูปทรงคอยล์ เหมาะกับงานที่ต้องการลมร้อนสูง',
    features: [
      'อุปกรณ์ทำความร้อนประเภทหนึ่งที่ใช้ลวดความต้านทานไฟฟ้า (เช่น ลวดนิโครม)',
      'ขดเป็นเกลียวหรือรูปทรงคอยล์',
      'เหมาะกับงานที่ต้องการลมร้อนสูง'
    ]
  }
};

/* Product Detail Interactive Modal Controller */
function initProductModal() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('closeProductModal');
  const productCards = document.querySelectorAll('.product-item-wrapper[data-product-id]');

  if (!modal || !productCards.length) return;

  const modalImg = document.getElementById('modalProductImg');
  const modalTitle = document.getElementById('modalProductTitle');
  const modalSubtitle = document.getElementById('modalProductSubtitle');
  const modalCategory = document.getElementById('modalProductCategory');
  const modalDesc = document.getElementById('modalProductDesc');
  const modalSpecs = document.getElementById('modalProductSpecs');
  const modalFeatures = document.getElementById('modalProductFeatures');

  function openModal(productId) {
    const data = PRODUCTS_DATA[productId];
    if (!data) return;

    if (modalImg) {
      modalImg.src = data.image;
      modalImg.alt = data.title + ' ' + data.subtitle;
    }
    if (modalTitle) modalTitle.innerText = data.title;
    if (modalSubtitle) modalSubtitle.innerText = data.subtitle;
    if (modalCategory) modalCategory.innerText = data.category;
    if (modalDesc) modalDesc.innerText = data.desc;

    // Render Specs Table
    if (modalSpecs) {
      if (data.specs && data.specs.length) {
        let tableHtml = '<table class="product-modal-spec-table"><tbody>';
        data.specs.forEach(spec => {
          tableHtml += `<tr><td class="spec-name">${spec.name}</td><td class="spec-val">${spec.val}</td></tr>`;
        });
        tableHtml += '</tbody></table>';
        modalSpecs.innerHTML = tableHtml;
        modalSpecs.style.display = 'block';
      } else {
        modalSpecs.innerHTML = '';
        modalSpecs.style.display = 'none';
      }
    }

    // Render Key Features / Highlights if any
    if (modalFeatures) {
      if (data.features && data.features.length) {
        let featHtml = '<h4>จุดเด่นและคุณสมบัติพิเศษ</h4><ul>';
        data.features.forEach(feat => {
          featHtml += `<li><span>${feat}</span></li>`;
        });
        featHtml += '</ul>';
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

  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = card.getAttribute('data-product-id');
      if (productId) {
        openModal(productId);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}


