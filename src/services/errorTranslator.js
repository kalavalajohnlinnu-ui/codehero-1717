// Beginner-Friendly Python Error Translator
// Converts complex stack traces into clear, actionable, friendly advice

export function translatePythonError(rawError) {
  if (!rawError) return null;
  const errStr = String(rawError);

  // 1. Indentation Error
  if (errStr.includes("IndentationError")) {
    if (errStr.includes("expected an indented block")) {
      return {
        type: "IndentationError",
        title: "Missing Indentation (4 Spaces)",
        explanation: "Python uses indentation to know which lines belong inside a block (such as inside an `if`, `for`, `while`, or `def`).",
        fix: "Press Tab or add 4 spaces to indent the line directly beneath your colon `:` statement."
      };
    }
    if (errStr.includes("unexpected indent")) {
      return {
        type: "IndentationError",
        title: "Unexpected Indent",
        explanation: "A line was indented when Python did not expect a block. Python is strict about aligned margins.",
        fix: "Remove unnecessary spaces from the beginning of the line so it aligns with surrounding code."
      };
    }
    return {
      type: "IndentationError",
      title: "Indentation Issue",
      explanation: "Your code's spacing is inconsistent. Python requires code blocks to align cleanly.",
      fix: "Standardize on 4 spaces per indentation level and avoid mixing tabs and spaces."
    };
  }

  // 2. Syntax Error
  if (errStr.includes("SyntaxError")) {
    if (errStr.includes("expected ':'") || errStr.includes("invalid syntax")) {
      return {
        type: "SyntaxError",
        title: "Grammar Mistake or Missing Colon `:`",
        explanation: "Python couldn't understand this line of code. Check if you missed a colon `:` at the end of an `if`, `elif`, `else`, `for`, `while`, or `def` line.",
        fix: "Look at the end of the line highlighted with `^`. Ensure all parentheses `()` and quotes `\"\"` are closed, and colons `:` are present."
      };
    }
    return {
      type: "SyntaxError",
      title: "Syntax Error",
      explanation: "There is an unclosed quote, mismatched bracket, or unsupported symbol in your code.",
      fix: "Carefully inspect quotes, brackets `() [] {}`, and check for accidental typos."
    };
  }

  // 3. NameError
  if (errStr.includes("NameError")) {
    const match = errStr.match(/name '(\w+)' is not defined/);
    const varName = match ? match[1] : "variable";
    return {
      type: "NameError",
      title: "Undefined Name: '" + varName + "'",
      explanation: "Python encountered '" + varName + "', but doesn't know what it is. It hasn't been created yet, or was spelled differently.",
      fix: "1. Check spelling and capitalization (Python is case-sensitive: 'Print' is NOT 'print').\n2. Make sure you defined " + varName + " = ... BEFORE using it.\n3. If it was meant to be text, did you forget quotes: \"" + varName + "\"?"
    };
  }

  // 4. TypeError
  if (errStr.includes("TypeError")) {
    if (errStr.includes("can only concatenate str") || errStr.includes("unsupported operand type")) {
      return {
        type: "TypeError",
        title: "Mismatched Data Types",
        explanation: "You tried to combine incompatible types—for example, adding a string to an integer with `+` without converting first.",
        fix: "Convert the number to text with `str(number)` or use an f-string: `f\"Value: {number}\"`."
      };
    }
    return {
      type: "TypeError",
      title: "Type Error",
      explanation: "An operation or function was called on an incompatible data type.",
      fix: "Inspect variable types using `type(x)` and convert when necessary using `int()`, `float()`, or `str()`."
    };
  }

  // 5. ZeroDivisionError
  if (errStr.includes("ZeroDivisionError")) {
    return {
      type: "ZeroDivisionError",
      title: "Division by Zero",
      explanation: "In mathematics and in Python, dividing a number by 0 is undefined and impossible.",
      fix: "Check your divisor before dividing: add an `if divisor != 0:` check or catch it with `try...except ZeroDivisionError`."
    };
  }

  // 6. IndexError
  if (errStr.includes("IndexError")) {
    return {
      type: "IndexError",
      title: "List Index Out of Range",
      explanation: "You tried to access an item at an index number that doesn't exist in the list. Remember Python lists start at index 0!",
      fix: "Remember: for a list with 3 items, valid indices are `0, 1, 2`. Accessing `[3]` triggers this error. Use `len(list)` to check bounds."
    };
  }

  // 7. KeyError
  if (errStr.includes("KeyError")) {
    const match = errStr.match(/KeyError: ['"]?([^'"\n]+)['"]?/);
    const keyName = match ? match[1] : "key";
    return {
      type: "KeyError",
      title: "Key Not Found: '" + keyName + "'",
      explanation: "You tried to access dictionary key '" + keyName + "', but it does not exist in the dictionary.",
      fix: "Use dict.get('" + keyName + "', default_value) to safely retrieve values with a fallback, or check with: if '" + keyName + "' in my_dict:"
    };
  }

  // Default Fallback
  return {
    type: "Runtime Error",
    title: "Runtime Issue Detected",
    explanation: "Python encountered an error while executing your code.",
    fix: "Read the traceback lines above to see which line number caused the error, and verify variable names and types."
  };
}
