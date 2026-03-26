// ═══════════════════════════════════════
// All static schedule data in one place
// ═══════════════════════════════════════

export const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
export const DABBR = ['MON','TUE','WED','THU','FRI','SAT','SUN']

export const SUBJECTS = [
  { id: 'la',   name: 'Linear Algebra',          code: 'CS1807', cr: 3 },
  { id: 'ds',   name: 'Data Structures',         code: 'CS1006', cr: 4 },
  { id: 'dbms', name: 'DBMS',                    code: 'CS1211', cr: 4 },
  { id: 'os',   name: 'Operating Systems',       code: 'CS1103', cr: 3 },
  { id: 'esm',  name: 'Embedded Systems',        code: 'CS1102', cr: 3 },
  { id: 'eex',  name: 'Eng. Explorations',       code: 'CS1841', cr: 2 },
  { id: 'yoga', name: 'Yoga & Wellbeing',        code: 'CS1925', cr: 2 },
  { id: 'em',   name: 'Entrepreneurial Mindset', code: 'CS1904', cr: 2 },
]

export const COLORS: Record<string, { c: string; bg: string }> = {
  GYM:       { c: '#b05a3a', bg: 'rgba(176,90,58,0.14)'   },
  COMMUTE:   { c: '#4a7fa5', bg: 'rgba(74,127,165,0.12)'  },
  DS:        { c: '#4a7fa5', bg: 'rgba(74,127,165,0.12)'  },
  DBMS:      { c: '#7a6a9a', bg: 'rgba(122,106,154,0.12)' },
  OS:        { c: '#3a8a6a', bg: 'rgba(58,138,106,0.12)'  },
  LA:        { c: '#9a7040', bg: 'rgba(154,112,64,0.12)'  },
  ESM:       { c: '#8a7050', bg: 'rgba(138,112,80,0.12)'  },
  EEX:       { c: '#6a7888', bg: 'rgba(106,120,136,0.12)' },
  BREAK:     { c: '#5a6070', bg: 'rgba(90,96,112,0.08)'   },
  SLEEP:     { c: '#3a4258', bg: 'rgba(58,66,88,0.08)'    },
  SOCIAL:    { c: '#7a6a9a', bg: 'rgba(122,106,154,0.12)' },
  ANIME:     { c: '#5a6888', bg: 'rgba(90,104,136,0.11)'  },
  BADMINTON: { c: '#3a8a7a', bg: 'rgba(58,138,122,0.12)'  },
  COURSERA:  { c: '#8a6a9a', bg: 'rgba(138,106,154,0.11)' },
  LEETCODE:  { c: '#b07040', bg: 'rgba(176,112,64,0.12)'  },
  MEAL:      { c: '#607058', bg: 'rgba(96,112,88,0.09)'   },
  CLASS:     { c: '#5a6878', bg: 'rgba(90,104,120,0.09)'  },
  LAB:       { c: '#506878', bg: 'rgba(80,104,120,0.11)'  },
  YOGA:      { c: '#487060', bg: 'rgba(72,112,96,0.11)'   },
  REVISION:  { c: '#4a7a8a', bg: 'rgba(74,122,138,0.12)'  },
  PREP:      { c: '#507858', bg: 'rgba(80,120,88,0.11)'   },
  REST:      { c: '#5a6070', bg: 'rgba(90,96,112,0.08)'   },
  MISC:      { c: '#687080', bg: 'rgba(104,112,128,0.09)' },
}

export const STOIC_QUOTES = [
  { q: "You have power over your mind, not outside events. Realize this, and you will find strength.", a: "Marcus Aurelius" },
  { q: "Waste no more time arguing about what a good man should be. Be one.", a: "Marcus Aurelius" },
  { q: "Luck is what happens when preparation meets opportunity.", a: "Seneca" },
  { q: "Difficulties strengthen the mind, as labour does the body.", a: "Seneca" },
  { q: "Make the best use of what is in your power, and take the rest as it happens.", a: "Epictetus" },
  { q: "No man is free who is not master of himself.", a: "Epictetus" },
  { q: "First say to yourself what you would be; and then do what you have to do.", a: "Epictetus" },
  { q: "Begin at once to live, and count each separate day as a separate life.", a: "Seneca" },
  { q: "The impediment to action advances action. What stands in the way becomes the way.", a: "Marcus Aurelius" },
  { q: "It is not death that a man should fear, but he should fear never beginning to live.", a: "Marcus Aurelius" },
  { q: "He suffers more than necessary, who suffers before it is necessary.", a: "Seneca" },
  { q: "If it is not right, do not do it; if it is not true, do not say it.", a: "Marcus Aurelius" },
  { q: "The more we value things outside our control, the less control we have.", a: "Epictetus" },
  { q: "You could leave life right now. Let that determine what you do and say and think.", a: "Marcus Aurelius" },
]

export type Block = {
  s: string; e: string; title: string; cat: string; note?: string; room?: string
}

// College timetable
export const CTT: Block[][] = [
  [ // Monday
    { s:'09:10', e:'10:10', title:'Linear Algebra',   cat:'LA',  room:'F103' },
    { s:'10:10', e:'11:10', title:'Data Structures',  cat:'DS',  room:'F103' },
    { s:'11:10', e:'13:00', title:'DBMS Lab',         cat:'LAB', room:'F109' },
    { s:'13:00', e:'13:50', title:'Lunch Break',      cat:'BREAK' },
    { s:'13:50', e:'14:50', title:'Eng. Explorations',cat:'EEX' },
    { s:'14:50', e:'15:50', title:'Eng. Explorations',cat:'EEX' },
  ],
  [ // Tuesday
    { s:'09:10', e:'10:10', title:'Yoga & Wellbeing', cat:'YOGA' },
    { s:'10:10', e:'11:10', title:'Linear Algebra',   cat:'LA' },
    { s:'11:10', e:'13:00', title:'DS Lab',           cat:'LAB', room:'C505' },
    { s:'13:00', e:'13:50', title:'Lunch Break',      cat:'BREAK' },
    { s:'13:50', e:'14:50', title:'Embedded Systems', cat:'ESM' },
    { s:'14:50', e:'15:50', title:'Linear Algebra',   cat:'LA' },
    { s:'15:50', e:'16:50', title:'DBMS',             cat:'DBMS' },
  ],
  [ // Wednesday
    { s:'09:10', e:'11:10', title:'ESM Lab',          cat:'LAB', room:'C401' },
    { s:'11:10', e:'12:10', title:'DBMS',             cat:'DBMS' },
    { s:'12:10', e:'13:00', title:'Operating Systems',cat:'OS' },
    { s:'13:00', e:'13:50', title:'Lunch Break',      cat:'BREAK' },
    { s:'13:50', e:'15:50', title:'OS Lab',           cat:'LAB', room:'C501' },
    { s:'15:50', e:'16:50', title:'Data Structures',  cat:'DS' },
  ],
  [ // Thursday
    { s:'09:10', e:'10:10', title:'Embedded Systems', cat:'ESM' },
    { s:'10:10', e:'11:10', title:'DBMS',             cat:'DBMS' },
    { s:'11:10', e:'13:00', title:'EEX Lab',          cat:'LAB', room:'C503' },
    { s:'13:00', e:'13:50', title:'Lunch Break',      cat:'BREAK' },
    { s:'13:50', e:'14:50', title:'Data Structures',  cat:'DS' },
    { s:'14:50', e:'15:50', title:'Embedded Systems', cat:'ESM' },
    { s:'15:50', e:'16:50', title:'Operating Systems',cat:'OS' },
  ],
  [ // Friday
    { s:'09:10', e:'10:10', title:'DBMS',             cat:'DBMS' },
    { s:'10:10', e:'11:10', title:'Operating Systems',cat:'OS' },
    { s:'11:10', e:'12:10', title:'Linear Algebra',   cat:'LA' },
    { s:'12:10', e:'13:00', title:'Data Structures',  cat:'DS' },
  ],
  [], // Saturday
  [], // Sunday
]

// Personal schedule
export const PSCHED: Block[][] = [
  [ // Monday
    { s:'05:00', e:'06:30', title:'Gym', cat:'GYM', note:'Non-negotiable.' },
    { s:'06:30', e:'07:15', title:'Shower · Breakfast · Leave', cat:'MEAL' },
    { s:'07:15', e:'08:45', title:'Commute → DS Theory Review', cat:'COMMUTE', note:'Anki or notes. No Reels.' },
    { s:'09:10', e:'15:50', title:'College', cat:'CLASS', note:'LA · DS · DBMS Lab · EEX' },
    { s:'16:30', e:'18:00', title:'Commute → DBMS Consolidation', cat:'COMMUTE', note:'Write 5 key things from today.' },
    { s:'18:00', e:'19:00', title:'Decompress · Dinner', cat:'BREAK', note:'Earned rest.' },
    { s:'19:00', e:'20:00', title:'DS LeetCode — 1–2 problems', cat:'LEETCODE', note:'Arrays / Strings. Track patterns.' },
    { s:'20:00', e:'20:30', title:'Anime (1 episode)', cat:'ANIME', note:'Timer on.' },
    { s:'20:30', e:'21:30', title:'Girlfriend Time', cat:'SOCIAL', note:'Scheduled. 21:30 hard stop.' },
    { s:'21:30', e:'22:00', title:'Wind down · Sleep', cat:'SLEEP' },
  ],
  [ // Tuesday
    { s:'05:00', e:'06:30', title:'Gym', cat:'GYM' },
    { s:'06:30', e:'07:15', title:'Shower · Breakfast · Leave', cat:'MEAL' },
    { s:'07:15', e:'08:45', title:'Commute → LA Problem Practice', cat:'COMMUTE', note:'3–5 problems from last lecture.' },
    { s:'09:10', e:'16:50', title:'College', cat:'CLASS', note:'Yoga · LA · DS Lab · ESM · LA · DBMS' },
    { s:'17:00', e:'18:30', title:'Commute → OS Concepts', cat:'COMMUTE', note:'Process management, scheduling.' },
    { s:'18:30', e:'19:00', title:'Decompress · Dinner', cat:'BREAK' },
    { s:'19:00', e:'20:00', title:'DBMS Theory + SQL Practice', cat:'DBMS', note:'Write SQL by hand.' },
    { s:'20:00', e:'20:30', title:'Anime', cat:'ANIME' },
    { s:'20:30', e:'21:30', title:'Girlfriend Time', cat:'SOCIAL' },
    { s:'21:30', e:'22:00', title:'Wind down · Sleep', cat:'SLEEP' },
  ],
  [ // Wednesday
    { s:'05:00', e:'06:30', title:'Gym', cat:'GYM' },
    { s:'06:30', e:'07:15', title:'Shower · Breakfast · Leave', cat:'MEAL' },
    { s:'07:15', e:'08:45', title:'Commute → DS Flashcards', cat:'COMMUTE', note:'Sorting, searching, graphs.' },
    { s:'09:10', e:'16:50', title:'College', cat:'CLASS', note:'ESM Lab · DBMS · OS · OS Lab · DS' },
    { s:'17:00', e:'18:30', title:'Commute → Coursera Lectures', cat:'COURSERA', note:'1–2 modules. Wed + Sat = Coursera days.' },
    { s:'18:30', e:'19:00', title:'Decompress · Dinner', cat:'BREAK' },
    { s:'19:00', e:'20:00', title:'Coursera — Assignments / Quizzes', cat:'COURSERA', note:'Do graded work today.' },
    { s:'20:00', e:'20:30', title:'Anime', cat:'ANIME' },
    { s:'20:30', e:'21:30', title:'Girlfriend Time', cat:'SOCIAL' },
    { s:'21:30', e:'22:00', title:'Wind down · Sleep', cat:'SLEEP' },
  ],
  [ // Thursday
    { s:'05:00', e:'06:30', title:'Gym', cat:'GYM' },
    { s:'06:30', e:'07:15', title:'Shower · Breakfast · Leave', cat:'MEAL' },
    { s:'07:15', e:'08:45', title:'Commute → DBMS Past Questions', cat:'COMMUTE', note:'CIE-style practice.' },
    { s:'09:10', e:'16:50', title:'College', cat:'CLASS', note:'ESM · DBMS · EEX Lab · DS · ESM · OS' },
    { s:'17:00', e:'18:30', title:'Commute → LeetCode Medium', cat:'LEETCODE', note:'Think before looking at solution.' },
    { s:'18:30', e:'19:00', title:'Decompress · Dinner', cat:'BREAK' },
    { s:'19:00', e:'20:00', title:'DS Deep Work — Implement', cat:'DS', note:'Code from scratch. No copy-paste.' },
    { s:'20:00', e:'20:30', title:'Anime', cat:'ANIME' },
    { s:'20:30', e:'21:30', title:'Girlfriend Time', cat:'SOCIAL' },
    { s:'21:30', e:'22:00', title:'Wind down · Sleep', cat:'SLEEP' },
  ],
  [ // Friday
    { s:'05:00', e:'06:30', title:'Gym', cat:'GYM' },
    { s:'06:30', e:'07:15', title:'Shower · Breakfast · Leave', cat:'MEAL' },
    { s:'07:15', e:'08:45', title:'Commute → Weekly Review', cat:'COMMUTE', note:"What slipped? Plan Saturday's catch-up." },
    { s:'09:10', e:'13:00', title:'College (Half Day)', cat:'CLASS', note:'DBMS · OS · LA · DS' },
    { s:'14:00', e:'17:00', title:'Badminton', cat:'BADMINTON', note:'Full recovery. Part of the plan.' },
    { s:'17:00', e:'18:30', title:'Commute → Light OS / LA Reading', cat:'COMMUTE', note:'Low-intensity.' },
    { s:'18:30', e:'19:00', title:'Decompress · Dinner', cat:'BREAK' },
    { s:'19:00', e:'20:00', title:'LA Problem Set (Week Review)', cat:'LA', note:'5 problems. Slow and understood.' },
    { s:'20:00', e:'20:30', title:'Anime', cat:'ANIME' },
    { s:'20:30', e:'21:30', title:'Girlfriend Time', cat:'SOCIAL' },
    { s:'21:30', e:'22:00', title:'Wind down · Sleep', cat:'SLEEP' },
  ],
  [ // Saturday
    { s:'05:00', e:'06:30', title:'Gym', cat:'GYM' },
    { s:'06:30', e:'07:30', title:'Shower · Breakfast · Settle in', cat:'MEAL', note:'No commute. Best morning.' },
    { s:'07:30', e:'09:30', title:'DS / LeetCode Deep Session', cat:'LEETCODE', note:'3 problems: 1 easy + 2 medium.' },
    { s:'09:30', e:'10:00', title:'Break · Snack · Walk', cat:'BREAK' },
    { s:'10:00', e:'11:30', title:'DBMS Mastery Block', cat:'DBMS', note:'Normalization, transactions, indexing.' },
    { s:'11:30', e:'12:00', title:'Break', cat:'BREAK' },
    { s:'12:00', e:'14:00', title:'Coursera — 2hr Block', cat:'COURSERA', note:'4 hrs/week → done by early June.' },
    { s:'14:00', e:'15:00', title:'Lunch · Rest', cat:'BREAK' },
    { s:'15:00', e:'16:30', title:'OS / LA / ESM Catch-up', cat:'OS', note:'Rotate weekly.' },
    { s:'16:30', e:'17:00', title:'Anime', cat:'ANIME' },
    { s:'17:00', e:'19:00', title:'Free Time / Social', cat:'SOCIAL', note:"You've earned this." },
    { s:'19:00', e:'21:00', title:'Girlfriend Time / Date Night', cat:'SOCIAL' },
    { s:'21:00', e:'22:00', title:'Wind down · Sleep', cat:'SLEEP' },
  ],
  [ // Sunday
    { s:'05:00', e:'06:30', title:'Gym', cat:'GYM' },
    { s:'06:30', e:'08:00', title:'Slow Morning', cat:'MEAL', note:'Recovery. No rushing.' },
    { s:'08:00', e:'09:30', title:'Weekly Revision — All Subjects', cat:'REVISION', note:'30 min each: DS · DBMS · OS.' },
    { s:'09:30', e:'10:00', title:'Break', cat:'BREAK' },
    { s:'10:00', e:'11:30', title:'Next Week Prep — Read Ahead', cat:'PREP', note:'Skim DS and DBMS topics.' },
    { s:'11:30', e:'16:00', title:'Free Time · Lunch · Rest', cat:'REST', note:'Real rest. Recovery is performance.' },
    { s:'16:00', e:'20:00', title:'Badminton', cat:'BADMINTON' },
    { s:'20:00', e:'20:30', title:'Dinner · Cool Down', cat:'MEAL' },
    { s:'20:30', e:'21:30', title:'Girlfriend Time', cat:'SOCIAL' },
    { s:'21:30', e:'22:00', title:'Sleep — Early', cat:'SLEEP', note:'Big week starts tomorrow.' },
  ],
]

export const TASKS: { id: string; l: string; s: string }[][] = [
  [ // Monday
    { id:'gym',  l:'Hit the gym',                  s:'05:00 – 06:30' },
    { id:'c_m',  l:'Commute study: DS Theory',      s:'Anki or notes — no Reels' },
    { id:'cls',  l:'Attend all classes',            s:'LA · DS · DBMS Lab · EEX' },
    { id:'c_e',  l:'Commute: DBMS consolidation',   s:'5 key things from today' },
    { id:'leet', l:'DS LeetCode — 1–2 problems',    s:'Arrays / Strings' },
    { id:'ani',  l:'Anime — 1 episode only',        s:'Timer on' },
    { id:'gf',   l:'Girlfriend time (scheduled)',   s:'20:30 – 21:30' },
    { id:'slp',  l:'In bed by 22:00',               s:'Non-negotiable' },
  ],
  [ // Tuesday
    { id:'gym',  l:'Hit the gym',                  s:'05:00 – 06:30' },
    { id:'c_m',  l:'Commute: LA problem practice',  s:'3–5 problems' },
    { id:'cls',  l:'Attend all classes',            s:'Yoga · LA · DS Lab · ESM · DBMS' },
    { id:'c_e',  l:'Commute: OS concepts',          s:'Process management' },
    { id:'std',  l:'DBMS Theory + SQL practice',    s:'Write queries by hand' },
    { id:'ani',  l:'Anime — 1 episode only',        s:'' },
    { id:'gf',   l:'Girlfriend time',               s:'20:30 – 21:30' },
    { id:'slp',  l:'In bed by 22:00',               s:'' },
  ],
  [ // Wednesday
    { id:'gym',  l:'Hit the gym',                  s:'05:00 – 06:30' },
    { id:'c_m',  l:'Commute: DS flashcards',        s:'Sorting, searching, graphs' },
    { id:'cls',  l:'Attend all classes',            s:'ESM Lab · DBMS · OS · OS Lab · DS' },
    { id:'c_e',  l:'Commute: Coursera lectures',    s:'1–2 video modules' },
    { id:'crs',  l:'Coursera — assignments',        s:'' },
    { id:'ani',  l:'Anime — 1 episode only',        s:'' },
    { id:'gf',   l:'Girlfriend time',               s:'20:30 – 21:30' },
    { id:'slp',  l:'In bed by 22:00',               s:'' },
  ],
  [ // Thursday
    { id:'gym',  l:'Hit the gym',                  s:'05:00 – 06:30' },
    { id:'c_m',  l:'Commute: DBMS past questions',  s:'CIE-style practice' },
    { id:'cls',  l:'Attend all classes',            s:'ESM · DBMS · EEX Lab · DS · OS' },
    { id:'c_e',  l:'Commute: LeetCode medium',      s:'Think before looking' },
    { id:'std',  l:'DS deep work — implement',      s:'No copy-paste' },
    { id:'ani',  l:'Anime — 1 episode only',        s:'' },
    { id:'gf',   l:'Girlfriend time',               s:'20:30 – 21:30' },
    { id:'slp',  l:'In bed by 22:00',               s:'' },
  ],
  [ // Friday
    { id:'gym',  l:'Hit the gym',                  s:'05:00 – 06:30' },
    { id:'c_m',  l:'Commute: weekly review',        s:"Plan Saturday's catch-up" },
    { id:'cls',  l:'Attend half-day classes',       s:'DBMS · OS · LA · DS' },
    { id:'bad',  l:'Badminton',                     s:'College court' },
    { id:'std',  l:'LA problem set (week review)',  s:'5 problems' },
    { id:'ani',  l:'Anime — 1 episode only',        s:'' },
    { id:'gf',   l:'Girlfriend time',               s:'20:30 – 21:30' },
    { id:'slp',  l:'In bed by 22:00',               s:'' },
  ],
  [ // Saturday
    { id:'gym',  l:'Hit the gym',                      s:'05:00 – 06:30' },
    { id:'leet', l:'DS / LeetCode deep session (2hrs)', s:'3 problems: 1 easy + 2 medium' },
    { id:'dbm',  l:'DBMS mastery block (1.5 hrs)',      s:'Normalization · Transactions' },
    { id:'crs',  l:'Coursera — 2 hour block',           s:'4 hrs/week pace' },
    { id:'ctch', l:'OS / LA / ESM catch-up',            s:'Weakest subject' },
    { id:'soc',  l:'Free time / social',                s:'' },
    { id:'gf',   l:'Girlfriend evening',                s:'19:00 – 21:00' },
    { id:'slp',  l:'In bed by 22:00',                   s:'' },
  ],
  [ // Sunday
    { id:'gym',  l:'Hit the gym',                  s:'05:00 – 06:30' },
    { id:'rev',  l:'Weekly revision — all subjects',s:'30 min each' },
    { id:'prp',  l:'Next week read-ahead',          s:'DS and DBMS' },
    { id:'rst',  l:'Real rest block',               s:'Nap, relax' },
    { id:'bad',  l:'Badminton',                     s:'16:00 – 20:00' },
    { id:'gf',   l:'Girlfriend time',               s:'20:30 – 21:30' },
    { id:'slp',  l:'Sleep early',                   s:'' },
  ],
]

export function todayIdx(): number {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 5)  return 'Good night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

export function daysUntil(dateStr: string): number {
  const now = new Date(); now.setHours(0,0,0,0)
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - now.getTime()) / 86400000))
}

export function attColor(pct: number): string {
  if (pct >= 85) return '#3a8a6a'
  if (pct >= 75) return '#c8922a'
  return '#b05040'
}

export const EXAMS = [
  { label: 'CIE 2', date: '2026-04-10' },
  { label: 'SEE',   date: '2026-05-15' },
]

export function nextExam(): { label: string; date: string; days: number } {
  const now = new Date(); now.setHours(0,0,0,0)
  const upcoming = EXAMS.find(e => new Date(e.date).getTime() >= now.getTime())
  const exam = upcoming ?? EXAMS[EXAMS.length - 1]
  return { ...exam, days: Math.max(0, Math.ceil((new Date(exam.date).getTime() - now.getTime()) / 86400000)) }
}
