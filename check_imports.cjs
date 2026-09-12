const fs = require('fs');
const path = require('path');

const gameDir = path.join(__dirname, 'src/components/game');
const files = fs.readdirSync(gameDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(gameDir, file), 'utf8');
  const lines = content.split('\n').slice(0, 10);
  const imports = lines.filter(l => l.startsWith('import'));
  console.log(`\n=== ${file} ===`);
  imports.forEach(l => console.log('  ' + l));
});
