// CodeHero Universe: Multi-Language Registry & Catalog
import pythonCurriculum from '../curriculum.json';
import jsCurriculum from './javascript.json';
import htmlCurriculum from './html.json';
import sqlCurriculum from './sql.json';
import cCurriculum from './c.json';
import javaCurriculum from './java.json';
import rustCurriculum from './rust.json';

export const LANGUAGES = [
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    badge: 'AI & Games',
    tagline: 'The world\'s most popular, human-readable coding language',
    mascotName: 'Pythie',
    mascotType: 'dragon',
    fileExt: 'main.py',
    curriculum: pythonCurriculum,
    primaryColor: '#38bdf8'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '⚡',
    badge: 'Web & Apps',
    tagline: 'The interactive programming language of the global web',
    mascotName: 'Sparky',
    mascotType: 'fox',
    fileExt: 'app.js',
    curriculum: jsCurriculum,
    primaryColor: '#facc15'
  },
  {
    id: 'html',
    name: 'HTML & CSS',
    icon: '🎨',
    badge: 'Visual Design',
    tagline: 'Paint and build real websites with live browser preview',
    mascotName: 'Pixie',
    mascotType: 'cat',
    fileExt: 'index.html',
    curriculum: htmlCurriculum,
    primaryColor: '#fb923c'
  },
  {
    id: 'sql',
    name: 'SQL Database',
    icon: '🗄️',
    badge: 'Data Vault',
    tagline: 'Query and organize massive tables in relational databases',
    mascotName: 'Shelldon',
    mascotType: 'turtle',
    fileExt: 'query.sql',
    curriculum: sqlCurriculum,
    primaryColor: '#a855f7'
  },
  {
    id: 'c',
    name: 'C / C++',
    icon: '⚙️',
    badge: 'Game Engines',
    tagline: 'Raw machine speed, memory pointers, and game performance',
    mascotName: 'Geary',
    mascotType: 'golem',
    fileExt: 'main.c',
    curriculum: cCurriculum,
    primaryColor: '#3b82f6'
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    badge: 'Enterprise & Android',
    tagline: 'Object-oriented power running on billions of devices',
    mascotName: 'Beany',
    mascotType: 'owl',
    fileExt: 'Main.java',
    curriculum: javaCurriculum,
    primaryColor: '#f43f5e'
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    badge: 'Safe Speed',
    tagline: 'Blazing speed with complete memory safety and reliability',
    mascotName: 'Ferris',
    mascotType: 'crab',
    fileExt: 'main.rs',
    curriculum: rustCurriculum,
    primaryColor: '#ef4444'
  }
];

export function getLanguageConfig(langId) {
  return LANGUAGES.find(l => l.id === langId) || LANGUAGES[0];
}
