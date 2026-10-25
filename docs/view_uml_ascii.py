with open("docs/all_experiments_detailed.md", "r", encoding="utf-8") as f:
    text = f.read()

def safe_print(s):
    print(s.encode("ascii", errors="replace").decode("ascii"))

pos = text.find("Class Diagram")
if pos != -1:
    safe_print("=== Class Diagram details ===")
    safe_print(text[pos:pos+2500])

pos2 = text.find("Activity Diagram")
if pos2 != -1:
    safe_print("=== Activity Diagram details ===")
    safe_print(text[pos2:pos2+2500])

pos3 = text.find("Sequence Diagram")
if pos3 != -1:
    safe_print("=== Sequence Diagram details ===")
    safe_print(text[pos3:pos3+2500])
