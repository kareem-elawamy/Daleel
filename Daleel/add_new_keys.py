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
    # Demo
    "DemoTitle": "Schedule a Demo",
    "DemoHeading": "See Daleel in Action",
    "DemoDesc": "Book a personalized session with our intelligence experts. We'll show you how our platform can provide clarity and strategic advantage for your specific use cases.",
    "RequestDemo": "Request Demo",
    "Company": "Company Name",
    "JobTitle": "Job Title",

    # Pricing
    "PricingTitle": "Pricing Plans",
    "PricingHeading": "Transparent Pricing for Global Intelligence",
    "PricingDesc": "Choose the tier that best fits your organizational needs. From emerging enterprises to global powerhouses, we have a plan for you.",
    "PlanProfessional": "Professional",
    "PlanProfDesc": "Essential intelligence for growing teams.",
    "PlanProfPrice": "$999/mo",
    "PlanEnterprise": "Enterprise",
    "PlanEntDesc": "Advanced capabilities for global organizations.",
    "PlanEntPrice": "Custom Pricing",
    "GetStartedNow": "Get Started Now",

    # Article
    "ArticleTitle": "Global Intelligence Insight",
    "ArticleHeading": "Understanding the Next Geopolitical Shift",
    "ArticleContent1": "In an era of unprecedented global connectivity, predicting the next major geopolitical shift requires more than just reading the news. It requires deep data synthesis and pattern recognition.",
    "ArticleContent2": "Our analysis indicates that supply chain vulnerabilities are no longer just logistical challenges; they are increasingly weaponized in trade negotiations. Organizations must pivot from reactive supply chain management to predictive risk modeling.",
    "ArticleContent3": "The Daleel intelligence network has tracked over 10 million data points this quarter, revealing a subtle but distinct shift in cross-border trade correlations. These indicators suggest that mid-tier economies are rapidly forming new trade blocs independent of traditional superpowers.",
    "ArticleAuthor": "Daleel Intelligence Unit",
    "ArticleDate": "May 15, 2024",
    "ArticleReadTime": "12 Min Read",
    "ArticleTag": "Geopolitics",
}

ar = {
    # Demo
    "DemoTitle": "جدولة عرض توضيحي",
    "DemoHeading": "شاهد دليل أثناء العمل",
    "DemoDesc": "احجز جلسة مخصصة مع خبراء الاستخبارات لدينا. سنوضح لك كيف يمكن لمنصتنا توفير الوضوح والميزة الاستراتيجية لحالات الاستخدام الخاصة بك.",
    "RequestDemo": "طلب عرض توضيحي",
    "Company": "اسم الشركة",
    "JobTitle": "المسمى الوظيفي",

    # Pricing
    "PricingTitle": "خطط الأسعار",
    "PricingHeading": "أسعار شفافة للاستخبارات العالمية",
    "PricingDesc": "اختر الفئة التي تناسب احتياجات مؤسستك. من الشركات الناشئة إلى القوى العالمية، لدينا خطة تناسبك.",
    "PlanProfessional": "الاحترافية",
    "PlanProfDesc": "الاستخبارات الأساسية للفرق المتنامية.",
    "PlanProfPrice": "999 دولار/شهرياً",
    "PlanEnterprise": "المؤسسية",
    "PlanEntDesc": "قدرات متقدمة للمنظمات العالمية.",
    "PlanEntPrice": "أسعار مخصصة",
    "GetStartedNow": "ابدأ الآن",

    # Article
    "ArticleTitle": "رؤى الاستخبارات العالمية",
    "ArticleHeading": "فهم التحول الجيوسياسي القادم",
    "ArticleContent1": "في عصر غير مسبوق من الترابط العالمي، يتطلب التنبؤ بالتحول الجيوسياسي الرئيسي القادم أكثر من مجرد قراءة الأخبار. يتطلب الأمر تجميعاً عميقاً للبيانات والتعرف على الأنماط.",
    "ArticleContent2": "يشير تحليلنا إلى أن نقاط ضعف سلسلة التوريد لم تعد مجرد تحديات لوجستية؛ بل يتم استخدامها بشكل متزايد كسلاح في المفاوضات التجارية. يجب على المنظمات التحول من الإدارة التفاعلية لسلسلة التوريد إلى النمذجة التنبؤية للمخاطر.",
    "ArticleContent3": "تتبعت شبكة استخبارات دليل أكثر من 10 ملايين نقطة بيانات هذا الربع، وكشفت عن تحول دقيق ولكنه واضح في ارتباطات التجارة عبر الحدود. تشير هذه المؤشرات إلى أن الاقتصادات من الفئة المتوسطة تشكل بسرعة كتلاً تجارية جديدة مستقلة عن القوى العظمى التقليدية.",
    "ArticleAuthor": "وحدة استخبارات دليل",
    "ArticleDate": "15 مايو 2024",
    "ArticleReadTime": "قراءة 12 دقيقة",
    "ArticleTag": "الجغرافيا السياسية",
}

add_keys("e:/BUA/Project/Daleel/Daleel/Resources/SharedResource.en.resx", en)
add_keys("e:/BUA/Project/Daleel/Daleel/Resources/SharedResource.ar.resx", ar)
print("Keys added successfully!")
