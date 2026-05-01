import xml.etree.ElementTree as ET

def add_keys(filepath, translations):
    tree = ET.parse(filepath)
    root = tree.getroot()
    existing = {d.get('name') for d in root.findall('data')}
    for key, val in translations.items():
        if key not in existing:
            d = ET.SubElement(root, 'data')
            d.set('name', key)
            d.set('xml:space', 'preserve')
            v = ET.SubElement(d, 'value')
            v.text = val
    tree.write(filepath, encoding='utf-8', xml_declaration=True)

en = {
    "Stat5Min": "5min",
    "Stat100Percent": "100%",
    "Stat3In1": "3-in-1",
    "Stat140Plus": "140+",
    "Stat247": "24/7",
    "StatSOC2": "SOC 2",
}

ar = {
    "Stat5Min": "5 دقائق",
    "Stat100Percent": "%100",
    "Stat3In1": "3 في 1",
    "Stat140Plus": "+140",
    "Stat247": "24/7",
    "StatSOC2": "SOC 2",
}

add_keys("e:/BUA/Project/Daleel/Daleel/Resources/SharedResource.en.resx", en)
add_keys("e:/BUA/Project/Daleel/Daleel/Resources/SharedResource.ar.resx", ar)
print("Keys added successfully!")
