with open("docs/all_experiments_detailed.md", "r", encoding="utf-8") as f:
    text = f.read()

def safe_print(s):
    print(s.encode("ascii", errors="replace").decode("ascii"))

# Search for the class diagram table or classes list
for phrase in ["Step 1: Elements of the class diagram", "Step 1 and 2: Actors and Use Cases", "Step 1: Activities, Actions, Decision Points", "Step 1: Elements of the sequence diagram", "EXP-7"]:
    pos = text.find(phrase)
    if pos != -1:
        safe_print(f"=== {phrase} ===")
        safe_print(text[pos:pos+1800])
        safe_print("\n" + "="*40 + "\n")
