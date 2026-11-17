import { GridPuzzle } from '../types';
import { CRITERIA_MAP } from './clubs';

export const PRESET_PUZZLES: GridPuzzle[] = [
  {
    id: 'daily-1',
    title: 'Gigi Daily Grid #1: Derby de România & Legende',
    difficulty: 'Mediu',
    rows: [
      CRITERIA_MAP.fcsb,
      CRITERIA_MAP.dinamo,
      CRITERIA_MAP.craiova
    ],
    cols: [
      CRITERIA_MAP.galatasaray,
      CRITERIA_MAP.romania_national,
      CRITERIA_MAP.liga1_champion
    ]
  },
  {
    id: 'daily-2',
    title: 'Gigi Daily Grid #2: Trasee de Serie A & Champions League',
    difficulty: 'Greu',
    rows: [
      CRITERIA_MAP.fcsb,
      CRITERIA_MAP.dinamo,
      CRITERIA_MAP.rapid
    ],
    cols: [
      CRITERIA_MAP.serie_a,
      CRITERIA_MAP.champions_league,
      CRITERIA_MAP.romania_national
    ]
  },
  {
    id: 'daily-3',
    title: 'Gigi Daily Grid #3: Nostalgia Anilor 2000',
    difficulty: 'Mod Patron',
    rows: [
      CRITERIA_MAP.fcsb,
      CRITERIA_MAP.dinamo,
      CRITERIA_MAP.farul
    ],
    cols: [
      CRITERIA_MAP.golden_generation,
      CRITERIA_MAP.u21_euro_2019,
      CRITERIA_MAP.liga1_champion
    ]
  }
];

export const GIGI_QUOTES = {
  correct: [
    "Poc! Pac! Tiki-Taka Barcelona! Spulberăm tot, tată!",
    "Bravo, tată! Ăsta e jucător de 50 de milioane de euro clauză!",
    "Pac, pac! Cine e pe primul loc? Nu vă supărați!",
    "Mamă, mamă, ce fotbalist! Direct titular îl bag, nu mai iese de pe teren!",
    "M-am uitat la el 5 minute și am zis: ăsta e diamant! Bravo!"
  ],
  wrong: [
    "Băi băiatule, ești nebun? Ăsta n-a călcat în viața lui pe la noi!",
    "La revedere, tată! Schimbare în minutul 20! Treci pe bancă!",
    "Alo, domnu' arbitru! M-am certat cu fotbalul când am văzut răspunsul ăsta!",
    "Nu-mi place cum joacă, îl dau afară la iarnă!",
    "Ai dat cu piciorul la calificare! Sună telefonul din lojă!"
  ],
  gameWon: [
    "Cine e pe primul loc?! Noi suntem campioni mondiali! Pac, pac, Gigi-Taka!",
    "Gata, tată! I-am spulberat! Deschideți șampania la palat!",
    "Băi băieți, sunteți mari de tot! Vă măresc contractul la toți!"
  ],
  gameOver: [
    "La revedere, tată! Am pierdut calificarea! Facem curățenie la echipă!",
    "Schimb 7 jucători la pauză! Nu se poate așa ceva la nivelul ăsta!",
    "Gata, vând echipa! Mă retrag din fotbal!"
  ],
  idle: [
    "Alo, domnu' arbitru! Schimbați-l că doarme pe teren!",
    "Băi băiatule, joacă repede, tiki-taka, nu sta cu mingea la picior!",
    "Sună telefonul din lojă... cineva să bage mingea în ațe!"
  ]
};
