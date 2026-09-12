// Pyodide WebAssembly Python Execution Engine & Live State Inspector
let pyodideInstance = null;
let pyodideLoadingPromise = null;

// Initialize Pyodide
export async function initPyodide(onProgress) {
  if (pyodideInstance) return pyodideInstance;

  if (!pyodideLoadingPromise) {
    pyodideLoadingPromise = (async () => {
      if (typeof window === 'undefined') return null;

      // Check if window.loadPyodide is available
      if (window.loadPyodide) {
        try {
          if (onProgress) onProgress("Initializing WebAssembly Python runtime...");
          const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/"
          });
          pyodideInstance = pyodide;
          if (onProgress) onProgress("Python 3.12 Wasm Ready!");
          return pyodide;
        } catch (err) {
          console.warn("CDN Pyodide initialization failed, running in fallback mode:", err);
          return null;
        }
      } else {
        console.warn("window.loadPyodide not found, running with fallback evaluator");
        return null;
      }
    })();
  }

  return pyodideLoadingPromise;
}

// Execute Python code and introspect variables
export async function runPythonCode(code, pyodide = pyodideInstance) {
  const startTime = performance.now();

  // If real Pyodide is available, execute inside genuine CPython
  if (pyodide) {
    try {
      // Wrapper script to capture stdout, stderr and extract user variables
      const runnerScript = `
import sys
import io
import json

__stdout_capture = io.StringIO()
__stderr_capture = io.StringIO()
__old_stdout = sys.stdout
__old_stderr = sys.stderr

sys.stdout = __stdout_capture
sys.stderr = __stderr_capture

__exec_error = None
try:
    __user_globals = {}
    # Run user code
    exec(${JSON.stringify(code)}, __user_globals)
except Exception as e:
    import traceback
    __exec_error = traceback.format_exc()
finally:
    sys.stdout = __old_stdout
    sys.stderr = __old_stderr

# Introspect user variables
__vars = []
for k, v in __user_globals.items():
    if not k.startswith('__') and not callable(v) and not hasattr(v, '__module__') and type(v).__name__ not in ('module', 'function', 'type'):
        try:
            val_repr = repr(v)
            if len(val_repr) > 120:
                val_repr = val_repr[:117] + "..."
            __vars.append({
                "name": k,
                "type": type(v).__name__,
                "value": val_repr
            })
        except:
            pass
    elif type(v).__name__ in ('function', 'type') and not k.startswith('__'):
        __vars.append({
            "name": k,
            "type": type(v).__name__,
            "value": f"<{type(v).__name__} {k}>"
        })

{
    "stdout": __stdout_capture.getvalue(),
    "stderr": __stderr_capture.getvalue(),
    "error": __exec_error,
    "variables": __vars
}
`;

      const pyResult = await pyodide.runPythonAsync(runnerScript);
      const resultObj = pyResult.toJs ? pyResult.toJs({ dict_converter: Object.fromEntries }) : pyResult;
      const duration = Math.round(performance.now() - startTime);

      let stdout = "";
      let stderr = "";
      let error = null;
      let variables = [];

      if (resultObj) {
        stdout = resultObj.stdout || (resultObj.get && resultObj.get('stdout')) || "";
        stderr = resultObj.stderr || (resultObj.get && resultObj.get('stderr')) || "";
        error = resultObj.error || (resultObj.get && resultObj.get('error')) || null;
        variables = resultObj.variables || (resultObj.get && resultObj.get('variables')) || [];
        if (typeof variables.toJs === 'function') {
          variables = variables.toJs();
        }
      }

      return {
        success: !error,
        stdout: stdout.trimEnd(),
        stderr: stderr.trimEnd(),
        error: error,
        variables: Array.isArray(variables) ? variables : [],
        durationMs: duration,
        isWasm: true
      };
    } catch (err) {
      return {
        success: false,
        stdout: "",
        stderr: "",
        error: String(err),
        variables: [],
        durationMs: Math.round(performance.now() - startTime),
        isWasm: true
      };
    }
  }

  // Fallback Evaluator (used if WebAssembly is still initializing or network is restricted)
  return runFallbackSimulator(code, startTime);
}

// Fallback simulator for basic commands
function runFallbackSimulator(code, startTime) {
  let stdoutLogs = [];
  let variables = [];
  let error = null;

  try {
    // Parse print statements
    const printRegex = /print\s*\((.*?)\)/g;
    let match;
    while ((match = printRegex.exec(code)) !== null) {
      let rawArg = match[1].trim();
      // String literal
      if ((rawArg.startsWith('"') && rawArg.endsWith('"')) || (rawArg.startsWith("'") && rawArg.endsWith("'"))) {
        stdoutLogs.push(rawArg.slice(1, -1));
      } else {
        try {
          // Attempt simple eval
          const cleanArg = rawArg.replace(/True/g, 'true').replace(/False/g, 'false');
          // eslint-disable-next-line no-eval
          const evaluated = eval(cleanArg);
          stdoutLogs.push(String(evaluated));
        } catch {
          stdoutLogs.push(rawArg);
        }
      }
    }

    // Parse simple variable assignments
    const varRegex = /([a-zA-Z_]\w*)\s*=\s*(.+)/g;
    while ((match = varRegex.exec(code)) !== null) {
      const varName = match[1];
      const valRaw = match[2].trim();
      if (!varName.startsWith('#') && !['if', 'for', 'while', 'def', 'class'].includes(varName)) {
        variables.push({
          name: varName,
          type: valRaw.startsWith('"') || valRaw.startsWith("'") ? 'str' : !isNaN(valRaw) ? (valRaw.includes('.') ? 'float' : 'int') : 'value',
          value: valRaw
        });
      }
    }
  } catch (e) {
    error = String(e);
  }

  return {
    success: !error,
    stdout: stdoutLogs.join('\n'),
    stderr: "",
    error,
    variables,
    durationMs: Math.round(performance.now() - startTime),
    isWasm: false
  };
}

// Automated Test Runner for Lessons
export function evaluateLessonTests(executionResult, lessonTests) {
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
      const missing = test.expected.filter(exp => !out.includes(exp));
      passed = missing.length === 0;
      actualValue = passed ? "All required text found" : `Missing: ${missing.join(', ')}`;
    } else if (test.type === "var_check") {
      const varMap = {};
      (executionResult.variables || []).forEach(v => {
        let val = v.value;
        if (typeof val === 'string') {
          if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
            val = val.slice(1, -1);
          } else if (!isNaN(val)) {
            val = Number(val);
          } else if (val === 'True') {
            val = true;
          } else if (val === 'False') {
            val = false;
          }
        }
        varMap[v.name] = val;
      });

      let allMatch = true;
      const mismatches = [];

      for (const [key, expectedVal] of Object.entries(test.vars)) {
        const actual = varMap[key];
        const eq = JSON.stringify(actual) === JSON.stringify(expectedVal) || actual == expectedVal;
        if (!eq) {
          allMatch = false;
          mismatches.push(`${key}: expected ${JSON.stringify(expectedVal)}, got ${JSON.stringify(actual)}`);
        }
      }

      passed = allMatch;
      actualValue = passed ? "All variables match" : mismatches.join('; ');
    }

    return {
      description: test.description,
      passed,
      actual: actualValue
    };
  });

  const allPassed = results.every(r => r.passed) && executionResult.success;
  return { allPassed, results };
}
