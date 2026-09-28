// Monochrome mark: two wheels and an aero frame line. No emoji.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const svg = (pad) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1D2A3A"/>
  <g transform="translate(${pad / 2},${pad / 2}) scale(${(512 - pad) / 512})" fill="none" stroke="#EEF1F4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="146" cy="318" r="78" stroke-width="24"/>
    <circle cx="366" cy="318" r="78" stroke-width="24"/>
    <path d="M146 318 L226 196 L338 196 L366 318 M226 196 L262 318 L146 318" stroke-width="24"/>
    <path d="M338 196 L400 170" stroke-width="24"/>
  </g>
</svg>`;

mkdirSync("public/icons", { recursive: true });
for (const [name, size, pad] of [["icon-192", 192, 0], ["icon-512", 512, 0], ["maskable-512", 512, 110], ["apple-touch-icon", 180, 0]]) {
  await sharp(Buffer.from(svg(pad))).resize(size, size).png().toFile(`public/icons/${name}.png`);
  console.log("wrote", name);
}
