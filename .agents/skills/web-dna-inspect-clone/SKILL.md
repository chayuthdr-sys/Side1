---
name: web-dna-inspect-clone
description: >-
  Runbook and methodology for reverse-engineering and cloning or synthesizing corporate
  websites using Terminal-based DevTools Inspect Mode (Headless Chrome + Puppeteer-Core),
  automated asset downloading, computed CSS color distribution auditing, and zero-hallucination
  design synthesis.
---

# Web DNA Inspect & Synthesis Skill

This skill teaches agents how to reverse-engineer, inspect, extract, and synthesize corporate websites directly from the terminal without guessing, hallucinating styles, or using synthetic placeholders.

---

## 1. The Core Principle: Zero-Hallucination Brand Discovery

When a user asks to clone, re-theme, or build a corporate website based on real websites:
- **NEVER assume or hallucinate brand colors:** Never guess colors based on industry stereotypes (e.g., assuming a heater manufacturer uses orange/yellow when their actual identity is pure white, cyan, and deep navy).
- **NEVER use emojis as icons:** Emojis look amateurish and childish on professional B2B websites. All icons MUST be clean, formal, lightweight vector SVGs with cohesive stroke widths and consistent design language.
- **NEVER use generic placeholder SVGs for products:** Real corporate clients judge authenticity by their actual products, real logo, and genuine employee/factory photos.
- **Computed Styles are Ground Truth:** Inspect the actual computed styles and rendered DOM via a headless browser before writing CSS or HTML.

---

## 2. Terminal-Based DevTools Inspect Workflow

When operating in a terminal-first environment, you can run a complete Chrome DevTools inspection programmatically.

### Step 2.1: Locate Local Browser Executables
Windows machines invariably have Chrome or Edge pre-installed:
- Chrome: `C:\Program Files\Google\Chrome\Application\chrome.exe`
- Edge: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

### Step 2.2: Install Lightweight Puppeteer-Core
Never download the heavy Chromium binary. Install `puppeteer-core` in seconds:
```bash
npm install puppeteer-core
```

### Step 2.3: Terminal Inspect Script Template
Create an inspection script (e.g., `deep_inspect.js`) that runs headless Chrome and evaluates computed styles:

```javascript
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspect(url) {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Capture Viewport Screenshot
  await page.screenshot({ path: 'site_screenshot.png' });

  // 2. Extract Computed Styles & Real DNA
  const data = await page.evaluate(() => {
    function rgbToHex(rgb) {
      if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return null;
      const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return rgb;
      return '#' + [m[1], m[2], m[3]].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('').toLowerCase();
    }

    const all = Array.from(document.querySelectorAll('*'));
    const colorUsage = {}, bgUsage = {}, fontUsage = {};

    all.forEach(el => {
      const cs = window.getComputedStyle(el);
      const c = rgbToHex(cs.color);
      const bg = rgbToHex(cs.backgroundColor);
      if (c) colorUsage[c] = (colorUsage[c] || 0) + 1;
      if (bg) bgUsage[bg] = (bgUsage[bg] || 0) + 1;
      if (cs.fontFamily) fontUsage[cs.fontFamily] = (fontUsage[cs.fontFamily] || 0) + 1;
    });

    // Extract genuine images
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height
    })).filter(img => img.src && !img.src.startsWith('data:image/svg'));

    // Extract headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5')).map(h => ({
      tag: h.tagName.toLowerCase(),
      text: h.innerText.trim(),
      color: rgbToHex(window.getComputedStyle(h).color),
      weight: window.getComputedStyle(h).fontWeight,
      size: window.getComputedStyle(h).fontSize
    })).filter(h => h.text.length > 0);

    return { colorUsage, bgUsage, fontUsage, images, headings };
  });

  fs.writeFileSync('rendered_dom.html', await page.content());
  fs.writeFileSync('inspect_dna.json', JSON.stringify(data, null, 2));
  await browser.close();
}
```

---

## 3. Automated Asset Ingestion (Zero-Placeholder Policy)

After inspecting, download all genuine media assets directly into the workspace:
1. **Logo & Favicon:** Extract both light and dark logos, crop or preserve exact dimensions.
2. **Product Catalog Photos:** Download actual product shots and save to `assets/images/`.
3. **Company & Engineering Photos:** Download real factory, office, and staff photos (e.g. `EmployeeTeam.png`).

---

## 4. Cross-Site UI Synthesis Pattern

When tasked with: *"Take the modern layout structure of Site A, but apply the brand identity and content of Site B"*:

```
+------------------------------------+   +------------------------------------+
|               SITE A               |   |               SITE B               |
|      (Architecture & UX Model)     |   |    (Brand DNA, Content, Media)     |
+------------------------------------+   +------------------------------------+
| • Sticky Header & Nav hierarchy    |   | • True Color Palette (Computed CSS)|
| • Hero Slider & CTA structure      |   | • Authentic Logo & Favicon         |
| • 3-Column Product Grid Cards      | + | • Real Product Photography         |
| • High-converting RFQ Lead Form    |   | • Authentic Engineering Team Media |
| • Floating Hotline/Chat Widget     |   | • Genuine Technical Specifications |
+------------------------------------+   +------------------------------------+
                                   │
                                   ▼
          +--------------------------------------------------+
          |                 SYNTHESIZED SITE                 |
          |  Structure of A + Verified Brand Identity of B   |
          +--------------------------------------------------+
```

### Critical Rules During Synthesis:
1. **Never bleed colors from Site A into Site B:** If Site A uses red or orange, but Site B uses cyan and navy, all buttons, badges, lines, active links, and accents MUST strictly adhere to Site B's audited palette.
2. **Active Navigation Marker:** Match the exact indicator from the target site (e.g., 3px solid cyan underline).
3. **Typography Weights:** Check the inspected font-weight. If headers use thin/light typography (`font-weight: 300`), do not use heavy bold (`font-weight: 700`) for titles.

---

## 5. Content & Language Best Practices

When localizing or writing copy for the synthesized site:
1. **Parentheses Constraint:** Do not place explanations or English translations in parentheses in body copy; weave them directly into the grammatical flow of the sentence.
2. **Technical Terminology:** Use standard industry transliterations in Thai context:
   - Server: เซิร์ฟเวอร์
   - Browser: เบราว์เซอร์
   - Network: เน็ตเวิร์ก หรือ เครือข่าย
   - Timeout: ไทม์เอาต์ หรือ การหมดเวลาเชื่อมต่อ
   - Operator: โอเปอเรเตอร์ หรือ ผู้ใช้งาน

---

## 6. Verification and Proofing Loop

Before declaring success:
1. Launch local dev server (e.g. `node server.js` on port 3000).
2. Invoke `browser_subagent` to render the page at desktop (1440px) and inspect:
   - Header & active navigation tab
   - Hero banner typography
   - Product cards rendering real images (no broken links or SVG placeholders)
   - Lead quotation form and floating widget
3. Capture visual artifacts and confirm zero color discrepancies.
