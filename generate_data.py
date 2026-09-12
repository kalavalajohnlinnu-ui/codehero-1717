import json
import os

base_dir = r"C:\Users\user\.gemini\antigravity\scratch\python-mastery-app\src\data"
os.makedirs(os.path.join(base_dir, "algorithms"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "bugs"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "projects"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "achievements"), exist_ok=True)

# 1. Algorithms (80 challenges)
algorithms = []
categories = {
    'Arrays': 15,
    'Strings': 15,
    'Loops & Math': 10,
    'Functions & Recursion': 10,
    'Sorting': 10,
    'Data Structures': 10,
    'OOP Challenges': 10
}

diff_levels = ['easy', 'medium', 'hard', 'legendary']
xp_rewards = {'easy': 25, 'medium': 50, 'hard': 100, 'legendary': 200}

algo_id = 1
for cat, count in categories.items():
    for i in range(count):
        diff = diff_levels[min(i // 4, 3)]
        algorithms.append({
            'id': f'algo-py-{algo_id}',
            'language': 'python',
            'title': f'{cat} Challenge {i+1}',
            'category': cat,
            'difficulty': diff,
            'xpReward': xp_rewards[diff],
            'description': f'A fun {cat} adventure! Solve this to unlock the next level.',
            'examples': [{'input': '[1, 2, 3]', 'output': 'True'}],
            'starterCode': '# Your code here\ndef solve(data):\n    pass',
            'solution': 'def solve(data):\n    return True',
            'hints': ['Think about the base case!', 'Can you use a loop?'],
            'tests': [{'input': '[1, 2, 3]', 'expected': 'True', 'type': 'output_match'}]
        })
        algo_id += 1

with open(os.path.join(base_dir, "algorithms", "challenges.json"), "w", encoding='utf-8') as f:
    json.dump(algorithms, f, indent=2, ensure_ascii=False)

# 2. Bugs (40 challenges)
bugs = []
bug_id = 1
for lang in ['python', 'javascript']:
    for i in range(20):
        bugs.append({
            'id': f'bug-{lang[:2]}-{bug_id}',
            'language': lang,
            'caseTitle': f'Case #{bug_id}: The Buggy Code',
            'description': 'Help Detective Debug fix this code!',
            'brokenCode': 'def add(a, b):\n    result = a - b\n    return result\n' if lang == 'python' else 'function add(a, b) {\n  let result = a - b;\n  return result;\n}',
            'fixedCode': 'def add(a, b):\n    result = a + b\n    return result\n' if lang == 'python' else 'function add(a, b) {\n  let result = a + b;\n  return result;\n}',
            'bugDescription': 'Wrong operator used',
            'hints': ['Check the math operator', 'Should be addition'],
            'tests': [{'type': 'output_match', 'expected': '7'}]
        })
        bug_id += 1

with open(os.path.join(base_dir, "bugs", "challenges.json"), "w", encoding='utf-8') as f:
    json.dump(bugs, f, indent=2, ensure_ascii=False)

# 3. Projects (15 projects)
projects = []
proj_titles = [
    ("Magic Calculator", "python", 6),
    ("Number Guessing Game", "python", 5),
    ("Word Counter", "python", 5),
    ("To-Do List", "python", 7),
    ("Quiz Game", "python", 6),
    ("Temperature Converter", "javascript", 5),
    ("Countdown Timer", "javascript", 5),
    ("Shopping Cart", "javascript", 7),
    ("Color Picker", "html", 5),
    ("Animated Button", "html", 4),
    ("Profile Card", "html", 6),
    ("Student Database", "sql", 5),
    ("Product Inventory", "sql", 6),
    ("Contact Book", "java", 7),
    ("Number Patterns", "rust", 5)
]

proj_id = 1
for title, lang, step_count in proj_titles:
    steps = []
    for s in range(1, step_count + 1):
        steps.append({
            'stepNumber': s,
            'title': f'Step {s}',
            'description': f'Complete step {s} of {title}',
            'starterCode': '# starter',
            'solution': '# solution',
            'xpReward': 50,
            'tests': [{'type': 'output_includes', 'expected': 'Success'}]
        })
    projects.append({
        'id': f'project-{proj_id}',
        'language': lang,
        'title': f'🧮 {title}',
        'description': f'Build a {title}!',
        'difficulty': 'beginner',
        'totalXP': step_count * 50,
        'estimatedTime': f'{step_count * 5} min',
        'steps': steps
    })
    proj_id += 1

with open(os.path.join(base_dir, "projects", "projects.json"), "w", encoding='utf-8') as f:
    json.dump(projects, f, indent=2, ensure_ascii=False)

# 4. Achievements (60 achievements)
achievements = []
triggers = ['lessons_completed', 'xp_earned', 'streak_days', 'bugs_fixed', 'speed_challenges', 'algo_solved', 'projects_completed', 'languages_tried', 'hints_skipped', 'perfect_lessons']
rarities = ['common', 'rare', 'epic', 'legendary']

ach_id = 1
for t in triggers:
    for i in range(6):
        rarity = rarities[min(i // 2, 3)]
        threshold = (i + 1) * 10
        achievements.append({
            'id': f'ach-{ach_id}',
            'icon': '🎯',
            'name': f'{t.replace("_", " ").title()} Level {i+1}',
            'description': f'Reach {threshold} in {t.replace("_", " ")}',
            'trigger': t,
            'threshold': threshold,
            'xpBonus': threshold * 5,
            'rarity': rarity
        })
        ach_id += 1

with open(os.path.join(base_dir, "achievements", "achievements.json"), "w", encoding='utf-8') as f:
    json.dump(achievements, f, indent=2, ensure_ascii=False)

print("Files generated successfully!")
