// Global Application State
let currentLang = 'ar'; // 'ar' or 'he'
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
let visiblePostTranslations = {}; // post_id -> boolean

// Complete Bilingual Dictionary (Arabic <-> Hebrew)
const I18N = {
  ar: {
    header_tagline: 'من اللقاء العابر إلى الشراكة المستدامة',
    nav_vision: 'رؤيتنا',
    nav_goals: 'أهدافنا',
    nav_how: 'كيف نعمل',
    nav_students: 'مساحة الطلاب',
    nav_register_school: 'تسجيل مدرسة / المطابقة',
    hero_badge: 'جسر رقمي وتربوي ذكي بين المدارس العربية واليهودية',
    hero_headline: 'لكل إنسان بيت، ولكل بيت حكاية، ومن حكاياتنا نبني بيتًا مشتركًا',
    hero_sublead:
      'نعيد صياغة العلاقة بين الطلاب والمدارس في المجتمعين العربي واليهودي عبر الانتقال الجذري من مفهوم "الضيف والمضيف" إلى مفهوم "أصحاب البيت الواحد" في حيز آمن ومتساوٍ يجمع بين الفضول المعرفي، الحوار الصادق، والبحث العلمي المشترك.',
    btn_register_school: 'سجّل مدرستك الآن',
    btn_enter_student_space: 'دخول مساحة الطلاب',
    pill_ai_matching: 'مطابقة ذكية وفلترة يدوية للمدارس',
    pill_instant_trans: 'ترجمة فورية ذكية (عربي ↔ עברית)',
    pill_joint_research: 'مختبرات بحث علمي وتراثي مشترك',
    live_model_badge: 'نموذج حي للشراكة المستدامة',
    arab_school_tag: 'مدرسة عربية',
    jewish_school_tag: 'مدرسة يهودية',
    try_live_classroom: 'جرّب دخول هذه الغرفة المشتركة الآن (رمز: BAYT-2026) ←',
    vision_eyebrow: 'الرؤية التربوية والإنسانية | החזון החינוכי והאנושי',
    vision_title: 'من مفهوم "الضيف والمضيف" إلى "أصحاب البيت الواحد"',
    vision_text:
      'ينطلق مشروع "بَيْت" من إيمان عميق بأن غياب الشراكة الحقيقية غالباً ما يبدأ من عائق تقني وتنظيمى يحول دون وصول المدارس إلى الشريك المناسب. لذا بنينا جسراً رقمياً وتربوياً ذكياً يجمع المدارس المتقاربة جغرافياً وفكرياً في حيز آمن ومتساوٍ.',
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
    portal_badge: 'قسم مدراء المدارس ومركزي التربية الاجتماعية',
    portal_title: 'بوابة التسجيل والمطابقة الذكية (AI Matching & Manual Selection)',
    portal_subtitle: 'سجّل مدرستك أو اختر إحدى المدارس المسجلة لاستعراض اقتراحات التوأمة الذكية، الفلترة اليدوية، وإنشاء الغرفة المشتركة.',
    tab_school_dashboard: 'لوحة تحكم المدرسة والمطابقة',
    tab_new_registration: 'تسجيل مدرسة جديدة',
    lbl_active_school_view: 'المدرسة الحالية في لوحة التحكم:',
    matches_heading: '🤖 اقتراحات الشراكة الذكية والاختيار اليدوي (AI Matches & Manual Filter)',
    matches_subheading: 'يرتب النظام المدارس تلقائياً حسب درجة الملاءمة (المسافة الجغرافية، المرحلة العمرية، الاهتمامات المشتركة)، ويمكنك الفلترة يدوياً حسب خصائص المدرسة أو إظهار المدارس التي لم تقترن بعد فقط.',
    filter_only_unmatched: 'إظهار المدارس التي لم تقترن بعد فقط (טרם שודכו בלבד)',
    student_login_title: 'مساحة الطلاب والتعلم المشترك | מרחב התלמידים',
    student_login_desc: 'أدخل الرمز المخصص الذي وفرته لك مدرستك للدخول إلى لوحة الصف المشترك، منتدى "نتحدث معاً" المزود بالترجمة الفورية، ومختبر البحث العلمي.',
    btn_enter_classroom_now: 'دخول لوحة الصف المشترك الآن',
    ws_tab_forum: 'المنتدى التفاعلي "نتحدث معاً" (ترجمة فورية)',
    ws_tab_lab: 'مختبر البحث والعمل المشترك',
    ws_tab_wall: 'جدار الإنجازات (المعرض الرقمي)'
  },
  he: {
    header_tagline: 'ממפגש חולף לשותפות בת-קיימא',
    nav_vision: 'החזון שלנו',
    nav_goals: 'מטרות הפרויקט',
    nav_how: 'איך זה עובד',
    nav_students: 'מרחב התלמידים',
    nav_register_school: 'רישום בית ספר / התאמה',
    hero_badge: 'גשר דיגיטלי וחינוכי חכם בין בתי ספר ערביים ויהודיים',
    hero_headline: 'לכל אדם יש בית, ולכל בית יש סיפור – ומהסיפורים שלנו אנו בונים בית משותף',
    hero_sublead:
      'אנו מעצבים מחדש את הקשר בין תלמידים ובתי ספר בחברה הערבית והיהודית באמצעות מעבר שורשי מתפיסת "אורח ומארח" לתפיסת "שותפים לבית אחד" במרחב בטוח ושוויוני המשלב סקרנות מדעית, שיח כן ומחקר משותף.',
    btn_register_school: 'רשמו את בית הספר עכשיו',
    btn_enter_student_space: 'כניסה למרחב התלמידים',
    pill_ai_matching: 'התאמה חכמה וסינון ידני של בתי ספר',
    pill_instant_trans: 'תרגום מיידי חכם (עברית ↔ عربي)',
    pill_joint_research: 'מעבדות מחקר מדעי ומורשתי משותף',
    live_model_badge: 'מודל חי לשותפות מתמשכת',
    arab_school_tag: 'בית ספר ערבי',
    jewish_school_tag: 'בית ספר יהודי',
    try_live_classroom: 'נסו להיכנס לחדר המשותף כעת (קוד: BAYT-2026) ←',
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
    portal_badge: 'מתחם מנהלי בתי ספר ורכזי חינוך חברתי',
    portal_title: 'פורטל רישום והתאמה חכמה (AI Matching & Manual Selection)',
    portal_subtitle: 'רשמו את בית ספרכם או בחרו בית ספר רשום כדי לצפות בהצעות שידוך חכמות, לסנן ידנית לפי מאפיינים וליצור חדר משותף.',
    tab_school_dashboard: 'לוח בקרה והתאמת בתי ספר',
    tab_new_registration: 'רישום בית ספר חדש',
    lbl_active_school_view: 'בית הספר הפעיל בלוח הבקרה:',
    matches_heading: '🤖 הצעות שותפות חכמות ובחירה ידנית (AI Matches & Manual Filter)',
    matches_subheading: 'המערכת מדרגת אוטומטית לפי ציון התאמה (מרחק גיאוגרפי, שכבת גיל, תחומי עניין), וניתן לסנן ידנית לפי מאפייני בתי הספר ולהציג בתי ספר שטרם שודכו.',
    filter_only_unmatched: 'הצג רק בתי ספר שטרם שודכו עם בתי ספר אחרים',
    student_login_title: 'מרחב התלמידים והלמידה המשותפת | مساحة الطلاب',
    student_login_desc: 'הזינו את הקוד הייעודי שקיבלתם מבית הספר כדי להיכנס לכיתה המשותפת, לפורום "מדברים יחד" עם תרגום מיידי, ולמעבדת המחקר.',
    btn_enter_classroom_now: 'כניסה לכיתה המשותפת כעת',
    ws_tab_forum: 'פורום אינטראקטיבי "מדברים יחד" (תרגום מיידי)',
    ws_tab_lab: 'מעבדת מחקר ועבודה משותפת',
    ws_tab_wall: 'קיר ההישגים (גלריה דיגיטלית)'
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

// Initialize Application
window.addEventListener('DOMContentLoaded', async () => {
  await loadPlatformStats();
  await loadAllSchools();
  await loadAchievements();
  // Pre-load Classroom 1 in background so student space is also ready
  await fetchClassroomById(1);
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

// Language Switcher
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

  const btnLabel = document.getElementById('langSwitchLabel');
  btnLabel.textContent = currentLang === 'ar' ? 'עברית ↔ عربي' : 'عربي ↔ עברית';

  // Re-render dynamic views
  populateSchoolDropdown();
  if (activeDashboardSchool) {
    renderCurrentSchoolProfile();
    renderMatchesList();
  }
  if (activeClassroomData) {
    renderClassroomWorkspace();
  }
  loadAchievements();

  showToast(
    currentLang === 'ar'
      ? 'تم تبديل لغة العرض إلى العربية 🌐'
      : 'שפת התצוגה הוחלפה לעברית 🌐'
  );
}

// Navigation between top-level sections
function navigateTo(viewKey, scrollTargetId = null) {
  document.querySelectorAll('.view-section').forEach((sec) => sec.classList.remove('active'));
  document.getElementById(`view-${viewKey}`).classList.add('active');

  document.querySelectorAll('.main-nav .nav-link').forEach((btn) => btn.classList.remove('active'));
  const navBtn = document.querySelector(`.main-nav .nav-link[data-nav="${viewKey}"]`);
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

// 1. Load Platform Stats
async function loadPlatformStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    document.getElementById('statSchoolsCount').textContent = data.schools_count;
    document.getElementById('statUnmatchedCount').textContent = data.unmatched_schools_count;
    document.getElementById('statStudentsCount').textContent = data.students_count;
    document.getElementById('statProjectsCount').textContent = data.projects_count;
  } catch (err) {
    console.error(err);
  }
}

// 2. Load Schools & Initialize School Portal Dashboard
async function loadAllSchools(selectedId = null) {
  try {
    const res = await fetch('/api/schools');
    allSchools = await res.json();
    populateSchoolDropdown(selectedId);
    const initialId = selectedId || (allSchools.find((s) => s.is_unmatched)?.id || allSchools[0]?.id);
    if (initialId) {
      await loadSchoolDashboard(initialId);
    }
  } catch (err) {
    console.error(err);
  }
}

function populateSchoolDropdown(selectedId = null) {
  const select = document.getElementById('dashboardSchoolSelect');
  if (!select) return;
  const currentVal = selectedId || select.value;
  select.innerHTML = allSchools
    .map((s) => {
      const name = currentLang === 'ar' ? `${s.name_ar} (${s.city_ar})` : `${s.name_he} (${s.city_he})`;
      const statusText = s.is_unmatched
        ? currentLang === 'ar'
          ? '• لم تقترن بعد (טרם שודך)'
          : '• טרם שודך (פנוי)'
        : currentLang === 'ar'
        ? '• مقترنة في شراكة 🤝'
        : '• שודך לשותפות 🤝';
      return `<option value="${s.id}" ${Number(currentVal) === s.id ? 'selected' : ''}>${name} ${statusText}</option>`;
    })
    .join('');
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

// Submit New School Registration
async function submitSchoolRegistration(e) {
  e.preventDefault();
  const checkedInterests = Array.from(
    document.querySelectorAll('#regInterestsGroup input[type="checkbox"]:checked')
  ).map((cb) => cb.value);

  const payload = {
    name: document.getElementById('regName').value,
    city: document.getElementById('regCity').value,
    sector: document.getElementById('regSector').value,
    age_stage: document.getElementById('regAgeStage').value,
    target_grades: document.getElementById('regGrades').value,
    interests: checkedInterests.length ? checkedInterests : ['science_env'],
    activity_type: document.getElementById('regActivityType').value,
    bio: document.getElementById('regBio').value,
    contact_name: document.getElementById('regContactName').value,
    contact_role: document.getElementById('regContactRole').value,
    contact_email: document.getElementById('regContactEmail').value,
    contact_phone: document.getElementById('regContactPhone').value
  };

  try {
    const res = await fetch('/api/schools/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      showToast('⚠️ ' + (data.error || 'Error registering school'));
      return;
    }

    showToast('✅ تم تسجيل المدرسة بنجاح! جاري عرض المدارس المقترحة للتوأمة | בית הספר נרשם בהצלחה!');
    document.getElementById('schoolRegistrationForm').reset();
    await loadPlatformStats();
    await loadAllSchools(data.school.id);
    switchPortalMode('dashboard');
  } catch (err) {
    showToast('⚠️ حدث خطأ أثناء التسجيل');
  }
}

// Load School Dashboard & AI Matches
async function loadSchoolDashboard(schoolId) {
  try {
    const res = await fetch(`/api/schools/${schoolId}/matches`);
    const data = await res.json();
    activeDashboardSchool = data.school;
    currentMatches = data.matches;

    const select = document.getElementById('dashboardSchoolSelect');
    if (select) select.value = String(schoolId);

    renderCurrentSchoolProfile();
    renderMatchesList();
  } catch (err) {
    console.error(err);
  }
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
      <div style="font-size: 0.85rem; font-weight: 700; color: var(--green-800); margin-bottom: 4px;">
        ${SECTOR_LABELS[s.sector]?.[currentLang] || s.sector} • ${STAGE_LABELS[s.age_stage]?.[currentLang] || s.age_stage} (${s.target_grades})
      </div>
      <h2 style="font-size: 1.45rem; color: var(--navy-900); margin-bottom: 4px;">
        ${s.name_ar} | <span lang="he">${s.name_he}</span>
      </h2>
      <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 10px;">
        📍 ${s.city_ar} (${s.city_he}) • 👤 ${s.contact_name} (${s.contact_role})
      </p>
      <div class="match-interests-row" style="margin-bottom: 0;">${interestsHtml}</div>
    </div>
    <div style="text-align: end;">
      <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;">
        ${ACTIVITY_LABELS[s.activity_type]?.[currentLang] || s.activity_type}
      </div>
      <button class="btn btn-outline-blue btn-sm" onclick="switchPortalMode('register')">
        ➕ ${currentLang === 'ar' ? 'تسجيل مدرسة إضافية' : 'רישום בית ספר נוסף'}
      </button>
    </div>
  `;
}

// Render AI Matches + Manual Characteristic Filters + Unmatched Marking
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
      <div style="grid-column: span 2; background: #fff; padding: 36px; text-align: center; border-radius: 14px; border: 1px solid var(--border-color);">
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
        actionBtnHtml = `
          <button class="btn btn-blue btn-sm" onclick="quickStudentDemo('${m.classroom_code}')">
            🚀 ${currentLang === 'ar' ? `دخول الغرفة المشتركة (${m.classroom_code})` : `כניסה לחדר המשותף (${m.classroom_code})`}
          </button>
        `;
      } else if (m.partnership_status === 'mutual_approved' || m.partnership_status === 'interested') {
        actionBtnHtml = `
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:0.8rem; font-weight:700; color:var(--green-800);">
              ✅ ${currentLang === 'ar' ? 'وافق الطرفان على الشراكة!' : 'שני הצדדים אישרו!'}
            </span>
            <button class="btn btn-green btn-sm" onclick="triggerMatchAction(${m.id}, 'create_room')">
              🏠 ${currentLang === 'ar' ? '[ إنشاء الغرفة المشتركة ]' : '[ יצירת החדר המשותף ]'}
            </button>
          </div>
        `;
      } else {
        actionBtnHtml = `
          <button class="btn btn-outline-green btn-sm" onclick="triggerMatchAction(${m.id}, 'interest')">
            🤝 ${currentLang === 'ar' ? '[ إبداء اهتمام بالتوأمة ]' : '[ הבעת עניין בתאומוּת ]'}
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
              <div><strong>${ currentLang === 'ar' ? 'النشاط:' : 'פעילות:' }</strong> ${ACTIVITY_LABELS[m.activity_type]?.[currentLang]}</div>
              <div><strong>${ currentLang === 'ar' ? 'التواصل:' : 'איש קשר:' }</strong> ${m.contact_name}</div>
            </div>
            ${actionBtnHtml}
          </div>
        </div>
      `;
    })
    .join('');
}

async function triggerMatchAction(targetSchoolId, actionType) {
  if (!activeDashboardSchool) return;
  try {
    const res = await fetch('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_school_id: activeDashboardSchool.id,
        to_school_id: targetSchoolId,
        action: actionType
      })
    });
    const data = await res.json();

    if (actionType === 'interest') {
      showToast(
        currentLang === 'ar'
          ? '🤝 تم إرسال إبداء الاهتمام والموافقة المتبادلة! يمكنك الآن إنشاء الغرفة المشتركة.'
          : '🤝 נשלחה הבעת עניין ואושרה הדדית! כעת ניתן ליצור את החדר המשותף.'
      );
      await loadSchoolDashboard(activeDashboardSchool.id);
    } else if (actionType === 'create_room' && data.classroom) {
      showToast(
        currentLang === 'ar'
          ? `🎉 تم إنشاء الغرفة المشتركة بنجاح! رمز دخول الطلاب: ${data.classroom.code}`
          : `🎉 החדר המשותף נוצר בהצלחה! קוד כניסה לתלמידים: ${data.classroom.code}`
      );
      await loadPlatformStats();
      await loadAllSchools(activeDashboardSchool.id);
    }
  } catch (err) {
    console.error(err);
  }
}

// =======================================================
// SECTION 3: STUDENT LOGIN & SHARED CLASSROOM WORKSPACE
// =======================================================
function fillStudentCode(code, studentName, side) {
  document.getElementById('studentCodeInput').value = code;
  document.getElementById('studentNameInput').value = studentName;
  document.getElementById('studentSideSelect').value = side;
}

async function quickStudentDemo(code) {
  navigateTo('students');
  document.getElementById('studentCodeInput').value = code;
  await loginToClassroomCode(code, 'أمير جبارين | אמיר', 'a');
}

function showStudentLoginGate() {
  document.getElementById('studentLoginGate').style.display = 'block';
  document.getElementById('classroomWorkspace').style.display = 'none';
}

async function handleStudentLogin(e) {
  e.preventDefault();
  const code = document.getElementById('studentCodeInput').value;
  const name = document.getElementById('studentNameInput').value;
  const side = document.getElementById('studentSideSelect').value;
  await loginToClassroomCode(code, name, side);
}

async function loginToClassroomCode(code, studentName, schoolSide) {
  try {
    const res = await fetch('/api/classrooms/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        student_name: studentName,
        school_side: schoolSide
      })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast('⚠️ ' + (data.error || 'Invalid code'));
      return;
    }

    activeStudentSession = data.student_session;
    await fetchClassroomById(data.classroom.id);

    document.getElementById('studentLoginGate').style.display = 'none';
    document.getElementById('classroomWorkspace').style.display = 'block';
    showToast(
      currentLang === 'ar'
        ? `أهلاً بك يا ${activeStudentSession.name} في الغرفة المشتركة (${data.classroom.code})!`
        : `ברוך הבא ${activeStudentSession.name} לחדר המשותף (${data.classroom.code})!`
    );
  } catch (err) {
    console.error(err);
  }
}

async function fetchClassroomById(roomId) {
  try {
    const res = await fetch(`/api/classrooms/${roomId}`);
    activeClassroomData = await res.json();
    renderClassroomWorkspace();
  } catch (err) {
    console.error(err);
  }
}

function switchStudentTab(tabKey) {
  document.getElementById('studentLoginGate').style.display = 'none';
  document.getElementById('classroomWorkspace').style.display = 'block';

  ['forum', 'lab', 'wall'].forEach((k) => {
    const pane = document.getElementById(`student-pane-${k}`);
    if (pane) pane.style.display = k === tabKey ? 'block' : 'none';
  });

  document.getElementById('wsTabForum').classList.toggle('active', tabKey === 'forum');
  document.getElementById('wsTabLab').classList.toggle('active', tabKey === 'lab');
  document.getElementById('wsTabWall').classList.toggle('active', tabKey === 'wall');
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
      ? `${classroom.title_ar} <div style="font-size:1.05rem; font-weight:500; opacity:0.9;" lang="he">${classroom.title_he}</div>`
      : `${classroom.title_he} <div style="font-size:1.05rem; font-weight:500; opacity:0.9;">${classroom.title_ar}</div>`;

  document.getElementById('activeRoomTopic').textContent =
    currentLang === 'ar'
      ? `${classroom.research_topic_ar} | ${classroom.research_topic_he}`
      : `${classroom.research_topic_he} | ${classroom.research_topic_ar}`;

  document.getElementById('activeRoomSupervisors').textContent = `👩‍🏫 إشراف تربوي مشترك | ליווי פדגוגי: ${classroom.supervisor_ar} 🤝 ${classroom.supervisor_he}`;

  renderForumPosts();
  renderResearchDataList();
  renderCanvasBoard();
  initMentorDefaultMessage();
}

// Forum Filtering & Rendering
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
      const isTransOpen = visiblePostTranslations[p.id] !== false; // open by default so user immediately experiences bilingual bridge, and can toggle!

      const repliesHtml = (p.replies || [])
        .map(
          (r) => `
          <div class="reply-item">
            <div style="font-weight:700; font-size:0.82rem; color:var(--navy-800); margin-bottom:3px;">
              ${r.author_name} (${r.school_name_ar})
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
            <span class="interest-chip">${CATEGORY_LABELS[p.category]?.[currentLang] || p.category}</span>
          </div>

          <div class="post-body-original" ${!isOrigAr ? 'lang="he"' : ''}>
            <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">
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

async function previewComposerTranslation() {
  const text = document.getElementById('postContentInput').value;
  const previewBox = document.getElementById('composerTranslationPreview');
  if (!text.trim()) {
    showToast('اكتب نصاً أولاً لمعاينة ترجمته الفورية');
    return;
  }
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  previewBox.style.display = 'block';
  previewBox.innerHTML = `<strong>⚡ المعاينة الفورية (${data.target_lang === 'he' ? 'בעברית' : 'بالعربية'}):</strong><br/>${data.translated}`;
}

async function submitForumPost(e) {
  e.preventDefault();
  if (!activeClassroomData) return;
  const content = document.getElementById('postContentInput').value;
  const category = document.getElementById('postCategorySelect').value;

  const res = await fetch(`/api/classrooms/${activeClassroomData.classroom.id}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category,
      content,
      author_name: activeStudentSession.name,
      school_side: activeStudentSession.school_side,
      school_name_ar: activeStudentSession.school_name_ar,
      school_name_he: activeStudentSession.school_name_he
    })
  });
  if (res.ok) {
    document.getElementById('postContentInput').value = '';
    document.getElementById('composerTranslationPreview').style.display = 'none';
    await fetchClassroomById(activeClassroomData.classroom.id);
    showToast('✨ تم نشر مشاركتك مع الترجمة الفورية باللغتين!');
  }
}

async function submitForumReply(e, postId) {
  e.preventDefault();
  const input = document.getElementById(`reply-input-${postId}`);
  if (!input || !input.value.trim()) return;

  const res = await fetch(`/api/posts/${postId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: input.value,
      author_name: activeStudentSession.name,
      school_name_ar: activeStudentSession.school_name_ar,
      school_name_he: activeStudentSession.school_name_he
    })
  });
  if (res.ok) {
    input.value = '';
    await fetchClassroomById(activeClassroomData.classroom.id);
  }
}

async function likeForumPost(postId) {
  const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
  const data = await res.json();
  const el = document.getElementById(`post-likes-${postId}`);
  if (el) el.textContent = data.likes;
}

// Collaborative Research Hub: Data Sharing
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
        <div style="font-size:0.82rem; color:var(--green-800); font-weight:700; margin-bottom:4px;">
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
  const payload = {
    data_type: document.getElementById('resDataType').value,
    town: document.getElementById('resTown').value,
    title: document.getElementById('resTitle').value,
    summary: document.getElementById('resSummary').value,
    metric_badge: document.getElementById('resBadge').value,
    author_name: activeStudentSession.name
  };

  const res = await fetch(`/api/classrooms/${activeClassroomData.classroom.id}/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    document.getElementById('uploadResearchForm').reset();
    document.getElementById('uploadResearchForm').style.display = 'none';
    await fetchClassroomById(activeClassroomData.classroom.id);
    showToast('📂 تم رفع المعطيات الميدانية وترجمتها للفريق المشترك!');
  }
}

// Collaborative Research Canvas (Padlet)
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
          <div style="font-weight:600; margin-bottom:4px;">${c.content_ar}</div>
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

async function submitCanvasCard(e) {
  e.preventDefault();
  if (!activeClassroomData) return;
  const column_key = document.getElementById('canvasColSelect').value;
  const content = document.getElementById('canvasCardInput').value;

  const res = await fetch(`/api/classrooms/${activeClassroomData.classroom.id}/canvas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      column_key,
      content,
      author_name: activeStudentSession.name,
      school_side: activeStudentSession.school_side,
      color_tag: column_key === 'conclusions' ? 'green' : column_key === 'field_work' ? 'amber' : 'blue'
    })
  });

  if (res.ok) {
    document.getElementById('canvasCardInput').value = '';
    await fetchClassroomById(activeClassroomData.classroom.id);
    showToast('📌 تمت إضافة البطاقة إلى لوحة العمل التعاوني باللغتين!');
  }
}

async function voteCanvasCard(cardId) {
  await fetch(`/api/canvas/${cardId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vote: true })
  });
  await fetchClassroomById(activeClassroomData.classroom.id);
}

// Smart AI Research Mentor
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

async function askMentorPreset(keyword) {
  document.getElementById('mentorQuestionInput').value = keyword;
  await queryMentorAPI(keyword);
}

async function submitMentorQuestion(e) {
  e.preventDefault();
  const q = document.getElementById('mentorQuestionInput').value;
  if (!q.trim()) return;
  await queryMentorAPI(q);
  document.getElementById('mentorQuestionInput').value = '';
}

async function queryMentorAPI(question) {
  const box = document.getElementById('mentorConversationBox');
  const res = await fetch('/api/mentor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      topic_ar: activeClassroomData?.classroom?.research_topic_ar,
      topic_he: activeClassroomData?.classroom?.research_topic_he
    })
  });
  const data = await res.json();
  box.innerHTML = `
    <div style="margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid var(--border-color);">
      ${data.reply_ar}
    </div>
    <div lang="he" style="color:var(--green-800);">
      ${data.reply_he}
    </div>
  `;
}

// Shared Wall of Achievements
async function loadAchievements() {
  try {
    const res = await fetch('/api/achievements');
    const items = await res.json();

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
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">📅 دفعة ${a.year}</span>
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
  } catch (err) {
    console.error(err);
  }
}

async function likeAchievement(id) {
  const res = await fetch(`/api/achievements/${id}/like`, { method: 'POST' });
  const data = await res.json();
  document.querySelectorAll(`.ach-like-count-${id}`).forEach((el) => {
    el.textContent = data.likes;
  });
}
