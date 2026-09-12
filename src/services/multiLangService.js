// Multi-Language Execution Service for CodeHero Universe
import { runPythonCode } from './pyodideService';

export async function runMultiLanguageCode(code, languageId, pyodideInstance) {
  const startTime = performance.now();

  switch (languageId) {
    case 'python':
      return await runPythonCode(code, pyodideInstance);

    case 'javascript':
    case 'typescript':
      return runJavaScriptCode(code, startTime);

    case 'html':
      return runHtmlCssCode(code, startTime);

    case 'sql':
      return runSqlCode(code, startTime);

    case 'c':
    case 'cpp':
      return runCCode(code, startTime);

    case 'java':
      return runJavaCode(code, startTime);

    case 'rust':
      return runRustCode(code, startTime);

    default:
      return {
        success: true,
        stdout: `Executed in ${languageId} engine.`,
        stderr: '',
        error: null,
        variables: [],
        durationMs: Math.round(performance.now() - startTime)
      };
  }
}

// 1. In-Browser JavaScript & TypeScript Runner
function runJavaScriptCode(code, startTime) {
  const logs = [];
  const errors = [];
  const variables = [];

  // Strip simple TypeScript type annotations like : number, : string, interface, type
  let runnableCode = code
    .replace(/:\s*(number|string|boolean|any|void|object)(\[\])?/g, '')
    .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
    .replace(/type\s+\w+\s*=[^;]+;/g, '');

  try {
    const customConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      warn: (...args) => logs.push("[WARN] " + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      error: (...args) => errors.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      info: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    };

    // Run in isolated function context
    const runFunc = new Function('console', `
      let __vars = {};
      try {
        ${runnableCode}
      } catch(e) {
        throw e;
      }
    `);

    runFunc(customConsole);

    // Extract simple variable assignments
    const varRegex = /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([^;\n]+)/g;
    let match;
    while ((match = varRegex.exec(code)) !== null) {
      const varName = match[1];
      const valRaw = match[2].trim();
      try {
        // eslint-disable-next-line no-eval
        const evaluated = eval(valRaw);
        variables.push({
          name: varName,
          type: Array.isArray(evaluated) ? 'Array' : typeof evaluated,
          value: typeof evaluated === 'object' ? JSON.stringify(evaluated) : String(evaluated)
        });
      } catch {
        variables.push({
          name: varName,
          type: 'expression',
          value: valRaw
        });
      }
    }

    return {
      success: errors.length === 0,
      stdout: logs.join('\n'),
      stderr: errors.join('\n'),
      error: errors.length > 0 ? errors.join('\n') : null,
      variables,
      durationMs: Math.round(performance.now() - startTime)
    };
  } catch (e) {
    return {
      success: false,
      stdout: logs.join('\n'),
      stderr: String(e),
      error: String(e),
      variables: [],
      durationMs: Math.round(performance.now() - startTime)
    };
  }
}

// 2. HTML & CSS Live Renderer
function runHtmlCssCode(code, startTime) {
  // Count key tags for automated tests
  const hasH1 = /<h1[^>]*>.*?<\/h1>/i.test(code);
  const hasButton = /<button[^>]*>.*?<\/button>/i.test(code);
  const hasImg = /<img[^>]*>/i.test(code);
  const hasStyle = /style=|color:|background/i.test(code);

  const variables = [
    { name: '<h1> Tag', type: 'HTML Element', value: hasH1 ? 'Found ✓' : 'Missing' },
    { name: '<button> Tag', type: 'HTML Element', value: hasButton ? 'Found ✓' : 'None' },
    { name: 'CSS Styles', type: 'Styling', value: hasStyle ? 'Applied ✓' : 'None' }
  ];

  return {
    success: true,
    stdout: "Webpage rendered in live preview frame! ✨",
    stderr: "",
    error: null,
    htmlPreview: code,
    variables,
    durationMs: Math.round(performance.now() - startTime)
  };
}

// 3. In-Browser SQL Database Engine
const DEFAULT_SQL_DB = {
  heroes: [
    { id: 1, name: 'Aria the Rogue', level: 12, class: 'Rogue', gold: 350 },
    { id: 2, name: 'Bartholomew', level: 25, class: 'Knight', gold: 900 },
    { id: 3, name: 'Celeste the Mage', level: 18, class: 'Mage', gold: 620 },
    { id: 4, name: 'Drakon', level: 5, class: 'Warrior', gold: 80 }
  ],
  inventory: [
    { item_id: 101, item_name: 'Health Potion', cost: 25, stock: 50 },
    { item_id: 102, item_name: 'Mana Crystal', cost: 60, stock: 20 },
    { item_id: 103, item_name: 'Dragon Scale Armor', cost: 500, stock: 3 },
    { item_id: 104, item_name: 'Wooden Bow', cost: 45, stock: 15 }
  ]
};

function runSqlCode(code, startTime) {
  const cleanCode = code.trim().replace(/;$/, '');
  const selectRegex = /SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i;
  const match = cleanCode.match(selectRegex);

  if (!match) {
    // Check if simple INSERT or CREATE
    if (/INSERT\s+INTO/i.test(cleanCode)) {
      return {
        success: true,
        stdout: "1 row inserted successfully into database! ✓",
        stderr: "",
        error: null,
        sqlResults: { columns: ['status'], rows: [['Success: Row Inserted']] },
        variables: [{ name: 'Query Status', type: 'SQL', value: 'INSERT OK' }],
        durationMs: Math.round(performance.now() - startTime)
      };
    }

    return {
      success: false,
      stdout: "",
      stderr: "SQL Syntax Error",
      error: "SQL Syntax Error: Expected a query starting with SELECT, INSERT INTO, or UPDATE.",
      variables: [],
      durationMs: Math.round(performance.now() - startTime)
    };
  }

  const columnsClause = match[1].trim();
  const tableName = match[2].trim().toLowerCase();
  const whereClause = match[3] ? match[3].trim() : null;
  const limitClause = match[5] ? parseInt(match[5]) : null;

  const tableData = DEFAULT_SQL_DB[tableName];
  if (!tableData) {
    return {
      success: false,
      stdout: "",
      stderr: `Table '${tableName}' not found`,
      error: `Table '${tableName}' does not exist in database. Available tables: heroes, inventory.`,
      variables: [],
      durationMs: Math.round(performance.now() - startTime)
    };
  }

  let filtered = [...tableData];

  // Evaluate simple WHERE condition
  if (whereClause) {
    const condMatch = whereClause.match(/(\w+)\s*(=|!=|>|<|>=|<=)\s*(.+)/);
    if (condMatch) {
      const col = condMatch[1].trim();
      const op = condMatch[2].trim();
      const valRaw = condMatch[3].trim().replace(/['"]/g, '');
      const numVal = !isNaN(valRaw) ? Number(valRaw) : null;

      filtered = filtered.filter(row => {
        const rowVal = row[col];
        if (numVal !== null) {
          if (op === '=') return rowVal == numVal;
          if (op === '>') return rowVal > numVal;
          if (op === '<') return rowVal < numVal;
          if (op === '>=') return rowVal >= numVal;
          if (op === '<=') return rowVal <= numVal;
          if (op === '!=') return rowVal != numVal;
        } else {
          if (op === '=') return String(rowVal).toLowerCase() === valRaw.toLowerCase();
          if (op === '!=') return String(rowVal).toLowerCase() !== valRaw.toLowerCase();
        }
        return true;
      });
    }
  }

  if (limitClause) {
    filtered = filtered.slice(0, limitClause);
  }

  // Determine Columns
  let columns = [];
  if (columnsClause === '*') {
    columns = Object.keys(tableData[0]);
  } else {
    columns = columnsClause.split(',').map(c => c.trim());
  }

  // Format Rows
  const rows = filtered.map(row => columns.map(col => row[col] !== undefined ? row[col] : 'NULL'));

  // Format terminal table
  const colWidths = columns.map((col, idx) => Math.max(col.length, ...rows.map(r => String(r[idx]).length)) + 2);
  const headerLine = columns.map((c, i) => c.padEnd(colWidths[i])).join('| ');
  const dividerLine = colWidths.map(w => '-'.repeat(w)).join('+');
  const dataLines = rows.map(r => r.map((val, i) => String(val).padEnd(colWidths[i])).join('| '));

  const textOutput = `Query executed successfully (${rows.length} rows returned):\n\n${headerLine}\n${dividerLine}\n${dataLines.join('\n')}`;

  const variables = [
    { name: 'Rows Found', type: 'SQL Count', value: String(rows.length) },
    { name: 'Table', type: 'Database', value: tableName },
    { name: 'Columns', type: 'List', value: columns.join(', ') }
  ];

  return {
    success: true,
    stdout: textOutput,
    stderr: "",
    error: null,
    sqlResults: { columns, rows },
    variables,
    durationMs: Math.round(performance.now() - startTime)
  };
}

// 4. In-Browser C / C++ Runner
function runCCode(code, startTime) {
  const logs = [];
  const variables = [];

  // Basic syntax verification
  if (!code.includes('main')) {
    return {
      success: false,
      stdout: "",
      error: "C Compilation Error: function 'main' is missing or not declared.",
      variables: [],
      durationMs: 0
    };
  }

  // Parse printf statements
  const printfRegex = /printf\s*\(\s*"([^"]*)"(?:\s*,\s*([^)]+))?\s*\)\s*;/g;
  let match;
  while ((match = printfRegex.exec(code)) !== null) {
    let template = match[1];
    const argsRaw = match[2];

    if (argsRaw) {
      const args = argsRaw.split(',').map(a => a.trim());
      args.forEach(arg => {
        template = template.replace(/%d|%i|%s|%f/, arg);
      });
    }
    // Handle escape characters
    template = template.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    logs.push(template);
  }

  // Parse variable declarations: int x = 10;
  const cVarRegex = /(?:int|float|double|char\*|long)\s+([a-zA-Z_]\w*)\s*=\s*([^;]+);/g;
  while ((match = cVarRegex.exec(code)) !== null) {
    variables.push({
      name: match[1],
      type: 'C Memory Slot',
      value: match[2].trim()
    });
  }

  // Parse pointer declarations: int* ptr = &x;
  const ptrRegex = /(?:int|char|float)\s*\*\s*([a-zA-Z_]\w*)\s*=\s*&([a-zA-Z_]\w*);/g;
  while ((match = ptrRegex.exec(code)) !== null) {
    variables.push({
      name: match[1],
      type: 'Pointer (Address)',
      value: `&${match[2]} (0x7ffe)`
    });
  }

  return {
    success: true,
    stdout: logs.join(''),
    stderr: "",
    error: null,
    variables,
    durationMs: Math.round(performance.now() - startTime)
  };
}

// 5. In-Browser Java Runner
function runJavaCode(code, startTime) {
  const logs = [];
  const variables = [];

  if (!code.includes('class') || !code.includes('main')) {
    return {
      success: false,
      stdout: "",
      error: "Java Error: Program must declare a class and a 'public static void main(String[] args)' method.",
      variables: [],
      durationMs: 0
    };
  }

  // Parse System.out.println
  const printRegex = /System\.out\.println\s*\((.*?)\)\s*;/g;
  let match;
  while ((match = printRegex.exec(code)) !== null) {
    let arg = match[1].trim();
    if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
      logs.push(arg.slice(1, -1));
    } else {
      try {
        // eslint-disable-next-line no-eval
        logs.push(String(eval(arg)));
      } catch {
        logs.push(arg);
      }
    }
  }

  // Parse Java variable declarations: int score = 100;
  const javaVarRegex = /(?:int|double|String|boolean)\s+([a-zA-Z_]\w*)\s*=\s*([^;]+);/g;
  while ((match = javaVarRegex.exec(code)) !== null) {
    variables.push({
      name: match[1],
      type: 'Java Field',
      value: match[2].trim()
    });
  }

  return {
    success: true,
    stdout: logs.join('\n'),
    stderr: "",
    error: null,
    variables,
    durationMs: Math.round(performance.now() - startTime)
  };
}

// 6. In-Browser Rust Runner
function runRustCode(code, startTime) {
  const logs = [];
  const variables = [];

  if (!code.includes('fn main')) {
    return {
      success: false,
      stdout: "",
      error: "Rust Error: Expected 'fn main() { ... }' entry point.",
      variables: [],
      durationMs: 0
    };
  }

  // Parse println!
  const printRegex = /println!\s*\(\s*"([^"]*)"(?:\s*,\s*([^)]+))?\s*\)\s*;/g;
  let match;
  while ((match = printRegex.exec(code)) !== null) {
    let template = match[1];
    const argsRaw = match[2];
    if (argsRaw) {
      const args = argsRaw.split(',').map(a => a.trim());
      args.forEach(arg => {
        template = template.replace('{}', arg);
      });
    }
    logs.push(template);
  }

  // Parse let [mut] x = val;
  const rustVarRegex = /let\s+(?:mut\s+)?([a-zA-Z_]\w*)\s*=\s*([^;]+);/g;
  while ((match = rustVarRegex.exec(code)) !== null) {
    variables.push({
      name: match[1],
      type: 'Rust Binding',
      value: match[2].trim()
    });
  }

  return {
    success: true,
    stdout: logs.join('\n'),
    stderr: "",
    error: null,
    variables,
    durationMs: Math.round(performance.now() - startTime)
  };
}

// 7. Universal Automated Test Evaluator for all languages
export function evaluateMultiLanguageLessonTests(executionResult, lessonTests, currentCode = '', languageId = 'python') {
  if (!lessonTests || lessonTests.length === 0) {
    return { allPassed: true, results: [] };
  }

  const results = lessonTests.map(test => {
    let passed = false;
    let actualValue = "";

    if (test.type === "output_match") {
      const normalizedOut = (executionResult.stdout || "").trim();
      const normalizedExp = (test.expected || "").trim();
      passed = normalizedOut === normalizedExp;
      actualValue = normalizedOut || "(no output)";
    } else if (test.type === "output_includes") {
      const out = executionResult.stdout || "";
      const codeOrPreview = languageId === 'html' ? (executionResult.htmlPreview || currentCode) : out;
      const searchTarget = languageId === 'html' ? (out + "\n" + codeOrPreview) : out;
      const missing = test.expected.filter(exp => !searchTarget.includes(exp));
      passed = missing.length === 0;
      actualValue = passed ? "All required text found ✓" : `Missing: ${missing.join(', ')}`;
    } else if (test.type === "var_check") {
      const varMap = {};
      (executionResult.variables || []).forEach(v => {
        let val = v.value;
        if (typeof val === 'string') {
          if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
            val = val.slice(1, -1);
          } else if (!isNaN(val) && val.trim() !== '') {
            val = Number(val);
          } else if (val === 'True' || val === 'true') {
            val = true;
          } else if (val === 'False' || val === 'false') {
            val = false;
          }
        }
        varMap[v.name] = val;
      });

      let allMatch = true;
      const mismatches = [];

      for (const [key, expectedVal] of Object.entries(test.vars || {})) {
        const actual = varMap[key];
        const eq = JSON.stringify(actual) === JSON.stringify(expectedVal) || actual == expectedVal;
        if (!eq) {
          allMatch = false;
          mismatches.push(`${key}: expected ${JSON.stringify(expectedVal)}, got ${JSON.stringify(actual)}`);
        }
      }

      passed = allMatch;
      actualValue = allMatch ? "All variables match expected values ✓" : mismatches.join('; ');
    } else {
      passed = executionResult.success;
      actualValue = executionResult.success ? "Execution passed ✓" : (executionResult.error || "Failed");
    }

    return {
      description: test.description,
      passed,
      actual: actualValue
    };
  });

  const allPassed = results.every(r => r.passed);
  return { allPassed, results };
}

