// CodeHero Universe: Multi-Model Lesson Practice & Verification Engine
// Provides curated real-world examples and 4 distinct confirmed problem models:
// 1. Model 1: 🔮 Output Prediction / Concept Quiz (Interactive multiple-choice with instant confirmation)
// 2. Model 2: 🐛 Bug Detective (Analyze broken snippet, choose the exact fix with instant confirmation)
// 3. Model 3: 🧩 Syntax Builder / Fill in the Blank (Interactive token selection with instant confirmation)
// 4. Model 4: ⚡ Applied Variation Challenge (Variant mini-task with starter code and solution verification)

export const lessonPracticeService = {
  /**
   * Retrieves or dynamically generates 3 curated examples and 4 confirmed problem models for any lesson.
   */
  getLessonPracticeData(lesson, languageId = 'python') {
    if (!lesson) {
      return { examples: [], models: [] };
    }

    const title = lesson.title || 'Coding Lesson';
    const concept = lesson.concept || '';
    const task = lesson.task || '';
    const starter = lesson.starterCode || '';
    const solution = lesson.solution || starter;
    const lessonId = lesson.id || 'lesson-general';
    const lang = (languageId || 'python').toLowerCase();

    // 1. Curated Examples
    const examples = this._generateExamples(lesson, lang, title, concept, starter, solution);

    // 2. Four Distinct Confirmed Problem Models
    const models = this._generateConfirmedModels(lesson, lang, title, task, starter, solution, lessonId);

    return {
      examples,
      models
    };
  },

  /**
   * Generates 3 rich curated examples in light theme styling:
   * 1. Foundation Syntax Pattern
   * 2. Practical Real-World Application
   * 3. Pro Gotcha & Guard Rails
   */
  _generateExamples(lesson, lang, title, concept, starter, solution) {
    const cleanStarter = starter ? starter.trim() : '';
    const cleanSolution = solution && solution !== starter ? solution.trim() : '';

    switch (lang) {
      case 'python':
        return [
          {
            id: 'ex-1',
            title: `Core Pattern // ${title}`,
            badge: '01 // SIMPLE PATTERN',
            category: 'Foundation',
            explanation: 'Notice how Python emphasizes clean readability. The structure is direct and minimal, letting logic stay clear.',
            code: cleanStarter || `# Standard Python Pattern for ${title}\ndef process_data(items):\n    return [item.strip() for item in items if item]\n\nprint(process_data(["Python", "  AI  ", "CodeHero"]))`,
            tip: 'Tip: Prioritize clean readability and descriptive variable names over dense one-liners.'
          },
          {
            id: 'ex-2',
            title: 'Real-World Application // Production Flow',
            badge: '02 // REAL-LIFE USAGE',
            category: 'Practical',
            explanation: 'Here is how professional engineers apply this exact principle in web backends, APIs, and data services.',
            code: cleanSolution || `# Production Application Flow\ndef authenticate_request(user_token, active_sessions):\n    if not user_token:\n        return {"status": 401, "message": "Missing credentials"}\n    is_valid = user_token in active_sessions\n    return {"status": 200 if is_valid else 403, "authorized": is_valid}\n\nprint(authenticate_request("tok_991", {"tok_991": "dev_user"}))`,
            tip: 'Tip: Always return structured dictionary contracts from services for predictable API handling.'
          },
          {
            id: 'ex-3',
            title: 'Pro Gotcha // Common Pitfalls & Guard Rails',
            badge: '03 // COMMON MISTAKE & FIX',
            category: 'Gotcha',
            explanation: 'Watch out for boundary values like NoneType, empty collections, or accidental variable shadowing.',
            code: `# Common Bug vs Pro Defensive Fix\n# ❌ RISKY: Assuming input is never empty or None\n# def format_name(val): return val.upper()\n\n# ✅ DEFENSIVE: Explicit guard clauses\ndef safe_format_name(val):\n    if val is None or not isinstance(val, str):\n        return "Anonymous User"\n    return val.strip().title()\n\nprint(safe_format_name(None))\nprint(safe_format_name("  ada lovelace  "))`,
            tip: 'Tip: Guard clauses at the very start of functions eliminate 90% of runtime exceptions.'
          }
        ];

      case 'javascript':
        return [
          {
            id: 'ex-1',
            title: `Modern ES6+ Pattern // ${title}`,
            badge: '01 // SIMPLE PATTERN',
            category: 'Foundation',
            explanation: 'Modern JavaScript uses const/let, arrow functions, and immutability for clean, predictable state.',
            code: cleanStarter || `// ES6+ Standard Idiom\nconst filterPositive = (numbers = []) => {\n  return numbers.filter(n => n > 0).map(n => n * 2);\n};\n\nconsole.log(filterPositive([1, -2, 3, -4, 5]));`,
            tip: 'Tip: Use const by default. Only reach for let when a variable genuinely changes value.'
          },
          {
            id: 'ex-2',
            title: 'Real-World Application // Web Component Flow',
            badge: '02 // REAL-LIFE USAGE',
            category: 'Practical',
            explanation: 'Handling user actions or API payloads safely using optional chaining and nullish coalescing.',
            code: `// Safe Object Access in Web Apps\nfunction renderUserProfile(user) {\n  const name = user?.profile?.displayName ?? 'Anonymous Guest';\n  const isVerified = Boolean(user?.metadata?.emailVerified);\n  return { name, badge: isVerified ? 'Verified Pro' : 'Explorer' };\n}\n\nconsole.log(renderUserProfile({ profile: { displayName: 'Grace Hopper' } }));`,
            tip: 'Tip: Optional chaining (?.) stops "Cannot read property of undefined" crashes.'
          },
          {
            id: 'ex-3',
            title: 'Pro Gotcha // Strict Equality & Coercion',
            badge: '03 // COMMON MISTAKE & FIX',
            category: 'Gotcha',
            explanation: 'Loose equality (==) causes subtle bugs with falsy values. Always use strict equality (===).',
            code: `// Strict vs Loose Equality\n// ❌ 0 == "" is TRUE in JavaScript (surprising coercion!)\n// ❌ null == undefined is TRUE\n\n// ✅ Always use === for exact type & value match\nconst value = 0;\nconsole.log(value === ""); // false (safe!)\nconsole.log(value === 0);  // true`,
            tip: 'Tip: Never use == unless explicitly checking for both null and undefined with x == null.'
          }
        ];

      case 'sql':
        return [
          {
            id: 'ex-1',
            title: `Standard SQL Idiom // ${title}`,
            badge: '01 // SIMPLE PATTERN',
            category: 'Foundation',
            explanation: 'SQL queries express what data you want rather than how to iterate through it.',
            code: cleanStarter || `SELECT id, username, email, created_at\nFROM users\nWHERE is_active = TRUE\nORDER BY created_at DESC\nLIMIT 10;`,
            tip: 'Tip: Always specify only the columns you need instead of SELECT * in production.'
          },
          {
            id: 'ex-2',
            title: 'Real-World Application // Aggregate Analytics',
            badge: '02 // REAL-LIFE USAGE',
            category: 'Practical',
            explanation: 'Grouping and aggregating transactions to generate dashboard metrics.',
            code: `SELECT \n  department_id,\n  COUNT(*) AS total_employees,\n  ROUND(AVG(salary), 2) AS average_salary,\n  MAX(salary) AS highest_salary\nFROM employees\nGROUP BY department_id\nHAVING COUNT(*) >= 5;`,
            tip: 'Tip: HAVING filters grouped aggregates, whereas WHERE filters individual rows before grouping.'
          },
          {
            id: 'ex-3',
            title: 'Pro Gotcha // NULL Comparisons',
            badge: '03 // COMMON MISTAKE & FIX',
            category: 'Gotcha',
            explanation: 'In SQL, NULL = NULL is NEVER true! You must always use IS NULL or IS NOT NULL.',
            code: `-- ❌ WRONG: Returns 0 rows because NULL = NULL evaluates to UNKNOWN\n-- SELECT * FROM orders WHERE shipped_at = NULL;\n\n-- ✅ CORRECT: Use IS NULL or COALESCE\nSELECT id, customer_id, COALESCE(shipped_at, 'PENDING') AS ship_status\nFROM orders\nWHERE shipped_at IS NULL;`,
            tip: 'Tip: COALESCE(column, fallback) replaces NULL with a safe default value.'
          }
        ];

      default:
        return [
          {
            id: 'ex-1',
            title: `Standard Syntax Pattern // ${title}`,
            badge: '01 // SIMPLE PATTERN',
            category: 'Foundation',
            explanation: 'Idiomatic code structure following the language standard and compiler conventions.',
            code: cleanStarter || `// Foundation pattern for ${title}\n// Follow clear types and memory safety conventions`,
            tip: 'Tip: Consistency and clear contracts between functions make code easy to maintain.'
          },
          {
            id: 'ex-2',
            title: 'Real-World Application // Production Logic',
            badge: '02 // REAL-LIFE USAGE',
            category: 'Practical',
            explanation: 'Structuring business rules with predictable input validation and error handling.',
            code: cleanSolution || cleanStarter,
            tip: 'Tip: Separate validation, computation, and output formatting into distinct steps.'
          },
          {
            id: 'ex-3',
            title: 'Pro Gotcha // Resource Safety & Boundaries',
            badge: '03 // COMMON MISTAKE & FIX',
            category: 'Gotcha',
            explanation: 'Ensure array boundaries, memory allocation, and type conversions are strictly verified.',
            code: `// Defensive boundary checks\n// Always check length/bounds before indexing into arrays or buffers`,
            tip: 'Tip: Treat all external inputs as untrusted until validated.'
          }
        ];
    }
  },

  /**
   * Generates 4 distinct confirmed problem models:
   * 1️⃣ Guess the Output (What will print?) (Quiz)
   * 2️⃣ Spot the Mistake (Bug Detective) (Fix the Bug)
   * 3️⃣ Fill in the Blank (Missing Piece) (Fill in the Blank)
   * 4️⃣ Mini Coding Challenge (Variant Coding Task)
   */
  _generateConfirmedModels(lesson, lang, title, task, starter, solution, lessonId) {
    const isPython = lang === 'python';
    const isJS = lang === 'javascript';
    const isSQL = lang === 'sql';

    const cleanStarter = starter ? starter.trim() : '';
    const cleanSolution = solution ? solution.trim() : '';

    // ==========================================
    // MODEL 1: Predict Output / Concept Quiz
    // ==========================================
    let quizModel;
    if (title.toLowerCase().includes('hello') || title.toLowerCase().includes('first') || title.toLowerCase().includes('print')) {
      quizModel = {
        id: `${lessonId}-m1-quiz`,
        modelType: 'quiz',
        title: '1️⃣ Guess the Output (What will print?)',
        badge: 'Mental Model / Output Prediction',
        icon: '🔮',
        question: 'What will be printed to the console when this code runs?',
        snippet: isPython
          ? 'greeting = "CodeHero"\nprint(f"Welcome, {greeting}!")'
          : isJS
          ? 'const greeting = "CodeHero";\nconsole.log(`Welcome, ${greeting}!`);'
          : isSQL
          ? "SELECT 'Welcome, CodeHero!' AS greeting;"
          : 'printf("Welcome, CodeHero!\\n");',
        options: [
          'Welcome, {greeting}!',
          'Welcome, CodeHero!',
          'Error: Variable not found',
          'greeting'
        ],
        correctIndex: 1,
        explanation: "The computer replaces {greeting} with the actual word stored inside the greeting box: 'CodeHero'!",
        xpReward: 15
      };
    } else if (title.toLowerCase().includes('comment') || title.toLowerCase().includes('readab')) {
      quizModel = {
        id: `${lessonId}-m1-quiz`,
        modelType: 'quiz',
        title: '1️⃣ Guess the Output (What will print?)',
        badge: 'Mental Model / Comments',
        icon: '🔮',
        question: 'What is printed to the console when the program executes?',
        snippet: isPython
          ? '# print("Line Alpha")\nprint("Line Beta")\n# print("Line Gamma")'
          : '// console.log("Line Alpha");\nconsole.log("Line Beta");\n// console.log("Line Gamma");',
        options: [
          'Line Alpha\nLine Beta\nLine Gamma',
          'Line Beta',
          'Nothing is printed',
          'SyntaxError: Comments not allowed'
        ],
        correctIndex: 1,
        explanation: 'The computer completely ignores notes starting with #. Only real code runs and prints. Only "Line Beta" executes and prints.',
        xpReward: 15
      };
    } else if (title.toLowerCase().includes('variable') || title.toLowerCase().includes('type')) {
      quizModel = {
        id: `${lessonId}-m1-quiz`,
        modelType: 'quiz',
        title: '1️⃣ Guess the Output (What will print?)',
        badge: 'Mental Model / Variables',
        icon: '🔮',
        question: 'What is the final value printed by this sequence?',
        snippet: isPython
          ? 'score = 10\nscore = score + 5\nscore = score * 2\nprint(score)'
          : 'let score = 10;\nscore = score + 5;\nscore = score * 2;\nconsole.log(score);',
        options: [
          '15',
          '20',
          '30',
          '10'
        ],
        correctIndex: 2,
        explanation: 'Step 1: score starts at 10. Step 2: 10 + 5 = 15. Step 3: 15 * 2 = 30.',
        xpReward: 15
      };
    } else if (title.toLowerCase().includes('loop') || title.toLowerCase().includes('for') || title.toLowerCase().includes('while')) {
      quizModel = {
        id: `${lessonId}-m1-quiz`,
        modelType: 'quiz',
        title: '1️⃣ Guess the Output (What will print?)',
        badge: 'Mental Model / Loop Count',
        icon: '🔮',
        question: 'How many times will the message inside the loop print?',
        snippet: isPython
          ? 'count = 0\nfor i in range(1, 4):\n    count += 1\nprint(count)'
          : 'let count = 0;\nfor (let i = 1; i < 4; i++) {\n  count++;\n}\nconsole.log(count);',
        options: [
          '4 times',
          '3 times',
          '2 times',
          'Infinite loop'
        ],
        correctIndex: 1,
        explanation: 'The range [1, 4) produces values 1, 2, and 3. That is exactly 3 iterations, so count is 3.',
        xpReward: 15
      };
    } else {
      quizModel = {
        id: `${lessonId}-m1-quiz`,
        modelType: 'quiz',
        title: '1️⃣ Guess the Output (What will print?)',
        badge: 'Mental Model / Concept Check',
        icon: '🔮',
        question: `Based on the lesson concept for "${title}", what will this snippet produce?`,
        snippet: cleanSolution ? cleanSolution.slice(0, 180) : cleanStarter.slice(0, 180),
        options: [
          'Executes successfully and returns the expected result',
          'Raises an unhandled SyntaxError',
          'Enters an infinite loop without output',
          'Silently ignores the input and returns None'
        ],
        correctIndex: 0,
        explanation: 'The code follows the canonical pattern established in this lesson, returning the verified result.',
        xpReward: 15
      };
    }

    // ==========================================
    // MODEL 2: Bug Detective / Fix the Flaw
    // ==========================================
    let bugModel;
    if (title.toLowerCase().includes('hello') || title.toLowerCase().includes('print') || title.toLowerCase().includes('first')) {
      bugModel = {
        id: `${lessonId}-m2-bug`,
        modelType: 'bug',
        title: '2️⃣ Spot the Mistake (Bug Detective)',
        badge: 'Debug / Find & Fix the Bug',
        icon: '🐛',
        question: 'A student wrote this code, but there is a small typo mistake! Which option fixes the code correctly?',
        brokenSnippet: isPython
          ? 'print("Hello, World!\\n# Missing closing quote'
          : 'console.log("Hello, World!;\\n// Missing closing quote',
        options: [
          isPython ? 'Add closing quote and parenthesis: print("Hello, World!")' : 'Add closing quote and parenthesis: console.log("Hello, World!");',
          'Capitalize the print function to Print()',
          'Remove the double quotes entirely: print(Hello, World!)'
        ],
        correctIndex: 0,
        diagnosis: 'Strings opened with double quotes must always be closed with a matching double quote before closing the parenthesis.',
        fixedSnippet: isPython ? 'print("Hello, World!")' : 'console.log("Hello, World!");',
        xpReward: 15
      };
    } else if (title.toLowerCase().includes('comment')) {
      bugModel = {
        id: `${lessonId}-m2-bug`,
        modelType: 'bug',
        title: '2️⃣ Spot the Mistake (Bug Detective)',
        badge: 'Debug / Accidental Commenting',
        icon: '🐛',
        question: 'The application runs with no errors, but outputs nothing at all! What is causing this bug?',
        brokenSnippet: isPython
          ? '# result = calculate_total([10, 20, 30])\n# print("Total:", result)'
          : '// const result = calculateTotal([10, 20, 30]);\n// console.log("Total:", result);',
        options: [
          'The function name has a typo',
          'The lines are accidentally commented out, so the computer ignores them',
          'The list syntax is invalid'
        ],
        correctIndex: 1,
        diagnosis: 'Comments tell the interpreter to skip those lines. Uncommenting them restores execution.',
        fixedSnippet: isPython ? 'result = calculate_total([10, 20, 30])\nprint("Total:", result)' : 'const result = calculateTotal([10, 20, 30]);\nconsole.log("Total:", result);',
        xpReward: 15
      };
    } else {
      bugModel = {
        id: `${lessonId}-m2-bug`,
        modelType: 'bug',
        title: '2️⃣ Spot the Mistake (Bug Detective)',
        badge: 'Debug / Spot the Logic Flaw',
        icon: '🐛',
        question: `There is a subtle bug in this implementation for "${title}". Identify the exact fix to make it pass.`,
        brokenSnippet: isPython
          ? 'def process_item(item):\n    result = item * 2\n    # Missing return statement'
          : 'function processItem(item) {\n  const result = item * 2;\n  // Missing return\n}',
        options: [
          isPython ? 'Add "return result" at the end of the function' : 'Add "return result;" at the end of the function',
          'Change item * 2 to item + 2',
          'Rename item to items'
        ],
        correctIndex: 0,
        diagnosis: 'Without a return statement, the function computes the result in memory but returns None (or undefined) to the caller.',
        fixedSnippet: isPython ? 'def process_item(item):\n    result = item * 2\n    return result' : 'function processItem(item) {\n  const result = item * 2;\n  return result;\n}',
        xpReward: 15
      };
    }

    // ==========================================
    // MODEL 3: Fill-in-the-Blank / Syntax Builder
    // ==========================================
    let fillModel;
    if (title.toLowerCase().includes('hello') || title.toLowerCase().includes('print') || title.toLowerCase().includes('first')) {
      fillModel = {
        id: `${lessonId}-m3-fill`,
        modelType: 'fill',
        title: '3️⃣ Fill in the Blank (Missing Piece)',
        badge: 'Syntax / Fill in the Blank',
        icon: '🧩',
        question: 'Choose the correct keyword to fill in the blank to print the greeting to the screen.',
        templateSnippet: isPython
          ? '____("CodeHero Academy is awesome!")'
          : 'console.____("CodeHero Academy is awesome!");',
        tokens: isPython ? ['print', 'echo', 'display', 'write'] : ['log', 'print', 'show', 'write'],
        correctToken: isPython ? 'print' : 'log',
        explanation: isPython
          ? 'In Python, the built-in function to display text onto the console is "print()".'
          : 'In JavaScript, the standard console method to log output is "console.log()".',
        fullSnippet: isPython
          ? 'print("CodeHero Academy is awesome!")'
          : 'console.log("CodeHero Academy is awesome!");',
        xpReward: 15
      };
    } else if (title.toLowerCase().includes('comment')) {
      fillModel = {
        id: `${lessonId}-m3-fill`,
        modelType: 'fill',
        title: '3️⃣ Fill in the Blank (Missing Piece)',
        badge: 'Syntax / Fill in the Blank',
        icon: '🧩',
        question: 'What symbol fills in the blank to make this line a single-line comment?',
        templateSnippet: isPython
          ? '____ This line explains what the next function does\nprint("Active line")'
          : '____ This line explains what the next function does\nconsole.log("Active line");',
        tokens: isPython ? ['#', '//', '/*', '--'] : ['//', '#', '<!--', '--'],
        correctToken: isPython ? '#' : '//',
        explanation: isPython
          ? 'In Python, single-line comments always begin with the hash/octothorpe symbol "#".'
          : 'In JavaScript, single-line comments always begin with double slashes "//".',
        fullSnippet: isPython
          ? '# This line explains what the next function does\nprint("Active line")'
          : '// This line explains what the next function does\nconsole.log("Active line");',
        xpReward: 15
      };
    } else {
      fillModel = {
        id: `${lessonId}-m3-fill`,
        modelType: 'fill',
        title: '3️⃣ Fill in the Blank (Missing Piece)',
        badge: 'Syntax / Fill in the Blank',
        icon: '🧩',
        question: 'Complete the statement by choosing the missing keyword.',
        templateSnippet: isPython
          ? 'def get_status():\n    status = "Active"\n    ____ status'
          : 'function getStatus() {\n  const status = "Active";\n  ____ status;\n}',
        tokens: ['return', 'send', 'output', 'yield'],
        correctToken: 'return',
        explanation: 'The "return" keyword hands the calculated value back to whoever called the function.',
        fullSnippet: isPython
          ? 'def get_status():\n    status = "Active"\n    return status'
          : 'function getStatus() {\n  const status = "Active";\n  return status;\n}',
        xpReward: 15
      };
    }

    // ==========================================
    // MODEL 4: Applied Variation Challenge
    // ==========================================
    let variantModel;
    if (title.toLowerCase().includes('hello') || title.toLowerCase().includes('print') || title.toLowerCase().includes('first')) {
      variantModel = {
        id: `${lessonId}-m4-variant`,
        modelType: 'variant',
        title: 'Model 4: Applied Variation',
        badge: 'Hands-on Challenge / Variation',
        icon: '⚡',
        taskDescription: 'Create a multi-line victory announcement using two separate output statements.',
        starterCode: isPython
          ? '# Task: Print two lines:\n# Line 1: [LEVEL 1 UNLOCKED]\n# Line 2: Ready for battle!\n'
          : '// Task: Log two lines:\n// Line 1: [LEVEL 1 UNLOCKED]\n// Line 2: Ready for battle!\n',
        solutionCode: isPython
          ? 'print("[LEVEL 1 UNLOCKED]")\nprint("Ready for battle!")'
          : 'console.log("[LEVEL 1 UNLOCKED]");\nconsole.log("Ready for battle!");',
        expectedOutput: '[LEVEL 1 UNLOCKED]\nReady for battle!',
        hint: 'Use two separate output commands in sequence.',
        xpReward: 20
      };
    } else if (title.toLowerCase().includes('comment')) {
      variantModel = {
        id: `${lessonId}-m4-variant`,
        modelType: 'variant',
        title: 'Model 4: Applied Variation',
        badge: 'Hands-on Challenge / Variation',
        icon: '⚡',
        taskDescription: 'Add clear documentation comments above each print statement explaining its purpose.',
        starterCode: isPython
          ? '# Add helpful comments above each line below\nprint("Server starting on port 8080...")\nprint("Database connection established.")\n'
          : '// Add helpful comments above each line below\nconsole.log("Server starting on port 8080...");\nconsole.log("Database connection established.");\n',
        solutionCode: isPython
          ? '# Initialize HTTP server\nprint("Server starting on port 8080...")\n# Connect to database\nprint("Database connection established.")'
          : '// Initialize HTTP server\nconsole.log("Server starting on port 8080...");\n// Connect to database\nconsole.log("Database connection established.");',
        expectedOutput: 'Server starting on port 8080...\nDatabase connection established.',
        hint: 'Add lines beginning with # (or // in JS) that explain the system startup.',
        xpReward: 20
      };
    } else {
      variantModel = {
        id: `${lessonId}-m4-variant`,
        modelType: 'variant',
        title: 'Model 4: Applied Variation',
        badge: 'Hands-on Challenge / Variation',
        icon: '⚡',
        taskDescription: `Apply the core technique of "${title}" to handle a list of multiple items instead of just one.`,
        starterCode: isPython
          ? `# Variation Task for ${title}\ndef handle_batch(items):\n    # Process each item in items\n    pass\n\nprint(handle_batch([10, 20, 30]))`
          : `// Variation Task for ${title}\nfunction handleBatch(items) {\n  // Process each item in items\n}\n\nconsole.log(handleBatch([10, 20, 30]));`,
        solutionCode: isPython
          ? 'def handle_batch(items):\n    return [item * 2 for item in items]\n\nprint(handle_batch([10, 20, 30]))'
          : 'function handleBatch(items) {\n  return items.map(x => x * 2);\n}\n\nconsole.log(handleBatch([10, 20, 30]));',
        expectedOutput: '[20, 40, 60]',
        hint: 'Iterate through the collection and apply the lesson operation to each element.',
        xpReward: 20
      };
    }

    return [quizModel, bugModel, fillModel, variantModel];
  }
};
