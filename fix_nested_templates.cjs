// Fix nested backtick issues in JSX/JS files
// Specifically: inside a backtick string, if there are inner backticks
// used as code examples, replace \${ with ${ (which is the correct escape)
const fs = require('fs');
const path = require('path');

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
  const original = content;

  // Fix \${ inside backtick strings — these are escaped template interpolations
  // that should be \${  (with backslash) to prevent JS from interpreting them
  // But the fixer removed all backslashes before backticks incorrectly
  // Pattern: inside a backtick template literal used as a string value,
  // \${ should remain as \${
  // The problem is lines like: console.log(`\${hero.name}`) inside another template

  // Strategy: find ` \${  ` patterns (backtick dollar) and add backslash
  // This is: inside a JS string (template literal), when we see `${` it interpolates
  // We need `\${` to output literal ${
  // So fix: replace unescaped `\${ ` with ` \${ ` in code-as-string contexts

  // Actually the real issue: the file has \\${ which became \${ after our fixer
  // We need \\${ in source so it renders as \${ in the string, 
  // which in the inner template literal becomes a literal ${
  // Fix: replace \${ with \\${ in files that have code inside template strings
  
  // Simple heuristic: if line has backtick followed by \${ it's a code string
  content = content.replace(/`([^`]*)\\\$\{/g, (match, before) => {
    return '`' + before + '\\${';
  });

  // Also fix \\n that should be \n in template literals used in code strings
  // (these are code snippets that need literal \n for newlines in code)

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed nested template: ' + path.relative(srcDir, f));
    fixed++;
  }
}
console.log(`Total files fixed: ${fixed}`);
