import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const outDir = join(process.cwd(), "public/images/cards");
mkdirSync(outDir, { recursive: true });

const RARITY_COLORS = {
  common: "#9CA3AF",
  uncommon: "#34D399",
  rare: "#60A5FA",
  epic: "#A78BFA",
  legendary: "#FBBF24",
};

const FACTION_THEMES = {
  dome_dwellers: { bg1: "#0a1020", bg2: "#0f1a30", accent: "#60a5fa", accent2: "#38bdf8" },
  underground_resistance: { bg1: "#0f0a1a", bg2: "#1a0f2a", accent: "#a78bfa", accent2: "#c084fc" },
  surface_survivors: { bg1: "#1a0f0a", bg2: "#2a1a0a", accent: "#f59e0b", accent2: "#ef4444" },
  tech_scavengers: { bg1: "#0a1a15", bg2: "#0f2a20", accent: "#34d399", accent2: "#06b6d4" },
};

const cards = [
  // Dome Dwellers
  { slug: "dome-guardian", rarity: "common", faction: "dome_dwellers", icon: "guardian" },
  { slug: "atmospheric-purifier", rarity: "uncommon", faction: "dome_dwellers", icon: "purifier" },
  { slug: "council-chamber", rarity: "rare", faction: "dome_dwellers", icon: "chamber" },
  { slug: "dome-breach-protocol", rarity: "epic", faction: "dome_dwellers", icon: "breach" },
  // Underground Resistance
  { slug: "tunnel-rat", rarity: "common", faction: "underground_resistance", icon: "tunnelrat" },
  { slug: "signal-jammer", rarity: "rare", faction: "underground_resistance", icon: "jammer" },
  { slug: "deep-warren", rarity: "epic", faction: "underground_resistance", icon: "warren" },
  // Surface Survivors
  { slug: "wasteland-nomad", rarity: "common", faction: "surface_survivors", icon: "nomad" },
  { slug: "rad-storm-warning", rarity: "uncommon", faction: "surface_survivors", icon: "radstorm" },
  { slug: "scrapyard-fortress", rarity: "rare", faction: "surface_survivors", icon: "fortress" },
  { slug: "mutant-warlord", rarity: "legendary", faction: "surface_survivors", icon: "warlord" },
  // Tech Scavengers
  { slug: "chrome-hacker", rarity: "uncommon", faction: "tech_scavengers", icon: "hacker" },
  { slug: "quantum-core", rarity: "legendary", faction: "tech_scavengers", icon: "quantumcore" },
  { slug: "neural-uplink-helm", rarity: "legendary", faction: "tech_scavengers", icon: "neuralhelm" },
  // Cross-faction
  { slug: "doomsday-codex", rarity: "legendary", faction: "underground_resistance", icon: "codex" },
];

function getIconSvg(icon, c1, c2) {
  const icons = {
    guardian: `
      <circle cx="200" cy="140" r="28" fill="none" stroke="${c1}" stroke-width="2.5"/>
      <rect x="172" y="168" width="56" height="80" rx="6" fill="none" stroke="${c1}" stroke-width="2"/>
      <line x1="172" y1="200" x2="140" y2="230" stroke="${c1}" stroke-width="2.5"/>
      <line x1="228" y1="200" x2="260" y2="230" stroke="${c1}" stroke-width="2.5"/>
      <polygon points="140,230 130,260 150,255" fill="${c2}" opacity="0.5"/>
      <polygon points="260,230 270,260 250,255" fill="${c2}" opacity="0.5"/>
      <rect x="185" y="248" width="12" height="25" fill="${c1}" opacity="0.4"/>
      <rect x="203" y="248" width="12" height="25" fill="${c1}" opacity="0.4"/>
      <ellipse cx="200" cy="100" rx="50" ry="20" fill="none" stroke="${c2}" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.5"/>`,

    purifier: `
      <rect x="160" y="120" width="80" height="120" rx="12" fill="none" stroke="${c1}" stroke-width="2"/>
      <circle cx="200" cy="170" r="25" fill="none" stroke="${c2}" stroke-width="2"/>
      <circle cx="200" cy="170" r="12" fill="${c2}" opacity="0.2"/>
      <path d="M200,145 L200,120" stroke="${c2}" stroke-width="2"/>
      <path d="M200,195 L200,220" stroke="${c2}" stroke-width="2"/>
      <line x1="175" y1="170" x2="160" y2="170" stroke="${c2}" stroke-width="1.5"/>
      <line x1="225" y1="170" x2="240" y2="170" stroke="${c2}" stroke-width="1.5"/>
      <path d="M170,240 Q200,260 230,240" fill="none" stroke="${c1}" stroke-width="1.5"/>
      <circle cx="200" cy="170" r="5" fill="${c2}" opacity="0.6"/>
      <line x1="160" y1="105" x2="160" y2="90" stroke="${c1}" stroke-width="2"/>
      <line x1="240" y1="105" x2="240" y2="90" stroke="${c1}" stroke-width="2"/>
      <circle cx="160" cy="87" r="4" fill="${c2}" opacity="0.4"/>
      <circle cx="240" cy="87" r="4" fill="${c2}" opacity="0.4"/>`,

    chamber: `
      <path d="M130,250 L130,140 L200,100 L270,140 L270,250 Z" fill="none" stroke="${c1}" stroke-width="2"/>
      <line x1="200" y1="100" x2="200" y2="250" stroke="${c1}" stroke-width="1.5" stroke-dasharray="4,4"/>
      <circle cx="200" cy="170" r="20" fill="none" stroke="${c2}" stroke-width="2"/>
      <circle cx="200" cy="170" r="8" fill="${c2}" opacity="0.3"/>
      <rect x="145" y="210" width="20" height="40" rx="4" fill="none" stroke="${c1}" stroke-width="1.5"/>
      <rect x="235" y="210" width="20" height="40" rx="4" fill="none" stroke="${c1}" stroke-width="1.5"/>
      <polygon points="200,100 195,85 205,85" fill="${c2}"/>
      <line x1="130" y1="250" x2="270" y2="250" stroke="${c1}" stroke-width="2"/>`,

    breach: `
      <circle cx="200" cy="180" r="60" fill="none" stroke="${c1}" stroke-width="2.5"/>
      <circle cx="200" cy="180" r="40" fill="none" stroke="${c1}" stroke-width="1.5" stroke-dasharray="6,4"/>
      <path d="M175,145 L160,120" stroke="${c2}" stroke-width="3"/>
      <path d="M225,145 L240,120" stroke="${c2}" stroke-width="3"/>
      <path d="M155,195 L125,205" stroke="${c2}" stroke-width="3"/>
      <path d="M245,195 L275,205" stroke="${c2}" stroke-width="3"/>
      <polygon points="200,180 190,165 210,165" fill="${c2}" opacity="0.5"/>
      <polygon points="200,180 190,195 210,195" fill="${c2}" opacity="0.5"/>
      <polygon points="200,180 185,180 185,175" fill="${c2}" opacity="0.3"/>
      <polygon points="200,180 215,180 215,175" fill="${c2}" opacity="0.3"/>
      <circle cx="200" cy="180" r="8" fill="${c2}" opacity="0.4"/>`,

    tunnelrat: `
      <circle cx="200" cy="145" r="22" fill="none" stroke="${c1}" stroke-width="2"/>
      <path d="M180,167 L175,260 L200,255 L225,260 L220,167" fill="none" stroke="${c1}" stroke-width="2"/>
      <line x1="200" y1="190" x2="165" y2="220" stroke="${c1}" stroke-width="2"/>
      <line x1="200" y1="190" x2="235" y2="210" stroke="${c1}" stroke-width="2"/>
      <circle cx="192" cy="140" r="4" fill="${c2}"/>
      <circle cx="208" cy="140" r="4" fill="${c2}"/>
      <path d="M120,270 Q160,230 200,260 Q240,230 280,270" fill="none" stroke="${c1}" stroke-width="1.5" opacity="0.4"/>
      <path d="M100,290 Q160,250 200,280 Q240,250 300,290" fill="none" stroke="${c1}" stroke-width="1" opacity="0.2"/>`,

    jammer: `
      <rect x="165" y="130" width="70" height="100" rx="8" fill="none" stroke="${c1}" stroke-width="2"/>
      <circle cx="200" cy="170" r="20" fill="none" stroke="${c2}" stroke-width="2"/>
      <line x1="200" y1="150" x2="200" y2="130" stroke="${c2}" stroke-width="2"/>
      <line x1="200" y1="100" x2="200" y2="130" stroke="${c1}" stroke-width="2"/>
      <line x1="190" y1="100" x2="210" y2="100" stroke="${c1}" stroke-width="2"/>
      <path d="M170,100 Q200,80 230,100" fill="none" stroke="${c2}" stroke-width="1.5" stroke-dasharray="3,3"/>
      <path d="M155,90 Q200,60 245,90" fill="none" stroke="${c2}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
      <line x1="183" y1="170" x2="175" y2="170" stroke="${c2}" stroke-width="2"/>
      <line x1="217" y1="170" x2="225" y2="170" stroke="${c2}" stroke-width="2"/>
      <circle cx="200" cy="170" r="6" fill="${c2}" opacity="0.4"/>
      <line x1="200" y1="230" x2="200" y2="260" stroke="${c1}" stroke-width="1.5"/>
      <ellipse cx="200" cy="265" rx="15" ry="5" fill="none" stroke="${c1}" stroke-width="1.5"/>`,

    warren: `
      <path d="M120,280 L140,200 L170,220 L200,160 L230,220 L260,200 L280,280 Z" fill="none" stroke="${c1}" stroke-width="2"/>
      <rect x="180" y="200" width="40" height="50" rx="6" fill="none" stroke="${c2}" stroke-width="2"/>
      <line x1="200" y1="200" x2="200" y2="160" stroke="${c2}" stroke-width="1.5"/>
      <circle cx="200" cy="155" r="8" fill="${c2}" opacity="0.3"/>
      <path d="M140,200 Q130,170 150,150" fill="none" stroke="${c1}" stroke-width="1.5" opacity="0.5"/>
      <path d="M260,200 Q270,170 250,150" fill="none" stroke="${c1}" stroke-width="1.5" opacity="0.5"/>
      <rect x="185" y="230" width="12" height="20" rx="3" fill="${c2}" opacity="0.2"/>
      <rect x="203" y="230" width="12" height="20" rx="3" fill="${c2}" opacity="0.2"/>
      <line x1="120" y1="280" x2="280" y2="280" stroke="${c1}" stroke-width="2"/>`,

    nomad: `
      <circle cx="200" cy="140" r="22" fill="none" stroke="${c1}" stroke-width="2"/>
      <path d="M178,162 L168,275 L200,265 L232,275 L222,162" fill="none" stroke="${c1}" stroke-width="2"/>
      <line x1="200" y1="120" x2="235" y2="90" stroke="${c2}" stroke-width="1.5"/>
      <circle cx="238" cy="87" r="6" fill="${c2}" opacity="0.4"/>
      <line x1="200" y1="195" x2="165" y2="230" stroke="${c1}" stroke-width="2"/>
      <line x1="200" y1="195" x2="235" y2="230" stroke="${c1}" stroke-width="2"/>
      <path d="M130,290 Q200,270 270,290" fill="none" stroke="${c1}" stroke-width="1" opacity="0.3"/>
      <path d="M110,300 Q200,275 290,300" fill="none" stroke="${c1}" stroke-width="1" opacity="0.15"/>`,

    radstorm: `
      <path d="M140,160 L200,100 L260,160" fill="none" stroke="${c2}" stroke-width="2.5"/>
      <path d="M120,200 L200,140 L280,200" fill="none" stroke="${c1}" stroke-width="2" opacity="0.6"/>
      <path d="M100,240 L200,180 L300,240" fill="none" stroke="${c1}" stroke-width="1.5" opacity="0.3"/>
      <polygon points="200,170 190,200 210,190 195,230 220,195 200,210" fill="${c2}" opacity="0.6" stroke="${c2}" stroke-width="1.5"/>
      <circle cx="140" cy="120" r="2" fill="${c2}" opacity="0.6"/>
      <circle cx="260" cy="130" r="1.5" fill="${c2}" opacity="0.5"/>
      <circle cx="170" cy="250" r="2" fill="${c1}" opacity="0.4"/>
      <circle cx="240" cy="260" r="1.8" fill="${c1}" opacity="0.3"/>`,

    fortress: `
      <rect x="140" y="150" width="120" height="110" rx="4" fill="none" stroke="${c1}" stroke-width="2.5"/>
      <rect x="175" y="220" width="50" height="40" rx="4" fill="none" stroke="${c2}" stroke-width="2"/>
      <rect x="150" y="130" width="25" height="30" rx="2" fill="none" stroke="${c1}" stroke-width="2"/>
      <rect x="225" y="130" width="25" height="30" rx="2" fill="none" stroke="${c1}" stroke-width="2"/>
      <polygon points="162,130 162,110 150,130" fill="${c2}" opacity="0.5"/>
      <polygon points="237,130 237,110 250,130" fill="${c2}" opacity="0.5"/>
      <rect x="155" y="170" width="15" height="15" fill="none" stroke="${c2}" stroke-width="1.5"/>
      <rect x="230" y="170" width="15" height="15" fill="none" stroke="${c2}" stroke-width="1.5"/>
      <line x1="140" y1="260" x2="260" y2="260" stroke="${c1}" stroke-width="2.5"/>
      <line x1="130" y1="260" x2="270" y2="260" stroke="${c1}" stroke-width="1" opacity="0.5"/>`,

    warlord: `
      <circle cx="200" cy="135" r="30" fill="none" stroke="${c1}" stroke-width="3"/>
      <circle cx="190" cy="130" r="6" fill="${c2}"/>
      <circle cx="215" cy="128" r="8" fill="${c2}" opacity="0.7"/>
      <line x1="200" y1="165" x2="200" y2="270" stroke="${c1}" stroke-width="3"/>
      <line x1="200" y1="195" x2="145" y2="240" stroke="${c1}" stroke-width="3"/>
      <line x1="200" y1="195" x2="255" y2="240" stroke="${c1}" stroke-width="3"/>
      <polygon points="255,240 280,220 270,250" fill="${c2}" opacity="0.6"/>
      <polygon points="145,240 120,220 130,250" fill="${c2}" opacity="0.6"/>
      <path d="M175,105 L185,80 L195,100" fill="none" stroke="${c2}" stroke-width="2"/>
      <path d="M205,100 L215,78 L225,105" fill="none" stroke="${c2}" stroke-width="2"/>
      <rect x="185" y="270" width="12" height="20" fill="${c1}" opacity="0.4"/>
      <rect x="203" y="270" width="12" height="20" fill="${c1}" opacity="0.4"/>`,

    hacker: `
      <rect x="155" y="125" width="90" height="65" rx="6" fill="none" stroke="${c1}" stroke-width="2"/>
      <rect x="165" y="135" width="70" height="45" rx="3" fill="${c2}" opacity="0.1"/>
      <line x1="170" y1="148" x2="195" y2="148" stroke="${c2}" stroke-width="1.5"/>
      <line x1="170" y1="158" x2="210" y2="158" stroke="${c2}" stroke-width="1" opacity="0.6"/>
      <line x1="170" y1="168" x2="185" y2="168" stroke="${c2}" stroke-width="1" opacity="0.4"/>
      <rect x="175" y="195" width="50" height="6" rx="3" fill="none" stroke="${c1}" stroke-width="1.5"/>
      <circle cx="200" cy="240" r="22" fill="none" stroke="${c1}" stroke-width="2"/>
      <circle cx="192" cy="235" r="4" fill="${c2}"/>
      <circle cx="208" cy="235" r="4" fill="${c2}"/>
      <path d="M190,248 Q200,255 210,248" fill="none" stroke="${c1}" stroke-width="1.5"/>
      <line x1="200" y1="218" x2="200" y2="201" stroke="${c1}" stroke-width="1.5"/>`,

    quantumcore: `
      <polygon points="200,100 250,140 250,220 200,260 150,220 150,140" fill="none" stroke="${c1}" stroke-width="3"/>
      <polygon points="200,120 235,148 235,212 200,240 165,212 165,148" fill="none" stroke="${c2}" stroke-width="1.5"/>
      <circle cx="200" cy="180" r="20" fill="${c2}" opacity="0.2"/>
      <circle cx="200" cy="180" r="10" fill="${c2}" opacity="0.4"/>
      <circle cx="200" cy="180" r="4" fill="${c2}" opacity="0.8"/>
      <line x1="200" y1="100" x2="200" y2="80" stroke="${c1}" stroke-width="2"/>
      <line x1="250" y1="140" x2="268" y2="130" stroke="${c1}" stroke-width="1.5"/>
      <line x1="250" y1="220" x2="268" y2="230" stroke="${c1}" stroke-width="1.5"/>
      <line x1="150" y1="140" x2="132" y2="130" stroke="${c1}" stroke-width="1.5"/>
      <line x1="150" y1="220" x2="132" y2="230" stroke="${c1}" stroke-width="1.5"/>
      <line x1="200" y1="260" x2="200" y2="280" stroke="${c1}" stroke-width="2"/>`,

    neuralhelm: `
      <ellipse cx="200" cy="160" rx="45" ry="40" fill="none" stroke="${c1}" stroke-width="2.5"/>
      <path d="M160,175 Q200,210 240,175" fill="none" stroke="${c1}" stroke-width="2"/>
      <circle cx="185" cy="155" r="10" fill="none" stroke="${c2}" stroke-width="2"/>
      <circle cx="215" cy="155" r="10" fill="none" stroke="${c2}" stroke-width="2"/>
      <circle cx="185" cy="155" r="4" fill="${c2}" opacity="0.5"/>
      <circle cx="215" cy="155" r="4" fill="${c2}" opacity="0.5"/>
      <line x1="200" y1="120" x2="200" y2="90" stroke="${c2}" stroke-width="2"/>
      <line x1="200" y1="90" x2="185" y2="80" stroke="${c2}" stroke-width="1.5"/>
      <line x1="200" y1="90" x2="215" y2="80" stroke="${c2}" stroke-width="1.5"/>
      <line x1="200" y1="90" x2="200" y2="75" stroke="${c2}" stroke-width="1.5"/>
      <path d="M160,175 L155,220 L200,230 L245,220 L240,175" fill="none" stroke="${c1}" stroke-width="1.5" stroke-dasharray="4,3"/>`,

    codex: `
      <rect x="155" y="110" width="90" height="130" rx="6" fill="none" stroke="${c1}" stroke-width="2.5"/>
      <line x1="175" y1="110" x2="175" y2="240" stroke="${c1}" stroke-width="1.5"/>
      <line x1="185" y1="135" x2="230" y2="135" stroke="${c2}" stroke-width="1"/>
      <line x1="185" y1="150" x2="225" y2="150" stroke="${c2}" stroke-width="1" opacity="0.7"/>
      <line x1="185" y1="165" x2="220" y2="165" stroke="${c2}" stroke-width="1" opacity="0.5"/>
      <line x1="185" y1="180" x2="228" y2="180" stroke="${c2}" stroke-width="1" opacity="0.4"/>
      <circle cx="207" cy="210" r="15" fill="none" stroke="${c2}" stroke-width="1.5"/>
      <polygon points="207,200 212,208 207,205 202,208" fill="${c2}" opacity="0.5"/>
      <rect x="150" y="115" width="6" height="20" rx="3" fill="${c1}" opacity="0.4"/>
      <rect x="150" y="145" width="6" height="20" rx="3" fill="${c1}" opacity="0.4"/>
      <rect x="150" y="175" width="6" height="20" rx="3" fill="${c1}" opacity="0.4"/>`,
  };
  return icons[icon] || "";
}

function generateCardSvg(card) {
  const theme = FACTION_THEMES[card.faction];
  const rarityColor = RARITY_COLORS[card.rarity];
  const isLegendary = card.rarity === "legendary";
  const isEpic = card.rarity === "epic";

  const glowOpacity = isLegendary ? 0.4 : isEpic ? 0.25 : 0.15;
  const borderWidth = isLegendary ? 3 : isEpic ? 2 : 1;
  const borderOpacity = isLegendary ? 0.8 : isEpic ? 0.6 : 0.3;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${theme.bg2}"/>
      <stop offset="100%" stop-color="${theme.bg1}"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="${rarityColor}" stop-opacity="${glowOpacity}"/>
      <stop offset="100%" stop-color="${rarityColor}" stop-opacity="0"/>
    </radialGradient>
    ${isLegendary ? `<linearGradient id="lb" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="50%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>` : ""}
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <ellipse cx="200" cy="180" rx="150" ry="120" fill="url(#glow)"/>
  <circle cx="80" cy="60" r="1.5" fill="${theme.accent}" opacity="0.4"/>
  <circle cx="320" cy="90" r="1" fill="${theme.accent2}" opacity="0.3"/>
  <circle cx="50" cy="300" r="1.2" fill="${rarityColor}" opacity="0.35"/>
  <circle cx="350" cy="280" r="1.8" fill="${theme.accent}" opacity="0.25"/>
  <circle cx="150" cy="350" r="1" fill="${theme.accent2}" opacity="0.3"/>
  <circle cx="300" cy="40" r="1.3" fill="${rarityColor}" opacity="0.3"/>
  <g opacity="0.9">${getIconSvg(card.icon, theme.accent, theme.accent2)}</g>
  <rect x="2" y="2" width="396" height="396" fill="none"
    stroke="${isLegendary ? "url(#lb)" : rarityColor}"
    stroke-width="${borderWidth}" stroke-opacity="${borderOpacity}"/>
</svg>`;
}

for (const card of cards) {
  const svg = generateCardSvg(card);
  writeFileSync(join(outDir, `${card.slug}.svg`), svg);
  console.log(`Generated: ${card.slug}.svg`);
}
console.log(`\nDone! Generated ${cards.length} card images.`);
