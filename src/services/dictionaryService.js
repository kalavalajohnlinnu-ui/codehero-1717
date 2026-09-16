// Simple English Programming Dictionary for Beginners
// Explains tough computer words like a patient teacher for 1st-time learners and school students.

export const PROGRAMMING_DICTIONARY = {
  print: {
    word: 'print()',
    simpleTitle: 'Show on Screen',
    meaning: 'Telling the computer to write or show words on your screen so humans can read them.',
    analogy: 'Like writing a message on a school blackboard or sending a WhatsApp message to your screen.',
    example: 'print("Hello India!")'
  },
  variable: {
    word: 'Variable',
    simpleTitle: 'Labeled Storage Box',
    meaning: 'A named container in computer memory where you store something (like a name, score, or number) to use later.',
    analogy: 'Like a labeled tiffin box or plastic storage box in your kitchen. If you write "sugar" on the box, it holds sugar!',
    example: 'score = 100\nstudent_name = "Aarav"'
  },
  string: {
    word: 'String',
    simpleTitle: 'Plain Text / Letters',
    meaning: 'Any plain words, letters, or sentences. In code, you MUST always put quote marks "..." around text so the computer knows it is words, not math.',
    analogy: 'Like a necklace string of beads, where each bead is a letter in your word.',
    example: 'city = "Mumbai"\ngreeting = "Namaste"'
  },
  integer: {
    word: 'Integer (int)',
    simpleTitle: 'Clean Whole Number',
    meaning: 'A normal whole counting number with no decimal point or fraction.',
    analogy: 'Like counting how many cricket balls you have: 1, 2, 5, 11 (you cannot have half a ball in a match!).',
    example: 'age = 15\nruns = 85'
  },
  float: {
    word: 'Float',
    simpleTitle: 'Number with Decimal Point',
    meaning: 'Any number that has a dot / decimal point for fractions or money.',
    analogy: 'Like measuring your height in meters (1.65m) or the price of petrol (102.50 rupees).',
    example: 'price = 49.99\npi = 3.14'
  },
  boolean: {
    word: 'Boolean (bool)',
    simpleTitle: 'True or False (Yes or No)',
    meaning: 'A simple answer that can only ever be True or False, Yes or No, On or Off.',
    analogy: 'Like a room light switch: it is either ON (True) or OFF (False). There is no middle option!',
    example: 'is_passed = True\nis_raining = False'
  },
  comment: {
    word: 'Comment (#)',
    simpleTitle: 'Secret Note for Humans',
    meaning: 'Notes you write for yourself or your friends using `#`. The computer completely ignores comments when running code.',
    analogy: 'Like pencil notes you write in the margin of your textbook to remember something before exams.',
    example: '# This is just a note, computer will not run this!\nprint("Hello")'
  },
  function: {
    word: 'Function',
    simpleTitle: 'Mini Helper Machine / Recipe',
    meaning: 'A mini machine with a name that does a specific task whenever you call it. You write it once and use it 100 times.',
    analogy: 'Like a fruit juicer machine: you put fruit inside (inputs), press the button, and it pours juice (output)!',
    example: 'def make_tea():\n    print("Boil water and add tea leaves!")'
  },
  loop: {
    word: 'Loop (for / while)',
    simpleTitle: 'Repeat Again & Again',
    meaning: 'Telling the computer to repeat an action multiple times without you having to copy-paste the code.',
    analogy: 'Like running 5 laps around the sports ground, or a ceiling fan spinning until you switch it off.',
    example: 'for i in range(5):\n    print("Running lap number", i + 1)'
  },
  indentation: {
    word: 'Indentation',
    simpleTitle: '4 Spaces from Left Margin',
    meaning: 'Leaving 4 blank spaces from the left side. In Python, this tells the computer which lines of code live inside a block or room.',
    analogy: 'Like writing bullet points inside a chapter. Indented lines belong inside the parent room!',
    example: 'if score > 50:\n    print("You passed!")  # <-- 4 spaces here!'
  },
  bug: {
    word: 'Bug',
    simpleTitle: 'A Tiny Mistake / Error',
    meaning: 'A small typo or mistake in your code that stops the computer from understanding what to do.',
    analogy: 'Like dialing one wrong digit in a 10-digit phone number. The call will not connect until you fix that one digit!',
    example: 'prnt("Hello")  # Bug: spelling mistake, should be print'
  },
  syntax: {
    word: 'Syntax',
    simpleTitle: 'Grammar Rules of Coding',
    meaning: 'The exact spelling and punctuation rules of the programming language. Computers are strict about punctuation!',
    analogy: 'Like English grammar rules: putting a capital letter at the start of a sentence and a full stop at the end.',
    example: 'Missing a closing quote " or bracket ) is a syntax error.'
  },
  list: {
    word: 'List / Array [ ]',
    simpleTitle: 'Shopping List of Items',
    meaning: 'A container that holds multiple things in a row, wrapped inside square brackets `[ ... ]`.',
    analogy: 'Like a grocery shopping bag: [ "milk", "apples", "bread", "eggs" ].',
    example: 'friends = ["Rahul", "Priya", "Amit"]'
  },
  dictionary: {
    word: 'Dictionary { }',
    simpleTitle: 'Phonebook (Key : Value)',
    meaning: 'Storing data as pairs: a key name connected to its value, inside curly brackets `{ ... }`.',
    analogy: 'Like a school ID card: Name -> "Pooja", Roll No -> 24, Class -> 10.',
    example: 'student = {"name": "Pooja", "roll": 24}'
  },
  condition: {
    word: 'Condition (if / else)',
    simpleTitle: 'Making a Choice',
    meaning: 'Telling the computer to do one thing IF something is true, or do another thing ELSE if it is false.',
    analogy: 'Like deciding before leaving home: If it is raining, take an umbrella; else, wear sunglasses.',
    example: 'if marks >= 40:\n    print("Pass")\nelse:\n    print("Try Again")'
  },
  parameter: {
    word: 'Parameter / Argument',
    simpleTitle: 'Input Ingredients',
    meaning: 'The information or numbers you give into a function so it can do its job.',
    analogy: 'Like putting potatoes into a French fry machine. Potatoes are the arguments!',
    example: 'def greet(name):  # "name" is the parameter\n    print("Hello", name)'
  },
  return_val: {
    word: 'Return',
    simpleTitle: 'Giving the Final Answer Back',
    meaning: 'When a function finishes doing its math or job, it hands the final result back to you.',
    analogy: 'Like asking your friend to calculate total shopping bill. They do the math and hand the bill paper back to you.',
    example: 'def add(a, b):\n    return a + b  # Hands back the sum'
  }
};

export function getWordsForLesson(lesson) {
  if (!lesson) return [];

  const textToScan = `${lesson.title || ''} ${lesson.concept || ''} ${lesson.task || ''} ${lesson.badge || ''}`.toLowerCase();
  
  const foundWords = [];

  const checkMap = [
    { key: 'print', triggers: ['print', 'print(', 'output', 'display', 'screen'] },
    { key: 'variable', triggers: ['variable', 'variables', 'assign', 'store', '='] },
    { key: 'string', triggers: ['string', 'strings', 'quotes', 'text', 'letters'] },
    { key: 'integer', triggers: ['integer', 'integers', 'whole number', 'number', 'int'] },
    { key: 'float', triggers: ['float', 'decimal', 'precision', 'double'] },
    { key: 'boolean', triggers: ['boolean', 'bool', 'true', 'false'] },
    { key: 'comment', triggers: ['comment', 'comments', '#'] },
    { key: 'function', triggers: ['function', 'functions', 'def ', 'def(', 'call'] },
    { key: 'loop', triggers: ['loop', 'loops', 'for ', 'while ', 'iteration', 'repeat'] },
    { key: 'indentation', triggers: ['indentation', 'indent', 'spaces', 'tab', 'colon'] },
    { key: 'bug', triggers: ['bug', 'bugs', 'error', 'debug', 'fix'] },
    { key: 'syntax', triggers: ['syntax', 'grammar', 'colon', 'bracket'] },
    { key: 'list', triggers: ['list', 'lists', 'array', 'arrays', 'index', 'append'] },
    { key: 'dictionary', triggers: ['dictionary', 'dict', 'key', 'value', 'mapping'] },
    { key: 'condition', triggers: ['if', 'else', 'elif', 'condition', 'branch'] },
    { key: 'parameter', triggers: ['parameter', 'argument', 'params', 'args', 'inputs'] },
    { key: 'return_val', triggers: ['return', 'returns', 'result', 'gives back'] }
  ];

  for (const item of checkMap) {
    const hasMatch = item.triggers.some(trigger => textToScan.includes(trigger));
    if (hasMatch && PROGRAMMING_DICTIONARY[item.key]) {
      foundWords.push(PROGRAMMING_DICTIONARY[item.key]);
    }
  }

  // Always return at least 2 common words if none matched
  if (foundWords.length === 0) {
    foundWords.push(PROGRAMMING_DICTIONARY.print, PROGRAMMING_DICTIONARY.string);
  }

  return foundWords.slice(0, 4);
}
