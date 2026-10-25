with open("docs/all_experiments_detailed.md", "r", encoding="utf-8") as f:
    lines = [l.strip() for l in f.readlines()]

for i, l in enumerate(lines):
    if "class diagram" in l.lower() and ("aim:" in l.lower() or "step" in l.lower() or "fig" in l.lower()):
        print(f"Match at {i}: {l}")
        for j in range(i, min(len(lines), i+30)):
            print(f"   {j}: {lines[j][:90].encode('ascii', errors='replace').decode('ascii')}")
        print("-"*40)
