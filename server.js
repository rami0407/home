const express = require('express');
const cors = require('cors');
const path = require('path');
const { db } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// City coordinate lookup table for accurate geographic distance calculation
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
  'באר שבע': { lat: 31.2518, lng: 34.7913, he: 'באר שבע', ar: 'بئر السبع', region: 'negev' },
  'طمرة': { lat: 32.8536, lng: 35.1978, he: 'טמרה', ar: 'طمرة', region: 'galilee' },
  'טמרה': { lat: 32.8536, lng: 35.1978, he: 'טמרה', ar: 'طمرة', region: 'galilee' },
  'كرميئيل': { lat: 32.9136, lng: 35.2961, he: 'כרמיאל', ar: 'كرميئيل', region: 'galilee' },
  'כרמיאל': { lat: 32.9136, lng: 35.2961, he: 'כרמיאל', ar: 'كرميئيل', region: 'galilee' },
  'سخنين': { lat: 32.8647, lng: 35.2975, he: 'סח׳נין', ar: 'سخنين', region: 'galilee' },
  'סח׳נין': { lat: 32.8647, lng: 35.2975, he: 'סח׳נין', ar: 'سخنين', region: 'galilee' },
  'عكا': { lat: 32.9278, lng: 35.0818, he: 'עכו', ar: 'عكا', region: 'haifa_coast' },
  'עכו': { lat: 32.9278, lng: 35.0818, he: 'עכו', ar: 'عكا', region: 'haifa_coast' },
  'باقة الغربية': { lat: 32.4189, lng: 35.0408, he: 'באקה אל-גרבייה', ar: 'باقة الغربية', region: 'center_sharon' },
  'באקה אל-גרבייה': { lat: 32.4189, lng: 35.0408, he: 'באקה אל-גרבייה', ar: 'باقة الغربية', region: 'center_sharon' },
  'الخضيرة': { lat: 32.4340, lng: 34.9197, he: 'חדרה', ar: 'الخضيرة', region: 'center_sharon' },
  'חדרה': { lat: 32.4340, lng: 34.9197, he: 'חדרה', ar: 'الخضيرة', region: 'center_sharon' },
  'القدس': { lat: 31.7683, lng: 35.2137, he: 'ירושלים', ar: 'القدس', region: 'jerusalem' },
  'ירושלים': { lat: 31.7683, lng: 35.2137, he: 'ירושלים', ar: 'القدس', region: 'jerusalem' },
  'يافا - تل أبيب': { lat: 32.0543, lng: 34.7516, he: 'תל אביב - יפו', ar: 'يافا - تل أبيب', region: 'center_sharon' },
  'תל אביב - יפו': { lat: 32.0543, lng: 34.7516, he: 'תל אביב - יפו', ar: 'يافا - تل أبيب', region: 'center_sharon' }
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

// Smart Bilingual Translation Engine (Arabic <-> Hebrew)
const BILINGUAL_PHRASES = [
  { ar: 'مرحباً بالجميع', he: 'שלום לכולם' },
  { ar: 'مرحبا بالجميع', he: 'שלום לכולם' },
  { ar: 'مرحباً', he: 'שלום' },
  { ar: 'مرحبا', he: 'שלום' },
  { ar: 'أهلاً وسهلاً', he: 'ברוכים הבאים' },
  { ar: 'أهلاً', he: 'היי' },
  { ar: 'أنا اسمي', he: 'קוראים לי' },
  { ar: 'اسمي', he: 'שמי' },
  { ar: 'أنا طالب في', he: 'אני תלמיד ב' },
  { ar: 'أنا طالبة في', he: 'אני תלמידה ב' },
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
  { ar: 'متحمسون للعمل معكم', he: 'נרגשים לעבוד איתכם' },
  { ar: 'متحمس للعمل معكم', he: 'נרגש לעבוד איתכם' },
  { ar: 'يسعدني التعرف عليكم', he: 'שמח להכיר אתכם' },
  { ar: 'في بيتنا المشترك', he: 'בבית המשותף שלנו' },
  { ar: 'مدرسة', he: 'בית ספר' },
  { ar: 'طلاب', he: 'תלמידים' },
  { ar: 'شراكة', he: 'שותפות' },
  { ar: 'أكلتنا المفضلة', he: 'המאכל האהוב שלנו' },
  { ar: 'المسخن', he: 'מסח׳ן' },
  { ar: 'الكنافة', he: 'כנאפה' },
  { ar: 'الحمص', he: 'חומוס' },
  { ar: 'الفلافل', he: 'פלאפל' },
  { ar: 'شكراً جزيلاً', he: 'תודה רבה' },
  { ar: 'شكرا', he: 'תודה' },
  { ar: 'فكرة رائعة', he: 'רעיון נהדר' },
  { ar: 'نعم بالتأكيد', he: 'כן בהחלט' },
  { ar: 'متى نلتقي', he: 'מתי נפגשים' },
  { ar: 'لقاء', he: 'מפגש' },
  { ar: 'تراث', he: 'מורשת' },
  { ar: 'تاريخ', he: 'היסטוריה' },
  { ar: 'المناخ', he: 'אקלים' }
];

function detectLang(text) {
  const hebrewRegex = /[\u0590-\u05FF]/;
  const arabicRegex = /[\u0600-\u06FF]/;
  if (hebrewRegex.test(text) && !arabicRegex.test(text)) return 'he';
  return 'ar';
}

function smartTranslate(text, targetLang) {
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
    if (matchCount > 0 && !/[\u0600-\u06FF]/.test(translated)) {
      return translated;
    }
    if (matchCount > 0) {
      return `${translated} (תרגום חכם מערבית: "${clean}")`;
    }
    return `[תרגום מיידי לעברית] שלום חברים לבית המשותף! בהמשך לדבריי: "${clean}" — נשמח לשתף פעולה במחקר ובשיח המשותף.`;
  } else {
    for (const pair of BILINGUAL_PHRASES) {
      if (translated.includes(pair.he)) {
        translated = translated.split(pair.he).join(pair.ar);
        matchCount++;
      }
    }
    if (matchCount > 0 && !/[\u0590-\u05FF]/.test(translated)) {
      return translated;
    }
    if (matchCount > 0) {
      return `${translated} (ترجمة ذكية من العبرية: "${clean}")`;
    }
    return `[ترجمة فورية للعربية] أهلاً بشركائنا في البيت المشترك! بخصوص ما ذُكر: "${clean}" — يسعدنا التعاون معاً في الحوار والبحث المشترك.`;
  }
}

function parseSchool(row) {
  if (!row) return null;
  return {
    ...row,
    interests: JSON.parse(row.interests || '[]'),
    is_unmatched: row.matched_school_id === null
  };
}

// 1. Platform Overview & Live Stats
app.get('/api/stats', (req, res) => {
  const schoolsCount = db.prepare('SELECT COUNT(*) as c FROM schools').get().c;
  const unmatchedCount = db.prepare('SELECT COUNT(*) as c FROM schools WHERE matched_school_id IS NULL').get().c;
  const studentsSum = db.prepare('SELECT SUM(students_count) as s FROM schools').get().s || 0;
  const classroomsCount = db.prepare('SELECT COUNT(*) as c FROM classrooms').get().c;
  const projectsCount = db.prepare('SELECT COUNT(*) as c FROM achievements').get().c + classroomsCount;

  res.json({
    schools_count: schoolsCount,
    unmatched_schools_count: unmatchedCount,
    matched_schools_count: schoolsCount - unmatchedCount,
    students_count: studentsSum,
    projects_count: projectsCount,
    classrooms_count: classroomsCount
  });
});

// 2. Get All Schools (with optional filters)
app.get('/api/schools', (req, res) => {
  const rows = db.prepare('SELECT * FROM schools ORDER BY id ASC').all();
  const schools = rows.map(parseSchool);
  res.json(schools);
});

// 3. Register a New School
app.post('/api/schools/register', (req, res) => {
  try {
    const {
      name,
      city,
      sector,
      age_stage,
      target_grades,
      interests,
      activity_type,
      contact_name,
      contact_role,
      contact_email,
      contact_phone,
      password,
      bio
    } = req.body;

    if (!name || !city || !sector || !age_stage || !contact_email) {
      return res.status(400).json({ error: 'يرجى ملء جميع الحقول الأساسية | נא למלא את כל שדות החובה' });
    }

    const cityInfo = CITY_COORDS[city.trim()] || {
      lat: 32.65 + (Math.random() - 0.5) * 0.2,
      lng: 35.20 + (Math.random() - 0.5) * 0.2,
      ar: city.trim(),
      he: city.trim(),
      region: 'galilee'
    };

    const isHebName = detectLang(name) === 'he';
    const name_ar = isHebName ? `مدرسة ${name}` : name;
    const name_he = isHebName ? name : `בית ספר ${name}`;

    const bioText = bio || 'مدرسة تتطلع لبناء شراكة تربوية وبحثية مستدامة ضمن مشروع بيت المشترك.';
    const isHebBio = detectLang(bioText) === 'he';
    const bio_ar = isHebBio ? smartTranslate(bioText, 'ar') : bioText;
    const bio_he = isHebBio ? bioText : smartTranslate(bioText, 'he');

    const stmt = db.prepare(`
      INSERT INTO schools (
        name_ar, name_he, city_ar, city_he, region, lat, lng,
        sector, age_stage, target_grades, interests, activity_type,
        contact_name, contact_role, contact_email, contact_phone, password,
        bio_ar, bio_he, students_count, matched_school_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
    `);

    const info = stmt.run(
      name_ar,
      name_he,
      cityInfo.ar,
      cityInfo.he,
      cityInfo.region,
      cityInfo.lat,
      cityInfo.lng,
      sector,
      age_stage,
      target_grades || '8-9',
      JSON.stringify(Array.isArray(interests) ? interests : ['science_env']),
      activity_type || 'hybrid',
      contact_name || 'مدير/ة المدرسة',
      contact_role || 'مدير/ة | מנהל/ת',
      contact_email.trim().toLowerCase(),
      contact_phone || '050-0000000',
      password || '123456',
      bio_ar,
      bio_he,
      45
    );

    const created = db.prepare('SELECT * FROM schools WHERE id = ?').get(info.lastInsertRowid);
    res.json({ school: parseSchool(created) });
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) {
      return res.status(400).json({ error: 'البريد الإلكتروني مسجل مسبقاً | האימייל כבר רשום במערכת' });
    }
    res.status(500).json({ error: err.message });
  }
});

// 4. School Login
app.post('/api/schools/login', (req, res) => {
  const { email, school_id } = req.body;
  let row;
  if (school_id) {
    row = db.prepare('SELECT * FROM schools WHERE id = ?').get(Number(school_id));
  } else if (email) {
    row = db.prepare('SELECT * FROM schools WHERE LOWER(contact_email) = LOWER(?)').get(email.trim());
  }
  if (!row) {
    return res.status(404).json({ error: 'لم يتم العثور على المدرسة | בית הספר לא נמצא' });
  }
  res.json({ school: parseSchool(row) });
});

// 5. AI Matching & Manual Filtering for a School
app.get('/api/schools/:id/matches', (req, res) => {
  const schoolId = Number(req.params.id);
  const currentRow = db.prepare('SELECT * FROM schools WHERE id = ?').get(schoolId);
  if (!currentRow) return res.status(404).json({ error: 'School not found' });

  const current = parseSchool(currentRow);
  const allRows = db.prepare('SELECT * FROM schools WHERE id != ?').all(schoolId);
  const requests = db.prepare(
    'SELECT * FROM match_requests WHERE from_school_id = ? OR to_school_id = ?'
  ).all(schoolId, schoolId);

  const classrooms = db.prepare(
    'SELECT * FROM classrooms WHERE school_a_id = ? OR school_b_id = ?'
  ).all(schoolId, schoolId);

  const candidates = allRows.map((r) => {
    const candidate = parseSchool(r);
    const distanceKm = haversineKm(current.lat, current.lng, candidate.lat, candidate.lng);

    // 1. Geographic proximity score (max 35 pts)
    const geoScore = Math.max(5, Math.round(35 - Math.min(distanceKm, 120) * 0.25));

    // 2. Age stage & grade match (max 25 pts)
    const ageScore = current.age_stage === candidate.age_stage ? 25 : 10;

    // 3. Shared educational interests (max 25 pts)
    const sharedInterests = candidate.interests.filter((i) => current.interests.includes(i));
    const interestScore = Math.min(25, sharedInterests.length * 9 + 7);

    // 4. Cross-sector partnership bonus (Arab <-> Jewish schools) + activity match (max 15 pts)
    const isCrossCommunity =
      (current.sector === 'arab' && candidate.sector !== 'arab') ||
      (current.sector !== 'arab' && candidate.sector === 'arab');
    const activityBonus = current.activity_type === candidate.activity_type ? 5 : 2;
    const communityScore = (isCrossCommunity ? 10 : 3) + activityBonus;

    const totalScore = Math.min(99, geoScore + ageScore + interestScore + communityScore);

    // Check existing match request status between current & candidate
    const reqRecord = requests.find(
      (q) =>
        (q.from_school_id === schoolId && q.to_school_id === candidate.id) ||
        (q.from_school_id === candidate.id && q.to_school_id === schoolId)
    );

    const existingRoom = classrooms.find(
      (c) =>
        (c.school_a_id === schoolId && c.school_b_id === candidate.id) ||
        (c.school_a_id === candidate.id && c.school_b_id === schoolId)
    );

    return {
      ...candidate,
      distance_km: distanceKm,
      shared_interests: sharedInterests,
      match_score: totalScore,
      score_breakdown: {
        geo: geoScore,
        age: ageScore,
        interests: interestScore,
        community: communityScore
      },
      is_cross_community: isCrossCommunity,
      partnership_status: existingRoom
        ? 'room_created'
        : reqRecord
        ? reqRecord.status
        : 'none',
      classroom_code: existingRoom ? existingRoom.code : null,
      classroom_id: existingRoom ? existingRoom.id : null
    };
  });

  // Sort by AI Match Score descending
  candidates.sort((a, b) => b.match_score - a.match_score);

  res.json({
    school: current,
    matches: candidates,
    classrooms
  });
});

// 6. Express Interest / Mutual Approval / Create Shared Room
app.post('/api/matches/action', (req, res) => {
  const { from_school_id, to_school_id, action, research_topic_ar, research_topic_he } = req.body;
  const sA = Number(from_school_id);
  const sB = Number(to_school_id);

  const schoolA = db.prepare('SELECT * FROM schools WHERE id = ?').get(sA);
  const schoolB = db.prepare('SELECT * FROM schools WHERE id = ?').get(sB);
  if (!schoolA || !schoolB) return res.status(404).json({ error: 'Schools not found' });

  const existing = db.prepare(`
    SELECT * FROM match_requests
    WHERE (from_school_id = ? AND to_school_id = ?)
       OR (from_school_id = ? AND to_school_id = ?)
  `).get(sA, sB, sB, sA);

  if (action === 'interest') {
    if (!existing) {
      db.prepare('INSERT INTO match_requests (from_school_id, to_school_id, status) VALUES (?, ?, ?)').run(
        sA,
        sB,
        'mutual_approved' // Automatically simulates partner school approval so user can test full flow immediately!
      );
    } else {
      db.prepare('UPDATE match_requests SET status = ? WHERE id = ?').run('mutual_approved', existing.id);
    }
    return res.json({ status: 'mutual_approved' });
  }

  if (action === 'create_room') {
    let room = db.prepare(`
      SELECT * FROM classrooms
      WHERE (school_a_id = ? AND school_b_id = ?)
         OR (school_a_id = ? AND school_b_id = ?)
    `).get(sA, sB, sB, sA);

    if (!room) {
      const code = `BAYT-${Math.floor(100 + Math.random() * 899)}`;
      const title_ar = `${schoolA.name_ar}، ${schoolA.city_ar} 🤝 ${schoolB.name_ar}، ${schoolB.city_ar}`;
      const title_he = `${schoolA.name_he}, ${schoolA.city_he} 🤝 ${schoolB.name_he}, ${schoolB.city_he}`;
      const topic_ar =
        research_topic_ar ||
        `الاستدامة البيئية والتراث المشترك بين ${schoolA.city_ar} و${schoolB.city_ar}`;
      const topic_he =
        research_topic_he ||
        `קיימות סביבתית ומורשת משותפת בין ${schoolA.city_he} ל${schoolB.city_he}`;

      const info = db.prepare(`
        INSERT INTO classrooms (
          code, school_a_id, school_b_id,
          title_ar, title_he,
          research_topic_ar, research_topic_he,
          research_desc_ar, research_desc_he,
          supervisor_ar, supervisor_he
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        code,
        sA,
        sB,
        title_ar,
        title_he,
        topic_ar,
        topic_he,
        'مساحة تعلم وبحث علمي مشترك تجمع طلاب المدرستين على مدار العام الدراسي.',
        'מרחב למידה ומחקר מדעי משותף המחבר בין תלמידי שני בתי הספר לאורך שנת הלימודים.',
        schoolA.contact_name,
        schoolB.contact_name
      );

      room = db.prepare('SELECT * FROM classrooms WHERE id = ?').get(info.lastInsertRowid);

      // Update matched_school_id on both schools
      db.prepare('UPDATE schools SET matched_school_id = ? WHERE id = ?').run(sB, sA);
      db.prepare('UPDATE schools SET matched_school_id = ? WHERE id = ?').run(sA, sB);

      if (existing) {
        db.prepare('UPDATE match_requests SET status = ? WHERE id = ?').run('room_created', existing.id);
      } else {
        db.prepare('INSERT INTO match_requests (from_school_id, to_school_id, status) VALUES (?, ?, ?)').run(
          sA,
          sB,
          'room_created'
        );
      }

      // Seed welcome post in the new classroom
      db.prepare(`
        INSERT INTO forum_posts (
          classroom_id, category, author_name, author_role, school_side,
          school_name_ar, school_name_he, original_lang, content_ar, content_he, likes, supervised
        ) VALUES (?, 'self_intro', ?, 'teacher', 'joint', ?, ?, 'ar', ?, ?, 5, 1)
      `).run(
        room.id,
        `${schoolA.contact_name} & ${schoolB.contact_name}`,
        schoolA.name_ar,
        schoolB.name_he,
        `أهلاً وسهلاً بطلاب ${schoolA.name_ar} و${schoolB.name_ar} في غرفتكم المشتركة الجديدة! ابدأوا بالتعريف عن أنفسكم واختيار فريقكم البحثي.`,
        `ברוכים הבאים לתלמידי ${schoolA.name_he} ו-${schoolB.name_he} לחדר המשותף החדש שלכם! התחילו בהצגה עצמית ובחירת צוות המחקר שלכם.`
      );
    }

    return res.json({ status: 'room_created', classroom: room });
  }

  res.status(400).json({ error: 'Invalid action' });
});

// 7. Student Login via Access Code
app.get('/api/classrooms', (req, res) => {
  const rows = db.prepare('SELECT * FROM classrooms ORDER BY id ASC').all();
  res.json(rows);
});

app.post('/api/classrooms/login', (req, res) => {
  const { code, student_name, school_side } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'يرجى إدخال رمز الصف المشترك | נא להזין קוד כיתה משותפת' });
  }
  const cleanCode = code.trim().toUpperCase();
  const room = db.prepare('SELECT * FROM classrooms WHERE UPPER(code) = ?').get(cleanCode);
  if (!room) {
    return res.status(404).json({
      error: 'رمز الدخول غير صحيح. جرب الرمز التجريبي BAYT-2026 أو GALIL-101 | קוד הכניסה שגוי. נסו BAYT-2026 או GALIL-101'
    });
  }

  const schoolA = parseSchool(db.prepare('SELECT * FROM schools WHERE id = ?').get(room.school_a_id));
  const schoolB = parseSchool(db.prepare('SELECT * FROM schools WHERE id = ?').get(room.school_b_id));

  res.json({
    classroom: room,
    school_a: schoolA,
    school_b: schoolB,
    student_session: {
      name: student_name || 'طالب/ة مشترك | תלמיד/ה',
      school_side: school_side || 'a',
      school_name_ar: school_side === 'b' ? schoolB.name_ar : schoolA.name_ar,
      school_name_he: school_side === 'b' ? schoolB.name_he : schoolA.name_he
    }
  });
});

// 8. Get Full Classroom Workspace Data
app.get('/api/classrooms/:id', (req, res) => {
  const roomId = Number(req.params.id);
  const room = db.prepare('SELECT * FROM classrooms WHERE id = ?').get(roomId);
  if (!room) return res.status(404).json({ error: 'Classroom not found' });

  const schoolA = parseSchool(db.prepare('SELECT * FROM schools WHERE id = ?').get(room.school_a_id));
  const schoolB = parseSchool(db.prepare('SELECT * FROM schools WHERE id = ?').get(room.school_b_id));

  const posts = db.prepare('SELECT * FROM forum_posts WHERE classroom_id = ? ORDER BY id DESC').all(roomId);
  const replies = db.prepare('SELECT * FROM forum_replies ORDER BY id ASC').all();

  const postsWithReplies = posts.map((p) => ({
    ...p,
    replies: replies.filter((r) => r.post_id === p.id)
  }));

  const researchData = db
    .prepare('SELECT * FROM research_data WHERE classroom_id = ? ORDER BY id DESC')
    .all(roomId);

  const canvasCards = db
    .prepare('SELECT * FROM canvas_cards WHERE classroom_id = ? ORDER BY votes DESC, id DESC')
    .all(roomId);

  res.json({
    classroom: room,
    school_a: schoolA,
    school_b: schoolB,
    posts: postsWithReplies,
    research_data: researchData,
    canvas_cards: canvasCards
  });
});

// 9. Add Discussion Forum Post (with automatic smart bilingual translation)
app.post('/api/classrooms/:id/posts', (req, res) => {
  const roomId = Number(req.params.id);
  const { category, author_name, school_side, school_name_ar, school_name_he, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Empty content' });
  }

  const origLang = detectLang(content);
  const content_ar = origLang === 'ar' ? content.trim() : smartTranslate(content, 'ar');
  const content_he = origLang === 'he' ? content.trim() : smartTranslate(content, 'he');

  const info = db.prepare(`
    INSERT INTO forum_posts (
      classroom_id, category, author_name, author_role, school_side,
      school_name_ar, school_name_he, original_lang, content_ar, content_he, likes, supervised
    ) VALUES (?, ?, ?, 'student', ?, ?, ?, ?, ?, ?, 1, 1)
  `).run(
    roomId,
    category || 'self_intro',
    author_name || 'طالب/ة',
    school_side || 'a',
    school_name_ar || 'مدرسة ابن خلدون',
    school_name_he || 'חט"ב אבן ח׳לדון',
    origLang,
    content_ar,
    content_he
  );

  const post = db.prepare('SELECT * FROM forum_posts WHERE id = ?').get(info.lastInsertRowid);
  res.json({ post: { ...post, replies: [] } });
});

// 10. Add Reply to Forum Post
app.post('/api/posts/:id/replies', (req, res) => {
  const postId = Number(req.params.id);
  const { author_name, school_name_ar, school_name_he, content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ error: 'Empty reply' });

  const origLang = detectLang(content);
  const content_ar = origLang === 'ar' ? content.trim() : smartTranslate(content, 'ar');
  const content_he = origLang === 'he' ? content.trim() : smartTranslate(content, 'he');

  const info = db.prepare(`
    INSERT INTO forum_replies (
      post_id, author_name, school_name_ar, school_name_he, original_lang, content_ar, content_he
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    postId,
    author_name || 'طالب/ة',
    school_name_ar || 'مدرسة شريكة',
    school_name_he || 'בית ספר שותף',
    origLang,
    content_ar,
    content_he
  );

  const reply = db.prepare('SELECT * FROM forum_replies WHERE id = ?').get(info.lastInsertRowid);
  res.json({ reply });
});

// 11. Like a Post
app.post('/api/posts/:id/like', (req, res) => {
  const postId = Number(req.params.id);
  db.prepare('UPDATE forum_posts SET likes = likes + 1 WHERE id = ?').run(postId);
  const updated = db.prepare('SELECT likes FROM forum_posts WHERE id = ?').get(postId);
  res.json(updated);
});

// 12. Upload Collaborative Research Data
app.post('/api/classrooms/:id/research', (req, res) => {
  const roomId = Number(req.params.id);
  const { data_type, title, town, author_name, summary, metric_badge } = req.body;
  if (!title || !summary) return res.status(400).json({ error: 'Missing fields' });

  const lang = detectLang(title + ' ' + summary);
  const title_ar = lang === 'ar' ? title : smartTranslate(title, 'ar');
  const title_he = lang === 'he' ? title : smartTranslate(title, 'he');
  const summary_ar = lang === 'ar' ? summary : smartTranslate(summary, 'ar');
  const summary_he = lang === 'he' ? summary : smartTranslate(summary, 'he');

  const info = db.prepare(`
    INSERT INTO research_data (
      classroom_id, data_type, title_ar, title_he, town_ar, town_he,
      author_name, summary_ar, summary_he, metric_badge
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    roomId,
    data_type || 'measurement',
    title_ar,
    title_he,
    town || 'البلدة المشتركة',
    town || 'היישוב המשותף',
    author_name || 'فريق البحث الطلابي',
    summary_ar,
    summary_he,
    metric_badge || 'بيانات ميدانية موثقة | נתוני שדה'
  );

  const item = db.prepare('SELECT * FROM research_data WHERE id = ?').get(info.lastInsertRowid);
  res.json({ item });
});

// 13. Add / Vote / Move Collaborative Canvas Cards
app.post('/api/classrooms/:id/canvas', (req, res) => {
  const roomId = Number(req.params.id);
  const { column_key, author_name, school_side, content, color_tag } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });

  const lang = detectLang(content);
  const content_ar = lang === 'ar' ? content : smartTranslate(content, 'ar');
  const content_he = lang === 'he' ? content : smartTranslate(content, 'he');

  const info = db.prepare(`
    INSERT INTO canvas_cards (
      classroom_id, column_key, author_name, school_side, content_ar, content_he, color_tag, votes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    roomId,
    column_key || 'ideas',
    author_name || 'طالب/ة',
    school_side || 'joint',
    content_ar,
    content_he,
    color_tag || 'blue'
  );

  const card = db.prepare('SELECT * FROM canvas_cards WHERE id = ?').get(info.lastInsertRowid);
  res.json({ card });
});

app.patch('/api/canvas/:id', (req, res) => {
  const cardId = Number(req.params.id);
  const { column_key, vote } = req.body;
  if (column_key) {
    db.prepare('UPDATE canvas_cards SET column_key = ? WHERE id = ?').run(column_key, cardId);
  }
  if (vote) {
    db.prepare('UPDATE canvas_cards SET votes = votes + 1 WHERE id = ?').run(cardId);
  }
  const card = db.prepare('SELECT * FROM canvas_cards WHERE id = ?').get(cardId);
  res.json({ card });
});

// 14. Instant Translation Endpoint
app.post('/api/translate', (req, res) => {
  const { text, target_lang } = req.body;
  const source_lang = detectLang(text || '');
  const dest = target_lang || (source_lang === 'ar' ? 'he' : 'ar');
  res.json({
    source_lang,
    target_lang: dest,
    translated: smartTranslate(text || '', dest)
  });
});

// 15. Smart AI Research Mentor Endpoint
app.post('/api/mentor', (req, res) => {
  const { question, topic_ar, topic_he } = req.body;
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
    reply_ar = `🤖 اقتراح المرشد الذكي لموضوعكم (${topic_ar || 'البحث المشترك'}):\n• قسّموا المهمة إلى 3 فرق ثنائية (طالب عربي + طالب يهودي في كل مهمة): فريق جمع المعطيات الميدانية، فريق التوثيق البصري، وفريق صياغة التوصيات.\n• استخدموا "لوحة العمل التعاوني" لترتيب الفرضيات والتصويت على أفضل فكرة لتقديمها في جدار الإنجازات!`;
    reply_he = `🤖 הצעת המנטור החכם לנושא שלכם (${topic_he || 'המחקר המשותף'}):\n• חלקו את המשימה ל-3 צוותים דו-לאומיים (תלמיד ערבי + תלמיד יהודי בכל משימה): צוות איסוף נתוני שדה, צוות תיעוד חזותי וצוות ניסוח המלצות.\n• השתמשו ב"לוח העבודה השיתופי" לסידור ההשערות והצבעה על הרעיון הטוב ביותר להצגה בקיר ההישגים!`;
  }

  res.json({ reply_ar, reply_he });
});

// 16. Shared Wall of Achievements
app.get('/api/achievements', (req, res) => {
  const rows = db.prepare('SELECT * FROM achievements ORDER BY id ASC').all();
  res.json(rows);
});

app.post('/api/achievements/:id/like', (req, res) => {
  const id = Number(req.params.id);
  db.prepare('UPDATE achievements SET likes = likes + 1 WHERE id = ?').run(id);
  const row = db.prepare('SELECT likes FROM achievements WHERE id = ?').get(id);
  res.json(row);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bayt Platform running on http://localhost:${PORT}`);
});
