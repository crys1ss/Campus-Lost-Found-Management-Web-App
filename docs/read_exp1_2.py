with open("docs/se_full_text.txt", "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f.readlines()]

def print_range(start_str, end_str, max_lines=50):
    start = -1
    for i, l in enumerate(lines):
        if start_str.lower() in l.lower():
            start = i
            break
    if start == -1:
        print(f"Could not find '{start_str}'")
        return
    print(f"=== Found '{start_str}' at line {start} ===")
    for j in range(start, min(start + max_lines, len(lines))):
        if end_str and j > start and end_str.lower() in lines[j].lower():
            print(f"--- Hit end marker '{end_str}' at line {j} ---")
            break
        print(f"{j}: {lines[j]}")

print("--- EXP 1 PART B ---")
print_range("PART B", "Experiment No. 2", 40)
print("\n--- EXP 2 PART B ---")
print_range("Experiment No. 2", "Aim:  To perform the user", 40)
