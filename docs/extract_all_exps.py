with open("docs/se_full_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Let's search for the experiment boundaries
exp_starts = [
    ("Exp 1: Requirements Engineering", "Experiment No.01"),
    ("Exp 2: Agile Requirements Gathering", "Experiment No. 2"),
    ("Exp 3: Use Case Diagram", "Aim:  To perform the user"),
    ("Exp 4: Activity Diagram", "Aim:  To create Activity Diagram"),
    ("Exp 5: Class Diagram", "Aim:  To create a Class Diagram"),
    ("Exp 6: Sequence Diagram", "Aim:  To draw the behavioral view diagram for the Campus Lost & Found Management System: Sequence diagram"),
    ("Exp 7: Collaboration Diagram", "Aim: To draw the behavioral view (Collaboration)")
]

indices = []
for name, marker in exp_starts:
    idx = text.find(marker)
    indices.append((name, idx))

indices.sort(key=lambda x: x[1])

for i in range(len(indices)):
    name, start = indices[i]
    end = indices[i+1][1] if i + 1 < len(indices) else len(text)
    exp_text = text[start:end]
    print(f"==================================================")
    print(f"{name} (Length: {len(exp_text)} chars)")
    print(f"==================================================")
    # Print student's answers (often under PART B or Step 1 / Tasks)
    for term in ["PART B", "Step 1", "Task", "Final Problem Statement", "Use Cases", "Actors"]:
        p = exp_text.find(term)
        if p != -1:
            print(f"--- Marker '{term}' at offset {p} ---")
            print(exp_text[p:p+600].replace('\n', ' \n '))
            print("\n")
            break
