// Multi-Language Quick Reference & Cheat Sheet Catalog

export const PYTHON_CHEATSHEET = [
  {
    category: "Core Types & Variables",
    items: [
      { syntax: 'x = 10', desc: "Integer (whole number)" },
      { syntax: 'pi = 3.1415', desc: "Float (decimal number)" },
      { syntax: 'name = "Alex"', desc: "String (text in quotes)" },
      { syntax: 'is_active = True', desc: "Boolean (True or False, capitalized)" },
      { syntax: 'type(x)', desc: "Returns type of variable, e.g. <class 'int'>" },
      { syntax: 'int("42"), float("3.14"), str(100)', desc: "Type conversion (casting)" }
    ]
  },
  {
    category: "Arithmetic & Logic Operators",
    items: [
      { syntax: '+, -, *, /', desc: "Add, subtract, multiply, divide (float)" },
      { syntax: '//, %, **', desc: "Floor division, modulo (remainder), power" },
      { syntax: '==, !=, <, >, <=, >=', desc: "Comparison operators (returns True/False)" },
      { syntax: 'and, or, not', desc: "Logical operators (e.g. x > 0 and y > 0)" },
      { syntax: 'x in collection', desc: "Membership check (e.g. 'a' in 'apple')" }
    ]
  },
  {
    category: "Strings & String Methods",
    items: [
      { syntax: 's.lower(), s.upper()', desc: "Convert string case" },
      { syntax: 's.strip()', desc: "Remove leading/trailing whitespace" },
      { syntax: 's.replace("old", "new")', desc: "Replace occurrences of substring" },
      { syntax: 's.split(",")', desc: "Split string into list by delimiter" },
      { syntax: 'f"Score: {score:.2f}"', desc: "Formatted f-string with formatting modifiers" },
      { syntax: 's[0], s[-1], s[0:3]', desc: "Indexing, negative index, and slicing" }
    ]
  },
  {
    category: "Lists & Dictionaries",
    items: [
      { syntax: 'lst = [1, 2, 3]', desc: "Create mutable ordered list" },
      { syntax: 'lst.append(x)', desc: "Add element x to the end" },
      { syntax: 'd = {"key": "val"}', desc: "Create key-value dictionary" },
      { syntax: 'd.get("key", default)', desc: "Safe lookup with fallback value" }
    ]
  },
  {
    category: "Control Flow & Loops",
    items: [
      { syntax: 'if cond: ... elif: ... else:', desc: "Conditional branching (note colon and indentation)" },
      { syntax: 'for item in collection:', desc: "Iterate over every element in sequence" },
      { syntax: 'for i in range(5):', desc: "Loop numbers 0 through 4" },
      { syntax: 'while cond: ...', desc: "Repeat until condition becomes False" }
    ]
  }
];

export const JAVASCRIPT_CHEATSHEET = [
  {
    category: "Variables & Data Types",
    items: [
      { syntax: 'const name = "Aria";', desc: "Immutable variable binding" },
      { syntax: 'let score = 100;', desc: "Reassignable variable" },
      { syntax: 'typeof x', desc: "Returns type: 'string', 'number', 'boolean', 'object'" },
      { syntax: 'Number("42"), String(100)', desc: "Type conversion" }
    ]
  },
  {
    category: "Console & Output",
    items: [
      { syntax: 'console.log(x);', desc: "Print value or object to console" },
      { syntax: '`Hello ${name}!`', desc: "Template literal string interpolation" }
    ]
  },
  {
    category: "Arrays & Objects",
    items: [
      { syntax: 'const arr = [1, 2, 3];', desc: "Create array" },
      { syntax: 'arr.push(4); arr.pop();', desc: "Add to end / remove from end" },
      { syntax: 'arr.map(x => x * 2);', desc: "Transform every element into new array" },
      { syntax: 'const user = { name: "Leo", age: 20 };', desc: "Object literal with properties" }
    ]
  },
  {
    category: "Functions & Arrow Syntax",
    items: [
      { syntax: 'function add(a, b) { return a + b; }', desc: "Standard function declaration" },
      { syntax: 'const add = (a, b) => a + b;', desc: "Arrow function expression" }
    ]
  }
];

export const HTML_CHEATSHEET = [
  {
    category: "Structure & Text",
    items: [
      { syntax: '<h1>...</h1> to <h6>...</h6>', desc: "Headings from biggest (h1) to smallest (h6)" },
      { syntax: '<p>Paragraph text</p>', desc: "Standard text paragraph" },
      { syntax: '<span style="...">...</span>', desc: "Inline text wrapper" },
      { syntax: '<strong>Bold</strong>, <em>Italic</em>', desc: "Emphasized typography" }
    ]
  },
  {
    category: "Media & Interactive",
    items: [
      { syntax: '<button>Click Me</button>', desc: "Clickable UI action button" },
      { syntax: '<a href="https://...">Link</a>', desc: "Hyperlink to web resource" },
      { syntax: '<img src="cat.png" alt="Hero" />', desc: "Image element" },
      { syntax: '<input type="text" placeholder="..." />', desc: "User text entry box" }
    ]
  },
  {
    category: "CSS Styles",
    items: [
      { syntax: 'color: #38bdf8;', desc: "Text color" },
      { syntax: 'background-color: #0f172a;', desc: "Element background color" },
      { syntax: 'padding: 12px 24px;', desc: "Inner spacing" },
      { syntax: 'border-radius: 16px;', desc: "Smooth rounded corners" },
      { syntax: 'display: flex; gap: 8px;', desc: "Flexbox layout with gap spacing" }
    ]
  }
];

export const SQL_CHEATSHEET = [
  {
    category: "Queries & Filtering",
    items: [
      { syntax: 'SELECT * FROM heroes;', desc: "Retrieve all columns from table" },
      { syntax: 'SELECT name, level FROM heroes;', desc: "Retrieve specific columns" },
      { syntax: 'WHERE level >= 10;', desc: "Filter rows matching condition" },
      { syntax: 'WHERE name = "Aria" AND power > 50;', desc: "Combine multiple filter conditions" }
    ]
  },
  {
    category: "Sorting & Limiting",
    items: [
      { syntax: 'ORDER BY score DESC;', desc: "Sort descending (highest first)" },
      { syntax: 'ORDER BY name ASC;', desc: "Sort alphabetically (A to Z)" },
      { syntax: 'LIMIT 5;', desc: "Return only the top 5 matching records" }
    ]
  },
  {
    category: "Data Modification",
    items: [
      { syntax: 'INSERT INTO heroes VALUES (...);', desc: "Add a new row to table" },
      { syntax: 'UPDATE heroes SET level = 2 WHERE id = 1;', desc: "Modify existing records" }
    ]
  }
];

export const C_CHEATSHEET = [
  {
    category: "Basics & Entry Point",
    items: [
      { syntax: '#include <stdio.h>', desc: "Include standard input/output library" },
      { syntax: 'int main() { ... return 0; }', desc: "Program entry point function" }
    ]
  },
  {
    category: "Formatted Printing",
    items: [
      { syntax: 'printf("Hello\\n");', desc: "Print text with newline" },
      { syntax: 'printf("Score: %d\\n", score);', desc: "Format integer with %d" },
      { syntax: 'printf("Name: %s\\n", name);', desc: "Format string with %s" },
      { syntax: 'printf("Value: %.2f\\n", pi);', desc: "Format float to 2 decimal places" }
    ]
  },
  {
    category: "Variables & Types",
    items: [
      { syntax: 'int age = 15;', desc: "32-bit integer" },
      { syntax: 'float price = 9.99f;', desc: "Single-precision decimal" },
      { syntax: 'char grade = "A";', desc: "Single character in single quotes" }
    ]
  }
];

export const JAVA_CHEATSHEET = [
  {
    category: "Class & Main Method",
    items: [
      { syntax: 'public class Main { ... }', desc: "Every Java program lives in a class" },
      { syntax: 'public static void main(String[] args)', desc: "Standard entry point" },
      { syntax: 'System.out.println("Hello");', desc: "Print line to console" }
    ]
  },
  {
    category: "Variables & Syntax",
    items: [
      { syntax: 'int level = 5;', desc: "Integer variable" },
      { syntax: 'String hero = "Leo";', desc: "String object (capital S)" },
      { syntax: 'boolean isReady = true;', desc: "Boolean primitive" },
      { syntax: 'final int MAX = 100;', desc: "Constant value (cannot change)" }
    ]
  }
];

export const RUST_CHEATSHEET = [
  {
    category: "Basics & Functions",
    items: [
      { syntax: 'fn main() { ... }', desc: "Rust program entry point" },
      { syntax: 'println!("Hello, {}!", name);', desc: "Safe string formatting macro" }
    ]
  },
  {
    category: "Variables & Mutability",
    items: [
      { syntax: 'let x = 5;', desc: "Immutable binding by default" },
      { syntax: 'let mut count = 0;', desc: "Mutable variable (can be changed)" },
      { syntax: 'const MAX_HEALTH: u32 = 100;', desc: "Compile-time constant" }
    ]
  }
];

export const CHEATSHEET_BY_LANG = {
  python: PYTHON_CHEATSHEET,
  javascript: JAVASCRIPT_CHEATSHEET,
  typescript: JAVASCRIPT_CHEATSHEET,
  html: HTML_CHEATSHEET,
  sql: SQL_CHEATSHEET,
  c: C_CHEATSHEET,
  cpp: C_CHEATSHEET,
  java: JAVA_CHEATSHEET,
  rust: RUST_CHEATSHEET
};

// Backward compatibility export
export const CHEATSHEET_CATEGORIES = PYTHON_CHEATSHEET;

export function getCheatsheetForLang(langId) {
  return CHEATSHEET_BY_LANG[langId] || PYTHON_CHEATSHEET;
}
