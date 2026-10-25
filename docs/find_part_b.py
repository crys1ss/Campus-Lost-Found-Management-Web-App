with open("docs/se_full_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's find sections for each experiment
keywords = [
    "Experiment No.01",
    "Experiment No. 2",
    "Aim:  To perform the user",
    "Aim:  To create Activity Diagram",
    "Aim:  To create a Class Diagram",
    "Aim:  To draw the behavioral view diagram",
    "Aim: To draw the behavioral view (Collaboration)"
]

lines = text.split("\n")
for i, line in enumerate(lines):
    for kw in keywords:
        if kw.lower() in line.lower():
            print(f"=== {kw} at {i} ===")
            for j in range(i, min(i+40, len(lines))):
                if "Part B" in lines[j] or "B.1" in lines[j] or "Output:" in lines[j] or "Step" in lines[j]:
                    print(f"   [{j}] {lines[j]}")
