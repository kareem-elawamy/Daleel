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
    # About
    "AboutOurStory": "Our Story",
    "AboutHeading": "Mapping the Future",
    "AboutTagline": "Future",
    "AboutDesc": "Daleel was founded on a simple premise: in an increasingly complex world, clarity is the ultimate strategic advantage. We are building the nervous system for global intelligence.",
    "AboutFounded": "Founded",
    "AboutJurisdictions": "Jurisdictions",
    "AboutDailySignals": "Daily Signals",
    "OurMission": "Our Mission",
    "MissionStatement": '"To empower decision-makers across the globe with transparent, verified, and real-time intelligence, bridging the gap between raw data and strategic action."',

    # Contact
    "GetInTouch": "Get in Touch",
    "ContactHeading": "Contact Daleel",
    "ContactDesc": "Ready to elevate your intelligence capabilities? Our global team is available 24/7 to discuss your strategic needs.",
    "ReachOutDirectly": "Reach Out Directly",
    "GlobalHeadquarters": "Global Headquarters",
    "HQAddress": "123 Intelligence Avenue, Innovation District, Global City, 10001",
    "EmailUs": "Email Us",
    "CallUs": "Call Us",
    "FirstName": "First Name",
    "LastName": "Last Name",
    "WorkEmail": "Work Email",
    "Subject": "Subject",
    "SubjectPlatformDemo": "Platform Demo",
    "SubjectPartnership": "Partnership Inquiry",
    "SubjectSupport": "Support",
    "Message": "Message",
    "MessagePlaceholder": "How can we help you?",
    "SendMessage": "Send Message",

    # Partners
    "PartnersGlobalNetwork": "Global Network",
    "PartnersHeading": "Our Trusted Partners",
    "PartnersDesc": "Daleel collaborates with the world's leading intelligence agencies, financial institutions, and technology providers to deliver unparalleled strategic advantages.",
    "PartnersEcosystemCTA": "Become a part of our intelligence ecosystem.",
    "BecomePartner": "Become a Partner",

    # Platforms
    "CorePlatforms": "Core Platforms",
    "PlatformsHeading": "The Daleel Ecosystem",
    "PlatformsDesc": "Explore our three specialized engines. Each platform is powerful on its own, and exponentially more effective when combined.",
    "TabInformation": "Information",
    "TabTrade": "Trade",
    "TabMedia": "Media",
    "InfoPlatformTitle": "Global Data Processing Engine",
    "InfoPlatformDesc": "Our Information platform ingests, standardizes, and verifies millions of data points across 140+ jurisdictions. We convert fragmented global noise into structured, actionable intelligence.",
    "InfoFeature1": "10M+ Data Points Processed Daily",
    "InfoFeature2": "Cross-Border Entity Resolution",
    "InfoFeature3": "Multi-lingual OCR & Extraction",
    "ExploreInfoPlatform": "Explore Information Platform",
    "TradePlatformTitle": "Global Trade & Supply Chain",
    "TradePlatformDesc": "Navigate international commerce with real-time tracking of shipping corridors, commodity flows, and logistical chokepoints. We map the physical movement of the global economy.",
    "TradeFeature1": "Real-Time Vessel Tracking",
    "TradeFeature2": "Sanctions & Risk Overlay",
    "TradeFeature3": "Predictive Chokepoint Analysis",
    "ExploreTradePlatform": "Explore Trade Platform",
    "MediaPlatformTitle": "Narrative & Sentiment Analysis",
    "MediaPlatformDesc": "Understand the sentiment before it becomes policy. Our Media platform tracks geopolitical narratives, public sentiment shifts, and early warning signals across global news and social channels.",
    "MediaFeature1": "Geopolitical Narrative Tracking",
    "MediaFeature2": "AI-Driven Sentiment Scoring",
    "MediaFeature3": "72-Hour Early Warning Alerts",
    "ExploreMediaPlatform": "Explore Media Platform",

    # Shop / Soon
    "DaleelShop": "Daleel Shop",
    "ComingSoon": "Coming Soon",
    "ShopDesc": "We are building a premium marketplace for advanced intelligence reports, proprietary datasets, and exclusive strategic tools.",
    "ReturnHome": "Return Home",
    "UnderConstruction": "Under Construction",
    "SoonDesc": "We are currently crafting something extraordinary. This feature is being built with precision intelligence and will be available shortly.",

    # Trust
    "SecurityFirst": "Security First",
    "TrustHeading": "Trust & Governance",
    "TrustDesc": "Your intelligence remains strictly yours. We built Daleel from the ground up to exceed global compliance and data sovereignty requirements.",
    "MilGradeEncryption": "Military-Grade Encryption",
    "MilGradeEncDesc": "End-to-end 256-bit AES encryption ensures your queries, saved searches, and collaborative projects are secure in transit and at rest.",
    "GlobalCompliance": "Global Compliance",
    "GlobalComplianceDesc": "Fully compliant with GDPR, CCPA, and regional data localization mandates. We don't share, sell, or exploit your strategic behavior.",
    "EthicalAIFramework": "Ethical AI Framework",
    "EthicalAIDesc": "Our models are audited for bias and hallucination mitigation. Intelligence is transparently sourced and clearly cited.",
    "AESEncryption": "AES Encryption",
    "Compliant": "Compliant",
    "TypeIICertified": "Type II Certified",
    "UptimeSLA": "Uptime SLA",
}

ar = {
    # About
    "AboutOurStory": "قصتنا",
    "AboutHeading": "نرسم المستقبل",
    "AboutTagline": "المستقبل",
    "AboutDesc": "تأسس دليل على مبدأ بسيط: في عالم متزايد التعقيد، الوضوح هو الميزة الاستراتيجية القصوى. نحن نبني الجهاز العصبي للذكاء العالمي.",
    "AboutFounded": "سنة التأسيس",
    "AboutJurisdictions": "ولاية قضائية",
    "AboutDailySignals": "إشارة يومية",
    "OurMission": "مهمتنا",
    "MissionStatement": '"تمكين صانعي القرار في جميع أنحاء العالم بذكاء شفاف وموثق وفوري، وسد الفجوة بين البيانات الخام والعمل الاستراتيجي."',

    # Contact
    "GetInTouch": "تواصل معنا",
    "ContactHeading": "تواصل مع دليل",
    "ContactDesc": "هل أنت مستعد لرفع مستوى قدراتك الاستخباراتية؟ فريقنا العالمي متاح على مدار الساعة لمناقشة احتياجاتك الاستراتيجية.",
    "ReachOutDirectly": "تواصل مباشرة",
    "GlobalHeadquarters": "المقر الرئيسي العالمي",
    "HQAddress": "123 شارع الاستخبارات، حي الابتكار، المدينة العالمية، 10001",
    "EmailUs": "راسلنا",
    "CallUs": "اتصل بنا",
    "FirstName": "الاسم الأول",
    "LastName": "اسم العائلة",
    "WorkEmail": "البريد الإلكتروني للعمل",
    "Subject": "الموضوع",
    "SubjectPlatformDemo": "عرض توضيحي للمنصة",
    "SubjectPartnership": "استفسار شراكة",
    "SubjectSupport": "الدعم",
    "Message": "الرسالة",
    "MessagePlaceholder": "كيف يمكننا مساعدتك؟",
    "SendMessage": "إرسال الرسالة",

    # Partners
    "PartnersGlobalNetwork": "الشبكة العالمية",
    "PartnersHeading": "شركاؤنا الموثوقون",
    "PartnersDesc": "يتعاون دليل مع كبرى وكالات الاستخبارات والمؤسسات المالية ومزودي التكنولوجيا في العالم لتقديم مزايا استراتيجية لا مثيل لها.",
    "PartnersEcosystemCTA": "كن جزءاً من منظومتنا الاستخباراتية.",
    "BecomePartner": "كن شريكاً",

    # Platforms
    "CorePlatforms": "المنصات الأساسية",
    "PlatformsHeading": "منظومة دليل",
    "PlatformsDesc": "اكتشف محركاتنا الثلاثة المتخصصة. كل منصة قوية بحد ذاتها، وأكثر فعالية بشكل كبير عند دمجها.",
    "TabInformation": "المعلومات",
    "TabTrade": "التجارة",
    "TabMedia": "الإعلام",
    "InfoPlatformTitle": "محرك معالجة البيانات العالمي",
    "InfoPlatformDesc": "تقوم منصة المعلومات لدينا بإدخال وتوحيد والتحقق من ملايين نقاط البيانات عبر أكثر من 140 ولاية قضائية. نحول الضوضاء العالمية المتشتتة إلى ذكاء منظم وقابل للتنفيذ.",
    "InfoFeature1": "معالجة أكثر من 10 ملايين نقطة بيانات يومياً",
    "InfoFeature2": "تحليل الكيانات عبر الحدود",
    "InfoFeature3": "استخراج متعدد اللغات بتقنية OCR",
    "ExploreInfoPlatform": "استكشف منصة المعلومات",
    "TradePlatformTitle": "التجارة العالمية وسلسلة التوريد",
    "TradePlatformDesc": "تنقل في التجارة الدولية مع تتبع فوري لممرات الشحن وتدفقات السلع ونقاط الاختناق اللوجستية. نرسم الحركة المادية للاقتصاد العالمي.",
    "TradeFeature1": "تتبع السفن لحظياً",
    "TradeFeature2": "طبقة العقوبات والمخاطر",
    "TradeFeature3": "تحليل نقاط الاختناق التنبؤي",
    "ExploreTradePlatform": "استكشف منصة التجارة",
    "MediaPlatformTitle": "تحليل السرد والمشاعر",
    "MediaPlatformDesc": "افهم المشاعر قبل أن تصبح سياسة. تتتبع منصة الإعلام لدينا السرديات الجيوسياسية وتحولات المشاعر العامة وإشارات الإنذار المبكر عبر الأخبار العالمية وقنوات التواصل الاجتماعي.",
    "MediaFeature1": "تتبع السرد الجيوسياسي",
    "MediaFeature2": "تقييم المشاعر بالذكاء الاصطناعي",
    "MediaFeature3": "تنبيهات إنذار مبكر بـ 72 ساعة",
    "ExploreMediaPlatform": "استكشف منصة الإعلام",

    # Shop / Soon
    "DaleelShop": "متجر دليل",
    "ComingSoon": "قريباً",
    "ShopDesc": "نحن نبني سوقاً متميزاً لتقارير الاستخبارات المتقدمة ومجموعات البيانات الخاصة والأدوات الاستراتيجية الحصرية.",
    "ReturnHome": "العودة للرئيسية",
    "UnderConstruction": "قيد الإنشاء",
    "SoonDesc": "نحن حالياً نصنع شيئاً استثنائياً. هذه الميزة يتم بناؤها بدقة استخباراتية وستكون متاحة قريباً.",

    # Trust
    "SecurityFirst": "الأمان أولاً",
    "TrustHeading": "الثقة والحوكمة",
    "TrustDesc": "تبقى معلوماتك الاستخباراتية ملكك تماماً. لقد بنينا دليل من الصفر لتجاوز متطلبات الامتثال العالمي وسيادة البيانات.",
    "MilGradeEncryption": "تشفير عسكري المستوى",
    "MilGradeEncDesc": "يضمن التشفير من طرف إلى طرف بـ 256 بت AES أن استفساراتك وعمليات البحث المحفوظة ومشاريعك التعاونية آمنة أثناء النقل والتخزين.",
    "GlobalCompliance": "الامتثال العالمي",
    "GlobalComplianceDesc": "متوافق تماماً مع GDPR وCCPA ومتطلبات توطين البيانات الإقليمية. لا نشارك معلوماتك الاستراتيجية أو نبيعها أو نستغلها.",
    "EthicalAIFramework": "إطار الذكاء الاصطناعي الأخلاقي",
    "EthicalAIDesc": "يتم تدقيق نماذجنا للتحقق من انحياز التخفيف والهلوسة. يتم إدراج الاستخبارات بشفافية وإسنادها بوضوح.",
    "AESEncryption": "تشفير AES",
    "Compliant": "متوافق",
    "TypeIICertified": "معتمد من النوع الثاني",
    "UptimeSLA": "اتفاقية وقت التشغيل",
}

add_keys("e:/BUA/Project/Daleel/Daleel/Resources/SharedResource.en.resx", en)
add_keys("e:/BUA/Project/Daleel/Daleel/Resources/SharedResource.ar.resx", ar)
print("Done!")
