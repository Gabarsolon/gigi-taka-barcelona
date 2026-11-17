import { Criterion } from '../types';

export const CRITERIA_MAP: Record<string, Criterion> = {
  // Romanian Traditional Clubs
  fcsb: {
    id: 'fcsb',
    name: 'FCSB / Steaua București',
    shortName: 'FCSB',
    type: 'club',
    badge: '🔴🔵',
    color: '#e11d48'
  },
  dinamo: {
    id: 'dinamo',
    name: 'Dinamo București',
    shortName: 'DIN',
    type: 'club',
    badge: '⚪🔴',
    color: '#dc2626'
  },
  rapid: {
    id: 'rapid',
    name: 'Rapid București',
    shortName: 'RAP',
    type: 'club',
    badge: '🍷⚪',
    color: '#7f1d1d'
  },
  cfr: {
    id: 'cfr',
    name: 'CFR Cluj',
    shortName: 'CFR',
    type: 'club',
    badge: '🍷⚪',
    color: '#881337'
  },
  craiova: {
    id: 'craiova',
    name: 'Universitatea Craiova',
    shortName: 'UCV',
    type: 'club',
    badge: '⚪🔵',
    color: '#0284c7'
  },
  farul: {
    id: 'farul',
    name: 'Farul Constanța / Viitorul',
    shortName: 'FAR',
    type: 'club',
    badge: '🔵⚪',
    color: '#0ea5e9'
  },
  petrolul: {
    id: 'petrolul',
    name: 'Petrolul Ploiești',
    shortName: 'PET',
    type: 'club',
    badge: '🟡🔵',
    color: '#eab308'
  },
  uta: {
    id: 'uta',
    name: 'UTA Arad',
    shortName: 'UTA',
    type: 'club',
    badge: '🔴⚪',
    color: '#b91c1c'
  },
  vaslui: {
    id: 'vaslui',
    name: 'FC Vaslui',
    shortName: 'VAS',
    type: 'club',
    badge: '🟡🟢',
    color: '#ca8a04'
  },
  urziceni: {
    id: 'urziceni',
    name: 'Unirea Urziceni',
    shortName: 'URZ',
    type: 'club',
    badge: '🔵⚪',
    color: '#2563eb'
  },
  otelul: {
    id: 'otelul',
    name: 'Oțelul Galați',
    shortName: 'OTE',
    type: 'club',
    badge: '🔴⚪🔵',
    color: '#2563eb'
  },
  astra: {
    id: 'astra',
    name: 'Astra Giurgiu',
    shortName: 'AST',
    type: 'club',
    badge: '⚪⚫',
    color: '#475569'
  },
  timisoara: {
    id: 'timisoara',
    name: 'Poli Timișoara',
    shortName: 'POL',
    type: 'club',
    badge: '🟣⚪',
    color: '#7e22ce'
  },
  bistrita: {
    id: 'bistrita',
    name: 'Gloria Bistrița',
    shortName: 'BIS',
    type: 'club',
    badge: '🔵⚪',
    color: '#3b82f6'
  },
  arges: {
    id: 'arges',
    name: 'FC Argeș Pitești',
    shortName: 'ARG',
    type: 'club',
    badge: '🟣⚪',
    color: '#6b21a8'
  },

  // Foreign Clubs with Romanian Heritage
  barcelona: {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'BAR',
    type: 'club',
    badge: '🔵🔴',
    color: '#1e3a8a'
  },
  realmadrid: {
    id: 'realmadrid',
    name: 'Real Madrid',
    shortName: 'RMA',
    type: 'club',
    badge: '⚪👑',
    color: '#e2e8f0'
  },
  inter: {
    id: 'inter',
    name: 'Inter Milano',
    shortName: 'INT',
    type: 'club',
    badge: '🔵⚫',
    color: '#1d4ed8'
  },
  galatasaray: {
    id: 'galatasaray',
    name: 'Galatasaray',
    shortName: 'GAL',
    type: 'club',
    badge: '🟡🔴',
    color: '#d97706'
  },
  ajax: {
    id: 'ajax',
    name: 'AFC Ajax',
    shortName: 'AJA',
    type: 'club',
    badge: '⚪🔴',
    color: '#dc2626'
  },
  chelsea: {
    id: 'chelsea',
    name: 'Chelsea FC',
    shortName: 'CHE',
    type: 'club',
    badge: '🔵🦁',
    color: '#1d4ed8'
  },
  fiorentina: {
    id: 'fiorentina',
    name: 'ACF Fiorentina',
    shortName: 'FIO',
    type: 'club',
    badge: '🟣⚜️',
    color: '#7c3aed'
  },
  parma: {
    id: 'parma',
    name: 'Parma Calcio',
    shortName: 'PAR',
    type: 'club',
    badge: '🟡🔵',
    color: '#eab308'
  },
  serie_a: {
    id: 'serie_a',
    name: 'Serie A (Italia)',
    shortName: 'ITA',
    type: 'achievement',
    badge: '🇮🇹',
    color: '#0284c7'
  },

  // Special Criteria
  romania_national: {
    id: 'romania_national',
    name: 'Naționala României (15+ selecții)',
    shortName: 'RO 🇷🇴',
    type: 'stat',
    badge: '🇷🇴',
    color: '#eab308'
  },
  golden_generation: {
    id: 'golden_generation',
    name: 'Generația de Aur (Mondial 94 / Euro 96-00)',
    shortName: 'AUR 🏆',
    type: 'achievement',
    badge: '⭐',
    color: '#ca8a04'
  },
  u21_euro_2019: {
    id: 'u21_euro_2019',
    name: 'Semifinalist EURO U21 (2019)',
    shortName: 'U21 2019',
    type: 'achievement',
    badge: '🥉',
    color: '#38bdf8'
  },
  liga1_champion: {
    id: 'liga1_champion',
    name: 'Campion al României',
    shortName: 'CAMPION 🏅',
    type: 'achievement',
    badge: '🏆',
    color: '#eab308'
  },
  champions_league: {
    id: 'champions_league',
    name: 'A jucat în Champions League',
    shortName: 'UCL ⭐',
    type: 'achievement',
    badge: '⭐',
    color: '#1e1b4b'
  }
};
