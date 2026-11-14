const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'bayt.sqlite');
const db = new DatabaseSync(dbPath);

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_ar TEXT NOT NULL,
      name_he TEXT NOT NULL,
      city_ar TEXT NOT NULL,
      city_he TEXT NOT NULL,
      region TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      sector TEXT NOT NULL,
      age_stage TEXT NOT NULL,
      target_grades TEXT NOT NULL,
      interests TEXT NOT NULL,
      activity_type TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      contact_role TEXT NOT NULL,
      contact_email TEXT UNIQUE NOT NULL,
      contact_phone TEXT NOT NULL,
      password TEXT NOT NULL,
      bio_ar TEXT NOT NULL,
      bio_he TEXT NOT NULL,
      students_count INTEGER DEFAULT 45,
      matched_school_id INTEGER DEFAULT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS match_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_school_id INTEGER NOT NULL,
      to_school_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'interested',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(from_school_id, to_school_id)
    );

    CREATE TABLE IF NOT EXISTS classrooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      school_a_id INTEGER NOT NULL,
      school_b_id INTEGER NOT NULL,
      title_ar TEXT NOT NULL,
      title_he TEXT NOT NULL,
      research_topic_ar TEXT NOT NULL,
      research_topic_he TEXT NOT NULL,
      research_desc_ar TEXT NOT NULL,
      research_desc_he TEXT NOT NULL,
      supervisor_ar TEXT NOT NULL,
      supervisor_he TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS forum_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classroom_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT DEFAULT 'student',
      school_side TEXT NOT NULL,
      school_name_ar TEXT NOT NULL,
      school_name_he TEXT NOT NULL,
      original_lang TEXT NOT NULL,
      content_ar TEXT NOT NULL,
      content_he TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      supervised INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS forum_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      school_name_ar TEXT NOT NULL,
      school_name_he TEXT NOT NULL,
      original_lang TEXT NOT NULL,
      content_ar TEXT NOT NULL,
      content_he TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS research_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classroom_id INTEGER NOT NULL,
      data_type TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      title_he TEXT NOT NULL,
      town_ar TEXT NOT NULL,
      town_he TEXT NOT NULL,
      author_name TEXT NOT NULL,
      summary_ar TEXT NOT NULL,
      summary_he TEXT NOT NULL,
      metric_badge TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS canvas_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classroom_id INTEGER NOT NULL,
      column_key TEXT NOT NULL,
      author_name TEXT NOT NULL,
      school_side TEXT NOT NULL,
      content_ar TEXT NOT NULL,
      content_he TEXT NOT NULL,
      color_tag TEXT DEFAULT 'teal',
      votes INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_ar TEXT NOT NULL,
      title_he TEXT NOT NULL,
      schools_ar TEXT NOT NULL,
      schools_he TEXT NOT NULL,
      category TEXT NOT NULL,
      format_type TEXT NOT NULL,
      summary_ar TEXT NOT NULL,
      summary_he TEXT NOT NULL,
      impact_ar TEXT NOT NULL,
      impact_he TEXT NOT NULL,
      likes INTEGER DEFAULT 24,
      year TEXT DEFAULT '2026'
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as c FROM schools').get().c;
  if (count === 0) {
    seedDatabase();
  }
}

function seedDatabase() {
  const insertSchool = db.prepare(`
    INSERT INTO schools (
      name_ar, name_he, city_ar, city_he, region, lat, lng,
      sector, age_stage, target_grades, interests, activity_type,
      contact_name, contact_role, contact_email, contact_phone, password,
      bio_ar, bio_he, students_count, matched_school_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1. Ibn Khaldoun - Umm al-Fahm (Matched with #2)
  insertSchool.run(
    'مدرسة ابن خلدون الإعدادية',
    'חטיבת ביניים אבן ח׳לדון',
    'أم الفحم',
    'אום אל-פחם',
    'north_valley',
    32.5173, 35.1534,
    'arab',
    'middle',
    '8-9',
    JSON.stringify(['science_env', 'history_heritage', 'social_entrepreneurship']),
    'hybrid',
    'د. ريم جبارين',
    'مديرة المدرسة / מנהלת בית הספר',
    'ibnkhaldoun@bayt.edu',
    '050-4123456',
    '123456',
    'مدرسة رائدة في البحث العلمي البيئي وتوثيق التراث المحلي في وادي عارة، نؤمن ببناء جسور الحوار عبر المشاريع العلمية الميدانية.',
    'בית ספר מוביל במחקר מדעי-סביבתי ותיעוד מורשת מקומית בוואדי עארה, המאמין בבניית גשרי שיח דרך פרויקטים מדעיים משותפים.',
    65,
    2
  );

  // 2. Kramim - Afula (Matched with #1)
  insertSchool.run(
    'مدرسة كرميم الشاملة',
    'בית ספר מקיף כרמים',
    'العفولة',
    'עפולה',
    'north_valley',
    32.6078, 35.2897,
    'jewish_state',
    'middle',
    '8-9',
    JSON.stringify(['science_env', 'history_heritage', 'arts_music']),
    'hybrid',
    'ياعيل ليفي (יעל לוי)',
    'مركزة التربية الاجتماعية / רכזת חינוך חברתי',
    'kramim@bayt.edu',
    '052-8765432',
    '123456',
    'مدرسة تهتم بالاستدامة البيئية، الفنون، والمبادرات المجتمعية في مرج ابن عامر، وتسعى لشراكة حقيقية ومستدامة مع مدارس المنطقة.',
    'בית ספר המקדם קיימות סביבתית, אמנויות ויוזמות קהילתיות בעמק יזרעאל, ושואף לשותפות אמיתית ומתמשכת עם בתי ספר באזור.',
    60,
    1
  );

  // 3. Al-Bishara - Nazareth (UNMATCHED - ready for matching!)
  insertSchool.run(
    'مدرسة البشارة الثانوية',
    'תיכון אל-בישארה',
    'الناصرة',
    'נצרת',
    'galilee',
    32.7019, 35.2978,
    'arab',
    'high',
    '10-11',
    JSON.stringify(['science_env', 'lit_lang', 'social_entrepreneurship']),
    'hybrid',
    'أ. سامر زعبي',
    'مركز المشاريع المشتركة / רכז פרויקטים משותפים',
    'bishara@bayt.edu',
    '054-3322110',
    '123456',
    'نبحث عن مدرسة شريكة لطلاب الصفوف العاشرة والحادية عشرة لتطوير مشاريع ريادة أعمال مجتمعية وأبحاث بيئية مشتركة.',
    'מחפשים בית ספר שותף לתלמידי כיתות י׳-י״א לפיתוח מיזמים חברתיים ומחקרי סביבה משותפים.',
    50,
    null
  );

  // 4. ORT Alon - Nof HaGalil (UNMATCHED - great match for #3!)
  insertSchool.run(
    'مدرسة أورت ألون',
    'אורט אלון נוף הגליל',
    'نوف هجليل',
    'נוף הגליל',
    'galilee',
    32.7066, 35.3245,
    'jewish_state',
    'high',
    '10-11',
    JSON.stringify(['science_env', 'social_entrepreneurship', 'lit_lang']),
    'hybrid',
    'دفنا كوهين (דפנה כהן)',
    'مديرة المرحلة الثانوية / מנהלת חטיבה עליונה',
    'ortalon@bayt.edu',
    '052-9988776',
    '123456',
    'مدرسة ثانوية تكنولوجية وإنسانية في نوف هجليل، متحمسون لبناء بيت مشترك مع مدرسة جارة في الناصرة للبحث العلمي والريادة.',
    'תיכון טכנולוגי-ערכי בנוף הגליל, נרגשים לבנות בית משותף עם בית ספר שכן בנצרת למחקר מדעי ויזמות חברתית.',
    55,
    null
  );

  // 5. Al-zahraa - Tira (UNMATCHED - Middle school)
  insertSchool.run(
    'مدرسة الزهراء الإعدادية',
    'חטיבת ביניים א-זהראא',
    'الطيرة',
    'טירה',
    'center_sharon',
    32.2341, 34.9503,
    'arab',
    'middle',
    '7-8',
    JSON.stringify(['arts_music', 'lit_lang', 'history_heritage']),
    'hybrid',
    'مادلين منصور',
    'مركزة التربية الاجتماعية / רכזת חינוך חברתי',
    'zahraa@bayt.edu',
    '050-6655443',
    '123456',
    'مدرسة إعدادية في الطيرة تركز على الإبداع الأدبي، الموسيقى، وتوثيق الحكايات الشعبية العائلية.',
    'חטיבת ביניים בטירה המתמקדת ביצירה ספרותית, מוזיקה ותיעוד סיפורי משפחה ומורשת.',
    40,
    null
  );

  // 6. HaSharon - Kfar Saba (UNMATCHED - Middle school, close to Tira)
  insertSchool.run(
    'إعدادية هشارون',
    'חטיבת ביניים השרון',
    'كفار سابا',
    'כפר סבא',
    'center_sharon',
    32.1780, 34.9065,
    'jewish_state',
    'middle',
    '7-8',
    JSON.stringify(['arts_music', 'lit_lang', 'science_env']),
    'hybrid',
    'رونين شبيرا (רונן שפירא)',
    'مدير المدرسة / מנהל בית הספר',
    'hasharon@bayt.edu',
    '054-7788991',
    '123456',
    'نسعى لربط طلابنا بجيراننا في منطقة المثلث والشارون عبر الفنون، اللغات، والعمل البحثي المشترك.',
    'שואפים לחבר את תלמידינו לשכנינו באזור המשולש והשרון דרך אמנות, שפות ועבודת חקר משותפת.',
    48,
    null
  );

  // 7. Al-Noor Elementary - Haifa (UNMATCHED - Elementary)
  insertSchool.run(
    'مدرسة النور الابتدائية',
    'בית ספר יסודי אל-נור',
    'حيفا',
    'חיפה',
    'haifa_coast',
    32.8156, 34.9892,
    'arab',
    'elementary',
    '5-6',
    JSON.stringify(['science_env', 'arts_music', 'history_heritage']),
    'online',
    'سهاد خوري',
    'مركزة الحوسبة والمشاريع / רכזת תקשוב ופרויקטים',
    'alnoor@bayt.edu',
    '053-2211445',
    '123456',
    'نعمل على غرس قيم الاحترام المتبادل وحب الطبيعة والبحر لدى طلاب الصفوف الخامسة والسادسة في حيفا.',
    'פועלים להטמעת ערכי כבוד הדדי ואהבת הטבע והים בקרב תלמידי כיתות ה׳-ו׳ בחיפה.',
    38,
    null
  );

  // 8. Ofakim Elementary - Haifa (UNMATCHED - Elementary, close to #7)
  insertSchool.run(
    'مدرسة أوفكيم الابتدائية',
    'בית ספר יסודי אופקים',
    'حيفا',
    'חיפה',
    'haifa_coast',
    32.7940, 34.9896,
    'jewish_state',
    'elementary',
    '5-6',
    JSON.stringify(['science_env', 'arts_music', 'lit_lang']),
    'online',
    'نوعا بار (נועה בר)',
    'مركزة طبقة / רכזת שכבה',
    'ofakim@bayt.edu',
    '052-3344556',
    '123456',
    'مدرسة ابتدائية في حيفا تبحث عن شريك تعليمي لبرنامج سنوي مشترك حول بيئة ساحل الكرمل والفنون.',
    'בית ספר יסודי בחיפה המחפש שותף חינוכי לתוכנית שנתית משותפת סביב סביבת חוף הכרמל ואמנויות.',
    42,
    null
  );

  // 9. Al-Salam - Rahat (UNMATCHED - High school in Negev)
  insertSchool.run(
    'مدرسة السلام الثانوية',
    'תיכון א-סלאם',
    'رهط',
    'רהט',
    'negev',
    31.3925, 34.7544,
    'arab',
    'high',
    '10-12',
    JSON.stringify(['science_env', 'social_entrepreneurship', 'history_heritage']),
    'research',
    'أ. خالد القريناوي',
    'مدير المدرسة / מנהל בית הספר',
    'alsalam@bayt.edu',
    '050-9911223',
    '123456',
    'مهتمون بمشاريع الطاقة المتجددة، الزراعة الصحراوية، وتوثيق التراث الثقافي في النقب.',
    'מתעניינים בפרויקטים של אנרגיה מתחדשת, חקלאות מדברית ותיעוד מורשת תרבותית בנגב.',
    52,
    null
  );

  // 10. Dekalim Religious State - Beersheba (UNMATCHED - High school in Negev)
  insertSchool.run(
    'مدرسة دكاليم الثانوية',
    'תיכון ממ"ד דקלים',
    'بئر السبع',
    'באר שבע',
    'negev',
    31.2518, 34.7913,
    'jewish_religious',
    'high',
    '10-12',
    JSON.stringify(['science_env', 'history_heritage', 'social_entrepreneurship']),
    'research',
    'أفيتال مزراحي (אביטל מזרחי)',
    'مركزة البحث العلمي / רכזת מגמת מחקר',
    'dekalim@bayt.edu',
    '054-1122334',
    '123456',
    'نطمح للتعاون البحثي في قضايا المياه والمناخ الصحراوي مع مدارس المجتمع العربي في النقب.',
    'שואפים לשיתוף פעולה מחקרי בסוגיות מים ואקלים מדברי עם בתי ספר מהחברה הערבית בנגב.',
    46,
    null
  );

  // Match request record for schools 1 & 2
  db.prepare(`
    INSERT INTO match_requests (from_school_id, to_school_id, status)
    VALUES (1, 2, 'room_created'), (3, 4, 'interested')
  `).run();

  // Classroom for Ibn Khaldoun (1) & Kramim (2)
  db.prepare(`
    INSERT INTO classrooms (
      code, school_a_id, school_b_id,
      title_ar, title_he,
      research_topic_ar, research_topic_he,
      research_desc_ar, research_desc_he,
      supervisor_ar, supervisor_he
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'BAYT-2026',
    1,
    2,
    'مدرسة ابن خلدون، أم الفحم 🤝 مدرسة كرميم، العفولة',
    'חט"ב אבן ח׳לדון, אום אל-פחם 🤝 מקיף כרמים, עפולה',
    'جودة المياه الجوفية والينابيع وحكايات كبار السن في وادي عارة ومرج ابن عامر',
    'איכות מי תהום ומעיינות וסיפורי ותיקים בוואדי עארה ובעמק יזרעאל',
    'مشروع بحثي مشترك يدمج بين الفحص العلمي لجودة المياه في ينابيع البلدتين وتوثيق الذاكرة الشفوية لكبار السن حول علاقة الإنسان بالأرض والمياه.',
    'פרויקט מחקר משותף המשלב בדיקה מדעית של איכות המים במעיינות שני היישובים ותיעוד הזיכרון ההיסטורי של זקני היישובים על הקשר בין אדם, אדמה ומים.',
    'د. ريم جبارين وأ. محمود إغبارية',
    'יעל לוי ודניאל כהן'
  );

  // Second sample classroom
  db.prepare(`
    INSERT INTO classrooms (
      code, school_a_id, school_b_id,
      title_ar, title_he,
      research_topic_ar, research_topic_he,
      research_desc_ar, research_desc_he,
      supervisor_ar, supervisor_he
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'GALIL-101',
    3,
    4,
    'مدرسة البشارة، الناصرة 🤝 مدرسة أورت ألون، نوف هجليل',
    'תיכון אל-בישארה, נצרת 🤝 אורט אלון, נוף הגליל',
    'الجزر الحرارية والتشجير الحضري المشترك بين الناصرة ونوف هجليل',
    'איי חום עירוניים וייעור עירוני משותף בין נצרת לנוף הגליל',
    'دراسة ميدانية لقياس درجات الحرارة في الأحياء المتجاورة وتصميم مبادرة تشجير طلابية مشتركة.',
    'מחקר שדה למדידת טמפרטורות בשכונות סמוכות ותכנון יוזמת נטיעות תלמידים משותפת.',
    'أ. سامر زعبي',
    'דפנה כהן'
  );

  // Forum Posts in Classroom 1
  const insertPost = db.prepare(`
    INSERT INTO forum_posts (
      classroom_id, category, author_name, author_role, school_side,
      school_name_ar, school_name_he, original_lang, content_ar, content_he, likes, supervised
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPost.run(
    1,
    'self_intro',
    'أمير جبارين | אמיר ג׳בארין',
    'student',
    'a',
    'مدرسة ابن خلدون - أم الفحم',
    'אבן ח׳לדון - אום אל-פחם',
    'ar',
    'مرحباً بالجميع في بيتنا المشترك! أنا أمير من الصف التاسع في أم الفحم. أحب التصوير الفوتوغرافي والعلوم البيئية، ومتحمس جداً لزيارة العفولة وفحص عينات المياه معاً.',
    'שלום לכולם בבית המשותף שלנו! אני אמיר מכיתה ט׳ באום אל-פחם. אני אוהב צילום ומדעי הסביבה, ונרגש מאוד לבקר בעפולה ולבדוק יחד דגימות מים.',
    14,
    1
  );

  insertPost.run(
    1,
    'self_intro',
    'مايا ليفي | מאיה לוי',
    'student',
    'b',
    'مدرسة كرميم - العفولة',
    'מקיף כרמים - עפולה',
    'he',
    'أهلاً أمير وجميع الأصدقاء! أنا مايا من العفولة. هوايتي العزف على الجيتار والبحث في تاريخ المنطقة. بفضل الترجمة الفورية في المنصة فهمت رسالتك فوراً ويسعدني أن نكون في نفس الفريق البحثي!',
    'היי אמיר וכל החברים! אני מאיה מעפולה. התחביב שלי הוא נגינה בגיטרה וחקר ההיסטוריה של האזור. בזכות התרגום המיידי בפלטפורמה הבנתי את ההודעה שלך מיד ואני שמחה שנהיה באותו צוות מחקר!',
    19,
    1
  );

  insertPost.run(
    1,
    'favorite_food',
    'ليان محاميد | ליאן מחאמיד',
    'student',
    'a',
    'مدرسة ابن خلدون - أم الفحم',
    'אבן ח׳לדון - אום אל-פחם',
    'ar',
    'في موضوع أكلتنا المفضلة: جدتي تعد أفضل "مسخن" بزيت الزيتون الجديد من كروم عائلتنا في اللجون. في لقائنا القادم سنحضر لكم خبز الطابون الساخن مع الزعتر البلدي!',
    'בנושא המאכל האהוב שלנו: סבתא שלי מכינה את ה"מסח׳ן" הטוב ביותר עם שמן זית חדש מכרמי המשפחה שלנו בלג׳ון. במפגש הבא שלנו נביא לכם לחם טאבון חם עם זעתר מקומי!',
    23,
    1
  );

  insertPost.run(
    1,
    'holidays',
    'عومر كوهين | עומר כהן',
    'student',
    'b',
    'مدرسة كرميم - العفولة',
    'מקיף כרמים - עפולה',
    'he',
    'اقترب عيد الشجرة (طو بشفاط) وعائلتنا تخرج دائماً لزراعة الأشجار في المرج. ما رأيكم أن ننظم يوماً مشتركاً لزراعة أشجار التين والزيتون واللوز حول النبع الذي نبحثه؟',
    'חג האילנות (ט"ו בשבט) מתקרב והמשפחה שלנו תמיד יוצאת לנטוע עצים בעמק. מה דעתכם שנארגן יום משותף לנטיעת עצי תאנה, זית ושקד סביב המעיין שאנחנו חוקרים?',
    27,
    1
  );

  // Replies
  const insertReply = db.prepare(`
    INSERT INTO forum_replies (
      post_id, author_name, school_name_ar, school_name_he, original_lang, content_ar, content_he
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertReply.run(
    1,
    'يوني شاحر | יוני שחר',
    'مدرسة كرميم - العفولة',
    'מקיף כרמים - עפולה',
    'he',
    'مرحباً أمير! أنا أيضاً أحب التصوير، يمكننا توثيق مراحل فحص المياه بالكاميرا معاً.',
    'שלום אמיר! גם אני אוהב צילום, נוכל לתעד יחד את שלבי בדיקת המים במצלמה.'
  );

  insertReply.run(
    3,
    'مايا ليفي | מאיה לוי',
    'مدرسة كرميم - العفولة',
    'מקיף כרמים - עפולה',
    'he',
    'يبدو شهياً جداً يا ليان! ونحن سنحضر كعكة العسل والفواكه المجففة من المرج.',
    'נשמע טעים מאוד ליאן! ואנחנו נביא עוגת דבש ופירות יבשים מהעמק.'
  );

  // Research Data items
  const insertResearch = db.prepare(`
    INSERT INTO research_data (
      classroom_id, data_type, title_ar, title_he, town_ar, town_he,
      author_name, summary_ar, summary_he, metric_badge
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertResearch.run(
    1,
    'measurement',
    'فحص حموضة ونقاء مياه عين الشعرة في أم الفحم',
    'בדיקת חומציות וצלילות מים בעין א-שערה באום אל-פחם',
    'أم الفحم',
    'אום אל-פחם',
    'أمير جبارين & سارة اغبارية',
    'أخذنا 3 عينات من مياه النبع بعد المطر الأول. مستوى pH بلغ 7.4 ونسبة الأملاح المذابة TDS منخفضة (310 ppm)، مما يدل على جودة عالية تحتاج لحماية من التلوث البلاستيكي.',
    'דגמנו 3 דגימות ממי המעיין אחרי הגשם הראשון. רמת ה-pH עמדה על 7.4 וריכוז המלחים המומסים (TDS) נמוך (310 ppm), מה שמעיד על איכות גבוהה הדורשת הגנה מפני זיהום פלסטיק.',
    'pH 7.4 | 310 ppm'
  );

  insertResearch.run(
    1,
    'measurement',
    'قياس جودة المياه في مجرى نهر جالود (عين جالود) قرب العفولة',
    'מדידת איכות מים בנחל חרוד (מעיין חרוד) ליד עפולה',
    'العفولة',
    'עפולה',
    'مايا ليفي & عومر كوهين',
    'فحصنا درجة الحرارة والأكسجين المذاب ومستوى النترات. مستوى pH بلغ 7.6 مع وجود حاجة لتنظيف ضفاف المجرى وزيادة النباتات المائية الطبيعية لتنقية المياه.',
    'בדקנו טמפרטורה, חמצן מומס ורמת חנקות. רמת ה-pH עמדה על 7.6 עם צורך בניקוי גדות הנחל והגדלת צמחיית המים הטבעית לטיהור המים.',
    'pH 7.6 | O₂ 8.2 mg/L'
  );

  insertResearch.run(
    1,
    'interview',
    'مقابلة مسجلة مع الحاج أبو صالح (82 عاماً) حول عيون الماء التاريخية',
    'ראיון מוקלט עם אל-חאג׳ אבו סאלח (בן 82) על מעיינות המים ההיסטוריים',
    'أم الفحم',
    'אום אל-פחם',
    'ليان محاميد & يوني شاحر',
    'يروي الحاج كيف كانت عيون الماء نقطة التقاء للفلاحين والرعاة والمسافرين من كل البلدات المجاورة، وكيف كانوا ينظفون القنوات الحجرية بشكل تعاوني كل ربيع.',
    'אל-חאג׳ מספר כיצד מעיינות המים היו נקודת מפגש לחקלאים, רועים ונוסעים מכל היישובים הסמוכים, וכיצד ניקו את תעלות האבן בשיתוף פעולה בכל אביב.',
    'تسجيل صوتي 14 د | הקלטה 14 דק׳'
  );

  insertResearch.run(
    1,
    'photo',
    'ألبوم صور مقارن للنباتات البرية حول الينابيع في البلدتين',
    'אלבום תמונות השוואתי של צמחיית בר סביב המעיינות בשני היישובים',
    'أم الفحم والعفولة',
    'אום אל-פחם ועפולה',
    'فريق التصوير المشترك',
    'توثيق مصور لنباتات الحبق المائي، القصب، وشقائق النعمان المشتركة في كلا الموقعين، مع بطاقة تعريفية بالاسمين العربي والعبري والاسم العلمي.',
    'תיעוד מצולם של נענת המים, קנה מצוי וכלניות המשותפים לשני האתרים, עם כרטיס מידע בשם הערבי, העברי והמדעי.',
    '18 صورة موثقة | 18 תמונות'
  );

  // Collaborative Canvas Cards
  const insertCard = db.prepare(`
    INSERT INTO canvas_cards (
      classroom_id, column_key, author_name, school_side, content_ar, content_he, color_tag, votes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCard.run(
    1,
    'ideas',
    'أمير & مايا',
    'joint',
    'سؤال البحث: كيف يؤثر النشاط البشري والزراعي على نقاء مياه الينابيع في وادي عارة والمرج؟',
    'שאלת המחקר: כיצד משפיעה הפעילות האנושית והחקלאית על צלילות מי המעיינות בוואדי עארה ובעמק?',
    'blue',
    9
  );

  insertCard.run(
    1,
    'ideas',
    'ليان محاميد',
    'a',
    'إضافة فصل خاص في البحث يقارن بين الأمثال الشعبية العربية والعبرية حول الماء والمطر.',
    'הוספת פרק מיוחד במחקר המשווה בין פתגמים עממיים בערבית ובעברית על מים וגשם.',
    'green',
    11
  );

  insertCard.run(
    1,
    'field_work',
    'عومر & سارة',
    'joint',
    'توحيد استمارة فحص المياه (pH، الحرارة، العكورة، النباتات المحيطة) لنستخدم نفس المعايير في البلدتين.',
    'איחוד טופס בדיקת המים (pH, טמפרטורה, עכירות, צמחייה סובבת) כדי שנשתמש באותם מדדים בשני היישובים.',
    'amber',
    8
  );

  insertCard.run(
    1,
    'drafting',
    'يوني & أمير',
    'joint',
    'تصميم خريطة تفاعلية ثنائية اللغة تعرض مواقع الينابيع ونتائج الفحص المخبري ومقاطع صوت كبار السن.',
    'עיצוב מפה אינטראקטיבית דו-לשונית המציגה את מיקומי המעיינות, תוצאות המעבדה וקטעי הקול של הוותיקים.',
    'blue',
    14
  );

  insertCard.run(
    1,
    'conclusions',
    'الفريق المشترك',
    'joint',
    'توصية للبلديتين: وضع لافتات إرشادية باللغتين العربية والعبرية لحماية الينابيع كإرث طبيعي وثقافي مشترك.',
    'המלצה לשתי העיריות: הצבת שלטי הסברה בערבית ובעברית להגנה על המעיינות כמורשת טבעית ותרבותית משותפת.',
    'green',
    17
  );

  // Shared Wall of Achievements
  const insertAchievement = db.prepare(`
    INSERT INTO achievements (
      title_ar, title_he, schools_ar, schools_he, category, format_type,
      summary_ar, summary_he, impact_ar, impact_he, likes, year
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAchievement.run(
    'أطلس الينابيع والذاكرة المشتركة',
    'אטלס המעיינות והזיכרון המשותף',
    'مدرسة ابن خلدون (أم الفحم) 🤝 مدرسة كرميم (العفولة)',
    'חט"ב אבן ח׳לדון (אום אל-פחם) 🤝 מקיף כרמים (עפולה)',
    'science_env',
    'عرض تقديمي تفاعلي + خريطة رقمية | מצגת אינטראקטיבית + מפה דיגיטלית',
    'بحث علمي وتراثي متكامل شمل فحص 6 ينابيع وإجراء 12 مقابلة مع كبار السن، تُوّج بمعرض مشترك بحضور الأهالي ورؤساء البلديات.',
    'מחקר מדעי-מורשתי מקיף שכלל בדיקת 6 מעיינות ו-12 ראיונות עם זקני היישובים, שהגיע לשיאו בתערוכה משותפת בנוכחות הורים וראשי רשויות.',
    'تم تبني توصيات الطلاب لتنظيف وتأهيل مسار عين الشعرة وعين جالود بلوحات ثنائية اللغة.',
    'המלצות התלמידים אומצו לניקוי ושיקום שביל עין א-שערה ומעיין חרוד עם שילוט דו-לשוני.',
    48,
    '2026'
  );

  insertAchievement.run(
    'مجسم المدينة الخضراء الذكية في الجليل',
    'דגם העיר הירוקה והחכמה בגליל',
    'مدرسة البشارة (الناصرة) 🤝 أورت ألون (نوف هجليل)',
    'תיכון אל-בישארה (נצרת) 🤝 אורט אלון (נוף הגליל)',
    'social_entrepreneurship',
    'مجسم هندسي ثلاثي الأبعاد + فيديو | דגם הנדסי תלת-ממדי + וידאו',
    'قام 40 طالباً وطالبة بتصميم مجسم معماري يربط بين المدينتين بحديقة بيئية تعمل بالطاقة الشمسية ومسارات مشي آمنة للطلاب.',
    '40 תלמידים ותלמידות תכננו דגם אדריכלי המחבר בין שתי הערים באמצעות פארק אקולוגי סולארי ושבילי הליכה בטוחים לתלמידים.',
    'فاز المشروع بجائزة المبادرة التربوية المشتركة وعُرض في مؤتمر المناخ الشبابي.',
    'הפרויקט זכה בפרס היוזמה החינוכית המשותפת והוצג בוועידת האקלים לנוער.',
    39,
    '2026'
  );

  insertAchievement.run(
    'كتاب وصوت: حكايات الجدات والمطبخ البلدي',
    'ספר וקול: סיפורי סבתות והמטבח המקומי',
    'مدرسة الزهراء (الطيرة) 🤝 إعدادية هشارون (كفار سابا)',
    'חט"ב א-זהראא (טירה) 🤝 חט"ב השרון (כפר סבא)',
    'history_heritage',
    'كتاب رقمي مصور وبودكاست | ספר דיגיטלי מאויר ופודקאסט',
    'توثيق 24 قصة عائلية ووصفة تقليدية باللغتين العربية والعبرية مع رسومات فنية من إبداع الطلاب.',
    'תיעוד 24 סיפורים משפחתיים ומתכונים מסורתיים בערבית ובעברית בליווי איורים אמנותיים פרי יצירת התלמידים.',
    'طباعة 500 نسخة وتوزيعها على مكتبات المدارس في المنطقة.',
    'הדפסת 500 עותקים וחלוקתם לספריות בתי הספר באזור.',
    54,
    '2026'
  );
}

initDb();

module.exports = { db };
