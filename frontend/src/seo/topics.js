/**
 * ============================================================================
 * SEO TOPICS: STATIC KEYWORD COPY + RULES TO MATCH LIVE API COURSES
 * ============================================================================
 * Each topic is a search intent ("robotics course", "mobile repair training").
 * The words here are static; the courses shown under a topic are always
 * picked live from GET /api/courses using the `match` rules below.
 * A course matches when its category, any sub-category, or its title matches.
 */

export const AUDIENCE = {
  school: { en: 'Class 6 to 12 students', hi: 'कक्षा 6 से 12 के छात्र' },
  polytechnic: { en: 'ITI & Polytechnic / Diploma students', hi: 'ITI और पॉलिटेक्निक / डिप्लोमा छात्र' },
  graduate: { en: 'BA, B.Sc, B.Com graduates', hi: 'BA, B.Sc, B.Com ग्रेजुएट' },
  it: { en: 'BCA, MCA, B.Tech students', hi: 'BCA, MCA, B.Tech छात्र' },
  jobseeker: { en: 'Job seekers & career switchers', hi: 'नौकरी ढूंढ रहे युवा और करियर बदलने वाले' },
  business: { en: 'Shop owners & self-employed youth', hi: 'दुकानदार और स्वरोज़गार करने वाले युवा' }
};

export const TOPICS = [
  {
    slug: 'arena-animation',
    en: 'Arena Animation (2D/3D Animation, VFX & Graphic Design)',
    short: 'Arena Animation',
    hi: 'एरिना एनीमेशन (2D/3D एनीमेशन, VFX और ग्राफिक डिज़ाइन)',
    shortHi: 'एरिना एनीमेशन',
    match: { categories: ['animation', 'arena', 'arenaanimation', 'arena-animation'], title: /arena|animation|vfx|graphic|multimedia|video edit|motion/i },
    introEn: 'CodeGurru Ayodhya runs an Arena Animation franchise centre. Students learn 2D and 3D animation, VFX, video editing and graphic design on industry software, and build a showreel for jobs in studios, YouTube channels, ad agencies and gaming companies.',
    introHi: 'CodeGurru अयोध्या में एरिना एनीमेशन का फ्रेंचाइज़ी सेंटर है। यहाँ 2D और 3D एनीमेशन, VFX, वीडियो एडिटिंग और ग्राफिक डिज़ाइन इंडस्ट्री सॉफ्टवेयर पर सिखाया जाता है, और छात्र स्टूडियो, यूट्यूब चैनल, ऐड एजेंसी और गेमिंग कंपनियों में नौकरी के लिए अपना शोरील बनाते हैं।',
    careersEn: ['3D Animator', 'VFX Artist', 'Graphic Designer', 'Video Editor', 'Motion Graphics Designer', 'UI Designer'],
    careersHi: ['3D एनिमेटर', 'VFX आर्टिस्ट', 'ग्राफिक डिज़ाइनर', 'वीडियो एडिटर', 'मोशन ग्राफिक्स डिज़ाइनर', 'UI डिज़ाइनर'],
    audience: ['school', 'graduate', 'jobseeker', 'business']
  },
  {
    slug: 'web-development',
    en: 'Web Development',
    short: 'Web Development',
    hi: 'वेब डेवलपमेंट',
    shortHi: 'वेब डेवलपमेंट',
    // Title only: every software course in the API currently carries subCat 'webdevelopment'
    match: { title: /web|front.?end|full.?stack|mern|react/i },
    introEn: 'Learn to build real websites with HTML, CSS, JavaScript and React. Every batch builds portfolio projects and deploys them online, so you can show working sites in interviews or take freelance orders.',
    introHi: 'HTML, CSS, JavaScript और React से असली वेबसाइट बनाना सीखें। हर बैच में छात्र पोर्टफोलियो प्रोजेक्ट बनाकर ऑनलाइन डिप्लॉय करते हैं, ताकि इंटरव्यू में चलती हुई वेबसाइट दिखा सकें या फ्रीलांस काम ले सकें।',
    careersEn: ['Frontend Developer', 'Web Designer', 'Full Stack Developer', 'Freelance Website Developer', 'WordPress Developer'],
    careersHi: ['फ्रंटएंड डेवलपर', 'वेब डिज़ाइनर', 'फुल स्टैक डेवलपर', 'फ्रीलांस वेबसाइट डेवलपर', 'वर्डप्रेस डेवलपर'],
    audience: ['school', 'polytechnic', 'graduate', 'it', 'jobseeker']
  },
  {
    slug: 'full-stack-development',
    en: 'Full Stack Development (MERN)',
    short: 'Full Stack Development',
    hi: 'फुल स्टैक डेवलपमेंट (MERN)',
    shortHi: 'फुल स्टैक डेवलपमेंट',
    match: { title: /full.?stack|mern/i },
    introEn: 'Full stack training covers the frontend (React), the backend (Node.js, Express) and the database (MongoDB). You finish with complete apps that have login, payments and an admin panel.',
    introHi: 'फुल स्टैक ट्रेनिंग में फ्रंटएंड (React), बैकएंड (Node.js, Express) और डेटाबेस (MongoDB) तीनों सिखाए जाते हैं। कोर्स के अंत तक आप लॉगिन, पेमेंट और एडमिन पैनल वाले पूरे ऐप बना लेते हैं।',
    careersEn: ['Full Stack Developer', 'MERN Stack Developer', 'Backend Developer', 'Software Engineer'],
    careersHi: ['फुल स्टैक डेवलपर', 'MERN स्टैक डेवलपर', 'बैकएंड डेवलपर', 'सॉफ्टवेयर इंजीनियर'],
    audience: ['polytechnic', 'graduate', 'it', 'jobseeker']
  },
  {
    slug: 'python',
    en: 'Python Programming',
    short: 'Python',
    hi: 'पायथन प्रोग्रामिंग',
    shortHi: 'पायथन',
    match: { title: /python/i },
    introEn: 'Python is the easiest first programming language and the base for AI, data science and automation. Classes start from zero and move to real projects such as automation scripts and small web apps.',
    introHi: 'पायथन सबसे आसान पहली प्रोग्रामिंग भाषा है और AI, डेटा साइंस व ऑटोमेशन की नींव है। क्लास शून्य से शुरू होकर ऑटोमेशन स्क्रिप्ट और छोटे वेब ऐप जैसे असली प्रोजेक्ट तक जाती है।',
    careersEn: ['Python Developer', 'Data Analyst', 'Automation Engineer', 'AI/ML Trainee'],
    careersHi: ['पायथन डेवलपर', 'डेटा एनालिस्ट', 'ऑटोमेशन इंजीनियर', 'AI/ML ट्रेनी'],
    audience: ['school', 'polytechnic', 'graduate', 'it', 'jobseeker']
  },
  {
    slug: 'java',
    en: 'Java Programming',
    short: 'Java',
    hi: 'जावा प्रोग्रामिंग',
    shortHi: 'जावा',
    match: { title: /\bjava\b(?!script)/i },
    introEn: 'Core Java and OOP concepts with hands-on coding, the language most asked in campus placements and company coding rounds.',
    introHi: 'कोर जावा और OOP कॉन्सेप्ट प्रैक्टिकल कोडिंग के साथ। कैंपस प्लेसमेंट और कंपनियों के कोडिंग राउंड में सबसे ज़्यादा जावा ही पूछी जाती है।',
    careersEn: ['Java Developer', 'Backend Developer', 'Android Developer', 'Software Engineer'],
    careersHi: ['जावा डेवलपर', 'बैकएंड डेवलपर', 'एंड्रॉइड डेवलपर', 'सॉफ्टवेयर इंजीनियर'],
    audience: ['polytechnic', 'graduate', 'it', 'jobseeker']
  },
  {
    slug: 'software-testing',
    en: 'Software Testing',
    short: 'Software Testing',
    hi: 'सॉफ्टवेयर टेस्टिंग',
    shortHi: 'सॉफ्टवेयर टेस्टिंग',
    match: { title: /testing|\bqa\b/i },
    introEn: 'Manual and automation testing for people who want an IT job without heavy coding. You learn test cases, bug reports and tools used by software companies.',
    introHi: 'मैनुअल और ऑटोमेशन टेस्टिंग, उनके लिए जो ज़्यादा कोडिंग के बिना IT नौकरी चाहते हैं। टेस्ट केस, बग रिपोर्ट और सॉफ्टवेयर कंपनियों के टूल सिखाए जाते हैं।',
    careersEn: ['Software Tester', 'QA Engineer', 'Automation Tester'],
    careersHi: ['सॉफ्टवेयर टेस्टर', 'QA इंजीनियर', 'ऑटोमेशन टेस्टर'],
    audience: ['graduate', 'it', 'jobseeker']
  },
  {
    slug: 'app-development',
    en: 'Mobile App Development',
    short: 'App Development',
    hi: 'मोबाइल ऐप डेवलपमेंट',
    shortHi: 'ऐप डेवलपमेंट',
    match: { subCats: ['appdevelopment'], title: /\bapp\b|android|flutter|react native|ios/i },
    introEn: 'Build Android and iOS apps and publish them on the Play Store. Projects include shop, delivery and chat apps that you keep in your portfolio.',
    introHi: 'एंड्रॉइड और iOS ऐप बनाना और प्ले स्टोर पर पब्लिश करना सीखें। दुकान, डिलीवरी और चैट ऐप जैसे प्रोजेक्ट आपके पोर्टफोलियो में रहते हैं।',
    careersEn: ['Android Developer', 'Flutter Developer', 'Mobile App Developer', 'Freelance App Developer'],
    careersHi: ['एंड्रॉइड डेवलपर', 'फ्लटर डेवलपर', 'मोबाइल ऐप डेवलपर', 'फ्रीलांस ऐप डेवलपर'],
    audience: ['polytechnic', 'graduate', 'it', 'jobseeker']
  },
  {
    slug: 'ai-machine-learning',
    en: 'AI & Machine Learning',
    short: 'AI & ML',
    hi: 'आर्टिफिशियल इंटेलिजेंस और मशीन लर्निंग',
    shortHi: 'AI और ML',
    match: { subCats: ['aiml'], title: /\bai\b|machine learning|data science|artificial|\bml\b/i },
    introEn: 'Learn how AI tools work and build your own: Python, data handling, machine learning models and using AI APIs in real apps.',
    introHi: 'AI टूल कैसे काम करते हैं यह समझें और खुद बनाएं: पायथन, डेटा हैंडलिंग, मशीन लर्निंग मॉडल और असली ऐप में AI API का इस्तेमाल।',
    careersEn: ['ML Engineer', 'Data Scientist', 'AI Developer', 'Data Analyst'],
    careersHi: ['ML इंजीनियर', 'डेटा साइंटिस्ट', 'AI डेवलपर', 'डेटा एनालिस्ट'],
    audience: ['school', 'graduate', 'it', 'jobseeker']
  },
  {
    slug: 'robotics',
    en: 'Robotics',
    short: 'Robotics',
    hi: 'रोबोटिक्स',
    shortHi: 'रोबोटिक्स',
    match: { categories: ['roboticsiotc', 'robotics'], subCats: ['robotics'], title: /robot/i },
    introEn: 'Hands-on robotics for school and college students: sensors, motors, Arduino and coding. Students build line-follower and obstacle-avoiding robots and prepare for science fairs and competitions.',
    introHi: 'स्कूल और कॉलेज छात्रों के लिए प्रैक्टिकल रोबोटिक्स: सेंसर, मोटर, Arduino और कोडिंग। छात्र लाइन-फॉलोअर और ऑब्स्टेकल-अवॉइडिंग रोबोट बनाते हैं और साइंस फेयर व प्रतियोगिताओं की तैयारी करते हैं।',
    careersEn: ['Robotics Engineer', 'Automation Technician', 'Embedded Developer', 'STEM Trainer'],
    careersHi: ['रोबोटिक्स इंजीनियर', 'ऑटोमेशन टेक्नीशियन', 'एम्बेडेड डेवलपर', 'STEM ट्रेनर'],
    audience: ['school', 'polytechnic', 'it']
  },
  {
    slug: 'iot-embedded-systems',
    en: 'IoT & Embedded Systems',
    short: 'IoT',
    hi: 'IoT और एम्बेडेड सिस्टम',
    shortHi: 'IoT',
    match: { subCats: ['iot', 'embedded'], title: /\biot\b|embedded|arduino|esp32/i },
    introEn: 'Connect devices to the internet: smart home, sensors and automation projects with Arduino, ESP32 and mobile control.',
    introHi: 'डिवाइस को इंटरनेट से जोड़ना सीखें: Arduino, ESP32 और मोबाइल कंट्रोल के साथ स्मार्ट होम, सेंसर और ऑटोमेशन प्रोजेक्ट।',
    careersEn: ['IoT Developer', 'Embedded Engineer', 'Automation Technician'],
    careersHi: ['IoT डेवलपर', 'एम्बेडेड इंजीनियर', 'ऑटोमेशन टेक्नीशियन'],
    audience: ['school', 'polytechnic', 'it']
  },
  {
    slug: 'digital-marketing',
    en: 'Digital Marketing',
    short: 'Digital Marketing',
    hi: 'डिजिटल मार्केटिंग',
    shortHi: 'डिजिटल मार्केटिंग',
    match: { categories: ['marketing'], subCats: ['performanceads', 'seomedia'], title: /marketing|\bseo\b|ads|social media/i },
    introEn: 'SEO, Google Ads, Meta (Facebook/Instagram) ads, Google Business Profile and content. Practise on live campaigns and learn to bring customers to local businesses.',
    introHi: 'SEO, गूगल ऐड्स, मेटा (फेसबुक/इंस्टाग्राम) ऐड्स, गूगल बिज़नेस प्रोफाइल और कंटेंट। लाइव कैंपेन पर प्रैक्टिस करें और लोकल बिज़नेस तक ग्राहक लाना सीखें।',
    careersEn: ['Digital Marketing Executive', 'SEO Specialist', 'Social Media Manager', 'Performance Marketer', 'Freelancer'],
    careersHi: ['डिजिटल मार्केटिंग एग्जीक्यूटिव', 'SEO स्पेशलिस्ट', 'सोशल मीडिया मैनेजर', 'परफॉर्मेंस मार्केटर', 'फ्रीलांसर'],
    audience: ['graduate', 'jobseeker', 'business']
  },
  {
    slug: 'networking-server-administration',
    en: 'Networking & Server Administration (CCNA, Linux, Cloud)',
    short: 'Networking & Server Admin',
    hi: 'नेटवर्किंग और सर्वर एडमिनिस्ट्रेशन (CCNA, Linux, क्लाउड)',
    shortHi: 'नेटवर्किंग और सर्वर एडमिन',
    match: { categories: ['n', 'networking'], subCats: ['serverccna', 'cloudaws'], title: /server|ccna|network|linux|aws|cloud/i },
    introEn: 'Routers, switches, Linux and Windows servers and cloud (AWS). Practical lab work for jobs in IT support, data centres and cloud teams.',
    introHi: 'राउटर, स्विच, Linux और Windows सर्वर और क्लाउड (AWS)। IT सपोर्ट, डेटा सेंटर और क्लाउड टीम की नौकरी के लिए प्रैक्टिकल लैब।',
    careersEn: ['Network Engineer', 'System Administrator', 'Cloud Engineer', 'IT Support Engineer'],
    careersHi: ['नेटवर्क इंजीनियर', 'सिस्टम एडमिनिस्ट्रेटर', 'क्लाउड इंजीनियर', 'IT सपोर्ट इंजीनियर'],
    audience: ['polytechnic', 'graduate', 'it', 'jobseeker']
  },
  {
    slug: 'cyber-security',
    en: 'Cyber Security & Ethical Hacking',
    short: 'Cyber Security',
    hi: 'साइबर सिक्योरिटी और एथिकल हैकिंग',
    shortHi: 'साइबर सिक्योरिटी',
    match: { subCats: ['cybersecurity'], title: /cyber|ethical hack|security/i },
    introEn: 'Learn how attacks happen and how to defend networks, websites and phones, with legal lab practice and security tools.',
    introHi: 'हमले कैसे होते हैं और नेटवर्क, वेबसाइट व फोन को कैसे बचाएं, यह कानूनी लैब प्रैक्टिस और सिक्योरिटी टूल्स के साथ सीखें।',
    careersEn: ['Security Analyst', 'Ethical Hacker', 'SOC Analyst', 'Network Security Engineer'],
    careersHi: ['सिक्योरिटी एनालिस्ट', 'एथिकल हैकर', 'SOC एनालिस्ट', 'नेटवर्क सिक्योरिटी इंजीनियर'],
    audience: ['polytechnic', 'graduate', 'it', 'jobseeker']
  },
  {
    slug: 'mobile-repairing',
    en: 'Mobile Repairing Course',
    short: 'Mobile Repairing',
    hi: 'मोबाइल रिपेयरिंग कोर्स',
    shortHi: 'मोबाइल रिपेयरिंग',
    match: { categories: ['computermobilerepair'], subCats: ['mobilerepair', 'bgaic'], title: /mobile|phone|bga/i },
    introEn: 'Chip-level mobile repairing on real phones: charging, display, network and software faults, BGA IC work and soldering. Many students open their own repair shop after the course.',
    introHi: 'असली फोन पर चिप-लेवल मोबाइल रिपेयरिंग: चार्जिंग, डिस्प्ले, नेटवर्क और सॉफ्टवेयर फॉल्ट, BGA IC और सोल्डरिंग। कई छात्र कोर्स के बाद अपनी रिपेयर दुकान खोलते हैं।',
    careersEn: ['Mobile Repair Technician', 'Own Repair Shop', 'Service Centre Engineer'],
    careersHi: ['मोबाइल रिपेयर टेक्नीशियन', 'अपनी रिपेयर दुकान', 'सर्विस सेंटर इंजीनियर'],
    audience: ['school', 'polytechnic', 'jobseeker', 'business']
  },
  {
    slug: 'laptop-computer-repairing',
    en: 'Laptop & Computer Repairing Course',
    short: 'Laptop & Computer Repairing',
    hi: 'लैपटॉप और कंप्यूटर रिपेयरिंग कोर्स',
    shortHi: 'लैपटॉप रिपेयरिंग',
    match: { subCats: ['laptoppc', 'bgaic'], title: /laptop|computer repair|desktop|motherboard|chip.?level/i },
    introEn: 'Hardware, motherboard and chip-level laptop repair, Windows installation, data recovery and upgrades, learned in CodeGurru’s working repair lab.',
    introHi: 'हार्डवेयर, मदरबोर्ड और चिप-लेवल लैपटॉप रिपेयर, विंडोज इंस्टॉलेशन, डेटा रिकवरी और अपग्रेड, CodeGurru की चालू रिपेयर लैब में सीखें।',
    careersEn: ['Hardware Engineer', 'Laptop Repair Technician', 'IT Support Technician', 'Own Service Centre'],
    careersHi: ['हार्डवेयर इंजीनियर', 'लैपटॉप रिपेयर टेक्नीशियन', 'IT सपोर्ट टेक्नीशियन', 'अपना सर्विस सेंटर'],
    audience: ['school', 'polytechnic', 'it', 'jobseeker', 'business']
  },
  {
    slug: 'home-appliance-repairing',
    en: 'Home Appliance Repairing (Bijli Wala Aaya Training)',
    short: 'Home Appliance Repairing',
    hi: 'होम अप्लायंस रिपेयरिंग (बिजली वाला आया ट्रेनिंग)',
    shortHi: 'होम अप्लायंस रिपेयरिंग',
    match: { categories: ['electrical'], subCats: ['acfridge', 'pcbrepair'], title: /appliance|\bac\b|fridge|refrigerator|washing|electric|wiring|inverter|pcb/i },
    introEn: 'AC, fridge, washing machine, cooler, inverter and house wiring repair, trained with the Bijli Wala Aaya home service team. Trained technicians can join Bijli Wala Aaya as service partners or start their own work.',
    introHi: 'AC, फ्रिज, वॉशिंग मशीन, कूलर, इन्वर्टर और घर की वायरिंग की रिपेयरिंग, बिजली वाला आया होम सर्विस टीम के साथ ट्रेनिंग। ट्रेंड टेक्नीशियन बिजली वाला आया के सर्विस पार्टनर बन सकते हैं या अपना काम शुरू कर सकते हैं।',
    careersEn: ['AC & Fridge Technician', 'Electrician', 'Appliance Service Partner', 'Own Repair Business'],
    careersHi: ['AC और फ्रिज टेक्नीशियन', 'इलेक्ट्रीशियन', 'अप्लायंस सर्विस पार्टनर', 'अपना रिपेयर बिज़नेस'],
    audience: ['school', 'polytechnic', 'jobseeker', 'business']
  },
  {
    slug: 'coding-for-kids',
    en: 'Coding for School Students (Class 6 to 12)',
    short: 'Coding for Kids',
    hi: 'स्कूली छात्रों के लिए कोडिंग (कक्षा 6 से 12)',
    shortHi: 'बच्चों के लिए कोडिंग',
    match: { title: /kids|junior|scratch|school|front.?end|python|robot/i },
    introEn: 'A gentle start for Class 6 to 12: logic, Scratch, Python, web pages and robotics. Small batches, project-based classes and timings after school hours.',
    introHi: 'कक्षा 6 से 12 के लिए आसान शुरुआत: लॉजिक, स्क्रैच, पायथन, वेब पेज और रोबोटिक्स। छोटे बैच, प्रोजेक्ट वाली क्लास और स्कूल के बाद का समय।',
    careersEn: ['Strong base for B.Tech/BCA', 'Olympiad & hackathon preparation', 'Early portfolio for college'],
    careersHi: ['B.Tech/BCA के लिए मज़बूत नींव', 'ओलंपियाड और हैकाथॉन की तैयारी', 'कॉलेज के लिए शुरुआती पोर्टफोलियो'],
    audience: ['school']
  },
  {
    slug: 'computer-course',
    en: 'Basic Computer Course (MS Office, Excel, Tally)',
    short: 'Computer Course',
    hi: 'बेसिक कंप्यूटर कोर्स (MS Office, Excel, Tally)',
    shortHi: 'कंप्यूटर कोर्स',
    match: { categories: ['computerbasics', 'basic'], title: /basic computer|excel|tally|\bccc\b|\bdca\b|adca|ms office|typing/i },
    introEn: 'Computer basics, MS Word, Excel, PowerPoint, internet, typing and Tally with GST. Useful for office jobs, government exams that need CCC-level skills, and running a shop.',
    introHi: 'कंप्यूटर बेसिक्स, MS Word, Excel, PowerPoint, इंटरनेट, टाइपिंग और GST के साथ Tally। ऑफिस जॉब, CCC-स्तर की ज़रूरत वाली सरकारी परीक्षाओं और दुकान चलाने में काम आता है।',
    careersEn: ['Computer Operator', 'Data Entry Operator', 'Accountant (Tally)', 'Office Assistant'],
    careersHi: ['कंप्यूटर ऑपरेटर', 'डेटा एंट्री ऑपरेटर', 'अकाउंटेंट (Tally)', 'ऑफिस असिस्टेंट'],
    audience: ['school', 'graduate', 'jobseeker', 'business']
  }
];

const BY_SLUG = new Map(TOPICS.map((topic) => [topic.slug, topic]));

export const getTopic = (slug) => BY_SLUG.get(slug) || null;

/** True when a live API course belongs under this topic. */
export function courseMatchesTopic(course, topic) {
  const { categories = [], subCats = [], title } = topic.match;
  if (categories.includes(course.category)) return true;
  const courseSubs = [course.subCat, ...(course.subCategories || [])].filter(Boolean);
  if (courseSubs.some((sub) => subCats.includes(sub))) return true;
  return Boolean(title && title.test(course.title || ''));
}
