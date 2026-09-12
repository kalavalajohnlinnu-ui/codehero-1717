import json
import os

lesson_counter = 3

def create_lesson(title, badge, duration, concept, task, starter, solution, hints, expected_out):
    global lesson_counter
    l = {
        "id": f"java-lesson-{lesson_counter}",
        "title": title,
        "badge": badge,
        "duration": duration,
        "concept": concept,
        "task": task,
        "starterCode": starter,
        "solution": solution,
        "hints": hints,
        "tests": [
            {
                "description": "Correct output",
                "type": "output_includes",
                "expected": expected_out
            }
        ]
    }
    lesson_counter += 1
    return l

modules = []

# Mod 1
modules.append({
    "id": "java-mod-1",
    "title": "Module 1: The Blueprint Kingdom",
    "icon": "Box",
    "description": "Master Java classes, strong typing, and object-oriented architecture.",
    "lessons": [
      {
        "id": "java-lesson-1",
        "title": "1. Hello, Java!",
        "badge": "Core",
        "duration": "6 min",
        "concept": "### Welcome to Java! ☕\nJava is like a factory. Every piece of code belongs to a blueprint called a `class`.\n\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello!\");\n    }\n}\n```",
        "task": "Print `Welcome to Java Hero!`.",
        "starterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}\n",
        "solution": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Welcome to Java Hero!\");\n    }\n}",
        "hints": ["Change text inside quotes", "Use System.out.println", "Add semicolon"],
        "tests": [{"description": "Prints welcome", "type": "output_match", "expected": "Welcome to Java Hero!"}]
      },
      {
        "id": "java-lesson-2",
        "title": "2. Variables & Arithmetic",
        "badge": "Core",
        "duration": "7 min",
        "concept": "### Data Types in Java\nThink of variables like labeled boxes. A box labeled `int` only holds whole numbers!\n\n```java\nint a = 20;\nint b = 30;\nSystem.out.println(a + b);\n```",
        "task": "Print the sum of 15 and 10.",
        "starterCode": "public class Main {\n    public static void main(String[] args) {\n        int attack = 15;\n        int bonus = 10;\n        System.out.println(0);\n    }\n}\n",
        "solution": "public class Main {\n    public static void main(String[] args) {\n        int attack = 15;\n        int bonus = 10;\n        System.out.println(attack + bonus);\n    }\n}",
        "hints": ["Add attack and bonus", "Put them in println", "Run code"],
        "tests": [{"description": "Outputs 25", "type": "output_match", "expected": "25"}]
      }
    ]
})

module_specs = [
    (2, "Primitive Types & Type System", 4, "Types", ["Primitives", "Wrapper Classes", "Type Casting", "Final/Var"]),
    (3, "Operators & Input", 3, "Logic", ["Arithmetic & Relational", "Scanner Input", "Math Class"]),
    (4, "Conditionals", 3, "Logic", ["If/Else", "Switch", "Ternary"]),
    (5, "Loops", 4, "Core", ["For Loop", "While Loop", "Enhanced For", "Break & Continue"]),
    (6, "Strings Deep Dive", 4, "Core", ["String Immutability", "String Methods", "Equals vs ==", "StringBuilder"]),
    (7, "Arrays", 3, "Data", ["1D Arrays", "Multidimensional", "Arrays Utility"]),
    (8, "Methods", 4, "Core", ["Defining Methods", "Overloading", "Static vs Instance", "Recursion"]),
    (9, "OOP Part 1 Classes & Objects", 4, "OOP", ["Classes & Objects", "Constructors", "Access Modifiers", "Encapsulation"]),
    (10, "OOP Part 2 Inheritance", 4, "OOP", ["Extends", "Super", "Override", "Object Class"]),
    (11, "OOP Part 3 Polymorphism", 4, "OOP", ["Polymorphism", "Abstract Classes", "Interfaces", "Default Methods"]),
    (12, "OOP Part 4 Advanced", 4, "Advanced", ["Instanceof", "Inner Classes", "Records", "Sealed Classes"]),
    (13, "Exception Handling", 4, "Advanced", ["Try/Catch", "Checked/Unchecked", "Throw/Throws", "Custom Exceptions"]),
    (14, "Collections Part 1", 4, "Data", ["ArrayList", "LinkedList", "HashSet", "TreeSet"]),
    (15, "Collections Part 2", 4, "Data", ["HashMap", "TreeMap", "Queue", "Collections Utility"]),
    (16, "Generics", 4, "Advanced", ["Why Generics", "Generic Classes", "Generic Methods", "Wildcards"]),
    (17, "Lambda & Functional Interfaces", 4, "Advanced", ["Functional Interfaces", "Lambdas", "Method References", "Comparator"]),
    (18, "Streams API", 5, "Advanced", ["Creating Streams", "Filter", "Map", "Reduce", "Collect"]),
    (19, "Optional & Null Safety", 3, "Advanced", ["Optional", "isPresent", "Chaining"]),
    (20, "File I/O", 4, "Advanced", ["Scanner Reading", "Buffered I/O", "NIO Paths", "Try-With-Resources"]),
    (21, "Concurrency", 4, "Advanced", ["Threads", "Synchronized", "ExecutorService", "CompletableFuture"]),
    (22, "Data Structures", 4, "Data", ["Stack", "Queue", "Linked List", "BST"]),
    (23, "Algorithms", 4, "Logic", ["Bubble Sort", "Merge Sort", "Binary Search", "Big-O"]),
    (24, "Design Patterns", 4, "Advanced", ["Singleton", "Factory", "Observer", "Strategy"]),
    (25, "Boss Battle Capstones", 5, "Boss Battle", ["Student Manager", "Bank System", "Inventory", "Download Sim", "Library System"]),
]

for mod_num, title, num_lessons, badge, lesson_topics in module_specs:
    lessons = []
    for i in range(num_lessons):
        topic = lesson_topics[i]
        
        concept = f"### {topic}\\nLet's learn about {topic} in Java! Think of it like a toy box where you organize your toys perfectly."
        task = f"Print out '{topic} Complete!'"
        starter = "public class Main {\\n    public static void main(String[] args) {\\n        // code\\n    }\\n}"
        sol = f"public class Main {{\\n    public static void main(String[] args) {{\\n        System.out.println(\"{topic} Complete!\");\\n    }}\\n}}"
        hints = ["Use System.out.println", "Check spelling", "Add semicolon at the end"]
        expected = f"{topic} Complete!"
        
        lessons.append(create_lesson(f"{i+1}. {topic}", badge, "10 min", concept, task, starter, sol, hints, expected))
        
    modules.append({
        "id": f"java-mod-{mod_num}",
        "title": f"Module {mod_num}: {title}",
        "icon": "Code",
        "description": f"Master {title} in Java.",
        "lessons": lessons
    })


out_path = r"C:\Users\user\.gemini\antigravity\scratch\python-mastery-app\src\data\languages\java.json"
with open(out_path, "w") as f:
    json.dump(modules, f, indent=2)
print("Done")
