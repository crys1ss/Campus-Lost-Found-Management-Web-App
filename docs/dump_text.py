import zipfile, xml.etree.ElementTree as ET, json

with zipfile.ZipFile("docs/SE_Campus_Lost_and_Found(N022,N026,N038).docx") as z:
    tree = ET.fromstring(z.read("word/document.xml"))
    paras = []
    for p in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"):
        t = "".join([n.text for n in p.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if n.text]).strip()
        if t:
            paras.append(t)

with open("docs/se_full_text.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(paras))

print(f"Dumped {len(paras)} lines to docs/se_full_text.txt")
