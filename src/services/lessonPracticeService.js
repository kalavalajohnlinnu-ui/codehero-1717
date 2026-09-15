// Multi-Angle Practice & Examples Engine for INGENIUM Academy
// Generates concrete runnable code examples and 3 distinct practice drills for each lesson:
// 1. Warmup Variation (core pattern & muscle memory)
// 2. Defensive Edge Case (guarding against boundaries, empty values, zeros)
// 3. Real-World Engineering Scenario (production architecture pattern)

export const lessonPracticeService = {
  getLessonExamplesAndDrills(lesson, languageId = 'python') {
    if (!lesson) {
      return { examples: [], drills: [] };
    }

    const title = lesson.title || 'Coding Challenge';
    const concept = lesson.concept || '';
    const task = lesson.task || '';
    const starter = lesson.starterCode || '';
    const solution = lesson.solution || starter;
    const lang = (languageId || 'python').toLowerCase();

    // Check if lesson has pre-authored custom examples & drills
    if (lesson.examples && lesson.drills) {
      return {
        examples: lesson.examples,
        drills: lesson.drills
      };
    }

    // Dynamic generator tailored to language and concept patterns
    const generatedExamples = this._generateExamples(lesson, lang, title, concept, starter, solution);
    const generatedDrills   = this._generateDrills(lesson, lang, title, task, starter, solution);

    return {
      examples: generatedExamples,
      drills: generatedDrills
    };
  },

  _generateExamples(lesson, lang, title, concept, starter, solution) {
    switch (lang) {
      case 'python':
        return [
          {
            id: 'ex-1',
            title: `Foundation: Standard Pattern for ${title}`,
            badge: '01 // SYNTAX PATTERN',
            category: 'Foundation',
            explanation: `Notice how Python keeps syntax clean and readable. The key is understanding how data flows from input to return.`,
            code: starter.trim() ? starter : `# Basic pattern for ${title}\ndef execute_pattern(data):\n    # Process elements directly\n    result = [x * 2 for x in data if x > 0]\n    return result\n\nprint(execute_pattern([1, 2, 3, 4]))`,
            tip: 'Tip: Python emphasizes clean readability. Always favor clear variable names over cryptic abbreviations.'
          },
          {
            id: 'ex-2',
            title: `Practical Application: Real Data Flow`,
            badge: '02 // APPLIED LOGIC',
            category: 'Practical',
            explanation: `Here is how you apply this exact concept in a production Python microservice or API handler.`,
            code: solution.trim() && solution !== starter ? solution : `# Applied scenario for ${title}\ndef process_user_metrics(records):\n    summary = {"valid": 0, "processed": []}\n    for item in records:\n        if item is not None:\n            summary["valid"] += 1\n            summary["processed"].append(str(item).strip())\n    return summary\n\nprint(process_user_metrics(["Alpha", "Beta", None, "Gamma"]))`,
            tip: 'Tip: Notice how None checks guard against crashes before string transformations.'
          },
          {
            id: 'ex-3',
            title: `Defensive Gotcha: Avoiding Common Pitfalls`,
            badge: '03 // DEFENSIVE GOTCHA',
            category: 'Gotcha',
            explanation: `Common mistake: mutating collections during iteration or unexpected NoneType errors.`,
            code: `# Anti-pattern vs Senior Python Pattern\n# ❌ AVOID: Default mutable arguments or missing guard\ndef faulty(data=[]): pass  # Mutates across invocations!\n\n# ✅ PREFER: Explicit None defaults & defensive copies\ndef robust(data=None):\n    data = list(data) if data is not None else []\n    return data\n\nprint("Defensive copy created:", robust([10, 20]))`,
            tip: 'Tip: Never use mutable objects (like lists or dicts) as default parameter values in Python.'
          }
        ];

      case 'javascript':
        return [
          {
            id: 'ex-1',
            title: `Foundation: Modern ES6+ Pattern for ${title}`,
            badge: '01 // SYNTAX PATTERN',
            category: 'Foundation',
            explanation: `Using modern JavaScript const/let, arrow functions, and immutability for predictable code.`,
            code: starter.trim() ? starter : `// Modern ES6+ approach\nconst handleData = (items = []) => {\n  return items.filter(x => Boolean(x)).map(x => x * 2);\n};\n\nconsole.log(handleData([1, 2, 3, 4]));`,
            tip: 'Tip: Use const by default. Only reach for let when a variable genuinely needs re-assignment.'
          },
          {
            id: 'ex-2',
            title: `Practical Application: Asynchronous & Object Safe`,
            badge: '02 // APPLIED LOGIC',
            category: 'Practical',
            explanation: `Handling optional chaining (?.) and nullish coalescing (??) to prevent undefined property errors.`,
            code: `// Safe object access pattern\nfunction formatUserProfile(user) {\n  const username = user?.profile?.name ?? 'Guest Engineer';\n  const score = user?.stats?.score ?? 0;\n  return { id: user?.id, username, score, isActive: score > 50 };\n}\n\nconsole.log(formatUserProfile({ id: 'u_101', profile: { name: 'Ada Lovelace' }, stats: { score: 98 } }));`,
            tip: 'Tip: Optional chaining ?. stops TypeError: Cannot read properties of undefined in its tracks.'
          },
          {
            id: 'ex-3',
            title: `Defensive Gotcha: Strict Equality & Coercion`,
            badge: '03 // DEFENSIVE GOTCHA',
            category: 'Gotcha',
            explanation: `Always use strict triple equals (===) instead of loose equality (==) to eliminate type coercion bugs.`,
            code: `// Equality differences\nconsole.log(0 == false);   // true (Dangerous coercion!)\nconsole.log(0 === false);  // false (Safe strict check)\n\nconsole.log("" == 0);      // true\nconsole.log("" === 0);     // false`,
            tip: 'Tip: ESLint and production codebases strictly enforce === across all branches.'
          }
        ];

      case 'sql':
        return [
          {
            id: 'ex-1',
            title: `Foundation: Relational Query Structure`,
            badge: '01 // SQL PATTERN',
            category: 'Foundation',
            explanation: `Structured SQL follows the order: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY.`,
            code: starter.trim() ? starter : `SELECT \n    department_id, \n    COUNT(*) AS total_employees,\n    ROUND(AVG(salary), 2) AS avg_salary\nFROM employees\nWHERE status = 'ACTIVE'\nGROUP BY department_id\nHAVING COUNT(*) >= 2\nORDER BY avg_salary DESC;`,
            tip: 'Tip: SQL executes FROM and WHERE before SELECT and ORDER BY.'
          },
          {
            id: 'ex-2',
            title: `Practical Application: Inner & Left Joins`,
            badge: '02 // RELATIONAL JOINS',
            category: 'Practical',
            explanation: `Combining records across primary and foreign key relationships with index precision.`,
            code: `SELECT \n    u.name AS student_name,\n    c.course_title,\n    e.enrolled_at\nFROM students u\nLEFT JOIN enrollments e ON u.id = e.student_id\nLEFT JOIN courses c ON e.course_id = c.id\nLIMIT 5;`,
            tip: 'Tip: LEFT JOIN guarantees all primary table records remain visible even without enrollment matches.'
          }
        ];

      case 'html':
        return [
          {
            id: 'ex-1',
            title: `Foundation: Semantic DOM Architecture`,
            badge: '01 // SEMANTIC HTML',
            category: 'Foundation',
            explanation: `Semantic tags (<main>, <article>, <section>, <nav>) provide built-in accessibility and SEO clarity.`,
            code: starter.trim() ? starter : `<main class="hero-container">\n  <header class="header-strip">\n    <h1>Ingenium Studio</h1>\n    <p>Master the craft of systems.</p>\n  </header>\n</main>`,
            tip: 'Tip: Always prefer native semantic tags over generic <div> soup.'
          }
        ];

      default:
        return [
          {
            id: 'ex-1',
            title: `Standard Idiomatic Pattern for ${title}`,
            badge: '01 // SYNTAX PATTERN',
            category: 'Foundation',
            explanation: `Clean, idiomatic structure following language best practices and memory safety.`,
            code: starter.trim() ? starter : `# Concept pattern for ${title}\n# See problem description for specific parameters`,
            tip: 'Tip: Break complex problems into small, single-responsibility functions.'
          }
        ];
    }
  },

  _generateDrills(lesson, lang, title, task, starter, solution) {
    switch (lang) {
      case 'python':
        return [
          {
            id: 'drill-1',
            title: 'Drill A // Warmup: Quick Parameter Variation',
            type: 'Warmup',
            tag: 'Pattern Recall',
            difficulty: 'Easy',
            badgeColor: '#10B981',
            goal: `Test your syntax speed. Modify the code to handle an alternating list of inputs and return the output.`,
            starterCode: starter ? `${starter.trim()}\n\n# DRILL A: Try with [15, 30, 45, 60]\nprint("Warmup Test:", end=" ")` : `# Warmup Practice for ${title}\ndef warmup_test(x, y):\n    return x + y\n\nprint("Result:", warmup_test(10, 20))`,
            hint: 'Focus on verifying the expected return type (int, list, bool, or str).'
          },
          {
            id: 'drill-2',
            title: 'Drill B // Defensive: Edge Cases & Boundary Safety',
            type: 'Edge Case',
            tag: 'Bug Buster & Guard Rails',
            difficulty: 'Medium',
            badgeColor: '#F59E0B',
            goal: `Guard your code against empty inputs, None values, or zero divisions without crashing.`,
            starterCode: `${starter ? starter.trim() : '# Starter code'}\n\n# DRILL B: Edge Case Test (Empty, Zero, and Negative Values)\ndef test_edge_cases():\n    test_inputs = [[], None, 0, -1, ""]\n    print("Testing edge cases safely...")\n\ntest_edge_cases()`,
            hint: 'Add an early return guard statement at the very top of your function (e.g. if not data: return default).'
          },
          {
            id: 'drill-3',
            title: 'Drill C // Pro: Real-World Systems Scenario',
            type: 'Real-World',
            tag: 'Senior Engineer Pattern',
            difficulty: 'Hard',
            badgeColor: '#8B5CF6',
            goal: `Implement this logic in a realistic engineering context (e.g., telemetry streaming or batch validator).`,
            starterCode: `# DRILL C: Real-World Scenario for ${title}\ndef process_stream(data_stream):\n    """Production pipeline processor"""\n    results = []\n    for packet in data_stream:\n        # Apply core lesson logic to each packet\n        pass\n    return results\n\n# Simulated incoming telemetry stream\nstream = [{"id": 1, "val": 42}, {"id": 2, "val": 99}]\nprint("Pipeline output:", process_stream(stream))`,
            hint: 'Think like a systems architect: validate input, process in a single pass, and return structured telemetry.'
          }
        ];

      case 'javascript':
        return [
          {
            id: 'drill-1',
            title: 'Drill A // Warmup: Functional Array Mapping',
            type: 'Warmup',
            tag: 'Functional Core',
            difficulty: 'Easy',
            badgeColor: '#10B981',
            goal: `Re-implement the logic using concise arrow functions and standard JS methods.`,
            starterCode: `${starter ? starter.trim() : '// Starter'}\n\n// DRILL A: Functional test\nconsole.log("Warmup test running...");`,
            hint: 'Check if you can use .map(), .filter(), or .reduce() for a clean 1-line expression.'
          },
          {
            id: 'drill-2',
            title: 'Drill B // Defensive: Nullish & Type Guarding',
            type: 'Edge Case',
            tag: 'Defensive Guards',
            difficulty: 'Medium',
            badgeColor: '#F59E0B',
            goal: `Ensure zero TypeError exceptions occur when invoked with null, undefined, or empty arrays.`,
            starterCode: `${starter ? starter.trim() : '// Starter'}\n\n// DRILL B: Defensive Edge Cases\nfunction safeExecute(input) {\n  if (input == null) return null;\n  // Your defensive logic here\n}\n\nconsole.log(safeExecute(null));\nconsole.log(safeExecute([]));`,
            hint: 'Use optional chaining (?.) and default parameters (= []) to guard against runtime exceptions.'
          },
          {
            id: 'drill-3',
            title: 'Drill C // Pro: Async / Event Handler Pipeline',
            type: 'Real-World',
            tag: 'Web Platform Pro',
            difficulty: 'Hard',
            badgeColor: '#8B5CF6',
            goal: `Wrap this transformation inside an async API handler with proper try/catch error handling.`,
            starterCode: `// DRILL C: Production Async API Handler\nasync function apiHandler(payload) {\n  try {\n    if (!payload) throw new Error("Payload required");\n    // Apply lesson logic\n    return { success: true, data: payload };\n  } catch (err) {\n    return { success: false, error: err.message };\n  }\n}\n\napiHandler({ sample: 123 }).then(console.log);`,
            hint: 'Always return a predictable { success, data, error } contract from API handlers.'
          }
        ];

      case 'sql':
        return [
          {
            id: 'drill-1',
            title: 'Drill A // Warmup: Filtering & Aliasing',
            type: 'Warmup',
            tag: 'Filter Logic',
            difficulty: 'Easy',
            badgeColor: '#10B981',
            goal: 'Add an extra condition and custom AS column alias.',
            starterCode: `${starter ? starter.trim() : 'SELECT * FROM records;'}\n-- DRILL A: Add an ORDER BY and LIMIT clause`,
            hint: 'Use ORDER BY column_name DESC LIMIT 10.'
          },
          {
            id: 'drill-2',
            title: 'Drill B // Defensive: Handling NULL Values',
            type: 'Edge Case',
            tag: 'NULL Guarding',
            difficulty: 'Medium',
            badgeColor: '#F59E0B',
            goal: 'Use COALESCE() or IS NOT NULL to eliminate missing data discrepancies.',
            starterCode: `${starter ? starter.trim() : 'SELECT * FROM records;'}\n-- DRILL B: Guard against NULL with COALESCE(col, 'N/A')`,
            hint: 'COALESCE(val, 0) replaces NULL values with 0 so arithmetic never returns NULL.'
          },
          {
            id: 'drill-3',
            title: 'Drill C // Pro: Aggregation & Window Analytics',
            type: 'Real-World',
            tag: 'Analytics Query',
            difficulty: 'Hard',
            badgeColor: '#8B5CF6',
            goal: 'Calculate a running summary or grouped metric across categories.',
            starterCode: `${starter ? starter.trim() : 'SELECT * FROM records;'}\n-- DRILL C: Group by category and filter with HAVING`,
            hint: 'GROUP BY category_id HAVING COUNT(*) > 1;'
          }
        ];

      default:
        return [
          {
            id: 'drill-1',
            title: 'Drill A // Warmup: Parameter Variation',
            type: 'Warmup',
            tag: 'Syntax Exercise',
            difficulty: 'Easy',
            badgeColor: '#10B981',
            goal: 'Practice writing this logic with different variable values.',
            starterCode: starter,
            hint: 'Focus on memory safety and exact types.'
          },
          {
            id: 'drill-2',
            title: 'Drill B // Defensive: Boundary Verification',
            type: 'Edge Case',
            tag: 'Edge Cases',
            difficulty: 'Medium',
            badgeColor: '#F59E0B',
            goal: 'Test boundary conditions such as 0, 1, empty, and maximum bounds.',
            starterCode: starter,
            hint: 'Check array lengths before indexing.'
          },
          {
            id: 'drill-3',
            title: 'Drill C // Pro: Modular Refactor',
            type: 'Real-World',
            tag: 'Architecture',
            difficulty: 'Hard',
            badgeColor: '#8B5CF6',
            goal: 'Separate helper logic into a pure modular function.',
            starterCode: starter,
            hint: 'Keep side-effects separated from business calculations.'
          }
        ];
    }
  }
};
