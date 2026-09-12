const fs = require('fs');
const path = require('path');

function transformPythonStarter(solution, task, title) {
  const lines = solution.trim().split('\n');
  
  // If solution has function definition
  const funcIndex = lines.findIndex(l => l.trim().startsWith('def '));
  if (funcIndex !== -1) {
    const header = lines[funcIndex];
    const afterFunc = lines.filter((l, i) => i > funcIndex && !l.startsWith('    ') && l.trim().length > 0);
    const testCall = afterFunc.length > 0 ? '\n\n' + afterFunc.join('\n') : '';
    return `${header}\n    # TODO: Write your code to solve the challenge:\n    pass${testCall}\n`;
  }

  // If class definition
  const classIndex = lines.findIndex(l => l.trim().startsWith('class '));
  if (classIndex !== -1) {
    const classHeader = lines[classIndex];
    return `${classHeader}\n    def __init__(self):\n        # TODO: Initialize attributes here\n        pass\n`;
  }

  // If simple assignment or expressions
  if (lines.length <= 4) {
    // Keep initial data variables, replace calculation
    const setupLines = lines.filter(l => l.includes('=') && !l.includes('map') && !l.includes('filter') && !l.includes('lambda') && !l.includes('list('));
    if (setupLines.length > 0) {
      return `${setupLines.join('\n')}\n\n# TODO: ${task.split('\n')[0] || 'Complete your code here'}\n# Write your solution below:\n`;
    }
  }

  // Fallback: keep setup lines, comment out solution logic
  return `# Quest: ${title}\n# Task: ${task.split('\n')[0] || ''}\n\n# TODO: Write your Python solution here\n`;
}

function transformJsStarter(solution, task, title) {
  const lines = solution.trim().split('\n');

  // If function
  const funcIndex = lines.findIndex(l => l.trim().startsWith('function ') || l.trim().includes(' = (') || l.trim().includes(' = function'));
  if (funcIndex !== -1) {
    const header = lines[funcIndex];
    return `${header} {\n  // TODO: Write your solution here\n}\n`;
  }

  // If setup arrays/objects
  const setupLines = lines.filter(l => (l.trim().startsWith('const ') || l.trim().startsWith('let ')) && !l.includes('map(') && !l.includes('filter(') && !l.includes('reduce('));
  if (setupLines.length > 0) {
    return `${setupLines.join('\n')}\n\n// TODO: ${task.split('\n')[0] || 'Implement solution'}\n// Write your code here:\n`;
  }

  return `// Quest: ${title}\n// TODO: Write your JavaScript solution here\n`;
}

function transformHtmlStarter(solution, task, title) {
  if (solution.includes('<body>') || solution.includes('<!DOCTYPE')) {
    return `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    /* TODO: Add your CSS styling here */\n  </style>\n</head>\n<body>\n  <!-- TODO: ${task.split('\n')[0] || 'Build your HTML elements here'} -->\n\n</body>\n</html>\n`;
  }
  return `<!-- Quest: ${title} -->\n<!-- TODO: ${task.split('\n')[0] || 'Add required HTML & CSS'} -->\n<div class="container">\n  \n</div>\n`;
}

const files = [
  { path: './src/data/curriculum.json', type: 'python' },
  { path: './src/data/languages/javascript.json', type: 'js' },
  { path: './src/data/languages/html.json', type: 'html' }
];

let totalModified = 0;

files.forEach(({ path: filePath, type }) => {
  const fullPath = path.resolve(__dirname, filePath);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  let modifiedInFile = 0;

  data.forEach(m => {
    m.lessons.forEach(l => {
      if (l.starterCode && l.solution && l.starterCode.trim() === l.solution.trim()) {
        // Transform starter code
        if (type === 'python') {
          l.starterCode = transformPythonStarter(l.solution, l.task, l.title);
        } else if (type === 'js') {
          l.starterCode = transformJsStarter(l.solution, l.task, l.title);
        } else if (type === 'html') {
          l.starterCode = transformHtmlStarter(l.solution, l.task, l.title);
        }
        modifiedInFile++;
        totalModified++;
      }
    });
  });

  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${modifiedInFile} lessons in ${filePath}`);
});

console.log(`Successfully converted ${totalModified} pre-solved starter codes into active learning challenges!`);
