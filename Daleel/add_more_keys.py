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
    "ArticleQuote": "\"The ability to foresee trade disruptions is no longer a luxury; it's the fundamental baseline for global competitiveness.\"",
    "ArticleContent4": "Using the Daleel ecosystem, decision-makers can overlay real-time sentiment analysis on physical trade routes, exposing hidden correlations. For example, a minor shift in media sentiment in a key mineral-exporting region often precedes a tightening of export quotas by 4 to 6 weeks.",
    "Fig1": "Figure 1. Trade Correlation",
    "Fig2": "Figure 2. Sentiment Shift",
    "StrategicImperatives": "Strategic Imperatives",
    "Monitoring": "Continuous Monitoring:",
    "MonitoringDesc": "Static quarterly reports are obsolete. Intelligence must be real-time and continuous.",
    "Synthesis": "Cross-Domain Synthesis:",
    "SynthesisDesc": "Stop analyzing trade, media, and raw data in silos. The most critical insights exist at their intersections.",
    "ArticleConclusion": "The next global shift won't announce itself with a headline; it will emerge as a whisper in the data. Are you listening?",
    "ShareInsight": "Share this insight:",
    "BackToFeed": "Back to Feed"
}

ar = {
    "ArticleQuote": "\"إن القدرة على توقع اضطرابات التجارة لم تعد رفاهية؛ بل هي الأساس الجوهري للتنافسية العالمية.\"",
    "ArticleContent4": "باستخدام منظومة دليل، يمكن لصناع القرار دمج تحليل المشاعر الفوري مع طرق التجارة الفعلية، مما يكشف عن ارتباطات خفية. على سبيل المثال، غالباً ما يسبق التحول الطفيف في المشاعر الإعلامية في منطقة رئيسية لتصدير المعادن تشديداً في حصص التصدير بمدة 4 إلى 6 أسابيع.",
    "Fig1": "الشكل 1. ارتباط التجارة",
    "Fig2": "الشكل 2. تحول المشاعر",
    "StrategicImperatives": "الضرورات الاستراتيجية",
    "Monitoring": "المراقبة المستمرة:",
    "MonitoringDesc": "التقارير ربع السنوية الثابتة أصبحت بالية. يجب أن تكون الاستخبارات فورية ومستمرة.",
    "Synthesis": "التوليف عبر المجالات:",
    "SynthesisDesc": "توقف عن تحليل التجارة والإعلام والبيانات الخام بمعزل عن بعضها. تكمن الرؤى الأكثر أهمية في تقاطعاتها.",
    "ArticleConclusion": "التحول العالمي القادم لن يعلن عن نفسه بعنوان رئيسي؛ بل سيظهر كهمسة في البيانات. هل تستمع؟",
    "ShareInsight": "شارك هذه الرؤية:",
    "BackToFeed": "العودة للرئيسية"
}

add_keys("e:/BUA/Project/Daleel/Daleel/Resources/SharedResource.en.resx", en)
add_keys("e:/BUA/Project/Daleel/Daleel/Resources/SharedResource.ar.resx", ar)
print("Keys added successfully!")
