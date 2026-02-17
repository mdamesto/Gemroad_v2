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

const SERIES_THEMES = {
  neon: { bg1: "#0c0a2a", bg2: "#1a0a3a", accent: "#c084fc", accent2: "#38bdf8" },
  desert: { bg1: "#1a0f0a", bg2: "#2a1a0a", accent: "#f59e0b", accent2: "#ef4444" },
  ocean: { bg1: "#0a1520", bg2: "#0a1a2a", accent: "#06b6d4", accent2: "#3b82f6" },
};

const cards = [
  // Ruines de Neon
  { slug: "eclaireur-neon", name: "Eclaireur Neon", rarity: "common", series: "neon", icon: "scout" },
  { slug: "sentinelle-rouillee", name: "Sentinelle Rouillee", rarity: "common", series: "neon", icon: "robot" },
  { slug: "chasseur-fragments", name: "Chasseur de Fragments", rarity: "uncommon", series: "neon", icon: "hunter" },
  { slug: "marchande-ombres", name: "Marchande d'Ombres", rarity: "uncommon", series: "neon", icon: "merchant" },
  { slug: "golem-cables", name: "Golem de Cables", rarity: "rare", series: "neon", icon: "golem" },
  { slug: "spectre-holographique", name: "Spectre Holographique", rarity: "rare", series: "neon", icon: "ghost" },
  { slug: "archonte-neon", name: "Archonte du Neon", rarity: "epic", series: "neon", icon: "archon" },
  { slug: "titan-chrome", name: "Titan Chrome", rarity: "legendary", series: "neon", icon: "titan" },
  // Desert de Cendres
  { slug: "nomade-cendres", name: "Nomade des Cendres", rarity: "common", series: "desert", icon: "nomad" },
  { slug: "scorpion-mutant", name: "Scorpion Mutant", rarity: "common", series: "desert", icon: "scorpion" },
  { slug: "prophete-sable", name: "Prophete du Sable", rarity: "uncommon", series: "desert", icon: "prophet" },
  { slug: "colosse-rouille", name: "Colosse de Rouille", rarity: "rare", series: "desert", icon: "colossus" },
  { slug: "reine-tempetes", name: "Reine des Tempetes", rarity: "epic", series: "desert", icon: "queen" },
  { slug: "leviathan-enseveli", name: "Leviathan Enseveli", rarity: "legendary", series: "desert", icon: "leviathan" },
  // Ocean Toxique
  { slug: "plongeur-aveugle", name: "Plongeur Aveugle", rarity: "common", series: "ocean", icon: "diver" },
  { slug: "meduse-radioactive", name: "Meduse Radioactive", rarity: "common", series: "ocean", icon: "jellyfish" },
  { slug: "pirate-recifs", name: "Pirate des Recifs", rarity: "common", series: "ocean", icon: "pirate" },
  { slug: "sirene-corrompue", name: "Sirene Corrompue", rarity: "uncommon", series: "ocean", icon: "siren" },
  { slug: "requin-blinde", name: "Requin Blinde", rarity: "uncommon", series: "ocean", icon: "shark" },
  { slug: "kraken-petrole", name: "Kraken de Petrole", rarity: "rare", series: "ocean", icon: "kraken" },
  { slug: "amiral-fantome", name: "Amiral Fantome", rarity: "rare", series: "ocean", icon: "admiral" },
  { slug: "hydre-abyssale", name: "Hydre Abyssale", rarity: "epic", series: "ocean", icon: "hydra" },
  { slug: "poseidon-corrompu", name: "Poseidon Corrompu", rarity: "epic", series: "ocean", icon: "poseidon" },
  { slug: "abomination-abysses", name: "Abomination des Abysses", rarity: "legendary", series: "ocean", icon: "abomination" },
];

// Simple geometric icon paths for each card type
function getIconSvg(icon, color, color2) {
  const icons = {
    // Neon series
    scout: `<circle cx="200" cy="160" r="30" fill="none" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="130" x2="200" y2="100" stroke="${color}" stroke-width="2"/>
      <line x1="170" y1="160" x2="140" y2="160" stroke="${color2}" stroke-width="1.5"/>
      <line x1="230" y1="160" x2="260" y2="160" stroke="${color2}" stroke-width="1.5"/>
      <polygon points="185,200 200,240 215,200" fill="${color}" opacity="0.6"/>
      <line x1="200" y1="190" x2="200" y2="280" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="220" x2="160" y2="250" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="220" x2="240" y2="250" stroke="${color}" stroke-width="2"/>`,

    robot: `<rect x="170" y="120" width="60" height="70" rx="8" fill="none" stroke="${color}" stroke-width="2"/>
      <circle cx="185" cy="150" r="8" fill="${color2}"/>
      <circle cx="215" cy="150" r="8" fill="${color2}"/>
      <rect x="180" y="190" width="40" height="80" rx="4" fill="none" stroke="${color}" stroke-width="2"/>
      <line x1="180" y1="220" x2="150" y2="250" stroke="${color}" stroke-width="2"/>
      <line x1="220" y1="220" x2="250" y2="250" stroke="${color}" stroke-width="2"/>
      <rect x="185" y="270" width="12" height="20" fill="${color}" opacity="0.5"/>
      <rect x="203" y="270" width="12" height="20" fill="${color}" opacity="0.5"/>`,

    hunter: `<circle cx="200" cy="150" r="25" fill="none" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="175" x2="200" y2="260" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="200" x2="160" y2="240" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="200" x2="240" y2="240" stroke="${color}" stroke-width="2"/>
      <line x1="240" y1="240" x2="270" y2="200" stroke="${color2}" stroke-width="2.5"/>
      <polygon points="270,200 280,190 275,205" fill="${color2}"/>`,

    merchant: `<circle cx="200" cy="150" r="25" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M170,180 L200,175 L230,180 L240,280 L160,280 Z" fill="none" stroke="${color}" stroke-width="2"/>
      <ellipse cx="200" cy="240" rx="30" ry="15" fill="none" stroke="${color2}" stroke-width="1.5"/>
      <line x1="200" y1="225" x2="200" y2="255" stroke="${color2}" stroke-width="1.5"/>
      <line x1="185" y1="240" x2="215" y2="240" stroke="${color2}" stroke-width="1.5"/>`,

    golem: `<rect x="160" y="130" width="80" height="90" rx="10" fill="none" stroke="${color}" stroke-width="2.5"/>
      <circle cx="185" cy="160" r="10" fill="${color2}"/>
      <circle cx="215" cy="160" r="10" fill="${color2}"/>
      <rect x="155" y="220" width="90" height="60" rx="8" fill="none" stroke="${color}" stroke-width="2.5"/>
      <line x1="155" y1="250" x2="120" y2="270" stroke="${color}" stroke-width="3"/>
      <line x1="245" y1="250" x2="280" y2="270" stroke="${color}" stroke-width="3"/>
      <path d="M170,250 Q200,260 230,250" fill="none" stroke="${color2}" stroke-width="2"/>`,

    ghost: `<ellipse cx="200" cy="180" rx="40" ry="50" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="4,4"/>
      <circle cx="188" cy="170" r="8" fill="${color2}" opacity="0.8"/>
      <circle cx="212" cy="170" r="8" fill="${color2}" opacity="0.8"/>
      <path d="M160,230 Q170,260 180,240 Q190,260 200,240 Q210,260 220,240 Q230,260 240,230" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="4,4"/>`,

    archon: `<polygon points="200,100 240,160 260,240 200,280 140,240 160,160" fill="none" stroke="${color}" stroke-width="2.5"/>
      <circle cx="200" cy="180" r="30" fill="none" stroke="${color2}" stroke-width="2"/>
      <circle cx="200" cy="180" r="15" fill="${color2}" opacity="0.3"/>
      <line x1="200" y1="100" x2="200" y2="80" stroke="${color}" stroke-width="2"/>
      <polygon points="190,80 200,60 210,80" fill="${color}"/>
      <line x1="140" y1="240" x2="120" y2="250" stroke="${color2}" stroke-width="1.5"/>
      <line x1="260" y1="240" x2="280" y2="250" stroke="${color2}" stroke-width="1.5"/>`,

    titan: `<rect x="155" y="110" width="90" height="100" rx="12" fill="none" stroke="${color}" stroke-width="3"/>
      <circle cx="185" cy="150" r="12" fill="${color2}"/>
      <circle cx="215" cy="150" r="12" fill="${color2}"/>
      <line x1="175" y1="180" x2="225" y2="180" stroke="${color}" stroke-width="2"/>
      <rect x="150" y="210" width="100" height="80" rx="8" fill="none" stroke="${color}" stroke-width="3"/>
      <line x1="150" y1="250" x2="110" y2="240" stroke="${color}" stroke-width="4"/>
      <line x1="250" y1="250" x2="290" y2="240" stroke="${color}" stroke-width="4"/>
      <polygon points="190,100 200,70 210,100" fill="${color}"/>
      <polygon points="165,110 155,85 175,110" fill="${color2}" opacity="0.6"/>
      <polygon points="235,110 245,85 225,110" fill="${color2}" opacity="0.6"/>`,

    // Desert series
    nomad: `<circle cx="200" cy="150" r="22" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M178,172 L165,280 L200,270 L235,280 L222,172" fill="none" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="140" x2="230" y2="100" stroke="${color2}" stroke-width="1.5"/>
      <circle cx="230" cy="100" r="5" fill="${color2}" opacity="0.5"/>
      <line x1="165" y1="280" x2="235" y2="280" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,3"/>`,

    scorpion: `<ellipse cx="200" cy="220" rx="45" ry="20" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M245,220 Q280,200 270,160 Q260,130 240,140" stroke="${color2}" stroke-width="2.5" fill="none"/>
      <polygon points="240,140 235,130 245,135" fill="${color2}"/>
      <line x1="155" y1="220" x2="130" y2="200" stroke="${color}" stroke-width="1.5"/>
      <line x1="155" y1="225" x2="125" y2="215" stroke="${color}" stroke-width="1.5"/>
      <line x1="155" y1="230" x2="130" y2="240" stroke="${color}" stroke-width="1.5"/>
      <circle cx="190" cy="215" r="3" fill="${color2}"/>
      <circle cx="210" cy="215" r="3" fill="${color2}"/>`,

    prophet: `<circle cx="200" cy="145" r="25" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M175,170 L170,280 L230,280 L225,170" fill="none" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="120" x2="200" y2="90" stroke="${color2}" stroke-width="1.5"/>
      <circle cx="200" cy="85" r="8" fill="none" stroke="${color2}" stroke-width="1.5"/>
      <circle cx="200" cy="85" r="3" fill="${color2}" opacity="0.6"/>
      <path d="M175,220 Q200,200 225,220" fill="none" stroke="${color2}" stroke-width="1.5"/>`,

    colossus: `<rect x="150" y="120" width="100" height="70" rx="6" fill="none" stroke="${color}" stroke-width="3"/>
      <rect x="165" y="140" width="20" height="10" rx="2" fill="${color2}"/>
      <rect x="215" y="140" width="20" height="10" rx="2" fill="${color2}"/>
      <rect x="140" y="190" width="120" height="90" rx="10" fill="none" stroke="${color}" stroke-width="3"/>
      <circle cx="170" cy="230" r="18" fill="none" stroke="${color}" stroke-width="3"/>
      <circle cx="230" cy="230" r="18" fill="none" stroke="${color}" stroke-width="3"/>
      <rect x="180" y="100" width="40" height="20" rx="4" fill="none" stroke="${color2}" stroke-width="2"/>`,

    queen: `<circle cx="200" cy="150" r="25" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M170,175 L165,270 L235,270 L230,175" fill="none" stroke="${color}" stroke-width="2"/>
      <polygon points="175,125 185,100 195,120 200,95 205,120 215,100 225,125" fill="none" stroke="${color2}" stroke-width="2"/>
      <path d="M150,200 Q130,180 140,160" fill="none" stroke="${color2}" stroke-width="2"/>
      <path d="M250,200 Q270,180 260,160" fill="none" stroke="${color2}" stroke-width="2"/>`,

    leviathan: `<ellipse cx="200" cy="200" rx="70" ry="40" fill="none" stroke="${color}" stroke-width="3"/>
      <circle cx="175" cy="190" r="10" fill="${color2}"/>
      <circle cx="225" cy="190" r="10" fill="${color2}"/>
      <path d="M130,200 Q110,180 120,150 Q130,130 140,140" fill="none" stroke="${color}" stroke-width="2.5"/>
      <path d="M270,200 Q290,180 280,150 Q270,130 260,140" fill="none" stroke="${color}" stroke-width="2.5"/>
      <path d="M160,230 Q200,260 240,230" fill="none" stroke="${color}" stroke-width="2"/>
      <polygon points="185,240 200,260 215,240" fill="${color2}" opacity="0.4"/>`,

    // Ocean series
    diver: `<circle cx="200" cy="140" r="30" fill="none" stroke="${color}" stroke-width="2"/>
      <circle cx="200" cy="140" r="22" fill="none" stroke="${color2}" stroke-width="1.5"/>
      <line x1="200" y1="170" x2="200" y2="260" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="200" x2="165" y2="240" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="200" x2="235" y2="240" stroke="${color}" stroke-width="2"/>
      <ellipse cx="200" cy="270" rx="25" ry="8" fill="none" stroke="${color2}" stroke-width="1.5"/>`,

    jellyfish: `<ellipse cx="200" cy="150" rx="40" ry="30" fill="none" stroke="${color}" stroke-width="2"/>
      <circle cx="200" cy="150" r="12" fill="${color2}" opacity="0.3"/>
      <path d="M165,175 Q170,210 160,250" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="4,3"/>
      <path d="M185,180 Q190,220 180,260" fill="none" stroke="${color2}" stroke-width="1.5" stroke-dasharray="4,3"/>
      <path d="M215,180 Q210,220 220,260" fill="none" stroke="${color2}" stroke-width="1.5" stroke-dasharray="4,3"/>
      <path d="M235,175 Q230,210 240,250" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="4,3"/>`,

    pirate: `<circle cx="200" cy="150" r="25" fill="none" stroke="${color}" stroke-width="2"/>
      <line x1="180" y1="140" x2="220" y2="140" stroke="${color2}" stroke-width="2"/>
      <circle cx="193" cy="155" r="5" fill="${color2}"/>
      <line x1="210" y1="150" x2="220" y2="160" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="175" x2="200" y2="260" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="200" x2="250" y2="190" stroke="${color2}" stroke-width="2.5"/>
      <polygon points="250,190 265,185 255,195" fill="${color2}"/>`,

    siren: `<circle cx="200" cy="145" r="25" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M180,170 Q200,250 200,280" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M220,170 Q200,250 200,280" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M200,280 Q180,300 160,290" fill="none" stroke="${color2}" stroke-width="2"/>
      <path d="M200,280 Q220,300 240,290" fill="none" stroke="${color2}" stroke-width="2"/>
      <path d="M160,145 Q140,130 145,115" fill="none" stroke="${color2}" stroke-width="1.5"/>
      <path d="M240,145 Q260,130 255,115" fill="none" stroke="${color2}" stroke-width="1.5"/>`,

    shark: `<ellipse cx="200" cy="200" rx="60" ry="25" fill="none" stroke="${color}" stroke-width="2.5"/>
      <polygon points="140,200 120,180 135,200" fill="${color}" opacity="0.5"/>
      <polygon points="260,200 290,195 270,210" fill="${color}" opacity="0.5"/>
      <polygon points="195,175 200,145 205,175" fill="${color2}"/>
      <circle cx="170" cy="195" r="5" fill="${color2}"/>
      <line x1="230" y1="190" x2="250" y2="185" stroke="${color}" stroke-width="1.5"/>
      <line x1="230" y1="195" x2="250" y2="195" stroke="${color}" stroke-width="1.5"/>
      <line x1="230" y1="200" x2="250" y2="205" stroke="${color}" stroke-width="1.5"/>`,

    kraken: `<circle cx="200" cy="170" r="35" fill="none" stroke="${color}" stroke-width="2.5"/>
      <circle cx="190" cy="165" r="8" fill="${color2}"/>
      <circle cx="215" cy="165" r="8" fill="${color2}"/>
      <path d="M170,200 Q150,240 130,270" fill="none" stroke="${color}" stroke-width="2.5"/>
      <path d="M180,205 Q165,250 155,275" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M220,205 Q235,250 245,275" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M230,200 Q250,240 270,270" fill="none" stroke="${color}" stroke-width="2.5"/>
      <path d="M200,205 Q200,250 200,280" fill="none" stroke="${color2}" stroke-width="2"/>`,

    admiral: `<circle cx="200" cy="140" r="25" fill="none" stroke="${color}" stroke-width="2"/>
      <rect x="180" y="120" width="40" height="8" rx="4" fill="${color2}" opacity="0.6"/>
      <line x1="200" y1="165" x2="200" y2="260" stroke="${color}" stroke-width="2"/>
      <path d="M175,180 L165,260 L235,260 L225,180" fill="none" stroke="${color}" stroke-width="2"/>
      <line x1="175" y1="200" x2="225" y2="200" stroke="${color2}" stroke-width="1.5"/>
      <polygon points="190,195 200,175 210,195" fill="${color2}" opacity="0.5"/>`,

    hydra: `<circle cx="170" cy="140" r="18" fill="none" stroke="${color}" stroke-width="2"/>
      <circle cx="200" cy="120" r="18" fill="none" stroke="${color2}" stroke-width="2"/>
      <circle cx="230" cy="140" r="18" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M170,158 Q175,190 200,200" fill="none" stroke="${color}" stroke-width="2.5"/>
      <path d="M200,138 Q200,170 200,200" fill="none" stroke="${color2}" stroke-width="2.5"/>
      <path d="M230,158 Q225,190 200,200" fill="none" stroke="${color}" stroke-width="2.5"/>
      <ellipse cx="200" cy="240" rx="35" ry="40" fill="none" stroke="${color}" stroke-width="2.5"/>
      <circle cx="173" cy="135" r="4" fill="${color2}"/>
      <circle cx="200" cy="115" r="4" fill="${color}"/>
      <circle cx="227" cy="135" r="4" fill="${color2}"/>`,

    poseidon: `<circle cx="200" cy="140" r="28" fill="none" stroke="${color}" stroke-width="2.5"/>
      <polygon points="185,112 192,90 200,108 208,90 215,112" fill="${color2}" stroke="${color2}" stroke-width="1"/>
      <line x1="200" y1="168" x2="200" y2="270" stroke="${color}" stroke-width="2.5"/>
      <line x1="200" y1="195" x2="160" y2="230" stroke="${color}" stroke-width="2"/>
      <line x1="200" y1="195" x2="240" y2="230" stroke="${color}" stroke-width="2"/>
      <line x1="240" y1="230" x2="270" y2="170" stroke="${color2}" stroke-width="3"/>
      <line x1="265" y1="175" x2="275" y2="165" stroke="${color2}" stroke-width="2"/>
      <line x1="265" y1="175" x2="270" y2="180" stroke="${color2}" stroke-width="2"/>
      <line x1="265" y1="175" x2="275" y2="178" stroke="${color2}" stroke-width="2"/>`,

    abomination: `<ellipse cx="200" cy="190" rx="55" ry="60" fill="none" stroke="${color}" stroke-width="3"/>
      <circle cx="180" cy="170" r="12" fill="${color2}"/>
      <circle cx="210" cy="160" r="8" fill="${color2}"/>
      <circle cx="225" cy="180" r="6" fill="${color2}" opacity="0.6"/>
      <path d="M150,170 Q120,150 110,170" fill="none" stroke="${color}" stroke-width="2.5"/>
      <path d="M145,190 Q110,200 105,185" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M250,170 Q280,150 290,170" fill="none" stroke="${color}" stroke-width="2.5"/>
      <path d="M255,190 Q290,200 295,185" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M160,240 Q180,270 200,250 Q220,270 240,240" fill="none" stroke="${color2}" stroke-width="2"/>`,
  };
  return icons[icon] || icons["scout"];
}

function generateCardSvg(card) {
  const theme = SERIES_THEMES[card.series];
  const rarityColor = RARITY_COLORS[card.rarity];
  const isLegendary = card.rarity === "legendary";
  const isEpic = card.rarity === "epic";

  const glowOpacity = isLegendary ? 0.4 : isEpic ? 0.25 : 0.15;
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
    <filter id="blur">
      <feGaussianBlur stdDeviation="20"/>
    </filter>
    ${isLegendary ? `<linearGradient id="legendaryBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="50%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>` : ""}
  </defs>

  <!-- Background -->
  <rect width="400" height="400" fill="url(#bg)"/>

  <!-- Ambient glow -->
  <ellipse cx="200" cy="180" rx="150" ry="120" fill="url(#glow)"/>

  <!-- Particle dots -->
  <circle cx="80" cy="60" r="1.5" fill="${theme.accent}" opacity="0.4"/>
  <circle cx="320" cy="90" r="1" fill="${theme.accent2}" opacity="0.3"/>
  <circle cx="50" cy="300" r="1.2" fill="${rarityColor}" opacity="0.35"/>
  <circle cx="350" cy="280" r="1.8" fill="${theme.accent}" opacity="0.25"/>
  <circle cx="150" cy="350" r="1" fill="${theme.accent2}" opacity="0.3"/>
  <circle cx="300" cy="40" r="1.3" fill="${rarityColor}" opacity="0.3"/>
  <circle cx="120" cy="120" r="0.8" fill="${theme.accent}" opacity="0.2"/>
  <circle cx="280" cy="320" r="1.5" fill="${theme.accent2}" opacity="0.2"/>

  <!-- Icon -->
  <g opacity="0.9">
    ${getIconSvg(card.icon, theme.accent, theme.accent2)}
  </g>

  <!-- Rarity border glow -->
  <rect x="2" y="2" width="396" height="396" rx="0" fill="none"
    stroke="${isLegendary ? "url(#legendaryBorder)" : rarityColor}"
    stroke-width="${isLegendary ? 3 : isEpic ? 2 : 1}"
    stroke-opacity="${borderOpacity}"/>

  <!-- Vignette -->
  <rect width="400" height="400" fill="url(#bg)" opacity="0" />
  <rect x="0" y="300" width="400" height="100" fill="url(#bg)" opacity="0.3"/>
</svg>`;
}

// Generate all cards
for (const card of cards) {
  const svg = generateCardSvg(card);
  const filePath = join(outDir, `${card.slug}.svg`);
  writeFileSync(filePath, svg);
  console.log(`Generated: ${card.slug}.svg`);
}

console.log(`\nDone! Generated ${cards.length} card images.`);
