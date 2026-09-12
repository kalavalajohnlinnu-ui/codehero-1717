// Fix escaped backticks (\`) → real backticks in all JSX/JS files
// Also fix escaped ${} → real ${}
const fs = require('fs');
const path = require('path');


// Simple manual glob for .jsx and .js in src/
function findFiles(dir, exts) {
  const results = [];
  function walk(d) {
    try {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(d, e.name);
        if (e.isDirectory()) walk(full);
        else if (exts.some(ext => e.name.endsWith(ext))) results.push(full);
      }
    } catch (_) {}
  }
  walk(dir);
  return results;
}

const srcDir = path.join(__dirname, 'src');
const files = findFiles(srcDir, ['.jsx', '.js']);

let fixed = 0;
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  // Check for escaped backtick pattern \` which is invalid in JSX
  if (content.includes('\\`')) {
    const original = content;
    // Replace \` with ` (unescaped backtick)
    content = content.replace(/\\`/g, '`');
    // Also fix \\${ → ${  
    content = content.replace(/\\\\\${/g, '${');
    if (content !== original) {
      fs.writeFileSync(f, content, 'utf8');
      console.log('Fixed: ' + path.relative(srcDir, f));
      fixed++;
    }
  }
}
console.log(`\nTotal files fixed: ${fixed}`);
