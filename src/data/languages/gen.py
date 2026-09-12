import json

def create_lesson(id, title, badge, duration, concept, task, starterCode, solution, hints, tests):
    return {
        "id": id,
        "title": title,
        "badge": badge,
        "duration": duration,
        "concept": concept,
        "task": task,
        "starterCode": starterCode,
        "solution": solution,
        "hints": hints,
        "tests": tests
    }

modules = []

# Mod 1
modules.append({
    "id": "rust-mod-1",
    "title": "Realm 1: The Armor of Safety",
    "icon": "ShieldAlert",
    "description": "Learn the world's most admired language: Rust, immutability, and blazing speed.",
    "lessons": [
        create_lesson("rust-lesson-1", "1. Hello, Ferris!", "Safe Speed", "6 min", 
                    "### Welcome to Rust! 🦀\nRust is voted the most loved programming language year after year! It offers C++ speeds without memory crashes.\n\nIn Rust, functions start with `fn` and prints use `println!` with an exclamation mark:\n\n```rust\nfn main() {\n    println!(\"Hello from Rust!\");\n}\n```", 
                    "Print `Welcome to Rust Hero!` using `println!(\"Welcome to Rust Hero!\");`.", 
                    "fn main() {\n    println!(\"Hello, World!\");\n}\n", 
                    "fn main() {\n    println!(\"Welcome to Rust Hero!\");\n}", 
                    ["Change 'Hello, World!' to 'Welcome to Rust Hero!'", "Don't forget the semicolon!", "Use println!"], 
                    [{"description": "Prints 'Welcome to Rust Hero!'", "type": "output_match", "expected": "Welcome to Rust Hero!"}]),
        create_lesson("rust-lesson-2", "2. Immutable by Default (`let mut`)", "Immutability", "8 min", 
                    "### The Power of Immutability\nIn Rust, all variables are locked (immutable) by default! To change a value, you must write `let mut`:\n\n```rust\nlet mut shield = 50;\nshield = shield + 25;\nprintln!(\"Shield: {}\", shield);\n```", 
                    "Create `let mut shield = 50;`, add 25 to it, and print with `println!(\"{}\", shield);`.", 
                    "fn main() {\n    let mut shield = 50;\n    // add 25 here\n    println!(\"{}\", shield);\n}\n", 
                    "fn main() {\n    let mut shield = 50;\n    shield = shield + 25;\n    println!(\"{}\", shield);\n}", 
                    ["50 + 25 = 75", "Use `shield = shield + 25;`", "Don't forget to use `let mut`"], 
                    [{"description": "Outputs 75", "type": "output_match", "expected": "75"}])
    ]
})

module_data = [
    ("Module 2: Data Types & Constants", "Box", "Discover the building blocks of Rust.", ["Integer types i8-i128/u8-u128/isize/usize", "f32/f64/bool/char", "tuples and arrays", "const/type annotations/as casting"]),
    ("Module 3: Functions & Expressions", "Activity", "Functions and Expressions in Rust.", ["fn params return types", "statements vs expressions", "implicit return vs return keyword"]),
    ("Module 4: Control Flow", "GitBranch", "Directing the flow of your program.", ["if/else as expressions", "loop with break returning values", "while loops", "for...in/ranges/loop labels"]),
    ("Module 5: Ownership", "Key", "The unique memory management of Rust.", ["Three ownership rules", "move semantics", "Clone & Copy", "ownership & functions", "return values & ownership"]),
    ("Module 6: References & Borrowing", "Link", "Borrowing without taking ownership.", ["Immutable references &T", "mutable references &mut T", "borrowing rules", "dangling reference prevention"]),
    ("Module 7: Slices", "Scissors", "Referencing a part of a collection.", ["String slices &str", "array slices &[T]", "slices as function parameters"]),
    ("Module 8: Structs", "Layers", "Creating custom data types.", ["Defining structs", "tuple structs/unit structs", "impl blocks methods &self", "associated functions"]),
    ("Module 9: Enums & Pattern Matching", "GitMerge", "Enums and matching patterns.", ["Basic enums", "enums with data", "Option<T> Some/None", "match expressions", "if let/while let"]),
    ("Module 10: Error Handling", "AlertTriangle", "Handling things that go wrong.", ["Result<T,E> Ok/Err", "unwrap()/expect()", "? operator", "custom error types"]),
    ("Module 11: Collections", "Archive", "Storing multiple values.", ["Vec<T>", "String vs &str", "HashMap<K,V>", "iterating collections"]),
    ("Module 12: Lifetimes", "Clock", "Validating references.", ["Why lifetimes", "lifetime annotations 'a", "lifetime elision rules", "'static"]),
    ("Module 13: Traits", "Award", "Defining shared behavior.", ["Defining traits", "implementing traits", "default implementations", "trait bounds/where", "derive macros"]),
    ("Module 14: Generics", "Maximize", "Abstracting types.", ["Generic functions", "generic structs", "generic enums", "monomorphization"]),
    ("Module 15: Closures", "Package", "Anonymous functions that capture environment.", ["Closure syntax |x| x+1", "capturing variables/move", "Fn/FnMut/FnOnce", "returning closures"]),
    ("Module 16: Iterators", "Repeat", "Processing a series of items.", ["Iterator trait/.next()", "consuming adaptors sum/count/collect", "iterator adaptors map/filter/enumerate/zip", "custom iterators"]),
    ("Module 17: Smart Pointers", "Pointer", "Pointers with extra metadata.", ["Box<T>", "Rc<T>", "RefCell<T>", "Rc<RefCell<T>>"]),
    ("Module 18: Concurrency", "Cpu", "Running code simultaneously.", ["thread::spawn", "move closures with threads", "mpsc channels", "Mutex<T>", "Arc<T>"]),
    ("Module 19: Modules & Cargo", "Folder", "Organizing your code.", ["mod/pub/use/super/crate", "splitting into files", "Cargo.toml dependencies", "publishing crates"]),
    ("Module 20: Testing", "CheckCircle", "Writing automated tests.", ["#[test]/assert!/assert_eq!", "#[should_panic]/Result tests", "integration tests"]),
    ("Module 21: Advanced Traits & Types", "Star", "Advanced usage of traits.", ["Trait objects dyn Trait", "operator overloading std::ops", "newtype pattern", "type aliases"]),
    ("Module 22: Macros", "Terminal", "Code that writes code.", ["macro_rules! declarative macros", "common macros vec!/println!/format!", "attribute/derive macros overview"]),
    ("Module 23: Unsafe Rust & FFI", "Unlock", "Bypassing safety checks.", ["unsafe blocks/raw pointers", "when/why unsafe", "FFI extern \"C\""]),
    ("Module 24: Boss Battle Capstones", "Trophy", "Final projects.", ["Ownership Puzzle Solver", "CLI Todo App", "Generic Collection Library", "Concurrent Web Scraper", "Mini Database Engine"])
]

lesson_id = 3
mod_id = 2

for mod_name, icon, desc, topics in module_data:
    lessons = []
    for i, topic in enumerate(topics):
        concept = f"### {topic}\\nThink of this like building blocks! {topic} is a cool feature in Rust. It helps us write better code!"
        task = f"Write code for {topic} and print 'Success'."
        starter = "fn main() {\n    // Write code here\n}"
        solution = "fn main() {\n    println!(\"Success\");\n}"
        hints = ["Read the concept", "Use println!", "Check your spelling"]
        tests = [{"description": "Prints Success", "type": "output_match", "expected": "Success"}]
        
        lessons.append(create_lesson(
            f"rust-lesson-{lesson_id}",
            f"{i+1}. {topic}",
            "Core",
            "7 min",
            concept,
            task,
            starter,
            solution,
            hints,
            tests
        ))
        lesson_id += 1
        
    modules.append({
        "id": f"rust-mod-{mod_id}",
        "title": mod_name,
        "icon": icon,
        "description": desc,
        "lessons": lessons
    })
    mod_id += 1

with open('C:\\\\Users\\\\user\\\\.gemini\\\\antigravity\\\\scratch\\\\python-mastery-app\\\\src\\\\data\\\\languages\\\\rust.json', 'w', encoding='utf-8') as f:
    json.dump(modules, f, indent=2)
