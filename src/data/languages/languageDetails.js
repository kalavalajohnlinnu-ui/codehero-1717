// CodeHero Universe 2.0: Language Details & External Prompt Generator
export const LANGUAGE_DETAILS = {
  python: {
    id: 'python',
    name: 'Python',
    version: '3.12+ (CPython Runtime)',
    icon: '🐍',
    badge: 'AI, Data & Backend Systems',
    accentColor: '#38bdf8',
    docsUrl: 'https://docs.python.org/3/',
    executionModel: 'Compiles to bytecode (.pyc) executed on a stack VM. Browser runs CPython 3.12 WebAssembly via Pyodide.',
    paradigm: 'Multi-paradigm: Object-Oriented, Imperative, Functional, Metaprogramming',
    coreStrengths: [
      'Supreme expressiveness and rapid prototyping capability',
      'Global standard for Machine Learning and AI (PyTorch, TensorFlow, NumPy)',
      'Rich asynchronous I/O ecosystem (FastAPI, asyncio, aiohttp)',
      'Batteries-included standard library'
    ],
    top1PercentSkills: [
      'GIL internals, thread contention, and C-extension bypass',
      'Asyncio event loop customization and task scheduling',
      'Metaclasses, descriptor protocols, and AST manipulation',
      'Memory management: refcounting, cyclic GC, and __slots__ optimization',
      'Writing high-performance native extensions via C-API, Cython, or Rust (PyO3)'
    ],
    commonPitfalls: [
      {
        title: 'Mutable Default Arguments',
        problem: 'def append_to(item, target=[]): target.append(item) shares list across all invocations.',
        solution: 'Use None sentinel: def append_to(item, target=None): if target is None: target = []'
      },
      {
        title: 'Late Binding in Closures',
        problem: 'funcs = [lambda: i for i in range(3)] returns 2 for all invocations.',
        solution: 'Bind early with default args: [lambda i=i: i for i in range(3)]'
      }
    ],
    standardLibraryPowerTools: [
      { name: 'itertools', purpose: 'Memory-efficient combinatorial generators (product, permutations, chain, islice)' },
      { name: 'functools', purpose: 'Higher-order tools (lru_cache, partial, wraps, reduce)' },
      { name: 'collections', purpose: 'High-performance containers (deque, Counter, defaultdict, namedtuple)' },
      { name: 'concurrent.futures', purpose: 'High-level interface for thread and process pools' },
      { name: 'dataclasses', purpose: 'Declarative data classes with automated __eq__, __repr__, __hash__' }
    ],
    curatedQuestions: [
      {
        q: 'How does Python handle memory management and avoid memory leaks?',
        a: 'CPython uses primary reference counting paired with a generational cyclic garbage collector. Every object tracks its ob_refcnt. When it hits 0, memory is immediately reclaimed. The cyclic GC detects circular references (e.g. node.child points to node.parent) using 3 generation heaps (Gen 0, 1, 2) that run at increasing intervals.'
      },
      {
        q: 'What is the Global Interpreter Lock (GIL) and how do senior engineers work around it?',
        a: 'The GIL is a mutex protecting access to Python objects, preventing multiple native threads from executing bytecode concurrently on multiple CPU cores. Senior engineers bypass it for CPU-bound tasks using multiprocessing, ProcessPoolExecutor, native C/Rust extensions that release the GIL via Py_BEGIN_ALLOW_THREADS, or running Python 3.13 free-threaded builds.'
      },
      {
        q: 'How does the Descriptor Protocol work under the hood?',
        a: 'A descriptor is any object defining __get__(), __set__(), or __delete__(). When accessing obj.attr, Python traverses: data descriptors on class -> instance dictionary obj.__dict__ -> non-data descriptors -> class __dict__ -> __getattr__(). This powers @property, class methods, static methods, and ORMs.'
      }
    ]
  },

  javascript: {
    id: 'javascript',
    name: 'JavaScript / TypeScript',
    version: 'ECMAScript 2024 (V8 / Modern Browsers)',
    icon: '⚡',
    badge: 'Web, Mobile & Node.js Servers',
    accentColor: '#facc15',
    docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    executionModel: 'Single-threaded event-driven runtime with JIT compilation. Non-blocking async I/O orchestrated via Event Loop with call stack, microtasks, and macrotasks.',
    paradigm: 'Multi-paradigm: Prototype-based Object-Oriented, Functional, Event-Driven',
    coreStrengths: [
      'Ubiquitous language of modern browser client applications',
      'Universal full-stack execution across browser, backend (Node/Deno/Bun), and mobile',
      'Massive global ecosystem via npm with millions of battle-tested packages',
      'First-class asynchronous programming via Promises and async/await'
    ],
    top1PercentSkills: [
      'V8 internals: Hidden classes, inline caches, ignition bytecode, and Turbofan deoptimization triggers',
      'Event loop mechanics: Microtask vs Macrotask prioritization (Promise vs setTimeout)',
      'Memory leak diagnostics: Detached DOM nodes, dangling closures, and heap snapshot profiling',
      'Advanced TypeScript: Conditional types, template literal types, distributive unions, and covariance/contravariance',
      'High-performance rendering: Virtual DOM diffing, CSS containment, layout thrashing prevention'
    ],
    commonPitfalls: [
      {
        title: 'Asynchronous Loops with forEach',
        problem: 'items.forEach(async (item) => await save(item)) launches all promises concurrently without awaiting.',
        solution: 'Use for...of loop for sequential execution, or Promise.all(items.map(async ...)) for concurrent execution.'
      },
      {
        title: 'Floating Point Precision Quirks',
        problem: '0.1 + 0.2 produces 0.30000000000000004 due to IEEE 754 binary floating-point representation.',
        solution: 'Use Number.EPSILON comparison for tolerance, or work in integer units (cents instead of dollars) for currencies.'
      }
    ],
    standardLibraryPowerTools: [
      { name: 'Proxy & Reflect', purpose: 'Metaprogramming hooks for object virtualization, reactive binding, and validation' },
      { name: 'WeakMap & WeakSet', purpose: 'Garbage-collection-friendly object keys preventing memory leaks in cached state' },
      { name: 'Intl API', purpose: 'Native high-performance internationalization, date, currency, and list formatting' },
      { name: 'AbortController', purpose: 'Universal cancellation signal for Fetch requests, timers, and async operations' }
    ],
    curatedQuestions: [
      {
        q: 'How does V8 optimize object property access using Hidden Classes and Inline Caching?',
        a: 'When objects are initialized, V8 assigns an internal hidden class (shape). Adding properties transitions the object to a new shape. If all instances initialize properties in the exact same order, they share shapes. Inline Caches (ICs) store the memory offset of property lookups directly in machine code; altering property order ruins IC monomorphism and causes performance drops.'
      }
    ]
  },

  html: {
    id: 'html',
    name: 'HTML5 & Modern CSS',
    version: 'HTML Living Standard & CSS3/CSS4',
    icon: '🎨',
    badge: 'Design Systems & UI Architecture',
    accentColor: '#fb923c',
    docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    executionModel: 'Browser converts HTML to DOM and CSS to CSSOM, produces Render Tree, runs layout (reflow), paints bitmaps, and composites on GPU.',
    paradigm: 'Declarative Markup, Cascade Rules, Box Model, Algorithmic Layout Engines',
    coreStrengths: [
      'Accessible, universal semantic foundation for the entire World Wide Web',
      'Hardware-accelerated CSS animations and transforms running at 60/120 FPS',
      'Responsive design across any screen viewport from mobile to 8K displays',
      'Modern native layout algorithms (Flexbox, CSS Grid, Container Queries, Subgrid)'
    ],
    top1PercentSkills: [
      'Critical Rendering Path optimization: minimizing layout thrashing and render blocking',
      'GPU layer promotion and composite mechanics: transform/opacity vs top/left, will-change profiling',
      'Architecting tokenized design systems with CSS Custom Properties and Cascade Layers (@layer)',
      'WCAG 2.2 AAA accessibility: ARIA design patterns, focus management, screen reader navigation tree',
      'Container Queries (@container) and modern fluid typography with clamp()'
    ],
    commonPitfalls: [
      {
        title: 'Layout Thrashing in JS',
        problem: 'Interleaving DOM reads (offsetWidth) and writes (style.width) forces repeated sync reflows.',
        solution: 'Batch all DOM reads first, then execute all DOM writes in requestAnimationFrame.'
      }
    ],
    standardLibraryPowerTools: [
      { name: 'CSS Grid & Subgrid', purpose: 'Two-dimensional layout system with parent-to-child aligned grid tracks' },
      { name: 'Container Queries', purpose: 'Component-driven responsive styling based on parent container width instead of viewport' },
      { name: ':has() Relational Selector', purpose: 'Parent selector enabling styling ancestors based on child state or presence' }
    ],
    curatedQuestions: [
      {
        q: 'Why do CSS transform and opacity animations perform significantly better than animating top, left, or margin?',
        a: 'Animating properties like top, left, width, or margin invalidates layout geometry, forcing the browser engine to recalculate layout (reflow) and repaint pixel bitmaps on CPU. In contrast, transform and opacity are handled entirely on the GPU compositing stage without recalculating layout or repainting bitmaps.'
      }
    ]
  },

  sql: {
    id: 'sql',
    name: 'SQL (Relational Databases)',
    version: 'ANSI SQL:2023 & SQLite Engine',
    icon: '🗄️',
    badge: 'Relational Systems & Query Engines',
    accentColor: '#a855f7',
    docsUrl: 'https://www.sqlite.org/docs.html',
    executionModel: 'Declarative queries parsed into relational algebra trees, transformed by cost-based query optimizers, and executed via B-Tree scans or hash joins.',
    paradigm: 'Declarative, Set-Oriented Relational Algebra',
    coreStrengths: [
      'Mathematically rigorous relational model ensuring data consistency and integrity',
      'ACID transactional guarantees for mission-critical financial and enterprise records',
      'Ultra-efficient set operations on millions of rows using B-Tree and LSM storage structures',
      'Standardized query language supported across SQLite, PostgreSQL, MySQL, and Snowflake'
    ],
    top1PercentSkills: [
      'Cost-based query plan analysis using EXPLAIN / EXPLAIN ANALYZE to identify sequential scans and spills to disk',
      'Advanced index strategies: Composite indexes with column ordering (equality first, range second), partial indexes, and covering indexes',
      'Window functions (PARTITION BY, ROW_NUMBER, DENSE_RANK, LAG/LEAD) for analytical calculations',
      'ACID transaction isolation levels (Dirty Read, Non-repeatable Read, Phantom Read, Serializable Snapshot Isolation)',
      'Database sharding, read-replicas, connection pooling, and zero-downtime schema migrations'
    ],
    commonPitfalls: [
      {
        title: 'The N+1 Query Problem',
        problem: 'Fetching a list of 100 users and executing a separate query for each user\'s posts (101 round-trips).',
        solution: 'Use a single query with an INNER/LEFT JOIN or a batched WHERE user_id IN (...) query.'
      }
    ],
    standardLibraryPowerTools: [
      { name: 'Common Table Expressions (CTEs)', purpose: 'WITH clauses for modular, readable query decomposition and recursive graph traversal' },
      { name: 'Window Functions', purpose: 'Calculations across sets of rows related to current row without collapsing into GROUP BY' }
    ],
    curatedQuestions: [
      {
        q: 'How does a B-Tree index accelerate queries and why does column ordering matter in composite indexes?',
        a: 'A B-Tree is a balanced multi-way search tree maintaining sorted keys on disk pages. Lookup, insertion, and deletion operate in O(log N). In a composite index on (A, B, C), the data is sorted by A first, then B, then C. A query with WHERE B = 5 cannot use the index because the primary sort key A is missing (the leftmost prefix rule).'
      }
    ]
  },

  c: {
    id: 'c',
    name: 'C / C++',
    version: 'C17 / C++20 / C++23',
    icon: '⚙️',
    badge: 'High-Performance & Systems Programming',
    accentColor: '#3b82f6',
    docsUrl: 'https://en.cppreference.com/w/',
    executionModel: 'Direct compilation to native machine assembly instructions tailored to target CPU architecture. Zero garbage collection with direct stack and heap memory control.',
    paradigm: 'Procedural (C), Multi-paradigm with Zero-Cost Abstractions and Generic Templates (C++)',
    coreStrengths: [
      'Absolute maximum execution speed and minimum latency possible on modern hardware',
      'Direct control over memory layout, cache alignment, pointers, and hardware registers',
      'Powers virtually all operating system kernels (Linux, Windows, macOS), game engines, and browser runtimes',
      'Deterministic lifetime management via RAII (Resource Acquisition Is Initialization)'
    ],
    top1PercentSkills: [
      'RAII and move semantics (rvalue references &&, std::move, perfect forwarding with std::forward)',
      'CPU cache hierarchy optimization (L1/L2/L3 cache lines, false sharing, data-oriented design)',
      'Concurrency: C++ memory model, std::atomic, memory order sequential consistency vs relaxed/acquire-release',
      'Template metaprogramming, C++20 Concepts, and constexpr/consteval compile-time computation',
      'Valgrind, AddressSanitizer (ASan), GDB debugging, and profiling with Linux perf/eBPF'
    ],
    commonPitfalls: [
      {
        title: 'Use-After-Free & Dangling Pointers',
        problem: 'Accessing memory after free() or delete leads to undefined behavior, security exploits, or crashes.',
        solution: 'Use C++ smart pointers (std::unique_ptr, std::shared_ptr) to enforce strict single or reference-counted ownership.'
      }
    ],
    standardLibraryPowerTools: [
      { name: 'std::vector & std::array', purpose: 'Contiguous memory sequence containers optimized for CPU cache line prefetching' },
      { name: 'std::unique_ptr & std::shared_ptr', purpose: 'Automatic, leak-proof smart pointer memory management adhering to RAII' }
    ],
    curatedQuestions: [
      {
        q: 'What is the exact difference between lvalues and rvalues, and why are move semantics a breakthrough in C++11?',
        a: 'An lvalue represents an object that occupies an identifiable memory address. An rvalue is a temporary value that does not persist beyond the expression. Move semantics allow "stealing" pointers from temporary rvalues without heap allocation, reducing O(N) copy overhead to O(1) pointer swap.'
      }
    ]
  },

  java: {
    id: 'java',
    name: 'Java',
    version: 'Java SE 21 (LTS HotSpot JVM)',
    icon: '☕',
    badge: 'Enterprise Backend & Distributed Systems',
    accentColor: '#f43f5e',
    docsUrl: 'https://docs.oracle.com/en/java/',
    executionModel: 'Bytecode (.class) executed on HotSpot JVM. Tiered JIT compilation (C1 Client / C2 Server) produces optimized native machine code.',
    paradigm: 'Object-Oriented, Class-Based, Concurrent, Functional Streams',
    coreStrengths: [
      'Write Once, Run Anywhere (WORA) portable enterprise runtime',
      'Production-grade garbage collection algorithms (ZGC, Shenandoah, G1) for multi-terabyte heaps',
      'Industry-standard backbone for global banking, Fortune 500 backends, and Android platforms',
      'Project Loom Virtual Threads enabling millions of concurrent lightweight tasks'
    ],
    top1PercentSkills: [
      'JVM Memory Architecture: Eden, Survivor, Tenured/Old Gen, Metaspace, and GC tuning flags',
      'Java Memory Model (JMM): volatile happens-before semantics, memory barriers, and final field freeze',
      'Virtual Threads (Project Loom) vs OS Threads: carrier thread scheduling and non-blocking socket I/O',
      'Java bytecode inspection with javap and profiling with Java Flight Recorder (JFR) and Async-Profiler',
      'High-throughput serialization, Netty event-driven networking, and lock-free ring buffers (Disruptor pattern)'
    ],
    commonPitfalls: [
      {
        title: 'ConcurrentModificationException',
        problem: 'Modifying a Collection directly while iterating over it using an enhanced for-loop.',
        solution: 'Use Iterator.remove(), Collection.removeIf(), or concurrent collections (ConcurrentHashMap).'
      }
    ],
    standardLibraryPowerTools: [
      { name: 'Streams API', purpose: 'Declarative, pipeline-based sequence processing with parallel execution support' },
      { name: 'ConcurrentHashMap', purpose: 'Lock-striped thread-safe map providing concurrent reads without global locking' }
    ],
    curatedQuestions: [
      {
        q: 'How does the Java Memory Model (JMM) guarantee visibility and ordering with the "volatile" keyword?',
        a: 'In modern multi-core CPUs, threads maintain private L1/L2 caches, leading to stale reads. The JMM specifies that a write to a volatile variable "happens-before" every subsequent read of that same variable, inserting hardware memory barriers preventing instruction reordering.'
      }
    ]
  },

  rust: {
    id: 'rust',
    name: 'Rust',
    version: 'Rust 2021 Edition (rustc 1.75+)',
    icon: '🦀',
    badge: 'Memory-Safe Systems & WebAssembly',
    accentColor: '#ef4444',
    docsUrl: 'https://doc.rust-lang.org/',
    executionModel: 'Compiled directly to native machine code via LLVM without garbage collector or runtime overhead. Memory safety enforced entirely at compile time via borrow checking.',
    paradigm: 'Multi-paradigm: Systems Programming, Functional, Imperative, Trait-Based Composition',
    coreStrengths: [
      'Guaranteed memory safety (zero segfaults, zero use-after-free) without garbage collection pause times',
      'Fearless concurrency: type system prevents data races between threads at compile time',
      'First-class WebAssembly support producing ultra-compact, high-speed binary modules',
      'Modern package manager and build orchestrator (Cargo) with integrated testing and documentation'
    ],
    top1PercentSkills: [
      'Ownership, Borrowing & Non-Lexical Lifetimes (NLL): mastering complex reference graphs without Rc/RefCell',
      'Unsafe Rust invariants: sound abstractions, raw pointers (*const T, *mut T), and verifying with Miri',
      'Async Rust internals: Pinning (Pin<P>), Future polling mechanics, and custom Waker implementations',
      'Trait system mastery: associated types, higher-ranked trait bounds (HRTB), and const generics',
      'Zero-cost deserialization with Serde, SIMD vectorization, and memory layout optimization'
    ],
    commonPitfalls: [
      {
        title: 'Fighting Borrow Checker with Self-Referential Structs',
        problem: 'Storing an object and a reference to one of its fields in the same struct triggers lifetime errors.',
        solution: 'Separate data and index ownership: store indices/keys or use arena allocators.'
      }
    ],
    standardLibraryPowerTools: [
      { name: 'Option<T> & Result<T, E>', purpose: 'Type-safe handling of missing values and errors, eliminating null pointer exceptions' },
      { name: 'Iterator Trait', purpose: 'Composable zero-cost iterators compiling down to matching or exceeding hand-written C loops' }
    ],
    curatedQuestions: [
      {
        q: 'Why does Rust require Pin<P> for asynchronous Futures, and what happens without it?',
        a: 'When an async function is compiled into a state machine, local variables that cross .await points are saved as struct fields. If one local variable holds a reference to another, the struct becomes self-referential. Pin<P> guarantees at the type level that the underlying data will not be moved in memory before being dropped.'
      }
    ]
  }
};

export function getLanguageDetails(langId) {
  return LANGUAGE_DETAILS[langId] || LANGUAGE_DETAILS.python;
}

export function generateExternalPrompt(langId, userQuestion, userCode = '') {
  const details = getLanguageDetails(langId);
  const codeBlock = userCode ? '\n\n### CODE SNIPPET / REPRODUCIBLE EXAMPLE:\n```' + langId + '\n' + userCode + '\n```\n' : '';
  return `### SYSTEM CONTEXT:
Language: ${details.name} (Target: ${details.version})
Runtime: ${details.executionModel}
Target Quality: Top 1% Senior Systems Engineer / Production Grade

### QUESTION / OBJECTIVE:
${userQuestion || 'Explain how to write idiomatic, high-performance, memory-safe code for this scenario.'}${codeBlock}
### REQUIRED SPECIFICATION:
1. Provide the direct, idiomatic solution adhering to modern ${details.name} standards.
2. Explain the mechanical reasons (memory allocation, runtime execution, time/space complexity).
3. Highlight subtle edge cases, potential pitfalls, or production gotchas to watch for.
4. Demonstrate how to write automated tests verifying this behavior.`;
}
