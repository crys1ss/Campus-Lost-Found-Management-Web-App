import zipfile, xml.etree.ElementTree as ET, os, re

def get_doc_paras(path):
    if not os.path.exists(path):
        return []
    with zipfile.ZipFile(path) as z:
        tree = ET.fromstring(z.read("word/document.xml"))
        paras = []
        for p in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"):
            t = "".join([n.text for n in p.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if n.text]).strip()
            if t:
                paras.append(t)
        return paras

se_paras = get_doc_paras("docs/SE_Campus_Lost_and_Found(N022,N026,N038).docx")
exp8_paras = get_doc_paras("docs/Experiment 8.docx")
exp9_paras = get_doc_paras("docs/Experiment 9.docx")
exp10_paras = get_doc_paras("docs/Experiment 10.docx")

with open("docs/all_experiments_detailed.md", "w", encoding="utf-8") as out:
    out.write("# Software Engineering Lab Experiments 1-10\n\n")
    out.write("## Students: Tanay Dekate (N022), Jivitesh Dutt (N026), Gatha Jain (N038)\n")
    out.write("### SVKM's NMIMS MPSTME - Computer Engineering Department - MBA Tech CE Div D Batch D1\n\n")
    
    out.write("## Experiments 1-7 (Campus Lost & Found System)\n\n")
    out.write("\n".join(se_paras))
    out.write("\n\n---\n\n## Experiment 8: Database Normalization\n\n")
    out.write("\n".join(exp8_paras))
    out.write("\n\n---\n\n## Experiment 9: Transaction Control Language (TCL) and Data Control Language (DCL)\n\n")
    out.write("\n".join(exp9_paras))
    out.write("\n\n---\n\n## Experiment 10: MongoDB CRUD Operations\n\n")
    out.write("\n".join(exp10_paras))

print("Successfully wrote docs/all_experiments_detailed.md")
