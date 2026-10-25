with open("docs/se_full_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Split by "Experiment No"
parts = re.split(r"(?:Experiment No\.?\s*0?(\d+)|Aim:\s*To (?:perform the user|create Activity|create a Class|draw the behavioral view))", text, flags=re.I)

print(f"Parts count: {len(parts)}")
for i in range(len(parts)):
    sample = parts[i][:150].replace('\n', ' ')
    if len(sample.strip()) > 10:
        print(f"Part {i}: {sample}")
