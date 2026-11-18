const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Generate base SVG for Sankofa Water icon (droplet + monitoring pulse)
function createSvg(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.2 : size * 0.1;
  const contentSize = size - padding * 2;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#020617"/>
      <g transform="translate(${padding}, ${padding})">
        <svg width="${contentSize}" height="${contentSize}" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#0284c7" />
            </linearGradient>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <!-- Water Droplet -->
          <path d="M50 10 C50 10 20 48 20 68 C20 84.5685 33.4315 98 50 98 C66.5685 98 80 84.5685 80 68 C80 48 50 10 50 10 Z" fill="url(#waterGrad)"/>
          <!-- Inner Wave Accent -->
          <path d="M26 70 C34 64 42 74 50 70 C58 66 66 74 74 68 C73 78 63 88 50 88 C37 88 27 78 26 70 Z" fill="#f8fafc" opacity="0.3"/>
          <!-- Sensor Ring Pulse -->
          <circle cx="50" cy="50" r="42" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6 4" opacity="0.7"/>
        </svg>
      </g>
    </svg>
  `;
}

// Generate screenshot placeholder SVG
function createScreenshotSvg(width, height, title) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#020617"/>
      <!-- Header bar -->
      <rect x="0" y="0" width="${width}" height="64" fill="#0f172a" />
      <circle cx="36" cy="32" r="10" fill="#38bdf8"/>
      <text x="56" y="38" fill="#f8fafc" font-family="sans-serif" font-size="18" font-weight="bold">Sankofa Water — Matjhabeng</text>
      
      <!-- Content grid mockup -->
      <rect x="32" y="96" width="${width - 64}" height="140" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
      <text x="56" y="140" fill="#38bdf8" font-family="sans-serif" font-size="22" font-weight="bold">${title}</text>
      <text x="56" y="170" fill="#94a3b8" font-family="sans-serif" font-size="14">Real-Time Infrastructure Telemetry &amp; Field Dispatch</text>

      <rect x="32" y="260" width="${Math.floor((width - 80) / 2)}" height="200" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
      <rect x="${Math.floor((width - 80) / 2) + 48}" y="260" width="${Math.floor((width - 80) / 2)}" height="200" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    </svg>
  `;
}

async function generateAll() {
  const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
  
  console.log('Generating PWA standard icons...');
  for (const size of iconSizes) {
    const svg = Buffer.from(createSvg(size, false));
    await sharp(svg).png().toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
  }

  console.log('Generating maskable icons...');
  for (const size of [192, 512]) {
    const maskableSvg = Buffer.from(createSvg(size, true));
    await sharp(maskableSvg).png().toFile(path.join(iconsDir, `icon-${size}x${size}-maskable.png`));
  }

  console.log('Generating Apple touch icon & shortcuts...');
  const appleTouchSvg = Buffer.from(createSvg(180, true));
  await sharp(appleTouchSvg).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'));

  const shortcutSvg = Buffer.from(createSvg(96, false));
  await sharp(shortcutSvg).png().toFile(path.join(iconsDir, 'shortcut-dashboard.png'));
  await sharp(shortcutSvg).png().toFile(path.join(iconsDir, 'shortcut-alerts.png'));

  console.log('Generating PWA screenshots...');
  const desktopSvg = Buffer.from(createScreenshotSvg(1280, 720, 'Desktop Telemetry Matrix'));
  await sharp(desktopSvg).png().toFile(path.join(screenshotsDir, 'desktop-dashboard.png'));

  const mobileSvg = Buffer.from(createScreenshotSvg(390, 844, 'Mobile Field Dispatch'));
  await sharp(mobileSvg).png().toFile(path.join(screenshotsDir, 'mobile-dashboard.png'));

  console.log('All PWA assets generated successfully in public/icons/ and public/screenshots/!');
}

generateAll().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
