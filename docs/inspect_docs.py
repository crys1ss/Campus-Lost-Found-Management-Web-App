import zipfile, xml.etree.ElementTree as ET, os

def map_images(doc_path):
    print("=== MAP FOR " + doc_path + " ===")
    if not os.path.exists(doc_path):
        print("Not found: " + doc_path)
        return
    with zipfile.ZipFile(doc_path) as z:
        tree = ET.fromstring(z.read("word/document.xml"))
        # Load rels
        rels = {}
        if "word/_rels/document.xml.rels" in z.namelist():
            rtree = ET.fromstring(z.read("word/_rels/document.xml.rels"))
            for rel in rtree:
                rels[rel.attrib.get("Id")] = rel.attrib.get("Target")

        curr_text = ""
        for p in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"):
            t = "".join([n.text for n in p.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if n.text]).strip()
            imgs = [blip.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed"] 
                    for blip in p.iter("{http://schemas.openxmlformats.org/drawingml/2006/main}blip")
                    if "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed" in blip.attrib]
            if imgs:
                target_imgs = [rels.get(img, img) for img in imgs]
                print(f"Context: '{curr_text[-120:]}' -> Targets: {target_imgs}")
            if t:
                curr_text += " " + t

map_images("docs/SE_Campus_Lost_and_Found(N022,N026,N038).docx")
map_images("docs/Experiment 8.docx")
map_images("docs/Experiment 9.docx")
map_images("docs/Experiment 10.docx")
