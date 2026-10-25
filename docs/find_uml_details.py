with open("docs/all_experiments_detailed.md", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Find Class Diagram classes
pos = text.find("Class Diagram – Campus Lost & Found Management System")
if pos != -1:
    print("=== Class Diagram details ===")
    print(text[pos-1500:pos+200])

# Find Activity Diagram details
pos2 = text.find("Activity Diagram – Campus Lost & Found Management System")
if pos2 != -1:
    print("=== Activity Diagram details ===")
    print(text[pos2-1500:pos2+200])

# Find Sequence Diagram details
pos3 = text.find("Sequence Diagram – Student reports a lost item")
if pos3 != -1:
    print("=== Sequence Diagram details ===")
    print(text[pos3-1500:pos3+200])
