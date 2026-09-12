const fs = require('fs');
const path = require('path');

const files = [
  { name: 'Python', path: './src/data/curriculum.json' },
  { name: 'JavaScript', path: './src/data/languages/javascript.json' },
  { name: 'HTML/CSS', path: './src/data/languages/html.json' },
  { name: 'SQL', path: './src/data/languages/sql.json' },
  { name: 'C/C++', path: './src/data/languages/c.json' },
  { name: 'Java', path: './src/data/languages/java.json' },
  { name: 'Rust', path: './src/data/languages/rust.json' },
];

files.forEach(f => {
  try {
    const data = JSON.parse(fs.readFileSync(f.path, 'utf8'));
    let lessonCount = 0;
    data.forEach(m => lessonCount += m.lessons.length);
    const size = fs.statSync(f.path).size;
    console.log(`${f.name}: ${data.length} modules, ${lessonCount} lessons (${(size/1024).toFixed(1)} KB)`);
  } catch(e) {
    console.log(`${f.name}: ERROR - ${e.message}`);
  }
});
