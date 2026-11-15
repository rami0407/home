// =========================================================================
// BAYT | בַּיִת — Hybrid Full-Stack Engine (Works on GitHub Pages & Node API)
// =========================================================================

let currentLang = 'ar';
let allSchools = [];
let activeDashboardSchool = null;
let currentMatches = [];
let activeClassroomData = null;
let activeStudentSession = {
  name: 'أمير جبارين | אמיר',
  school_side: 'a',
  school_name_ar: 'مدرسة ابن خلدون - أم الفحم',
  school_name_he: 'אבן ח׳לדון - אום אל-פחם'
};
let activeForumCategory = 'all';
let visiblePostTranslations = {};

const CITY_COORDS = {
  'أم الفحم': { lat: 32.5173, lng: 35.1534, he: 'אום אל-פחם', ar: 'أم الفحم', region: 'north_valley' },
  'אום אל-פחם': { lat: 32.5173, lng: 35.1534, he: 'אום אל-פחם', ar: 'أم الفحم', region: 'north_valley' },
  'العفولة': { lat: 32.6078, lng: 35.2897, he: 'עפולה', ar: 'العفولة', region: 'north_valley' },
  'עפולה': { lat: 32.6078, lng: 35.2897, he: 'עפולה', ar: 'العفولة', region: 'north_valley' },
  'الناصرة': { lat: 32.7019, lng: 35.2978, he: 'נצרת', ar: 'الناصرة', region: 'galilee' },
  'נצרת': { lat: 32.7019, lng: 35.2978, he: 'נצרת', ar: 'الناصرة', region: 'galilee' },
  'نوف هجليل': { lat: 32.7066, lng: 35.3245, he: 'נוף הגליל', ar: 'نوف هجليل', region: 'galilee' },
  'נוף הגליל': { lat: 32.7066, lng: 35.3245, he: 'נוף הגליל', ar: 'نوف هجليل', region: 'galilee' },
  'حيفا': { lat: 32.8048, lng: 34.9895, he: 'חיפה', ar: 'حيفا', region: 'haifa_coast' },
  'חיפה': { lat: 32.8048, lng: 34.9895, he: 'חיפה', ar: 'حيفا', region: 'haifa_coast' },
  'الطيرة': { lat: 32.2341, lng: 34.9503, he: 'טירה', ar: 'الطيرة', region: 'center_sharon' },
  'טירה': { lat: 32.2341, lng: 34.9503, he: 'טירה', ar: 'الطيرة', region: 'center_sharon' },
  'كفار سابا': { lat: 32.1780, lng: 34.9065, he: 'כפר סבא', ar: 'كفار سابا', region: 'center_sharon' },
  'כפר סבא': { lat: 32.1780, lng: 34.9065, he: 'כפר סבא', ar: 'كفار سابا', region: 'center_sharon' },
  'رهط': { lat: 31.3925, lng: 34.7544, he: 'רהט', ar: 'رهط', region: 'negev' },
  'רהט': { lat: 31.3925, lng: 34.7544, he: 'רהט', ar: 'رهط', region: 'negev' },
  'بئر السبع': { lat: 31.2518, lng: 34.7913, he: 'באר שבע', ar: 'بئر السبع', region: 'negev' },
  'באר שבע': { lat: 31.2518, lng: 34.7913, he: 'באר שבע', ar: 'بئر السبع', region: 'negev' }
};

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const BILINGUAL_PHRASES = [
  { ar: 'مرحباً بالجميع', he: 'שלום לכולם' },
  { ar: 'مرحبا بالجميع', he: 'שלום לכולם' },
  { ar: 'مرحباً', he: 'שלום' },
  { ar: 'مرحبا', he: 'שלום' },
  { ar: 'أهلاً وسهلاً', he: 'ברוכים הבאים' },
  { ar: 'أهلاً', he: 'היי' },
  { ar: 'أنا اسمي', he: 'קוראים לי' },
  { ar: 'اسمي', he: 'שמי' },
  { ar: 'أحب', he: 'אני אוהב/ת' },
  { ar: 'هوايتي', he: 'התחביב שלי' },
  { ar: 'كرة القدم', he: 'כדורגל' },
  { ar: 'الموسيقى', he: 'מוזיקה' },
  { ar: 'القراءة', he: 'קריאה' },
  { ar: 'الرسم', he: 'ציור' },
  { ar: 'التصوير', he: 'צילום' },
  { ar: 'العلوم', he: 'מדעים' },
  { ar: 'البيئة', he: 'סביבה' },
  { ar: 'المياه', he: 'מים' },
  { ar: 'البحث المشترك', he: 'המחקר המשותף' },
  { ar: 'في بيتنا المشترك', he: 'בבית המשותף שלנו' },
  { ar: 'مدرسة', he: 'בית ספר' },
  { ar: 'طلاب', he: 'תלמידים' },
  { ar: 'شراكة', he: 'שותפות' },
  { ar: 'المسخن', he: 'מסח׳ן' },
  { ar: 'الكنافة', he: 'כנאפה' },
  { ar: 'شكراً جزيلاً', he: 'תודה רבה' },
  { ar: 'فكرة رائعة', he: 'רעיון נהדר' }
];

function detectLang(text) {
  const hebrewRegex = /[\u0590-\u05FF]/;
  const arabicRegex = /[\u0600-\u06FF]/;
  if (hebrewRegex.test(text) && !arabicRegex.test(text)) return 'he';
  return 'ar';
}

function smartTranslateLocal(text, targetLang) {
  if (!text || !text.trim()) return '';
  const clean = text.trim();
  const sourceLang = detectLang(clean);
  if (sourceLang === targetLang) return clean;

  let translated = clean;
  let matchCount = 0;

  if (sourceLang === 'ar' && targetLang === 'he') {
    for (const pair of BILINGUAL_PHRASES) {
      if (translated.includes(pair.ar)) {
        translated = translated.split(pair.ar).join(pair.he);
        matchCount++;
      }
    }
    if (matchCount > 0 && !/[\u0600-\u06FF]/.test(translated)) return translated;
    if (matchCount > 0) return `${translated} (תרגום חכם מערבית: "${clean}")`;
    return `[תרגום מיידי לעברית] שלום חברים לבית המשותף! בהמשך לדבריי: "${clean}" — נשמח לשתף פעולה במחקר ובשיח המשותף.`;
  } else {
    for (const pair of BILINGUAL_PHRASES) {
      if (translated.includes(pair.he)) {
        translated = translated.split(pair.he).join(pair.ar);
        matchCount++;
      }
    }
    if (matchCount > 0 && !/[\u0590-\u05FF]/.test(translated)) return translated;
    if (matchCount > 0) return `${translated} (ترجمة ذكية من العبرية: "${clean}")`;
    return `[ترجمة فورية للعربية] أهلاً بشركائنا في البيت المشترك! بخصوص ما ذُكر: "${clean}" — يسعدنا التعاون معاً في الحوار والبحث المشترك.`;
  }
}

// Initial Seed Store for Browser Persistence (when running on GitHub Pages)
const INITIAL_STORE = {
  schools: [
    {
      id: 1,
      name_ar: 'مدرسة ابن خلدون الإعدادية',
      name_he: 'חטיבת ביניים אבן ח׳לדון',
      city_ar: 'أم الفحم',
      city_he: 'אום אל-פחם',
      lat: 32.5173,
      lng: 35.1534,
      sector: 'arab',
      age_stage: 'middle',
      target_grades: '8-9',
      interests: ['science_env', 'history_heritage', 'social_entrepreneurship'],
      activity_type: 'hybrid',
      contact_name: 'د. ريم جبارين',
      contact_role: 'مديرة المدرسة / מנהלת בית הספר',
      contact_email: 'ibnkhaldoun@bayt.edu',
      contact_phone: '050-4123456',
      bio_ar: 'مدرسة رائدة في البحث العلمي البيئي وتوثيق التراث المحلي في وادي عارة، نؤمن ببناء جسور الحوار عبر المشاريع العلمية الميدانية.',
      bio_he: 'בית ספר מוביל במחקר מדעי-סביבתי ותיעוד מורשת מקומית בוואדי עארה, המאמין בבניית גשרי שיח דרך פרויקטים מדעיים משותפים.',
      students_count: 65,
      matched_school_id: 2,
      students: [
        { id: 1001, name: 'أمير جبارين | אמיר ג׳בארין', studentIdNumber: '100000001', grade: '8-أ', team: 'فريق المياه والبيئة' }
      ]
    },
    {
      id: 2,
      name_ar: 'مدرسة كرميم الشاملة',
      name_he: 'בית ספר מקיף כרמים',
      city_ar: 'العفولة',
      city_he: 'עפולה',
      lat: 32.6078,
      lng: 35.2897,
      sector: 'jewish_state',
      age_stage: 'middle',
      target_grades: '8-9',
      interests: ['science_env', 'history_heritage', 'arts_music'],
      activity_type: 'hybrid',
      contact_name: 'ياعيل ليفي (יעל לוי)',
      contact_role: 'مركزة التربية الاجتماعية / רכזת חינוך חברתי',
      contact_email: 'kramim@bayt.edu',
      contact_phone: '052-8765432',
      bio_ar: 'مدرسة تهتم بالاستدامة البيئية، الفنون، والمبادرات المجتمعية في مرج ابن عامر، وتسعى لشراكة حقيقية ومستدامة مع مدارس المنطقة.',
      bio_he: 'בית ספר המקדם קיימות סביבתית, אמנויות ויוזמות קהילתיות בעמק יזרעאל, ושואף לשותפות אמיתית ומתמשכת עם בתי ספר באזור.',
      students_count: 60,
      matched_school_id: 1,
      students: [
        { id: 1002, name: 'מאיה לוי | مايا ليفي', studentIdNumber: '100000002', grade: 'ח׳2', team: 'צוות מים וסביבה' }
      ]
    },
    {
      id: 3,
      name_ar: 'مدرسة البشارة الثانوية',
      name_he: 'תיכון אל-בישארה',
      city_ar: 'الناصرة',
      city_he: 'נצרת',
      lat: 32.7019,
      lng: 35.2978,
      sector: 'arab',
      age_stage: 'high',
      target_grades: '10-11',
      interests: ['science_env', 'lit_lang', 'social_entrepreneurship'],
      activity_type: 'hybrid',
      contact_name: 'أ. سامر زعبي',
      contact_role: 'مركز المشاريع المشتركة / רכז פרויקטים משותפים',
      contact_email: 'bishara@bayt.edu',
      contact_phone: '054-3322110',
      bio_ar: 'نبحث عن مدرسة شريكة لطلاب الصفوف العاشرة والحادية عشرة لتطوير مشاريع ريادة أعمال مجتمعية وأبحاث بيئية مشتركة.',
      bio_he: 'מחפשים בית ספר שותף לתלמידי כיתות י׳-י״א לפיתוח מיזמים חברתיים ומחקרי סביבה משותפים.',
      students_count: 50,
      matched_school_id: null,
      students: [
        { id: 1003, name: 'سامر زعبي | סאמר זועבי', studentIdNumber: '100000003', grade: '10-ب', team: 'الريادة والبيئة' }
      ]
    },
    {
      id: 4,
      name_ar: 'مدرسة أورت ألون',
      name_he: 'אורט אלון נוף הגליל',
      city_ar: 'نوف هجليل',
      city_he: 'נוף הגליל',
      lat: 32.7066,
      lng: 35.3245,
      sector: 'jewish_state',
      age_stage: 'high',
      target_grades: '10-11',
      interests: ['science_env', 'social_entrepreneurship', 'lit_lang'],
      activity_type: 'hybrid',
      contact_name: 'دفنا كوهين (דפנה כהן)',
      contact_role: 'مديرة المرحلة الثانوية / מנהלת חטיבה עליונה',
      contact_email: 'ortalon@bayt.edu',
      contact_phone: '052-9988776',
      bio_ar: 'مدرسة ثانوية تكنولوجية وإنسانية في نوف هجليل، متحمسون لبناء بيت مشترك مع مدرسة جارة في الناصرة للبحث العلمي والريادة.',
      bio_he: 'תיכון טכנולוגי-ערכי בנוף הגליל, נרגשים לבנות בית משותף עם בית ספר שכן בנצרת למחקר מדעי ויזמות חברתית.',
      students_count: 55,
      matched_school_id: null,
      students: [
        { id: 1004, name: 'עומר כהן | عومر كوهين', studentIdNumber: '100000004', grade: 'י׳1', team: 'יזמות ומדעים' }
      ]
    },
    {
      id: 5,
      name_ar: 'مدرسة الزهراء الإعدادية',
      name_he: 'חטיבת ביניים א-זהראא',
      city_ar: 'الطيرة',
      city_he: 'טירה',
      lat: 32.2341,
      lng: 34.9503,
      sector: 'arab',
      age_stage: 'middle',
      target_grades: '7-8',
      interests: ['arts_music', 'lit_lang', 'history_heritage'],
      activity_type: 'hybrid',
      contact_name: 'مادلين منصور',
      contact_role: 'مركزة التربية الاجتماعية / רכזת חינוך חברתי',
      contact_email: 'zahraa@bayt.edu',
      contact_phone: '050-6655443',
      bio_ar: 'مدرسة إعدادية في الطيرة تركز على الإبداع الأدبي، الموسيقى، وتوثيق الحكايات الشعبية العائلية.',
      bio_he: 'חטיבת ביניים בטירה המתמקדת ביצירה ספרותית, מוזיקה ותיעוד סיפורי משפחה ומורשת.',
      students_count: 40,
      matched_school_id: null
    },
    {
      id: 6,
      name_ar: 'إعدادية هشارون',
      name_he: 'חטיבת ביניים השרון',
      city_ar: 'كفار سابا',
      city_he: 'כפר סבא',
      lat: 32.178,
      lng: 34.9065,
      sector: 'jewish_state',
      age_stage: 'middle',
      target_grades: '7-8',
      interests: ['arts_music', 'lit_lang', 'science_env'],
      activity_type: 'hybrid',
      contact_name: 'رونين شبيرا (רונן שפירא)',
      contact_role: 'مدير المدرسة / מנהל בית הספר',
      contact_email: 'hasharon@bayt.edu',
      contact_phone: '054-7788991',
      bio_ar: 'نسعى لربط طلابنا بجيراننا في منطقة المثلث والشارون عبر الفنون، اللغات، والعمل البحثي المشترك.',
      bio_he: 'שואפים לחבר את תלמידינו לשכנינו באזור המשולש והשרון דרך אמנות, שפות ועבודת חקר משותפת.',
      students_count: 48,
      matched_school_id: null
    },
    {
      id: 7,
      name_ar: 'مدرسة النور الابتدائية',
      name_he: 'בית ספר יסודי אל-נור',
      city_ar: 'حيفا',
      city_he: 'חיפה',
      lat: 32.8156,
      lng: 34.9892,
      sector: 'arab',
      age_stage: 'elementary',
      target_grades: '5-6',
      interests: ['science_env', 'arts_music', 'history_heritage'],
      activity_type: 'online',
      contact_name: 'سهاد خوري',
      contact_role: 'مركزة الحوسبة والمشاريع / רכזת תקשוב ופרויקטים',
      contact_email: 'alnoor@bayt.edu',
      contact_phone: '053-2211445',
      bio_ar: 'نعمل على غرس قيم الاحترام المتبادل وحب الطبيعة والبحر لدى طلاب الصفوف الخامسة والسادسة في حيفا.',
      bio_he: 'פועלים להטמעת ערכי כבוד הדדי ואהבת הטבע והים בקרב תלמידי כיתות ה׳-ו׳ בחיפה.',
      students_count: 38,
      matched_school_id: null
    },
    {
      id: 8,
      name_ar: 'مدرسة أوفكيم الابتدائية',
      name_he: 'בית ספר יסודי אופקים',
      city_ar: 'حيفا',
      city_he: 'חיפה',
      lat: 32.794,
      lng: 34.9896,
      sector: 'jewish_state',
      age_stage: 'elementary',
      target_grades: '5-6',
      interests: ['science_env', 'arts_music', 'lit_lang'],
      activity_type: 'online',
      contact_name: 'نوعا بار (נועה בר)',
      contact_role: 'مركزة طبقة / רכזת שכבה',
      contact_email: 'ofakim@bayt.edu',
      contact_phone: '052-3344556',
      bio_ar: 'مدرسة ابتدائية في حيفا تبحث عن شريك تعليمي لبرنامج سنوي مشترك حول بيئة ساحل الكرمل والفنون.',
      bio_he: 'בית ספר יסודי בחיפה המחפש שותף חינוכי לתוכנית שנתית משותפת סביב סביבת חוף הכרמל ואמנויות.',
      students_count: 42,
      matched_school_id: null
    },
    {
      id: 9,
      name_ar: 'مدرسة السلام الثانوية',
      name_he: 'תיכון א-סלאם',
      city_ar: 'رهط',
      city_he: 'רהט',
      lat: 31.3925,
      lng: 34.7544,
      sector: 'arab',
      age_stage: 'high',
      target_grades: '10-12',
      interests: ['science_env', 'social_entrepreneurship', 'history_heritage'],
      activity_type: 'research',
      contact_name: 'أ. خالد القريناوي',
      contact_role: 'مدير المدرسة / מנהל בית הספר',
      contact_email: 'alsalam@bayt.edu',
      contact_phone: '050-9911223',
      bio_ar: 'مهتمون بمشاريع الطاقة المتجددة، الزراعة الصحراوية، وتوثيق التراث الثقافي في النقب.',
      bio_he: 'מתעניינים בפרויקטים של אנרגיה מתחדשת, חקלאות מדברית ותיעוד מורשת תרבותית בנגב.',
      students_count: 52,
      matched_school_id: null
    },
    {
      id: 10,
      name_ar: 'مدرسة دكاليم الثانوية',
      name_he: 'תיכון ממ"ד דקלים',
      city_ar: 'بئر السبع',
      city_he: 'באר שבע',
      lat: 31.2518,
      lng: 34.7913,
      sector: 'jewish_religious',
      age_stage: 'high',
      target_grades: '10-12',
      interests: ['science_env', 'history_heritage', 'social_entrepreneurship'],
      activity_type: 'research',
      contact_name: 'أفيتال مزراحي (אביטל מזרחי)',
      contact_role: 'مركزة البحث العلمي / רכזת מגמת מחקר',
      contact_email: 'dekalim@bayt.edu',
      contact_phone: '054-1122334',
      bio_ar: 'نطمح للتعاون البحثي في قضايا المياه والمناخ الصحراوي مع مدارس المجتمع العربي في النقب.',
      bio_he: 'שואפים לשיתוף פעולה מחקרי בסוגיות מים ואקלים מדברי עם בתי ספר מהחברה הערבית בנגב.',
      students_count: 46,
      matched_school_id: null
    }
  ],
  match_requests: [
    { from_school_id: 1, to_school_id: 2, status: 'room_created' },
    { from_school_id: 3, to_school_id: 4, status: 'mutual_approved' }
  ],
  classrooms: [
    {
      id: 1,
      code: 'BAYT-2026',
      school_a_id: 1,
      school_b_id: 2,
      title_ar: 'مدرسة ابن خلدون، أم الفحم 🤝 مدرسة كرميم، العفولة',
      title_he: 'חט"ב אבן ח׳לדון, אום אל-פחם 🤝 מקיף כרמים, עפולה',
      research_topic_ar: 'جودة المياه الجوفية والينابيع وحكايات كبار السن في وادي عارة ومرج ابن عامر',
      research_topic_he: 'איכות מי תהום ומעיינות וסיפורי ותיקים בוואדי עארה ובעמק יזרעאל',
      supervisor_ar: 'د. ريم جبارين وأ. محمود إغبارية',
      supervisor_he: 'יעל לוי ודניאל כהן'
    },
    {
      id: 2,
      code: 'GALIL-101',
      school_a_id: 3,
      school_b_id: 4,
      title_ar: 'مدرسة البشارة، الناصرة 🤝 مدرسة أورت ألون، نوف هجليل',
      title_he: 'תיכון אל-בישארה, נצרת 🤝 אורט אלון, נוף הגליל',
      research_topic_ar: 'الجزر الحرارية والتشجير الحضري المشترك بين الناصرة ونوف هجليل',
      research_topic_he: 'איי חום עירוניים וייעור עירוני משותף בין נצרת לנוף הגליל',
      supervisor_ar: 'أ. سامر زعبي',
      supervisor_he: 'דפנה כהן'
    }
  ],
  posts: [
    {
      id: 1,
      classroom_id: 1,
      category: 'self_intro',
      author_name: 'أمير جبارين | אמיר ג׳בארין',
      school_side: 'a',
      school_name_ar: 'مدرسة ابن خلدون - أم الفحم',
      school_name_he: 'אבן ח׳לדון - אום אל-פחם',
      original_lang: 'ar',
      content_ar: 'مرحباً بالجميع في بيتنا المشترك! أنا أمير من الصف التاسع في أم الفحم. أحب التصوير الفوتوغرافي والعلوم البيئية، ومتحمس جداً لزيارة العفولة وفحص عينات المياه معاً.',
      content_he: 'שלום לכולם בבית המשותף שלנו! אני אמיר מכיתה ט׳ באום אל-פחם. אני אוהב צילום ומדעי הסביבה, ונרגש מאוד לבקר בעפולה ולבדוק יחד דגימות מים.',
      likes: 14,
      replies: [
        {
          id: 101,
          author_name: 'يوني شاحر | יוני שחר',
          school_name_ar: 'مدرسة كرميم - العفولة',
          school_name_he: 'מקיף כרמים - עפולה',
          original_lang: 'he',
          content_ar: 'مرحباً أمير! أنا أيضاً أحب التصوير، يمكننا توثيق مراحل فحص المياه بالكاميرا معاً.',
          content_he: 'שלום אמיר! גם אני אוהב צילום, נוכל לתעד יחד את שלבי בדיקת המים במצלמה.'
        }
      ]
    },
    {
      id: 2,
      classroom_id: 1,
      category: 'self_intro',
      author_name: 'مايا ليفي | מאיה לוי',
      school_side: 'b',
      school_name_ar: 'مدرسة كرميم - العفولة',
      school_name_he: 'מקיף כרמים - עפולה',
      original_lang: 'he',
      content_ar: 'أهلاً أمير وجميع الأصدقاء! أنا مايا من العفولة. هوايتي العزف على الجيتار والبحث في تاريخ المنطقة. بفضل الترجمة الفورية في المنصة فهمت رسالتك فوراً ويسعدني أن نكون في نفس الفريق البحثي!',
      content_he: 'היי אמיר וכל החברים! אני מאיה מעפולה. התחביב שלי הוא נגינה בגיטרה וחקר ההיסטוריה של האזור. בזכות התרגום המיידי בפלטפורמה הבנתי את ההודעה שלך מיד ואני שמחה שנהיה באותו צוות מחקר!',
      likes: 19,
      replies: []
    },
    {
      id: 3,
      classroom_id: 1,
      category: 'favorite_food',
      author_name: 'ليان محاميد | ליאן מחאמיד',
      school_side: 'a',
      school_name_ar: 'مدرسة ابن خلدون - أم الفحم',
      school_name_he: 'אבן ח׳לדון - אום אל-פחם',
      original_lang: 'ar',
      content_ar: 'في موضوع أكلتنا المفضلة: جدتي تعد أفضل "مسخن" بزيت الزيتون الجديد من كروم عائلتنا في اللجون. في لقائنا القادم سنحضر لكم خبز الطابون الساخن مع الزعتر البلدي!',
      content_he: 'בנושא המאכל האהוב שלנו: סבתא שלי מכינה את ה"מסח׳ן" הטוב ביותר עם שמן זית חדש מכרמי המשפחה שלנו בלג׳ון. במפגש הבא שלנו נביא לכם לחם טאבון חם עם זעתר מקומי!',
      likes: 23,
      replies: []
    },
    {
      id: 4,
      classroom_id: 1,
      category: 'holidays',
      author_name: 'عومر كوهين | עומר כהן',
      school_side: 'b',
      school_name_ar: 'مدرسة كرميم - العفولة',
      school_name_he: 'מקיף כרמים - עפולה',
      original_lang: 'he',
      content_ar: 'اقترب عيد الشجرة (طو بشفاط) وعائلتنا تخرج دائماً لزراعة الأشجار في المرج. ما رأيكم أن ننظم يوماً مشتركاً لزراعة أشجار التين والزيتون واللوز حول النبع الذي نبحثه؟',
      content_he: 'חג האילנות (ט"ו בשבט) מתקרב והמשפחה שלנו תמיד יוצאת לנטוע עצים בעמק. מה דעתכם שנארגן יום משותף לנטיעת עצי תאנה, זית ושקד סביב המעיין שאנחנו חוקרים?',
      likes: 27,
      replies: []
    }
  ],
  research_data: [
    {
      id: 1,
      classroom_id: 1,
      data_type: 'measurement',
      title_ar: 'فحص حموضة ونقاء مياه عين الشعرة في أم الفحم',
      title_he: 'בדיקת חומציות וצלילות מים בעין א-שערה באום אל-פחם',
      town_ar: 'أم الفحم',
      town_he: 'אום אל-פחם',
      author_name: 'أمير جبارين & سارة اغبارية',
      summary_ar: 'أخذنا 3 عينات من مياه النبع بعد المطر الأول. مستوى pH بلغ 7.4 ونسبة الأملاح المذابة TDS منخفضة (310 ppm)، مما يدل على جودة عالية تحتاج لحماية من التلوث البلاستيكي.',
      summary_he: 'דגמנו 3 דגימות ממי המעיין אחרי הגשם הראשון. רמת ה-pH עמדה על 7.4 וריכוז המלחים המומסים (TDS) נמוך (310 ppm), מה שמעיד על איכות גבוהה הדורשת הגנה מפני זיהום פלסטיק.',
      metric_badge: 'pH 7.4 | 310 ppm'
    },
    {
      id: 2,
      classroom_id: 1,
      data_type: 'measurement',
      title_ar: 'قياس جودة المياه في مجرى نهر جالود (عين جالود) قرب العفولة',
      title_he: 'מדידת איכות מים בנחל חרוד (מעיין חרוד) ליד עפולה',
      town_ar: 'العفولة',
      town_he: 'עפולה',
      author_name: 'مايا ليفي & عومر كوهين',
      summary_ar: 'فحصنا درجة الحرارة والأكسجين المذاب ومستوى النترات. مستوى pH بلغ 7.6 مع وجود حاجة لتنظيف ضفاف المجرى وزيادة النباتات المائية الطبيعية لتنقية المياه.',
      summary_he: 'בדקנו טמפרטורה, חמצן מומס ורמת חנקות. רמת ה-pH עמדה על 7.6 עם צורך בניקוי גדות הנחל והגדלת צמחיית המים הטבעית לטיהור המים.',
      metric_badge: 'pH 7.6 | O₂ 8.2 mg/L'
    },
    {
      id: 3,
      classroom_id: 1,
      data_type: 'interview',
      title_ar: 'مقابلة مسجلة مع الحاج أبو صالح (82 عاماً) حول عيون الماء التاريخية',
      title_he: 'ראיון מוקלט עם אל-חאג׳ אבו סאלח (בן 82) על מעיינות המים ההיסטוריים',
      town_ar: 'أم الفحم',
      town_he: 'אום אל-פחם',
      author_name: 'ليان محاميد & يوني شاحر',
      summary_ar: 'يروي الحاج كيف كانت عيون الماء نقطة التقاء للفلاحين والرعاة والمسافرين من كل البلدات المجاورة، وكيف كانوا ينظفون القنوات الحجرية بشكل تعاوني كل ربيع.',
      summary_he: 'אל-חאג׳ מספר כיצד מעיינות המים היו נקודת מפגש לחקלאים, רועים ונוסעים מכל היישובים הסמוכים, וכיצד ניקו את תעלות האבן בשיתוף פעולה בכל אביב.',
      metric_badge: 'تسجيل صوتي 14 د | הקלטה 14 דק׳'
    }
  ],
  canvas_cards: [
    {
      id: 1,
      classroom_id: 1,
      column_key: 'ideas',
      author_name: 'أمير & مايا',
      content_ar: 'سؤال البحث: كيف يؤثر النشاط البشري والزراعي على نقاء مياه الينابيع في وادي عارة والمرج؟',
      content_he: 'שאלת המחקר: כיצד משפיעה הפעילות האנושית והחקלאית על צלילות מי המעיינות בוואדי עארה ובעמק?',
      color_tag: 'blue',
      votes: 9
    },
    {
      id: 2,
      classroom_id: 1,
      column_key: 'ideas',
      author_name: 'ليان محاميد',
      content_ar: 'إضافة فصل خاص في البحث يقارن بين الأمثال الشعبية العربية والعبرية حول الماء والمطر.',
      content_he: 'הוספת פרק מיוחד במחקר המשווה בין פתגמים עממיים בערבית ובעברית על מים וגשם.',
      color_tag: 'green',
      votes: 11
    },
    {
      id: 3,
      classroom_id: 1,
      column_key: 'field_work',
      author_name: 'عومر & سارة',
      content_ar: 'توحيد استمارة فحص المياه (pH، الحرارة، العكورة، النباتات المحيطة) لنستخدم نفس المعايير في البلدتين.',
      content_he: 'איחוד טופס בדיקת המים (pH, טמפרטורה, עכירות, צמחייה סובבת) כדי שנשתמש באותם מדדים בשני היישובים.',
      color_tag: 'amber',
      votes: 8
    },
    {
      id: 4,
      classroom_id: 1,
      column_key: 'drafting',
      author_name: 'يوني & أمير',
      content_ar: 'تصميم خريطة تفاعلية ثنائية اللغة تعرض مواقع الينابيع ونتائج الفحص المخبري ومقاطع صوت كبار السن.',
      content_he: 'עיצוב מפה אינטראקטיבית דו-לשונית המציגה את מיקומי המעיינות, תוצאות המעבדה וקטעי הקול של הוותיקים.',
      color_tag: 'blue',
      votes: 14
    },
    {
      id: 5,
      classroom_id: 1,
      column_key: 'conclusions',
      author_name: 'الفريق المشترك',
      content_ar: 'توصية للبلديتين: وضع لافتات إرشادية باللغتين العربية والعبرية لحماية الينابيع كإرث طبيعي وثقافي مشترك.',
      content_he: 'המלצה לשתי העיריות: הצבת שלטי הסברה בערבית ובעברית להגנה על המעיינות כמורשת טבעית ותרבותית משותפת.',
      color_tag: 'green',
      votes: 17
    }
  ],
  achievements: [
    {
      id: 1,
      title_ar: 'أطلس الينابيع والذاكرة المشتركة',
      title_he: 'אטלס המעיינות והזיכרון המשותף',
      schools_ar: 'مدرسة ابن خلدون (أم الفحم) 🤝 مدرسة كرميم (العفولة)',
      schools_he: 'חט"ב אבן ח׳לדון (אום אל-פחם) 🤝 מקיף כרמים (עפולה)',
      format_type: 'عرض تقديمي تفاعلي + خريطة رقمية | מצגת אינטראקטיבית',
      summary_ar: 'بحث علمي وتراثي متكامل شمل فحص 6 ينابيع وإجراء 12 مقابلة مع كبار السن، تُوّج بمعرض مشترك بحضور الأهالي ورؤساء البلديات.',
      summary_he: 'מחקר מדעי-מורשתי מקיף שכלל בדיקת 6 מעיינות ו-12 ראיונות עם זקני היישובים, שהגיע לשיאו בתערוכה משותפת בנוכחות הורים וראשי רשויות.',
      impact_ar: 'تم تبني توصيات الطلاب لتنظيف وتأهيل مسار عين الشعرة وعين جالود بلوحات ثنائية اللغة.',
      impact_he: 'המלצות התלמידים אומצו לניקוי ושיקום שביל עין א-שערה ומעיין חרוד עם שילוט דו-לשוני.',
      likes: 48,
      year: '2026'
    },
    {
      id: 2,
      title_ar: 'مجسم المدينة الخضراء الذكية في الجليل',
      title_he: 'דגם העיר הירוקה והחכמה בגליל',
      schools_ar: 'مدرسة البشارة (الناصرة) 🤝 أورت ألون (نوف هجليل)',
      schools_he: 'תיכון אל-בישארה (נצרת) 🤝 אורט אלון (נוף הגליל)',
      format_type: 'مجسم هندسي ثلاثي الأبعاد + فيديو | דגם הנדסי תלת-ממדי',
      summary_ar: 'قام 40 طالباً وطالبة بتصميم مجسم معماري يربط بين المدينتين بحديقة بيئية تعمل بالطاقة الشمسية ومسارات مشي آمنة للطلاب.',
      summary_he: '40 תלמידים ותלמידות תכננו דגם אדריכלי המחבר בין שתי הערים באמצעות פארק אקולוגי סולארי ושבילי הליכה בטוחים לתלמידים.',
      impact_ar: 'فاز المشروع بجائزة المبادرة التربوية المشتركة وعُرض في مؤتمر المناخ الشبابي.',
      impact_he: 'הפרויקט זכה בפרס היוזמה החינוכית המשותפת והוצג בוועידת האקלים לנוער.',
      likes: 39,
      year: '2026'
    },
    {
      id: 3,
      title_ar: 'كتاب وصوت: حكايات الجدات والمطبخ البلدي',
      title_he: 'ספר וקול: סיפורי סבתות והמטבח המקומי',
      schools_ar: 'مدرسة الزهراء (الطيرة) 🤝 إعدادية هشارون (كفار سابا)',
      schools_he: 'חט"ב א-זהראא (טירה) 🤝 חט"ב השרון (כפר סבא)',
      format_type: 'كتاب رقمي مصور وبودكاست | ספר דיגיטלי מאויר ופודקאסט',
      summary_ar: 'توثيق 24 قصة عائلية ووصفة تقليدية باللغتين العربية والعبرية مع رسومات فنية من إبداع الطلاب.',
      summary_he: 'תיעוד 24 סיפורים משפחתיים ומתכונים מסורתיים בערבית ובעברית בליווי איורים אמנותיים פרי יצירת התלמידים.',
      impact_ar: 'طباعة 500 نسخة وتوزيعها على مكتبات المدارس في المنطقة.',
      impact_he: 'הדפסת 500 עותקים וחלוקתם לספריות בתי הספר באזור.',
      likes: 54,
      year: '2026'
    }
  ],
  news: [
    {
      id: 101,
      type: 'admin',
      pinned: true,
      date: '2026-11-14',
      title_ar: '📢 انطلاق الموسم الدراسي الجديد في شبكة "بَيْت | בַּיִת"',
      title_he: '📢 פתיחת שנת הפעילות החדשה ברשת "בַּיִת | بَيْت"',
      body_ar: 'ندعو جميع المدارس العربية واليهودية للتسجيل وتحديث اهتماماتها البحثية للبدء في التوأمة الذكية للعام الدراسي.',
      body_he: 'אנו מזמינים את כל בתי הספר הערביים והיהודיים להירשם ולעדכן את תחומי המחקר שלהם להתחלת שותפויות חדשות.'
    },
    {
      id: 102,
      type: 'school',
      pinned: false,
      date: '2026-11-13',
      title_ar: '🏫 انضمام 10 مدارس رائدة من الجليل والمثلث والمركز والنقب',
      title_he: '🏫 10 בתי ספר מובילים הצטרפו מהגליל, המשולש, המרכז והנגב',
      body_ar: 'تواصل الشبكة توسعها لتشمل مدارس جديدة متاحة للتوأمة الفورية في مجالات البيئة، التراث، والعلوم.',
      body_he: 'הרשת ממשיכה להתרחב וכוללת בתי ספר חדשים הפנויים לשידוך מיידי בתחומי סביבה, מורשת ומדעים.'
    },
    {
      id: 103,
      type: 'event',
      pinned: false,
      date: '2026-11-12',
      title_ar: '📅 فتح باب التقديم لمشاريع البحث البيئي المشترك 2026',
      title_he: '📅 נפתחה ההרשמה לפרויקטי מחקר סביבתיים משותפים 2026',
      body_ar: 'يمكن للمعلمين والطلاب الآن استخدام مختبر البحث ولوحة العمل التعاونية المترجمة فورياً بين العربية والعبرية.',
      body_he: 'מורים ותלמידים יכולים כעת להשתמש במעבדת המחקר ובלוח העבודה השיתופי המתורגם מיידית בין עברית לערבית.'
    },
    {
      id: 104,
      type: 'partnership',
      pinned: false,
      date: '2026-11-10',
      title_ar: '🤝 اكتمال تفعيل نظام المطابقة الذكية والاختيار اليدوي للمدارس',
      title_he: '🤝 הופעלה מערכת ההתאמה החכמה והסינון הידני לבתי ספר',
      body_ar: 'تستطيع كل مدرسة الآن استعراض المدارس غير المقترنة بعد وتأسيس غرفة بحث مشترك آمنة لطلابها.',
      body_he: 'כל בית ספר יכול כעת לצפות בבתי ספר שטרם שודכו ולפתוח חדר מחקר משותף ומאובטח לתלמידיו.'
    }
  ]
};

function getLocalStore() {
  try {
    const raw = localStorage.getItem('bayt_platform_db_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.news)) {
        parsed.news = JSON.parse(JSON.stringify(INITIAL_STORE.news));
        saveLocalStore(parsed);
      }
      return parsed;
    }
  } catch (e) {}
  localStorage.setItem('bayt_platform_db_v2', JSON.stringify(INITIAL_STORE));
  return JSON.parse(JSON.stringify(INITIAL_STORE));
}

// =========================================================================
// FIREBASE REALTIME DATABASE & ANALYTICS INTEGRATION
// =========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAbgJmGLBuq8C0_l71nxffMfu3utlLPo8U",
  authDomain: "home-35bf5.firebaseapp.com",
  databaseURL: "https://home-35bf5-default-rtdb.firebaseio.com",
  projectId: "home-35bf5",
  storageBucket: "home-35bf5.firebasestorage.app",
  messagingSenderId: "32441351423",
  appId: "1:32441351423:web:871e1ec61ca016d8c2a0ca",
  measurementId: "G-Z524PJ55Q2"
};

let firebaseDb = null;
let firestoreDb = null;
let firebaseSyncReady = false;
let suppressNextFirebaseWrite = false;

function setFirebaseBadge(text, color = '#86efac') {
  const el = document.getElementById('firebaseSyncBadge');
  if (el) {
    el.textContent = text;
    el.style.color = color;
  }
}

function applyRemotePlatformStore(remoteData, sourceLabel = 'Firebase') {
  const normalized = {
    schools: Array.isArray(remoteData.schools) ? remoteData.schools : Object.values(remoteData.schools || {}),
    match_requests: Array.isArray(remoteData.match_requests) ? remoteData.match_requests : Object.values(remoteData.match_requests || {}),
    classrooms: Array.isArray(remoteData.classrooms) ? remoteData.classrooms : Object.values(remoteData.classrooms || {}),
    posts: Array.isArray(remoteData.posts) ? remoteData.posts : Object.values(remoteData.posts || {}),
    research_data: Array.isArray(remoteData.research_data) ? remoteData.research_data : Object.values(remoteData.research_data || {}),
    canvas_cards: Array.isArray(remoteData.canvas_cards) ? remoteData.canvas_cards : Object.values(remoteData.canvas_cards || {}),
    achievements: Array.isArray(remoteData.achievements) ? remoteData.achievements : Object.values(remoteData.achievements || {}),
    news: Array.isArray(remoteData.news)
      ? remoteData.news
      : remoteData.news
        ? Object.values(remoteData.news)
        : JSON.parse(JSON.stringify(INITIAL_STORE.news))
  };

  normalized.schools = normalized.schools.map((s) => ({
    ...s,
    interests: Array.isArray(s.interests) ? s.interests : Object.values(s.interests || {})
  }));
  normalized.posts = normalized.posts.map((p) => ({
    ...p,
    replies: Array.isArray(p.replies) ? p.replies : Object.values(p.replies || {})
  }));

  suppressNextFirebaseWrite = true;
  try {
    localStorage.setItem('bayt_platform_db_v2', JSON.stringify(normalized));
  } catch (e) {}
  suppressNextFirebaseWrite = false;

  firebaseSyncReady = true;
  setFirebaseBadge(`🟢 متصل بـ ${sourceLabel} (مزامنة فورية للبيانات)`);

  loadPlatformStats();
  loadAllSchools(activeDashboardSchool ? activeDashboardSchool.id : null);
  loadAchievements();
  renderHeroNewsFeed(activeHeroNewsFilter);
  if (activeClassroomData && activeClassroomData.classroom) {
    fetchClassroomById(activeClassroomData.classroom.id);
  }
  if (window.isAdminLoggedIn) {
    renderAdminDashboard();
  }
}

function initFirebaseRealtimeSync() {
  if (typeof firebase === 'undefined') {
    setFirebaseBadge('💾 وضع التخزين المحلي (تعذر تحميل Firebase SDK)', '#fcd34d');
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    try {
      if (typeof firebase.analytics === 'function') {
        firebase.analytics();
      }
    } catch (analyticsErr) {}

    // 1. Primary Cloud Database: Cloud Firestore (bayt_platform / main_store)
    if (typeof firebase.firestore === 'function') {
      firestoreDb = firebase.firestore();
      const storeDocRef = firestoreDb.collection('bayt_platform').doc('main_store');

      storeDocRef.onSnapshot(
        (docSnap) => {
          if (docSnap.exists) {
            applyRemotePlatformStore(docSnap.data(), 'Cloud Firestore');
          } else {
            const initialSeed = JSON.parse(JSON.stringify(getLocalStore()));
            firebaseSyncReady = true;
            storeDocRef
              .set(initialSeed)
              .then(() => {
                setFirebaseBadge('🟢 متصل بـ Cloud Firestore (تمت تهيئة البيانات السحابية بنجاح)');
              })
              .catch((err) => {
                console.warn('Firestore initial seed error:', err);
                setFirebaseBadge('⚠️ متصل بـ Firestore — يرجى تفعيل Rules للكتابة', '#fcd34d');
              });
          }
        },
        (error) => {
          console.warn('Firestore listener error:', error);
          setFirebaseBadge('⚠️ تعذرت القراءة من Firestore (تأكد من Rules في تبويب Firestore)', '#fca5a5');
        }
      );

      // Sync Admin credentials in Firestore
      firestoreDb
        .collection('bayt_platform')
        .doc('admin_creds')
        .onSnapshot((snap) => {
          if (snap.exists) {
            try {
              localStorage.setItem('bayt_admin_creds_v1', JSON.stringify(snap.data()));
            } catch (e) {}
          }
        });
    }

    // 2. Secondary mirror: only use Realtime Database when Firestore is unavailable
    if (!firestoreDb && typeof firebase.database === 'function') {
      firebaseDb = firebase.database();
      firebaseDb.ref('bayt_platform_db_v2').on('value', (snapshot) => {
        if (snapshot.exists()) {
          applyRemotePlatformStore(snapshot.val(), 'Realtime Database');
        }
      });
    }
  } catch (err) {
    console.warn('Firebase initialization failed:', err);
    setFirebaseBadge('💾 وضع التخزين المحلي (خطأ في تهيئة Firebase)', '#fca5a5');
  }
}

function saveLocalStore(store) {
  try {
    localStorage.setItem('bayt_platform_db_v2', JSON.stringify(store));
  } catch (e) {}

  if (!suppressNextFirebaseWrite) {
    try {
      const cleanPayload = JSON.parse(JSON.stringify(store));
      if (firestoreDb) {
        firestoreDb
          .collection('bayt_platform')
          .doc('main_store')
          .set(cleanPayload)
          .catch((err) => console.warn('Firestore write failed:', err));
      } else if (firebaseDb) {
        firebaseDb
          .ref('bayt_platform_db_v2')
          .set(cleanPayload)
          .catch(() => {});
      }
    } catch (e) {}
  }
}

// Complete Bilingual Dictionary
const I18N = {
  ar: {
    header_tagline: 'من اللقاء العابر إلى الشراكة المستدامة',
    nav_home: '🏠 الصفحة الرئيسية',
    nav_home_back: 'الصفحة الرئيسية',
    nav_vision: 'رؤيتنا',
    nav_goals: 'أهدافنا',
    nav_how: 'كيف نعمل',
    nav_students: '🧑‍🎓 مساحة الطلاب',
    nav_login_school: '🔑 دخول مدرسة مسجلة',
    nav_register_school: '➕ تسجيل مدرسة جديدة',
    hero_badge: 'جسر رقمي وتربوي ذكي بين المدارس العربية واليهودية',
    hero_headline: '"لكل إنسان بيت، ولكل بيت حكاية، ومن حكاياتنا نبني بيتًا مشتركًا"',
    hero_sublead:
      'نعيد صياغة العلاقة بين الطلاب والمدارس في المجتمعين العربي واليهودي عبر الانتقال الجذري من مفهوم "الضيف والمضيف" إلى مفهوم "أصحاب البيت الواحد" — في حيز آمن ومتساوٍ يجمع بين الفضول المعرفي، الحوار الصادق، والبحث العلمي المشترك.',
    btn_login_existing_school: 'تسجيل دخول لمدرسة مسجلة | כניסה לבית ספר רשום',
    btn_register_new_school: 'تسجيل جديد لمدرسة جديدة | רישום בית ספר חדש',
    btn_register_school: 'سجّل مدرستك الآن',
    btn_enter_student_space: 'دخول مساحة الطلاب',
    pill_ai_matching: 'مطابقة ذكية وفلترة يدوية للمدارس',
    pill_instant_trans: 'ترجمة فورية ذكية (عربي ↔ עברית)',
    pill_joint_research: 'مختبرات بحث علمي وتراثي مشترك',
    live_news_badge: '📡 أخبار المنصة المباشرة | מבזקי חדשות ועדכוני האתר',
    news_card_cta: '🏫 انضم بمدرستك إلى شبكة "بَيْت | בַּיִת" الآن ←',
    live_model_badge: 'نموذج حي لأصحاب البيت الواحد',
    arab_school_tag: 'مدرسة عربية',
    jewish_school_tag: 'مدرسة يهودية',
    try_live_classroom: '✨ جرّب دخول هذه الغرفة المشتركة الآن (رمز: BAYT-2026) ←',
    vision_eyebrow: 'الرؤية التربوية والإنسانية | החזון החינוכי והאנושי',
    vision_title: 'من مفهوم "الضيف والمضيف" إلى "أصحاب البيت الواحد"',
    vision_text:
      'ينطلق مشروع "بَيْت" من إيمان عميق بأن غياب الشراكة الحقيقية غالباً ما يبدأ من عائق تقني وتنظيمي يحول دون وصول المدارس إلى الشريك المناسب. لذا بنينا جسراً رقمياً وتربوياً ذكياً يجمع المدارس المتقاربة جغرافياً وفكرياً في حيز آمن ومتساوٍ.',
    old_model_badge: 'النموذج التقليدي السابق',
    old_model_title: 'الضيف والمضيف | אורח ומארח',
    old_point_1: 'زيارات متبادلة عابرة ومناسباتية تنتهي بانتهاء اليوم.',
    old_point_2: 'شعور أحد الطرفين بأنه "ضيف" مؤقت والآخر "مضيف" غير متكافئ.',
    old_point_3: 'تعارف سطحي يعيقه حاجز اللغة وغياب المتابعة التربوية.',
    old_point_4: 'صعوبة تقنية وتنظيمية في إيجاد المدرسة الشريكة المناسبة.',
    new_model_badge: 'نموذج "بَيْت | בַּיִת" المستدام',
    new_model_title: 'شركاء البيت الواحد | שותפים לבית אחד',
    new_point_1: 'مسار تعليمي وبحثي مستمر يمتد على مدار العام الدراسي (رقمي + ميداني).',
    new_point_2: 'ملكية مشتركة متساوية للغرفة البحثية والمخرجات العلمية والمجتمعية.',
    new_point_3: 'تعبير حر باللغة الأم مع ترجمة فورية ذكية تزيل الحواجز اللغوية تماماً.',
    new_point_4: 'خوارزمية ملاءمة ذكية + اختيار يدوي شفاف للمدارس غير المقترنة بعد.',
    goals_eyebrow: 'أهدافنا الاستراتيجية | מטרות הפרויקט',
    goals_title: 'خمس ركائز لصناعة حياة مشتركة قائمة على الاحترام والمساواة',
    goal_1_title: 'مسار تعليمي مستمر طوال العام',
    goal_1_desc: 'تحويل الشراكة من مجرد زيارات متبادلة عابرة إلى مسار تعليمي مستمر يمتد على مدار العام الدراسي، يدمج بين التواصل الرقمي واللقاءات الميدانية.',
    goal_2_title: 'التعبير باللغة الأم وترجمة فورية ذكية',
    goal_2_desc: 'تمكين الطلاب من التعبير عن أنفسهم بلغتهم الأم بحرية وثقة، مع توفير أدوات ترجمة فورية ذكية داخل المنصة تتيح فهماً متبادلاً دون حواجز لغوية.',
    goal_3_title: 'فرق بحثية طلابية لقضايا واقعية',
    goal_3_desc: 'إشراك طلاب المدرستين في فرق بحثية مشتركة لمعالجة قضايا واقعية تهم مجتمعاتهم (كالبيئة، التراث، العلوم، والمجتمع)، مما ينمي التفكير النقدي والعمل الجماعي.',
    goal_4_title: 'مجتمع مهني داعم للمدراء والمعلمين',
    goal_4_desc: 'خلق مجتمع مهني داعم للمدراء والمعلمين من كلا المجتمعين لتبادل الخبرات التربوية، التخطيط المشترك، وتطوير مبادرات تعليمية مبتكرة.',
    goal_5_title: 'منصة رقمية ذكية للملاءمة (AI Matching) والاختيار المرن',
    goal_5_desc: 'توفير منصة رقمية ذكية تعتمد على خوارزميات الملاءمة لربط المدارس العربية واليهودية بسهولة بناءً على القرب الجغرافي، المرحلة العمرية، والاهتمامات التربوية المشتركة، مع إتاحة البحث اليدوي وتمييز المدارس التي لم تقترن بعد.',
    how_eyebrow: 'مسار العمل خطوة بخطوة | איך זה עובד?',
    how_title: 'كيف تنتقل مدرستكم إلى شراكة "بَيْت | בַּיִת"؟',
    step_1_title: 'التسجيل وتحديد الاحتياجات',
    step_1_desc: 'تسجل المدرسة وتعبئ استمارة الاحتياجات، المرحلة العمرية، الاهتمامات المشتركة، ونوع النشاط المفضل.',
    step_1_action: 'افتح استمارة التسجيل ←',
    step_2_title: 'المطابقة الذكية والاختيار اليدوي',
    step_2_desc: 'يقوم النظام باقتراح الشريك الأنسب جغرافياً وتربوياً، مع إمكانية الاختيار والفرز اليدوي حسب خصائص المدارس، ويقوم الموقع بتمييز المدارس التي لم تقترن بعد بوضوح (טרם שודכו).',
    step_2_action: 'استعرض اقتراحات الشراكة ←',
    step_3_title: 'اللقاء والعمل البحثي المشترك',
    step_3_desc: 'عند موافقة الطرفين، تُنشأ "الغرفة المشتركة" ويحصل الطلاب على رمز دخول آمن للمنتدى المترجم ومختبر البحث التعاوني.',
    step_3_action: 'ادخل مساحة الطلاب ←',
    stat_schools: 'مدرسة عربية ويهودية مسجلة',
    stat_unmatched: 'مدارس متاحة للتوأمة الفورية (טרם שודכו)',
    stat_students: 'طالب وطالبة في المساحات المشتركة',
    stat_projects: 'مشاريع بحثية ومبادرات منجزة',
    wall_eyebrow: 'جدار الإنجازات المشترك | קיר ההישגים המשותף',
    wall_title: 'مخرجات بحثية وإبداعية صنعها طلابنا معاً',
    view_all_achievements: 'استعراض المعرض الرقمي الكامل ←',
    portal_badge: 'قسم مدراء المدارس ومركزي التربية الاجتماعية | מתחם מנהלים ורכזים',
    portal_title: 'بوابة التسجيل والمطابقة الذكية (AI Matching & Manual Selection)',
    portal_subtitle: 'سجّل مدرستك أو اختر إحدى المدارس المسجلة لاستعراض اقتراحات التوأمة الذكية، الفلترة اليدوية، وإنشاء الغرفة المشتركة.',
    tab_school_dashboard: 'لوحة تحكم المدرسة والمطابقة | לוח בקרה והתאמה',
    tab_new_registration: 'تسجيل مدرسة جديدة | רישום בית ספר חדש',

    // Registration Form Full Bilingual Keys
    reg_form_title: 'استمارة تسجيل مدرسة جديدة في شبكة "بَيْت | בַּיִת" | טופס רישום בית ספר חדש',
    reg_form_desc: 'أجب على أسئلة المدرسة والاهتمامات التربوية واختر الإيميل (اسم المستخدم) ورمز الدخول الدائم لموقعك ليقوم النظام باقتراح أفضل المدارس الشريكة جغرافياً وفكرياً | מלאו את שאלון בית הספר ובחרו אימייל וקוד כניסה קבוע לאתר.',
    reg_sec_account: '🔐 أولاً: إعداد حساب دخول المدرسة (الإيميل كاسم مستخدم + رمز الدخول الدائم للموقع) | הגדרת חשבון הכניסה של בית הספר (אימייל כשם משתמש + קוד כניסה)',
    reg_access_code_hint: 'أدخل البريد الإلكتروني الذي ترغب أن يكون اسم المستخدم الدائم للمدرسة، واختر رمز دخول / كلمة مرور خاصة بك لتستطيع المدرسة دائماً الرجوع إلى حسابها، أو استرداد كلمة المرور عبر هذا الإيميل في حال نسيانها.',
    lbl_username_email: '📧 البريد الإلكتروني المعتمد كاسم مستخدم للمدرسة (Username Email) | האימייל שישמש כשם המשתמש של בית הספר *',
    lbl_choose_access_code: '🔑 اختر رمز الدخول / كلمة المرور للموقع | בחרו קוד כניסה / סיסמה לאתר *',
    lbl_confirm_access_code: '🔒 تأكيد رمز الدخول / كلمة المرور | אימות קוד כניסה / סיסמה *',
    reg_sec_basic: '1. معلومات المدرسة الأساسية | פרטי בית הספר הבסיסיים',
    lbl_school_name: 'اسم المدرسة | שם בית הספר *',
    ph_school_name: 'مثال: مدرسة الحكمة الثانوية / תיכון אל-חכמה',
    lbl_school_city: 'الموقع الجغرافي (البلدة / المدينة) | מיקום גיאוגרפי (יישוב / עיר) *',
    ph_school_city: 'مثال: الناصرة، حيفا، العفولة... / נצרת, חיפה, עפולה...',
    lbl_sector: 'القطاع التعليمي | מגזר חינוכי *',
    sector_arab: 'عربي | ערבי',
    sector_jewish_state: 'يهودي حكومي | יהודי ממלכתי',
    sector_jewish_rel: 'يهودي ديني | יהודי ממלכתי-דתי',
    sector_bilingual: 'ثنائي اللغة / مشترك | דו-לשוני',
    lbl_age_stage: 'المرحلة العمرية والصفوف المستهدفة | שכבת גיל וכיתות יעד *',
    stage_elementary: 'ابتدائي | יסודי',
    stage_middle: 'إعدادي | חטיבת ביניים',
    stage_high: 'ثانوي | תיכון',
    ph_grades: 'الصفوف / כיתות: 8-9',
    reg_sec_interests: '2. الاهتمامات والمجالات التربوية المشتركة | תחומי עניין משותפים',
    int_science_env: 'علوم وبيئة | מדעים וסביבה',
    int_lit_lang: 'آداب ولغات | ספרות ושפות',
    int_history_heritage: 'تاريخ وتراث | היסטוריה ומורשת',
    int_arts_music: 'فنون وموسيقى | אמנות ומוזיקה',
    int_social_ent: 'ريادة أعمال مجتمعية | יזמות חברתית',
    reg_sec_activity: '3. نوع النشاط المفضل ونبذة عن المدرسة | אופי הפעילות המועדף ותיאור בית הספר',
    lbl_activity_type: 'نوع النشاط المفضل | אופי הפעילות המועדף *',
    act_hybrid: 'هجين: لقاءات رقمية + جولات ميدانية | היברידי: מפגשים דיגיטליים + סיורי שטח',
    act_research: 'مشاريع بحثية مشتركة | פרויקטי מחקר משותפים',
    act_online: 'عبر الإنترنت فقط | מקוון בלבד',
    lbl_school_bio: 'نبذة قصيرة عن رؤية المدرسة للشراكة | תיאור קצר של חזון בית הספר לשותפות',
    ph_school_bio: 'نطمح لبناء شراكة بحثية وإنسانية مستدامة... | שואפים לבנות שותפות מחקרית וערכית...',
    reg_sec_contact: '4. شخص التواصل المسؤول | פרטי איש קשר',
    lbl_contact_name: 'الاسم الكامل | שם מלא *',
    ph_contact_name: 'مثال: د. ريم جبارين / יעל לוי',
    lbl_contact_role: 'الوظيفة | תפקיד *',
    role_principal: 'مدير/ة المدرسة | מנהל/ת בית הספר',
    role_social_coord: 'مركز/ة تربية اجتماعية | רכז/ת חינוך חברתי',
    role_proj_coord: 'مركز/ة مشاريع مشتركة | רכז/ת פרויקטים משותפים',
    lbl_contact_email: 'البريد الإلكتروني المدرسي | דוא"ל בית ספרי *',
    lbl_contact_phone: 'رقم الهاتف | מספר טלפון *',
    btn_submit_registration: 'حفظ التسجيل والانتقال لاقتراحات المطابقة الذكية | שמירת הרשמה ומעבר להצעות התאמה',

    // Dashboard & Filters
    lbl_active_school_view: '🏫 المدرسة الحالية في لوحة التحكم | בית הספר הפעיל:',
    matches_heading: '🤖 اقتراحات الشراكة الذكية والاختيار اليدوي (AI Matches & Manual Filter)',
    matches_subheading: 'يرتب النظام المدارس تلقائياً حسب درجة الملاءمة (المسافة الجغرافية، المرحلة العمرية، الاهتمامات المشتركة)، ويمكنك الفلترة يدوياً حسب خصائص المدرسة أو إظهار المدارس التي لم تقترن بعد فقط.',
    filter_only_unmatched: 'إظهار المدارس التي لم تقترن بعد فقط (טרם שודכו בלבד)',
    filter_sector_lbl: 'القطاع | מגזר',
    opt_all_sectors: 'جميع القطاعات | כל המגזרים',
    opt_cross_sector: 'شراكة عربية-يهودية | שותפות ערבית-יהודית',
    filter_stage_lbl: 'المرحلة العمرية | שכבת גיל',
    opt_all_stages: 'جميع المراحل | כל השכבות',
    filter_interest_lbl: 'الاهتمام المشترك | תחום עניין',
    opt_all_interests: 'جميع المجالات | כל התחומים',
    filter_activity_lbl: 'نوع النشاط | אופי פעילות',
    opt_all_activities: 'جميع الأنشطة | כל הפעילויות',

    // Student Login & Workspace
    student_login_title: 'مساحة الطلاب والتعلم المشترك | מרחב התלמידים והלמידה המשותפת',
    student_login_desc: 'أدخل الرمز المخصص الذي وفرته لك مدرستك للدخول إلى لوحة الصف المشترك، منتدى "نتحدث معاً" المزود بالترجمة الفورية، ومختبر البحث العلمي.',
    lbl_access_code: 'رمز الغرفة المشتركة | קוד החדר המשותף *',
    lbl_student_nickname: 'اسمك الأول | שמך הפרטי *',
    lbl_student_side: 'اختر مدرستك في الشراكة | בחרו את בית הספר שלכם',
    opt_side_a: 'المدرسة الشريكة (أ) - العربية | בית ספר שותף (א׳) - ערבי',
    opt_side_b: 'المدرسة الشريكة (ب) - اليهودية | בית ספר שותף (ב׳) - יהודי',
    quick_codes_label: '🔑 رموز غرف نشطة للتجربة السريعة | קודי חדרים פעילים להתנסות:',
    btn_enter_classroom_now: 'دخول لوحة الصف المشترك الآن | כניסה לכיתה המשותפת כעת',
    btn_switch_code: 'تغيير الرمز / الحساب | החלפת קוד',
    lbl_joint_research_topic: '🔬 موضوع البحث المشترك | נושא המחקר המשותף:',
    ws_tab_forum: 'المنتدى التفاعلي "نتحدث معاً" (ترجمة فورية) | פורום "מדברים יחד"',
    ws_tab_lab: 'مختبر البحث والعمل المشترك | מעבדת המחקר המשותפת',
    ws_tab_wall: 'جدار الإنجازات (المعرض الرقمي) | קיר ההישגים',
    icebreakers_title: '🧊 مواضيع لكسر الجليد | נושאים לשבירת הקרח',
    icebreakers_hint: 'بإشراف المعلمين — اختر موضوعاً للنقاش والتعارف:',
    cat_all: 'جميع النقاشات | כל הדיונים',
    cat_self_intro: 'تعريف بالنفس | הצגה עצמית',
    cat_hobbies: 'هواياتنا | התחביבים שלנו',
    cat_food: 'أكلتنا المفضلة | המאכל האהוב',
    cat_holidays: 'أعيادنا ومناسباتنا | חגים ומועדים',
    trans_explainer_text: 'اكتب بلغتك الأم (العربية أو العبرية) بحرية وثقة! سيقوم النظام بترجمة رسالتك فوراً لزميلك في المدرسة الشريكة بضغطة زر لكسر حاجز اللغة تماماً.',
    composer_title: '✍️ شارك في حوار "نتحدث معاً | מדברים יחד"',
    supervised_badge: '🛡️ بإشراف المعلمين | בפיקוח מורים',
    btn_preview_translation: 'معاينة الترجمة الفورية قبل النشر | תצוגה מקדימה של התרגום',
    composer_tip: 'تُحفظ الرسالة باللغتين تلقائياً ليتمكن زملاؤك من قراءتها بلغتهم.',
    btn_publish_post: 'نشر المشاركة في المنتدى | פרסום בפורום',
    lab_data_title: '📂 1. مشاركة المعطيات الميدانية | שיתוף נתוני שדה',
    lab_data_desc: 'يرفع الطلاب صوراً، مقابلات مع كبار السن، أو قياسات علمية من بلداتهم لمقارنتها.',
    btn_upload_data: 'رفع معطى جديد | העלאת נתון חדש',
    btn_save_data: 'حفظ ومشاركة مع الفريق | שמירה ושיתוף',
    lab_mentor_title: '🤖 3. المرشد البحثي الذكي | המנטור המחקרי החכם',
    lab_mentor_desc: 'يقدم نصائح وأفكاراً للطلاب باللغتين حول كيفية تطوير بحثهم المشترك.',
    btn_ask_mentor: 'اطلب نصيحة | בקשו עצה',
    lab_canvas_title: '📌 2. لوحة العمل التعاوني المشترك | לוח עבודה שיתופי',
    lab_canvas_desc: 'مساحة Padlet تفاعلية لترتيب الأفكار، الفرضيات، خطوات العمل الميداني، وصياغة توصيات البحث معاً باللغتين.',
    col_ideas: 'أفكار وفرضيات | רעיונות והשערות',
    col_field: 'العمل الميداني | עבודת שדה',
    col_drafting: 'صياغة البحث | כתיבת המחקר',
    col_conclusions: 'النتائج والتوصيات | מסקנות והמלצות',
    btn_add_card: '+ إضافة بطاقة | הוספת כרטיס',
    wall_full_title: '🏆 جدار الإنجازات المشترك | קיר ההישגים המשותף',
    wall_full_desc: 'معرض رقمي يعرض النتائج النهائية للأبحاث المشتركة (فيديو، عروض تقديمية، خرائط تفاعلية، ومجسمات) لجميع الطلاب والمدارس في المنصة للاستلهام منها.',
    footer_about: 'منصة رقمية وتربوية لبناء شراكات مستدامة بين المدارس العربية واليهودية: من اللقاء العابر إلى أصحاب البيت الواحد.',
    footer_nav_title: 'أقسام المنصة | מדורי הפלטפורמה',
    footer_partners_title: 'شركاء الرؤية والتواصل | יצירת קשר',
    footer_legal: 'جميع الحقوق محفوظة © 2026 مشروع "بَيْت | בַּיִת" • سياسة الخصوصية وأمان الطلاب'
  },
  he: {
    header_tagline: 'ממפגש חולף לשותפות בת-קיימא',
    nav_home: '🏠 דף הבית',
    nav_home_back: 'דף הבית',
    nav_vision: 'החזון שלנו',
    nav_goals: 'מטרות הפרויקט',
    nav_how: 'איך זה עובד',
    nav_students: '🧑‍🎓 מרחב התלמידים',
    nav_login_school: '🔑 כניסה לבית ספר רשום',
    nav_register_school: '➕ רישום בית ספר חדש',
    hero_badge: 'גשר דיגיטלי וחינוכי חכם בין בתי ספר ערביים ויהודיים',
    hero_headline: '"לכל אדם יש בית, ולכל בית יש סיפור – ומהסיפורים שלנו אנו בונים בית משותף"',
    hero_sublead:
      'אנו מעצבים מחדש את הקשר בין תלמידים ובתי ספר בחברה הערבית והיהודית באמצעות מעבר שורשי מתפיסת "אורח ומארח" לתפיסת "שותפים לבית אחד" במרחב בטוח ושוויוני המשלב סקרנות מדעית, שיח כן ומחקר משותף.',
    btn_login_existing_school: 'כניסה לבית ספר רשום | تسجيل دخول لمدرسة مسجلة',
    btn_register_new_school: 'רישום בית ספר חדש | تسجيل جديد لمدرسة جديدة',
    btn_register_school: 'רשמו את בית הספר עכשיו',
    btn_enter_student_space: 'כניסה למרחב התלמידים',
    pill_ai_matching: 'התאמה חכמה וסינון ידני של בתי ספר',
    pill_instant_trans: 'תרגום מיידי חכם (עברית ↔ عربي)',
    pill_joint_research: 'מעבדות מחקר מדעי ומורשתי משותף',
    live_news_badge: '📡 מבזקי חדשות ועדכוני הפלטפורמה | أخبار المنصة المباشرة',
    news_card_cta: '🏫 הצטרפו עם בית ספרכם לרשת "בַּיִת | بَيْت" כעת ←',
    live_model_badge: 'מודל חי לשותפים לבית אחד',
    arab_school_tag: 'בית ספר ערבי',
    jewish_school_tag: 'בית ספר יהודי',
    try_live_classroom: '✨ נסו להיכנס לחדר המשותף כעת (קוד: BAYT-2026) ←',
    vision_eyebrow: 'החזון החינוכי והאנושי | الرؤية التربوية والإنسانية',
    vision_title: 'מתפיסת "אורח ומארח" ל"שותפים לבית אחד"',
    vision_text:
      'פרויקט "בַּיִת | بَيْت" יוצא מתוך אמונה כי היעדר שותפות אמיתית מתחיל לרוב בחסם טכני וארגוני המונע מבתי ספר להגיע לשותף המתאים. לכן בנינו גשר דיגיטלי חכם המחבר בין בתי ספר קרובים גיאוגרפית וערכית.',
    old_model_badge: 'המודל המסורתי הקודם',
    old_model_title: 'אורח ומארח | الضيف والمضيف',
    old_point_1: 'ביקורים חד-פעמיים וחולפים המסתיימים בסוף היום.',
    old_point_2: 'תחושה של צד אחד כ"אורח" זמני והשני כ"מארח" לא שוויוני.',
    old_point_3: 'היכרות שטחית הנחסמת על ידי מחסום השפה והיעדר המשכיות.',
    old_point_4: 'קושי טכני וארגוני באיתור בית הספר השותף המתאים.',
    new_model_badge: 'מודל "בַּיִת | بَيْت" המתמשך',
    new_model_title: 'שותפים לבית אחד | شركاء البيت الواحد',
    new_point_1: 'מסלול חינוכי ומחקרי מתמשך לאורך כל שנת הלימודים (דיגיטלי + מפגשי שטח).',
    new_point_2: 'בעלות משותפת ושוויונית על חדר המחקר והתוצרים המדעיים והחברתיים.',
    new_point_3: 'ביטוי חופשי בשפת האם עם תרגום מיידי חכם המסיר לחלוטין את מחסום השפה.',
    new_point_4: 'אלגוריתם התאמה חכם + בחירה ידנית שקופה וסימון בתי ספר שטרם שודכו.',
    goals_eyebrow: 'מטרות הפרויקט | أهدافنا الاستراتيجية',
    goals_title: 'חמישה עמודי תווך ליצירת חיים משותפים המבוססים על כבוד ושוויון',
    goal_1_title: 'מסלול לימודי מתמשך לאורך השנה',
    goal_1_desc: 'הפיכת השותפות מביקורים חולפים למסלול חינוכי שנתי המשלב תקשורת דיגיטלית ומפגשי שטח.',
    goal_2_title: 'ביטוי בשפת האם ותרגום מיידי חכם',
    goal_2_desc: 'מתן אפשרות לתלמידים להתבטא בשפת אמם בביטחון, עם כלי תרגום מיידי חכם המאפשר הבנה הדדית ללא מחסומי שפה.',
    goal_3_title: 'צוותי מחקר משותפים לסוגיות מהחיים',
    goal_3_desc: 'שילוב תלמידי שני בתי הספר בצוותי מחקר משותפים בנושאי סביבה, מורשת, מדע וחברה לפיתוח חשיבה ביקורתית ועבודת צוות.',
    goal_4_title: 'קהילה מקצועית תומכת למנהלים ולמורים',
    goal_4_desc: 'יצירת קהילה מקצועית למנהלים ורכזים משתי החברות להחלפת ניסיון פדגוגי, תכנון משותף ופיתוח יוזמות חינוכיות.',
    goal_5_title: 'פלטפורמת התאמה חכמה (AI Matching) ובחירה ידנית',
    goal_5_desc: 'חיבור קל בין בתי ספר ערביים ויהודיים על בסיס קרבה גיאוגרפית, שכבת גיל ותחומי עניין משותפים, לצד אפשרות לבחירה ידנית וסימון בתי ספר שטרם שודכו.',
    how_eyebrow: 'איך זה עובד צעד אחר צעד?',
    how_title: 'כיצד מצטרפים לשותפות ב"בַּיִת | بَيْت"?',
    step_1_title: 'הרשמה ומיפוי צרכים',
    step_1_desc: 'בית הספר נרשם וממלא שאלון מאפיינים, שכבת גיל, תחומי עניין ואופי הפעילות המועדף.',
    step_1_action: 'פתחו טופס הרשמה ←',
    step_2_title: 'התאמה חכמה ובחירה ידנית',
    step_2_desc: 'המערכת מציעה את השותף המתאים ביותר גיאוגרפית וחינוכית, ואפשר לבחור באופן ידני מבחינת המאפיינים של בתי הספר וכמובן האתר מסמן את בתי הספר שטרם שודכו עם בתי ספר אחרים.',
    step_2_action: 'צפו בהצעות השידוך ←',
    step_3_title: 'מפגש ועבודת חקר משותפת',
    step_3_desc: 'לאחר אישור הדדי נפתח "החדר המשותף" והתלמידים מקבלים קוד כניסה בטוח לפורום המתורגם ולמעבדת המחקר.',
    step_3_action: 'היכנסו למרחב התלמידים ←',
    stat_schools: 'בתי ספר ערביים ויהודיים רשומים',
    stat_unmatched: 'בתי ספר פנויים לשידוך מיידי (טרם שודכו)',
    stat_students: 'תלמידים ותלמידות במרחבים המשותפים',
    stat_projects: 'פרויקטי מחקר ויוזמות משותפות',
    wall_eyebrow: 'קיר ההישגים המשותף | جدار الإنجازات المشترك',
    wall_title: 'תוצרים מחקריים ויצירתיים שהתלמידים שלנו בנו יחד',
    view_all_achievements: 'לגלריה הדיגיטלית המלאה ←',
    portal_badge: 'מתחם מנהלי בתי ספר ורכזי חינוך חברתי | قسم المدراء والمركزين',
    portal_title: 'פורטל רישום והתאמה חכמה (AI Matching & Manual Selection)',
    portal_subtitle: 'רשמו את בית ספרכם או בחרו בית ספר רשום כדי לצפות בהצעות שידוך חכמות, לסנן ידנית לפי מאפיינים וליצור חדר משותף.',
    tab_school_dashboard: 'לוח בקרה והתאמת בתי ספר | لوحة التحكم',
    tab_new_registration: 'רישום בית ספר חדש | تسجيل مدرسة جديدة',

    // Registration Form Full Hebrew Keys
    reg_form_title: 'טופס רישום בית ספר חדש לרשת "בַּיִת | بَيْت" | استمارة تسجيل مدرسة جديدة',
    reg_form_desc: 'בחרו אימייל (שם משתמש לבית הספר) וקוד כניסה קבוע לאתר, ומלאו את פרטי בית הספר ותחומי העניין החינוכיים.',
    reg_sec_account: '🔐 תחילה: הגדרת חשבון הכניסה של בית הספר (אימייל כשם משתמש + קוד כניסה קבוע) | إعداد حساب دخول المدرسة',
    reg_access_code_hint: 'הזינו את כתובת האימייל שתשמש כשם המשתמש הקבוע של בית הספר, ובחרו קוד כניסה / סיסמה לאתר (ניתן לשחזר את הקוד לאימייל זה בכל עת).',
    lbl_username_email: '📧 האימייל שישמש כשם המשתמש של בית הספר (Username Email) | البريد الإلكتروني كاسم مستخدم للمدرسة *',
    lbl_choose_access_code: '🔑 בחרו קוד כניסה / סיסמה לאתר | اختر رمز الدخول / كلمة المرور *',
    lbl_confirm_access_code: '🔒 אימות קוד כניסה / סיסמה | تأكيد رمز الدخول / كلمة المرور *',
    reg_sec_basic: '1. פרטי בית הספר הבסיסיים | معلومات المدرسة الأساسية',
    lbl_school_name: 'שם בית הספר (בעברית או בערבית) | اسم المدرسة *',
    ph_school_name: 'לדוגמה: תיכון אל-חכמה / מקיף כרמים',
    lbl_school_city: 'מיקום גיאוגרפי (יישוב / עיר) | البلدة / المدينة *',
    ph_school_city: 'לדוגמה: נצרת, חיפה, עפולה, טירה...',
    lbl_sector: 'מגזר חינוכי | القطاع التعليمي *',
    sector_arab: 'ערבי | عربي',
    sector_jewish_state: 'יהודי ממלכתי | يهودي حكومي',
    sector_jewish_rel: 'יהודי ממלכתי-דתי (ממ"ד) | يهودي ديني',
    sector_bilingual: 'דו-לשוני / משותף | ثنائي اللغة',
    lbl_age_stage: 'שכבת גיל וכיתות יעד | المرحلة العمرية والصفوف *',
    stage_elementary: 'יסודי | ابتدائي',
    stage_middle: 'חטיבת ביניים | إعدادي',
    stage_high: 'תיכון | ثانوي',
    ph_grades: 'כיתות: ח׳-ט׳ (8-9)',
    reg_sec_interests: '2. תחומי עניין ומגמות משותפות | الاهتمامات والمجالات التربوية المشتركة',
    int_science_env: 'מדעים וסביבה | علوم وبيئة',
    int_lit_lang: 'ספרות ושפות | آداب ولغات',
    int_history_heritage: 'היסטוריה ומורשת | تاريخ وتراث',
    int_arts_music: 'אמנות ומוזיקה | فنون وموسيقى',
    int_social_ent: 'יזמות חברתית | ريادة أعمال مجتمعية',
    reg_sec_activity: '3. אופי הפעילות המועדף ותיאור בית הספר | نوع النشاط المفضل ونبذة عن المدرسة',
    lbl_activity_type: 'אופי הפעילות המועדף | نوع النشاط المفضل *',
    act_hybrid: 'היברידי: מפגשים דיגיטליים + סיורי שטח | هجين: رقمي + ميداني',
    act_research: 'פרויקטי מחקר משותפים | مشاريع بحثية مشتركة',
    act_online: 'מקוון בלבד (אונליין) | عبر الإنترنت فقط',
    lbl_school_bio: 'תיאור קצר של חזון בית הספר לשותפות | نبذة عن رؤية المدرسة',
    ph_school_bio: 'שואפים לבנות שותפות מחקרית וערכית בת-קיימא עם בית ספר שכן...',
    reg_sec_contact: '4. פרטי איש קשר אחראי | شخص التواصل المسؤول',
    lbl_contact_name: 'שם מלא | الاسم الكامل *',
    ph_contact_name: 'לדוגמה: יעל לוי / ד"ר רים ג׳בארין',
    lbl_contact_role: 'תפקיד בבית הספר | الوظيفة *',
    role_principal: 'מנהל/ת בית הספר | مدير/ة المدرسة',
    role_social_coord: 'רכז/ת חינוך חברתי | مركز/ة تربية اجتماعية',
    role_proj_coord: 'רכז/ת פרויקטים משותפים | مركز/ة مشاريع مشتركة',
    lbl_contact_email: 'דוא"ל בית ספרי | البريد الإلكتروني *',
    lbl_contact_phone: 'מספר טלפון | رقم الهاتف *',
    btn_submit_registration: 'שמירת הרשמה ומעבר להצעות ההתאמה החכמה | حفظ التسجيل والانتقال للمطابقة',

    // Dashboard & Filters
    lbl_active_school_view: '🏫 בית הספר הפעיל בלוח הבקרה:',
    matches_heading: '🤖 הצעות שותפות חכמות ובחירה ידנית (AI Matches & Manual Filter)',
    matches_subheading: 'המערכת מדרגת אוטומטית לפי ציון התאמה (מרחק גיאוגרפי, שכבת גיל, תחומי עניין), וניתן לסנן ידנית לפי מאפייני בתי הספר ולהציג בתי ספר שטרם שודכו.',
    filter_only_unmatched: 'הצג רק בתי ספר שטרם שודכו עם בתי ספר אחרים',
    filter_sector_lbl: 'מגזר | القطاع',
    opt_all_sectors: 'כל המגזרים (מומלץ: שותף מהחברה השנייה)',
    opt_cross_sector: 'שותפות ערבית-יהודית (דו-לאומי)',
    filter_stage_lbl: 'שכבת גיל | المرحلة العمرية',
    opt_all_stages: 'כל השכבות | جميع المراحل',
    filter_interest_lbl: 'תחום עניין משותף | الاهتمام المشترك',
    opt_all_interests: 'כל התחומים | جميع المجالات',
    filter_activity_lbl: 'אופי פעילות | نوع النشاط',
    opt_all_activities: 'כל הפעילויות | جميع الأنشطة',

    // Student Login & Workspace
    student_login_title: 'מרחב התלמידים והלמידה המשותפת | مساحة الطلاب',
    student_login_desc: 'הזינו את הקוד הייעודי שקיבלתם מבית הספר כדי להיכנס לכיתה המשותפת, לפורום "מדברים יחד" עם תרגום מיידי, ולמעבדת המחקר.',
    lbl_access_code: 'קוד החדר המשותף (Access Code) | رمز الغرفة *',
    lbl_student_nickname: 'שמך הפרטי | اسمك الأول *',
    lbl_student_side: 'בחרו את בית הספר שלכם בשותפות | اختر مدرستك',
    opt_side_a: 'בית ספר שותף (א׳) - ערבי | المدرسة العربية',
    opt_side_b: 'בית ספר שותף (ב׳) - יהודי | المدرسة اليهودية',
    quick_codes_label: '🔑 קודי חדרים פעילים להתנסות מהירה:',
    btn_enter_classroom_now: 'כניסה לכיתה המשותפת כעת | دخول الصف المشترك',
    btn_switch_code: 'החלפת קוד / משתמש',
    lbl_joint_research_topic: '🔬 נושא המחקר המשותף:',
    ws_tab_forum: 'פורום אינטראקטיבי "מדברים יחד" (תרגום מיידי)',
    ws_tab_lab: 'מעבדת מחקר ועבודה משותפת',
    ws_tab_wall: 'קיר ההישגים (גלריה דיגיטלית)',
    icebreakers_title: '🧊 נושאים לשבירת הקרח | مواضيع لكسر الجليد',
    icebreakers_hint: 'בפיקוח המורים — בחרו נושא לשיח והיכרות:',
    cat_all: 'כל הדיונים | جميع النقاشات',
    cat_self_intro: 'הצגה עצמית | تعريف بالنفس',
    cat_hobbies: 'התחביבים שלנו | هواياتنا',
    cat_food: 'המאכל האהוב | أكلتنا المفضلة',
    cat_holidays: 'חגים ומועדים | أعيادنا ومناسباتنا',
    trans_explainer_text: 'כתבו בשפת האם שלכם (עברית או ערבית) בחופשיות ובביטחון! המערכת תתרגם את ההודעה שלכם מיד לחבריכם בבית הספר השותף בלחיצת כפתור.',
    composer_title: '✍️ השתתפו בשיח "מדברים יחד | نتحدث معاً"',
    supervised_badge: '🛡️ בפיקוח מורים',
    btn_preview_translation: 'תצוגה מקדימה של התרגום המיידי',
    composer_tip: 'ההודעה נשמרת אוטומטית בשתי השפות כדי שחבריכם יוכלו לקרוא אותה בשפתם.',
    btn_publish_post: 'פרסום בפורום המשותף',
    lab_data_title: '📂 1. שיתוף נתוני שדה (Data Sharing)',
    lab_data_desc: 'התלמידים מעלים תמונות, ראיונות עם ותיקים או מדידות מדעיות מהיישובים שלהם להשוואה.',
    btn_upload_data: 'העלאת נתון חדש',
    btn_save_data: 'שמירה ושיתוף עם הצוות',
    lab_mentor_title: '🤖 3. המנטור המחקרי החכם (AI Research Mentor)',
    lab_mentor_desc: 'מעניק עצות ורעיונות לתלמידים בשתי השפות לפיתוח המחקר המשותף.',
    btn_ask_mentor: 'בקשו עצה',
    lab_canvas_title: '📌 2. לוח עבודה שיתופי (Collaborative Research Canvas)',
    lab_canvas_desc: 'מרחב Padlet אינטראקטיבי לסידור רעיונות, השערות, שלבי עבודת השדה וניסוח המלצות המחקר יחד.',
    col_ideas: 'רעיונות והשערות | أفكار وفرضيات',
    col_field: 'עבודת שדה | العمل الميداني',
    col_drafting: 'כתיבת המחקר | صياغة البحث',
    col_conclusions: 'מסקנות והמלצות | النتائج والتوصيات',
    btn_add_card: '+ הוספת כרטיס',
    wall_full_title: '🏆 קיר ההישגים המשותף (Shared Wall of Achievements)',
    wall_full_desc: 'גלריה דיגיטלית המציגה את התוצרים הסופיים של המחקרים המשותפים (וידאו, מצגות, מפות אינטראקטיביות ודגמים) להשראה.',
    footer_about: 'פלטפורמה דיגיטלית וחינוכית לבניית שותפויות בנות-קיימא בין בתי ספר ערביים ויהודיים: ממפגש חולף לשותפים לבית אחד.',
    footer_nav_title: 'מדורי הפלטפורמה',
    footer_partners_title: 'שותפים ויצירת קשר',
    footer_legal: 'כל הזכויות שמורות © 2026 פרויקט "בַּיִת | بَيْت" • פרטיות ומוגנות תלמידים'
  }
};

const INTEREST_LABELS = {
  science_env: { ar: '🌿 علوم وبيئة', he: '🌿 מדעים וסביבה' },
  lit_lang: { ar: '📚 آداب ولغات', he: '📚 ספרות ושפות' },
  history_heritage: { ar: '🏺 تاريخ وتراث', he: '🏺 היסטוריה ומורשת' },
  arts_music: { ar: '🎨 فنون وموسيقى', he: '🎨 אמנות ומוזיקה' },
  social_entrepreneurship: { ar: '🚀 ريادة أعمال مجتمعية', he: '🚀 יזמות חברתית' }
};

const SECTOR_LABELS = {
  arab: { ar: 'قطاع عربي', he: 'מגזר ערבי' },
  jewish_state: { ar: 'يهودي حكومي (ממלכתי)', he: 'יהודי ממלכתי' },
  jewish_religious: { ar: 'يهودي ديني (ממ"ד)', he: 'יהודי ממלכתי-דתי' },
  bilingual: { ar: 'ثنائي اللغة', he: 'דו-לשוני' }
};

const STAGE_LABELS = {
  elementary: { ar: 'ابتدائي', he: 'יסודי' },
  middle: { ar: 'إعدادي', he: 'חטיבת ביניים' },
  high: { ar: 'ثانوي', he: 'תיכון' }
};

const ACTIVITY_LABELS = {
  hybrid: { ar: 'هجين (رقمي + جولات ميدانية)', he: 'היברידי (דיגיטלי + סיורי שטח)' },
  research: { ar: 'مشاريع بحثية مشتركة', he: 'פרויקטי מחקר משותפים' },
  online: { ar: 'عبر الإنترنت فقط', he: 'מקוון בלבד' }
};

const CATEGORY_LABELS = {
  self_intro: { ar: '👋 تعريف بالنفس', he: '👋 הצגה עצמית' },
  hobbies: { ar: '🎸 هواياتنا', he: '🎸 התחביבים שלנו' },
  favorite_food: { ar: '🍲 أكلتنا المفضلة', he: '🍲 המאכל האהוב' },
  holidays: { ar: '🌱 أعيادنا ومناسباتنا', he: '🌱 חגים ומועדים' }
};

window.addEventListener('DOMContentLoaded', () => {
  initFirebaseRealtimeSync();
  loadPlatformStats();
  loadAllSchools();
  loadAchievements();
  renderHeroNewsFeed();
  fetchClassroomById(1);
});

function showToast(msg) {
  const el = document.getElementById('toastNotification');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    el.style.display = 'none';
  }, 4200);
}

function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'he' : 'ar';
  document.documentElement.lang = currentLang;
  document.documentElement.dir = 'rtl';

  const dict = I18N[currentLang];
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (dict[key]) {
      node.textContent = dict[key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const key = node.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      node.setAttribute('placeholder', dict[key]);
    }
  });

  const btnLabel = document.getElementById('langSwitchLabel');
  btnLabel.textContent = currentLang === 'ar' ? 'עברית ↔ عربي' : 'عربي ↔ עברית';

  populateSchoolDropdown();
  if (activeDashboardSchool) {
    renderCurrentSchoolProfile();
    renderMatchesList();
  }
  if (activeClassroomData) {
    renderClassroomWorkspace();
  }
  loadAchievements();
  renderHeroNewsFeed(activeHeroNewsFilter);

  showToast(
    currentLang === 'ar'
      ? 'تم تبديل لغة العرض إلى العربية 🌐'
      : 'שפת התצוגה הוחלפה לעברית 🌐'
  );
}

function navigateTo(viewKey, scrollTargetId = null) {
  document.querySelectorAll('.view-section').forEach((sec) => sec.classList.remove('active'));
  document.getElementById(`view-${viewKey}`).classList.add('active');

  document.querySelectorAll('.main-nav .nav-link').forEach((btn) => btn.classList.remove('active'));
  const navKey =
    scrollTargetId === 'vision-section'
      ? 'vision'
      : scrollTargetId === 'goals-section'
        ? 'goals'
        : scrollTargetId === 'how-section'
          ? 'how'
          : viewKey;
  const navBtn = document.querySelector(`.main-nav .nav-link[data-nav="${navKey}"]`);
  if (navBtn) navBtn.classList.add('active');

  if (scrollTargetId) {
    const target = document.getElementById(scrollTargetId);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 60);
      return;
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadPlatformStats() {
  const store = getLocalStore();
  const schoolsCount = store.schools.length;
  const unmatchedCount = store.schools.filter((s) => s.matched_school_id === null).length;
  const studentsSum = store.schools.reduce((acc, s) => acc + (s.students_count || 45), 0);
  const projectsCount = store.achievements.length + store.classrooms.length;

  document.getElementById('statSchoolsCount').textContent = schoolsCount;
  document.getElementById('statUnmatchedCount').textContent = unmatchedCount;
  document.getElementById('statStudentsCount').textContent = studentsSum;
  document.getElementById('statProjectsCount').textContent = projectsCount;
}

function loadAllSchools(selectedId = null) {
  const store = getLocalStore();
  allSchools = store.schools.map((s) => ({
    ...s,
    is_unmatched: s.matched_school_id === null
  }));
  if (selectedId) {
    loadSchoolDashboard(selectedId);
  }
}

function populateSchoolDropdown() {
  // No public school switcher dropdown is rendered to prevent school spoofing
}

function updateTopWelcomeBanner(school) {
  const barEl = document.getElementById('topSchoolWelcomeBar');
  const textEl = document.getElementById('topWelcomeSchoolText');
  if (!school) {
    if (barEl) barEl.style.display = 'none';
    return;
  }
  if (barEl) barEl.style.display = 'block';
  if (textEl) {
    textEl.innerHTML = `
      ברוכים הבאים מבית הספר: <strong>${school.name_he} (${school.city_he})</strong>
      <span style="margin:0 8px; opacity:0.6;">|</span>
      أهلاً وسهلاً بكم من: <strong>${school.name_ar} (${school.city_ar})</strong>
    `;
  }
}

function openSchoolLoginPortal() {
  navigateTo('portal');
  switchPortalMode('dashboard');
  setTimeout(() => {
    const target = activeDashboardSchool
      ? document.getElementById('authenticatedSchoolDashboard')
      : document.getElementById('schoolPrincipalLoginGate');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

function openSchoolRegistrationPortal() {
  navigateTo('portal');
  switchPortalMode('register');
  setTimeout(() => {
    const target = document.getElementById('portal-register-pane');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

function generateSuggestedSchoolCode() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const code = `BAYT-${randomDigits}`;
  const codeEl = document.getElementById('regAccessCode');
  const confirmEl = document.getElementById('regAccessCodeConfirm');
  if (codeEl) codeEl.value = code;
  if (confirmEl) confirmEl.value = code;
  showToast(`🎲 تم توليد رمز دخول خاص لمدرستك: ${code} — احتفظ به للدخول دائماً`);
}

function fillPrincipalLogin(emailVal, passVal) {
  const inp = document.getElementById('principalLoginInput');
  const pass = document.getElementById('principalPasswordInput');
  if (inp) inp.value = emailVal;
  if (pass) pass.value = passVal || '123456';
}

function handleSchoolPrincipalLogin(e) {
  e.preventDefault();
  const q = (document.getElementById('principalLoginInput').value || '').trim().toLowerCase();
  const enteredPass = (document.getElementById('principalPasswordInput').value || '').trim();
  const store = getLocalStore();

  const found = store.schools.find(
    (s) =>
      (s.contact_email && s.contact_email.toLowerCase() === q) ||
      (s.access_code && s.access_code.toLowerCase() === q) ||
      `ibn-${s.id}` === q ||
      `bayt-${s.id}` === q ||
      s.name_ar.toLowerCase().includes(q) ||
      s.name_he.toLowerCase().includes(q)
  );

  if (!found) {
    showToast('⚠️ لم يتم العثور على مدرسة مسجلة بهذا البريد أو الرمز! إذا كانت مدرستك جديدة اضغط على "تسجيل جديد لمدرسة جديدة" | בית הספר לא נמצא!');
    return;
  }

  const expectedPass = found.access_code || found.login_password || '123456';
  if (enteredPass !== expectedPass && enteredPass.toLowerCase() !== expectedPass.toLowerCase()) {
    showToast('❌ كلمة المرور / رمز الدخول غير صحيح! يمكنك استرداد كلمة المرور عبر البريد الإلكتروني المسجل أدناه | סיסמה שגויה!');
    toggleForgotPasswordBox(true, found.contact_email);
    return;
  }

  toggleForgotPasswordBox(false);
  loadSchoolDashboard(found.id);
  showToast(`🏫 ברוכים הבאים מבית הספר: ${found.name_he} | ${found.name_ar}`);
}

function toggleForgotPasswordBox(forceState = null, prefillEmail = '') {
  const box = document.getElementById('forgotPasswordBox');
  if (!box) return;
  const shouldShow = forceState !== null ? forceState : box.style.display === 'none';
  box.style.display = shouldShow ? 'block' : 'none';

  if (shouldShow) {
    const emailInput = document.getElementById('recoveryEmailInput');
    const loginVal = (document.getElementById('principalLoginInput')?.value || '').trim();
    if (emailInput) {
      if (prefillEmail) {
        emailInput.value = prefillEmail;
      } else if (loginVal.includes('@') && !emailInput.value) {
        emailInput.value = loginVal;
      }
      emailInput.focus();
    }
  }
}

function handleSchoolPasswordRecovery(e) {
  e.preventDefault();
  const email = (document.getElementById('recoveryEmailInput')?.value || '').trim().toLowerCase();
  const resultArea = document.getElementById('recoveryResultArea');
  if (!email || !resultArea) return;

  const store = getLocalStore();
  const found = store.schools.find(
    (s) => s.contact_email && s.contact_email.toLowerCase() === email
  );

  resultArea.style.display = 'block';

  if (!found) {
    resultArea.innerHTML = `
      <div class="recovery-success-card" style="border-color: #dc2626; background: #fef2f2;">
        <strong style="color: #991b1b; display:block; margin-bottom:6px;">
          ⚠️ لم يتم العثور على أي مدرسة مسجلة بهذا البريد الإلكتروني (${email})
        </strong>
        <p style="font-size:0.88rem; color:#7f1d1d; margin-bottom:10px;">
          تأكد من كتابة البريد الإلكتروني الذي سجّله مدير/مركز المدرسة عند التسجيل، أو قم بتسجيل مدرستك كمدرسة جديدة الآن.
        </p>
        <button type="button" class="btn btn-green btn-sm" onclick="openSchoolRegistrationPortal()">
          ➕ تسجيل جديد لمدرسة جديدة | רישום בית ספר חדש
        </button>
      </div>
    `;
    showToast('⚠️ هذا البريد الإلكتروني غير مسجل لأي مدرسة حالياً');
    return;
  }

  const savedCode = found.access_code || found.login_password || '123456';
  const mailSubject = encodeURIComponent(`استرداد رمز الدخول لمدرسة ${found.name_ar} | שחזור קוד כניסה לבית ספר ${found.name_he}`);
  const mailBody = encodeURIComponent(
    `مرحباً ${found.contact_name}،\n\n` +
    `بناءً على طلبك في منصة "بَيْت | בַּיִת"، إليك بيانات الدخول المسجلة لمدرستكم:\n` +
    `- المدرسة: ${found.name_ar} | ${found.name_he}\n` +
    `- البريد الإلكتروني المعتمد: ${found.contact_email}\n` +
    `- رمز الدخول / كلمة المرور للموقع: ${savedCode}\n\n` +
    `مع تحيات إدارة منصة بَيْت | בַּיִת`
  );

  resultArea.innerHTML = `
    <div class="recovery-success-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
        <div>
          <strong style="color: var(--green-800); font-size: 1rem; display:block;">
            ✅ تم التحقق من بريد صاحب الحساب وإرسال استرداد كلمة المرور إلى: <span dir="ltr">${found.contact_email}</span>
          </strong>
          <span style="font-size:0.86rem; color:var(--text-muted); font-weight:700;">
            🏫 المدرسة: ${found.name_ar} | ${found.name_he} • المسؤول: ${found.contact_name}
          </span>
        </div>
        <a href="mailto:${found.contact_email}?subject=${mailSubject}&body=${mailBody}" class="btn btn-outline-blue btn-sm" style="text-decoration:none;">
          📬 فتح الرسالة في البريد الإلكتروني
        </a>
      </div>

      <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px 14px; margin-bottom:12px;">
        <div style="font-size:0.86rem; color:var(--navy-900); margin-bottom:6px;">
          🔑 <strong>رمز الدخول / كلمة المرور المسجلة لمدرستك:</strong>
          <code style="background:#fff; border:1px solid var(--navy-600); padding:3px 10px; border-radius:6px; font-size:1rem; font-weight:900; color:var(--navy-900); margin-inline-start:6px;" dir="ltr">${savedCode}</code>
        </div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:10px;">
          <button type="button" class="btn btn-blue btn-sm" onclick="autoLoginRecoveredSchool(${found.id}, '${found.contact_email}', '${savedCode}')">
            🚀 تعبئة الرمز وتسجيل الدخول للمدرسة فوراً
          </button>
        </div>
      </div>

      <div style="border-top:1px dashed #cbd5e1; padding-top:10px;">
        <label style="font-size:0.84rem; font-weight:800; color:var(--navy-900); display:block; margin-bottom:6px;">
          🔄 أو قم بتعيين كلمة مرور / رمز دخول جديد لمدرستك الآن:
        </label>
        <div class="inline-inputs">
          <input type="text" id="newResetPasswordInput_${found.id}" placeholder="أدخل رمز دخول / كلمة مرور جديدة..." dir="ltr" style="text-align:start;" />
          <button type="button" class="btn btn-green btn-sm" onclick="applyNewRecoveredPassword(${found.id})">
            💾 حفظ كلمة المرور الجديدة والدخول
          </button>
        </div>
      </div>
    </div>
  `;

  showToast(`📧 تم استرداد بيانات الدخول على البريد المسجل: ${found.contact_email}`);
}

function autoLoginRecoveredSchool(schoolId, email, code) {
  fillPrincipalLogin(email, code);
  toggleForgotPasswordBox(false);
  loadSchoolDashboard(schoolId);
  const store = getLocalStore();
  const s = store.schools.find((item) => item.id === Number(schoolId));
  if (s) {
    showToast(`🏫 تم تسجيل الدخول بنجاح إلى: ${s.name_ar} | ${s.name_he}`);
  }
}

function applyNewRecoveredPassword(schoolId) {
  const inp = document.getElementById(`newResetPasswordInput_${schoolId}`);
  const newPass = (inp?.value || '').trim();
  if (!newPass || newPass.length < 4) {
    showToast('⚠️ يرجى إدخال رمز دخول جديد مكون من 4 أحرف أو أرقام على الأقل');
    return;
  }
  const store = getLocalStore();
  const idx = store.schools.findIndex((s) => s.id === Number(schoolId));
  if (idx === -1) return;

  store.schools[idx].access_code = newPass;
  store.schools[idx].login_password = newPass;
  saveLocalStore(store);

  const school = store.schools[idx];
  fillPrincipalLogin(school.contact_email, newPass);
  toggleForgotPasswordBox(false);
  loadSchoolDashboard(school.id);
  showToast(`✅ تم تحديث رمز الدخول لمدرستك إلى (${newPass}) وتسجيل الدخول بنجاح!`);
}

function logoutCurrentSchoolSession() {
  activeDashboardSchool = null;
  updateTopWelcomeBanner(null);

  const loginGate = document.getElementById('schoolPrincipalLoginGate');
  const authDash = document.getElementById('authenticatedSchoolDashboard');
  if (loginGate) loginGate.style.display = 'block';
  if (authDash) authDash.style.display = 'none';

  showStudentLoginGate();
  showToast('🚪 تم تسجيل الخروج من حساب المدرسة بأمان | התנתקת מחשבון בית הספר');
}

function switchLoggedInSchool(schoolId) {
  const id = Number(schoolId);
  loadSchoolDashboard(id);
  const store = getLocalStore();
  const school = store.schools.find((s) => s.id === id);
  if (school) {
    updateTopWelcomeBanner(school);
    showToast(`🏫 ברוכים הבאים מבית הספר: ${school.name_he} | ${school.name_ar}`);
  }
}

function switchPortalMode(mode) {
  const dashPane = document.getElementById('portal-dashboard-pane');
  const regPane = document.getElementById('portal-register-pane');
  const btnDash = document.getElementById('tabBtnDashboard');
  const btnReg = document.getElementById('tabBtnRegister');

  if (mode === 'register') {
    dashPane.style.display = 'none';
    regPane.style.display = 'block';
    btnDash.classList.remove('active');
    btnReg.classList.add('active');
  } else {
    regPane.style.display = 'none';
    dashPane.style.display = 'block';
    btnReg.classList.remove('active');
    btnDash.classList.add('active');
  }
}

function submitSchoolRegistration(e) {
  e.preventDefault();
  const checkedInterests = Array.from(
    document.querySelectorAll('#regInterestsGroup input[type="checkbox"]:checked')
  ).map((cb) => cb.value);

  const name = document.getElementById('regName').value.trim();
  const city = document.getElementById('regCity').value.trim();
  const sector = document.getElementById('regSector').value;
  const age_stage = document.getElementById('regAgeStage').value;
  const target_grades = document.getElementById('regGrades').value || '8-9';
  const activity_type = document.getElementById('regActivityType').value;
  const bio = document.getElementById('regBio').value.trim() || 'مدرسة تتطلع لبناء شراكة تربوية وبحثية مستدامة ضمن مشروع بيت المشترك.';
  const contact_name = document.getElementById('regContactName').value.trim();
  const contact_role = document.getElementById('regContactRole').value;
  const contact_email = document.getElementById('regContactEmail').value.trim();
  const contact_phone = document.getElementById('regContactPhone').value.trim();
  const chosenAccessCode = (document.getElementById('regAccessCode')?.value || '').trim();
  const confirmAccessCode = (document.getElementById('regAccessCodeConfirm')?.value || '').trim();

  if (!chosenAccessCode || chosenAccessCode.length < 4) {
    showToast('⚠️ يرجى اختيار رمز دخول / كلمة مرور للموقع مكونة من 4 خانات على الأقل');
    return;
  }

  if (chosenAccessCode !== confirmAccessCode) {
    showToast('⚠️ رمز الدخول وتأكيد رمز الدخول غير متطابقين! يرجى التأكد من كتابتهما بنفس الشكل');
    return;
  }

  const cityInfo = CITY_COORDS[city] || {
    lat: 32.65 + (Math.random() - 0.5) * 0.15,
    lng: 35.2 + (Math.random() - 0.5) * 0.15,
    ar: city,
    he: city
  };

  const isHebName = detectLang(name) === 'he';
  const store = getLocalStore();
  const newId = Math.max(...store.schools.map((s) => s.id), 0) + 1;

  const newSchool = {
    id: newId,
    name_ar: isHebName ? `مدرسة ${name}` : name,
    name_he: isHebName ? name : `בית ספר ${name}`,
    city_ar: cityInfo.ar,
    city_he: cityInfo.he,
    lat: cityInfo.lat,
    lng: cityInfo.lng,
    sector,
    age_stage,
    target_grades,
    interests: checkedInterests.length ? checkedInterests : ['science_env'],
    activity_type,
    contact_name,
    contact_role,
    contact_email,
    contact_phone,
    access_code: chosenAccessCode,
    login_password: chosenAccessCode,
    bio_ar: detectLang(bio) === 'he' ? smartTranslateLocal(bio, 'ar') : bio,
    bio_he: detectLang(bio) === 'he' ? bio : smartTranslateLocal(bio, 'he'),
    students_count: 45,
    matched_school_id: null
  };

  store.schools.push(newSchool);
  saveLocalStore(store);

  addAutoPlatformNews({
    type: 'school',
    title_ar: `🏫 انضمت مدرسة جديدة للمشروع: ${newSchool.name_ar} (${newSchool.city_ar})`,
    title_he: `🏫 בית ספר חדש הצטרף לפרויקט: ${newSchool.name_he} (${newSchool.city_he})`,
    body_ar: `أهلاً بكم في شبكة "بَيْت | בַּיִת"! المدرسة متاحة الآن للتوأمة والشراكة البحثية المشتركة.`,
    body_he: `ברוכים הבאים לרשת "בַּיִת | بَيْت"! בית הספר זמין כעת לשידוך ולשותפות מחקרית משותפת.`
  });

  showToast(`✅ تم تسجيل المدرسة واعتماد رمز الدخول الدائم (${chosenAccessCode}) المرتبط بالإيميل (${contact_email})!`);
  document.getElementById('schoolRegistrationForm').reset();
  loadPlatformStats();
  loadAllSchools(newSchool.id);
  switchPortalMode('dashboard');
}

function loadSchoolDashboard(schoolId) {
  const id = Number(schoolId);
  const store = getLocalStore();
  const current = store.schools.find((s) => s.id === id);
  if (!current) return;

  activeDashboardSchool = {
    ...current,
    is_unmatched: current.matched_school_id === null
  };

  const candidates = store.schools
    .filter((s) => s.id !== id)
    .map((candidate) => {
      const distanceKm = haversineKm(current.lat, current.lng, candidate.lat, candidate.lng);
      const geoScore = Math.max(5, Math.round(35 - Math.min(distanceKm, 120) * 0.25));
      const ageScore = current.age_stage === candidate.age_stage ? 25 : 10;
      const sharedInterests = candidate.interests.filter((i) => current.interests.includes(i));
      const interestScore = Math.min(25, sharedInterests.length * 9 + 7);
      const isCrossCommunity =
        (current.sector === 'arab' && candidate.sector !== 'arab') ||
        (current.sector !== 'arab' && candidate.sector === 'arab');
      const activityBonus = current.activity_type === candidate.activity_type ? 5 : 2;
      const communityScore = (isCrossCommunity ? 10 : 3) + activityBonus;
      const totalScore = Math.min(99, geoScore + ageScore + interestScore + communityScore);

      const reqRecord = store.match_requests.find(
        (q) =>
          (q.from_school_id === id && q.to_school_id === candidate.id) ||
          (q.from_school_id === candidate.id && q.to_school_id === id)
      );
      const existingRoom = store.classrooms.find(
        (c) =>
          (c.school_a_id === id && c.school_b_id === candidate.id) ||
          (c.school_a_id === candidate.id && c.school_b_id === id)
      );

      return {
        ...candidate,
        is_unmatched: candidate.matched_school_id === null,
        distance_km: distanceKm,
        shared_interests: sharedInterests,
        match_score: totalScore,
        is_cross_community: isCrossCommunity,
        partnership_status: existingRoom
          ? 'room_created'
          : reqRecord
          ? reqRecord.status
          : 'none',
        req_direction: reqRecord ? (Number(reqRecord.from_school_id) === id ? 'outgoing' : 'incoming') : null,
        classroom_id: existingRoom ? existingRoom.id : null,
        classroom_code: existingRoom ? existingRoom.code : null
      };
    });

  candidates.sort((a, b) => b.match_score - a.match_score);
  currentMatches = candidates;

  const loginGate = document.getElementById('schoolPrincipalLoginGate');
  const authDash = document.getElementById('authenticatedSchoolDashboard');
  const lockedName = document.getElementById('lockedSchoolHeaderName');
  if (loginGate) loginGate.style.display = 'none';
  if (authDash) authDash.style.display = 'block';
  if (lockedName) {
    lockedName.textContent = `חשבון בית ספר מאומת: ${current.name_he} (${current.city_he}) | الحساب الموثق: ${current.name_ar} (${current.city_ar})`;
  }

  updateTopWelcomeBanner(activeDashboardSchool);
  renderCurrentSchoolProfile();
  renderIncomingMatchRequests();
  renderSchoolPartnershipHub();
  renderMatchesList();
}

function renderIncomingMatchRequests() {
  const box = document.getElementById('incomingMatchRequestsBox');
  if (!box || !activeDashboardSchool) return;

  const incoming = currentMatches.filter(
    (m) => (m.partnership_status === 'pending' || m.partnership_status === 'interested') && m.req_direction === 'incoming'
  );

  if (incoming.length === 0) {
    box.innerHTML = '';
    return;
  }

  box.innerHTML = `
    <div style="background:linear-gradient(135deg,#fffbeb,#fef3c7); border:2px solid var(--gold-500); border-radius:16px; padding:18px 20px; box-shadow:var(--shadow-sm);">
      <h4 style="color:var(--navy-900); margin:0 0 10px;">
        📩 בקשות שידוך ממתינות לאישורך כאחראי בית הספר (${incoming.length}) | طلبات توأمة بانتظار موافقتك:
      </h4>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${incoming
          .map(
            (m) => `
          <div style="background:#fff; border:1px solid #fde68a; border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
            <div>
              <strong>🏫 ${m.name_he} | ${m.name_ar}</strong>
              <div style="font-size:0.84rem; color:var(--text-muted);">
                📍 ${m.city_he} (${m.distance_km} ק"מ) • אחראי/ת: ${m.contact_name} • התאמה: ${m.match_score}%
              </div>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button type="button" class="btn btn-green btn-sm" onclick="triggerMatchAction(${m.id}, 'approve_and_create')">
                ✅ אשר שידוך וצור חדר משותף | موافقة وإنشاء الغرفة
              </button>
              <button type="button" class="btn-delete-danger" onclick="triggerMatchAction(${m.id}, 'reject')">
                ❌ דחה | رفض
              </button>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderCurrentSchoolProfile() {
  const s = activeDashboardSchool;
  if (!s) return;

  const badgeEl = document.getElementById('activeSchoolStatusBadge');
  if (s.is_unmatched) {
    badgeEl.className = 'school-match-pill pill-unmatched';
    badgeEl.innerHTML =
      currentLang === 'ar'
        ? '🟡 حالة المدرسة: لم تقترن بعد (טרם שודך) — تبحث عن شريك'
        : '🟡 סטטוס: טרם שודך עם בית ספר אחר — פנוי לשותפות';
  } else {
    badgeEl.className = 'school-match-pill pill-matched';
    badgeEl.innerHTML =
      currentLang === 'ar'
        ? '🟢 حالة المدرسة: مقترنة في شراكة نشطة 🤝'
        : '🟢 סטטוס: שודך לשותפות פעילה 🤝';
  }

  const card = document.getElementById('currentSchoolProfileCard');
  const interestsHtml = s.interests
    .map((k) => `<span class="interest-chip">${INTEREST_LABELS[k]?.[currentLang] || k}</span>`)
    .join('');

  card.innerHTML = `
    <div>
      <div style="font-size: 0.85rem; font-weight: 800; color: var(--green-800); margin-bottom: 4px;">
        ${SECTOR_LABELS[s.sector]?.[currentLang] || s.sector} • ${STAGE_LABELS[s.age_stage]?.[currentLang] || s.age_stage} (${s.target_grades})
      </div>
      <h2 style="font-size: 1.5rem; color: var(--navy-900); margin-bottom: 4px;">
        ${s.name_ar} | <span lang="he">${s.name_he}</span>
      </h2>
      <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 10px;">
        📍 ${s.city_ar} (${s.city_he}) • 👤 ${s.contact_name} (${s.contact_role})
      </p>
      <div class="match-interests-row" style="margin-bottom: 0;">${interestsHtml}</div>
    </div>
    <div style="text-align: end;">
      <div style="font-size: 0.86rem; font-weight: 700; color: var(--navy-800); margin-bottom: 8px;">
        ${ACTIVITY_LABELS[s.activity_type]?.[currentLang] || s.activity_type}
      </div>
      <button class="btn btn-outline-blue btn-sm" onclick="switchPortalMode('register')">
        ➕ ${currentLang === 'ar' ? 'تسجيل مدرسة إضافية' : 'רישום בית ספר נוסף'}
      </button>
    </div>
  `;
}

function renderMatchesList() {
  const container = document.getElementById('matchesGridContainer');
  if (!container) return;

  const onlyUnmatched = document.getElementById('filterUnmatchedOnly')?.checked;
  const sectorFilter = document.getElementById('filterSector')?.value || 'all';
  const stageFilter = document.getElementById('filterStage')?.value || 'all';
  const interestFilter = document.getElementById('filterInterest')?.value || 'all';
  const activityFilter = document.getElementById('filterActivity')?.value || 'all';

  const filtered = currentMatches.filter((m) => {
    if (onlyUnmatched && !m.is_unmatched) return false;
    if (sectorFilter === 'cross' && !m.is_cross_community) return false;
    if (sectorFilter !== 'all' && sectorFilter !== 'cross' && m.sector !== sectorFilter) return false;
    if (stageFilter !== 'all' && m.age_stage !== stageFilter) return false;
    if (interestFilter !== 'all' && !m.interests.includes(interestFilter)) return false;
    if (activityFilter !== 'all' && m.activity_type !== activityFilter) return false;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: span 2; background: #fff; padding: 36px; text-align: center; border-radius: 16px; border: 1.5px solid var(--border-color);">
        <h3>${currentLang === 'ar' ? 'لا توجد مدارس مطابقة لمعايير الفلترة اليدوية الحالية' : 'לא נמצאו בתי ספר התואמים לסינון הידני הנוכחי'}</h3>
        <p style="color: var(--text-muted); margin-top: 8px;">
          ${currentLang === 'ar' ? 'جرب توسيع خيارات الفلترة لعرض المزيد من المدارس.' : 'נסו להרחיב את אפשרויות הסינון.'}
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map((m) => {
      const unmatchedBadge = m.is_unmatched
        ? `<span class="badge-tag badge-unmatched">✨ ${
            currentLang === 'ar'
              ? 'لم تقترن بعد • متاحة للتوأمة (טרם שודך)'
              : 'טרם שודך • פנוי לשידוך מיידי'
          }</span>`
        : `<span class="badge-tag badge-matched">🤝 ${
            currentLang === 'ar' ? 'مقترنة في شراكة (שודך)' : 'שודך לשותפות פעילה'
          }</span>`;

      const interestsHtml = m.interests
        .map((k) => {
          const isShared = m.shared_interests.includes(k);
          return `<span class="interest-chip ${isShared ? 'shared' : ''}">
            ${isShared ? '✓ ' : ''}${INTEREST_LABELS[k]?.[currentLang] || k}
          </span>`;
        })
        .join('');

      let actionBtnHtml = '';
      if (m.partnership_status === 'room_created' && m.classroom_code) {
        const mySide = m.id < activeDashboardSchool.id ? 'b' : 'a';
        actionBtnHtml = `
          <button class="btn btn-blue btn-sm" onclick="enterMatchedStudentWorkspace(${m.classroom_id}, '${mySide}')">
            🚀 ${currentLang === 'ar' ? `دخول الغرفة المشتركة (${m.classroom_code})` : `כניסה לחדר המשותף (${m.classroom_code})`}
          </button>
        `;
      } else if (m.partnership_status === 'pending' && m.req_direction === 'incoming') {
        actionBtnHtml = `
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:0.8rem; font-weight:800; color:#b45309;">
              📩 ${currentLang === 'ar' ? 'طلب توأمة بانتظار موافقتك!' : 'בקשת שידוך ממתינה לאישורך!'}
            </span>
            <button class="btn btn-green btn-sm" onclick="triggerMatchAction(${m.id}, 'approve_and_create')">
              ✅ ${currentLang === 'ar' ? 'موافقة وإنشاء الغرفة' : 'אשר שידוך וצור חדר'}
            </button>
            <button class="btn-delete-danger" onclick="triggerMatchAction(${m.id}, 'reject')">
              ❌ ${currentLang === 'ar' ? 'رفض' : 'דחה'}
            </button>
          </div>
        `;
      } else if ((m.partnership_status === 'pending' || m.partnership_status === 'interested') && m.req_direction === 'outgoing') {
        actionBtnHtml = `
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:0.8rem; font-weight:800; color:#b45309;">
              ⏳ ${currentLang === 'ar' ? 'تم إرسال الطلب — بانتظار موافقة مسؤول المدرسة الشريكة' : 'בקשה נשלחה — ממתין לאישור האחראי בבית הספר השותף'}
            </span>
            <button class="btn btn-outline-blue btn-sm" onclick="triggerMatchAction(${m.id}, 'cancel')">
              ✖ ${currentLang === 'ar' ? 'إلغاء الطلب' : 'בטל בקשה'}
            </button>
          </div>
        `;
      } else if (m.partnership_status === 'mutual_approved') {
        actionBtnHtml = `
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:0.8rem; font-weight:800; color:var(--green-800);">
              ✅ ${currentLang === 'ar' ? 'وافق مسؤولا المدرستين!' : 'שני האחראים אישרו!'}
            </span>
            <button class="btn btn-green btn-sm" onclick="triggerMatchAction(${m.id}, 'create_room')">
              🏠 ${currentLang === 'ar' ? '[ إنشاء الغرفة المشتركة ]' : '[ יצירת החדר המשותף ]'}
            </button>
          </div>
        `;
      } else {
        actionBtnHtml = `
          <button class="btn btn-outline-green btn-sm" onclick="triggerMatchAction(${m.id}, 'interest')">
            🤝 ${currentLang === 'ar' ? '[ إرسال طلب توأمة لمسؤول المدرسة ]' : '[ שלח בקשת שידוך לאחראי בית הספר ]'}
          </button>
        `;
      }

      return `
        <div class="match-card ${m.is_unmatched ? 'unmatched-highlight' : ''}">
          <div>
            <div class="match-card-top">
              <div>
                <div class="match-status-badges">
                  ${unmatchedBadge}
                  <span class="badge-tag badge-distance">📍 ${m.distance_km} ${currentLang === 'ar' ? 'كم' : 'ק"מ'}</span>
                  <span class="badge-tag" style="background:#f1f5f9;">${STAGE_LABELS[m.age_stage]?.[currentLang]} (${m.target_grades})</span>
                </div>
                <h3>${currentLang === 'ar' ? m.name_ar : m.name_he}</h3>
                <div class="match-subname">
                  ${currentLang === 'ar' ? `${m.name_he} — ${m.city_ar} (${m.city_he})` : `${m.name_ar} — ${m.city_he} (${m.city_ar})`}
                </div>
              </div>
              <div class="match-score-circle" title="AI Compatibility Score">
                <span class="score-num">${m.match_score}%</span>
                <span class="score-lbl">${currentLang === 'ar' ? 'تطابق ذكي' : 'התאמה'}</span>
              </div>
            </div>

            <p class="match-bio">${currentLang === 'ar' ? m.bio_ar : m.bio_he}</p>

            <div class="match-interests-row">
              ${interestsHtml}
            </div>
          </div>

          <div class="match-card-footer">
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              <div><strong>${currentLang === 'ar' ? 'النشاط:' : 'פעילות:'}</strong> ${ACTIVITY_LABELS[m.activity_type]?.[currentLang]}</div>
              <div><strong>${currentLang === 'ar' ? 'التواصل:' : 'איש קשר:'}</strong> ${m.contact_name}</div>
            </div>
            ${actionBtnHtml}
          </div>
        </div>
      `;
    })
    .join('');
}

function triggerMatchAction(targetSchoolId, actionType) {
  if (!activeDashboardSchool) return;
  const sA = activeDashboardSchool.id;
  const sB = Number(targetSchoolId);
  const store = getLocalStore();

  const schoolA = store.schools.find((s) => s.id === sA);
  const schoolB = store.schools.find((s) => s.id === sB);
  if (!schoolA || !schoolB) return;

  let existingReq = store.match_requests.find(
    (q) =>
      (q.from_school_id === sA && q.to_school_id === sB) ||
      (q.from_school_id === sB && q.to_school_id === sA)
  );

  if (actionType === 'interest') {
    if (!existingReq) {
      store.match_requests.push({
        from_school_id: sA,
        to_school_id: sB,
        status: 'pending'
      });
    } else if (Number(existingReq.from_school_id) !== sA && existingReq.status === 'pending') {
      // If the other school had already sent a request, clicking this completes mutual approval
      existingReq.status = 'mutual_approved';
    }
    saveLocalStore(store);
    showToast(
      currentLang === 'ar'
        ? `⏳ تم إرسال طلب التوأمة إلى مسؤول ${schoolB.name_ar} — يُنشأ الحيز المشترك فقط بعد موافقة مسؤولي المدرستين.`
        : `⏳ בקשת השידוך נשלחה לאחראי ב-${schoolB.name_he} — החדר המשותף ייפתח רק לאחר אישור האחראים משני בתי הספר.`
    );
    loadSchoolDashboard(sA);
    return;
  }

  if (actionType === 'cancel' || actionType === 'reject') {
    store.match_requests = store.match_requests.filter(
      (q) =>
        !(
          (Number(q.from_school_id) === sA && Number(q.to_school_id) === sB) ||
          (Number(q.from_school_id) === sB && Number(q.to_school_id) === sA)
        )
    );
    saveLocalStore(store);
    showToast(actionType === 'reject' ? '❌ בקשת השידוך נדחתה.' : '✖ בקשת השידוך בוטלה.');
    loadSchoolDashboard(sA);
    return;
  }

  if (actionType === 'approve_and_create' || actionType === 'create_room') {
    // Enforce two-school coordinator approval: cannot create room from an unapproved outgoing request
    if (
      existingReq &&
      existingReq.status === 'pending' &&
      Number(existingReq.from_school_id) === sA &&
      actionType === 'create_room'
    ) {
      showToast('⏳ לא ניתן לפתוח חדר לבד! יש להמתין לאישור האחראי בבית הספר השותף.');
      return;
    }
    let room = store.classrooms.find(
      (c) =>
        (c.school_a_id === sA && c.school_b_id === sB) ||
        (c.school_a_id === sB && c.school_b_id === sA)
    );

    if (!room) {
      const code = `BAYT-${Math.floor(100 + Math.random() * 899)}`;
      const newRoomId = Math.max(...store.classrooms.map((c) => c.id), 0) + 1;
      room = {
        id: newRoomId,
        code,
        school_a_id: sA,
        school_b_id: sB,
        title_ar: `${schoolA.name_ar}، ${schoolA.city_ar} 🤝 ${schoolB.name_ar}، ${schoolB.city_ar}`,
        title_he: `${schoolA.name_he}, ${schoolA.city_he} 🤝 ${schoolB.name_he}, ${schoolB.city_he}`,
        research_topic_ar: `الاستدامة البيئية والتراث المشترك بين ${schoolA.city_ar} و${schoolB.city_ar}`,
        research_topic_he: `קיימות סביבתית ומורשת משותפת בין ${schoolA.city_he} ל${schoolB.city_he}`,
        supervisor_ar: schoolA.contact_name,
        supervisor_he: schoolB.contact_name
      };
      store.classrooms.push(room);
      schoolA.matched_school_id = sB;
      schoolB.matched_school_id = sA;

      if (existingReq) existingReq.status = 'room_created';
      else store.match_requests.push({ from_school_id: sA, to_school_id: sB, status: 'room_created' });

      store.posts.unshift({
        id: Date.now(),
        classroom_id: room.id,
        category: 'self_intro',
        author_name: `${schoolA.contact_name} & ${schoolB.contact_name}`,
        school_side: 'a',
        school_name_ar: schoolA.name_ar,
        school_name_he: schoolB.name_he,
        original_lang: 'ar',
        content_ar: `أهلاً وسهلاً بطلاب ${schoolA.name_ar} و${schoolB.name_ar} في غرفتكم المشتركة الجديدة! ابدأوا بالتعريف عن أنفسكم واختيار فريقكم البحثي.`,
        content_he: `ברוכים הבאים לתלמידי ${schoolA.name_he} ו-${schoolB.name_he} לחדר המשותף החדש שלכם! התחילו בהצגה עצמית ובחירת צוות המחקר שלכם.`,
        likes: 5,
        replies: []
      });

      saveLocalStore(store);

      addAutoPlatformNews({
        type: 'partnership',
        title_ar: `🤝 انطلاق شراكة جديدة وفتح غرفة بحث مشترك (${room.code})`,
        title_he: `🤝 שותפות חינוכית חדשה יצאה לדרך ונפתח חדר מחקר משותף (${room.code})`,
        body_ar: `تم تدشين شراكة تربوية جديدة في مجال: ${room.research_topic_ar}.`,
        body_he: `הושקה שותפות חינוכית חדשה בנושא: ${room.research_topic_he}.`
      });
    }

    showToast(
      currentLang === 'ar'
        ? `🎉 تم إنشاء الغرفة المشتركة بنجاح! يمكنك الآن إدارة طلابك والمنتدى والمشاريع المشتركة أدناه.`
        : `🎉 נוצר השידוך והחדר המשותף (${room.code})! כעת באפשרותך להזין נתוני תלמידים, לצפות בפורום ולנהל פרויקטים משותפים.`
    );
    loadPlatformStats();
    loadAllSchools(sA);
    switchSchoolHubTab('forum');
    setTimeout(() => {
      const hubEl = document.getElementById('schoolPartnershipHub');
      if (hubEl) hubEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }
}

// Student Space Functions (School-Specific Secret Codes — Prevents Spoofing)
function fillStudentCode(code, studentName) {
  document.getElementById('studentCodeInput').value = code;
  document.getElementById('studentNameInput').value = studentName;
}

function quickStudentDemo(code) {
  navigateTo('students');
  document.getElementById('studentCodeInput').value = code;
  loginToClassroomCode(code, 'أمير جبارين | אמיר');
}

function populateStudentReqSchools() {
  const sel = document.getElementById('studentReqSchoolSelect');
  if (!sel) return;
  const store = getLocalStore();
  sel.innerHTML = (store.schools || [])
    .map((s) => `<option value="${s.id}">${s.name_ar} | ${s.name_he} (${s.city})</option>`)
    .join('');
}

function openStudentJoinOrLogin(mode) {
  if (typeof navigateTo === 'function') navigateTo('students');
  showStudentLoginGate();
  switchStudentAuthMode(mode || 'login');
}

function switchStudentAuthMode(mode) {
  const loginForm = document.getElementById('studentLoginForm');
  const reqForm = document.getElementById('studentRequestForm');
  const btnLogin = document.getElementById('stuTabBtnLogin');
  const btnReq = document.getElementById('stuTabBtnRequest');
  if (!loginForm || !reqForm) return;
  if (mode === 'request') {
    populateStudentReqSchools();
    loginForm.style.display = 'none';
    reqForm.style.display = 'block';
    if (btnReq) { btnReq.className = 'btn btn-blue'; btnReq.style.cssText = ''; }
    if (btnLogin) { btnLogin.className = 'btn'; btnLogin.style.cssText = 'background:#f1f5f9; color:#0f172a; border:1.5px solid #cbd5e1;'; }
  } else {
    loginForm.style.display = 'block';
    reqForm.style.display = 'none';
    if (btnLogin) { btnLogin.className = 'btn btn-blue'; btnLogin.style.cssText = ''; }
    if (btnReq) { btnReq.className = 'btn'; btnReq.style.cssText = 'background:#f1f5f9; color:#0f172a; border:1.5px solid #cbd5e1;'; }
  }
}

function handleStudentJoinRequest(e) {
  e.preventDefault();
  const schoolId = Number(document.getElementById('studentReqSchoolSelect')?.value);
  const name = (document.getElementById('studentReqName')?.value || '').trim();
  const studentIdNumber = (document.getElementById('studentReqId')?.value || '').trim().replace(/\D/g, '');
  const grade = (document.getElementById('studentReqGrade')?.value || '').trim();
  const team = (document.getElementById('studentReqTeam')?.value || '').trim();
  if (!schoolId || !name || !studentIdNumber || !grade) {
    showToast('⚠️ يرجى تعبئة جميع الحقول المطلوبة.');
    return;
  }

  const store = getLocalStore();
  const school = store.schools.find((s) => Number(s.id) === schoolId);
  if (!school) return;

  if (!Array.isArray(school.students)) school.students = [];
  if (!Array.isArray(school.pending_students)) school.pending_students = [];

  const alreadyApproved = school.students.find((st) => st.studentIdNumber === studentIdNumber || st.name === name);
  if (alreadyApproved) {
    showToast(`✅ أنت مسجّل ومُعتمد بالفعل في ${school.name_ar}! يمكنك الدخول مباشرة برمز المدرسة.`);
    switchStudentAuthMode('login');
    return;
  }

  const alreadyPending = school.pending_students.find((st) => st.studentIdNumber === studentIdNumber);
  if (!alreadyPending) {
    school.pending_students.push({
      id: Date.now(),
      name,
      studentIdNumber,
      grade,
      team,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10)
    });
    saveLocalStore(store);
  }

  const statusBox = document.getElementById('studentReqStatusBox');
  if (statusBox) {
    statusBox.innerHTML = `
      <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:12px; padding:12px; color:#166534; font-weight:700;">
        ⏳ تم إرسال استمارتك بنجاح إلى إدارة <strong>${school.name_ar}</strong>!<br>
        ستتمكن من الدخول فور موافقة مدرستك ومنحك إذن الدخول.
      </div>
    `;
  }
  e.target.reset();
  showToast('📨 تم إرسال طلب الانضمام بنجاح — بانتظار إذن مدرستك!');
}

function showStudentLoginGate() {
  populateStudentReqSchools();
  document.getElementById('studentLoginGate').style.display = 'block';
  document.getElementById('classroomWorkspace').style.display = 'none';
}

function handleStudentLogin(e) {
  e.preventDefault();
  const code = document.getElementById('studentCodeInput').value;
  const name = document.getElementById('studentNameInput').value;
  loginToClassroomCode(code, name);
}

function loginToClassroomCode(code, studentName) {
  const cleanCode = (code || '').trim().toUpperCase();
  const cleanInput = (studentName || '').trim();
  const cleanDigits = cleanInput.replace(/\D/g, '');
  const store = getLocalStore();

  // Strict ID-only verification: nicknames or non-ID text are strictly rejected
  if (!cleanDigits || cleanDigits.length < 4) {
    showToast('🔒 ممنوع الدخول بالاسم المستعار! يجب إدخال رقم الهوية المسجّل والمعتمد من إدارة مدرستك (أرقام فقط).');
    return;
  }

  const matchesStudentRecord = (st) => {
    if (!st || !st.studentIdNumber) return false;
    return String(st.studentIdNumber).replace(/\D/g, '') === cleanDigits;
  };

  // Map school-specific codes to exact classroom + exact school side (no dropdown spoofing possible!)
  let room = null;
  let lockedSide = 'a';
  let explicitlyTargetedSide = false;

  if (cleanCode === 'FAHM-2026' || cleanCode === 'BAYT-2026') {
    room = store.classrooms.find((c) => c.id === 1) || store.classrooms[0];
    lockedSide = 'a'; // Ibn Khaldoun - Umm al-Fahm
    explicitlyTargetedSide = true;
  } else if (cleanCode === 'AFULA-2026') {
    room = store.classrooms.find((c) => c.id === 1) || store.classrooms[0];
    lockedSide = 'b'; // Kramim - Afula
    explicitlyTargetedSide = true;
  } else if (cleanCode === 'NAZ-101' || cleanCode === 'GALIL-101') {
    room = store.classrooms.find((c) => c.id === 2) || store.classrooms[1] || store.classrooms[0];
    lockedSide = 'a'; // Al-Bishara - Nazareth
    explicitlyTargetedSide = true;
  } else if (cleanCode === 'NOF-101') {
    room = store.classrooms.find((c) => c.id === 2) || store.classrooms[1] || store.classrooms[0];
    lockedSide = 'b'; // ORT Alon - Nof HaGalil
    explicitlyTargetedSide = true;
  } else if (cleanCode.endsWith('-B')) {
    const baseCode = cleanCode.slice(0, -2);
    room = store.classrooms.find((c) => c.code.toUpperCase() === baseCode);
    lockedSide = 'b';
    explicitlyTargetedSide = true;
  } else if (cleanCode.endsWith('-A')) {
    const baseCode = cleanCode.slice(0, -2);
    room = store.classrooms.find((c) => c.code.toUpperCase() === baseCode);
    lockedSide = 'a';
    explicitlyTargetedSide = true;
  } else if (cleanCode) {
    room = store.classrooms.find((c) => c.code.toUpperCase() === cleanCode);
    lockedSide = 'a';
  }

  // Smart lookup by registered student name or ID across all schools (when code is omitted, or shared room code like BAYT-481 belongs to either school A or B)
  let matchedStudent = null;
  let chosenSchool = null;

  if (room && !explicitlyTargetedSide) {
    const sA = store.schools.find((s) => s.id === room.school_a_id);
    const sB = store.schools.find((s) => s.id === room.school_b_id);
    const inA = sA && Array.isArray(sA.students) ? sA.students.find(matchesStudentRecord) : null;
    const inB = sB && Array.isArray(sB.students) ? sB.students.find(matchesStudentRecord) : null;
    if (inB && !inA) {
      lockedSide = 'b';
      chosenSchool = sB;
      matchedStudent = inB;
    } else if (inA) {
      lockedSide = 'a';
      chosenSchool = sA;
      matchedStudent = inA;
    } else if (sB && Array.isArray(sB.pending_students) && sB.pending_students.find(matchesStudentRecord)) {
      lockedSide = 'b';
      chosenSchool = sB;
    }
  }

  // If no room code was entered (or student wasn't in the default code's school), search all schools for this registered student
  if (!matchedStudent && cleanInput) {
    for (const sc of store.schools) {
      const foundPending = Array.isArray(sc.pending_students) ? sc.pending_students.find(matchesStudentRecord) : null;
      if (foundPending) {
        showToast(`⏳ طلبك قيد الانتظار يا ${foundPending.name} — يرجى انتظار موافقة وإذن إدارة ${sc.name_ar}!`);
        return;
      }
      const foundStu = Array.isArray(sc.students) ? sc.students.find(matchesStudentRecord) : null;
      if (foundStu) {
        const scRooms = store.classrooms.filter(
          (c) => Number(c.school_a_id) === Number(sc.id) || Number(c.school_b_id) === Number(sc.id)
        );
        const stuGradeNorm = String(foundStu.grade || '').trim().toLowerCase();
        const scRoom =
          scRooms.find((c) =>
            (c.joint_groups || []).some((g) =>
              (g.members || []).some(
                (m) => Number(m.school_id) === Number(sc.id) && String(m.name || '').trim() === String(foundStu.name || '').trim()
              )
            )
          ) ||
          scRooms.find(
            (c) => c.grade_label && stuGradeNorm && String(c.grade_label).toLowerCase().includes(stuGradeNorm)
          ) ||
          scRooms[0];
        if (scRoom) {
          room = scRoom;
          lockedSide = Number(scRoom.school_b_id) === Number(sc.id) ? 'b' : 'a';
          chosenSchool = sc;
          matchedStudent = foundStu;
          break;
        }
      }
    }
  }

  if (!room) {
    showToast('⚠️ لم يتم العثور على الغرفة أو الطالب! أدخل رمز مدرستك الصحيح أو قدّم استمارة انضمام.');
    return;
  }

  const schoolA = store.schools.find((s) => s.id === room.school_a_id) || store.schools[0];
  const schoolB = store.schools.find((s) => s.id === room.school_b_id) || store.schools[1];

  if (!chosenSchool) {
    chosenSchool = lockedSide === 'b' ? schoolB : schoolA;
  }

  const pendingList = Array.isArray(chosenSchool.pending_students) ? chosenSchool.pending_students : [];
  const pendingMatch = pendingList.find(matchesStudentRecord);
  if (pendingMatch) {
    showToast(`⏳ طلبك قيد الانتظار يا ${pendingMatch.name} — يرجى انتظار موافقة وإذن إدارة ${chosenSchool.name_ar}!`);
    return;
  }

  const approvedList = Array.isArray(chosenSchool.students) ? chosenSchool.students : [];
  if (!matchedStudent) {
    matchedStudent = approvedList.find(matchesStudentRecord);
  }

  // Strict approval gate: student MUST be explicitly approved in school.students with a matching ID number
  if (!matchedStudent) {
    showToast(`🔒 ممنوع الدخول: رقم الهوية (${cleanDigits}) غير مسجّل أو غير مؤشّر/معتمد من إدارة ${chosenSchool.name_ar}! يرجى تقديم طلب انضمام وانتظار إذن المدرسة.`);
    switchStudentAuthMode('request');
    const reqIdEl = document.getElementById('studentReqId');
    if (reqIdEl) reqIdEl.value = cleanDigits;
    return;
  }

  updateTopWelcomeBanner(chosenSchool);

  activeStudentSession = {
    name: (matchedStudent && matchedStudent.name) || cleanInput || 'طالب/ة مشترك',
    studentIdNumber: (matchedStudent && matchedStudent.studentIdNumber) || cleanDigits || '',
    school_side: lockedSide,
    school_name_ar: chosenSchool.name_ar,
    school_name_he: chosenSchool.name_he
  };

  fetchClassroomById(room.id);
  document.getElementById('studentLoginGate').style.display = 'none';
  document.getElementById('classroomWorkspace').style.display = 'block';
  showToast(
    currentLang === 'ar'
      ? `🏫 أهلاً بك يا ${activeStudentSession.name} من ${chosenSchool.name_ar}!`
      : `🏫 ברוך הבא ${activeStudentSession.name} מבית הספר ${chosenSchool.name_he}!`
  );
}

function fetchClassroomById(roomId) {
  const store = getLocalStore();
  const room = store.classrooms.find((c) => c.id === Number(roomId)) || store.classrooms[0];
  const posts = store.posts.filter((p) => p.classroom_id === room.id || room.id <= 2);
  const research_data = store.research_data.filter((r) => r.classroom_id === room.id || room.id <= 2);
  const canvas_cards = store.canvas_cards.filter((c) => c.classroom_id === room.id || room.id <= 2);

  activeClassroomData = {
    classroom: room,
    posts,
    research_data,
    canvas_cards
  };
  renderClassroomWorkspace();
}

function switchStudentTab(tabKey) {
  document.getElementById('studentLoginGate').style.display = 'none';
  document.getElementById('classroomWorkspace').style.display = 'block';

  ['forum', 'grouproom', 'lab', 'wall'].forEach((k) => {
    const pane = document.getElementById(`student-pane-${k}`);
    if (pane) pane.style.display = k === tabKey ? 'block' : 'none';
  });

  document.getElementById('wsTabForum').classList.toggle('active', tabKey === 'forum');
  const grpTabBtn = document.getElementById('wsTabGroupRoom');
  if (grpTabBtn) grpTabBtn.classList.toggle('active', tabKey === 'grouproom');
  document.getElementById('wsTabLab').classList.toggle('active', tabKey === 'lab');
  document.getElementById('wsTabWall').classList.toggle('active', tabKey === 'wall');

  if (tabKey === 'grouproom' && activeClassroomData) {
    renderStudentGroupRoom(activeClassroomData.classroom);
  }
}

function renderClassroomWorkspace() {
  if (!activeClassroomData) return;
  const { classroom } = activeClassroomData;

  document.getElementById('activeRoomCode').textContent = `رمز الصف: ${classroom.code}`;
  document.getElementById('activeStudentBadge').textContent = `${activeStudentSession.name} (${
    currentLang === 'ar' ? activeStudentSession.school_name_ar : activeStudentSession.school_name_he
  })`;

  document.getElementById('activeRoomTitle').innerHTML =
    currentLang === 'ar'
      ? `${classroom.title_ar} <div style="font-size:1.05rem; font-weight:500; opacity:0.92;" lang="he">${classroom.title_he}</div>`
      : `${classroom.title_he} <div style="font-size:1.05rem; font-weight:500; opacity:0.92;">${classroom.title_ar}</div>`;

  document.getElementById('activeRoomTopic').textContent =
    currentLang === 'ar'
      ? `${classroom.research_topic_ar} | ${classroom.research_topic_he}`
      : `${classroom.research_topic_he} | ${classroom.research_topic_ar}`;

  document.getElementById('activeRoomSupervisors').textContent = `👩‍🏫 إشراف تربوي مشترك | ליווי פדגוגי: ${classroom.supervisor_ar} 🤝 ${classroom.supervisor_he}`;
  renderStudentMyGroupBanner(classroom);
  renderStudentGroupRoom(classroom);

  renderForumPosts();
  renderResearchDataList();
  renderCanvasBoard();
  initMentorDefaultMessage();
}

function filterForumCategory(cat) {
  activeForumCategory = cat;
  document.querySelectorAll('.cat-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
  });
  renderForumPosts();
}

function renderForumPosts() {
  const container = document.getElementById('forumPostsContainer');
  if (!container || !activeClassroomData) return;

  const posts = activeClassroomData.posts.filter(
    (p) => activeForumCategory === 'all' || p.category === activeForumCategory
  );

  container.innerHTML = posts
    .map((p) => {
      const isOrigAr = p.original_lang === 'ar';
      const origText = isOrigAr ? p.content_ar : p.content_he;
      const transText = isOrigAr ? p.content_he : p.content_ar;
      const transLangLabel = isOrigAr ? 'עברית (תרגום מיידי חכם)' : 'العربية (ترجمة فورية ذكية)';
      const isTransOpen = visiblePostTranslations[p.id] !== false;

      const repliesHtml = (p.replies || [])
        .map(
          (r) => `
          <div class="reply-item">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:3px;">
              <span style="font-weight:800; font-size:0.82rem; color:var(--navy-800);">
                ${r.author_name} (${r.school_name_ar})
              </span>
              ${
                window.isAdminLoggedIn
                  ? `<button type="button" class="btn-delete-danger" style="padding:3px 8px; font-size:0.74rem;" onclick="adminDeleteReply(${p.id}, ${r.id})">🗑️ מחק תגובה | حذف</button>`
                  : ''
              }
            </div>
            <div>${r.original_lang === 'ar' ? r.content_ar : r.content_he}</div>
            <div style="font-size:0.84rem; color:var(--green-800); margin-top:4px; border-top:1px dotted #cbd5e1; padding-top:3px;">
              ⚡ ${r.original_lang === 'ar' ? r.content_he : r.content_ar}
            </div>
          </div>
        `
        )
        .join('');

      return `
        <article class="forum-post-card">
          <div class="post-header">
            <div class="post-author-info">
              <div class="author-avatar ${p.school_side === 'b' ? 'side-b' : ''}">
                ${p.author_name.charAt(0)}
              </div>
              <div>
                <strong>${p.author_name}</strong>
                <div class="post-school-tag">${p.school_name_ar} | <span lang="he">${p.school_name_he}</span></div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="interest-chip">${CATEGORY_LABELS[p.category]?.[currentLang] || p.category}</span>
              ${
                window.isAdminLoggedIn
                  ? `<button type="button" class="btn-delete-danger" onclick="adminDeletePost(${p.id})">🗑️ מחק הודעה | حذف كمدير</button>`
                  : ''
              }
            </div>
          </div>

          <div class="post-body-original" ${!isOrigAr ? 'lang="he"' : ''}>
            <span style="font-size:0.75rem; font-weight:800; color:var(--text-muted); display:block; margin-bottom:2px;">
              🗣️ ${isOrigAr ? 'النص الأصلي (بالعربية):' : 'הטקסט המקורי (בעברית):'}
            </span>
            ${origText}
          </div>

          <div id="trans-box-${p.id}" class="post-translation-box" style="display: ${isTransOpen ? 'block' : 'none'};" ${isOrigAr ? 'lang="he"' : ''}>
            <div style="font-size:0.76rem; font-weight:800; color:var(--green-800); margin-bottom:3px;">
              ⚡ ${transLangLabel}:
            </div>
            ${transText}
          </div>

          <div class="post-actions-bar">
            <button class="btn-translate-toggle" onclick="togglePostTranslation(${p.id})">
              🌐 ${
                currentLang === 'ar'
                  ? 'إظهار / إخفاء الترجمة الفورية (عربي ↔ עברית)'
                  : 'הצג / הסתר תרגום מיידי (עברית ↔ عربي)'
              }
            </button>
            <button class="btn-like" onclick="likeForumPost(${p.id})">
              ❤️ <span id="post-likes-${p.id}">${p.likes}</span>
            </button>
          </div>

          <div class="replies-section">
            ${repliesHtml}
            <form class="reply-form" onsubmit="submitForumReply(event, ${p.id})">
              <input type="text" id="reply-input-${p.id}" required placeholder="${
        currentLang === 'ar'
          ? 'اكتب رداً بالعربية أو العبرية (سيُترجم تلقائياً)...'
          : 'כתבו תגובה בערבית או בעברית (יתורגם אוטומטית)...'
      }" />
              <button type="submit" class="btn btn-blue btn-sm">${currentLang === 'ar' ? 'رد' : 'תגובה'}</button>
            </form>
          </div>
        </article>
      `;
    })
    .join('');
}

function togglePostTranslation(postId) {
  const box = document.getElementById(`trans-box-${postId}`);
  if (!box) return;
  const currentlyOpen = box.style.display !== 'none';
  box.style.display = currentlyOpen ? 'none' : 'block';
  visiblePostTranslations[postId] = !currentlyOpen;
}

function autoResizeTextarea(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.max(170, el.scrollHeight) + 'px';
}

async function aiTranslateText(text, targetLang) {
  if (!text || !text.trim()) return '';
  const clean = text.trim();
  const sourceLang = detectLang(clean);
  if (sourceLang === targetLang) return clean;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const joined = data[0].map((part) => part[0]).join('');
        if (joined && joined.trim()) return joined.trim();
      }
    }
  } catch (e) {
    // Fallback to local smart dictionary if offline
  }
  return smartTranslateLocal(clean, targetLang);
}

async function translateComposerWithAI(targetLang = 'he') {
  const input = document.getElementById('postContentInput');
  const previewBox = document.getElementById('composerTranslationPreview');
  const transTextarea = document.getElementById('composerTranslatedTextarea');
  const titleEl = document.getElementById('composerTransTitle');

  if (!input || !input.value.trim()) {
    showToast('✍️ اكتب نص الرسالة أو المشروع أولاً ليقوم الذكاء الاصطناعي بترجمته فوراً!');
    return;
  }

  showToast('🤖 جاري الترجمة بالذكاء الاصطناعي...');
  const translated = await aiTranslateText(input.value, targetLang);
  previewBox.style.display = 'block';
  if (titleEl) {
    titleEl.textContent =
      targetLang === 'he'
        ? '🤖 الترجمة الذكية إلى العبرية (תרגום AI לעברית — يمكنك تعديلها أو اعتمادها):'
        : '🤖 الترجمة الذكية إلى العربية (תרגום AI לערבית — يمكنك تعديلها أو اعتمادها):';
  }
  if (transTextarea) {
    transTextarea.value = translated;
    transTextarea.lang = targetLang;
    autoResizeTextarea(transTextarea);
  }
}

function applyAITranslationToMainField(mainId, transId) {
  const mainEl = document.getElementById(mainId);
  const transEl = document.getElementById(transId);
  if (mainEl && transEl && transEl.value.trim()) {
    mainEl.value = transEl.value;
    autoResizeTextarea(mainEl);
    showToast('✅ تم وضع النص المترجم في حقل الكتابة الرئيسي!');
  }
}

async function translateResearchProjectWithAI(targetLang = 'he') {
  const titleEl = document.getElementById('resTitle');
  const summaryEl = document.getElementById('resSummary');
  const box = document.getElementById('researchAiPreviewBox');
  const titleTrans = document.getElementById('resTitleTranslated');
  const summaryTrans = document.getElementById('resSummaryTranslated');

  if ((!titleEl || !titleEl.value.trim()) && (!summaryEl || !summaryEl.value.trim())) {
    showToast('✍️ اكتب عنوان أو تفاصيل المشروع أولاً لترجمته بالذكاء الاصطناعي!');
    return;
  }

  showToast('🤖 جاري ترجمة المشروع بالذكاء الاصطناعي...');
  const [tOut, sOut] = await Promise.all([
    aiTranslateText(titleEl.value || '', targetLang),
    aiTranslateText(summaryEl.value || '', targetLang)
  ]);

  if (box) box.style.display = 'block';
  if (titleTrans) titleTrans.value = tOut;
  if (summaryTrans) {
    summaryTrans.value = sOut;
    autoResizeTextarea(summaryTrans);
  }
}

function applyProjectAITranslation() {
  const titleEl = document.getElementById('resTitle');
  const summaryEl = document.getElementById('resSummary');
  const titleTrans = document.getElementById('resTitleTranslated');
  const summaryTrans = document.getElementById('resSummaryTranslated');

  if (titleTrans && titleTrans.value.trim()) titleEl.value = titleTrans.value;
  if (summaryTrans && summaryTrans.value.trim()) {
    summaryEl.value = summaryTrans.value;
    autoResizeTextarea(summaryEl);
  }
  showToast('✅ تم اعتماد الترجمة في حقول المشروع!');
}

async function previewComposerTranslation() {
  await translateComposerWithAI('he');
}

async function submitForumPost(e) {
  e.preventDefault();
  if (!activeClassroomData) return;
  const content = document.getElementById('postContentInput').value.trim();
  const category = document.getElementById('postCategorySelect').value;
  const customTransEl = document.getElementById('composerTranslatedTextarea');
  if (!content) return;

  const origLang = detectLang(content);
  const otherLang = origLang === 'ar' ? 'he' : 'ar';
  const customTrans = customTransEl && customTransEl.value.trim() ? customTransEl.value.trim() : await aiTranslateText(content, otherLang);

  const store = getLocalStore();
  store.posts.unshift({
    id: Date.now(),
    classroom_id: activeClassroomData.classroom.id,
    category,
    author_name: activeStudentSession.name,
    school_side: activeStudentSession.school_side,
    school_name_ar: activeStudentSession.school_name_ar,
    school_name_he: activeStudentSession.school_name_he,
    original_lang: origLang,
    content_ar: origLang === 'ar' ? content : customTrans,
    content_he: origLang === 'he' ? content : customTrans,
    likes: 1,
    replies: []
  });
  saveLocalStore(store);

  document.getElementById('postContentInput').value = '';
  if (customTransEl) customTransEl.value = '';
  document.getElementById('composerTranslationPreview').style.display = 'none';
  fetchClassroomById(activeClassroomData.classroom.id);
  showToast('✨ تم نشر مشاركتك مع الترجمة الذكية باللغتين!');
}

function submitForumReply(e, postId) {
  e.preventDefault();
  const input = document.getElementById(`reply-input-${postId}`);
  if (!input || !input.value.trim()) return;
  const content = input.value.trim();
  const origLang = detectLang(content);

  const store = getLocalStore();
  const post = store.posts.find((p) => p.id === Number(postId));
  if (post) {
    post.replies = post.replies || [];
    post.replies.push({
      id: Date.now(),
      author_name: activeStudentSession.name,
      school_name_ar: activeStudentSession.school_name_ar,
      school_name_he: activeStudentSession.school_name_he,
      original_lang: origLang,
      content_ar: origLang === 'ar' ? content : smartTranslateLocal(content, 'ar'),
      content_he: origLang === 'he' ? content : smartTranslateLocal(content, 'he')
    });
    saveLocalStore(store);
  }
  input.value = '';
  fetchClassroomById(activeClassroomData.classroom.id);
}

function likeForumPost(postId) {
  const store = getLocalStore();
  const post = store.posts.find((p) => p.id === Number(postId));
  if (post) {
    post.likes = (post.likes || 0) + 1;
    saveLocalStore(store);
    const el = document.getElementById(`post-likes-${postId}`);
    if (el) el.textContent = post.likes;
  }
}

function toggleDataUploadForm() {
  const form = document.getElementById('uploadResearchForm');
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
}

function renderResearchDataList() {
  const listEl = document.getElementById('researchDataList');
  if (!listEl || !activeClassroomData) return;

  const typeIcons = {
    measurement: '🧪',
    interview: '🎙️',
    photo: '📷'
  };

  listEl.innerHTML = activeClassroomData.research_data
    .map(
      (item) => `
      <div class="research-item-card">
        <div class="res-item-top">
          <strong>${typeIcons[item.data_type] || '📄'} ${currentLang === 'ar' ? item.title_ar : item.title_he}</strong>
          <span class="res-metric-badge">${item.metric_badge}</span>
        </div>
        <div style="font-size:0.82rem; color:var(--green-800); font-weight:800; margin-bottom:4px;">
          📍 ${item.town_ar} (${item.town_he}) • 👤 ${item.author_name}
        </div>
        <p style="font-size:0.9rem; color:var(--text-main); margin-bottom:4px;">${item.summary_ar}</p>
        <p style="font-size:0.86rem; color:var(--text-muted);" lang="he">${item.summary_he}</p>
      </div>
    `
    )
    .join('');
}

async function submitResearchData(e) {
  e.preventDefault();
  if (!activeClassroomData) return;
  const data_type = document.getElementById('resDataType').value;
  const town = document.getElementById('resTown').value.trim();
  const title = document.getElementById('resTitle').value.trim();
  const summary = document.getElementById('resSummary').value.trim();
  const metric_badge = document.getElementById('resBadge').value.trim() || 'بيانات ميدانية موثقة | נתוני שדה';

  const titleTransEl = document.getElementById('resTitleTranslated');
  const summaryTransEl = document.getElementById('resSummaryTranslated');

  const lang = detectLang(title + ' ' + summary);
  const otherLang = lang === 'ar' ? 'he' : 'ar';

  const transTitle =
    titleTransEl && titleTransEl.value.trim()
      ? titleTransEl.value.trim()
      : await aiTranslateText(title, otherLang);
  const transSummary =
    summaryTransEl && summaryTransEl.value.trim()
      ? summaryTransEl.value.trim()
      : await aiTranslateText(summary, otherLang);

  const store = getLocalStore();
  store.research_data.unshift({
    id: Date.now(),
    classroom_id: activeClassroomData.classroom.id,
    data_type,
    title_ar: lang === 'ar' ? title : transTitle,
    title_he: lang === 'he' ? title : transTitle,
    town_ar: town,
    town_he: town,
    author_name: activeStudentSession.name,
    summary_ar: lang === 'ar' ? summary : transSummary,
    summary_he: lang === 'he' ? summary : transSummary,
    metric_badge
  });
  saveLocalStore(store);

  document.getElementById('uploadResearchForm').reset();
  const aiBox = document.getElementById('researchAiPreviewBox');
  if (aiBox) aiBox.style.display = 'none';
  fetchClassroomById(activeClassroomData.classroom.id);
  showToast('📂 تم حفظ ومشاركة المشروع المبحوث مع الترجمة الذكية باللغتين!');
}

function renderCanvasBoard() {
  if (!activeClassroomData) return;
  const cols = ['ideas', 'field_work', 'drafting', 'conclusions'];
  cols.forEach((colKey) => {
    const colEl = document.getElementById(`canvas-col-${colKey}`);
    if (!colEl) return;

    const cards = activeClassroomData.canvas_cards.filter((c) => c.column_key === colKey);
    colEl.innerHTML = cards
      .map(
        (c) => `
        <div class="sticky-card ${c.color_tag || 'blue'}">
          <div style="font-weight:700; margin-bottom:4px;">${c.content_ar}</div>
          <div style="font-size:0.82rem; color:var(--text-muted);" lang="he">${c.content_he}</div>
          <div class="sticky-meta">
            <span>✍️ ${c.author_name}</span>
            <button class="btn-vote-card" onclick="voteCanvasCard(${c.id})">👍 ${c.votes}</button>
          </div>
        </div>
      `
      )
      .join('');
  });
}

function submitCanvasCard(e) {
  e.preventDefault();
  if (!activeClassroomData) return;
  const column_key = document.getElementById('canvasColSelect').value;
  const content = document.getElementById('canvasCardInput').value.trim();
  if (!content) return;

  const lang = detectLang(content);
  const store = getLocalStore();
  store.canvas_cards.unshift({
    id: Date.now(),
    classroom_id: activeClassroomData.classroom.id,
    column_key,
    author_name: activeStudentSession.name,
    content_ar: lang === 'ar' ? content : smartTranslateLocal(content, 'ar'),
    content_he: lang === 'he' ? content : smartTranslateLocal(content, 'he'),
    color_tag: column_key === 'conclusions' ? 'green' : column_key === 'field_work' ? 'amber' : 'blue',
    votes: 1
  });
  saveLocalStore(store);

  document.getElementById('canvasCardInput').value = '';
  fetchClassroomById(activeClassroomData.classroom.id);
  showToast('📌 تمت إضافة البطاقة إلى لوحة العمل التعاوني باللغتين!');
}

function voteCanvasCard(cardId) {
  const store = getLocalStore();
  const card = store.canvas_cards.find((c) => c.id === Number(cardId));
  if (card) {
    card.votes = (card.votes || 1) + 1;
    saveLocalStore(store);
    fetchClassroomById(activeClassroomData.classroom.id);
  }
}

function initMentorDefaultMessage() {
  const box = document.getElementById('mentorConversationBox');
  if (!box || box.innerHTML.trim() !== '') return;
  box.innerHTML = `
    <div style="margin-bottom:10px; padding-bottom:10px; border-bottom:1px dashed var(--border-color);">
      <strong style="color:var(--navy-800);">🤖 المرشد البحثي الذكي (AI Research Mentor):</strong><br/>
      مرحباً بفريق البحث المشترك! أنا هنا لمساعدتكم بالعربية والعبرية في صياغة فرضيات البحث، مقارنة عينات المياه، أو تحضير أسئلة المقابلات مع كبار السن. اضغطوا على أحد الأزرار بالأسفل أو اكتبوا سؤالكم!
    </div>
    <div lang="he" style="color:var(--green-800);">
      שלום לצוות המחקר המשותף! אני כאן כדי לסייע לכם בערבית ובעברית בניסוח שאלות המחקר, השוואת דגימות המים או הכנת ראיונות עם ותיקי היישובים.
    </div>
  `;
}

function askMentorPreset(keyword) {
  document.getElementById('mentorQuestionInput').value = keyword;
  queryMentorAPI(keyword);
}

function submitMentorQuestion(e) {
  e.preventDefault();
  const q = document.getElementById('mentorQuestionInput').value;
  if (!q.trim()) return;
  queryMentorAPI(q);
  document.getElementById('mentorQuestionInput').value = '';
}

function queryMentorAPI(question) {
  const q = (question || '').toLowerCase();
  let reply_ar = '';
  let reply_he = '';

  if (q.includes('مياه') || q.includes('מים') || q.includes('فحص') || q.includes('عين')) {
    reply_ar =
      '💡 نصيحة المرشد الذكي لفريق البحث:\n1. قارنوا بين قياسات الحموضة (pH) والعكورة في النبعين في نفس الساعة من اليوم.\n2. اربطوا النتائج المخبرية بشهادات كبار السن: هل تغير تدفق النبع خلال الـ 50 سنة الماضية؟\n3. صمموا جدولاً مشتركاً بالعربية والعبرية يعرض الحلول البيئية المقترحة.';
    reply_he =
      '💡 עצת המנטור החכם לצוות המחקר:\n1. השוו בין מדידות החומציות (pH) והעכירות בשני המעיינות באותה שעה ביום.\n2. חברו את תוצאות המעבדה לעדויות זקני היישובים: האם השתנתה זרימת המעיין ב-50 השנים האחרונות?\n3. עצבו טבלה משותפת בערבית ובעברית המציגה את הפתרונות הסביבתיים המוצעים.';
  } else if (q.includes('مقابلة') || q.includes('كبار السن') || q.includes('ראיון') || q.includes('تراث') || q.includes('מורשת')) {
    reply_ar =
      '🎙️ دليل إجراء المقابلات التاريخية المشتركة:\n1. اتفقوا على 5 أسئلة موحدة يوجهها الطلاب لأجدادهم في البلدتين (مثلاً: كيف كنتم تحفظون الماء والغذاء قديماً؟).\n2. سجلوا الكلمات والمصطلحات المحلية المميزة وترجموها للغة الشريكة.\n3. استخرجوا القيم الإنسانية المشتركة مثل الكرم والتعاون في مواسم الحصاد.';
    reply_he =
      '🎙️ מדריך לעריכת ראיונות היסטוריים משותפים:\n1. הסכימו על 5 שאלות אחידות שהתלמידים ישאלו את הסבים והסבתות בשני היישובים (למשל: כיצד שימרתם מים ומזון בעבר?).\n2. תעדו מילים וביטויים מקומיים ייחודיים ותרגמו אותם לשפה השותפה.\n3. חלצו ערכים אנושיים משותפים כגון הכנסת אורחים ושיתוף פעולה בעונות הקציר.';
  } else {
    reply_ar = `🤖 اقتراح المرشد الذكي لموضوعكم:\n• قسّموا المهمة إلى 3 فرق ثنائية (طالب عربي + طالب يهودي في كل مهمة): فريق جمع المعطيات الميدانية، فريق التوثيق البصري، وفريق صياغة التوصيات.\n• استخدموا "لوحة العمل التعاوني" لترتيب الفرضيات والتصويت على أفضل فكرة لتقديمها في جدار الإنجازات!`;
    reply_he = `🤖 הצעת המנטור החכם לנושא שלכם:\n• חלקו את המשימה ל-3 צוותים דו-לאומיים (תלמיד ערבי + תלמיד יהודי בכל משימה): צוות איסוף נתוני שדה, צוות תיעוד חזותי וצוות ניסוח המלצות.\n• השתמשו ב"לוח העבודה השיתופי" לסידור ההשערות והצבעה על הרעיון הטוב ביותר להצגה בקיר ההישגים!`;
  }

  const box = document.getElementById('mentorConversationBox');
  box.innerHTML = `
    <div style="margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid var(--border-color);">
      ${reply_ar}
    </div>
    <div lang="he" style="color:var(--green-800);">
      ${reply_he}
    </div>
  `;
}

function loadAchievements() {
  const store = getLocalStore();
  const items = store.achievements;

  const html = items
    .map(
      (a) => `
      <div class="achievement-card">
        <div>
          <span class="ach-format-badge">🎨 ${a.format_type}</span>
          <h3>${currentLang === 'ar' ? a.title_ar : a.title_he}</h3>
          <div class="ach-schools">${currentLang === 'ar' ? a.schools_ar : a.schools_he}</div>
          <p class="ach-summary">${currentLang === 'ar' ? a.summary_ar : a.summary_he}</p>
          <div class="ach-impact">
            <strong>🌟 ${currentLang === 'ar' ? 'الأثر المجتمعي:' : 'השפעה קהילתית:'}</strong>
            ${currentLang === 'ar' ? a.impact_ar : a.impact_he}
          </div>
        </div>
        <div class="ach-footer">
          <span style="font-size:0.82rem; font-weight:800; color:var(--text-muted);">📅 دفعة ${a.year}</span>
          <button class="btn-like" onclick="likeAchievement(${a.id})">
            👏 <span class="ach-like-count-${a.id}">${a.likes}</span> ${
        currentLang === 'ar' ? 'إعجاب وتشجيع' : 'פרגון'
      }
          </button>
        </div>
      </div>
    `
    )
    .join('');

  const landingGrid = document.getElementById('landingAchievementsGrid');
  if (landingGrid) landingGrid.innerHTML = html;

  const studentGrid = document.getElementById('studentAchievementsGrid');
  if (studentGrid) studentGrid.innerHTML = html;
}

function likeAchievement(id) {
  const store = getLocalStore();
  const item = store.achievements.find((a) => a.id === Number(id));
  if (item) {
    item.likes = (item.likes || 0) + 1;
    saveLocalStore(store);
    document.querySelectorAll(`.ach-like-count-${id}`).forEach((el) => {
      el.textContent = item.likes;
    });
  }
}

// =========================================================================
// SECTION 4: SITE ADMIN DASHBOARD & FULL CONTENT MODERATION
// =========================================================================
window.isAdminLoggedIn = false;

function getAdminCredentials() {
  try {
    const raw = localStorage.getItem('bayt_admin_creds_v1');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { email: 'rami0407@gmail.com', code: '0407' };
}

function handleAdminLogin(e) {
  e.preventDefault();
  const email = (document.getElementById('adminEmailInput').value || '').trim().toLowerCase();
  const code = (document.getElementById('adminCodeInput').value || '').trim();
  const creds = getAdminCredentials();

  const validEmail = email === creds.email.toLowerCase();
  const validCode = code === creds.code;

  if (!validEmail || !validCode) {
    showToast('❌ אימייל או קוד אישי שגויים! הגישה מותרת למנהל האתר בלבד | البريد الإلكتروني أو الرمز السري غير صحيح!');
    return;
  }

  window.isAdminLoggedIn = true;
  document.getElementById('adminLoginGate').style.display = 'none';
  document.getElementById('adminDashboardContent').style.display = 'block';
  document.getElementById('adminActiveBadge').style.display = 'inline-block';
  document.getElementById('adminWelcomeIdentity').textContent = `מחובר כמנהל ראשי: ${email} | متصل كمدير الموقع`;

  document.getElementById('admSettingEmail').value = creds.email;
  document.getElementById('admSettingCode').value = creds.code;

  renderAdminDashboard();
  if (activeClassroomData) renderForumPosts();
  showToast('🛡️ ברוך הבא לדאשבורד מנהל האתר! יש לך כעת שליטה מלאה על כל התוכן באתר.');
}

function logoutAdmin() {
  window.isAdminLoggedIn = false;
  document.getElementById('adminDashboardContent').style.display = 'none';
  document.getElementById('adminLoginGate').style.display = 'block';
  document.getElementById('adminActiveBadge').style.display = 'none';
  if (activeClassroomData) renderForumPosts();
  showToast('🚪 התנתקת ממצב מנהל האתר');
}

function saveAdminCredentials(e) {
  e.preventDefault();
  const email = document.getElementById('admSettingEmail').value.trim();
  const code = document.getElementById('admSettingCode').value.trim();
  if (!email || !code) return;
  localStorage.setItem('bayt_admin_creds_v1', JSON.stringify({ email, code }));
  if (firestoreDb) {
    firestoreDb.collection('bayt_platform').doc('admin_creds').set({ email, code }).catch(() => {});
  }
  if (firebaseDb) {
    firebaseDb.ref('bayt_admin_creds_v1').set({ email, code }).catch(() => {});
  }
  document.getElementById('adminWelcomeIdentity').textContent = `מחובר כמנהל ראשי: ${email}`;
  showToast('✅ האימייל והקוד האישי שלך עודכנו ונשמרו בהצלחה!');
}

function switchAdminSubTab(tabKey) {
  ['moderation', 'news', 'schools', 'projects', 'settings'].forEach((k) => {
    const pane = document.getElementById(`admPane-${k}`);
    const btn = document.getElementById(`admTabBtn-${k}`);
    if (pane) pane.style.display = k === tabKey ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', k === tabKey);
  });
  renderAdminDashboard();
}

function checkSuspiciousContent(text) {
  if (!text) return false;
  const badWords = ['גזענ', 'שנאה', 'מוות', 'קללה', 'זבל', 'טיפש', 'שונא', 'عنصري', 'كراهية', 'شتم', 'غبي', 'لعن'];
  const lower = text.toLowerCase();
  return badWords.some((w) => lower.includes(w));
}

function renderAdminDashboard() {
  const store = getLocalStore();
  const totalSchools = store.schools.length;
  const unmatchedSchools = store.schools.filter((s) => s.matched_school_id === null).length;
  const totalReplies = store.posts.reduce((acc, p) => acc + (p.replies ? p.replies.length : 0), 0);
  const totalPostsAndReplies = store.posts.length + totalReplies;
  const totalResearchItems = store.research_data.length + store.canvas_cards.length;

  const elSchools = document.getElementById('admKpiSchools');
  const elUnmatched = document.getElementById('admKpiUnmatched');
  const elPosts = document.getElementById('admKpiPosts');
  const elRes = document.getElementById('admKpiResearch');

  if (elSchools) elSchools.textContent = totalSchools;
  if (elUnmatched) elUnmatched.textContent = unmatchedSchools;
  if (elPosts) elPosts.textContent = totalPostsAndReplies;
  if (elRes) elRes.textContent = totalResearchItems;

  renderAdminModerationList();
  renderAdminNewsList();
  renderAdminSchoolsTable();
  renderAdminProjectsControl();
}

function renderAdminModerationList() {
  const container = document.getElementById('adminModerationContainer');
  if (!container) return;

  const store = getLocalStore();
  const q = (document.getElementById('adminPostSearchInput')?.value || '').trim().toLowerCase();

  const filteredPosts = store.posts.filter((p) => {
    if (!q) return true;
    return (
      (p.author_name || '').toLowerCase().includes(q) ||
      (p.content_ar || '').toLowerCase().includes(q) ||
      (p.content_he || '').toLowerCase().includes(q) ||
      (p.school_name_ar || '').toLowerCase().includes(q) ||
      (p.school_name_he || '').toLowerCase().includes(q)
    );
  });

  if (filteredPosts.length === 0) {
    container.innerHTML = `<div style="padding:24px; text-align:center; color:var(--text-muted);">אין הודעות להצגה | لا توجد رسائل مطابقة</div>`;
    return;
  }

  container.innerHTML = filteredPosts
    .map((p) => {
      const isFlagged = checkSuspiciousContent(p.content_ar + ' ' + p.content_he);
      const flagBadge = isFlagged
        ? `<span class="badge-tag" style="background:#fee2e2; color:#991b1b; border:1px solid #ef4444;">⚠️ חשד לתוכן פוגעני / גזעני | اشتباه محتوى مخالف</span>`
        : `<span class="badge-tag" style="background:var(--green-100); color:var(--green-900);">🛡️ תוכן תקין | محتوى سليم</span>`;

      const repliesHtml = (p.replies || [])
        .map(
          (r) => `
          <div style="display:flex; align-items:center; justify-content:space-between; background:#fff; padding:10px 14px; border-radius:8px; margin-top:8px; border:1px solid var(--border-color); gap:10px; flex-wrap:wrap;">
            <div>
              <strong>💬 תגובה מאת ${r.author_name} (${r.school_name_he || r.school_name_ar}):</strong>
              <div>${r.content_he} | ${r.content_ar}</div>
            </div>
            <button type="button" class="btn-delete-danger" onclick="adminDeleteReply(${p.id}, ${r.id})">
              🗑️ מחק תגובה | حذف الرد
            </button>
          </div>
        `
        )
        .join('');

      return `
        <div class="admin-mod-item ${isFlagged ? 'flagged-item' : ''}">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:8px;">
            <div>
              ${flagBadge}
              <strong style="margin-inline-start:8px; font-size:1rem;">👤 ${p.author_name}</strong>
              <span style="color:var(--text-muted); font-size:0.86rem;"> — 🏫 ${p.school_name_he} | ${p.school_name_ar}</span>
            </div>
            <button type="button" class="btn-delete-danger" onclick="adminDeletePost(${p.id})">
              🗑️ מחק הודעה לצמיתות (גזענות / לא רלוונטי) | حذف الرسالة نهائياً
            </button>
          </div>
          <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid var(--border-color);">
            <div style="margin-bottom:6px;"><strong>עברית:</strong> ${p.content_he}</div>
            <div style="color:var(--navy-800);"><strong>العربية:</strong> ${p.content_ar}</div>
          </div>
          ${repliesHtml}
        </div>
      `;
    })
    .join('');
}

function adminDeletePost(postId) {
  const store = getLocalStore();
  store.posts = store.posts.filter((p) => p.id !== Number(postId));
  saveLocalStore(store);
  renderAdminDashboard();
  if (activeClassroomData) fetchClassroomById(activeClassroomData.classroom.id);
  showToast('🗑️ ההודעה נמחקה מהאתר לצמיתות! | تم حذف الرسالة نهائياً من الموقع');
}

function adminDeleteReply(postId, replyId) {
  const store = getLocalStore();
  const post = store.posts.find((p) => p.id === Number(postId));
  if (post && post.replies) {
    post.replies = post.replies.filter((r) => r.id !== Number(replyId));
    saveLocalStore(store);
  }
  renderAdminDashboard();
  if (activeClassroomData) fetchClassroomById(activeClassroomData.classroom.id);
  showToast('🗑️ התגובה נמחקה לצמיתות! | تم حذف الرد نهائياً');
}

function renderAdminSchoolsTable() {
  const container = document.getElementById('adminSchoolsTableContainer');
  if (!container) return;
  const store = getLocalStore();

  const rowsHtml = store.schools
    .map((s) => {
      const partner = s.matched_school_id ? store.schools.find((x) => x.id === s.matched_school_id) : null;
      const statusHtml = partner
        ? `<span class="badge-tag badge-matched">🤝 שודך עם: ${partner.name_he}</span>`
        : `<span class="badge-tag badge-unmatched">🟡 טרם שודך (פנוי)</span>`;

      return `
        <tr>
          <td><strong>#${s.id}</strong></td>
          <td>
            <div style="font-weight:800; color:var(--navy-900);">${s.name_he}</div>
            <div style="font-size:0.84rem; color:var(--green-800);">${s.name_ar}</div>
          </td>
          <td>${s.city_he} | ${s.city_ar}</td>
          <td>${SECTOR_LABELS[s.sector]?.he || s.sector}</td>
          <td>${STAGE_LABELS[s.age_stage]?.he || s.age_stage} (${s.target_grades})</td>
          <td>
            <div><strong>${s.contact_name}</strong></div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${s.contact_email} • ${s.contact_phone}</div>
          </td>
          <td>${statusHtml}</td>
          <td>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn btn-blue btn-sm" style="padding:5px 10px; font-size:0.78rem;" onclick="adminLoginAsSchool(${s.id})">
                🏫 התחבר כבית ספר זה
              </button>
              ${
                partner
                  ? `<button type="button" class="btn-ai-replace" style="padding:5px 10px; font-size:0.78rem;" onclick="adminUnmatchSchool(${s.id})">🔄 בטל שידוך</button>`
                  : ''
              }
              <button type="button" class="btn-delete-danger" style="padding:5px 10px; font-size:0.78rem;" onclick="adminDeleteSchool(${s.id})">
                🗑️ מחק
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table class="admin-schools-table">
        <thead>
          <tr>
            <th>#</th>
            <th>שם בית הספר (עברית / ערבית)</th>
            <th>יישוב / עיר</th>
            <th>מגזר</th>
            <th>שכבת גיל</th>
            <th>איש קשר ופרטים</th>
            <th>סטטוס שידוך</th>
            <th>פעולות מנהל</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

function adminLoginAsSchool(schoolId) {
  switchLoggedInSchool(schoolId);
  navigateTo('portal');
  switchPortalMode('dashboard');
}

function adminUnmatchSchool(schoolId) {
  const store = getLocalStore();
  const s = store.schools.find((x) => x.id === Number(schoolId));
  if (s && s.matched_school_id) {
    const partner = store.schools.find((x) => x.id === s.matched_school_id);
    if (partner) partner.matched_school_id = null;
    s.matched_school_id = null;
    saveLocalStore(store);
    loadPlatformStats();
    loadAllSchools();
    renderAdminDashboard();
    showToast('🔄 השידוך בוטל ובית הספר סומן שוב כ"טרם שודך"');
  }
}

function adminDeleteSchool(schoolId) {
  const store = getLocalStore();
  if (store.schools.length <= 2) {
    showToast('⚠️ יש להשאיר לפחות 2 בתי ספר במערכת');
    return;
  }
  store.schools = store.schools.filter((s) => s.id !== Number(schoolId));
  saveLocalStore(store);
  loadPlatformStats();
  loadAllSchools();
  renderAdminDashboard();
  showToast('🗑️ בית הספר נמחק מהמערכת!');
}

function renderAdminProjectsControl() {
  const container = document.getElementById('adminProjectsContainer');
  if (!container) return;
  const store = getLocalStore();

  const researchHtml = store.research_data
    .map(
      (r) => `
      <div class="admin-mod-item" style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div>
          <strong>🧪 [מעבדת מחקר] ${r.title_he} | ${r.title_ar}</strong>
          <div style="font-size:0.85rem; color:var(--text-muted);">📍 ${r.town_he} • 👤 ${r.author_name}</div>
          <div style="font-size:0.88rem; margin-top:4px;">${r.summary_he}</div>
        </div>
        <button type="button" class="btn-delete-danger" onclick="adminDeleteResearchItem(${r.id})">
          🗑️ מחק פריט מחקר
        </button>
      </div>
    `
    )
    .join('');

  const canvasHtml = store.canvas_cards
    .map(
      (c) => `
      <div class="admin-mod-item" style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div>
          <strong>📌 [לוח עבודה שיתופי] ${c.author_name}:</strong>
          <div>${c.content_he} | ${c.content_ar}</div>
        </div>
        <button type="button" class="btn-delete-danger" onclick="adminDeleteCanvasCard(${c.id})">
          🗑️ מחק כרטיס
        </button>
      </div>
    `
    )
    .join('');

  container.innerHTML = `
    <h3 style="margin-bottom:12px; color:var(--navy-900);">📂 נתוני מחקר שהועלו (${store.research_data.length})</h3>
    ${researchHtml || '<p>אין נתונים</p>'}
    <h3 style="margin:24px 0 12px; color:var(--navy-900);">📌 כרטיסים בלוח השיתופי (${store.canvas_cards.length})</h3>
    ${canvasHtml || '<p>אין כרטיסים</p>'}
  `;
}

function adminDeleteResearchItem(id) {
  const store = getLocalStore();
  store.research_data = store.research_data.filter((r) => r.id !== Number(id));
  saveLocalStore(store);
  renderAdminDashboard();
  if (activeClassroomData) fetchClassroomById(activeClassroomData.classroom.id);
  showToast('🗑️ פריט המחקר נמחק!');
}

function adminDeleteCanvasCard(id) {
  const store = getLocalStore();
  store.canvas_cards = store.canvas_cards.filter((c) => c.id !== Number(id));
  saveLocalStore(store);
  renderAdminDashboard();
  if (activeClassroomData) fetchClassroomById(activeClassroomData.classroom.id);
  showToast('🗑️ הכרטיס נמחק מהלוח השיתופי!');
}

// =========================================================================
// LIVE HERO NEWS FEED & ADMIN NEWS MANAGEMENT
// =========================================================================
let activeHeroNewsFilter = 'all';

const NEWS_TYPE_LABELS = {
  admin: { ar: '📢 إعلان الإدارة', he: '📢 הודעת הנהלה' },
  school: { ar: '🏫 مدرسة جديدة', he: '🏫 בית ספר חדש' },
  partnership: { ar: '🤝 شراكة جديدة', he: '🤝 שותפות חדשה' },
  event: { ar: '📅 فعالية / بحث', he: '📅 אירוע / מחקר' }
};

function addAutoPlatformNews({ type = 'school', title_ar, title_he, body_ar, body_he, pinned = false }) {
  const store = getLocalStore();
  if (!Array.isArray(store.news)) store.news = [];
  const today = new Date().toISOString().slice(0, 10);
  store.news.unshift({
    id: Date.now(),
    type,
    pinned,
    date: today,
    title_ar,
    title_he,
    body_ar,
    body_he
  });
  saveLocalStore(store);
  renderHeroNewsFeed(activeHeroNewsFilter);
  renderAdminNewsList();
}

function filterHeroNews(filterType) {
  activeHeroNewsFilter = filterType;
  document.querySelectorAll('#heroNewsFilters .news-filter-pill').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-news-filter') === filterType);
  });
  renderHeroNewsFeed(filterType);
}

function renderHeroNewsFeed(filterType = activeHeroNewsFilter) {
  const listEl = document.getElementById('heroNewsFeedList');
  const tickerEl = document.getElementById('heroTickerText');
  if (!listEl) return;

  const store = getLocalStore();
  const allNews = Array.isArray(store.news) ? [...store.news] : [];
  allNews.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.id - a.id);

  if (tickerEl) {
    const topItem = allNews[0];
    if (topItem) {
      tickerEl.textContent = currentLang === 'he' ? topItem.title_he : topItem.title_ar;
    } else {
      tickerEl.textContent =
        currentLang === 'he'
          ? 'ברוכים הבאים לרשת בַּיִת — כל בתי הספר מוזמנים להצטרף'
          : 'أهلاً بكم في شبكة بَيْت — جميع المدارس مدعوة للانضمام';
    }
  }

  const filtered =
    filterType === 'all' ? allNews : allNews.filter((item) => item.type === filterType);

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="hero-news-item" style="text-align:center; color:var(--text-muted);">
        ${currentLang === 'he' ? 'אין כרגע עדכונים בקטגוריה זו.' : 'لا توجد أخبار حالياً في هذا التصنيف.'}
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered
    .slice(0, 8)
    .map((item) => {
      const badge = NEWS_TYPE_LABELS[item.type]
        ? NEWS_TYPE_LABELS[item.type][currentLang]
        : NEWS_TYPE_LABELS.admin[currentLang];
      const title = currentLang === 'he' ? item.title_he : item.title_ar;
      const body = currentLang === 'he' ? item.body_he : item.body_ar;
      const pinTag = item.pinned
        ? `<span style="color:#b45309; font-weight:900; font-size:0.72rem;">📌 ${currentLang === 'he' ? 'נעוץ' : 'مثبّت'}</span>`
        : '';

      return `
        <article class="hero-news-item news-type-${item.type}">
          <div class="news-item-top">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="news-item-badge">${badge}</span>
              ${pinTag}
            </div>
            <span class="news-item-date">${item.date || ''}</span>
          </div>
          <div class="news-item-title">${title}</div>
          <p class="news-item-body">${body}</p>
        </article>
      `;
    })
    .join('');

  startHeroNewsSlowMotion(allNews);
}

let heroNewsScrollTimer = null;
let heroTickerRotateTimer = null;
let heroNewsPaused = false;
let heroTickerIdx = 0;

function startHeroNewsSlowMotion(allNews = []) {
  const listEl = document.getElementById('heroNewsFeedList');
  const tickerEl = document.getElementById('heroTickerText');

  if (heroNewsScrollTimer) clearInterval(heroNewsScrollTimer);
  if (heroTickerRotateTimer) clearInterval(heroTickerRotateTimer);

  // Slow continuous vertical scroll of the news cards (pauses on hover/touch)
  if (listEl) {
    if (!listEl.dataset.hoverBound) {
      listEl.dataset.hoverBound = '1';
      listEl.addEventListener('mouseenter', () => { heroNewsPaused = true; });
      listEl.addEventListener('mouseleave', () => { heroNewsPaused = false; });
      listEl.addEventListener('touchstart', () => { heroNewsPaused = true; }, { passive: true });
      listEl.addEventListener('touchend', () => {
        setTimeout(() => { heroNewsPaused = false; }, 2200);
      });
    }

    listEl.scrollTop = 0;
    let pauseAtEdge = 0;
    heroNewsScrollTimer = setInterval(() => {
      if (heroNewsPaused) return;
      const maxScroll = listEl.scrollHeight - listEl.clientHeight;
      if (maxScroll <= 4) return;

      if (pauseAtEdge > 0) {
        pauseAtEdge--;
        return;
      }

      if (listEl.scrollTop >= maxScroll - 1) {
        pauseAtEdge = 35; // brief calm pause at bottom before looping gently to top
        setTimeout(() => {
          if (!heroNewsPaused) listEl.scrollTop = 0;
        }, 1400);
      } else {
        listEl.scrollTop += 1; // ~1px every 55ms -> very smooth, slow, readable motion
      }
    }, 55);
  }

  // Slow rotation of the top breaking news headline every 5 seconds
  if (tickerEl && allNews.length > 1) {
    heroTickerIdx = 0;
    heroTickerRotateTimer = setInterval(() => {
      if (heroNewsPaused) return;
      heroTickerIdx = (heroTickerIdx + 1) % allNews.length;
      const nextItem = allNews[heroTickerIdx];
      if (!nextItem) return;

      tickerEl.classList.add('ticker-fade');
      setTimeout(() => {
        tickerEl.textContent = currentLang === 'he' ? nextItem.title_he : nextItem.title_ar;
        tickerEl.classList.remove('ticker-fade');
      }, 380);
    }, 5000);
  }
}

async function translateAdminNewsWithAI() {
  const titleHeEl = document.getElementById('adminNewsTitleHe');
  const titleArEl = document.getElementById('adminNewsTitleAr');
  const bodyHeEl = document.getElementById('adminNewsBodyHe');
  const bodyArEl = document.getElementById('adminNewsBodyAr');
  if (!titleHeEl || !titleArEl || !bodyHeEl || !bodyArEl) return;

  const hasHe = (titleHeEl.value.trim() || bodyHeEl.value.trim()).length > 0;
  const hasAr = (titleArEl.value.trim() || bodyArEl.value.trim()).length > 0;

  if (!hasHe && !hasAr) {
    showToast('⚠️ اكتب الخبر بالعربية أو العبرية أولاً ثم اضغط للترجمة التلقائية');
    return;
  }

  showToast('⚡ جاري الترجمة الذكية للخبر...');
  if (hasHe && !titleArEl.value.trim() && titleHeEl.value.trim()) {
    titleArEl.value = await translateTextWithNeuralAI(titleHeEl.value.trim(), 'he', 'ar');
  } else if (hasAr && !titleHeEl.value.trim() && titleArEl.value.trim()) {
    titleHeEl.value = await translateTextWithNeuralAI(titleArEl.value.trim(), 'ar', 'he');
  }

  if (hasHe && !bodyArEl.value.trim() && bodyHeEl.value.trim()) {
    bodyArEl.value = await translateTextWithNeuralAI(bodyHeEl.value.trim(), 'he', 'ar');
  } else if (hasAr && !bodyHeEl.value.trim() && bodyArEl.value.trim()) {
    bodyHeEl.value = await translateTextWithNeuralAI(bodyArEl.value.trim(), 'ar', 'he');
  }
  showToast('✅ تمت الترجمة التلقائية للخبر بين العربية والعبرية!');
}

function addAdminNewsItem(e) {
  e.preventDefault();
  const type = document.getElementById('adminNewsType')?.value || 'admin';
  const pinned = Boolean(document.getElementById('adminNewsPinned')?.checked);
  const title_he = (document.getElementById('adminNewsTitleHe')?.value || '').trim();
  const title_ar = (document.getElementById('adminNewsTitleAr')?.value || '').trim();
  const body_he = (document.getElementById('adminNewsBodyHe')?.value || '').trim();
  const body_ar = (document.getElementById('adminNewsBodyAr')?.value || '').trim();

  if (!title_he || !title_ar || !body_he || !body_ar) {
    showToast('⚠️ يرجى تعبئة العنوان والنص باللغتين (أو استخدام زر الترجمة التلقائية)');
    return;
  }

  addAutoPlatformNews({ type, pinned, title_ar, title_he, body_ar, body_he });
  e.target.reset();
  const pinChk = document.getElementById('adminNewsPinned');
  if (pinChk) pinChk.checked = true;
  showToast('📢 تم نشر الخبر بنجاح في الشريط الإخباري لصفحة الهبوط!');
}

function togglePinAdminNews(id) {
  const store = getLocalStore();
  if (!Array.isArray(store.news)) return;
  const item = store.news.find((n) => n.id === Number(id));
  if (!item) return;
  item.pinned = !item.pinned;
  saveLocalStore(store);
  renderHeroNewsFeed(activeHeroNewsFilter);
  renderAdminNewsList();
  showToast(item.pinned ? '📌 تم تثبيت الخبر في أعلى الشريط الإخباري' : 'تم إلغاء تثبيت الخبر');
}

function deleteAdminNewsItem(id) {
  const store = getLocalStore();
  if (!Array.isArray(store.news)) return;
  store.news = store.news.filter((n) => n.id !== Number(id));
  saveLocalStore(store);
  renderHeroNewsFeed(activeHeroNewsFilter);
  renderAdminNewsList();
  showToast('🗑️ تم حذف الخبر من صفحة الهبوط!');
}

function renderAdminNewsList() {
  const container = document.getElementById('adminNewsListContainer');
  if (!container) return;
  const store = getLocalStore();
  const newsList = Array.isArray(store.news) ? [...store.news] : [];
  newsList.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.id - a.id);

  if (newsList.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);">אין חדשות כרגע | لا توجد أخبار حالياً.</p>';
    return;
  }

  container.innerHTML = newsList
    .map((n) => {
      const lbl = NEWS_TYPE_LABELS[n.type]?.ar || '📢 إعلان';
      return `
        <div class="admin-mod-item" style="display:flex; justify-content:space-between; align-items:flex-start; gap:14px; flex-wrap:wrap;">
          <div style="flex:1; min-width:240px;">
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:6px;">
              <span class="news-item-badge">${lbl}</span>
              ${n.pinned ? '<span class="badge-tag badge-matched">📌 مثبت بالأعلى | נעוץ</span>' : ''}
              <span style="font-size:0.78rem; color:var(--text-muted); font-weight:700;">${n.date || ''}</span>
            </div>
            <strong style="display:block; color:var(--navy-900); margin-bottom:3px;">${n.title_ar} | ${n.title_he}</strong>
            <p style="margin:0; font-size:0.86rem; color:var(--text-main);">${n.body_ar}<br/>${n.body_he}</p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn btn-outline-blue btn-sm" onclick="togglePinAdminNews(${n.id})">
              ${n.pinned ? '📌 إلغاء التثبيت' : '📌 تثبيت بالأعلى'}
            </button>
            <button type="button" class="btn-delete-danger" onclick="deleteAdminNewsItem(${n.id})">
              🗑️ حذف | מחיקה
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

// =========================================================================
// SCHOOL PARTNERSHIP HUB (PRIVATE STUDENTS + SHARED FORUM + JOINT PROJECTS)
// =========================================================================
let activeSchoolHubTab = 'students';

function switchSchoolHubTab(tabKey) {
  activeSchoolHubTab = tabKey;
  ['students', 'groups', 'forum', 'projects'].forEach((k) => {
    const pane = document.getElementById(`hubPane-${k}`);
    const btn = document.getElementById(`hubTabBtn-${k}`);
    if (pane) pane.style.display = k === tabKey ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', k === tabKey);
  });
  renderSchoolPartnershipHub();
}

let activeHubRoomId = null;
let activeStudentSelectedGroupId = null;

function selectSchoolHubRoom(roomId) {
  activeHubRoomId = Number(roomId);
  renderSchoolPartnershipHub();
}

function getMatchedContextForSchool(schoolId) {
  const store = getLocalStore();
  const school = store.schools.find((s) => s.id === Number(schoolId));
  if (!school) return null;

  const rooms = store.classrooms.filter(
    (c) => Number(c.school_a_id) === school.id || Number(c.school_b_id) === school.id
  );
  const room =
    rooms.find((r) => Number(r.id) === Number(activeHubRoomId)) || rooms[0] || null;
  if (room) activeHubRoomId = room.id;

  const partnerId = room
    ? Number(room.school_a_id) === school.id
      ? Number(room.school_b_id)
      : Number(room.school_a_id)
    : school.matched_school_id;
  const partner = partnerId ? store.schools.find((s) => s.id === Number(partnerId)) : null;

  return { store, school, room, rooms, partner };
}

function renderSchoolPartnershipHub() {
  if (!activeDashboardSchool) return;
  const ctx = getMatchedContextForSchool(activeDashboardSchool.id);
  if (!ctx) return;

  const { store, school, room, rooms, partner } = ctx;
  const subtitleEl = document.getElementById('schoolHubSubtitle');
  const partnerBadgeEl = document.getElementById('schoolHubPartnerBadge');
  const codeInfoEl = document.getElementById('hubStudentAccessCodeInfo');
  const roomsBarEl = document.getElementById('schoolHubRoomsBar');

  if (roomsBarEl) {
    const otherSchools = store.schools.filter((s) => Number(s.id) !== Number(school.id));
    const roomPillsHtml = (rooms || [])
      .map((r) => {
        const pId = Number(r.school_a_id) === Number(school.id) ? r.school_b_id : r.school_a_id;
        const pSch = store.schools.find((s) => Number(s.id) === Number(pId));
        const label = r.grade_label ? `${r.grade_label}` : `${r.code}`;
        const isCurrent = room && Number(r.id) === Number(room.id);
        return `<button type="button" class="room-chip-btn ${isCurrent ? 'active' : ''}" onclick="selectSchoolHubRoom(${r.id})">🏫 ${escapeHtml(label)} 🤝 ${escapeHtml(pSch ? pSch.name_ar : '')} (${escapeHtml(r.code)})</button>`;
      })
      .join('');

    roomsBarEl.innerHTML = `
      <div class="school-rooms-bar">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:${rooms.length > 0 ? '8px' : '0'};">
          <strong style="font-size:0.88rem; color:var(--navy-900);">🏫 الشراكات والصفوف النشطة للمدرسة (${rooms.length}) | כיתות ושותפויות בית הספר:</strong>
          <button type="button" class="btn btn-sm btn-green" onclick="toggleExtraClassPartnershipForm()">
            ➕ إضافة صف / شعبة بشراكة جديدة | הוסף כיתה לשותפות
          </button>
        </div>
        ${rooms.length > 0 ? `<div class="school-rooms-pills">${roomPillsHtml}</div>` : ''}
        <form id="extraClassPartnershipForm" onsubmit="createExtraClassPartnership(event, ${school.id})" style="display:none; margin-top:12px; padding-top:12px; border-top:1px dashed #cbd5e1;">
          <div class="form-grid-3" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:10px; align-items:end;">
            <div class="form-group" style="margin:0;">
              <label style="font-size:0.82rem;">اسم الصف / الشعبة | כיתה / שכבה *</label>
              <input type="text" id="extraClassGradeInput" required placeholder="مثلاً: السابع أ | ז׳1" />
            </div>
            <div class="form-group" style="margin:0;">
              <label style="font-size:0.82rem;">المدرسة الشريكة | בית הספר השותף *</label>
              <select id="extraClassPartnerSelect" required>
                <option value="">-- اختر مدرسة --</option>
                ${otherSchools.map((s) => `<option value="${s.id}">${escapeHtml(s.name_ar)} | ${escapeHtml(s.name_he)} (${escapeHtml(s.city_ar)})</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label style="font-size:0.82rem;">موضوع البحث (اختياري)</label>
              <input type="text" id="extraClassTopicInput" placeholder="مثلاً: الطاقة المتجددة" />
            </div>
          </div>
          <div style="margin-top:10px; display:flex; gap:8px;">
            <button type="submit" class="btn btn-blue btn-sm">✅ إنشاء غرفة الصف المشتركة</button>
            <button type="button" class="btn btn-sm" style="background:#e2e8f0; color:#0f172a;" onclick="toggleExtraClassPartnershipForm()">إلغاء</button>
          </div>
        </form>
      </div>
    `;
  }

  const schoolSide = room && Number(room.school_b_id) === school.id ? 'b' : 'a';
  const studentRoomCode = room ? room.code : `BAYT-${school.id}0${school.id}`;

  if (subtitleEl) {
    subtitleEl.textContent = partner
      ? `שותפות פעילה עם: ${partner.name_he} (${partner.city_he}) | شراكة نشطة مع: ${partner.name_ar} (${partner.city_ar})`
      : 'הזן את נתוני התלמידים של בית ספרך, ולאחר בחירת בית ספר לשידוך תיפתח כאן גישה מלאה לפורום ולפרויקטים המשותפים.';
  }

  if (partnerBadgeEl) {
    partnerBadgeEl.innerHTML = partner && room
      ? `<div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
           <span class="badge-tag badge-matched">🤝 שותף: ${partner.name_he} | ${partner.name_ar}</span>
           <span class="badge-tag badge-distance">🔑 קוד כיתה: ${room.code}</span>
           <button type="button" class="btn btn-blue btn-sm" onclick="enterMatchedStudentWorkspace(${room.id}, '${schoolSide}')">
             🚀 כניסה למרחב התלמידים המלא
           </button>
         </div>`
      : `<span class="badge-tag badge-unmatched">🟡 טרם נבחר בית ספר לשידוך — בחר שותף למטה</span>`;
  }

  if (codeInfoEl) {
    codeInfoEl.textContent = `🔑 קוד כניסה לתלמידי בית ספרך: ${studentRoomCode}`;
  }

  // 0. Render Pending Student Join Requests (waiting for school approval)
  const pendingContainer = document.getElementById('hubPendingStudentsContainer');
  if (pendingContainer) {
    const pendingList = Array.isArray(school.pending_students) ? school.pending_students : [];
    if (pendingList.length === 0) {
      pendingContainer.innerHTML = '';
    } else {
      pendingContainer.innerHTML = `
        <div style="background:#fffbeb; border:2px solid #f59e0b; border-radius:14px; padding:14px; margin-bottom:14px;">
          <div style="font-weight:900; color:#92400e; margin-bottom:8px;">
            ⏳ طلبات انضمام طلاب بانتظار إذن المدرسة (${pendingList.length} طلبات):
          </div>
          <div class="admin-table-wrapper">
            <table class="admin-schools-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>الاسم | שם</th>
                  <th>رقم الهوية | ת.ז</th>
                  <th>الصف | כיתה</th>
                  <th>الفريق | צוות</th>
                  <th>إذن الدخول | אישור</th>
                </tr>
              </thead>
              <tbody>
                ${pendingList
                  .map(
                    (st, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${st.name}</strong></td>
                    <td dir="ltr">${st.studentIdNumber || '—'}</td>
                    <td>${st.grade}</td>
                    <td>${st.team || 'عام'}</td>
                    <td style="display:flex; gap:6px; flex-wrap:wrap;">
                      <button type="button" class="btn btn-green btn-sm" onclick="approvePendingStudent(${st.id})">✅ منح إذن الدخول</button>
                      <button type="button" class="btn-delete-danger" onclick="rejectPendingStudent(${st.id})">❌ رفض</button>
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }
  }

  // 1. Render Private Student Roster (ONLY this school's students)
  const studentsContainer = document.getElementById('hubStudentsListContainer');
  if (studentsContainer) {
    const myStudents = Array.isArray(school.students) ? school.students : [];
    if (myStudents.length === 0) {
      studentsContainer.innerHTML = `
        <div style="text-align:center; padding:18px; color:var(--text-muted); border:1.5px dashed var(--border-color); border-radius:12px;">
          עדיין לא הוזנו תלמידים לבית ספר זה (${school.name_he}). השתמש בטופס למעלה או העלה קובץ אקסל להוספת תלמידי בית ספרך.
        </div>
      `;
    } else {
      studentsContainer.innerHTML = `
        <div style="font-weight:800; color:var(--navy-900); margin-bottom:8px;">
          📋 قائمة طلاب ${school.name_ar} | רשימת תלמידי ${school.name_he} (${myStudents.length} طالب/ة):
        </div>
        <div class="admin-table-wrapper">
          <table class="admin-schools-table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم الطالب/ة | שם התלמיד/ה</th>
                <th>رقم الهوية | ת.ז / קוד</th>
                <th>الصف | כיתה</th>
                <th>الفريق | צוות</th>
                <th>إدارة وتعديل | פעולות</th>
              </tr>
            </thead>
            <tbody>
              ${myStudents
                .map(
                  (st, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${st.name}</strong></td>
                  <td dir="ltr">${st.studentIdNumber || '—'}</td>
                  <td>${st.grade}</td>
                  <td>${st.team || 'כללי | عام'}</td>
                  <td style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button type="button" class="btn btn-blue btn-sm" onclick="editSchoolStudent(${st.id})">✏️ تعديل</button>
                    <button type="button" class="btn-delete-danger" onclick="deleteSchoolStudent(${st.id})">🗑️ حذف</button>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  // 2. Render Shared Forum of the Two Matched Schools
  const forumContainer = document.getElementById('hubForumContent');
  if (forumContainer) {
    if (!room || !partner) {
      forumContainer.innerHTML = `
        <div class="hub-empty-match-box">
          <h4>💬 הפורום המשותף ייפתח מיד לאחר בחירת בית ספר לשידוך</h4>
          <p>גלול למטה, בחר בית ספר מתאים מהרשימה ולחץ על <strong>"إنشاء الغرفة المشتركة | פתיחת חדר משותף"</strong>.</p>
        </div>
      `;
    } else {
      const roomPosts = store.posts.filter((p) => Number(p.classroom_id) === Number(room.id));
      forumContainer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
          <div>
            <h4 style="color:var(--navy-900); margin:0;">💬 הפורום המשותף: ${school.name_he} 🤝 ${partner.name_he}</h4>
            <span style="font-size:0.84rem; color:var(--text-muted);">${roomPosts.length} הודעות משותפות מתורגמות בזמן אמת</span>
          </div>
          <button type="button" class="btn btn-blue btn-sm" onclick="enterMatchedStudentWorkspace(${room.id}, '${schoolSide}')">
            🚀 פתח את הפורום המלא במרחב התלמידים
          </button>
        </div>

        <form onsubmit="submitHubForumPost(event, ${room.id}, '${schoolSide}')" style="background:var(--bg-soft); padding:14px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:16px;">
          <label style="font-weight:800; color:var(--navy-900); display:block; margin-bottom:6px;">
            ✍️ פרסם הודעה חדשה בשם הנהלת/רכזי ${school.name_he} בפורום המשותף:
          </label>
          <textarea id="hubForumPostInput" rows="3" required placeholder="כתבו הודעה בעברית או בערבית לשותפים מ-${partner.name_he}... המערכת תתרגם אוטומטית לשתי השפות!"></textarea>
          <div style="margin-top:10px;">
            <button type="submit" class="btn btn-green btn-sm">📨 פרסם בפורום המשותף | نشر في المنتدى المشترك</button>
          </div>
        </form>

        <div style="display:flex; flex-direction:column; gap:10px; max-height:360px; overflow-y:auto;">
          ${
            roomPosts.length === 0
              ? '<p style="color:var(--text-muted);">אין עדיין הודעות בפורום המשותף. היו הראשונים לכתוב!</p>'
              : roomPosts
                  .map(
                    (p) => `
                <div class="admin-mod-item" style="background:#fff; margin-bottom:0;">
                  <div style="display:flex; justify-content:space-between; gap:8px; margin-bottom:6px;">
                    <strong>👤 ${p.author_name} (${p.school_side === 'a' ? p.school_name_ar : p.school_name_he})</strong>
                    <span class="news-item-badge">${CATEGORY_LABELS[p.category]?.he || '💬 דיון'}</span>
                  </div>
                  <div style="color:var(--navy-900); font-weight:600; margin-bottom:4px;">${p.content_he}</div>
                  <div style="color:var(--green-800); font-size:0.86rem;">${p.content_ar}</div>
                </div>
              `
                  )
                  .join('')
          }
        </div>
      `;
    }
  }

  // 3. Render Joint Projects, Research Topic & Collaborative Canvas
  const projectsContainer = document.getElementById('hubProjectsContent');
  if (projectsContainer) {
    if (!room || !partner) {
      projectsContainer.innerHTML = `
        <div class="hub-empty-match-box">
          <h4>🔬 מעבדת הפרויקטים המשותפים תיפתח לאחר השידוך</h4>
          <p>בחר בית ספר שותף למטה כדי לנהל יחד נושא מחקר, נתוני שדה וכרטיסי עבודה משותפים.</p>
        </div>
      `;
    } else {
      const roomResearch = store.research_data.filter((r) => Number(r.classroom_id) === Number(room.id));
      const roomCards = store.canvas_cards.filter((c) => Number(c.classroom_id) === Number(room.id));

      projectsContainer.innerHTML = `
        <form onsubmit="saveHubResearchTopic(event, ${room.id})" style="background:#f0f9ff; border:1.5px solid #bae6fd; border-radius:12px; padding:16px; margin-bottom:18px;">
          <h4 style="color:var(--navy-900); margin-bottom:10px;">🔬 נושא המחקר והפרויקט המשותף של שני בתי הספר:</h4>
          <div class="form-grid-2" style="margin-bottom:10px;">
            <div class="form-group">
              <label>נושא המחקר בעברית *</label>
              <input type="text" id="hubTopicHe" required value="${room.research_topic_he}" />
            </div>
            <div class="form-group">
              <label>موضوع البحث بالعربية *</label>
              <input type="text" id="hubTopicAr" required value="${room.research_topic_ar}" />
            </div>
          </div>
          <button type="submit" class="btn btn-blue btn-sm">💾 עדכן נושא מחקר משותף | حفظ الموضوع المشترك</button>
        </form>

        <div class="form-grid-2">
          <div style="background:var(--bg-soft); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
            <h4 style="color:var(--navy-900); margin-bottom:10px;">📂 נתוני שדה שהועלו בפרויקט (${roomResearch.length})</h4>
            ${
              roomResearch.length === 0
                ? '<p style="color:var(--text-muted); font-size:0.88rem;">טרם הועלו נתוני שדה משותפים.</p>'
                : roomResearch
                    .map(
                      (r) => `
                  <div style="background:#fff; padding:10px; border-radius:10px; border:1px solid var(--border-color); margin-bottom:8px;">
                    <strong>${r.title_he} | ${r.title_ar}</strong>
                    <div style="font-size:0.82rem; color:var(--text-muted);">${r.author_name}</div>
                    <div style="font-size:0.84rem; margin-top:4px;">${r.notes_he}</div>
                  </div>
                `
                    )
                    .join('')
            }
          </div>

          <div style="background:var(--bg-soft); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
            <h4 style="color:var(--navy-900); margin-bottom:10px;">📌 לוח משימות ורעיונות משותף (${roomCards.length})</h4>
            <form onsubmit="addHubCanvasCard(event, ${room.id})" style="display:flex; gap:8px; margin-bottom:12px;">
              <input type="text" id="hubNewCardInput" required placeholder="הוסף משימה או רעיון לפרויקט המשותף..." />
              <button type="submit" class="btn btn-green btn-sm">➕ הוסף</button>
            </form>
            ${
              roomCards.length === 0
                ? '<p style="color:var(--text-muted); font-size:0.88rem;">אין עדיין כרטיסים בלוח המשותף.</p>'
                : roomCards
                    .map(
                      (c) => `
                  <div style="background:#fff; padding:10px; border-radius:10px; border:1px solid var(--border-color); margin-bottom:8px;">
                    <div style="font-size:0.86rem; font-weight:700; color:var(--navy-900);">${c.content_he}</div>
                    <div style="font-size:0.82rem; color:var(--green-800);">${c.content_ar}</div>
                  </div>
                `
                    )
                    .join('')
            }
          </div>
        </div>
      `;
    }
  }

  // 4. Render Joint Student Groups (Auto & Manual)
  renderHubJointGroups(store, school, room, partner);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getStudentSafeKey(stu, idx) {
  return String(stu.id || `${stu.name || ''}_${idx}`);
}

function normalizeTeamLabel(teamStr) {
  return String(teamStr || '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function renderHubJointGroups(store, school, room, partner) {
  const container = document.getElementById('hubGroupsContent');
  if (!container) return;

  if (!partner || !room) {
    container.innerHTML = `
      <div style="background:var(--gold-100); border:1px solid var(--gold-500); border-radius:12px; padding:18px; color:#92400e;">
        <strong>🔒 المجموعات المشتركة مغلقة حتى اختيار المدرسة الشريكة | הקבוצות המשותפות ייפתחו לאחר בחירת בית הספר השותף</strong>
        <p style="margin:6px 0 0; font-size:0.9rem;">
          بعد إدخال طلاب مدرستك واختيار المدرسة الشريكة، ستتمكن من تقسيم الطلاب إلى مجموعات عمل مشتركة بين المدرستين تلقائياً أو يدوياً.
        </p>
      </div>
    `;
    return;
  }

  const myStudents = Array.isArray(school.students) ? school.students : [];
  const partnerStudents = Array.isArray(partner.students) ? partner.students : [];
  const groups = Array.isArray(room.joint_groups) ? room.joint_groups : [];

  // Track which students are already assigned to at least one group
  const assignedKeys = new Set();
  groups.forEach((g) => {
    (g.members || []).forEach((m) => {
      assignedKeys.add(`${m.school_id}:${m.student_key}`);
    });
  });

  const renderPickerList = (studentsList, ownerSchool) => {
    if (studentsList.length === 0) {
      return `<p style="font-size:0.84rem; color:var(--text-muted); margin:6px 0;">لا يوجد طلاب مسجلون بعد في ${ownerSchool.name_ar}.</p>`;
    }
    return studentsList
      .map((stu, idx) => {
        const sKey = getStudentSafeKey(stu, idx);
        const isAssigned = assignedKeys.has(`${ownerSchool.id}:${sKey}`);
        const teamText = stu.team ? ` • ${stu.team}` : '';
        return `
          <label class="student-picker-item">
            <input type="checkbox" class="manual-group-stu-cb" data-school-id="${ownerSchool.id}" data-student-key="${sKey}" data-student-name="${escapeHtml(stu.name)}" data-student-grade="${escapeHtml(stu.grade || '')}" data-student-team="${escapeHtml(stu.team || '')}" />
            <span>
              <strong>${escapeHtml(stu.name)}</strong>
              <span style="color:var(--text-muted); font-size:0.8rem;">(${escapeHtml(stu.grade || '-')}${escapeHtml(teamText)})</span>
              ${isAssigned ? '<span style="background:#dcfce7; color:#166534; font-size:0.72rem; padding:1px 6px; border-radius:999px; margin-inline-start:4px;">في مجموعة</span>' : ''}
            </span>
          </label>
        `;
      })
      .join('');
  };

  container.innerHTML = `
    <div class="hub-privacy-note" style="margin-bottom:16px;">
      🤝 <strong>بناء المجموعات المشتركة بين المدرستين | בניית קבוצות משותפות:</strong>
      تظهر هنا أسماء الطلاب والصف والفريق فقط (بدون أرقام الهوية) للحفاظ على الخصوصية الكاملة. يمكنك التقسيم <strong>تلقائياً</strong> أو <strong>يدوياً</strong> وتعديل أي مجموعة لاحقاً.
    </div>

    <div class="groups-builder-grid">
      <!-- Option 1: Automatic Balanced Grouping -->
      <div class="groups-builder-card auto-card">
        <h4 style="color:var(--navy-900); margin:0 0 8px;">⚡ 1. التقسيم التلقائي الذكي | חלוקה אוטומטית</h4>
        <p style="font-size:0.86rem; color:var(--text-muted); margin:0 0 12px;">
          يوزع النظام طلاب <strong>${escapeHtml(school.name_ar)}</strong> (${myStudents.length} طالب) وطلاب <strong>${escapeHtml(partner.name_ar)}</strong> (${partnerStudents.length} طالب) في مجموعات متوازنة.
        </p>
        <div class="form-group" style="margin-bottom:10px;">
          <label style="font-size:0.86rem;">عدد الطلاب من كل مدرسة في المجموعة الواحدة:</label>
          <select id="autoGroupPerSchoolCount">
            <option value="1">1 من كل مدرسة (أزواج ثنائية | 2 طلاب)</option>
            <option value="2" selected>2 من كل مدرسة (مجموعة رباعية | 4 طلاب)</option>
            <option value="3">3 من كل مدرسة (مجموعة من 6 طلاب)</option>
            <option value="4">4 من كل مدرسة (مجموعة من 8 طلاب)</option>
            <option value="5">5 من كل مدرسة (مجموعة من 10 طلاب)</option>
          </select>
        </div>
        <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; margin-bottom:14px; cursor:pointer;">
          <input type="checkbox" id="autoGroupMatchByTeam" checked />
          <span>مطابقة الطلاب ذوي الفريق/المجال المتشابه معاً أولاً</span>
        </label>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn btn-blue" onclick="autoGenerateJointGroups(${room.id})">
            ⚡ إنشاء المجموعات تلقائياً | צור אוטומטית
          </button>
          ${
            groups.length > 0
              ? `<button type="button" class="btn btn-sm" style="background:#fee2e2; color:#991b1b; border:1px solid #fecaca;" onclick="clearAllJointGroups(${room.id})">🗑️ مسح الكل</button>`
              : ''
          }
        </div>
      </div>

      <!-- Option 2: Manual Grouping -->
      <div class="groups-builder-card">
        <h4 style="color:var(--navy-900); margin:0 0 8px;">✍️ 2. بناء مجموعة يدوياً | בניית קבוצה ידנית</h4>
        <div class="form-grid-2" style="gap:10px; margin-bottom:10px;">
          <div class="form-group" style="margin:0;">
            <label style="font-size:0.84rem;">اسم المجموعة | שם הקבוצה *</label>
            <input type="text" id="manualGroupNameInput" placeholder="مثلاً: مجموعة 1 – جودة المياه" />
          </div>
          <div class="form-group" style="margin:0;">
            <label style="font-size:0.84rem;">موضوع / مهمة المجموعة | נושא (اختياري)</label>
            <input type="text" id="manualGroupTopicInput" placeholder="مثلاً: فحص عينات الينابيع" />
          </div>
        </div>
        <div class="manual-group-picker-grid">
          <div>
            <div style="font-size:0.82rem; font-weight:700; color:var(--navy-900); margin-bottom:4px;">🏫 ${escapeHtml(school.name_ar)}</div>
            <div class="student-picker-box">${renderPickerList(myStudents, school)}</div>
          </div>
          <div>
            <div style="font-size:0.82rem; font-weight:700; color:var(--green-800); margin-bottom:4px;">🏫 ${escapeHtml(partner.name_ar)}</div>
            <div class="student-picker-box">${renderPickerList(partnerStudents, partner)}</div>
          </div>
        </div>
        <button type="button" class="btn btn-green" onclick="createManualJointGroup(${room.id})">
          ➕ اعتماد المجموعة اليدوية | צור קבוצה ידנית
        </button>
      </div>
    </div>

    <h4 style="color:var(--navy-900); margin:0 0 12px;">
      📋 المجموعات المشتركة المعتمدة (${groups.length}) | הקבוצות המשותפות (${groups.length})
    </h4>
    ${
      groups.length === 0
        ? `<div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; padding:18px; text-align:center; color:var(--text-muted);">
             لم يتم إنشاء مجموعات مشتركة بعد. استخدم <strong>التقسيم التلقائي</strong> أو <strong>البناء اليدوي</strong> أعلاه.
           </div>`
        : `<div class="joint-groups-list">
             ${groups
               .map((grp) => {
                 const membersA = (grp.members || []).filter((m) => Number(m.school_id) === Number(school.id));
                 const membersB = (grp.members || []).filter((m) => Number(m.school_id) === Number(partner.id));
                 const renderMemberChips = (list, ownerId) =>
                   list.length === 0
                     ? '<div style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">لا يوجد أعضاء بعد</div>'
                     : list
                         .map(
                           (m) => `
                         <div class="joint-member-chip">
                           <span><strong>${escapeHtml(m.name)}</strong> <small style="color:var(--text-muted);">(${escapeHtml(m.grade || '-')}${m.team ? ' • ' + escapeHtml(m.team) : ''})</small></span>
                           <button type="button" title="إزالة من المجموعة" style="background:none; border:none; color:#dc2626; cursor:pointer; font-weight:900; padding:0 4px;" onclick="removeMemberFromJointGroup(${room.id}, '${grp.id}', ${ownerId}, '${m.student_key}')">×</button>
                         </div>
                       `
                         )
                         .join('');

                 return `
                   <div class="joint-group-card">
                     <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                       <div>
                         <div style="font-weight:900; color:var(--navy-900); font-size:1rem;">👥 ${escapeHtml(grp.name)}</div>
                         ${grp.topic ? `<div style="font-size:0.82rem; color:var(--green-800); margin-top:2px;">🔬 ${escapeHtml(grp.topic)}</div>` : ''}
                       </div>
                       <button type="button" class="btn btn-sm" style="background:#fee2e2; color:#991b1b; padding:4px 8px; font-size:0.76rem;" onclick="deleteJointGroup(${room.id}, '${grp.id}')">🗑️ حذف</button>
                     </div>
                     <div class="joint-group-columns">
                       <div class="joint-group-school-col">
                         <div style="font-size:0.78rem; font-weight:800; color:var(--navy-900);">🏫 ${escapeHtml(school.name_ar)} (${membersA.length})</div>
                         ${renderMemberChips(membersA, school.id)}
                       </div>
                       <div class="joint-group-school-col">
                         <div style="font-size:0.78rem; font-weight:800; color:var(--green-800);">🏫 ${escapeHtml(partner.name_ar)} (${membersB.length})</div>
                         ${renderMemberChips(membersB, partner.id)}
                       </div>
                     </div>
                   </div>
                 `;
               })
               .join('')}
           </div>`
    }
  `;
}

function autoGenerateJointGroups(roomId) {
  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  if (!room) return;

  const schoolA = store.schools.find((s) => Number(s.id) === Number(room.school_a_id));
  const schoolB = store.schools.find((s) => Number(s.id) === Number(room.school_b_id));
  if (!schoolA || !schoolB) return;

  const listA = (schoolA.students || []).map((stu, idx) => ({
    school_id: schoolA.id,
    student_key: getStudentSafeKey(stu, idx),
    name: stu.name,
    grade: stu.grade || '',
    team: stu.team || ''
  }));
  const listB = (schoolB.students || []).map((stu, idx) => ({
    school_id: schoolB.id,
    student_key: getStudentSafeKey(stu, idx),
    name: stu.name,
    grade: stu.grade || '',
    team: stu.team || ''
  }));

  if (listA.length === 0 || listB.length === 0) {
    showToast('⚠️ يجب أن تُدخل كلتا المدرستين أسماء طلابها أولاً قبل التقسيم التلقائي.');
    return;
  }

  const perSchool = Math.max(1, Math.min(5, Number(document.getElementById('autoGroupPerSchoolCount')?.value || 2)));
  const matchByTeam = Boolean(document.getElementById('autoGroupMatchByTeam')?.checked);

  const poolA = [...listA];
  const poolB = [...listB];

  if (matchByTeam) {
    poolA.sort((x, y) => normalizeTeamLabel(x.team).localeCompare(normalizeTeamLabel(y.team)));
    poolB.sort((x, y) => normalizeTeamLabel(x.team).localeCompare(normalizeTeamLabel(y.team)));
  }

  const totalGroups = Math.max(
    1,
    Math.ceil(Math.max(poolA.length, poolB.length) / perSchool)
  );

  const newGroups = Array.from({ length: totalGroups }, (_, idx) => ({
    id: `grp_${Date.now()}_${idx + 1}`,
    name: `المجموعة المشتركة ${idx + 1} | קבוצה משותפת ${idx + 1}`,
    topic: room.research_topic_ar || '',
    created_by_school_id: activeDashboardSchool ? activeDashboardSchool.id : schoolA.id,
    created_at: new Date().toISOString(),
    members: []
  }));

  // First pass: if matching by team, place students with matching team labels into the same group when possible
  if (matchByTeam) {
    const usedB = new Set();
    let groupCursor = 0;
    for (let i = poolA.length - 1; i >= 0; i--) {
      const stuA = poolA[i];
      const normA = normalizeTeamLabel(stuA.team);
      if (!normA) continue;
      const matchIdx = poolB.findIndex((stuB, bIdx) => {
        if (usedB.has(bIdx)) return false;
        const normB = normalizeTeamLabel(stuB.team);
        return normB && (normA === normB || normA.includes(normB) || normB.includes(normA));
      });
      if (matchIdx !== -1) {
        const targetGrp = newGroups[groupCursor % totalGroups];
        targetGrp.members.push(stuA, poolB[matchIdx]);
        if (stuA.team && !targetGrp.name.includes('—')) {
          targetGrp.topic = `${stuA.team}`;
        }
        poolA.splice(i, 1);
        usedB.add(matchIdx);
        groupCursor++;
      }
    }
    const remainingB = poolB.filter((_, idx) => !usedB.has(idx));
    poolB.length = 0;
    poolB.push(...remainingB);
  }

  // Second pass: round-robin distribute all remaining students from both schools evenly
  poolA.forEach((stuA, idx) => {
    const target = newGroups.reduce((minG, g) => {
      const countG = g.members.filter((m) => Number(m.school_id) === Number(schoolA.id)).length;
      const countMin = minG.members.filter((m) => Number(m.school_id) === Number(schoolA.id)).length;
      return countG < countMin ? g : minG;
    }, newGroups[idx % totalGroups]);
    target.members.push(stuA);
  });

  poolB.forEach((stuB, idx) => {
    const target = newGroups.reduce((minG, g) => {
      const countG = g.members.filter((m) => Number(m.school_id) === Number(schoolB.id)).length;
      const countMin = minG.members.filter((m) => Number(m.school_id) === Number(schoolB.id)).length;
      return countG < countMin ? g : minG;
    }, newGroups[idx % totalGroups]);
    target.members.push(stuB);
  });

  room.joint_groups = newGroups.filter((g) => g.members.length > 0);
  saveLocalStore(store);
  renderSchoolPartnershipHub();
  showToast(`⚡ تم إنشاء ${room.joint_groups.length} مجموعات مشتركة تلقائياً وبشكل متوازن!`);
}

function createManualJointGroup(roomId) {
  const name = (document.getElementById('manualGroupNameInput')?.value || '').trim();
  const topic = (document.getElementById('manualGroupTopicInput')?.value || '').trim();
  const checkedBoxes = Array.from(document.querySelectorAll('.manual-group-stu-cb:checked'));

  if (!name) {
    showToast('⚠️ يُرجى كتابة اسم المجموعة أولاً.');
    return;
  }
  if (checkedBoxes.length === 0) {
    showToast('⚠️ اختر طالباً واحداً على الأقل من المدرستين.');
    return;
  }

  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  if (!room) return;

  if (!Array.isArray(room.joint_groups)) room.joint_groups = [];

  const members = checkedBoxes.map((cb) => ({
    school_id: Number(cb.dataset.schoolId),
    student_key: cb.dataset.studentKey,
    name: cb.dataset.studentName,
    grade: cb.dataset.studentGrade,
    team: cb.dataset.studentTeam
  }));

  room.joint_groups.push({
    id: `grp_${Date.now()}`,
    name,
    topic,
    created_by_school_id: activeDashboardSchool ? activeDashboardSchool.id : room.school_a_id,
    created_at: new Date().toISOString(),
    members
  });

  saveLocalStore(store);
  renderSchoolPartnershipHub();
  showToast(`✅ تم إنشاء المجموعة اليدوية "${name}" (${members.length} طلاب).`);
}

function removeMemberFromJointGroup(roomId, groupId, schoolId, studentKey) {
  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  if (!room || !Array.isArray(room.joint_groups)) return;

  const grp = room.joint_groups.find((g) => g.id === groupId);
  if (!grp) return;

  grp.members = (grp.members || []).filter(
    (m) => !(Number(m.school_id) === Number(schoolId) && String(m.student_key) === String(studentKey))
  );
  saveLocalStore(store);
  renderSchoolPartnershipHub();
  showToast('🗑️ تم إزالة الطالب من المجموعة.');
}

function deleteJointGroup(roomId, groupId) {
  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  if (!room || !Array.isArray(room.joint_groups)) return;

  room.joint_groups = room.joint_groups.filter((g) => g.id !== groupId);
  saveLocalStore(store);
  renderSchoolPartnershipHub();
  showToast('🗑️ تم حذف المجموعة.');
}

function clearAllJointGroups(roomId) {
  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  if (!room) return;
  room.joint_groups = [];
  saveLocalStore(store);
  renderSchoolPartnershipHub();
  showToast('🗑️ تم مسح جميع المجموعات المشتركة.');
}

function renderStudentMyGroupBanner(classroom) {
  const banner = document.getElementById('studentMyGroupBanner');
  if (!banner || !activeStudentSession) return;

  const groups = Array.isArray(classroom.joint_groups) ? classroom.joint_groups : [];
  const stuSchoolId = Number(activeStudentSession.school_id);
  const stuName = String(activeStudentSession.name || '').trim();

  const myGroup = groups.find((g) =>
    (g.members || []).some(
      (m) => Number(m.school_id) === stuSchoolId && String(m.name || '').trim() === stuName
    )
  );

  if (!myGroup) {
    banner.innerHTML = groups.length
      ? `<div class="student-my-group-banner">👥 لم يتم ضمّك لمجموعة مشتركة بعد — يمكنك المشاركة في الساحة العامة ريثما يوزّعك مركّز المدرسة.</div>`
      : '';
    return;
  }

  const store = getLocalStore();
  const membersHtml = (myGroup.members || [])
    .map((m) => {
      const sch = store.schools.find((s) => Number(s.id) === Number(m.school_id));
      const schName = sch ? (currentLang === 'ar' ? sch.name_ar : sch.name_he) : '';
      return `<span style="background:rgba(255,255,255,0.2); padding:3px 10px; border-radius:999px; font-size:0.82rem;">🧑‍🎓 ${escapeHtml(m.name)} (${escapeHtml(schName)})</span>`;
    })
    .join(' ');

  banner.innerHTML = `
    <div class="student-my-group-banner">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
        <div style="font-weight:900;">
          👥 مجموعتك المشتركة | הקבוצה המשותפת שלך: ${escapeHtml(myGroup.name)}
          ${myGroup.topic ? `<span style="font-weight:500; opacity:0.92;"> — 🔬 ${escapeHtml(myGroup.topic)}</span>` : ''}
        </div>
        <button type="button" class="btn btn-sm" style="background:#ffffff; color:var(--navy-900); font-weight:800;" onclick="switchStudentTab('grouproom')">
          🚀 افتح غرفة مجموعتي الخاصة
        </button>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">${membersHtml}</div>
    </div>
  `;
}

function selectActiveStudentGroup(groupId) {
  activeStudentSelectedGroupId = groupId;
  if (activeClassroomData) renderStudentGroupRoom(activeClassroomData.classroom);
}

function renderStudentGroupRoom(classroom) {
  const container = document.getElementById('studentGroupRoomContent');
  if (!container || !classroom) return;

  const store = getLocalStore();
  const liveRoom = store.classrooms.find((c) => Number(c.id) === Number(classroom.id)) || classroom;
  const groups = Array.isArray(liveRoom.joint_groups) ? liveRoom.joint_groups : [];

  if (groups.length === 0) {
    container.innerHTML = `
      <div class="group-room-card" style="text-align:center; padding:28px;">
        <h3 style="color:var(--navy-900); margin-bottom:8px;">👥 لا توجد مجموعات مشتركة بعد | אין עדיין קבוצות משותפות</h3>
        <p style="color:var(--text-muted); margin:0;">بانتظار قيام مركّزي المدرستين بتقسيم الطلاب إلى مجموعات مشتركة (تلقائياً أو يدوياً).</p>
      </div>
    `;
    return;
  }

  const stuSchoolId = Number(activeStudentSession?.school_id || 0);
  const stuName = String(activeStudentSession?.name || '').trim();
  const isCoordinatorPreview = !stuName || stuName.includes('مدير') || stuName.includes('مركّز') || stuName.includes('מנהל');

  const myGroups = groups.filter((g) =>
    (g.members || []).some((m) => Number(m.school_id) === stuSchoolId && String(m.name || '').trim() === stuName)
  );
  const visibleGroups = myGroups.length > 0 && !isCoordinatorPreview ? myGroups : groups;

  let activeGroup =
    visibleGroups.find((g) => g.id === activeStudentSelectedGroupId) || visibleGroups[0];
  if (activeGroup) activeStudentSelectedGroupId = activeGroup.id;

  const messages = Array.isArray(activeGroup.messages) ? activeGroup.messages : [];
  const tasks = Array.isArray(activeGroup.tasks) ? activeGroup.tasks : [];

  const membersChips = (activeGroup.members || [])
    .map((m) => {
      const sch = store.schools.find((s) => Number(s.id) === Number(m.school_id));
      const schName = sch ? (currentLang === 'ar' ? sch.name_ar : sch.name_he) : '';
      return `<span class="badge-tag badge-matched">🧑‍🎓 ${escapeHtml(m.name)} — ${escapeHtml(schName)}</span>`;
    })
    .join(' ');

  const groupSelectorHtml =
    visibleGroups.length > 1
      ? `<div class="school-rooms-pills" style="margin-bottom:14px;">
           ${visibleGroups
             .map(
               (g) =>
                 `<button type="button" class="room-chip-btn ${g.id === activeGroup.id ? 'active' : ''}" onclick="selectActiveStudentGroup('${g.id}')">👥 ${escapeHtml(g.name)}</button>`
             )
             .join('')}
         </div>`
      : '';

  container.innerHTML = `
    ${groupSelectorHtml}
    <div class="group-room-card" style="margin-bottom:16px; background:linear-gradient(135deg,#f0f9ff 0%,#f0fdf4 100%);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
        <div>
          <span class="portal-badge" style="margin-bottom:6px; display:inline-block;">🔒 غرفة عمل ومحادثة خاصة بالمجموعة | חדר קבוצה פרטי</span>
          <h2 style="color:var(--navy-900); margin:0 0 6px;">👥 ${escapeHtml(activeGroup.name)}</h2>
          ${activeGroup.topic ? `<p style="margin:0; color:var(--green-800); font-weight:700;">🔬 موضوع المجموعة: ${escapeHtml(activeGroup.topic)}</p>` : ''}
        </div>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:12px;">${membersChips}</div>
    </div>

    <div class="group-room-grid">
      <!-- Group Private Chat -->
      <div class="group-room-card">
        <h3 style="color:var(--navy-900); margin:0 0 10px;">💬 محادثة المجموعة الخاصة (${messages.length})</h3>
        <div class="group-chat-box" id="groupChatMessagesBox">
          ${
            messages.length === 0
              ? '<p style="color:var(--text-muted); text-align:center; margin:20px 0;">ابدأوا الحوار داخل مجموعتكم الخاصة هنا! 👋</p>'
              : messages
                  .map(
                    (msg) => `
                  <div class="group-chat-msg">
                    <div style="display:flex; justify-content:space-between; gap:8px; font-size:0.8rem; margin-bottom:4px;">
                      <strong style="color:var(--navy-900);">🧑‍🎓 ${escapeHtml(msg.author_name)} <span style="color:var(--text-muted); font-weight:500;">(${escapeHtml(msg.school_name || '')})</span></strong>
                      <span style="color:var(--text-muted);">${escapeHtml(msg.time_label || '')}</span>
                    </div>
                    <div style="font-size:0.93rem; color:#0f172a;">${escapeHtml(msg.text)}</div>
                  </div>
                `
                  )
                  .join('')
          }
        </div>
        <form onsubmit="postGroupMessage(event, ${liveRoom.id}, '${activeGroup.id}')" style="display:flex; gap:8px; flex-wrap:wrap;">
          <input type="text" id="groupMessageInput" required placeholder="اكتب رسالة لزملائك في المجموعة... | כתבו הודעה לקבוצה..." style="flex:1; min-width:200px;" />
          <button type="submit" class="btn btn-blue">إرسال | שלח</button>
        </form>
      </div>

      <!-- Group Tasks Checklist -->
      <div class="group-room-card">
        <h3 style="color:var(--navy-900); margin:0 0 10px;">✅ مهام وأهداف المجموعة (${tasks.length})</h3>
        <form onsubmit="addGroupTask(event, ${liveRoom.id}, '${activeGroup.id}')" style="display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap;">
          <input type="text" id="groupTaskInput" required placeholder="أضف مهمة بحثية للمجموعة..." style="flex:1; min-width:160px;" />
          <button type="submit" class="btn btn-green btn-sm">➕ إضافة</button>
        </form>
        ${
          tasks.length === 0
            ? '<p style="color:var(--text-muted); font-size:0.88rem;">لا توجد مهام بعد. أضف أول خطوة لبحث مجموعتكم!</p>'
            : tasks
                .map(
                  (t, idx) => `
                <label class="group-task-item" style="cursor:pointer;">
                  <span style="display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleGroupTask(${liveRoom.id}, '${activeGroup.id}', ${idx})" />
                    <span style="${t.done ? 'text-decoration:line-through; color:var(--text-muted);' : 'font-weight:600;'}">${escapeHtml(t.title)}</span>
                  </span>
                  <small style="color:var(--text-muted);">${escapeHtml(t.author || '')}</small>
                </label>
              `
                )
                .join('')
        }
      </div>
    </div>
  `;
}

function postGroupMessage(e, roomId, groupId) {
  e.preventDefault();
  const input = document.getElementById('groupMessageInput');
  const text = (input?.value || '').trim();
  if (!text) return;

  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  if (!room || !Array.isArray(room.joint_groups)) return;

  const grp = room.joint_groups.find((g) => g.id === groupId);
  if (!grp) return;

  if (!Array.isArray(grp.messages)) grp.messages = [];
  const schoolName =
    currentLang === 'ar'
      ? activeStudentSession?.school_name_ar || ''
      : activeStudentSession?.school_name_he || '';

  grp.messages.push({
    id: Date.now(),
    author_name: activeStudentSession?.name || 'طالب مشترك',
    school_name: schoolName,
    text,
    time_label: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  saveLocalStore(store);
  if (activeClassroomData) activeClassroomData.classroom = room;
  renderStudentGroupRoom(room);
}

function addGroupTask(e, roomId, groupId) {
  e.preventDefault();
  const input = document.getElementById('groupTaskInput');
  const title = (input?.value || '').trim();
  if (!title) return;

  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  if (!room || !Array.isArray(room.joint_groups)) return;

  const grp = room.joint_groups.find((g) => g.id === groupId);
  if (!grp) return;

  if (!Array.isArray(grp.tasks)) grp.tasks = [];
  grp.tasks.push({
    title,
    done: false,
    author: activeStudentSession?.name || ''
  });

  saveLocalStore(store);
  if (activeClassroomData) activeClassroomData.classroom = room;
  renderStudentGroupRoom(room);
}

function toggleGroupTask(roomId, groupId, taskIndex) {
  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  if (!room || !Array.isArray(room.joint_groups)) return;

  const grp = room.joint_groups.find((g) => g.id === groupId);
  if (!grp || !Array.isArray(grp.tasks) || !grp.tasks[taskIndex]) return;

  grp.tasks[taskIndex].done = !grp.tasks[taskIndex].done;
  saveLocalStore(store);
  if (activeClassroomData) activeClassroomData.classroom = room;
  renderStudentGroupRoom(room);
}

function toggleExtraClassPartnershipForm() {
  const form = document.getElementById('extraClassPartnershipForm');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }
}

function createExtraClassPartnership(e, schoolId) {
  e.preventDefault();
  const gradeLabel = (document.getElementById('extraClassGradeInput')?.value || '').trim();
  const partnerId = Number(document.getElementById('extraClassPartnerSelect')?.value || 0);
  const customTopic = (document.getElementById('extraClassTopicInput')?.value || '').trim();

  if (!gradeLabel || !partnerId) {
    showToast('⚠️ يُرجى إدخال اسم الصف واختيار المدرسة الشريكة.');
    return;
  }

  const store = getLocalStore();
  const schoolA = store.schools.find((s) => Number(s.id) === Number(schoolId));
  const schoolB = store.schools.find((s) => Number(s.id) === Number(partnerId));
  if (!schoolA || !schoolB) return;

  const code = `BAYT-${Math.floor(100 + Math.random() * 899)}`;
  const newRoomId = Math.max(...store.classrooms.map((c) => Number(c.id) || 0), 0) + 1;

  const newRoom = {
    id: newRoomId,
    code,
    grade_label: gradeLabel,
    school_a_id: schoolA.id,
    school_b_id: schoolB.id,
    title_ar: `${schoolA.name_ar} (${gradeLabel}) 🤝 ${schoolB.name_ar}`,
    title_he: `${schoolA.name_he} (${gradeLabel}) 🤝 ${schoolB.name_he}`,
    research_topic_ar: customTopic || `مشروع صف ${gradeLabel} المشترك بين ${schoolA.city_ar} و${schoolB.city_ar}`,
    research_topic_he: customTopic || `פרויקט משותף (${gradeLabel}) בין ${schoolA.city_he} ל${schoolB.city_he}`,
    supervisor_ar: schoolA.contact_name,
    supervisor_he: schoolB.contact_name,
    joint_groups: []
  };

  store.classrooms.push(newRoom);
  if (!schoolA.matched_school_id) schoolA.matched_school_id = schoolB.id;
  if (!schoolB.matched_school_id) schoolB.matched_school_id = schoolA.id;

  activeHubRoomId = newRoomId;
  saveLocalStore(store);
  renderSchoolPartnershipHub();
  loadPlatformStats();
  showToast(`🎉 تم فتح شراكة وغرفة جديدة لصف "${gradeLabel}" برمز (${code})!`);
}

function addSchoolStudent(e) {
  e.preventDefault();
  if (!activeDashboardSchool) return;
  const name = (document.getElementById('hubStudentName')?.value || '').trim();
  const studentIdNumber = (document.getElementById('hubStudentId')?.value || '').trim().replace(/\D/g, '');
  const grade = (document.getElementById('hubStudentGrade')?.value || '').trim();
  const team = (document.getElementById('hubStudentTeam')?.value || '').trim();
  if (!name || !grade) return;

  const store = getLocalStore();
  const school = store.schools.find((s) => s.id === Number(activeDashboardSchool.id));
  if (!school) return;

  if (!Array.isArray(school.students)) school.students = [];
  school.students.push({
    id: Date.now(),
    name,
    studentIdNumber,
    grade,
    team,
    status: 'approved'
  });
  school.students_count = Math.max(school.students.length, school.students_count || 0);
  saveLocalStore(store);

  e.target.reset();
  loadPlatformStats();
  renderSchoolPartnershipHub();
  showToast(`✅ تمت إضافة الطالب/ة "${name}" بنجاح إلى قائمة ${school.name_ar}!`);
}

function editSchoolStudent(studentId) {
  if (!activeDashboardSchool) return;
  const store = getLocalStore();
  const school = store.schools.find((s) => s.id === Number(activeDashboardSchool.id));
  if (!school || !Array.isArray(school.students)) return;
  const st = school.students.find((x) => Number(x.id) === Number(studentId));
  if (!st) return;

  const newName = prompt('تعديل اسم الطالب/ة:', st.name || '');
  if (newName === null) return;
  const newIdNum = prompt('تعديل رقم الهوية / الكود الشخصي:', st.studentIdNumber || '');
  if (newIdNum === null) return;
  const newGrade = prompt('تعديل الصف:', st.grade || '');
  if (newGrade === null) return;
  const newTeam = prompt('تعديل الفريق / المجال:', st.team || '');
  if (newTeam === null) return;

  st.name = newName.trim() || st.name;
  st.studentIdNumber = newIdNum.trim().replace(/\D/g, '');
  st.grade = newGrade.trim() || st.grade;
  st.team = newTeam.trim();
  saveLocalStore(store);
  renderSchoolPartnershipHub();
  showToast(`✅ تم تحديث بيانات الطالب/ة "${st.name}".`);
}

function approvePendingStudent(reqId) {
  if (!activeDashboardSchool) return;
  const store = getLocalStore();
  const school = store.schools.find((s) => s.id === Number(activeDashboardSchool.id));
  if (!school || !Array.isArray(school.pending_students)) return;
  const idx = school.pending_students.findIndex((x) => Number(x.id) === Number(reqId));
  if (idx < 0) return;

  const req = school.pending_students.splice(idx, 1)[0];
  if (!Array.isArray(school.students)) school.students = [];
  school.students.push({
    id: req.id || Date.now(),
    name: req.name,
    studentIdNumber: req.studentIdNumber || '',
    grade: req.grade || '',
    team: req.team || '',
    status: 'approved'
  });
  school.students_count = Math.max(school.students.length, school.students_count || 0);
  saveLocalStore(store);
  loadPlatformStats();
  renderSchoolPartnershipHub();
  showToast(`✅ تم منح إذن الدخول للطالب/ة "${req.name}" بنجاح!`);
}

function rejectPendingStudent(reqId) {
  if (!activeDashboardSchool) return;
  const store = getLocalStore();
  const school = store.schools.find((s) => s.id === Number(activeDashboardSchool.id));
  if (!school || !Array.isArray(school.pending_students)) return;
  school.pending_students = school.pending_students.filter((x) => Number(x.id) !== Number(reqId));
  saveLocalStore(store);
  renderSchoolPartnershipHub();
  showToast('❌ تم رفض وحذف طلب الانضمام.');
}

function handleSchoolBulkStudentsUpload(e) {
  if (!activeDashboardSchool) return;
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const processGrid = (grid) => {
    if (!grid || !grid.length) {
      showToast('⚠️ الملف فارغ أو غير مقروء.');
      return;
    }
    let headerIdx = -1;
    let colId = -1, colName = -1, colFirst = -1, colLast = -1, colGrade = -1, colTeam = -1;
    for (let r = 0; r < Math.min(15, grid.length); r++) {
      const row = grid[r].map((c) => String(c || '').trim());
      for (let c = 0; c < row.length; c++) {
        const h = row[c];
        if (/זהות|ת"ז|ת\.ז|הوية|هويّة|id/i.test(h)) colId = c;
        else if (/שם משפחה|العائلة/i.test(h)) colLast = c;
        else if (/שם פרטי|الاسم الشخصي/i.test(h)) colFirst = c;
        else if (/שם תלמיד|שם מלא|اسم الطالب|الاسم|^שם$/i.test(h)) colName = c;
        else if (/כיתה|صف|الصف|grade|class/i.test(h)) colGrade = c;
        else if (/צוות|فريق|الفريق|team/i.test(h)) colTeam = c;
      }
      if (colName >= 0 || colFirst >= 0 || colId >= 0) { headerIdx = r; break; }
    }

    const store = getLocalStore();
    const school = store.schools.find((s) => s.id === Number(activeDashboardSchool.id));
    if (!school) return;
    if (!Array.isArray(school.students)) school.students = [];

    let added = 0;
    const start = headerIdx >= 0 ? headerIdx + 1 : 0;
    for (let i = start; i < grid.length; i++) {
      const rw = grid[i];
      if (!rw || !rw.length) continue;
      let fullName = '';
      if (colName >= 0 && rw[colName]) fullName = String(rw[colName]).trim();
      else if (colLast >= 0 || colFirst >= 0) fullName = [colLast >= 0 ? rw[colLast] : '', colFirst >= 0 ? rw[colFirst] : ''].filter(Boolean).join(' ').trim();
      else {
        for (let k = 0; k < rw.length; k++) {
          const txt = String(rw[k] || '').trim();
          if (txt && !/^\d+$/.test(txt) && txt.length >= 2) { fullName = txt; break; }
        }
      }
      if (!fullName) continue;
      const rawId = colId >= 0 ? String(rw[colId] || '').replace(/\D/g, '') : '';
      const grade = colGrade >= 0 ? String(rw[colGrade] || '').trim() : 'عام';
      const team = colTeam >= 0 ? String(rw[colTeam] || '').trim() : '';

      const exists = school.students.find((s) => (rawId && s.studentIdNumber === rawId) || s.name === fullName);
      if (!exists) {
        school.students.push({
          id: Date.now() + added,
          name: fullName,
          studentIdNumber: rawId,
          grade: grade || 'عام',
          team,
          status: 'approved'
        });
        added++;
      }
    }

    school.students_count = Math.max(school.students.length, school.students_count || 0);
    saveLocalStore(store);
    loadPlatformStats();
    renderSchoolPartnershipHub();
    e.target.value = '';
    showToast(`✅ تم استيراد وإضافة ${added} طالباً إلى قائمة ${school.name_ar}!`);
  };

  const reader = new FileReader();
  reader.onload = (ev) => {
    const bytes = new Uint8Array(ev.target.result);
    const isBinary = (bytes[0] === 0x50 && bytes[1] === 0x4B) || (bytes[0] === 0xD0 && bytes[1] === 0xCF);
    if (!isBinary) {
      const text = new TextDecoder('utf-8').decode(bytes);
      if (/<table|<tr|<td/i.test(text)) {
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const grid = Array.from(doc.querySelectorAll('tr')).map((tr) =>
          Array.from(tr.querySelectorAll('th,td')).map((td) => td.textContent.trim())
        );
        processGrid(grid);
        return;
      }
      const sep = text.indexOf('\t') >= 0 ? '\t' : ',';
      const grid = text.split(/\r?\n/).filter(Boolean).map((ln) => ln.split(sep).map((v) => v.replace(/^"|"$/g, '').trim()));
      processGrid(grid);
      return;
    }
    const parseXlsx = () => {
      const wb = window.XLSX.read(bytes, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const grid = window.XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      processGrid(grid);
    };
    if (window.XLSX) { parseXlsx(); }
    else {
      const sc = document.createElement('script');
      sc.src = 'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js';
      sc.onload = parseXlsx;
      document.head.appendChild(sc);
    }
  };
  reader.readAsArrayBuffer(file);
}

function exportSchoolStudentsCSV() {
  if (!activeDashboardSchool) return;
  const store = getLocalStore();
  const school = store.schools.find((s) => s.id === Number(activeDashboardSchool.id));
  if (!school) return;
  const approved = Array.isArray(school.students) ? school.students : [];
  const pending = Array.isArray(school.pending_students) ? school.pending_students : [];

  const rows = [['الاسم', 'رقم الهوية / الكود', 'الصف', 'الفريق', 'الحالة']];
  approved.forEach((st) => rows.push([st.name, st.studentIdNumber || '', st.grade || '', st.team || '', 'معتمد (مسجّل)']));
  pending.forEach((st) => rows.push([st.name, st.studentIdNumber || '', st.grade || '', st.team || '', 'بانتظار إذن المدرسة']));

  const csv = '\uFEFF' + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `bayt_students_${school.id}.csv`;
  a.click();
  showToast('📥 تم استرجاع وتصدير قائمة ومعطيات الطلاب بنجاح!');
}

function deleteSchoolStudent(studentId) {
  if (!activeDashboardSchool) return;
  const store = getLocalStore();
  const school = store.schools.find((s) => s.id === Number(activeDashboardSchool.id));
  if (!school || !Array.isArray(school.students)) return;

  school.students = school.students.filter((st) => st.id !== Number(studentId));
  saveLocalStore(store);
  renderSchoolPartnershipHub();
  showToast('🗑️ התלמיד/ה הוסר/ה מרשימת בית הספר.');
}

async function submitHubForumPost(e, roomId, schoolSide) {
  e.preventDefault();
  if (!activeDashboardSchool) return;
  const inp = document.getElementById('hubForumPostInput');
  const text = (inp?.value || '').trim();
  if (!text) return;

  const srcLang = detectLang(text);
  const targetLang = srcLang === 'ar' ? 'he' : 'ar';
  const translated = await translateTextWithNeuralAI(text, srcLang, targetLang);

  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  const school = store.schools.find((s) => s.id === Number(activeDashboardSchool.id));
  if (!room || !school) return;

  store.posts.unshift({
    id: Date.now(),
    classroom_id: room.id,
    category: 'self_intro',
    author_name: `${school.contact_name} (צוות ${school.name_he})`,
    school_side: schoolSide,
    school_name_ar: school.name_ar,
    school_name_he: school.name_he,
    original_lang: srcLang,
    content_ar: srcLang === 'ar' ? text : translated,
    content_he: srcLang === 'he' ? text : translated,
    likes: 1,
    replies: []
  });
  saveLocalStore(store);

  if (inp) inp.value = '';
  renderSchoolPartnershipHub();
  showToast('💬 ההודעה פורסמה בפורום המשותף של שני בתי הספר!');
}

function saveHubResearchTopic(e, roomId) {
  e.preventDefault();
  const topicHe = (document.getElementById('hubTopicHe')?.value || '').trim();
  const topicAr = (document.getElementById('hubTopicAr')?.value || '').trim();
  if (!topicHe || !topicAr) return;

  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  if (!room) return;

  room.research_topic_he = topicHe;
  room.research_topic_ar = topicAr;
  saveLocalStore(store);
  renderSchoolPartnershipHub();
  showToast('💾 נושא המחקר המשותף עודכן בהצלחה!');
}

async function addHubCanvasCard(e, roomId) {
  e.preventDefault();
  if (!activeDashboardSchool) return;
  const inp = document.getElementById('hubNewCardInput');
  const text = (inp?.value || '').trim();
  if (!text) return;

  const srcLang = detectLang(text);
  const targetLang = srcLang === 'ar' ? 'he' : 'ar';
  const translated = await translateTextWithNeuralAI(text, srcLang, targetLang);

  const store = getLocalStore();
  store.canvas_cards.push({
    id: Date.now(),
    classroom_id: Number(roomId),
    column_key: 'ideas',
    author_name: `${activeDashboardSchool.contact_name} (${activeDashboardSchool.name_he})`,
    content_ar: srcLang === 'ar' ? text : translated,
    content_he: srcLang === 'he' ? text : translated
  });
  saveLocalStore(store);
  if (inp) inp.value = '';
  renderSchoolPartnershipHub();
  showToast('📌 המשימה/רעיון נוספו ללוח הפרויקט המשותף!');
}

function enterMatchedStudentWorkspace(roomId, schoolSide) {
  if (!activeDashboardSchool) return;
  const store = getLocalStore();
  const room = store.classrooms.find((c) => Number(c.id) === Number(roomId));
  if (!room) return;

  activeStudentSession = {
    name: `${activeDashboardSchool.contact_name} (معلّم/مدير)`,
    school_side: schoolSide || 'a',
    school_name_ar: activeDashboardSchool.name_ar,
    school_name_he: activeDashboardSchool.name_he
  };

  navigateTo('students');
  fetchClassroomById(room.id);
}



