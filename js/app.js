/* =====================================================================
   Trần Duy Anh · Behind the screen · app.js

   1. CONTENT        every project, award and activity as data (edit here)
   2. SEARCH ENGINE  normalise, tokenise, score and rank pages
   3. STATE          what the visitor has done (look, eggs found, last search)
   4. VIEWS          one function per page; each returns HTML
                     homepage story, rooms, project pages, Nét Mơ,
                     FCT, FUNiX, fire alarm, About, search results
   5. DEMOS          vocabulary quiz, V-SWAP flow, Build your city,
                     fire simulator, FCT turtle track
   6. EXTRAS         command menu, terminal, light/dark curtain
   7. EASTER EGGS    walking turtle, dots, secret searches, hatching egg
   8. ROUTER         reads #page from the URL, renders it, wires events
   ===================================================================== */

(function(){
'use strict';

/* =====================================================================
   CONTENT — edit these records to update the site.
   Field values in `sections` can be:
     'plain text'      → confirmed fact, shown as written
     G('prompt')       → missing content; shown only while content gaps are on (terminal: gaps on)
     [ ... ]           → several of the above in order
   media:    { label, ratio:'16/10', type:'screenshot', src:null, alt:'' }  → set src + alt to show a real image
   evidence: { label, url:null }  → set url to show a real link
   metrics:  { label, value:'', asOf:'' } → shown only when value is filled in
   boost:    optional number that lifts an item in broad searches (exact title matches always rank first)
   ===================================================================== */
const G = t => ({gap:t});

const PROFILE = {
  name:'Trần Duy Anh', school:'Lawrence S. Ting High School', city:'Ho Chi Minh City', classOf:'2027',
  interests:['Computer science','AI','Practical problem-solving'],
  cv:{ label:'CV (Google Drive)', url:'https://drive.google.com/file/d/17j-IOST_Y2QnPrUlypWk-KUAgOLSO3m5/view?usp=drive_link' },   // the “CV” nav link appears only when this is set
  contact:[            // shown exactly as written; add url for a clickable link
    { label:'Email',  value:'tranduyanh06032009@gmail.com', copy:true },
    { label:'Phone',  value:'+84 932 074 702', copy:true },
    { label:'GitHub', value:'github.com/tr4nduyanh', url:'https://github.com/tr4nduyanh' }
  ]
};

const ROOMS = [
  {cat:'build',     id:'workshop', label:'Build',     name:'The Workshop',    desc:'Coding, products, experiments, and technical learning.',
   lede:'Things I’ve built with teammates, and the training behind them. Start with Contextuary, then try a small word-in-context exercise.'},
  {cat:'awards',    id:'replay',   label:'Awards',    name:'The Replay Room', desc:'Achievements and the learning processes behind them.',
   lede:'A result is the short version. Here I replay what changed between attempts.'},
  {cat:'research',  id:'lab',      label:'Research',  name:'The Question Lab',desc:'My smart-waste research and implementation questions.',
   lede:'One research question, explained in layers. Read the first layer, or go as deep as you like.'},
  {cat:'community', id:'common',   label:'Community', name:'The Common Room', desc:'Teaching, service, mentoring, and teamwork.',
   lede:'What I took responsibility for alongside other people, kept separate from what we achieved together.'},
  {cat:'media',     id:'studio',   label:'Media',     name:'The Studio',      desc:'Storytelling, photography, video, and creative leadership.',
   lede:'Event coverage, video, photography and scripts, with the choices behind each piece.'}
];

const ITEMS = [
/* ---------- BUILD ---------- */
{ id:'contextuary', boost:40, cat:'build', kind:'Product', title:'Contextuary', aliases:['contextuary'],
  summary:'SAT vocabulary, learned in context. Built with React and Supabase.',
  role:'Co-leader · full-stack developer', stack:'React · Supabase',
  tags:['coding','programming','React','Supabase','full-stack','database design','caching','performance','interface design','web app','education','SAT','vocabulary','Vietnamese','flashcards','quiz','AI','product','launched'],
  sections:[
    ['The need', 'Word lists teach definitions, not usage.'],
    ['My role', 'Co-leader and full-stack developer.'],
    ['A key decision', 'Context first: every word lives inside a sentence.'],
    ['Challenge & iteration', 'SAT-week traffic spikes. I reworked caching and the database so the site stays fast.'],
    ['Result', 'Live at <a href="https://contextuary.app" target="_blank" rel="noopener">contextuary.app</a> since August 2026. 2,200+ visitors, 500+ users.'],
    ['What I learned', 'Code that runs isn’t enough. It has to stay reliable when people need it.']
  ],

  media:[{label:'Contextuary homepage', ratio:'1516/896', w:1516, h:896, type:'screenshot', src:'img/contextuary-home.webp', frame:'contextuary.app',
    alt:'The Contextuary homepage. The headline reads “Understand words. In context. For real.” Beside it, a word card for “ubiquitous” shows its pronunciation, Vietnamese meaning, an example sentence and synonyms, next to a quiz card asking what “mitigate” means.',
    caption:'The live homepage at contextuary.app.'}],
  evidence:[{label:'Live product: contextuary.app', url:'https://contextuary.app'},{label:'Repository', url:null}],
  metrics:[ { label:'visitors', value:'2,200+', asOf:'October 2026' }, { label:'users', value:'500+', asOf:'October 2026' }, { label:'SAT words', value:'600+', asOf:'October 2026' } ],
  story:{
    pain:{ lead:'Word lists teach definitions, not usage.',
      before:{label:'A word list', steps:['Read a definition','Memorise it','Still can’t use the word']},
      after:{label:'With Contextuary', steps:['Add any SAT word','Get its meaning, examples and a memory hint','Practise until it sticks']} },
    idea:{ lead:'Meet every word inside a sentence first.',
      points:[['My part','Co-lead. Database, interface, learning flows, stability.'],['Built with','React and Supabase.']] },
    features:[
      {t:'Daily Picks and your word list', d:'Ten new SAT words a day. One tap adds a word to your list.', ic:'i-cal',
        img:{src:'img/ctx-words.webp', w:1535, h:530, label:'My Words page with Daily Picks', frame:'contextuary.app · My Words', alt:'The Contextuary “My Words” page. A Daily Picks row offers words such as ubiquitous, mitigate, salient and arbitrary with their pronunciations and add buttons, with a daily goal of 10. Below are a search box, status and tag filters, and an empty word table.', caption:'My Words, with today’s Daily Picks.'}},
      {t:'Every word, explained', d:'Pronunciation, Vietnamese meaning, an example and a memory hint.', ic:'i-book',
        img:{src:'img/ctx-word.webp', w:1535, h:660, label:'Word detail for “mitigate”', frame:'contextuary.app · mitigate', alt:'A word panel for “mitigate” showing its pronunciation, the Vietnamese meaning “Làm giảm nhẹ, làm dịu bớt”, a tag reading “#2 in the SAT bank”, an example sentence about government policies, and the memory hint “Mitigate sounds like make it gate: close the gate on problems to lessen them.”', caption:'The word panel for “mitigate”.'}},
      {t:'Practise your way', d:'Quizzes, flashcards or a fresh AI Challenge. Six question types.', ic:'i-target',
        img:{src:'img/ctx-practice.webp', w:665, h:713, label:'Start practice settings', frame:'contextuary.app · Practice', alt:'The “Start practice” panel with two modes, Practice and AI Challenge; a choice of quiz or flashcards; word filters for today’s new words, all words, favourites or by status; a count of 10, 20, 50 or all; and six question types.', caption:'Setting up a practice session.'}},
      {t:'Learn from SAT passages', d:'Words highlighted inside SAT-style passages.', ic:'i-book'},
      {t:'Progress at a glance', d:'Your week: mastered, learning, new, and quiz accuracy.', ic:'i-chart'}
    ],
    feedback:{ title:'What learners say', quotes:[
      {q:'Contextuary changed the way I study vocabulary. I finally remember words because I understand them in context.', who:'Jenny, SAT 1560'},
      {q:'The Vietnamese explanations are so precise — no more guessing. It clicks the first time.', who:'Minh, SAT 1520'}],
      note:'From Contextuary learners.' }
  },
  related:['together','lab','fct'] },

{ id:'together', boost:30, cat:'build', kind:'Product', title:'Together!', aliases:['together'],
  summary:'A shared diary for teams: every activity on one calendar, with photos and voice notes.',
  role:'Co-founder · UI/UX programmer', stack:'React',
  tags:['coding','programming','React','UI/UX','interface design','information architecture','user flows','teamwork','calendar','notes','photos','voice notes','Vietnamese','product','web app','launched'],
  sections:[
    ['The need', 'Teams need one place to remember what they did together.'],
    ['My role', 'Co-founder and UI/UX programmer.'],
    ['A key decision', 'Structure first, screens second.'],
    ['Challenge & iteration', 'Reworked the flows for everyday use. Added a shared calendar and members’ notes.'],
    ['Result', 'Live at <a href="https://toghether.contextuary.app/" target="_blank" rel="noopener">toghether.contextuary.app</a> since September 2026.'],
    ['What I learned', 'Easy for me isn’t easy for everyone. Design from the user’s side.']
  ],

  media:[{label:'Together! homepage', ratio:'1512/729', w:1512, h:729, type:'screenshot', src:'img/together-home.webp', frame:'toghether.contextuary.app',
    alt:'The Together! homepage in Vietnamese. The headline reads “Cả đội cùng nhau ghi lại hành trình” (the whole team records the journey together). Beside it, a shared October 2026 calendar with coloured event bars, a voice-note player, and a card for a kick-off workshop with a team photo.',
    caption:'The live homepage, in Vietnamese with an English option.'}],
  evidence:[{label:'Live product: toghether.contextuary.app', url:'https://toghether.contextuary.app/'},{label:'Repository', url:null}],
  metrics:[ { label:'visitors', value:'1,500+' }, { label:'users', value:'450+' } ], related:['contextuary','netmo','common'],
  story:{
    pain:{ lead:'Our team juggled spreadsheets, Messenger and Docs.',
      before:{label:'Before', steps:['Spreadsheet for activities','Messenger to coordinate','Docs for write-ups','Endless reminders']},
      after:{label:'With Together!', steps:['One website','One shared calendar','Photos and notes for anyone who missed the day']} },
    idea:{ lead:'One shared journal for the whole team.',
      points:[['My part','Co-founder, UI/UX. React interface, structure and user flows.'],['In use','<a href="#netmo">Nét Mơ</a> keeps its journal here.']] },
    features:[
      {t:'A journal for every project', d:'A cover and a colour-coded calendar for each project.', ic:'i-cal',
        img:{src:'img/together-journal.webp', w:1146, h:612, label:'Nét Mơ project calendar', frame:'Together! · Nét Mơ', alt:'A Together! project page for Nét Mơ, with a blurred cover photo above an October 2026 calendar and a legend of six activity types.', caption:'Nét Mơ’s season 2 journal. Children’s faces are blurred.'}},
      {t:'Log an activity in one form', d:'Date, people, photos, voice notes, a link and a place.', ic:'i-stack',
        img:{src:'img/together-log.webp', w:672, h:761, label:'Log a new activity form', frame:'Together! · New activity', alt:'The “Log a new activity” form with fields for name, date, participants, activity type and status, a drop zone for photos, buttons for video, document, audio upload and recording, an external link field and a location field.', caption:'The form for logging a new activity.'}},
      {t:'Every moment, with its people', d:'Status, people, reactions and comments on every card.', ic:'i-chart',
        img:{src:'img/together-recent.webp', w:1146, h:364, label:'Recent activities', frame:'Together! · Recent', alt:'Three recent activity cards: an event marked in progress, a team meeting and a comic project marked completed, each with participant, photo, reaction and comment counts.', caption:'Recent activities. A teammate’s name is blurred.'}},
      {t:'The journey in numbers', d:'Activities and participation, as a report.', ic:'i-chart',
        img:{src:'img/together-reports.webp', w:1144, h:732, label:'Journey in numbers report', frame:'Together! · Reports', alt:'A report titled “Nét Mơ’s journey in numbers” with tiles for total activities, workshops, participations and completed, a bar list by activity type, status tiles and a stacked breakdown bar.', caption:'Nét Mơ’s journey in numbers.'}}
    ],
    extras:['Google one-tap sign-in','Vietnamese & English','Dark mode'],
    feedback:{ title:'What the team wrote', quotes:[
      {q:'The activities are so adorable.', who:'A Dream Strokes member'},
      {q:'I had no idea the design team worked this hard.', who:'A Dream Strokes member'},
      {q:'Today’s football match was a great one.', who:'A Dream Strokes member'},
      {q:'The class was so sweet. Reading everyone’s journal feels like being there.', who:'A Dream Strokes member'}],
      note:'Messages from members of Dream Strokes (Nét Mơ), translated from Vietnamese.' }
  } },

{ id:'scamcheck', boost:35, cat:'build', kind:'Hackathon project', title:'ScamCheck', aliases:['scam check','scamcheck','ai scam checker'],
  summary:'An AI scam checker for older people. Built at FCT Summer Camp 2026.',
  role:'Interface design for older users · team of 5', stack:'Web · Gemini API',
  tags:['coding','programming','AI','Gemini','scam','scam detection','scam messages','older adults','elderly','accessibility','readability','web app','interface design','UI/UX','hackathon','summer camp','FCT','online safety','Vietnamese'],
  sections:[
    ['The need', 'Scam messages target older people who aren’t confident online.'],
    ['How it works', 'Paste a message. Three AI characters check it and give a clear verdict.'],
    ['My role', 'Interface design for older users, in a team of five.'],
    ['A key decision', 'Calm colours, with red and yellow saved for what matters.'],
    ['Challenge & iteration', 'Connecting the site to the Gemini API. We researched and leaned on our mentors.'],
    ['Result', 'Fourth place, FCT Summer Camp 2026.'],
    ['What I learned', 'Spotting a scam isn’t enough. The tool has to say what to do next.']
  ],

  media:[{label:'ScamCheck homepage', ratio:'1518/758', w:1518, h:758, type:'screenshot', src:'img/scamcheck-home.webp', frame:'hk1.quvo.pro',
    alt:'The ScamCheck homepage in Vietnamese, with the tagline “Lá chắn số cho mọi gia đình” (a digital shield for every family). A dark panel reads “Dừng lại — kiểm tra — Hành động an toàn” (Stop, check, act safely) above a red “Kiểm tra tin nhắn” (check a message) button. On the right, an illustration of three characters, one holding a magnifying glass and a phone. The top bar has a text-size button.',
    caption:'The hackathon demo, designed for older users.'},
    {label:'ScamCheck result screen', ratio:'800/794', w:800, h:794, type:'screenshot', src:'img/scamcheck-result.webp', frame:'hk1.quvo.pro', alt:'ScamCheck’s result screen in Vietnamese: a verdict card reading “An toàn” (safe), a “Đọc kết quả cho Bác” (read the result aloud) button, and three numbered steps to take right away: don’t click strange links, never share passwords or OTP codes, and call family or the official hotline. A side panel shows the detective character comparing warning signs.', caption:'The result: a clear verdict, a read-aloud button, and three things to do right away.'},
    {label:'Our team presenting at the hackathon', ratio:'1338/778', w:1338, h:778, type:'photo', src:'img/scamcheck-team.webp', alt:'Four members of our team presenting ScamCheck on stage, in front of a slide that sums up the problem: online scams through SMS, Zalo, Messenger and email, especially targeting people over 45.', caption:'Presenting ScamCheck at the hackathon.'}],
  evidence:[{label:'Live demo: hk1.quvo.pro', url:'http://hk1.quvo.pro:15640/'},{label:'Repository', url:null}],
  metrics:[], related:['fct-scam','fct','smartwaste'],
  story:{
    pain:{ lead:'Scam messages frighten older people.',
      after:{label:'With ScamCheck', steps:['Paste the message','Three AI characters check it','Get a verdict, read aloud, with three next steps']} },
    idea:{ lead:'A calm second opinion.',
      points:[['My part','Interface design for older users. Three of our five built the AI.'],['The decision','Bigger text, softer colours, fewer steps.'],['Built at','FCT Summer Camp 2026, with the Gemini API.']] },
    features:[
      {t:'One clear verdict', d:'A plain verdict, a read-aloud button, and three things to do now.', ic:'i-target',
        img:'img/scamcheck-result.webp'},
      {t:'Three AI characters', d:'They check the warning signs. A detective explains the verdict.', ic:'i-search'},
      {t:'Text that fits the reader', d:'Bigger text, plus an A+ button.', ic:'i-book'},
      {t:'Fewer steps to ask', d:'One red button. It never asks for a password or OTP.', ic:'i-bolt'}
    ],
    extras:['Read-aloud results','A+ text size','Vietnamese'],
    scene:{ title:'At the hackathon', img:'img/scamcheck-team.webp', text:'Our opening slide: scams by SMS, Zalo, Messenger and email, aimed at people over 45.', gap:'A sharper team photo. This one is a frame from a video.' },
    feedbackGap:'Add a comment from a judge, a mentor, or an older person who tried ScamCheck.'
  } },

{ id:'firealarm', boost:10, cat:'build', kind:'Hardware project', title:'IoT fire alarm', aliases:['fire alarm','iot fire alarm'],
  summary:'A Bluetooth-enabled IoT fire alarm built at FCT Summer Camp 2024, where it placed second. It combines sensor input, Bluetooth communication and a buzzer alarm.',
  role:'Team member', stack:'Sensors · Bluetooth · Buzzer',
  tags:['IoT','hardware','sensors','Bluetooth','electronics','coding','programming','teamwork','summer camp','embedded'],
  sections:[
    ['The need', G('Describe the problem the alarm was designed for.')],
    ['My role', G('Describe your part of the build and how the team divided the work.')],
    ['A key decision', G('One technical choice, for example how the sensor reading triggers the buzzer.')],
    ['Challenge & iteration', G('A hardware problem you hit and how you debugged it.')],
    ['Result', ['Second Place at FCT Summer Camp 2024.', G('Add what the final prototype could do, with a photo or video.')]],
    ['What I learned', G('What did hardware teach you that software didn’t?')]
  ],
  media:[{label:'Our fire alarm prototype', src:'img/firealarm.webp', w:900, h:1600, ratio:'900/1600', alt:'Our fire alarm prototype: a breadboard wired to sensor modules, LEDs and a buzzer with colourful jumper wires.', caption:'Our prototype: sensors, LEDs and a buzzer on a breadboard.'},{label:'FCT Summer Camp', src:'img/fct-camp.webp', w:1433, h:960, ratio:'1433/960', alt:'FCT Summer Camp 2024 at FPT Software: students at long tables with laptops and hardware kits. A yellow arrow labelled “Me” points to Duy Anh, second from the left.', caption:'FCT Summer Camp 2024. I’m second from the left.'}],
  evidence:[],
  metrics:[], related:['fct-iot','fct','funix'] },

{ id:'fct', short:'FCT', cat:'build', kind:'Learning experience', title:'FPT Software’s Computer Talents Club', aliases:['fct','computer talents club'],
  summary:'A selective, tuition-free, three-year computer science programme run by FPT Software: mentor-guided training in programming, algorithms and advanced mathematics, two summer camps, and a Learning by Sharing community. I graduated with an A.',
  role:'Member · graduated with an A',
  tags:['FCT','learning','programming','coding','algorithms','advanced mathematics','math','mentoring','hackathon','summer camp','Learning by Sharing','Digital Age Tortoise'],
  sections:[
    ['What I trained in', 'Programming, algorithms, and advanced mathematics, following a self-directed learning roadmap with mentor support.'],
    ['When', 'August 2023 to July 2026: 86 weeks of technical training.'],
    ['How it worked', 'Mentor-guided learning, two intensive summer camps with seminars from professionals in cybersecurity, computer science and AI, and the club’s Learning by Sharing community, where I wrote forum posts about programming algorithms and how I learn.'],
    ['Where it shows up', 'Two summer camp projects: a Bluetooth-enabled <a href="#firealarm">IoT fire alarm</a> (Second Place, 2024) and <a href="#scamcheck">ScamCheck</a>, an AI scam checker (Fourth Place, 2026).'],
    ['What I took from it', 'The club’s Digital Age Tortoise philosophy: even when technology moves fast, meaningful learning takes patience. At first I rushed through courses and mistook finishing for understanding. FCT is where I learned to stay with a problem until I understood it.']
  ],
  media:[], evidence:[{label:'Club page or certificate', url:null}],
  metrics:[], related:['scamcheck','fct-iot','math-community'] },

{ id:'funix', short:'FUNiX', cat:'build', kind:'Technical training', title:'FUNiX technical training', aliases:['funix'],
  summary:'Additional technical training in C, object-oriented programming, web development, computer architecture, and operating systems.',
  role:'Trainee',
  tags:['FUNiX','learning','training','C','object-oriented programming','OOP','web development','computer architecture','operating systems','coding','programming'],
  sections:[
    ['What I trained in', 'C, object-oriented programming, web development, computer architecture, and operating systems.'],
    ['When', 'Started in September 2025.'],
    ['Format', G('Add the training format, for example online courses or classes.')],
    ['Where it shows up', G('Connect one topic from this training to a specific project decision.')]
  ],
  media:[], evidence:[{label:'Course record or certificate', url:null}],
  metrics:[], related:['contextuary','firealarm','journey'] },

/* ---------- AWARDS ---------- */
{ id:'imocsea', short:'IMOCSEA journey', boost:30, cat:'awards', kind:'Learning journey', title:'IMOCSEA: Bronze to Silver', aliases:['imocsea'],
  summary:'From a National Round Bronze to an International Round Silver Award in 2025, and what I changed in how I practise mathematics.',
  role:'Individual competitor',
  award:{comp:'IMOCSEA', round:'International Round', result:'Silver Award', year:2025, role:null},
  tags:['math','mathematics','olympiad','challenge','competition','problem solving','practice','learning','IMOCSEA'],
  sections:[], journey:true,
  media:[], evidence:[{label:'National Round certificate (Bronze)', url:null},{label:'International Round certificate (Silver)', url:null}],
  metrics:[], related:['math-community','imc-gold','tortoise'] },

{ id:'imc-gold', short:'IMC Gold', cat:'awards', kind:'Award', title:'International Math Challenge: Gold Medal', aliases:['international math challenge','imc'],
  summary:'Gold Medal (Top 6) in the National Round of the International Math Challenge, 2025.',
  award:{comp:'International Math Challenge', round:'National Round', result:'Gold Medal (Top 6)', year:2025, role:null},
  tags:['math','mathematics','olympiad','challenge','competition','award'],
  sections:[['Practice', G('What did you practise before this round?')],['Feedback', G('What feedback or result told you what to work on?')],['Growth', G('What changed afterwards?')]],
  media:[], evidence:[{label:'Certificate', url:null}], metrics:[], related:['imocsea','math-community'] },

{ id:'isto-bronze', short:'STEM Olympiad Bronze', cat:'awards', kind:'Award', title:'International STEM Olympiad: Bronze in Mathematics', aliases:['international stem olympiad','iso'],
  summary:'Bronze Award in Mathematics at the International STEM Olympiad Final Round, 2025.',
  award:{comp:'International STEM Olympiad', round:'Final Round', result:'Bronze Award in Mathematics', year:2025, role:null},
  tags:['math','mathematics','olympiad','STEM','challenge','competition','award'],
  sections:[['Practice', G('What did you practise before this round?')],['Feedback', G('What did the result show you?')],['Growth', G('What changed afterwards?')]],
  media:[], evidence:[{label:'Certificate', url:null}], metrics:[], related:['imocsea','math-community'] },

{ id:'fptu-ai', short:'AI Web Hackathon', cat:'awards', kind:'Award · team', title:'FPTU AI & Robotics Challenge: AI Web Hackathon', aliases:['fptu','ai web hackathon'],
  summary:'4th out of 71 teams in the AI Web Hackathon, Southern Region, as team leader, 2025.',
  award:{comp:'FPTU AI & Robotics Challenge · AI Web Hackathon', round:'Southern Region', result:'4th out of 71 teams', year:2025, role:'Team leader'},
  tags:['AI','hackathon','coding','programming','web','team leader','leadership','challenge','competition','award'],
  sections:[['The project', G('Name the project the team built and link it if it belongs in the Workshop.')],['Leading the team', G('What did leading look like in practice?')],['Growth', G('What would you do differently next time?')]],
  media:[], evidence:[{label:'Certificate', url:null},{label:'Project link', url:null}], metrics:[], related:['workshop','debate'] },

{ id:'icia', short:'Creativity & Innovation Award', cat:'awards', kind:'Award · team', title:'International Creativity & Innovation Award: Second Place', aliases:['icia','creativity and innovation award'],
  summary:'Second Place in the Southern Region, 2025, as team leader, for FoodWise, a household food-waste prevention app.',
  award:{comp:'International Creativity & Innovation Award', round:'Southern Region', result:'Second Place', year:2025, role:'Team leader'},
  tags:['innovation','creativity','team leader','leadership','challenge','competition','award'],
  sections:[['The project', 'FoodWise, a household food-waste prevention app.'],['Leading the team', G('What was your responsibility as leader?')],['Growth', G('What did the judges’ feedback teach you?')]],
  media:[], evidence:[{label:'Prototype: FoodWise', url:'https://partyrock.aws/u/duyanhh/xhNRNQkr9/FoodWise'}], metrics:[], related:['fptu-ai','workshop'] },

{ id:'humlog', short:'Humanitarian Logistics Hackathon', cat:'awards', kind:'Award · team', title:'Humanitarian Logistics Hackathon: Semifinalist', aliases:['humanitarian logistics hackathon','humanitarian hackathon'],
  summary:'Top 10 of 70 teams in the National Round, 2025, as team leader, with a system connecting humanitarian organisations with people who need help.',
  award:{comp:'Humanitarian Logistics Hackathon', round:'National Round', result:'Semifinalist (Top 10 of 70 teams)', year:2025, role:'Team leader'},
  tags:['hackathon','humanitarian','logistics','team leader','leadership','challenge','competition','award','coding'],
  sections:[['The project', 'A system connecting humanitarian organisations with people who need help.'],['Leading the team', G('What did leading look like in practice?')]],
  media:[], evidence:[{label:'Certificate', url:null}], metrics:[], related:['fptu-ai','icia'] },

{ id:'fct-iot', short:'FCT Summer Camp 2024', cat:'awards', kind:'Award', title:'FCT Summer Camp 2024: Second Place', aliases:['iot chip programming hackathon','iot hackathon','fct summer camp 2024'],
  summary:'Second Place at FCT Summer Camp 2024, for a Bluetooth-enabled IoT fire-alarm system.',
  award:{comp:'FCT Summer Camp', round:null, result:'Second Place', year:2024, role:null}, project:'firealarm',
  tags:['IoT','hardware','chip programming','embedded','hackathon','summer camp','FCT','coding','programming','challenge','award'],
  sections:[['The project', 'A Bluetooth-enabled IoT fire-alarm system: sensor input, Bluetooth communication and a buzzer alarm.'],['Growth', G('What did the camp teach you about hardware?')]],
  media:[], evidence:[{label:'Certificate', url:null}], metrics:[], related:['firealarm','fct'] },

{ id:'fct-scam', short:'FCT Summer Camp 2026', cat:'awards', kind:'Award', title:'FCT Summer Camp 2026: Fourth Place', aliases:['scamcheck hackathon','fct summer camp','summer camp 2026'],
  summary:'Fourth Place at FCT Summer Camp 2026, for the AI scam-detection web tool ScamCheck.',
  award:{comp:'FCT Summer Camp', round:null, result:'Fourth Place', year:2026, role:null}, project:'scamcheck',
  tags:['AI','scam','hackathon','summer camp','FCT','coding','programming','challenge','award'],
  sections:[['Growth', G('What feedback did the team get, and what would you improve?')]],
  media:[], evidence:[{label:'Certificate', url:null}], metrics:[], related:['scamcheck','fct'] },

{ id:'fptu-speak', short:'Best Presentation award', cat:'awards', kind:'Award', title:'FPTU AI & Robotics Challenge: Best Presentation & Public Speaking', aliases:['best presentation','public speaking award','ai programming round'],
  summary:'Best Presentation & Public Speaking Award (2,000,000 VND) at the FPTU AI & Robotics Challenge hackathon, 2025, AI Programming Round.',
  award:{comp:'FPTU AI & Robotics Challenge', round:'AI Programming Round', result:'Best Presentation & Public Speaking Award', year:2025, role:null},
  tags:['public speaking','presentation','AI','programming','hackathon','challenge','competition','award','FPTU'],
  sections:[], media:[], evidence:[{label:'Award board', url:'img/cert-fptu-speaking.webp'}], metrics:[], related:['fptu-ai'] },

/* ---------- RESEARCH ---------- */
{ id:'smartwaste', short:'Smart-waste scoping review', boost:20, cat:'research', kind:'Research project', page:'lab',
  title:'Adapting AI- and IoT-Enabled Smart Waste Management for Vietnam', aliases:['smart waste','smart waste management','smart-waste research'],
  summary:'A scoping review of 40+ studies and a readiness framework asking whether smart waste systems that work elsewhere can work in Vietnam. Mentored by Dr. Nisha Rawindaran (University of South Wales). Manuscript in preparation.',
  role:'Independent researcher',
  tags:['waste','smart waste','sustainability','Vietnam','research','scoping review','AI','IoT','environment','smart city','implementation','policy'],
  sections:[], media:[], evidence:[], metrics:[], related:['vswap','contextuary'] },

{ id:'vswap', short:'V-SWAP framework', cat:'research', kind:'Conceptual framework', page:'vswap',
  title:'V-SWAP: Vietnam Smart Waste Adaptation and Prioritization Framework', aliases:['v-swap','vswap','v swap'],
  summary:'My proposed framework that organises implementation conditions around four decision options: Study, Pilot, Scale, and Reject. Conceptual; not yet field-validated.',
  role:'Proposed by me',
  tags:['V-SWAP','framework','waste','sustainability','Vietnam','decision making','implementation readiness','research','policy'],
  sections:[], media:[], evidence:[], metrics:[], related:['smartwaste','workshop'] },

/* ---------- COMMUNITY ---------- */
{ id:'netmo', boost:25, cat:'community', kind:'Teaching & service', title:'Nét Mơ', aliases:['net mo','nét mơ','dream strokes','colors of the pitch'],
  summary:'Youth-led STEAM workshops for children in shelters and older adults in care homes. I’m Head of Human Resources.',
  role:'Core member (generation 2) · Head of Human Resources', layout:'chain',
  tags:['teaching','community','volunteering','children','older adults','care homes','shelters','STEAM','STEM','art','youth-led','education','curriculum','logistics','volunteer coordination','service','fundraising','human resources'],
  sections:[
    ['The setting', 'Nét Mơ (Dream Strokes in English) is a youth-led initiative bringing hands-on STEAM (STEM + Art) learning and creative exploration to children in shelters, older adults in care homes, and the wider community. I joined its second generation in April 2026. The team keeps its journal in <a href="#together">Together!</a>'],
    ['My responsibility', 'Co-developing STEAM activities and coordinating 20+ volunteers across facilitation, materials and session timing.'],
    ['What we did', 'STEAM activities for about 200 children across six shelters, raising participation from about half the children to nearly all of them. We adapted the programme for 25 older adults through 8 workshops at two care homes, with guided fingerprint painting and group flower canvases.'],
    ['Fundraising', 'I co-managed “Colors of the Pitch”, a football event with 10 teams and 1,000+ spectators in total. It was part of wider fundraising that raised about VND 70 million in net proceeds for workshops and partner support.'],
    ['What I learned', G('Add a short reflection in your own words.')]
  ],
  media:[{label:'A Nét Mơ workshop', src:'img/netmo-session.webp', w:1600, h:1036, ratio:'1600/1036', alt:'Nét Mơ volunteers with children holding up the cardboard artworks they made, including a whale, hearts and a house. The children’s faces are blurred.', caption:'A Nét Mơ workshop. Children’s faces are blurred.'},{label:'At the care home', src:'img/carehome.webp', w:480, h:360, ratio:'4/3', alt:'The Nét Mơ team outside the care home, holding a painting and making heart shapes with their hands.', caption:'Outside the care home.'},{label:'Part of the Nét Mơ team', src:'img/netmo-team.webp', w:1600, h:1200, ratio:'4/3', alt:'Some of the Nét Mơ team posing together for a selfie on a street in Ho Chi Minh City.', caption:'Part of the Nét Mơ team. There are more of us!'}],
  evidence:[{label:'Website: netmoproject.page',url:'https://netmoproject.page/'},{label:'Instagram: @netmow.prj',url:'https://www.instagram.com/netmow.prj/'}], metrics:[{label:'children in six shelters',value:'~200'},{label:'older adults, 8 care-home workshops',value:'25'},{label:'volunteers I coordinate',value:'20+'}], related:['together','house-service','ha-media'] },

{ id:'house-service', short:'Service learning', boost:15, cat:'community', kind:'Service learning', title:'Service learning at Hồng Quang Pagoda', aliases:['service learning','hong quang pagoda','lsts service learning'],
  summary:'Annual first-aid, painting and craft workshops for 60–70 children from Hồng Quang Pagoda. As organising leader and head of logistics, I lead 40+ volunteers across rotating stations.',
  role:'Organising leader · head of logistics', layout:'chain',
  tags:['service learning','volunteering','community','children','organising','logistics','leadership','teamwork','first aid','art','LSTS'],
  sections:[
    ['The setting', 'LSTS service learning, in the 2024–25 and 2025–26 school years.'],
    ['My responsibility', 'Organising leader and head of logistics: preparing materials, organising spaces and schedules, and leading 40+ volunteers across rotating stations.'],
    ['What we did', 'Annual first-aid, painting and craft workshops for 60–70 children from Hồng Quang Pagoda.'],
    ['What changed', 'The children’s artwork was displayed at the pagoda.'],
    ['What I learned', G('Add a short reflection in your own words.')]
  ],
  media:[{label:'Service-learning setup photo', ratio:'3/2', type:'photo'}],
  evidence:[], metrics:[], related:['ha-media','netmo'] },

{ id:'math-community', short:'Advanced Math Community', cat:'community', kind:'Peer mentoring', title:'LSTS Advanced Math Community', aliases:['lsts math','advanced math community'],
  summary:'Weekly advanced-maths sessions with peers and teachers. I was the main peer mentor for IMOCSEA and IMC, guiding practice while competing alongside my classmates.',
  role:'Core member · peer mentor', layout:'chain',
  tags:['math','mathematics','olympiad','challenge','mentoring','peer learning','teaching','community','tutoring'],
  sections:[
    ['The setting', 'The Advanced Math Community at Lawrence S. Ting School, since September 2025.'],
    ['My responsibility', 'The main peer mentor for IMOCSEA and IMC: guiding practice sessions and explaining challenging problems, while competing alongside my classmates.'],
    ['What we did', 'Weekly sessions with peers and teachers, comparing solution methods and tackling problems beyond the school curriculum.'],
    ['What changed', G('Add verified outcomes only, for example how your peers did.')],
    ['What I learned', G('Connect this to your own IMOCSEA practice in your own words.')]
  ],
  media:[{label:'A maths session', src:'img/math.webp', w:480, h:360, ratio:'4/3', alt:'Two students beside a large screen showing a geometry construction during a maths session.', caption:'A maths session.'}], evidence:[], metrics:[], related:['imocsea','debate'] },

{ id:'debate', cat:'community', kind:'Debate', title:'House Adventure debate team', aliases:['debate','house adventure debate'],
  summary:'From too shy to speak, to team captain. We won 1st place among 8 teams, and the next year the 4 juniors I coached won as well.',
  role:'Team captain · peer mentor', layout:'chain',
  tags:['debate','communication','leadership','mentoring','feedback','public speaking','teamwork','community','House Adventure'],
  sections:[
    ['The setting', 'The House Adventure debate team, in the 2024–25 and 2025–26 school years. In secondary school I had been very shy. New classmates invited me to try debating, and my first speech went badly.'],
    ['My responsibility', 'Captaining the team, then coaching 4 juniors over 4 months through mock debates and individual feedback.'],
    ['Results', '1st place among 8 teams. The following year, the juniors I coached won too.'],
    ['A moment that mattered', 'One junior had planned every idea, yet froze in front of the judges. I told her about my own first competition and helped her prepare differently: fewer points, deep breaths, and taking off her glasses so the audience blurred away. In the semifinal she answered an unfamiliar question calmly, and her team won the tournament.'],
    ['What I learned', 'My classmates once encouraged me to speak up when I was too scared to. As a mentor, I could offer that to someone else.']
  ],
  media:[{label:'The junior debate team I mentored', src:'img/debate.webp', w:1600, h:1066, ratio:'1600/1066', alt:'Duy Anh with the junior debate team he mentored, six students at a table covered in notes, smiling and giving thumbs up. A yellow arrow labelled “Me” points to Duy Anh, second from the right.', caption:'The junior debate team I mentored. I’m second from the right.'}], evidence:[], metrics:[], related:['math-community','ha-media'] },

/* ---------- MEDIA ---------- */
{ id:'ha-media', short:'House Adventure media', boost:20, cat:'media', kind:'Media leadership', title:'House Adventure Committee: external relations & media', aliases:['house adventure committee','external relations','house adventure'],
  summary:'As Head of External Relations on the House Adventure Committee, I lead a media team of about 15 people telling the stories of our school events.',
  role:'Member → Head of External Relations',
  tags:['media','external relations','media coordination','communication','event coverage','storytelling','creative leadership','leadership','social media','DaVinci Resolve','Photoshop','House Adventure'],
  sections:[
    ['Medium', 'Social media posts, scripts and visual coverage of school events'],
    ['Event or purpose', 'House Adventure Committee, since September 2025'],
    ['My role', 'Leading a media team of about 15 people in developing stories, scripts and visual coverage of school events.'],
    ['Tools', 'DaVinci Resolve and Photoshop.'],
    ['Reach', '10+ social media posts, averaging about 10,000 views and 300 likes each.'],
    ['A creative decision', G('Describe one choice about what to cover or how to present it.')],
    ['Final asset', G('Add a photo set, video, or post you coordinated.')]
  ],
  media:[{label:'House Adventure event video', ratio:'16/9', type:'video'},{label:'Event coverage', ratio:'3/2', type:'photo'}],
  evidence:[], metrics:[{label:'posts',value:'10+'},{label:'average views per post',value:'~10,000'},{label:'average likes per post',value:'~300'}], related:['house-service','netmo'] },

{ id:'media-video', cat:'media', kind:'Video', title:'Video storytelling', aliases:['video'],
  summary:'Video editing and storytelling.',
  role:'Editor',
  tags:['video','YouTube','video editing','storytelling','media','editing'],
  sections:[
    ['Medium', 'Video editing'],
    ['Event or purpose', G('What was the video for?')],
    ['My role', G('Confirm your role: editing, filming, scripting.')],
    ['Tools', G('Name the editing software only if it was used for this piece.')],
    ['A creative decision', G('One editing choice and why.')],
    ['Final asset', G('Add the video file or YouTube link, with captions or a transcript.')]
  ],
  media:[{label:'Video poster frame', ratio:'16/9', type:'video'}],
  evidence:[{label:'YouTube link', url:null}], metrics:[], related:['media-scripts','ha-media'] },

{ id:'media-photo', cat:'media', kind:'Photography', title:'Event photography', aliases:['photography','photos'],
  summary:'Photography from events.',
  role:'Photographer',
  tags:['photography','photo','event coverage','media','storytelling'],
  sections:[
    ['Medium', 'Photography'],
    ['Event or purpose', 'Hội thi Văn nghệ (20/11) and Văn nghệ Family at school.'],
    ['My role', 'Photographer.'],
    ['A creative decision', G('One framing or selection choice and why.')]
  ],
  media:[{src:'img/ha-vannghe.webp',w:1600,h:1066,ratio:'3/2',type:'photo',alt:'Class A07 on stage at the school’s Hội thi Văn nghệ, in matching black A7 jerseys, holding up hand-painted signs reading “A07 chúc mừng 20/11” while a student plays guitar.',caption:'Hội thi Văn nghệ · 20/11'},{src:'img/ha-stage.webp',w:1600,h:1066,ratio:'3/2',type:'photo',alt:'Students in white uniforms on stage at Văn nghệ Family, Lawrence S. Ting School, throwing colourful scarves into the air and cheering.',caption:'Văn nghệ Family'}],
  evidence:[], metrics:[], related:['ha-media','netmo'] },

{ id:'media-scripts', cat:'media', kind:'Writing', title:'Scripts & storyboards', aliases:['scripts','storyboard'],
  summary:'Scripts and storyboards behind video and event pieces.',
  role:'Writer',
  tags:['scripts','writing','storyboard','storytelling','video','media'],
  sections:[
    ['Medium', 'Script or storyboard'],
    ['Event or purpose', G('What piece was this written for?')],
    ['My role', G('Confirm your role.')],
    ['A creative decision', G('One choice about structure or audience.')],
    ['Final asset', G('Add the script page, and the final piece if a genuine pair exists (enables a storyboard-to-final comparison).')]
  ],
  media:[{label:'Script or storyboard page', ratio:'4/3', type:'scan'}],
  evidence:[], metrics:[], related:['media-video','debate'] },

/* ---------- ABOUT ---------- */
{ id:'tortoise', boost:40, cat:'about', kind:'About', title:'The Digital Age Tortoise', page:'tortoise', aliases:['digital age tortoise','tortoise','turtle'],
  summary:'Why a small mint-green turtle keeps appearing on this site: patience, independent reasoning, reflection, and steady improvement.',
  tags:['turtle','tortoise','learning','patience','reflection','independent reasoning','steady improvement'],
  sections:[], media:[], evidence:[], metrics:[], related:['imocsea','journey'] },

{ id:'journey', boost:10, cat:'about', kind:'About', title:'My learning journey', page:'journey', aliases:['learning journey'],
  summary:'How advanced mathematics, FCT, FUNiX, my projects, research, and community work connect.',
  tags:['learning','learning journey','FCT','FUNiX','math','mathematics','coding','about'],
  sections:[], media:[], evidence:[], metrics:[], related:['fct','funix','tortoise'] }
];

const VOCAB = [
  {word:'meticulous', sentence:'Before the launch, Linh did a meticulous review of every screen, checking each button and label twice.',
   options:['Quick and careless','Extremely careful about details','Secretive','Reluctant'], answer:1,
   why:'“Checking each button and label twice” is the clue. The review paid close attention to small details.'},
  {word:'mitigate', sentence:'To mitigate the risk of losing data, the team saved a backup copy every hour.',
   options:['To ignore','To measure exactly','To make less severe','To increase'], answer:2,
   why:'A backup doesn’t remove the risk of losing data. It reduces the damage if something goes wrong.'},
  {word:'candid', sentence:'Her feedback was candid: she said the first draft was confusing and explained exactly why.',
   options:['Vague','Flattering','Delayed','Honest and direct'], answer:3,
   why:'She named the problem plainly and explained it. Plain, direct honesty is what makes feedback candid.'}
];

const RQ = {
  'power:intermittent':'Can sensors store readings offline and sync later? What happens to collection routes when a bin goes silent?',
  'power:unknown':'Who can map outages and network coverage across the collection area?',
  'maint:none':'Who repairs a broken sensor, how quickly, and are spare parts available locally?',
  'people:low':'Would a smart bin change sorting habits, or do households need information and incentives first?',
  'people:unknown':'How do households in this area currently sort and dispose of waste?',
  'data:none':'Without baseline data, how would a pilot show that anything improved?',
  'policy:unclear':'Which agency owns the collection contract and the data, and what permissions are needed?',
  'cost:pilot':'What happens when the pilot money ends? Who pays for connectivity and replacements?',
  'cost:none':'Is there a lower-cost, non-digital step that solves part of the problem first?'
};

/* =====================================================================
   SEARCH ENGINE
   ===================================================================== */
const CATS = ['build','awards','research','community','media'];
const CATLABEL = {build:'Build',awards:'Awards',research:'Research',community:'Community',media:'Media',about:'About'};
const ROOM = {}; ROOMS.forEach(r=>{ROOM[r.cat]=r;});
const ROOM_BY_ID = {}; ROOMS.forEach(r=>{ROOM_BY_ID[r.id]=r;});
ITEMS.forEach(i=>{ if(i.cat==='awards') i.page='replay'; });
const ITEM = {}; ITEMS.forEach(i=>{ITEM[i.id]=i;});

const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,' ').trim();
const words = s => norm(s).split(' ').filter(Boolean);
function flat(v){
  if(!v) return '';
  if(typeof v==='string') return v;
  if(Array.isArray(v)) return v.map(flat).join(' ');
  if(v.draft) return v.draft;
  return '';
}
const INDEX = ITEMS.map(it=>{
  const body=[it.summary,it.role||'',it.kind||'',it.stack||'',(it.sections||[]).map(s=>s[0]+' '+flat(s[1])).join(' '),
    it.award?[it.award.comp,it.award.round||'',it.award.result,it.award.role||''].join(' '):'',
    it.story?it.story.features.map(f=>f.t+' '+f.d).join(' '):''].join(' ');
  return {it,title:norm(it.title),aliases:(it.aliases||[]).map(norm),tags:it.tags.map(norm),
    titleW:new Set(words(it.title).concat((it.aliases||[]).flatMap(words))),
    tagW:new Set(it.tags.flatMap(words)),
    bodyW:new Set(words(body))};
});
function has(set,t,min){ if(set.has(t)) return 2; if(t.length>=min){ for(const w of set){ if(w.startsWith(t)) return 1; } } return 0; }
function scoreOf(ix,nq,toks,ex){
  let s=0, hit=0;
  const add=(pts,label)=>{ s+=pts; if(ex) ex.push({pts,label}); };
  if(ix.title===nq||ix.aliases.includes(nq)) add(1000,'exact name match');
  else if(nq.length>=3&&(ix.title.startsWith(nq)||ix.aliases.some(a=>a.startsWith(nq)))) add(300,'name starts with query');
  if(ix.tags.includes(nq)) add(40,'exact tag');
  for(const t of toks){
    let ts=0; const before=s;
    const tw=has(ix.titleW,t,3); if(tw===2) add(35,`name has “${t}”`); else if(tw===1) add(20,`name word starts “${t}”`);
    const gw=has(ix.tagW,t,3); if(gw===2) add(25,`tag “${t}”`); else if(gw===1) add(10,`tag starts “${t}”`);
    const bw=has(ix.bodyW,t,4); if(bw===2) add(6,`text has “${t}”`); else if(bw===1) add(2,`text word starts “${t}”`);
    ts=s-before; if(ts>0) hit++;
  }
  if(toks.length>1){ if(hit===toks.length){ s*=1.4; if(ex) ex.push({mult:'×1.4',label:'every word matched'}); } else { s*=0.6; if(ex) ex.push({mult:'×0.6',label:'some words missing'}); } }
  if(hit===0&&s<300) return 0;
  if(ix.it.boost){ s+=ix.it.boost; if(ex) ex.push({pts:ix.it.boost,label:'featured project'}); }
  return s;
}
function explainOf(it,q){ const nq=norm(q); const ix=INDEX.find(x=>x.it===it); const ex=[]; const sc=scoreOf(ix,nq,nq.split(' '),ex); return {score:Math.round(sc),parts:ex}; }
function runSearch(q){
  const nq=norm(q); if(!nq) return [];
  const toks=nq.split(' ');
  const order=c=>{const i=CATS.indexOf(c);return i<0?9:i;};
  return INDEX.map(ix=>({it:ix.it,s:scoreOf(ix,nq,toks)})).filter(r=>r.s>0)
    .sort((a,b)=>b.s-a.s||order(a.it.cat)-order(b.it.cat)||a.it.title.localeCompare(b.it.title));
}
const ALLTAGS = (()=>{ const m=new Map(); ITEMS.forEach(it=>it.tags.forEach(t=>{ const n=norm(t); if(!m.has(n)) m.set(n,t);})); return [...m.values()]; })();
function suggest(q){
  const n=norm(q); if(!n) return [];
  const terms=ALLTAGS.filter(t=>norm(t).startsWith(n)&&norm(t)!==n).sort((a,b)=>a.length-b.length).slice(0,3).map(t=>({type:'term',label:t}));
  const rooms=ROOMS.filter(r=>norm(r.name).includes(n)||norm(r.label).startsWith(n)).slice(0,2)
    .map(r=>({type:'room',label:r.name,to:r.id,kind:r.label}));
  const all=n.length>=2?runSearch(q):[];
  const res=all.slice(0,4).map(r=>({type:'result',label:r.it.title,to:r.it.page||r.it.id,kind:CATLABEL[r.it.cat],cat:r.it.cat,sub:r.it.summary.length>90?r.it.summary.slice(0,88).replace(/\s+\S*$/,'')+'…':r.it.summary}));
  const out=terms.concat(rooms,res);
  if(all.length) out.push({type:'all',label:`See all ${all.length} result${all.length===1?'':'s'} for “${q.trim()}”`});
  return out;
}
function relatedSearches(results,q){
  const qw=new Set(words(q)); const out=[]; const seen=new Set();
  for(const r of results.slice(0,6)){
    for(const t of r.it.tags){
      const n=norm(t);
      if(seen.has(n)||qw.has(n)||words(t).every(w=>qw.has(w))) continue;
      seen.add(n);
      if(runSearch(t).length>=2) out.push(t);
      if(out.length>=6) return out;
    }
  }
  return out;
}

if(typeof document==='undefined'){ globalThis.__DAS={runSearch,suggest,relatedSearches,ITEMS,ROOMS}; return; }

/* =====================================================================
   STATE
   ===================================================================== */
const RM = (()=>{ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } })();
const S = { q:'', cat:'all', resScroll:0, fresh:false, gaps:false, visited:{}, cur:null, prev:null };
try{ const saved=JSON.parse(sessionStorage.getItem('das-state')||'null'); if(saved) Object.assign(S,saved,{cur:null,prev:null}); }catch(e){}
function save(){ try{ const {cur,prev,...keep}=S; sessionStorage.setItem('das-state',JSON.stringify(keep)); }catch(e){} }

const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const turtle = cls => `<svg class="${cls||''}" aria-hidden="true" focusable="false"><use href="#turtle"/></svg>`;
const icon = id => `<svg aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;
const pageOf = it => it.page||it.id;
const roomTok = cat => ROOM[cat]?ROOM[cat].id:'about';

function go(tok){ if((location.hash.slice(1)||'home')===tok) render(); else location.hash=tok; }
function isTourQ(n){ return /^(the )?story$/.test(n)||/^(the )?(5|five) ?min(ute|utes|s)?( tour| route)?$/.test(n)||/^(the )?(tour|route|5 minute tour|five minute tour)$/.test(n); }
const NAME_KEYS=['tran duy anh','duy anh','duyanh','anh','tran anh','tda','who is duy anh'];
function doSearch(q,cat){ q=String(q||'').trim(); if(!q) return; const n=norm(q);
  if(isTourQ(n)){ go('tour'); return; }
  if(NAME_KEYS.includes(n)){ sayHi(); return; }
  S.q=q; S.cat=cat||'all'; S.fresh=true; save(); go('search'); }

/* ---------- small renderers ---------- */
function val(v){
  if(v==null) return '<span class="gap">To be added.</span>';
  if(typeof v==='string') return `<p>${v}</p>`;
  if(Array.isArray(v)) return v.map(val).join('');
  if(v.draft) return `<p>${v.draft}</p><span class="draft-chip">Draft wording · confirm</span>`;
  if(v.gap) return `<span class="gap">${v.gap}</span>`;
  return '';
}
const isGap = v => v==null || (v&&v.gap) || (Array.isArray(v)&&v.every(isGap));
function fields(sections,layout){
  if(!sections||!sections.length) return '';
  return `<dl class="fields${layout==='chain'?' chain':''}">${sections.map(([k,v])=>`<div class="f-row${isGap(v)?' gap-row':''}"><dt>${k}</dt><dd>${val(v)}</dd></div>`).join('')}</dl>`;
}
function ph(m){
  if(m.src){
    const img=`<img src="${m.src}" alt="${esc(m.alt||m.label)}"${m.w?` width="${m.w}" height="${m.h}"`:''} loading="lazy" decoding="async">`;
    return `<figure class="shot">
      ${m.frame?`<div class="shot-bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(m.frame)}</span></div>`:''}
      <div class="shot-img" style="aspect-ratio:${m.ratio}">${img}</div>
      ${m.caption?`<figcaption>${esc(m.caption)}</figcaption>`:''}
    </figure>`;
  }
  return slot(/video/i.test(m.type||'')?'video':/scan/i.test(m.type||'')?'scan':'photo', m.label.replace(/ \(publishing permission needed\)/,''), m.ratio);
}
function tagChips(tags,max){
  return `<ul class="chips">${tags.slice(0,max||99).map(t=>`<li><button type="button" class="tag" data-q="${esc(t)}" aria-label="Search for ${esc(t)}">${esc(t)}</button></li>`).join('')}</ul>`;
}
function evidenceList(ev){
  if(!ev||!ev.length) return '';
  const rows=ev.map(e=>{
    if(!e.url) return `<li class="gap-only"><span class="gap">${esc(e.label)}: not yet provided.</span></li>`;
    const i=e.label.indexOf(': '), k=i>0?e.label.slice(0,i):'Link', n=i>0?e.label.slice(i+2):e.label;
    return `<li><a class="evl-a" href="${esc(e.url)}" target="_blank" rel="noopener"><span class="evl-ic">${icon(/demo/i.test(k)?'i-play':/instagram/i.test(k)?'i-camera':'i-globe')}</span><span class="evl-t"><small>${esc(k)}</small><b>${esc(n)}</b></span><span class="evl-go" aria-hidden="true">↗</span></a></li>`;
  }).join('');
  const any=ev.some(e=>e.url);
  return `<div class="${any?'':'gap-only'}"><p class="side-h">Evidence & links</p><ul class="evl">${rows}</ul></div>`;
}
function statRow(ms){
  const real=(ms||[]).filter(m=>m.value); if(!real.length) return '';
  const asOf=[...new Set(real.map(m=>m.asOf).filter(Boolean))];
  return `<dl class="stats">${real.map(m=>`<div><dt>${esc(m.label)}${asOf.length>1&&m.asOf?' · '+esc(m.asOf):''}</dt><dd>${esc(m.value)}</dd></div>`).join('')}</dl>${asOf.length===1?`<p class="stats-asof">As of ${esc(asOf[0])}</p>`:''}`;
}
function liveLink(it){ const e=(it.evidence||[]).find(x=>x.url&&/^live/i.test(x.label)); return e?`<a class="open-link" href="${esc(e.url)}" target="_blank" rel="noopener">${/demo/i.test(e.label)?'Try the live demo':'Visit '+esc(e.url.replace(/^https?:\/\//,'').replace(/\/$/,''))} ↗</a>`:''; }
function metricsBlock(ms){
  const real=(ms||[]).filter(m=>m.value);
  if(real.length) return `<div><p class="side-h">Usage</p>${statRow(ms)}</div>`;
  return '';
}
function backToResults(){
  return S.prev==='search'||S.fromSearch?`<button type="button" class="back-res" data-back-results>← Back to results for “${esc(S.q)}”</button>`:'';
}

/* ---------- search box ---------- */
let sbCount=0;
function searchBox(size,preset){
  const id='sb'+(++sbCount);
  return `<form class="sb sb-${size}" role="search" data-sb novalidate>
    <label class="vh" for="${id}">Search Duy Anh’s work</label>
    <div class="sb-field">${size==='lg'?'':icon('i-search')}
      <input id="${id}" name="q" type="search" placeholder="Search Duy Anh’s work${size==='sm'&&CAN_HOVER?'  ·  '+MOD+' K':''}" value="${esc(preset!=null?preset:(S.cur==='search'?S.q:''))}" autocomplete="off" spellcheck="false"
        role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-list">
      <button type="submit" class="sb-go" aria-label="Search">${icon('i-search')}</button>
    </div>
    <ul class="sb-list" id="${id}-list" role="listbox" aria-label="Suggestions" hidden></ul>
  </form>`;
}
function bindSearch(form){
  const input=$('input',form), list=$('.sb-list',form);
  let opts=[], act=-1;
  const close=()=>{ list.hidden=true; input.setAttribute('aria-expanded','false'); input.removeAttribute('aria-activedescendant'); act=-1; };
  const mark=(label)=>{ const n=input.value.trim().toLowerCase(); const i=n?label.toLowerCase().indexOf(n):-1;
    return i>=0?esc(label.slice(0,i))+'<mark>'+esc(label.slice(i,i+n.length))+'</mark>'+esc(label.slice(i+n.length)):esc(label); };
  const draw=()=>{
    opts=suggest(input.value);
    if(!opts.length){ close(); return; }
    let sep=false;
    list.innerHTML=opts.map((o,i)=>{
      const head=(o.type==='result'&&!sep)?(sep=true,`<li class="opt-sep" role="presentation">Instant results</li>`):'';
      if(o.type==='result') return head+`<li role="option" class="opt-res" id="${list.id}-${i}" aria-selected="${i===act}" data-i="${i}" data-room="${o.cat}">${icon('i-page')}<span class="opt-two"><b>${mark(o.label)}</b><small>${esc(o.sub)}</small></span><span class="opt-kind">${o.kind}</span></li>`;
      if(o.type==='all') return `<li role="option" class="opt-all" id="${list.id}-${i}" aria-selected="${i===act}" data-i="${i}">${icon('i-search')}<span>${esc(o.label)}</span></li>`;
      return head+`<li role="option" id="${list.id}-${i}" aria-selected="${i===act}" data-i="${i}">${icon(o.type==='term'?'i-search':o.type==='room'?'i-room':'i-page')}<span>${mark(o.label)}</span>${o.kind?`<span class="opt-kind">${o.kind}</span>`:''}</li>`;
    }).join('');
    list.hidden=false; input.setAttribute('aria-expanded','true');
    if(act>=0) input.setAttribute('aria-activedescendant',`${list.id}-${act}`); else input.removeAttribute('aria-activedescendant');
  };
  const choose=o=>{ close(); if(o.type==='term'){ input.value=o.label; doSearch(o.label); } else if(o.type==='all'){ doSearch(input.value); } else go(o.to); };
  input.addEventListener('input',()=>{ act=-1; draw(); });
  input.addEventListener('focus',()=>{ if(input.value) draw(); });
  input.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'){ e.preventDefault(); if(list.hidden){ draw(); return; } act=(act+1)%opts.length; draw(); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); if(list.hidden) return; act=act<=0?opts.length-1:act-1; draw(); }
    else if(e.key==='Escape'){ if(!list.hidden){ e.preventDefault(); close(); } }
    else if(e.key==='Enter'&&act>=0&&!list.hidden){ e.preventDefault(); choose(opts[act]); }
  });
  input.addEventListener('blur',()=>setTimeout(close,120));
  list.addEventListener('mousedown',e=>e.preventDefault());
  list.addEventListener('click',e=>{ const li=e.target.closest('li[data-i]'); if(li) choose(opts[+li.dataset.i]); });
  form.addEventListener('submit',e=>{ e.preventDefault(); const q=input.value.trim(); if(!q){ input.focus(); return; } close();
    doSearch(q); });
}

/* ---------- top bar ---------- */
function topbar(activeCat){
  return `<header class="topbar"><div class="wrap">
    <div class="tb-row">
      <a class="mini-mark" href="#home" aria-label="Behind the screen, home">Duy Anh${turtle()}</a>
      ${searchBox('sm')}
      <nav class="tb-links" aria-label="Site">
        <a href="#about">About</a><a href="#home">Behind the screen</a>${PROFILE.cv?`<a href="${esc(PROFILE.cv.url)}" target="_blank" rel="noopener">CV</a>`:''}${cmdkBtn()}${lookBtn()}
      </nav>
    </div>
    <nav class="rooms" aria-label="Five places">${ROOMS.map(r=>`<a href="#${r.id}" data-room="${r.cat}"${activeCat===r.cat?' aria-current="page"':''}><i class="dot"></i>${r.label}</a>`).join('')}</nav>
  </div></header>`;
}

/* =====================================================================
   VIEWS
   ===================================================================== */
/* ===================== BEHIND THE SCREEN (homepage story) ===================== */
const GUIDE_Q='What does it take for technology to actually work for the people using it?';
const CHAPTERS=[
  {id:'ch-1',n:1,short:'Curiosity',room:'media',title:'What happens behind the screen?',tags:['Curious','Hands-on','Asking why'],how:'Taking things apart to see how they work.'},
  {id:'ch-2',n:2,short:'Learning',room:'awards',title:'Finishing wasn’t the same as understanding.',tags:['Patient','Independent','Reflective'],how:'Tracing where information goes, instead of copying the steps.'},
  {id:'ch-3',n:3,short:'Speaking up',room:'community',title:'I learned to speak up, then to help others do it.',tags:['Listen','Explain','Create together'],how:'Listening first, explaining clearly, then making things with other people.'},
  {id:'ch-4',n:4,short:'Building',room:'build',title:'Then people started using what I built.',tags:['Reliable','User-first','Accessible'],how:'Keeping things working for the people who depend on them, and designing for whoever is actually using it.'},
  {id:'ch-5',n:5,short:'Research',room:'research',title:'Would this actually work here?',tags:['Grounded','Careful','Local'],how:'Checking the conditions on the ground before trusting the technology.'},
  {id:'ch-6',n:6,short:'Next',room:'about',title:'What I want to understand next.',tags:[],how:''}
];
function chHead(c){
  return `<header class="sx-head"><p class="sx-k"><span class="sx-n">${String(c.n).padStart(2,'0')}</span>${c.short}</p><h2 id="${c.id}-h" class="sx-t">${c.title}</h2>
    ${c.tags.length?`<p class="sx-tags">${c.tags.map(t=>`<span>${t}</span>`).join('<i aria-hidden="true">·</i>')}</p>`:''}
    ${c.how?`<p class="sx-how"><b>Behind the screen:</b> ${c.how}</p>`:''}</header>`;
}
function stats(rows){ return `<dl class="sx-stats">${rows.map(([v,l])=>`<div><dt>${l}</dt><dd>${v}</dd></div>`).join('')}</dl>`; }
function contactBlock(){
  if(!PROFILE.contact.length) return '';
  return `<div class="contact" aria-labelledby="ct-h"><h3 id="ct-h">Get in touch</h3><ul>${PROFILE.contact.map(c=>`<li><span class="ct-l">${esc(c.label)}</span>${c.url?`<a class="ct-v" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.value)} ↗</a>`:`<span class="ct-v" style="user-select:all">${esc(c.value)}</span>`}${c.copy?`<button type="button" class="ct-copy" data-copy="${esc(c.value)}" aria-label="Copy ${esc(c.label.toLowerCase())}">Copy</button>`:''}</li>`).join('')}</ul></div>`;
}
function deepBtn(key,label){ return `<button type="button" class="deep-btn" data-deep="${key}">${label||'Look behind it'} <span aria-hidden="true">→</span></button>`; }
function goBtn(href,label){ return `<a class="deep-btn" href="${href}">${label} <span aria-hidden="true">→</span></a>`; }
function bridge(t){ return `<p class="sx-bridge">${t}</p>`; }
function award(id,tier,badge,note){ const it=ITEM[id]; if(!it) return ''; const a=it.award;
  const inner=`<span class="medal t-${tier}" aria-hidden="true">${badge}</span><span><b>${a.result}</b><small>${a.comp}${a.round?' · '+a.round:''} · ${a.year}${a.role?' · '+a.role:''}</small>${note?`<em>${note}</em>`:''}</span>`;
  return it.project?`<a class="ev" href="#${it.project}">${inner}</a>`:`<div class="ev">${inner}</div>`; }
function lifecycle(rows){ return `<ol class="lc">${rows.map(([k,v])=>`<li><span class="lc-k">${k}</span><p>${v}</p></li>`).join('')}</ol>`; }

/* deeper panels: opened beside the story, so readers keep their place */
const DEEP={
  ctx:()=>({k:'Chapter 4 · Contextuary',t:'Behind Contextuary',html:`
    <p>Built with React and Supabase. Every word carries its Vietnamese meaning, an SAT-style example and a memory hint, and the database keeps each word connected to its contexts. Learners practise with six question types, flashcards and a harder AI Challenge.</p>
    <div class="strip">${['ctx-words','ctx-word','ctx-practice'].map((k,i)=>zimg(STRIP('img/'+k+'.webp',['Daily Picks','Every word, explained','Practise your way'][i]))).join('')}</div>
    <h3>Try the idea</h3><div class="demo" data-room="build"></div>
    <p class="dr-links"><a href="#contextuary">The full Contextuary page →</a><a href="https://contextuary.app" target="_blank" rel="noopener">contextuary.app ↗</a></p>`}),
  tg:()=>({k:'Chapter 4 · Together!',t:'Behind Together!',html:`
    <p>Each project gets a cover and a colour-coded calendar. An activity is logged in one form, with photos, video, documents, voice notes, a link and a location. Reports turn the journal into numbers.</p>
    <div class="strip">${zimg(STRIP('img/together-log.webp','Logging an activity'))}${zimg(STRIP('img/together-reports.webp','Journey in numbers'))}${zimg(STRIP('img/together-home.webp','The homepage'))}</div>
    <h3>What I learned</h3><p>An interface I find easy to use won’t necessarily feel easy to someone else. I learned to put myself in the user’s place, think about what they are trying to do, and arrange the steps so they are clear.</p>
    <p class="dr-links"><a href="#together">The full Together! page →</a><a href="https://toghether.contextuary.app/" target="_blank" rel="noopener">Visit the app ↗</a></p>`}),
  sc:()=>({k:'Chapter 4 · ScamCheck',t:'Behind ScamCheck',html:`
    <p>We were a team of five; three of us worked on the AI. I redesigned the interface for older users: bigger text, softer colours, and fewer steps to submit a message. The hardest part for our team was bringing AI into the website through the Gemini API. We researched a lot, asked each other, and got help from our mentors.</p>
    <div class="strip s2">${zimg(PH.scres)}${zimg(PH.scteam)}</div>
    <h3>What I learned</h3><p>Spotting the signs of a scam isn’t enough. The tool has to explain its result so people understand it and know what to do next. It taught me to look beyond whether a system works and ask what makes it useful.</p>
    <div class="ev-list">${award('fct-scam','p','4th')}</div>
    <p class="dr-links"><a href="#scamcheck">The full ScamCheck page →</a><a href="http://hk1.quvo.pro:15640/" target="_blank" rel="noopener">Try the demo ↗</a></p>`})
};
let deepOpener=null;
function openDeep(key,btn){
  const d=$('#drawer'), f=DEEP[key]; if(!d||!f) return; const c=f();
  deepOpener=btn||null; $('#dr-k').textContent=c.k; $('#dr-h').textContent=c.t; $('#dr-body').innerHTML=c.html;
  const demo=$('#dr-body .demo'); if(demo) mountVocab(demo);
  d.showModal(); $('#dr-body').scrollTop=0; $('[data-dr-close]',d).focus();
}

const BEE='<svg viewBox="0 0 40 30" aria-hidden="true" focusable="false"><ellipse cx="15" cy="9" rx="8" ry="6" fill="#fff" opacity=".85" stroke="#1b2a4a" stroke-width="1.2"/><ellipse cx="25" cy="8" rx="7" ry="5" fill="#fff" opacity=".85" stroke="#1b2a4a" stroke-width="1.2"/><ellipse cx="20" cy="19" rx="13" ry="9" fill="#f6c343" stroke="#1b2a4a" stroke-width="1.6"/><path d="M15 11.5v15M21 10.5v17" stroke="#1b2a4a" stroke-width="3"/><circle cx="29.5" cy="17" r="1.6" fill="#1b2a4a"/></svg>';
/* ---------- chapter 1 jigsaw: the pieces become me ---------- */
function pzEdge(x0,y0,dx,dy,b){ // one side of a piece, drawn clockwise; b=+1 tab out, -1 tab in, 0 flat
  const ox=dy, oy=-dx, P=(t,n)=>`${(x0+dx*100*t+ox*n).toFixed(1)} ${(y0+dy*100*t+oy*n).toFixed(1)}`;
  if(!b) return ` L${P(1,0)}`;
  const h=22*b; return ` L${P(.38,0)} C${P(.28,h)} ${P(.72,h)} ${P(.62,0)} L${P(1,0)}`;
}
const PZ_C=4, PZ_R=3;
function pzPath(r,c){
  const H=(r,c)=>((r+c)%2?1:-1), V=(r,c)=>((r+c+1)%2?1:-1);
  const top=r===0?0:-H(r-1,c), right=c===PZ_C-1?0:V(r,c), bottom=r===PZ_R-1?0:H(r,c), left=c===0?0:-V(r,c-1);
  return 'M0 0'+pzEdge(0,0,1,0,top)+pzEdge(100,0,0,1,right)+pzEdge(100,100,-1,0,bottom)+pzEdge(0,100,0,-1,left)+' Z';
}
function puzzleHTML(){
  const W=PZ_C*100, Hh=PZ_R*100, N=PZ_C*PZ_R;
  const art=`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <symbol id="pz-art" viewBox="0 0 ${W} ${Hh}"><image href="img/contextuary-home.webp" x="-46" y="0" width="${(Hh*1516/896).toFixed(1)}" height="${Hh}" preserveAspectRatio="none"/></symbol></defs></svg>`;
  let pieces='';
  for(let r=0;r<PZ_R;r++) for(let c=0;c<PZ_C;c++){ const i=r*PZ_C+c, d=pzPath(r,c);
    pieces+=`<button type="button" class="pz-p" data-pz="${i}" style="left:${((c*100-25)/W*100).toFixed(3)}%;top:${((r*100-25)/Hh*100).toFixed(3)}%;width:${(150/W*100).toFixed(3)}%;height:${(150/Hh*100).toFixed(3)}%" aria-label="Puzzle piece ${i+1} of ${N}">
      <svg viewBox="-25 -25 150 150" aria-hidden="true" focusable="false"><defs><clipPath id="pz-c${i}"><path d="${d}"/></clipPath></defs>
      <g clip-path="url(#pz-c${i})"><svg x="${-c*100}" y="${-r*100}" width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}"><use href="#pz-art"/></svg></g><path class="pz-o" d="${d}"/></svg></button>`; }
  return `${art}<div class="pz" data-room="build">
    <div class="pz-stage"><div class="pz-board" role="group" aria-label="A jigsaw puzzle that forms the Contextuary homepage">${pieces}</div></div>
    <div class="pz-side"><p class="pz-k">Still taking things apart</p><p class="pz-t" aria-live="polite">Putting it back together…</p>
      <p class="pz-h">Tap a piece to snap it into place.</p>
      <button type="button" class="btn btn-line btn-sm" data-pz-scatter>Take it apart</button></div></div>`;
}
function mountPuzzle(root){
  if(!root) return;
  const ps=$$('.pz-p',root), st=$('.pz-t',root), wrap=root;
  const check=()=>{ const done=ps.every(p=>p.classList.contains('home')); wrap.classList.toggle('done',done);
    st.textContent=done?'Put back together: Contextuary, what I build today.':`${ps.filter(p=>p.classList.contains('home')).length} of ${ps.length} pieces in place`; };
  const scatter=()=>{ ps.forEach(p=>{ p.classList.remove('home'); const a=Math.random()*Math.PI*2, d=26+Math.random()*30;
    p.style.setProperty('--tx',(Math.cos(a)*d).toFixed(1)+'%'); p.style.setProperty('--ty',(Math.sin(a)*d).toFixed(1)+'%'); p.style.setProperty('--rot',(Math.random()*70-35).toFixed(0)+'deg'); p.style.zIndex=1+Math.floor(Math.random()*9); }); check(); };
  const home=p=>{ p.classList.add('home'); ['--tx','--ty','--rot'].forEach(k=>p.style.removeProperty(k)); p.style.zIndex=0; check(); };
  const assemble=()=>{ ps.slice().sort(()=>Math.random()-.5).forEach((p,i)=>setTimeout(()=>home(p),RM?0:260+i*170)); };
  ps.forEach(p=>p.addEventListener('click',()=>home(p)));
  $('[data-pz-scatter]',root).addEventListener('click',()=>{ scatter(); });
  if(RM||!('IntersectionObserver' in window)){ ps.forEach(home); return; }
  scatter();
  const io=new IntersectionObserver(es=>{ if(es.some(e=>e.isIntersecting)){ io.disconnect(); assemble(); } },{threshold:.45});
  io.observe(root);
}

/* ---------- chapter 6: the question map ---------- */
const QSRC=[
  {id:'contextuary',label:'Contextuary',ch:4,room:'build'},
  {id:'together',label:'Together!',ch:4,room:'build'},
  {id:'scamcheck',label:'ScamCheck',ch:4,room:'build'},
  {id:'netmo',label:'Nét Mơ',ch:3,room:'community'},
  {id:'vswap',label:'V-SWAP',ch:5,room:'research'}
];
const QMAP=[
  {q:'How do you design technology for people who aren’t like the people who built it?',from:['scamcheck','netmo','together'],room:'community'},
  {q:'How can AI explain its answer well enough for someone to act on it?',from:['scamcheck','contextuary'],room:'build'},
  {q:'How do you know whether a technology fits a place before it spreads?',from:['vswap','netmo'],room:'research'}
];
function qmapHTML(){
  const nm=id=>QSRC.find(x=>x.id===id).label;
  return `<div class="qmap" id="qmap">
    <ul class="qm-src" aria-label="Experiences">${QSRC.map(x=>`<li><button type="button" data-qs="${x.id}" data-room="${x.room}" aria-pressed="false"><span class="qm-ch">Ch ${x.ch}</span><span class="qm-l">${x.label}</span></button></li>`).join('')}</ul>
    <svg class="qm-lines" aria-hidden="true" focusable="false"></svg>
    <ol class="qm-q" aria-label="Questions">${QMAP.map((q,i)=>`<li><button type="button" data-qq="${i}" data-room="${q.room}" aria-pressed="false"><span class="qm-mark" aria-hidden="true">?</span><span class="qm-text">${q.q}</span><small>From ${q.from.map(nm).join(', ').replace(/, ([^,]*)$/,' and $1')}</small></button></li>`).join('')}</ol>
  </div>
  <p class="qm-hint">Tap a question to see which experiences led to it, or tap an experience to see where it leads.</p>`;
}
function mountQmap(){
  const box=$('#qmap'); if(!box) return; const svg=$('.qm-lines',box); let sel=null;
  const draw=()=>{
    const B=box.getBoundingClientRect(); svg.setAttribute('viewBox',`0 0 ${B.width} ${B.height}`); svg.setAttribute('width',B.width); svg.setAttribute('height',B.height);
    let out='';
    QMAP.forEach((q,i)=>{ const qb=$(`[data-qq="${i}"]`,box).getBoundingClientRect();
      q.from.forEach(id=>{ const sb=$(`[data-qs="${id}"]`,box).getBoundingClientRect();
        const x1=sb.right-B.left, y1=sb.top+sb.height/2-B.top, x2=qb.left-B.left, y2=qb.top+qb.height/2-B.top, mx=(x1+x2)/2;
        const room=QSRC.find(x=>x.id===id).room;
        out+=`<path data-room="${room}" data-q="${i}" data-s="${id}" pathLength="1" d="M${x1.toFixed(1)} ${y1.toFixed(1)} C${mx.toFixed(1)} ${y1.toFixed(1)}, ${mx.toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}"/><circle data-room="${room}" data-q="${i}" data-s="${id}" cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="4"/>`; }); });
    svg.innerHTML=out; paint();
  };
  const paint=()=>{
    const on=(q,sid)=>!sel||(sel.t==='q'?String(q)===sel.v:sid===sel.v);
    $$('path,circle',svg).forEach(p=>{ const o=on(p.dataset.q,p.dataset.s); p.classList.toggle('on',!!sel&&o); p.classList.toggle('dim',!!sel&&!o); });
    $$('[data-qq]',box).forEach(b=>{ const i=+b.dataset.qq; const o=!sel||(sel.t==='q'?String(i)===sel.v:QMAP[i].from.includes(sel.v)); b.classList.toggle('dim',!o); b.setAttribute('aria-pressed',String(!!sel&&sel.t==='q'&&sel.v===String(i))); });
    $$('[data-qs]',box).forEach(b=>{ const id=b.dataset.qs; const o=!sel||(sel.t==='s'?id===sel.v:QMAP[+sel.v].from.includes(id)); b.classList.toggle('dim',!o); b.classList.toggle('lit',!!sel&&o); b.setAttribute('aria-pressed',String(!!sel&&sel.t==='s'&&sel.v===id)); });
  };
  box.addEventListener('click',e=>{ const q=e.target.closest('[data-qq]'), sb=e.target.closest('[data-qs]'); if(!q&&!sb) return;
    const n=q?{t:'q',v:q.dataset.qq}:{t:'s',v:sb.dataset.qs}; sel=(sel&&sel.t===n.t&&sel.v===n.v)?null:n; paint(); });
  draw(); mountQmap.draw=draw;
  if(RM||!('IntersectionObserver' in window)){ box.classList.add('drawn'); return; }
  const io=new IntersectionObserver(es=>{ if(es.some(x=>x.isIntersecting)){ io.disconnect(); box.classList.add('drawn'); } },{threshold:.35}); io.observe(box);
}
window.addEventListener('resize',()=>{ if($('#qmap')&&mountQmap.draw) mountQmap.draw(); },{passive:true});
function viewHome(){
  const dots=S.dots||{}; const allLit=CATS.every(c=>dots[c]);
  const ctx=ITEM.contextuary, tg=ITEM.together, sc=ITEM.scamcheck;
  const jumps=[['#workshop','Projects'],['#lab','Research'],['#replay','Awards'],['#about','About']];
  return {cls:'', html:`
  <div class="sx-bar" id="sx-bar">
    <div class="wrap sx-bar-in">
      <a class="mini-mark" href="#home" aria-label="Behind the screen, back to the top" data-sx-top>Duy Anh${turtle()}</a>
      <div class="sx-tools"><button type="button" class="sx-explore" data-cmdk><svg aria-hidden="true"><use href="#i-search"/></svg><span>Explore my work</span><kbd>${MOD} K</kbd></button>${lookBtn()}</div>
    </div>
  </div>
  <nav class="dock off" id="dock" aria-label="Chapters">
    <button type="button" class="dock-arrow" data-dock="prev" aria-label="Previous chapter">‹</button>
    <div class="dock-mid">
      <button type="button" class="dock-cur" data-dock="menu" aria-expanded="false" aria-controls="dock-menu"><span class="dock-n">01</span><span class="dock-of">/ 06</span><span class="dock-t">Curiosity</span><span class="dock-caret" aria-hidden="true">▴</span></button>
      <span class="dock-segs" aria-hidden="true">${CHAPTERS.map(c=>`<i data-room="${c.room}"><b></b></i>`).join('')}</span>
    </div>
    <button type="button" class="dock-arrow" data-dock="next" aria-label="Next chapter">›</button>
    <ol class="dock-menu" id="dock-menu" hidden>${CHAPTERS.map(c=>`<li data-room="${c.room}"><button type="button" data-ch="${c.id}"><span>${String(c.n).padStart(2,'0')}</span><b>${c.short}</b><small>${c.title}</small></button></li>`).join('')}</ol>
  </nav>

  <section class="wrap sx-hero" aria-labelledby="main-h">
    <div class="sx-hero-l">
      <p class="eyebrow">TRẦN DUY ANH · HO CHI MINH CITY · CLASS OF 2027</p>
      <h1 id="main-h" tabindex="-1">Behind the screen</h1>
      <p class="sx-lede">Since I was ten, I’ve wanted to know what happens behind the screen. Six short chapters on where that curiosity took me.</p>
      <div class="sx-guide"><span>The question I keep coming back to</span><p>${GUIDE_Q}</p></div>
      <p class="sx-jumps">${jumps.map(([h,l])=>`<a href="${h}">${l}</a>`).join('')}${PROFILE.cv?`<a href="${esc(PROFILE.cv.url)}" target="_blank" rel="noopener">CV ↗</a>`:''}${PROFILE.contact.length?`<a href="#" data-ch="ch-6">Contact</a>`:''}</p>
      <div class="sx-sign"><button type="button" class="wm-turtle sx-turtle" data-egg-walk aria-label="Poke the turtle">${turtle()}</button>
        <div class="wm-dots${allLit?' joined':''}" role="group" aria-label="Five coloured dots">${ROOMS.map(x=>`<button type="button" class="wm-dot${dots[x.cat]?' lit':''}" data-room="${x.cat}" data-dot="${x.cat}" aria-pressed="${!!dots[x.cat]}" aria-label="${x.label} dot"><i></i></button>`).join('')}</div>
        <p class="dots-msg" aria-live="polite">${allLit?'All five connected. One person, many connections.':''}</p></div>
    </div>
    <figure class="peel" aria-label="Illustration: a screen lifted to show what is behind it">
      <div class="peel-back" aria-hidden="true">
        <span class="pb-node n1">people</span><span class="pb-node n2">data</span><span class="pb-node n3">code</span><span class="pb-node n4">place</span>
        <svg class="pb-lines" viewBox="0 0 300 220" preserveAspectRatio="none"><path d="M70 50 L230 50 M70 50 L70 170 M230 50 L230 170 M70 170 L230 170 M70 50 L230 170"/></svg>
      </div>
      <div class="peel-front" aria-hidden="true">
        <div class="pf-bar"><i></i><i></i><i></i></div>
        <div class="pf-body"><span class="pf-turtle">${turtle()}</span><span class="pf-l w1"></span><span class="pf-l w2"></span><span class="pf-btn">Start</span></div>
      </div>
      <figcaption>Behind every screen: people, data, code, and a place it has to work.</figcaption>
    </figure>
  </section>
  <nav class="wrap sx-toc" aria-label="Contents"><ol>${CHAPTERS.map(c=>`<li data-room="${c.room}"><button type="button" data-ch="${c.id}"><span class="n">${String(c.n).padStart(2,'0')}</span><span class="s">${c.short}</span><span class="t">${c.title}</span></button></li>`).join('')}</ol></nav>

  <div class="sx-story">
  <section class="sx-ch" id="ch-1" data-room="media" aria-labelledby="ch-1-h">
    <div class="wrap">${chHead(CHAPTERS[0])}
      <div class="c1">
        <div class="c1-txt">
          <p class="sx-big">At ten, I spent hours in Bee Swarm Simulator, watching my bees fly from flower to hive.</p>
          <p>How did each bee know where to fly? Someone had written that, line by line. I wanted to know how.</p>
          <p>I took fans apart for the same reason.</p>
          ${puzzleHTML()}
        </div>
        <figure class="c1-vis" aria-label="Illustration: bees in a game, beside the kind of code that could move them">
          <div class="c1-screen"><span class="c1-lab">In front of the screen</span><div class="c1-game" aria-hidden="true"><span class="c1-score">POLLEN 0042</span><span class="c1-hive"></span><span class="c1-flower f1"></span><span class="c1-flower f2"></span><span class="c1-bee b1">${BEE}</span><span class="c1-bee b2">${BEE}</span><span class="c1-ground"></span></div></div>
          <div class="c1-code"><span class="c1-lab">Behind it</span><pre aria-hidden="true"><code><b>for</b> (bee <b>of</b> hive) {
  flower = nearest(field);
  bee.flyTo(flower);
  bee.collect();
}</code></pre></div>
          <figcaption>Illustration · how would each bee know where to fly?</figcaption>
        </figure>
      </div>
      <div class="c1-drift">
        <p class="c2-k">The catch</p>
        <p class="sx-lead">I chased everything, then dropped it once it got hard.</p>
        <ul class="hop" aria-label="Interests I dropped">
          <li style="--i:0;--r:-5deg"><b>Astronomy</b><span>dropped at the hard theory</span></li>
          <li style="--i:1;--r:4deg"><b>Minecraft videos</b><span>dropped when getting better got hard</span></li>
          <li style="--i:2;--r:-2deg"><b>The next new thing</b><span>and again…</span></li>
        </ul>
      </div>
      ${bridge('The next thing to learn wasn’t a language. It was how to stay.')}
    </div>
  </section>

  <section class="sx-ch" id="ch-2" data-room="awards" aria-labelledby="ch-2-h">
    <div class="wrap">${chHead(CHAPTERS[1])}
      <p class="sx-lead">In 2023 I joined FPT Software’s Computer Talents Club. Its philosophy, the <b>Digital Age Tortoise</b>: real learning takes patience. I didn’t get it yet.</p>
      <div class="c2 c2-top">
        <div class="c2-before"><span class="c2-k">At first</span><p class="c2-h">Copying a tutorial</p>
          <ol class="c2-steps" aria-label="Following a tutorial step by step"><li>Copy a Power Automate workflow</li><li>Get stuck</li><li class="no">No idea why</li></ol></div>
        <span class="c2-arrow" aria-hidden="true">→</span>
        <div class="c2-after"><span class="c2-k">Then</span><p class="c2-h">Following the data</p>
          <div class="flow" aria-label="Illustration: information moving from input through processing to output"><span class="fn">Input</span><span class="fl"><i></i></span><span class="fn">Process</span><span class="fl"><i></i></span><span class="fn">Output</span></div>
          <p class="c2-win">Built my own spending tracker. When it broke, I knew where to look.</p></div>
      </div>
      <div class="c2-stay">
        <p class="c2-k">The real test</p>
        <p class="sx-p">Grade 11: an MIT course on maths for computer science. Lost in probability, the moment I used to quit. <b>This time I stayed.</b></p>
      </div>
      ${stats([['Aug 2023','joined FCT'],['86 weeks','graduated with an A'],['Bronze → Silver','IMOCSEA, after changing how I practise']])}
      ${goBtn('#replay','See the awards timeline')}
      ${bridge('Staying was one change. Speaking up was the next.')}
    </div>
  </section>

  <section class="sx-ch" id="ch-3" data-room="community" aria-labelledby="ch-3-h">
    <div class="wrap">${chHead(CHAPTERS[2])}
      <p class="sx-lead">I used to be too shy to start a conversation. Then classmates asked me to try debate.</p>
      <div class="spk">
        <div class="spk-note"><span class="c2-k">First competition</span><p class="c2-h">My speech went badly</p><p>I came back anyway.</p>
          <svg class="spk-fall" viewBox="0 0 300 34" aria-hidden="true"><path d="M4 8 60 8 84 28 120 28 150 6 296 6"/><circle cx="296" cy="6" r="4"/></svg></div>
        <figure class="spk-stage" aria-label="A year later, as a mentor: a junior froze in front of the judges. I told her: fewer points, deep breaths, glasses off so the audience blurs. Her team won.">
          <span class="spk-k">A year later, as a mentor</span>
          <p class="spk-h">A junior froze in front of the judges. <span>What I told her:</span></p>
          <ol class="spk-cards">
            <li class="spk-card"><span class="spk-vis"><span class="spk-pts" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></span><b>Fewer points</b></li>
            <li class="spk-card"><span class="spk-vis"><span class="spk-breath" aria-hidden="true"></span></span><b>Deep breaths</b></li>
            <li class="spk-card"><span class="spk-vis"><svg class="spk-glasses" viewBox="0 0 64 30" aria-hidden="true"><circle cx="18" cy="16" r="10"/><circle cx="46" cy="16" r="10"/><path d="M28 15q4-4 8 0M8 14 3 10M56 14l5-4"/><path class="x" d="M6 27 58 3"/></svg></span><b>Glasses off, so the audience blurs</b></li>
          </ol>
          <svg class="spk-crowd" viewBox="0 0 600 70" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><rect class="t" x="0" y="58" width="600" height="12"/><path d="M10 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="28" cy="32" r="10"/><path d="M52 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="70" cy="30" r="10"/><path d="M94 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="112" cy="33" r="10"/><path d="M136 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="154" cy="29" r="10"/><path d="M178 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="196" cy="32" r="10"/><path d="M220 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="238" cy="31" r="10"/><path d="M262 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="280" cy="30" r="10"/><path d="M304 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="322" cy="33" r="10"/><path d="M346 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="364" cy="29" r="10"/><path d="M388 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="406" cy="32" r="10"/><path d="M430 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="448" cy="30" r="10"/><path d="M472 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="490" cy="33" r="10"/><path d="M514 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="532" cy="31" r="10"/><path d="M556 70v-9c0-10 8-16 18-16s18 6 18 16v9Z"/><circle cx="574" cy="30" r="10"/></svg>
          <p class="spk-won">Her team won</p>
        </figure>
      </div>
      <p class="sx-quote">Someone once pushed me to speak up. Now I could do that for someone else.</p>
      <div class="c4">
        <div class="c4-col"><span class="c4-v">Listen</span><h3>Debate</h3><p>Captain: 1st of 8 teams. The next year, the 4 juniors I coached won too.</p>${zimg(PH.debate)}</div>
        <div class="c4-col"><span class="c4-v">Explain</span><h3>Maths mentoring</h3><p>Main peer mentor for IMOCSEA and IMC in the LSTS Advanced Math Community.</p>${zimg(PH.math)}</div>
        <div class="c4-col c4-nm"><span class="c4-v">Create together</span>
          <div class="nm-logo nm-sm"><svg class="nm-ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="nm-c2" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"/></defs><text><textPath href="#nm-c2" textLength="524" lengthAdjust="spacing">NÉT MƠ · DREAM STROKES · YOUTH-LED STEAM ·</textPath></text></svg><span class="nm-orbit" aria-hidden="true"><i></i><i></i><i></i><i></i></span><img src="img/netmo-logo.webp" width="368" height="368" alt="The Nét Mơ logo: a cheerful hand-drawn character holding a paintbrush under the colourful words “Nét Mơ”." loading="lazy"></div>
          <h3>Nét Mơ <small>Dream Strokes</small></h3><p>STEAM workshops for children in shelters and older adults in care homes. As Head of HR, I co-design activities and coordinate 20+ volunteers. Participation went from about half the children to nearly all.</p></div>
      </div>
      <div class="c4-gal ph5"><div class="g-a">${zimg(PH.session)}</div><div class="g-b">${zimg(PH.draw)}</div><div class="g-c">${zimg(PH.care)}</div><div class="g-d">${zimg(PH.team)}</div></div>
      ${stats([['~200','children across six shelters'],['25','older adults in 8 care-home workshops'],['20+','volunteers I coordinate'],['1st → 1st','debate: my team, then the juniors I coached']])}
      ${goBtn('#common','Go to the Common Room')}
      ${bridge('Meanwhile, people started using what I built.')}
    </div>
  </section>

  <section class="sx-ch" id="ch-4" data-room="build" aria-labelledby="ch-4-h">
    <div class="wrap">${chHead(CHAPTERS[3])}
      <p class="sx-lead">Three projects, three lessons about the people using them.</p>
      ${stats([['2,200+','visitors to Contextuary'],['500+','Contextuary users'],['2','apps launched in 2026'],['4th','FCT Summer Camp 2026']])}
      <article class="p3 p3-ctx" aria-labelledby="p-ctx">
        <div class="p3-top"><div><p class="p3-k">Contextuary · co-leader, full-stack developer · since Aug 2026</p><h3 id="p-ctx">Supporting a product people depend on</h3></div>${statRow(ctx.metrics)}</div>
        <div class="p3-shot">${ph(ctx.media[0])}</div>
        ${lifecycle([
          ['Problem','Word lists teach definitions, not usage.'],
          ['My part','Co-lead. Database, interface, learning flows.'],
          ['Challenge','SAT-week traffic spikes. I reworked caching so it stays fast.'],
          ['Result','Launched Aug 2026. 2,200+ visitors, 500+ users.'],
          ['What I learned','Running isn’t enough. It has to stay reliable.']])}
        <ul class="bubbles two" aria-label="What Contextuary learners say">${ctx.story.feedback.quotes.map(q=>`<li><blockquote>${esc(q.q)}</blockquote><cite>${esc(q.who)}</cite></li>`).join('')}</ul>
        ${deepBtn('ctx','Look behind Contextuary')}
      </article>
      <article class="p3 p3-tg" aria-labelledby="p-tg">
        <div class="p3-top"><div><p class="p3-k">Together! · co-founder, UI/UX programmer · launched Sep 2026</p><h3 id="p-tg">Designing a space for shared memories</h3></div>${statRow(tg.metrics)}</div>
        <div class="tg-grid">
          <div class="tg-collage">${zimg(STRIP('img/together-journal.webp','A project’s calendar'))}${zimg(STRIP('img/together-recent.webp','Moments, with their people'))}${zimg(STRIP('img/together-log.webp','Logging an activity'))}</div>
          <div class="tg-side">
            ${lifecycle([
              ['Problem','Our team juggled spreadsheets, Messenger and Docs.'],
              ['My part','React interface, structure and user flows.'],
              ['Decision','Structure first, screens second.'],
              ['Result','One shared journal for every activity.'],
              ['What I learned','Easy for me isn’t easy for everyone.']])}
          </div>
        </div>
        <ul class="bubbles" aria-label="What Dream Strokes members wrote">${tg.story.feedback.quotes.map(q=>`<li><blockquote>${esc(q.q)}</blockquote></li>`).join('')}</ul>
        <p class="sx-small">Messages from members of Dream Strokes (Nét Mơ), translated from Vietnamese.</p>
        ${deepBtn('tg','Look behind Together!')}
      </article>
      <article class="p3 p3-sc" aria-labelledby="p-sc">
        <div class="p3-top"><div><p class="p3-k">ScamCheck · interface design · team of 5 · 2026</p><h3 id="p-sc">Designing for someone under stress</h3></div><div class="ev-list">${award('fct-scam','p','4th')}</div></div>
        <div class="sc-grid">
          <div class="p3-shot">${ph(sc.media[0])}<div class="strip s2">${zimg(PH.scres)}${zimg(PH.scteam)}</div></div>
          <div><p class="sx-p">Scam messages frighten older users. Paste one in, and three AI characters check its warning signs.</p>
            <p class="c2-k" style="margin-top:14px">What I changed for older users</p>
            <ul class="callouts"><li>Bigger text, with an A+ button for more</li><li>Softer colours, with red and yellow saved for what matters</li><li>Fewer steps to submit a message</li></ul>
            ${deepBtn('sc','Look behind ScamCheck')}
          </div>
        </div>
      </article>
      ${bridge('Building for real people left me with a bigger question about technology.')}
    </div>
  </section>

  <section class="sx-ch" id="ch-5" data-room="research" aria-labelledby="ch-5-h">
    <div class="wrap">${chHead(CHAPTERS[4])}
      <div class="c5">
        <div>
          <p class="sx-big">Smart bins, sensors and AI route planning work in some cities. Would they work in Vietnam?</p>
          <p>My school is in Phu My Hung, a carefully planned district. Other parts of Ho Chi Minh City work very differently.</p>
          <p>Since June 2026, mentored by Dr. Nisha Rawindaran (University of South Wales), I’ve reviewed 40+ studies and proposed <b>V-SWAP</b>, a framework that turns local conditions into one of four decisions.</p>
          <div class="status lt"><span>Manuscript in preparation</span><span>V-SWAP is a proposal, not yet field-validated</span></div>
        </div>
        <ul class="four-big" aria-label="V-SWAP’s four decisions"><li><b>Study</b><span>Find out more first</span></li><li><b>Pilot</b><span>Test small and measure</span></li><li><b>Scale</b><span>Expand what worked</span></li><li><b>Reject</b><span>Not a fit, for now</span></li></ul>
      </div>
      <div class="c5-case">
        <p class="c2-k">One 2024 study reported</p>
        <div class="c5-case-in">
          <div class="c5-num"><b>32%</b><span>better route efficiency</span></div>
          <div class="c5-num"><b>29%</b><span>less fuel used</span></div>
          <p>Would the sensors stay accurate here? Would the networks hold? A strong result elsewhere doesn’t prove a fit here.</p>
        </div>
      </div>
      <div id="rx-mount"></div>
      ${stats([['40+','studies reviewed since June 2026'],['6','conditions examined'],['4','possible decisions']])}
      ${goBtn('#lab','Open the research page')}
      ${bridge('Each chapter ended with a better question than it started with. These are the ones I’m carrying forward.')}
    </div>
  </section>

  <section class="sx-ch" id="ch-6" data-room="about" aria-labelledby="ch-6-h">
    <div class="wrap">${chHead(CHAPTERS[5])}
      <div class="sx-guide big"><span>Still the question underneath it all</span><p>${GUIDE_Q}</p></div>
      <div class="c6-next">
        <p class="c2-k">Where I am now</p>
        <p class="sx-big">My research has taught me what to ask about a technology, but not yet how to test the answers with data myself.</p>
        <p class="sx-p">That’s next: computing and environmental engineering, starting with waste in Ho Chi Minh City.</p>
      </div>
      <h3 class="qm-title">Where my questions come from</h3>
      ${qmapHTML()}
      <span class="draft-chip">Draft questions · rewrite in your own words</span>
      <p class="sx-bridge sx-end">I still wonder what happens behind the screen. The difference now is that I stay long enough to find out.</p>
      <div class="c6-links">
        <a href="#workshop" data-room="build"><b>Projects</b><span>Everything I’ve built</span></a>
        <a href="#lab" data-room="research"><b>Research</b><span>V-SWAP in detail</span></a>
        <a href="#replay" data-room="awards"><b>Awards</b><span>The full track record</span></a>
        <a href="#about" data-room="about"><b>About</b><span>Profile and changelog</span></a>
        ${PROFILE.cv?`<a href="${esc(PROFILE.cv.url)}" target="_blank" rel="noopener"><b>CV ↗</b><span>${esc(PROFILE.cv.label)}</span></a>`:''}
      </div>
      ${contactBlock()}${PROFILE.cv?'':'<span class="gap">Add your CV link.</span>'}
    </div>
  </section>

  <section class="sx-explore-sec" id="places" tabindex="-1" aria-labelledby="ex-h">
    <div class="wrap"><h2 id="ex-h" class="rm-h">Explore my work</h2>
      <p class="sx-p">Search everything, or open a section.</p>
      ${searchBox('lg')}
      <div class="ex-rooms">${ROOMS.map(r=>`<a href="#${r.id}" data-room="${r.cat}"><i class="dot"></i>${r.name}<small>${r.label}</small></a>`).join('')}</div>
    </div>
  </section>
  </div>`};
}
let sxObs=null;
function setupStory(){
  if(sxObs){ sxObs.disconnect(); sxObs=null; }
  const secs=$$('.sx-ch'); if(!secs.length) return;
  storyProgress();
}
function storyProgress(){
  const dock=$('#dock'); if(!dock) return;
  const secs=$$('.sx-ch'), line=window.innerHeight*0.45;
  let cur=-1;
  secs.forEach((c,i)=>{ const t=c.getBoundingClientRect(); if(t.top<=line) cur=i; });
  const last=secs[secs.length-1].getBoundingClientRect();
  const off=cur<0||last.bottom<window.innerHeight*0.35;
  dock.classList.toggle('off',off);
  $$('.dock-segs i',dock).forEach((seg,i)=>{ let f=0;
    if(i<cur) f=1; else if(i===cur){ const r=secs[i].getBoundingClientRect(); f=Math.max(0,Math.min(1,(line-r.top)/Math.max(1,r.height))); }
    seg.firstElementChild.style.transform=`scaleX(${f.toFixed(3)})`; seg.classList.toggle('now',i===cur); });
  if(cur!==storyProgress.cur){ storyProgress.cur=cur; const c=CHAPTERS[Math.max(0,cur)];
    dock.dataset.room=c.room; $('.dock-n',dock).textContent=String(c.n).padStart(2,'0'); $('.dock-t',dock).textContent=c.short;
    $('[data-dock="prev"]',dock).disabled=cur<=0; $('[data-dock="next"]',dock).disabled=cur>=CHAPTERS.length-1;
    $$('.dock-menu [data-ch]',dock).forEach(b=>{ const on=b.dataset.ch===c.id&&cur>=0; if(on) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current'); }); }
}
function dockMenu(open){ const m=$('#dock-menu'), b=$('[data-dock="menu"]'); if(!m) return; m.hidden=!open; b.setAttribute('aria-expanded',String(open)); if(open){ const c=$('[aria-current="step"]',m)||$('button',m); c.focus(); } }
window.addEventListener('scroll',()=>{ if($('#dock')) storyProgress(); },{passive:true});

function goCh(id){ const el=document.getElementById(id); if(!el) return; const bh=($('#sx-bar')||{offsetHeight:0}).offsetHeight; window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-bh+1,behavior:RM?'auto':'smooth'}); const h=$('#'+id+'-h')||el; h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); }
/* ----- Rooms: one statement, proof, then the work shown with pictures ----- */
function roomBand(r,statement,facts){
  return `<div class="band"><header class="wrap head rm-head">
    <p class="crumb"><a href="#home">duyanh</a> › ${r.cat} › ${r.id}</p>
    <p class="room-cat"><i class="dot"></i>${r.label} · ${r.name}</p>
    <h1 id="main-h" tabindex="-1" class="rm-say">${statement}</h1>
    ${facts&&facts.length?`<dl class="rm-facts">${facts.map(([v,l])=>`<div><dt>${l}</dt><dd>${v}</dd></div>`).join('')}</dl>`:''}
  </header></div>`;
}
function slot(kind,label,ratio){
  const ic=kind==='video'?'i-play':kind==='scan'?'i-page':'i-camera';
  const k=kind==='video'?'Video coming soon':kind==='scan'?'Scan coming soon':'Photo coming soon';
  return `<figure class="slot${kind==='video'?' slot-v':''}" style="aspect-ratio:${ratio||'4/3'}" role="img" aria-label="${esc(k+': '+label)}"><span class="slot-in" aria-hidden="true"><span class="slot-ic">${icon(ic)}</span><span class="slot-l">${esc(label)}</span><span class="slot-k">${k}</span></span></figure>`;
}
function zimg(s){ return `<figure class="zi"><div class="zi-b"><img src="${s.src}" width="${s.w}" height="${s.h}" alt="${esc(s.alt)}" loading="lazy" decoding="async"></div>${s.cap?`<figcaption>${esc(s.cap)}</figcaption>`:''}</figure>`; }
function thumb(src,w,h,alt){ return `<span class="rc-img"><img src="${src}" width="${w}" height="${h}" alt="${esc(alt)}" loading="lazy" decoding="async"></span>`; }
function rcard(id,o){
  const it=ITEM[id]; if(!it) return '';
  const vis=o.img?thumb(o.img[0],o.img[1],o.img[2],o.img[3]):o.slot?`<span class="rc-img slotwrap">${slot(o.slot[0],o.slot[1],'16/10')}</span>`:`<span class="rc-ic" aria-hidden="true">${icon(o.ic||'i-spark')}</span>`;
  return `<a class="rc${o.img||o.slot?'':' no-img'}" href="#${pageOf(it)}" data-room="${it.cat}">${vis}
    <span class="rc-body"><span class="rc-k">${o.k}</span><span class="rc-t">${it.title}</span><span class="rc-l">${o.line}</span>${o.proof?`<span class="rc-p">${o.proof}</span>`:''}</span>
    <span class="rc-go" aria-hidden="true">→</span></a>`;
}
function spot(o){
  const it=ITEM[o.id];
  const main=o.main.src?ph(o.main):slot(o.main.kind,o.main.label,o.main.ratio);
  const strip=(o.strip||[]).map(s=>s.src?zimg(s):`<div class="zi">${slot(s.kind,s.label,'16/10')}</div>`).join('');
  return `<article class="spot${o.flip?' flip':''}${o.big?' big':''}" data-room="${it.cat}" aria-labelledby="sp-${it.id}">
    <div class="spot-media">${main}${strip?`<div class="strip${(o.strip||[]).length===2?' s2':''}">${strip}</div>`:''}</div>
    <div class="spot-body"><p class="rc-k">${o.k}</p><h3 class="spot-t" id="sp-${it.id}">${it.title}</h3><p class="spot-l">${o.line}</p>
      ${o.stats||''}
      ${o.bullets?`<ul class="spot-b">${o.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}
      ${o.proof?`<p class="rc-p">${o.proof}</p>`:''}
      <p class="spot-cta"><a class="rf-cta" href="#${pageOf(it)}">Read the full story →</a>${o.ext?`<a class="spot-ext" href="${o.ext[0]}" target="_blank" rel="noopener">${o.ext[1]} ↗</a>`:''}</p>
    </div></article>`;
}
function whereNext(list,cat){
  return `<section class="rm-sec rm-next" aria-label="Other rooms">${nextRoom(cat)}</section>`;
}
const PH={scres:{src:'img/scamcheck-result.webp',w:800,h:794,alt:'ScamCheck’s result screen in Vietnamese: a verdict card reading “An toàn” (safe), a “Đọc kết quả cho Bác” (read the result aloud) button, and three numbered steps to take right away: don’t click strange links, never share passwords or OTP codes, and call family or the official hotline. A side panel shows the detective character comparing warning signs.',cap:'The result screen, with a read-aloud button'},scteam:{src:'img/scamcheck-team.webp',w:1338,h:778,alt:'Four members of our team presenting ScamCheck on stage, in front of a slide that sums up the problem: online scams through SMS, Zalo, Messenger and email, especially targeting people over 45.',cap:'Presenting ScamCheck at the hackathon'},debate:{src:'img/debate.webp',w:1600,h:1066,alt:'Duy Anh with the junior debate team he mentored, six students at a table covered in notes, smiling and giving thumbs up. A yellow arrow labelled “Me” points to Duy Anh, second from the right.',cap:'The junior team I mentored · I’m second from the right'},math:{src:'img/math.webp',w:480,h:360,alt:'Two students beside a large screen showing a geometry construction during a maths session.',cap:'A maths session'},session:{src:'img/netmo-session.webp',w:1600,h:1036,alt:'Nét Mơ volunteers with children holding up the cardboard artworks they made, including a whale, hearts and a house. The children’s faces are blurred.',cap:'A Nét Mơ workshop · children’s faces blurred'},team:{src:'img/netmo-team.webp',w:1600,h:1200,alt:'Some of the Nét Mơ team posing together for a selfie on a street in Ho Chi Minh City.',cap:'Part of the Nét Mơ team · there are more of us!'},care:{src:'img/carehome.webp',w:480,h:360,alt:'The Nét Mơ team outside the care home, holding a painting and making heart shapes with their hands.',cap:'At the care home'},draw:{src:'img/drawing.webp',w:480,h:640,alt:'Two flowers drawn in pink and blue marker on white paper, made during our care-home session.',cap:'A drawing from our care-home session'}};
const IMG=src=>{ for(const it of ITEMS){ for(const m of (it.media||[])) if(m.src===src) return m; if(it.story) for(const f of it.story.features) if(f.img&&f.img.src===src) return f.img; } return null; };
const STRIP=(src,cap)=>{ const m=IMG(src); return {src,w:m.w,h:m.h,alt:m.alt,cap}; };

/* ===== Build ===== */
function viewWorkshop(){
  const r=ROOM.build;
  return `<div data-room="build">
  ${roomBand(r,'I build things people actually use.',[['2,200+','visitors to Contextuary'],['2','apps launched in 2026'],['3','hackathon placings']])}
  <div class="wrap">
    ${spot({id:'contextuary',big:true,k:'Co-leader · full-stack developer · React + Supabase · since Aug 2026',
      line:'An app that teaches SAT words through the sentences they live in.',
      stats:statRow(ITEM.contextuary.metrics),
      main:ITEM.contextuary.media[0],
      strip:[STRIP('img/ctx-words.webp','Daily Picks'),STRIP('img/ctx-word.webp','Every word, explained'),STRIP('img/ctx-practice.webp','Practise your way')],
      bullets:['Ten Daily Picks every day, each with its pronunciation','A Vietnamese meaning, an SAT-style example and a memory hint for every word','Six question types, plus a harder AI Challenge','Kept the site smooth through SAT-week traffic by reworking caching and the database'],
      ext:['https://contextuary.app','contextuary.app']})}
    <section class="rm-sec tight" aria-labelledby="ws-try"><h2 class="rm-h" id="ws-try">Try the idea in 10 seconds</h2>
      <div class="demo rm-demo" id="vocab" data-room="build" aria-label="Vocabulary-in-context demo"></div>
    </section>
    <section class="rm-sec" aria-labelledby="ws-more"><h2 class="rm-h" id="ws-more">More projects</h2>
      ${spot({id:'together',flip:true,k:'Co-founder · UI/UX programmer · React · since Sep 2026',
        line:'A shared journal for teams, so members who missed a day can still catch up.',
        stats:statRow(ITEM.together.metrics),
        main:ITEM.together.media[0],
        strip:[STRIP('img/together-journal.webp','Project calendar'),STRIP('img/together-log.webp','Log an activity'),STRIP('img/together-reports.webp','Journey in numbers')],
        bullets:['Every workshop, trip and meeting on one shared calendar','Photos, voice notes, reactions and comments on each activity','Replaced spreadsheets, Messenger and Docs for our own team, Nét Mơ'],
        ext:['https://toghether.contextuary.app/','Visit the app']})}
      ${spot({id:'scamcheck',k:'Interface design · team of 5 · Gemini API · 2026',
        line:'An AI scam checker designed for older people.',
        main:ITEM.scamcheck.media[0],
        strip:[PH.scres,PH.scteam],
        bullets:['Paste in a message that looks suspicious','Three AI characters check its warning signs and suggest what to do first','Larger text, softer colours and fewer steps for older users'],
        proof:'4th place · FCT Summer Camp 2026',ext:['http://hk1.quvo.pro:15640/','Try the demo']})}
      ${spot({id:'firealarm',flip:true,k:'FCT Summer Camp 2024 · hardware · team project',
        line:'A fire alarm built from a sensor, Bluetooth and a buzzer.',
        main:{...ITEM.firealarm.media[0],ratio:'4/3'},
        bullets:['Sensor input','Bluetooth communication','A buzzer that sounds the alarm'],proof:'2nd place · FCT Summer Camp 2024'})}
    </section>
    <section class="rm-sec" aria-labelledby="ws-learn"><h2 class="rm-h" id="ws-learn">Where I learned to build</h2>
      <div class="rgrid two">
        ${rcard('fct',{k:'Aug 2023 – Jul 2026 · graduated with an A',line:'86 weeks of mentor-guided programming, algorithms and maths, plus two summer camps.',ic:'i-book'})}
        ${rcard('funix',{k:'Since September 2025',line:'Training in C, object-oriented programming, web, computer architecture and operating systems.',ic:'i-stack'})}
      </div>
    </section>
    ${whereNext([{to:'lab',q:'How do we decide whether technology is useful in a real setting?'},{to:'replay',q:'Two of these projects came out of hackathons. What placed, and what did it teach?'}],'build')}
  </div></div>`;
}

/* ===== Awards: a git-graph timeline with two lanes ===== */
const AW_MATH=[
  {id:'imc-gold',tier:'g',badge:'Gold',t:'International Math Challenge',s:'National Round · Top 6',y:'2025'},
  {id:'imocsea',tier:'s',badge:'Silver',t:'IMOCSEA',s:'International Round',y:'2025'},
  {id:'isto-bronze',tier:'z',badge:'Bronze',t:'International STEM Olympiad',s:'Final Round · Mathematics',y:'2025'},
  {id:'imocsea',tier:'z',badge:'Bronze',t:'IMOCSEA',s:'National Round',y:'Oct 2025'}
];
const AW_BUILD=[
  {id:'fct-scam',r:'4th',t:'FCT Summer Camp',s:'ScamCheck, an AI scam checker',y:'2026',to:'scamcheck'},
  {id:'fptu-ai',r:'Top 4',of:'of 71 teams',t:'FPTU AI & Robotics Challenge',s:'AI Web Hackathon · Southern Region',y:'2025',lead:true,
   plus:'+ Best Presentation & Public Speaking Award',cert:{src:'img/cert-fptu-speaking.webp',w:960,h:621,alt:'Award board from the FPTU AI & Robotics Challenge 2025, AI Programming Round: Best Presentation & Public Speaking Award, 2,000,000 VND.'}},
  {id:'humlog',r:'Top 10',of:'of 70 teams',t:'Humanitarian Logistics Hackathon',s:'National Round · linking aid groups with people in need',y:'2025',lead:true},
  {id:'icia',r:'2nd',t:'Creativity & Innovation Award',s:'Southern Region · FoodWise, a food-waste prevention app',y:'2025',lead:true,ext:'https://partyrock.aws/u/duyanhh/xhNRNQkr9/FoodWise'},
  {id:'fct-iot',r:'2nd',t:'FCT Summer Camp',s:'An IoT fire alarm',y:'2024',to:'firealarm'}
];
function viewReplay(){
  const r=ROOM.awards, medal=x=>`<span class="medal t-${x.tier}" aria-hidden="true">${x.badge}</span>`;
  return `<div data-room="awards">
  ${roomBand(r,'Each result showed me what to practise next.',[['10','medals and placings'],['Bronze → Silver','IMOCSEA, 2025'],['3×','team leader']])}
  <div class="wrap">
    <section class="rm-sec" aria-labelledby="aw-m"><h2 class="rm-h" id="aw-m">Maths</h2>
      <ul class="shelf">${AW_MATH.map(x=>`<li><div class="shelf-a">${medal(x)}<b>${x.t}</b><span>${x.s}</span><em>${x.y}</em></div></li>`).join('')}</ul>
      <div class="b2s">
        <span class="b2s-m">${medal({tier:'z',badge:'Bronze'})}<span>National Round</span></span>
        <span class="b2s-mid"><span class="rc-k">IMOCSEA 2025 · what I changed in between</span><span class="b2s-h"><i>Try it myself first</i><i>Write down what failed</i><i>Compare methods after</i><i>Understand why</i></span></span>
        <span class="b2s-m">${medal({tier:'s',badge:'Silver'})}<span>International Round</span></span>
      </div>
    </section>
    <section class="rm-sec" aria-labelledby="aw-b"><h2 class="rm-h" id="aw-b">Building & leading teams</h2>
      <ol class="podium">${AW_BUILD.map(x=>{ const body=`<span class="pod-r">${x.r}${x.of?`<small>${x.of}</small>`:''}</span><span class="pod-t"><b>${x.t}</b><span>${x.s}</span>${x.plus?`<span class="pod-plus">${x.plus}</span>`:''}</span>${x.cert?`<img class="pod-cert" src="${x.cert.src}" width="${x.cert.w}" height="${x.cert.h}" alt="${esc(x.cert.alt)}" loading="lazy" decoding="async">`:''}<span class="pod-m"><span>${x.y}</span>${x.lead?'<i>Team leader</i>':''}${x.to?'<em>See the project →</em>':x.ext?'<em>Try the prototype ↗</em>':''}</span>`;
        return `<li>${x.to?`<a class="pod pod-link" href="#${x.to}">${body}</a>`:x.ext?`<a class="pod pod-link" href="${x.ext}" target="_blank" rel="noopener">${body}</a>`:`<div class="pod">${body}</div>`}</li>`; }).join('')}</ol>
    </section>
    ${whereNext([],'awards')}
  </div></div>`;
}
/* ===== Research: the framework as a decision flow ===== */
const GATES=[
  {q:'Do we know the local situation?',f:[['Data','data:none'],['People’s habits','people:low']],fail:'study'},
  {q:'Can it run and be repaired here?',f:[['Power & internet','power:intermittent'],['Repairs','maint:none']],fail:'reject'},
  {q:'Is it paid for and allowed long-term?',f:[['Costs','cost:pilot'],['Rules & permissions','policy:unclear']],fail:'pilot'}
];
const OUTS={study:['Study','Find out more before committing.'],reject:['Reject','It doesn’t fit here, for now.'],pilot:['Pilot','Test it small and measure.'],scale:['Scale','Expand what has already worked.']};
function viewLab(){
  return `<div data-room="research">
  <div class="band"><header class="wrap head rm-head">
    <p class="crumb"><a href="#home">duyanh</a> › research › lab</p>
    <p class="room-cat"><i class="dot"></i>Research · The Question Lab</p>
    <h1 id="main-h" tabindex="-1" class="rm-say">Can a smart waste system that works elsewhere work in Vietnam?</h1>
    <p class="lede">Since June 2026, mentored by Dr. Nisha Rawindaran of the University of South Wales, I have reviewed 40+ studies to find what these systems need in order to work, then proposed a framework for deciding what to do.</p>
    <div class="status"><span>Manuscript in preparation</span><span>V-SWAP: a proposal, not yet tested in the field</span></div>
  </header></div>
  <div class="wrap">
    <section class="rm-sec" aria-labelledby="lab-3"><h2 class="rm-h" id="lab-3">The project in three steps</h2>
      <ol class="three">
        <li><span class="three-n">1</span><b>The question</b><p>Smart bins, sensors and AI collection routes work in some cities. Would they work here?</p></li>
        <li><span class="three-n">2</span><b>What I did</b><p>A scoping review: mapping published research on AI- and IoT-enabled waste systems and the conditions they depend on.</p></li>
        <li id="vswap-sec" tabindex="-1"><span class="three-n">3</span><b>What I proposed</b><p>V-SWAP, the Vietnam Smart Waste Adaptation and Prioritization Framework. It turns six conditions into one of four decisions.</p>
          <span class="four"><i>Study</i><i>Pilot</i><i>Scale</i><i>Reject</i></span></li>
      </ol>
    </section>
    <section class="rm-sec" id="readiness" tabindex="-1" aria-labelledby="rx-h"><h2 class="rm-h" id="rx-h">The framework in action</h2>
      <div id="rx-mount"></div>
    </section>
    <section class="rm-sec tight" aria-label="Full research summary">
      <details class="rm-more"><summary>Read the full research summary</summary><div class="rm-more-in">
        <h3>In plain words</h3><p>Cities elsewhere use sensors, connected bins and AI to plan waste collection. My project reviews published work on these systems and asks what conditions would need to be in place before one could work in Vietnam. From that review I propose V-SWAP, to help decide whether to study, pilot, scale, or reject a system.</p><span class="draft-chip">Draft wording · confirm</span>
        <h3>The research question</h3><p>What does the published literature report about AI- and IoT-enabled smart waste management, and which implementation conditions should shape decisions about adapting it for Vietnam?</p><span class="draft-chip">Draft wording · match to manuscript</span>
        <h3>The approach</h3><p>A scoping review maps the range of existing research on a topic rather than testing one effect. It suits a question where the goal is to see what has been studied, and where the gaps are. Since June 2026, mentored by Dr. Nisha Rawindaran of the University of South Wales, I have reviewed 40+ studies found through Google Scholar, organising their findings, methods and recurring keywords in a literature matrix. I also compared existing decision-support frameworks and studies from developing countries.</p><span class="gap">Add from the manuscript: search dates and inclusion criteria.</span>
        <h3>Reported findings and my own contribution</h3><p>Organising these conditions into a decision framework for Vietnam (V-SWAP) is my own synthesis, not a finding of the reviewed studies.</p><span class="gap">Summarise findings from the evidence table, with citations.</span>
        <h3>Limits</h3><p>The framework comes from a literature review, so it reflects what has been published, not conditions measured on the ground in Vietnam. It has not been field-validated or evaluated with stakeholders, and it has no validated scoring weights or thresholds.</p><span class="gap">Add your planned next steps, for example stakeholder feedback.</span>
      </div></details>
    </section>
    ${whereNext([{to:'workshop',q:'How do we decide whether technology is useful in a real setting?'}],'research')}
  </div></div>`;
}
function mountReadiness(el){
  const st=[true,true,false];
  el.innerHTML=`<div class="vs" data-room="research">
    <div class="vs-top"><span class="demo-label">Illustrative example · not V-SWAP’s validated scoring</span><p class="vs-help">A neighbourhood wants smart bins. Tap a gate to answer <b>Yes</b> or <b>Not yet</b>, and watch where the decision goes.</p></div>
    <div class="vs-flow">
      <div class="vs-start"><span class="vs-n">Start</span><b>A neighbourhood wants smart bins</b></div>
      ${GATES.map((g,i)=>`<div class="vs-col" data-col="${i}"><span class="vs-line" data-seg="${i}"></span>
        <button type="button" class="vs-gate" data-gate="${i}" aria-pressed="${st[i]}"><span class="vs-n">Gate ${i+1}</span><b>${g.q}</b><span class="vs-f">${g.f.map(x=>x[0]).join(' · ')}</span><span class="vs-yn"></span></button>
        <span class="vs-drop" data-drop="${i}"></span>
        <div class="vs-out o-${g.fail}" data-out="${g.fail}"><b>${OUTS[g.fail][0]}</b><span>${OUTS[g.fail][1]}</span></div></div>`).join('')}
      <div class="vs-col end"><span class="vs-line" data-seg="3"></span><div class="vs-out o-scale" data-out="scale"><b>Scale</b><span>${OUTS.scale[1]}</span></div></div>
    </div>
    <div class="vs-result" aria-live="polite"></div></div>`;
  const draw=()=>{
    const fail=st.findIndex(v=>!v); const out=fail<0?'scale':GATES[fail].fail;
    $$('.vs-gate',el).forEach((b,i)=>{ b.setAttribute('aria-pressed',String(st[i])); b.classList.toggle('skip',fail>=0&&i>fail); $('.vs-yn',b).textContent=st[i]?'✓ Yes':'✕ Not yet'; });
    $$('.vs-line',el).forEach((l,i)=>l.classList.toggle('on',fail<0?true:i<=fail));
    $$('.vs-drop',el).forEach((d,i)=>d.classList.toggle('on',i===fail));
    $$('.vs-out',el).forEach(o=>o.classList.toggle('on',o.dataset.out===out));
    const asks=fail<0?[]:GATES[fail].f.map(([n,k])=>`<li><b>${n}:</b> ${RQ[k]}</li>`).join('');
    $('.vs-result',el).innerHTML=`<div class="vs-dec o-${out}"><span class="mini-k">Decision</span><b>${OUTS[out][0]}</b><span>${OUTS[out][1]}</span></div>
      <div class="vs-why">${fail<0?'<p>Every gate is open in this example. Scaling up would still depend on real results from a pilot.</p>':`<p class="mini-k">Stopped at gate ${fail+1}. Questions to answer first</p><ul class="mini-asks">${asks}</ul>`}</div>`;
  };
  el.addEventListener('click',e=>{ const b=e.target.closest('[data-gate]'); if(!b) return; const i=+b.dataset.gate; st[i]=!st[i]; draw(); });
  draw();
}

/* ===== Community ===== */
function viewCommon(){
  const r=ROOM.community;
  return `<div data-room="community">
  ${roomBand(r,'I share what I know, with children, older adults and younger students.',[['~200','children in six shelters'],['25','older adults in care homes'],['20+','volunteers I coordinate']])}
  <div class="wrap">
    <section class="nm" aria-labelledby="nm-h">
      <div class="nm-logo">
        <svg class="nm-ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="nm-c" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"/></defs><text><textPath href="#nm-c" textLength="524" lengthAdjust="spacing">NÉT MƠ · DREAM STROKES · YOUTH-LED STEAM ·</textPath></text></svg>
        <span class="nm-orbit" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <img src="img/netmo-logo.webp" width="368" height="368" alt="The Nét Mơ logo: a cheerful hand-drawn character holding a paintbrush under the colourful words “Nét Mơ”." decoding="async">
      </div>
      <div class="nm-body"><p class="rc-k">Activities · volunteers · fundraising</p>
        <h2 id="nm-h">Nét Mơ <small>Dream Strokes</small></h2>
        <p>A youth-led initiative bringing hands-on STEAM (science, technology, engineering, art and maths) learning to children in shelters, older adults in care homes, and the wider community.</p>
        <p class="cf-me"><b>My part:</b> As Head of Human Resources, I co-develop the activities and coordinate 20+ volunteers. We’ve reached about 200 children across six shelters, and 25 older adults through 8 care-home workshops.</p>
        <p class="spot-cta"><a class="rf-cta" href="#netmo">Read the full story →</a><a class="spot-ext" href="https://netmoproject.page/" target="_blank" rel="noopener">Website ↗</a><a class="spot-ext" href="https://www.instagram.com/netmow.prj/" target="_blank" rel="noopener">Instagram ↗</a></p>
      </div>
      <div class="nm-gal">
        ${zimg(PH.session)}${zimg(PH.care)}${zimg(PH.draw)}${zimg(PH.team)}
      </div>
    </section>
    <section class="rm-sec" aria-labelledby="cm-more"><h2 class="rm-h" id="cm-more">Also</h2>
      ${spot({id:'house-service',k:'Service learning · organising leader · logistics',line:'Annual workshops for 60–70 children from Hồng Quang Pagoda, run by 40+ volunteers.',
        main:{kind:'photo',label:'Setting up for service learning',ratio:'3/2'},
        strip:[{kind:'photo',label:'Materials we prepared',cap:'Materials'},{kind:'photo',label:'Volunteers on the day',cap:'Volunteers'},{kind:'photo',label:'The space, ready',cap:'The space'}],
        bullets:['First-aid, painting and craft workshops','Led logistics and 40+ volunteers across rotating stations','The children’s artwork was displayed at the pagoda']})}
      <div class="rgrid two" style="margin-top:8px">
        ${rcard('math-community',{k:'Peer mentoring',line:'Learning with peers and helping younger students get ready for maths competitions.',img:[PH.math.src,PH.math.w,PH.math.h,PH.math.alt]})}
        ${rcard('debate',{k:'Debate',line:'Team captain, 1st among 8 teams. The next year, the juniors I coached won too.',img:[PH.debate.src,PH.debate.w,PH.debate.h,PH.debate.alt]})}
      </div>
    </section>
    ${whereNext([{to:'replay',q:'Mentoring younger mathematicians grew out of my own competition practice.'},{to:'studio',q:'Coordinating volunteers and coordinating media use the same skill: getting everyone the right information.'}],'community')}
  </div></div>`;
}

/* ===== Media ===== */
function viewStudio(){
  const r=ROOM.media, it=ITEM['ha-media'];
  const hl=[['GEN 5','av'],['talent 26','#BFE3FF'],['httn 25’','#E9CFF0'],['talent 25’','#9CC8FF'],['GEN 4','av']];
  const frame=x=>x.src?`<figure class="fm"><div class="fm-b"><img src="${x.src}" width="${x.w}" height="${x.h}" alt="${esc(x.alt)}" loading="lazy" decoding="async"></div><figcaption>${esc(x.cap)}</figcaption></figure>`
    :`<div class="fm fm-slot">${slot(x.kind,x.label,'16/10')}</div>`;
  return `<div data-room="media">
  ${roomBand(r,'I help our work reach the people it’s for.',[['~15','people in the media team I lead'],['10+','posts'],['~10,000','average views per post']])}
  <div class="wrap">
    <section class="st-top" aria-labelledby="sp-ha-media">
      <div class="st-intro"><p class="rc-k">House Adventure Committee · Head of External Relations</p>
        <h2 class="spot-t" id="sp-ha-media">${it.title}</h2>
        <p class="spot-l">Telling the story of our events, and making sure the right people hear it.</p>
        <ul class="spot-b"><li>Lead a media team of about 15 people</li><li>10+ posts, averaging about 10,000 views and 300 likes each</li><li>Edited with DaVinci Resolve and Photoshop</li></ul>
        <p class="spot-cta"><a class="rf-cta" href="#${pageOf(it)}">Read the full story →</a><a class="spot-ext" href="https://www.instagram.com/feat_adventure/" target="_blank" rel="noopener">@feat_adventure ↗</a></p>
      </div>
      <div class="st-feed">
        <a class="ig" href="https://www.instagram.com/feat_adventure/" target="_blank" rel="noopener" aria-label="Our house’s Instagram, @feat_adventure: 79 posts and 1,585 followers (Nov 2026). Opens Instagram.">
          <span class="ig-top"><b>feat_adventure</b><i aria-hidden="true">···</i></span>
          <span class="ig-head"><span class="ig-av"><img src="img/ha-ig-avatar.webp" width="154" height="154" alt=""></span>
            <span class="ig-st"><span><b data-count="79">79</b>posts</span><span><b data-count="1585">1,585</b>followers</span><span><b>25</b>following</span></span></span>
          <span class="ig-bio"><b>whalesarewell</b>when there’s a whale, there’s a wave ⚓</span>
          <span class="ig-hl" aria-hidden="true">${hl.map(([t,c])=>`<span><i style="${c==='av'?'background-image:url(img/ha-ig-avatar.webp)':'background:'+c}"></i>${t}</span>`).join('')}</span>
          <span class="ig-grid"><img src="img/ha-ig-banner.webp" width="843" height="292" alt="" loading="lazy"></span>
        </a>
        <figure class="reel"><div class="reel-b"><img src="img/ha-reel.webp" width="855" height="480" alt="A still from our reel: two students at a classroom table, one watching a cartoon on a laptop during class." loading="lazy" decoding="async">
          <span class="reel-chip">Reel</span>
          <span class="reel-cap"><b>Using devices by the school rules</b><span>🎥 shez · ✍️ caption by me</span></span></div>
          <figcaption>A reel on our feed</figcaption></figure>
      </div>
    </section>
    <section class="rm-sec" aria-labelledby="st-stage"><h2 class="rm-h" id="st-stage">On stage, through my lens</h2>
      <div class="film">
        ${frame({kind:'video',label:'House Adventure event video'})}
        ${frame({src:'img/ha-vannghe.webp',w:1600,h:1066,alt:'Class A07 on stage at the school’s Hội thi Văn nghệ, in matching black A7 jerseys, holding up hand-painted signs reading “A07 chúc mừng 20/11” while a student plays guitar.',cap:'Hội thi Văn nghệ · 20/11 · 📷 me'})}
        ${frame({src:'img/ha-stage.webp',w:1600,h:1066,alt:'Students in white uniforms on stage at Văn nghệ Family, Lawrence S. Ting School, throwing colourful scarves into the air and cheering.',cap:'Văn nghệ Family · 📷 me'})}
        ${frame({kind:'photo',label:'Behind the scenes'})}
      </div>
    </section>
    <section class="rm-sec" aria-labelledby="st-more"><h2 class="rm-h" id="st-more">More from the studio</h2>
      <div class="rgrid">
        ${rcard('media-video',{k:'Video',line:'Video editing and storytelling.',slot:['video','A video I edited']})}
        ${rcard('media-scripts',{k:'Writing',line:'Scripts and storyboards behind our pieces.',slot:['scan','A script or storyboard page']})}
      </div>
    </section>
    ${whereNext([],'media')}
  </div></div>`;
}

/* ----- Item page ----- */
function storyView(it){
  const st=it.story; let n=0; const num=()=>String(++n).padStart(2,'0');
  const head=(k,gapOnly)=>`<div class="ss-head">${gapOnly?'':`<span class="ss-num">${num()}</span>`}<p class="ss-kick">${k}</p></div>`;
  const sec=[];
  // 1 pain point
  const p=st.pain;
  const card=(c,cls)=>`<div class="ba-card ${cls}"><h3>${esc(c.label)}</h3><ol>${c.steps.map(x=>`<li><span>${esc(x)}</span></li>`).join('')}</ol>${c.draft?'<span class="draft-chip">Draft wording · confirm</span>':''}</div>`;
  sec.push(`<section aria-label="The pain point">${head('The pain point')}<p class="ss-lead">${p.lead}</p>${p.gap?`<span class="gap">${p.gap}</span>`:''}
    ${p.before||p.after?`<div class="ba${p.before?'':' solo'}">${p.before?card(p.before,'ba-before')+'<span class="ba-arrow" aria-hidden="true">→</span>':''}${p.after?card(p.after,'ba-after'):''}</div>`:''}</section>`);
  // 2 idea + homepage
  const home=(it.media||[]).find(m=>m.src);
  sec.push(`<section aria-label="The idea">${head('The idea')}<div class="idea"><div><p class="ss-lead">${st.idea.lead}</p>
    <dl class="idea-pts">${st.idea.points.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
    ${home?`<div><p class="home-tag">The homepage</p>${ph(home)}</div>`:''}</div></section>`);
  // 3 features
  const RI=x=>typeof x==='string'?IMG(x):x;
  const withImg=st.features.filter(f=>f.img).map(f=>({...f,img:RI(f.img)})), noImg=st.features.filter(f=>!f.img);
  sec.push(`<section aria-label="Main features">${head('Main features')}
    ${withImg.length?`<div class="feats">${withImg.map((f,i)=>`<article class="feat${f.img.h/f.img.w>.8?' feat-tall':''}"><div class="feat-media">${ph({...f.img,ratio:f.img.w+'/'+f.img.h})}</div><div><p class="feat-n">Feature ${String(i+1).padStart(2,'0')}</p><h3>${esc(f.t)}</h3><p>${esc(f.d)}</p></div></article>`).join('')}</div>`:''}
    ${noImg.length?`<ul class="fgrid">${noImg.map(f=>`<li class="fcard"><span class="fi">${icon(f.ic||'i-spark')}</span><b>${esc(f.t)}</b><span>${esc(f.d)}</span></li>`).join('')}</ul>`:''}
    ${st.featureGap?`<p style="margin-top:14px"><span class="gap">${st.featureGap}</span></p>`:''}
    ${st.extras?`<div class="f-extras"><span>Also</span>${st.extras.map(x=>`<i>${esc(x)}</i>`).join('')}</div>`:''}</section>`);
  // 3b scene photo
  if(st.scene){ const sc=st.scene, si=RI(sc.img);
    sec.push(`<section aria-label="${esc(sc.title)}">${head(sc.title)}<div class="scene"><div>${si?ph({...si,ratio:si.w+'/'+si.h}):''}</div><div>${sc.text?`<p class="ss-lead">${sc.text}</p>`:''}${sc.gap?`<span class="gap">${sc.gap}</span>`:''}</div></div></section>`); }
  // 4 feedback
  if(st.feedback){ const f=st.feedback;
    sec.push(`<section aria-label="Feedback">${head(f.title||'Feedback from users')}<ul class="quotes" style="--qc:${Math.min(4,f.quotes.length)}">${f.quotes.map(q=>`<li><blockquote>${esc(q.q)}</blockquote><cite>${esc(q.who)}</cite></li>`).join('')}</ul>${f.note?`<p class="q-note">${esc(f.note)}</p>`:''}</section>`);
  } else if(st.feedbackGap){ sec.push(`<section class="gap-only" aria-label="Feedback">${head('Feedback from users',true)}<span class="gap">${st.feedbackGap}</span></section>`); }
  // 5 behind the build
  const pick=k=>{ const r=(it.sections||[]).find(x=>x[0]===k); return r?r[1]:null; };
  const beh=[['Challenge & iteration',pick('Challenge & iteration')],['Result',pick('Result')],['What I learned',pick('What I learned')]].filter(x=>x[1]&&!isGap(x[1]));
  if(beh.length) sec.push(`<section aria-label="Behind the build">${head('Behind the build')}<div class="behind">${beh.map(([k,v])=>`<div><h3>${k}</h3>${val(v)}</div>`).join('')}</div></section>`);
  const rm=ROOM[it.cat];
  return `<div data-room="${it.cat}">
  <div class="band"><header class="wrap head">
    ${backToResults()}
    <p class="crumb"><a href="#home">duyanh</a> › <a href="#${roomTok(it.cat)}">${it.cat}</a> › ${it.id}</p>
    <p class="room-cat"><i class="dot"></i>${CATLABEL[it.cat]} · ${rm?rm.name:''}</p>
    <h1 id="main-h" tabindex="-1">${it.title}</h1>
    <p class="lede">${it.summary}</p>
    <dl class="meta-dl"><dt>Type</dt><dd>${it.kind}${it.stack?' · '+it.stack:''}</dd><dt>My role</dt><dd>${it.role}</dd></dl>
    ${statRow(it.metrics)}
    ${liveLink(it)?`<p style="margin-top:4px">${liveLink(it).replace('class="open-link"','class="btn btn-line btn-sm"')}</p>`:''}
  </header></div>
  <div class="wrap"><div class="story-pg">${sec.join('')}
    <div class="s-links">${evidenceList(it.evidence)||'<div></div>'}<div>${rm?`<p><a class="btn btn-soft" href="#${rm.id}">← All of ${rm.name}</a></p>`:''}</div></div>
  </div></div></div>`;
}
/* ----- FCT and FUNiX pages ----- */
const FCT_STOPS=[
  {d:'Aug 2023',t:'Joined',s:'Mentor-guided programming, algorithms and advanced maths.'},
  {d:'Summer 2024',t:'Camp · IoT fire alarm',s:'2nd place. Sensors, Bluetooth and a buzzer.',to:'firealarm'},
  {d:'Summer 2026',t:'Camp · ScamCheck',s:'4th place. An AI scam checker for older users.',to:'scamcheck'},
  {d:'Jul 2026',t:'Graduated',s:'86 weeks of training. Final grade: A.'}
];
const FCT_HABITS=[['Patience','Stay with a hard problem'],['Independent reasoning','Try it myself first'],['Reflection','Write down what failed'],['Steady improvement','Bronze, then Silver']];
function pageHead(o){
  return `<div class="band"><header class="wrap head xp-head"><div class="nmp-id">
    ${backToResults()}
    <p class="crumb"><a href="#home">duyanh</a> › <a href="#${o.room}">${o.cat}</a> › ${o.id}</p>
    <p class="room-cat"><i class="dot"></i>${o.k}</p>
    <h1 id="main-h" tabindex="-1">${o.t} <small>${o.sub}</small></h1>
    <p class="lede">${o.lede}</p></div>${o.side||''}
  </header></div>`;
}
function viewFct(it){
  const rm=ROOM.build;
  return `<div data-room="build">
  ${pageHead({room:'workshop',cat:'build',id:'fct',k:'Build · '+rm.name,t:'FCT',sub:'FPT Software’s Computer Talents Club',lede:'A selective, tuition-free, three-year computer science programme.',side:`<span class="xp-turtle" aria-hidden="true">${turtle()}</span>`})}
  <div class="wrap">
    <dl class="sx-stats nmp-stats">${[['3 years','Aug 2023 – Jul 2026'],['86','weeks of training'],['A','final grade'],['2','summer camp placings']].map(([v,l])=>`<div><dt>${l}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <section class="nmp-sec" aria-labelledby="fct-walk"><h2 class="rm-h" id="fct-walk">Three years, at a tortoise’s pace</h2>
      <div class="tt" id="tt">
        <div class="tt-rail">${FCT_STOPS.map((_,i)=>`<i style="left:${(i/3*100).toFixed(2)}%"></i>`).join('')}<span class="tt-fill"></span><span class="tt-turtle">${turtle()}</span></div>
        <ol class="tt-stops">${FCT_STOPS.map((x,i)=>`<li><button type="button" data-tt="${i}" aria-pressed="${i===0}"><span class="tt-d">${x.d}</span><b>${x.t}</b></button></li>`).join('')}</ol>
        <div class="tt-card" aria-live="polite"></div>
      </div>
      <p class="qm-hint">Tap a stop and the turtle walks there.</p>
    </section>
    <section class="nmp-sec" aria-labelledby="fct-camp"><h2 class="rm-h" id="fct-camp">Two summer camps</h2>
      <div class="camps">
        <article class="camp">
          <div class="camp-ill ill-hw" aria-hidden="true">
            <span class="bb"></span>
            <svg class="wires" viewBox="0 0 220 120" preserveAspectRatio="none"><path d="M44 78 C44 30 120 14 156 40" stroke="#E8455B"/><path d="M68 78 C78 36 150 34 170 62" stroke="#4FB6E8"/><path d="M96 78 C108 48 176 54 192 84" stroke="#F6C343"/></svg>
            <span class="hw-led"></span><span class="hw-bz">${BUZZER}</span>
          </div>
          <div class="camp-body"><p class="camp-y">2024</p><p class="rc-k">Hardware · 2nd place</p><h3>IoT fire alarm</h3><p>Sensors, Bluetooth and a buzzer.</p>
            <div class="camp-act"><button type="button" class="btn btn-soft btn-sm" data-run>Run it</button><a href="#firealarm">See the project →</a></div></div>
        </article>
        <article class="camp">
          <div class="camp-ill ill-ai" aria-hidden="true">
            <span class="ai-bubble">You won a prize! Tap this link to claim it.</span>
            <span class="ai-check"><i></i><i></i><i></i><small>3 AI characters checking</small></span>
            <span class="ai-stamp">Likely scam</span>
          </div>
          <div class="camp-body"><p class="camp-y">2026</p><p class="rc-k">AI · 4th place</p><h3>ScamCheck</h3><p>An AI scam checker for older users.</p>
            <div class="camp-act"><button type="button" class="btn btn-soft btn-sm" data-run>Run it</button><a href="#scamcheck">See the project →</a></div></div>
        </article>
      </div>
      <p class="qm-hint">Illustrations. Tap “Run it” to see each one work.</p>
    </section>
    <section class="nmp-sec" aria-labelledby="fct-way"><h2 class="rm-h" id="fct-way">The Digital Age Tortoise</h2>
      <p class="sx-big">Technology moves fast. Real learning takes patience.</p>
      <ol class="fct-habits">${FCT_HABITS.map(([a,b],i)=>`<li><span class="fct-n">${i+1}</span><b>${a}</b><span>${b}</span></li>`).join('')}</ol>
    </section>
    <section class="nmp-sec xp-share" aria-labelledby="fct-sh">
      <div><p class="rc-k">Learning by Sharing</p><h2 id="fct-sh">Passing it on</h2><p>I wrote forum posts on algorithms and how I learn, for other members.</p></div>
      <button type="button" class="turtle-btn" data-tortoise>${turtle()}More about the tortoise</button>
    </section>
    <div class="s-links" style="margin-top:48px">${evidenceList(it.evidence)||'<div></div>'}<div><p><a class="btn btn-soft" href="#workshop">← All of ${rm.name}</a></p></div></div>
  </div></div>`;
}
function mountFct(){
  $$('[data-run]').forEach(b=>b.addEventListener('click',()=>{ const c=b.closest('.camp'); c.classList.remove('run'); void c.offsetWidth; c.classList.add('run'); clearTimeout(c._t); c._t=setTimeout(()=>c.classList.remove('run'),4600); }));
  const el=$('#tt'); if(!el) return; let cur=0, touched=false;
  const tt=$('.tt-turtle',el), fill=$('.tt-fill',el), card=$('.tt-card',el), dots=$$('.tt-rail i',el), btns=$$('[data-tt]',el);
  const go=(i,instant)=>{
    const p=(i/3*100).toFixed(2)+'%'; tt.classList.toggle('rev',i<cur);
    if(!instant&&!RM&&i!==cur){ tt.classList.add('moving'); setTimeout(()=>tt.classList.remove('moving'),1250); }
    tt.style.setProperty('--p',p); fill.style.setProperty('--p',p); cur=i;
    dots.forEach((d,j)=>d.classList.toggle('on',j<=i)); btns.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));
    const x=FCT_STOPS[i]; card.innerHTML=`<p><b>${x.d}.</b> ${x.s}</p>${x.to?`<a href="#${x.to}">See the project →</a>`:''}`;
  };
  el.addEventListener('click',e=>{ const b=e.target.closest('[data-tt]'); if(!b) return; touched=true; go(+b.dataset.tt); });
  go(0,true);
  if(RM||!('IntersectionObserver' in window)) return;
  const io=new IntersectionObserver(es=>{ if(es.some(x=>x.isIntersecting)){ io.disconnect(); if(touched) return; let i=0; const step=()=>{ if(touched||i>=3) return; i++; go(i); setTimeout(step,1500); }; setTimeout(step,500); } },{threshold:.6}); io.observe(el);
}
const FX_LAYERS=[['Web pages','HTML and CSS'],['Object-oriented programming','Organising code into objects'],['Memory in C','Managing memory by hand'],['Operating systems','How programs share one machine'],['Computer architecture','What the hardware actually does']];
function viewFunix(it){
  const rm=ROOM.build;
  return `<div data-room="build">
  ${pageHead({room:'workshop',cat:'build',id:'funix',k:'Build · '+rm.name,t:'FUNiX',sub:'FPT’s software engineering programme',lede:'Online, mentor-supported training in programming and computer systems. Since September 2025.'})}
  <div class="wrap">
    <section class="nmp-sec" aria-labelledby="fx-h"><h2 class="rm-h" id="fx-h">Every layer behind the screen</h2>
      <div class="fx">
        <p class="fx-end" aria-hidden="true">↑ What you see</p>
        <ol class="fx-stack" id="fx-stack">${FX_LAYERS.map(([a,b],i)=>`<li style="--i:${i}"><b>${a}</b><span>${b}</span></li>`).join('')}</ol>
        <p class="fx-end" aria-hidden="true">↓ The hardware</p>
      </div>
    </section>
    <section class="nmp-sec xp-share" aria-labelledby="fx-sh">
      <div><p class="rc-k">Sharing it</p><h2 id="fx-sh">Teaching friends to build their own portfolio sites</h2><p>I showed peers how to build and style a portfolio website with HTML and CSS.</p></div>
      <div class="fx-mock" aria-hidden="true"><div class="pf-bar"><i></i><i></i><i></i><span>my-portfolio.html</span></div><div class="fx-mock-in"><b></b><i class="w1"></i><i class="w2"></i><span><em></em><em></em><em></em></span></div></div>
    </section>
    <div class="s-links" style="margin-top:48px">${evidenceList(it.evidence)||'<div></div>'}<div><p><a class="btn btn-soft" href="#workshop">← All of ${rm.name}</a></p></div></div>
  </div></div>`;
}
function mountFunix(){
  const st=$('#fx-stack'); if(!st) return;
  if(RM||!('IntersectionObserver' in window)){ st.classList.add('on'); return; }
  st.classList.add('pre-in');
  const io=new IntersectionObserver(es=>{ if(es.some(x=>x.isIntersecting)){ io.disconnect(); st.classList.add('on'); } },{threshold:.3}); io.observe(st);
}
const BUZZER=`<svg viewBox="0 0 64 46" aria-hidden="true" focusable="false"><g class="fa-wave" fill="none" stroke="var(--term-acc)" stroke-width="3" stroke-linecap="round"><path d="M42 13q6 10 0 20"/><path d="M50 7q10 16 0 32"/></g><ellipse cx="18" cy="32" rx="16" ry="7" fill="#0c0c0c"/><rect x="2" y="13" width="32" height="19" fill="#1b1b1b"/><ellipse cx="18" cy="13" rx="16" ry="7" fill="#2e2e2e" stroke="#5a5a5a"/><circle cx="18" cy="13" r="2.6" fill="#000"/></svg>`;
const FLAME=`<svg viewBox="0 0 40 56" aria-hidden="true" focusable="false"><path d="M20 2C24 14 36 20 36 36a16 16 0 0 1-32 0c0-9 5-14 9-19 1 6 4 9 7 9-3-8-3-16 0-24z" fill="#FF7A1A"/><path d="M20 26c3 6 9 9 9 16a9 9 0 0 1-18 0c0-5 3-8 5-10 0 3 2 5 4 5-1-4-1-8 0-11z" fill="#FFD43B"/></svg>`;
function viewFirealarm(it){
  const rm=ROOM.build;
  return `<div data-room="build">
  ${pageHead({room:'workshop',cat:'build',id:'firealarm',k:'Build · '+rm.name,t:'IoT fire alarm',sub:'FCT Summer Camp 2024 · 2nd place',lede:'Sensors watch for fire. A buzzer, lights and Bluetooth raise the alarm.',side:`<span class="fa-hero" aria-hidden="true"><span class="fa-hf">${FLAME}</span><span class="fa-hb">${BUZZER}</span></span>`})}
  <div class="wrap">
    <dl class="sx-stats nmp-stats">${[['2nd','FCT Summer Camp 2024'],['Sensors','to detect'],['Buzzer + LEDs','to warn'],['Bluetooth','to notify']].map(([v,l])=>`<div><dt>${l}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <section class="nmp-sec" aria-labelledby="sim-h"><h2 class="rm-h" id="sim-h">Try it · set off the alarm</h2>
      <div class="sim" id="sim" style="--lv:0;--fx:.45">
        <div class="sim-room" role="group" aria-label="A room with a smoke sensor. Drag the match into the room, or tap the floor, to start a fire.">
          <span class="sim-sensor" aria-hidden="true"><i></i><i></i><b>Sensor</b></span>
          <span class="sim-smoke" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
          <span class="sim-flame" aria-hidden="true">${FLAME}</span>
          <span class="sim-spray" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span class="sim-board" aria-hidden="true"><i class="led"></i><i class="led"></i><span class="fa-bz">${BUZZER}</span></span>
          <span class="sim-phone" aria-hidden="true"><span class="sim-note"><b>Fire alarm!</b><small>via Bluetooth</small></span></span>
          <span class="sim-floor" aria-hidden="true"></span>
          <button type="button" class="sim-match" aria-label="Light a match and drop it in the room"><span class="sim-tag">Drag me</span><svg viewBox="0 0 16 70" aria-hidden="true"><rect x="5.5" y="12" width="5" height="56" rx="2" fill="#E0B47A" stroke="#7a5426" stroke-width="1.2"/><ellipse cx="8" cy="11" rx="6" ry="8.5" fill="#D0302A" stroke="#7a1a16" stroke-width="1.2"/></svg></button>
        </div>
        <div class="sim-ctl">
          <span class="demo-label">Simulation</span>
          <p class="sim-lab">Sensor reading</p>
          <div class="sim-gauge" aria-hidden="true"><span class="sim-fill"></span><span class="sim-thr"></span></div>
          <p class="sim-read"><span>Smoke <b id="sim-v">0</b></span><span>Alarm at 60</span></p>
          <ol class="fa-flow"><li><b>Sense</b><span>Sensors read the room</span></li><li><b>Decide</b><span>The code checks the reading</span></li><li><b>Alert</b><span>Buzzer, LEDs, Bluetooth</span></li></ol>
          <p class="sim-status" aria-live="polite">All clear. Drag the match into the room.</p>
          <div class="sim-btns"><button type="button" class="btn btn-primary btn-sm" data-sim="fire">Light a fire</button><button type="button" class="btn btn-line btn-sm" data-sim="out">Use the extinguisher</button></div>
        </div>
      </div>
    </section>
    <section class="nmp-sec" aria-labelledby="fa-real"><h2 class="rm-h" id="fa-real">The real thing</h2>
      <div class="fct-camp">${ph(it.media[1])}${ph({...it.media[0],ratio:'4/5'})}</div>
    </section>
    <p class="gap-only" style="margin-top:24px"><span class="gap">Add your part of the build, and one problem you debugged.</span></p>
    <div class="s-links" style="margin-top:48px">${evidenceList(it.evidence)||'<div></div>'}<div><p><a class="btn btn-soft" href="#workshop">← All of ${rm.name}</a></p></div></div>
  </div></div>`;
}
function mountFirealarm(){
  const sim=$('#sim'); if(!sim) return;
  const room=$('.sim-room',sim), match=$('.sim-match',sim), spray=$('.sim-spray',sim), v=$('#sim-v',sim), st=$('.sim-status',sim), fl=$$('.fa-flow li',sim);
  let lv=0, burning=false, raf=null, last=0;
  const paint=()=>{ const n=Math.round(lv); v.textContent=n; sim.style.setProperty('--lv',(lv/100).toFixed(3));
    const on=n>=60; sim.classList.toggle('alarm',on); sim.classList.toggle('burning',burning);
    fl[0].classList.toggle('on',n>0); fl[1].classList.toggle('on',n>=35); fl[2].classList.toggle('on',on);
    st.textContent=on?'Fire detected! Buzzer on, LEDs flashing, phone notified.':burning?(n<30?'Something’s burning…':'Smoke is reaching the sensor…'):n>0?'Fire’s out. Clearing the smoke…':'All clear. Drag the match into the room.';
  };
  const tick=t=>{ const dt=Math.min(.1,(t-(last||t))/1000); last=t;
    lv=burning?Math.min(100,lv+dt*(lv<20?14:24)):Math.max(0,lv-dt*30); paint();
    raf=(burning||lv>0)?requestAnimationFrame(tick):null; if(!raf) last=0; };
  const run=()=>{ if(RM){ lv=burning?92:0; paint(); return; } if(!raf){ last=0; raf=requestAnimationFrame(tick); } };
  const ignite=x=>{ x=Math.min(.66,Math.max(.12,x)); sim.style.setProperty('--fx',x.toFixed(3)); sim.style.setProperty('--dx',Math.round((.5-x)*room.clientWidth)+'px'); burning=true; run(); };
  const extinguish=()=>{ if(!burning&&lv===0) return; burning=false; spray.classList.remove('on'); void spray.offsetWidth; spray.classList.add('on'); run(); };
  // drag the match
  let drag=null;
  match.addEventListener('pointerdown',e=>{ e.preventDefault(); match.setPointerCapture(e.pointerId); drag={x:e.clientX,y:e.clientY}; match.classList.add('drag'); });
  match.addEventListener('pointermove',e=>{ if(drag) match.style.transform=`translate(${e.clientX-drag.x}px,${e.clientY-drag.y}px) rotate(-20deg)`; });
  const drop=e=>{ if(!drag) return; const moved=Math.hypot(e.clientX-drag.x,e.clientY-drag.y); drag=null; match.classList.remove('drag'); match.style.transform='';
    const R=room.getBoundingClientRect(); if(moved<6){ ignite(.45); return; }
    if(e.clientX>R.left&&e.clientX<R.right&&e.clientY>R.top&&e.clientY<R.bottom) ignite((e.clientX-R.left)/R.width); };
  match.addEventListener('pointerup',drop); match.addEventListener('pointercancel',()=>{ drag=null; match.classList.remove('drag'); match.style.transform=''; });
  match.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); ignite(.45); } });
  room.addEventListener('click',e=>{ if(e.target.closest('.sim-match')) return; const R=room.getBoundingClientRect(); if(e.clientY>R.top+R.height*.45) ignite((e.clientX-R.left)/R.width); });
  sim.addEventListener('click',e=>{ const b=e.target.closest('[data-sim]'); if(!b) return; if(b.dataset.sim==='fire') ignite(.45); else extinguish(); });
  paint();
}
/* ----- Nét Mơ page ----- */
function nmLogo(id){ return `<div class="nm-logo"><svg class="nm-ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="${id}" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"/></defs><text><textPath href="#${id}" textLength="524" lengthAdjust="spacing">NÉT MƠ · DREAM STROKES · YOUTH-LED STEAM ·</textPath></text></svg><span class="nm-orbit" aria-hidden="true"><i></i><i></i><i></i><i></i></span><img src="img/netmo-logo.webp" width="368" height="368" alt="The Nét Mơ logo: a cheerful hand-drawn character holding a paintbrush under the colourful words “Nét Mơ”." decoding="async"></div>`; }
function viewNetmo(it){
  const rm=ROOM.community;
  return `<div data-room="community" class="nmp">
  <div class="band"><header class="wrap head nmp-head">
    <div class="nmp-id">
      ${backToResults()}
      <p class="crumb"><a href="#home">duyanh</a> › <a href="#common">community</a> › netmo</p>
      <p class="room-cat"><i class="dot"></i>Community · ${rm.name}</p>
      <h1 id="main-h" tabindex="-1">Nét Mơ <small>Dream Strokes</small></h1>
      <p class="lede">Youth-led STEAM workshops for children in shelters and older adults in care homes.</p>
      <p class="nmp-role"><b>My role</b>Head of Human Resources · since April 2026</p>
      <p class="nmp-cta"><a class="btn btn-primary btn-sm" href="https://netmoproject.page/" target="_blank" rel="noopener">${icon('i-globe')}Website ↗</a><a class="btn btn-line btn-sm" href="https://www.instagram.com/netmow.prj/" target="_blank" rel="noopener">${icon('i-camera')}Instagram ↗</a></p>
    </div>
    ${nmLogo('nm-c3')}
  </header></div>
  <div class="wrap">
    <dl class="sx-stats nmp-stats">${[['~200','children'],['6','shelters'],['25','older adults'],['20+','volunteers I coordinate'],['~70M ₫','raised (net)']].map(([v,l])=>`<div><dt>${l}</dt><dd>${v}</dd></div>`).join('')}</dl>

    <section class="nmp-sec" aria-labelledby="nm-reach"><h2 class="rm-h" id="nm-reach">Who we reach</h2>
      <div class="nmp-two">
        <article class="nmp-card">
          <p class="rc-k">Six shelters</p><h3>Children</h3>
          <p>Hands-on art, building and simple engineering.</p>
          <div class="meter" data-meter>
            <p class="meter-k">Children taking part</p>
            <div class="meter-row"><span>At first</span><i><b style="--w:50%"></b></i><em>~50%</em></div>
            <div class="meter-row"><span>Now</span><i><b style="--w:97%"></b></i><em>~100%</em></div>
          </div>
        </article>
        <article class="nmp-card">
          <p class="rc-k">Two care homes</p><h3>Older adults</h3>
          <p>8 workshops for 25 older adults: fingerprint painting and group flower canvases.</p>
          <div class="strip s2">${zimg(PH.care)}${zimg(PH.draw)}</div>
        </article>
      </div>
    </section>

    <section class="nmp-sec" aria-labelledby="nm-city"><h2 class="rm-h" id="nm-city">Try a session · Build your city</h2>
      <div class="city-intro">
        <p class="sx-big">Children made their own characters and city from cardboard, then used engineering and technology to make it better.</p>
        ${zimg(PH.session)}
      </div>
      <div class="city" id="city"></div>
    </section>

    <section class="nmp-sec" aria-labelledby="nm-me"><h2 class="rm-h" id="nm-me">My part</h2>
      <div class="nmp-me-wrap">
        <ul class="nmp-me">
          <li><span class="nmp-ic">${icon('i-spark')}</span><b>Design</b><span>Co-develop the STEAM activities</span></li>
          <li><span class="nmp-ic">${icon('i-room')}</span><b>People</b><span>Coordinate 20+ volunteers: facilitation, materials, timing</span></li>
          <li><span class="nmp-ic">${icon('i-cal')}</span><b>Record</b><span>Keep our journal in <a href="#together">Together!</a></span></li>
        </ul>
        ${zimg(PH.team)}
      </div>
    </section>

    <section class="nmp-sec nmp-pitch" aria-labelledby="nm-pitch">
      <div><p class="rc-k">Fundraising</p><h2 id="nm-pitch">Colors of the Pitch</h2><p>A football event I co-managed, part of the fundraising for our workshops and partners.</p></div>
      <dl class="nmp-pitch-n"><div><dt>teams</dt><dd>10</dd></div><div><dt>spectators</dt><dd>1,000+</dd></div><div><dt>raised in all, net</dt><dd>~70M ₫</dd></div></dl>
    </section>

    <p class="gap-only" style="margin-top:28px"><span class="gap">Add a one-line reflection in your own words.</span></p>
    <div class="s-links" style="margin-top:48px">${evidenceList(it.evidence)}<div><p><a class="btn btn-soft" href="#common">← All of ${rm.name}</a></p></div></div>
  </div></div>`;
}
const CITY_P={house:'House',school:'School',tree:'Tree',flower:'Flower',heart:'Heart'};
const CITY_T={solar:'Solar roofs',lights:'Street lights',wind:'Wind turbine',recycle:'Recycling bins'};
const CITY_SHIRT=['#E8455B','#4FB6E8','#7BC67E','#F6C343'];
const CITY_HAT=[['hard','Hard hat'],['cap','Cap'],['none','No hat']];
function citySVG(st,part){
  const K='#2b2320', sw='stroke="'+K+'" stroke-width="3" stroke-linejoin="round"';
  const LOTS=[150,235,320,405,490], WOB=[-3,2,-1,3,-2], GY=262;
  const bin=st.tech.recycle?`<g transform="translate(30,0)"><rect x="-6" y="-17" width="13" height="17" rx="2" fill="#1E7B52" ${sw}/><path d="M-8 -18h17" stroke="${K}" stroke-width="3" stroke-linecap="round"/><path d="M-2 -10l2 -3 2 3" fill="none" stroke="#fff" stroke-width="1.6"/></g>`:'';
  const P={
    house:()=>`<rect x="-28" y="-50" width="56" height="50" rx="2" fill="#F6C343" ${sw}/><path d="M-36 -48 L0 -80 L36 -48 Z" fill="#E8455B" ${sw}/><rect x="-7" y="-24" width="14" height="24" fill="#9A5B2B" stroke="${K}" stroke-width="2.5"/><rect x="-22" y="-42" width="12" height="12" fill="#CFEAFF" stroke="${K}" stroke-width="2.5"/>`+(st.tech.solar?`<g transform="translate(18,-64) rotate(41.6)"><rect x="-13" y="-10" width="26" height="9" fill="#2D5E8C" stroke="${K}" stroke-width="2"/><path d="M-4 -10v9M5 -10v9" stroke="#9EC6EA" stroke-width="1.5"/></g>`:'')+bin,
    school:()=>`<rect x="-40" y="-60" width="80" height="60" rx="2" fill="#4FB6E8" ${sw}/><rect x="-8" y="-26" width="16" height="26" fill="#9A5B2B" stroke="${K}" stroke-width="2.5"/>${[-30,-6,18].map(x=>`<rect x="${x}" y="-50" width="12" height="12" fill="#CFEAFF" stroke="${K}" stroke-width="2.5"/>`).join('')}<path d="M-30 -60V-96" stroke="${K}" stroke-width="3"/><rect x="-30" y="-96" width="24" height="15" fill="#DA251D" stroke="${K}" stroke-width="2"/><path d="M-18 -92.5l1.2 3.4h3.5l-2.8 2.1 1 3.4-2.9-2-2.9 2 1-3.4-2.8-2.1h3.5z" fill="#FFDD00"/>`+(st.tech.solar?`<g><rect x="2" y="-70" width="32" height="8" fill="#2D5E8C" stroke="${K}" stroke-width="2"/><path d="M12 -70v8M23 -70v8" stroke="#9EC6EA" stroke-width="1.5"/></g>`:'')+bin,
    tree:()=>`<rect x="-6" y="-32" width="12" height="32" fill="#9A5B2B" ${sw}/><circle cy="-52" r="25" fill="#7BC67E" ${sw}/><circle cx="-8" cy="-58" r="4" fill="#E8455B"/><circle cx="9" cy="-47" r="4" fill="#E8455B"/>`,
    flower:()=>`<path d="M0 0V-34" stroke="#2F7D3B" stroke-width="4"/><path d="M0 -14q-12 -2 -14 -12q11 0 14 10" fill="#7BC67E" stroke="${K}" stroke-width="2"/>${[0,72,144,216,288].map(a=>`<circle cx="${(Math.cos(a*Math.PI/180)*9).toFixed(1)}" cy="${(-44+Math.sin(a*Math.PI/180)*9).toFixed(1)}" r="7" fill="#E8455B" stroke="${K}" stroke-width="2"/>`).join('')}<circle cy="-44" r="6" fill="#F6C343" stroke="${K}" stroke-width="2"/>`,
    heart:()=>`<path d="M0 0V-30" stroke="${K}" stroke-width="3"/><path d="M0 -30 C-24 -46 -20 -72 0 -60 C20 -72 24 -46 0 -30 Z" fill="#E8455B" ${sw}/>`
  };
  const pieces=st.lots.map((k,i)=>k?`<g class="city-lot" transform="translate(${LOTS[i]},${GY}) rotate(${WOB[i]})" role="button" tabindex="0" data-lot="${i}" aria-label="Remove the ${CITY_P[k].toLowerCase()}"><g class="${st.pop===i?'pop':''}">${P[k]()}</g></g>`:`<g transform="translate(${LOTS[i]},${GY})" aria-hidden="true"><path d="M-22 -2h44" stroke="${K}" stroke-width="2" stroke-dasharray="4 5" opacity=".35"/></g>`).join('');
  const lamps=st.tech.lights?[192,277,362,447].map(x=>`<g transform="translate(${x},${GY})"><circle cx="9" cy="-56" r="17" fill="#FFE27A" opacity=".45" class="city-glow"/><path d="M0 0V-62h9" fill="none" stroke="${K}" stroke-width="3"/><circle cx="9" cy="-56" r="5.5" fill="#FFE27A" stroke="${K}" stroke-width="2"/></g>`).join(''):'';
  const wind=st.tech.wind?`<g><path d="M562 ${GY}L566 160h4l4 ${GY-160}" fill="#fff" ${sw}/><g class="rotor">${[0,120,240].map(a=>`<path transform="rotate(${a} 568 158)" d="M568 158 C 562 140 564 120 568 112 C 573 122 574 140 568 158Z" fill="#fff" stroke="${K}" stroke-width="2.5"/>`).join('')}<circle cx="568" cy="158" r="5" fill="#F6C343" stroke="${K}" stroke-width="2"/></g></g>`:'';
  const hat=st.hat==='hard'?`<path d="M-18 -94 A18 17 0 0 1 18 -94 Z" fill="#F6C343" ${sw}/><rect x="-23" y="-96" width="46" height="6" rx="3" fill="#F6C343" ${sw}/>`:st.hat==='cap'?`<path d="M-16 -94 A16 15 0 0 1 16 -94 Z" fill="#4FB6E8" ${sw}/><path d="M10 -95h17" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`:'';
  const kid=`<g transform="translate(72,306) scale(1.12)"><rect x="-12" y="-30" width="9" height="30" rx="3" fill="#2D5E8C" ${sw}/><rect x="3" y="-30" width="9" height="30" rx="3" fill="#2D5E8C" ${sw}/><path d="M-17 -58 L-29 -36" stroke="${K}" stroke-width="6" stroke-linecap="round"/><path d="M17 -58 L31 -80" stroke="${K}" stroke-width="6" stroke-linecap="round"/><rect x="-17" y="-66" width="34" height="38" rx="9" fill="${CITY_SHIRT[st.shirt]}" ${sw}/><circle cy="-84" r="16" fill="#F2C9A0" ${sw}/><path d="M-16 -86 Q-14 -104 0 -102 Q14 -104 16 -86 Q8 -94 0 -92 Q-8 -94 -16 -86Z" fill="${K}"/><circle cx="-5.5" cy="-84" r="2.2" fill="${K}"/><circle cx="5.5" cy="-84" r="2.2" fill="${K}"/><path d="M-5 -77 Q0 -72 5 -77" fill="none" stroke="${K}" stroke-width="2" stroke-linecap="round"/>${hat}</g>`;
  if(part) return {wind,lamps,pieces,kid}[part];
  const hatch=Array.from({length:60},(_,i)=>`M${i*10+4} ${GY+6}v${36+(i%3)*4}`).join('');
  return `<svg viewBox="0 0 600 330" role="img" aria-label="${esc(cityDesc(st))}">
    <defs><pattern id="corr" width="7" height="330" patternUnits="userSpaceOnUse"><rect width="7" height="330" fill="#CFA56C"/><rect width="2" height="330" fill="#C19559"/></pattern></defs>
    <rect width="600" height="330" fill="url(#corr)"/>
    <g aria-hidden="true"><circle cx="300" cy="58" r="22" fill="#F6C343" stroke="${K}" stroke-width="2.5"/>${[0,45,90,135,180,225,270,315].map(a=>`<path transform="rotate(${a} 300 58)" d="M300 26v-12" stroke="#F6C343" stroke-width="4" stroke-linecap="round"/>`).join('')}
    <path d="M70 72q6 -18 24 -12q10 -14 26 -2q16 -2 14 14z" fill="#fff" stroke="${K}" stroke-width="2.5"/><path d="M420 60q6 -16 22 -10q10 -12 24 0q14 0 12 12z" fill="#fff" stroke="${K}" stroke-width="2.5"/>
    <rect x="0" y="${GY}" width="600" height="${330-GY}" fill="#7BC67E" opacity=".9"/><path d="M0 ${GY}H600" stroke="${K}" stroke-width="3"/><path d="${hatch}" stroke="#3E9A57" stroke-width="2.5" stroke-linecap="round"/></g>
    <g id="c-wind">${wind}</g><g id="c-lamps">${lamps}</g><g id="c-lots">${pieces}</g><g id="c-kid">${kid}</g>
  </svg>`;
}
function cityDesc(st){
  const n=st.lots.filter(Boolean), t=Object.keys(CITY_T).filter(k=>st.tech[k]);
  return `A cardboard city with ${n.length?n.map(k=>CITY_P[k].toLowerCase()).join(', '):'an empty street'}${t.length?', plus '+t.map(k=>CITY_T[k].toLowerCase()).join(', '):''}.`;
}
function mountCity(el){
  if(!el) return;
  const fresh=()=>({shirt:1,hat:'hard',lots:['house','tree','school',null,null],tech:{solar:false,lights:false,wind:false,recycle:false},pop:-1});
  let st=fresh();
  const status=()=>{ const n=st.lots.filter(Boolean).length, t=Object.values(st.tech).filter(Boolean).length;
    return n===5&&t===4?'A whole city, built better. That’s the session.':`${n} of 5 lots built · ${t} of 4 technologies added`; };
  const ctl=()=>`<div class="city-step"><p class="city-k"><span>1</span>Make your character</p>
        <div class="city-row" role="group" aria-label="Shirt colour">${CITY_SHIRT.map((c,i)=>`<button type="button" class="city-sw" data-shirt="${i}" aria-pressed="${st.shirt===i}" aria-label="Shirt colour ${i+1}" style="--c:${c}"></button>`).join('')}</div>
        <div class="city-row" role="group" aria-label="Hat">${CITY_HAT.map(([k,l])=>`<button type="button" class="city-chip" data-hat="${k}" aria-pressed="${st.hat===k}">${l}</button>`).join('')}</div></div>
      <div class="city-step"><p class="city-k"><span>2</span>Build</p>
        <div class="city-row">${Object.entries(CITY_P).map(([k,l])=>`<button type="button" class="city-chip add" data-add="${k}">+ ${l}</button>`).join('')}</div>
        <p class="city-hint">Tap a building on the board to remove it.</p></div>
      <div class="city-step"><p class="city-k"><span>3</span>Add technology</p>
        <div class="city-row">${Object.entries(CITY_T).map(([k,l])=>`<button type="button" class="city-chip tech" data-tech="${k}" aria-pressed="${st.tech[k]}">${st.tech[k]?'✓ ':''}${l}</button>`).join('')}</div></div>
      <div class="city-foot"><p class="city-status" aria-live="polite">${status()}</p><button type="button" class="btn btn-ghost btn-sm" data-city-reset>Start over</button></div>`;
  const PART={lots:'pieces',kid:'kid',wind:'wind',lamps:'lamps'};
  const draw=parts=>{
    if(!parts||!el.querySelector('.city-board')){ el.innerHTML=`<div class="city-board">${citySVG(st)}</div><div class="city-ctl">${ctl()}</div>`; }
    else {
      parts.forEach(k=>{ const g=el.querySelector('#c-'+k); if(g) g.innerHTML=citySVG(st,PART[k]); });
      el.querySelector('.city-board svg').setAttribute('aria-label',cityDesc(st));
      el.querySelector('.city-ctl').innerHTML=ctl();
    }
    st.pop=-1;
  };
  const act=t=>{
    const b=t.closest('[data-shirt],[data-hat],[data-add],[data-tech],[data-city-reset],[data-lot]'); if(!b) return;
    const d=b.dataset; let focus=null, parts=null;
    if(d.shirt!=null){ st.shirt=+d.shirt; focus=`[data-shirt="${d.shirt}"]`; parts=['kid']; }
    else if(d.hat){ st.hat=d.hat; focus=`[data-hat="${d.hat}"]`; parts=['kid']; }
    else if(d.add){ const i=st.lots.indexOf(null); if(i<0){ el.querySelector('.city-status').textContent='The street is full. Tap a building to remove it.'; return; } st.lots[i]=d.add; st.pop=i; focus=`[data-add="${d.add}"]`; parts=['lots']; }
    else if(d.tech){ const k=d.tech; st.tech[k]=!st.tech[k]; focus=`[data-tech="${k}"]`; parts=[k==='lights'?'lamps':k==='wind'?'wind':'lots']; }
    else if(d.lot!=null){ st.lots[+d.lot]=null; focus='[data-add="house"]'; parts=['lots']; }
    else { st=fresh(); focus='[data-add="house"]'; }
   
    draw(parts); const f=focus&&el.querySelector(focus); if(f) f.focus({preventScroll:true});
  };
  el.addEventListener('click',e=>act(e.target));
  el.addEventListener('keydown',e=>{ if((e.key==='Enter'||e.key===' ')&&e.target.closest('[data-lot]')){ e.preventDefault(); act(e.target); } });
  draw();
}
function mountNetmo(){
  mountCity($('#city'));
  const m=$('[data-meter]'); if(!m) return;
  if(RM||!('IntersectionObserver' in window)){ m.classList.add('on'); return; }
  const io=new IntersectionObserver(es=>{ if(es.some(x=>x.isIntersecting)){ io.disconnect(); m.classList.add('on'); } },{threshold:.5}); io.observe(m);
}
function viewItem(it){
  if(it.id==='netmo') return viewNetmo(it);
  if(it.id==='fct') return viewFct(it);
  if(it.id==='funix') return viewFunix(it);
  if(it.id==='firealarm') return viewFirealarm(it);
  if(it.story) return storyView(it);
  const meta=[['Type',it.kind],['My role',it.role]];
  const main = `<section aria-labelledby="cs-h"><h2 id="cs-h" class="block-h">${it.layout==='chain'?'Setting → responsibility → reflection':it.cat==='media'?'About this piece':'Case study'}</h2>${fields(it.sections,it.layout)}</section>`;
  const realMedia=(it.media||[]).filter(m=>m.src).map(ph).join('');
  const media=(it.media||[]).filter(m=>!m.src).map(ph).join('');
  return `<div data-room="${it.cat}">
  <div class="band"><header class="wrap head">
    ${backToResults()}
    <p class="crumb"><a href="#home">duyanh</a> › <a href="#${roomTok(it.cat)}">${it.cat}</a> › ${it.id}</p>
    <p class="room-cat"><i class="dot"></i>${CATLABEL[it.cat]} · ${ROOM[it.cat]?ROOM[it.cat].name:''}</p>
    <h1 id="main-h" tabindex="-1">${it.title}</h1>
    <p class="lede">${it.summary}</p>
    <dl class="meta-dl">${meta.filter(m=>m[1]!=null&&m[1]!=='').map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
  </header></div>
  <div class="wrap"><div class="item-grid">
    <div class="item-main">
      ${realMedia?`<section aria-label="Screenshots">${realMedia}</section>`:''}
      ${main}
      ${media?`<section aria-label="Media">${media}</section>`:''}
    </div>
    <aside class="item-side" aria-label="Evidence and connections">
      ${metricsBlock(it.metrics)}
      ${(it.metrics||[]).every(m=>!m.value)&&it.cat==='build'&&it.kind==='Product'?'<div class="gap-only"><p class="side-h">Usage</p><span class="gap">Usage metrics appear here once current values are added to this record.</span></div>':''}
      ${evidenceList(it.evidence)}
      ${ROOM[it.cat]?`<a class="btn btn-soft" href="#${ROOM[it.cat].id}">← All of ${ROOM[it.cat].name}</a>`:''}
    </aside>
  </div></div></div>`;
}

/* ----- About ----- */
function viewAbout(){
  const steps=[
    ['awards','Advanced mathematics','Competition practice that taught me to attempt problems on my own first.','imocsea','The IMOCSEA journey'],
    ['build','FPT Software’s Computer Talents Club','Mentor-guided programming, algorithms and hackathons.','fct','About FCT'],
    ['build','FUNiX','Technical training in C, OOP, web development, computer architecture and operating systems.','funix','About the training'],
    ['build','Projects','Contextuary, Together!, ScamCheck and an IoT fire alarm, built with teammates.','workshop','The Workshop'],
    ['research','Research','Asking whether smart waste systems can work in Vietnam.','lab','The Question Lab'],
    ['community','Community','Teaching children, mentoring younger students, and debate.','common','The Common Room']
  ];
  return `<div data-room="about">
  <div class="band"><header class="wrap head">
    <p class="crumb"><a href="#home">duyanh</a> › about</p>
    <p class="room-cat"><i class="dot"></i>About</p>
    <h1 id="main-h" tabindex="-1">About Duy Anh</h1>
    <p class="lede">I’m Trần Duy Anh, a student in Ho Chi Minh City. I’m interested in computer science, AI, and practical problem-solving: what happens when a working idea has to meet real people and real constraints.</p>
  </header></div>
  <div class="wrap">
    <div class="profile block">
      <section class="card" aria-labelledby="pf-h">
        <h2 id="pf-h" class="side-h">Profile</h2>
        <dl class="meta-dl" style="font-size:16px;gap:10px 22px">
          <dt>Name</dt><dd>${PROFILE.name}</dd>
          <dt>School</dt><dd>${PROFILE.school}</dd>
          <dt>City</dt><dd>${PROFILE.city}</dd>
          <dt>Class of</dt><dd>${PROFILE.classOf}</dd>
          <dt>Interests</dt><dd>${PROFILE.interests.join(', ')}</dd>
        </dl>
        ${PROFILE.cv?`<p style="margin-top:16px"><a class="btn btn-line btn-sm" href="${esc(PROFILE.cv.url)}" target="_blank" rel="noopener">${esc(PROFILE.cv.label)} ↗</a></p>`:'<p class="gap-only" style="margin-top:16px"><span class="gap">CV not yet provided. The CV link appears in the navigation once a file is added.</span></p>'}
        ${contactBlock()}
      </section>
      <section class="tort" aria-labelledby="tt-h">
        ${turtle('big')}
        <div style="display:grid;gap:10px">
          <h2 id="tt-h" style="font-size:22px">A small turtle, on purpose</h2>
          <p style="color:var(--ink-2)">It appears across this site as a reminder of how I try to learn.</p>
          <button type="button" class="turtle-btn" data-tortoise style="justify-self:start">Learn about the Digital Age Tortoise</button>
        </div>
      </section>
    </div>
    <section class="block" aria-labelledby="jr-h">
      <h2 id="jr-h"><span id="journey-anchor" tabindex="-1">My learning journey</span></h2>
      <p class="intro">How the pieces connect, from mathematics to the people I work with.</p>
      <ol class="journey">${steps.map(([cat,t,d,to,l])=>`<li data-room="${cat}"><div><b>${t}</b><span>${d}</span><br><a href="#${to}">${l} →</a></div></li>`).join('')}</ol>
    </section>
    <section class="block" aria-labelledby="log-h">
      <h2 id="log-h">The changelog</h2>
      <p class="intro">The same story, written the way a developer reads history. Newest first; each line opens its page.</p>
      ${gitlogHTML()}
    </section>
  </div></div>`;
}

/* ----- Results ----- */
function viewResults(){
  return `<div class="wrap results"><h1 id="main-h" class="vh" tabindex="-1">Search results for ${esc(S.q)}</h1><div id="res-area">${resultsArea()}</div></div>`;
}
function resultsArea(){
  const t0=performance.now(); const all=runSearch(S.q); const ms=performance.now()-t0;
  const counts={all:all.length}; CATS.forEach(c=>{counts[c]=all.filter(r=>r.it.cat===c).length;});
  const list=S.cat==='all'?all:all.filter(r=>r.it.cat===S.cat);
  const tabs=`<div class="r-tabs" role="tablist" aria-label="Filter results by place">${['all'].concat(CATS).map(c=>`<button type="button" role="tab" id="tab-${c}" aria-controls="res-panel" aria-selected="${S.cat===c}" tabindex="${S.cat===c?0:-1}" data-cat="${c}"${c!=='all'?` data-room="${c}"`:''}>${c==='all'?'All':CATLABEL[c]} <span class="n">${counts[c]}</span></button>`).join('')}</div>`;
  const qw=words(S.q);
  const hl=t=>esc(t).split(/(\s+)/).map(w=>{ const n=norm(w); return n&&qw.some(q=>n===q||(q.length>=3&&n.startsWith(q)))?`<mark>${w}</mark>`:w; }).join('');
  let body;
  if(!all.length){
    body=`<div class="empty"><h2>Nothing in Duy Anh’s world matches “${esc(S.q)}” yet.</h2>
      <p>Search covers projects, awards, research, community work and media on this site. Try one of these topics, or open a place directly.</p>
      <div class="chips">${['coding','AI','waste','teaching','math','video','turtle'].map(t=>`<button type="button" class="chip" data-q="${t}">${t}</button>`).join('')}</div>
      <div class="chips">${ROOMS.map(r=>`<a class="chip" href="#${r.id}" data-room="${r.cat}"><i class="dot" style="margin-right:8px"></i>${r.name}</a>`).join('')}</div></div>`;
  } else if(!list.length){
    body=`<div class="empty"><h2>No ${CATLABEL[S.cat]} results for “${esc(S.q)}”.</h2><p>There ${counts.all===1?'is 1 result':'are '+counts.all+' results'} in other places.</p><div><button type="button" class="btn btn-line btn-sm" data-cat-switch="all">Show all ${counts.all}</button></div></div>`;
  } else {
    body=`<ol class="res-list">${list.map(({it})=>`<li class="res" data-room="${it.cat}">
      <div class="res-crumb"><i class="dot"></i><span class="cat">${CATLABEL[it.cat]}${ROOM[it.cat]?' · '+ROOM[it.cat].name:''}</span><span class="path">duyanh › ${it.cat} › ${it.id}</span></div>
      <h2><a href="#${pageOf(it)}" data-from-search>${it.title}</a></h2>
      <p>${hl(it.summary)}</p>
      ${S.explain?whyHTML(it):''}
      ${tagChips(it.tags.filter(t=>qw.some(q=>words(t).some(w=>w===q||(q.length>=3&&w.startsWith(q))))).concat(it.tags).filter((t,i,a)=>a.indexOf(t)===i),4)}
    </li>`).join('')}</ol>`;
  }
  const sec=secretFor(S.q);
  if(sec){
    const card=`<div class="secret">${turtle()}<div><h2>${sec.title}</h2><p>${sec.body}</p></div></div>`;
    body = all.length ? card+body : card+`<div class="chips">${ROOMS.map(r=>`<a class="chip" href="#${r.id}" data-room="${r.cat}"><i class="dot" style="margin-right:8px"></i>${r.name}</a>`).join('')}</div>`;
  }
  const rel=all.length?relatedSearches(all,S.q):[];
  const top=all[0]&&all[0].s>=1000?all[0].it:null;
  const aside=`<aside aria-label="More from this search">
    ${top?`<div class="aside-box top-panel" data-room="${top.cat}"><h2>Top match</h2><p class="kicker">${top.kind}</p><h3>${top.title}</h3><p style="color:var(--ink-2);font-size:15px">${top.summary}</p>${top.role?`<p class="meta" style="font-size:14px;margin-top:8px"><b>Role:</b> ${top.role}</p>`:''}<p style="margin-top:12px"><a class="btn btn-soft btn-sm" href="#${pageOf(top)}" data-from-search>Open ${top.title.length>28?'page':top.title}</a></p></div>`:''}
    ${rel.length?`<div class="aside-box"><h2>Related searches</h2><div class="related">${rel.map(t=>`<button type="button" data-q="${esc(t)}">${icon('i-search')}<span>${esc(t)}</span></button>`).join('')}</div></div>`:''}
  </aside>`;
  return `${tabs}<div class="res-meta"><p class="res-count" aria-live="polite">${list.length} result${list.length===1?'':'s'} for “${esc(S.q)}”${S.cat!=='all'?' in '+CATLABEL[S.cat]:''} <span class="res-time">· ${ms<0.01?'<0.01':ms.toFixed(2)} ms</span></p>
    <button type="button" class="explain-btn" data-explain aria-pressed="${!!S.explain}"><span class="sw" aria-hidden="true"></span>How this search works</button></div>
    ${S.explain?pipelineHTML():''}
    <div class="res-grid" id="res-panel" role="tabpanel" aria-labelledby="tab-${S.cat}"><div>${body}</div>${all.length?aside:''}</div>`;
}
function bindResults(){
  const area=$('#res-area'); if(!area) return;
  const tabs=$$('[role="tab"]',area);
  const pick=(c,focus)=>{ S.cat=c; save(); area.innerHTML=resultsArea(); bindResults(); if(focus) $('#tab-'+c).focus(); };
  tabs.forEach((t,i)=>{
    t.addEventListener('click',()=>pick(t.dataset.cat,true));
    t.addEventListener('keydown',e=>{
      let j=null; if(e.key==='ArrowRight') j=(i+1)%tabs.length; else if(e.key==='ArrowLeft') j=(i-1+tabs.length)%tabs.length; else if(e.key==='Home') j=0; else if(e.key==='End') j=tabs.length-1;
      if(j!=null){ e.preventDefault(); pick(tabs[j].dataset.cat,true); }
    });
  });
  const sw=$('[data-cat-switch]',area); if(sw) sw.addEventListener('click',()=>pick('all',true));
}

/* ---------- vocabulary demo ---------- */
function mountVocab(el){
  if(!el) return;
  let i=0;
  const draw=()=>{
    const w=VOCAB[i];
    el.innerHTML=`<span class="demo-label">Portfolio demo inspired by Contextuary</span>
      <p class="vc-count">Word ${i+1} of ${VOCAB.length}</p>
      <p class="vc-sentence">${esc(w.sentence).replace(w.word,`<span class="vc-word">${w.word}</span>`)}</p>
      <fieldset><legend>What does “${w.word}” mean in this sentence?</legend>
        <div class="vc-opts">${w.options.map((o,j)=>`<button type="button" class="vc-opt" data-j="${j}">${o}</button>`).join('')}</div></fieldset>
      <div class="vc-fbw" aria-live="polite"></div>
      <p class="demo-note">A small exercise written for this portfolio. It is not the live Contextuary product.</p>`;
    $$('.vc-opt',el).forEach(b=>b.addEventListener('click',()=>answer(+b.dataset.j)));
  };
  const answer=j=>{
   
    const w=VOCAB[i], ok=j===w.answer;
    $$('.vc-opt',el).forEach((b,k)=>{ b.disabled=true; if(k===w.answer) b.classList.add('right'); else if(k===j) b.classList.add('wrong'); if(k===j) b.setAttribute('aria-pressed','true'); });
    const last=i===VOCAB.length-1;
    $('.vc-fbw',el).innerHTML=`<div class="vc-fb ${ok?'ok':'no'}"><b>${ok?'Yes, that’s it.':`Not quite. It means “${w.options[w.answer].toLowerCase()}.”`}</b>${w.why}</div>
      <div class="vc-actions" style="margin-top:10px"><button type="button" class="btn btn-soft btn-sm" data-vc-next>${last?'Start again':'Next word →'}</button></div>`;
    const nb=$('[data-vc-next]',el);
    nb.addEventListener('click',()=>{ i=last?0:i+1; draw(); const f=$('.vc-opt',el); if(f) f.focus(); });
    nb.focus({preventScroll:true});
  };
  draw();
}

/* ---------- changelog (real events only; add a year to an undated entry to place it) ---------- */
const LOG=[
  {ref:'HEAD → main', type:'wip', scope:'research', msg:'V-SWAP manuscript in preparation', to:'smartwaste', date:'now'},
  {type:'perf', scope:'contextuary', msg:'2,200+ visitors and 500+ users', to:'contextuary', date:'2026-10'},
  {type:'fix', scope:'contextuary', msg:'caching + database so the site holds up in SAT week', to:'contextuary', date:'2026-09'},
  {type:'feat', scope:'together', msg:'launch Together!, a shared diary for teams', to:'together', date:'2026-09'},
  {type:'feat', scope:'contextuary', msg:'launch Contextuary, SAT vocabulary in context', to:'contextuary', date:'2026-08'},
  {type:'chore', scope:'fct', msg:'graduate from FCT with an A after 86 weeks', to:'fct', date:'2026-07'},
  {type:'feat', scope:'research', msg:'start the smart-waste scoping review', to:'smartwaste', date:'2026-06'},
  {type:'feat', scope:'community', msg:'join Nét Mơ (Dream Strokes) as Head of Human Resources', to:'netmo', date:'2026-04'},
  {type:'feat', scope:'scamcheck', msg:'AI scam checker for older users · 4th place, FCT Summer Camp 2026', to:'scamcheck', date:'2026'},
  {type:'feat', scope:'math', msg:'IMOCSEA International Round · Silver Award', to:'imocsea', date:'2025'},
  {type:'feat', scope:'math', msg:'IMOCSEA National Round · Bronze', to:'imocsea', date:'2025-10'},
  {type:'chore', scope:'training', msg:'start FUNiX technical training', to:'funix', date:'2025-09'},
  {type:'feat', scope:'math', msg:'International Math Challenge, National Round · Gold Medal', to:'imc-gold', date:'2025'},
  {type:'feat', scope:'math', msg:'International STEM Olympiad Final Round · Bronze in Mathematics', to:'isto-bronze', date:'2025'},
  {type:'feat', scope:'lead', msg:'FPTU AI Web Hackathon, Southern Region · 4th of 71 teams, team leader', to:'fptu-ai', date:'2025'},
  {type:'feat', scope:'lead', msg:'Creativity & Innovation Award, Southern Region · 2nd place, team leader', to:'icia', date:'2025'},
  {type:'feat', scope:'lead', msg:'Humanitarian Logistics Hackathon, National Round · Top 10 of 70, team leader', to:'humlog', date:'2025'},
  {type:'feat', scope:'iot', msg:'FCT Summer Camp · IoT fire alarm · 2nd place', to:'fct-iot', date:'2024'},
  {type:'init', scope:'fct', msg:'join FPT Software’s Computer Talents Club', to:'fct', date:'2023-08'}
];
function hash7(t){ let h=2166136261; for(const c of t){ h^=c.charCodeAt(0); h=Math.imul(h,16777619); } return (h>>>0).toString(16).padStart(8,'0').slice(0,7); }
function gitlogHTML(){
  return `<div class="gitlog"><p class="cmd">$ <b>git log</b> --author="Trần Duy Anh" --oneline</p><ol>${LOG.map((l,i)=>`<li><span class="g" aria-hidden="true">${i===LOG.length-1?'○':'*'}</span><span class="h">${hash7(l.msg)}</span><span class="d">${l.date}</span><span>${l.ref?`<span class="ref">(${l.ref})</span> `:''}<span class="ty">${l.type}(${l.scope}):</span> <a href="#${l.to}">${esc(l.msg)}</a></span></li>`).join('')}
    <li class="gap-only"><span class="gap">Entries showing only a year need a month to be ordered exactly within that year.</span></li></ol></div>`;
}

/* ---------- next room ---------- */
function nextRoom(cat){
  const i=CATS.indexOf(cat), prev=ROOMS[i-1], next=ROOMS[i+1];
  return `<nav class="roomnav" aria-label="Other places">${prev?`<a class="rn prev" href="#${prev.id}" data-room="${prev.cat}"><small>← Previous room</small><b>${prev.name}</b></a>`:'<span></span>'}${next?`<a class="rn next" href="#${next.id}" data-room="${next.cat}"><small>Next room →</small><b>${next.name}</b></a>`:`<a class="rn next" href="#home" data-room="about"><small>Back to the start →</small><b>Behind the screen</b></a>`}</nav>`;
}

/* ---------- search explain ---------- */
function pipelineHTML(){
  const n=norm(S.q), toks=n.split(' ').filter(Boolean);
  return `<ol class="pipeline" aria-label="How this search works">
    <li><b>Normalize</b><span>Lowercase and strip Vietnamese accents: <code>${esc(S.q)}</code> → <code>${esc(n)}</code></span></li>
    <li><b>Tokenize</b><span>Split into words: ${toks.map(t=>`<code>${esc(t)}</code>`).join(' ')}</span></li>
    <li><b>Score</b><span>Each page earns points for matches in its name (35), tags (25) and text (6). Partial matches earn less; an exact name match earns 1,000.</span></li>
    <li><b>Rank</b><span>Highest score first. With several words, pages that match every word get ×1.4. Featured projects get a small boost.</span></li>
  </ol>`;
}
function whyHTML(it){
  const {score,parts}=explainOf(it,S.q);
  return `<div class="why" aria-label="Why this result: score ${score}"><span class="score">score ${score}</span>${parts.map(p=>`<span class="pt">${p.mult?`<i>${p.mult}</i>`:`<i>+${p.pts}</i>`} ${esc(p.label)}</span>`).join('')}</div>`;
}

/* ---------- command menu ---------- */
const IS_MAC=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent||'');
const MOD=IS_MAC?'⌘':'Ctrl';
function cmdkBtn(){ return ''; }
const CAN_HOVER=(()=>{ try{ return matchMedia('(hover:hover) and (pointer:fine)').matches; }catch(e){ return false; } })();
function commands(){
  const c=[];
  c.push({g:'Go to',l:'Home',k:'',run:()=>go('home'),ic:'i-room'});
  c.push({g:'Go to',l:'Behind the screen (the story)',k:'story',run:()=>go('tour'),ic:'i-bolt'});
  CHAPTERS.forEach(ch=>c.push({g:'Behind the screen',l:`${ch.n}. ${ch.short}: ${ch.title}`,k:'chapter',run:()=>{ if(S.cur==='home') goCh(ch.id); else { go('home'); setTimeout(()=>goCh(ch.id),80); } },ic:'i-book'}));
  ROOMS.forEach(r=>c.push({g:'Go to',l:r.name,k:r.label,cat:r.cat,run:()=>go(r.id)}));
  c.push({g:'Go to',l:'About Duy Anh',k:'About',run:()=>go('about'),ic:'i-room'});
  ITEMS.filter(i=>i.cat!=='about'&&i.cat!=='awards').forEach(i=>c.push({g:'Pages',l:i.title,k:CATLABEL[i.cat],cat:i.cat,kw:i.tags.join(' '),run:()=>go(pageOf(i))}));
  c.push({g:'Actions',l:LOOK==='dark'?'Switch to light mode':'Switch to dark mode',k:'theme',run:()=>setLook(LOOK==='dark'?'light':'dark'),ic:'i-bolt'});
  c.push({g:'Actions',l:'Show how search ranks results',k:'search',run:()=>{ S.explain=true; save(); if(!S.q) S.q='coding'; S.fresh=true; go('search'); },ic:'i-search'});
  c.push({g:'Actions',l:'Open the terminal',k:'`',kw:'shell console hidden',run:()=>openTerm(),ic:'i-term'});
  c.push({g:'Actions',l:'Keyboard shortcuts',k:'?',run:()=>openKeys(),ic:'i-cmd'});
  return c;
}
let ckOpts=[], ckAct=0, ckOpener=null;
function ckDraw(){
  const q=$('#ck-input').value, n=norm(q), ws=n.split(' ').filter(Boolean);
  let list=commands();
  if(ws.length){
    list=list.map(o=>{ const hay=norm(o.l+' '+(o.k||'')+' '+(o.kw||'')); if(!ws.every(w=>hay.includes(w))) return null; return {...o,rank:norm(o.l).startsWith(n)?0:norm(o.l).includes(n)?1:2}; }).filter(Boolean).sort((a,b)=>a.rank-b.rank);
    list.unshift({g:'Search',l:`Search for “${q.trim()}”`,k:'Enter',run:()=>doSearch(q),ic:'i-search'});
  }
  ckOpts=list.slice(0,14); if(ckAct>=ckOpts.length) ckAct=0;
  let g=''; const ul=$('#ck-list');
  ul.innerHTML=ckOpts.map((o,i)=>{ const h=o.g!==g?(g=o.g,`<li class="ck-group" role="presentation">${o.g}</li>`):''; return h+`<li class="ck-opt" role="option" id="ck-${i}" data-ck="${i}" aria-selected="${i===ckAct}"${o.cat?` data-room="${o.cat}"`:''}>${o.cat?'<i class="dot"></i>':icon(o.ic||'i-page')}<span class="ck-l">${esc(o.l)}</span><span class="ck-k">${esc(o.k||'')}</span></li>`; }).join('')||'<li class="ck-empty" role="presentation">No matches.</li>';
  $('#ck-input').setAttribute('aria-activedescendant',ckOpts.length?'ck-'+ckAct:'');
  const a=$('#ck-'+ckAct); if(a) a.scrollIntoView({block:'nearest'});
}
function openCmdk(){ const d=$('#cmdk'); if(d.open) return; ckOpener=document.activeElement; $('#ck-input').value=''; ckAct=0; ckDraw(); d.showModal(); $('#ck-input').focus(); }
function runCk(i){ const o=ckOpts[i]; if(!o) return; ckOpener=null; $('#cmdk').close(); o.run(); }
function openKeys(){ const d=$('#keys'); if(d.open) return; $$('.mod-k',d).forEach(k=>k.textContent=MOD); d.showModal(); $('[data-keys-close]',d).focus(); }

/* ---------- terminal ---------- */
const TERM={hist:[],hi:0,started:false};
const ESCP=t=>esc(t);
function tPrint(html){ const o=$('#term-out'); o.insertAdjacentHTML('beforeend',html+'\n'); const b=$('#term-body'); b.scrollTop=b.scrollHeight; }
const TURTLE_ART=`     ______
   _/ \\__/ \\_   _
  / \\__/  \\__/\\ (o)
 |______________|/
   UU       UU`;
function termCmd(raw){
  const line=raw.trim(); tPrint(`<span class="p">duyanh@search:~$</span> ${ESCP(line)}`); if(!line) return;
  TERM.hist.push(line); TERM.hi=TERM.hist.length;
  const [cmd,...args]=line.split(/\s+/); const arg=args.join(' '); const c=cmd.toLowerCase();
  const findId=a=>{ const n=norm(a); return ITEMS.find(i=>i.id===a||norm(i.title)===n||(i.aliases||[]).map(norm).includes(n))||null; };
  const room=a=>ROOMS.find(r=>r.id===a||r.cat===a||norm(r.name)===norm(a)||norm(r.label)===norm(a));
  switch(c){
    case 'help': tPrint(`<span class="dim">Commands</span>
  <span class="hl">whoami</span>            who built the things on this site
  <span class="hl">ls</span> [place]         list places, or the pages in one (ls build)
  <span class="hl">cat</span> &lt;page&gt;         print a page summary (cat contextuary)
  <span class="hl">open</span> &lt;page|place&gt;  go there
  <span class="hl">search</span> &lt;words&gt;    run the site search, with scores
  <span class="hl">git log</span>           the changelog
  <span class="hl">tour</span>              start the 5-minute tour
  <span class="hl">theme</span> dark|light   change the look
  <span class="hl">clear</span>, <span class="hl">exit</span>
<span class="dim">Tab completes page names. ↑ ↓ scroll through history.</span>`); break;
    case 'whoami': tPrint(`${ESCP(PROFILE.name)} · ${ESCP(PROFILE.school)}, ${ESCP(PROFILE.city)} · Class of ${PROFILE.classOf}
interests: ${PROFILE.interests.map(ESCP).join(', ').toLowerCase()}`); break;
    case 'ls': { if(!arg){ tPrint(ROOMS.map(r=>`<span class="hl">${r.cat}/</span>  <span class="dim">${r.name}</span>`).join('\n')); break; }
      const r=room(arg==='projects'?'build':arg); if(!r){ tPrint(`<span class="err">ls: ${ESCP(arg)}: no such place</span>`); break; }
      tPrint(ITEMS.filter(i=>i.cat===r.cat).map(i=>`${i.id.padEnd(16)}<span class="dim">${ESCP(i.title)}</span>`).join('\n')); break; }
    case 'cat': { const it=findId(arg); if(!it){ tPrint(`<span class="err">cat: ${ESCP(arg||'')}: no such page. Try ls build</span>`); break; }
      const ms=(it.metrics||[]).filter(m=>m.value);
      tPrint(`<span class="hl"># ${ESCP(it.title)}</span>
<span class="dim">${CATLABEL[it.cat]}${it.role?' · '+ESCP(it.role):''}</span>
${ESCP(it.summary)}${ms.length?'\n'+ms.map(m=>`<span class="ok">${ESCP(m.value)}</span> ${ESCP(m.label)}`).join('  ')+(ms[0].asOf?` <span class="dim">(as of ${ESCP(ms[0].asOf)})</span>`:''):''}
<span class="dim">→ open ${it.id}</span>`); break; }
    case 'open': case 'cd': { const it=findId(arg), r=room(arg); if(!it&&!r){ tPrint(`<span class="err">${c}: ${ESCP(arg||'')}: not found</span>`); break; }
      tPrint(`<span class="ok">opening ${ESCP(it?it.title:r.name)}…</span>`); setTimeout(()=>{ $('#term').close(); go(it?pageOf(it):r.id); },350); break; }
    case 'search': case 'grep': { if(!arg){ tPrint('<span class="err">usage: search &lt;words&gt;</span>'); break; }
      const t0=performance.now(), rs=runSearch(arg), ms=(performance.now()-t0).toFixed(2);
      tPrint(rs.length?`<span class="dim">${rs.length} result${rs.length===1?'':'s'} in ${ms} ms</span>\n`+rs.slice(0,6).map(r=>`<span class="ok">${String(Math.round(r.s)).padStart(5)}</span>  ${r.it.id.padEnd(16)}<span class="dim">${ESCP(r.it.title)}</span>`).join('\n'):`<span class="dim">no results for “${ESCP(arg)}”</span>`); break; }
    case 'git': if(args[0]==='log'){ tPrint(LOG.map(l=>`<span class="hl">${hash7(l.msg)}</span> ${l.ref?`<span class="ok">(${l.ref})</span> `:''}${l.type}(${l.scope}): ${ESCP(l.msg)} <span class="dim">${l.date}</span>`).join('\n')); } else tPrint(`<span class="err">git: only “git log” works here</span>`); break;
    case 'tour': tPrint('<span class="ok">starting the tour…</span>'); setTimeout(()=>{ $('#term').close(); go('tour'); },350); break;
    case 'theme': if(arg==='dark'||arg==='light'){ setLook(arg); $('#term-input').focus(); tPrint(`<span class="ok">theme set to ${arg}</span>`); } else tPrint('<span class="err">usage: theme dark|light</span>'); break;
    case 'clear': $('#term-out').innerHTML=''; break;
    case 'exit': case 'quit': $('#term').close(); break;
    case 'sudo': tPrint('<span class="err">duyanh is not in the sudoers file. This incident will be reported to the tortoise.</span>'); break;
    case 'turtle': case 'tortoise': case 'cowsay': tPrint(`<span class="ok">${ESCP(TURTLE_ART)}</span>\n<span class="dim">slow and steady.</span>`); break;
    case 'rm': tPrint('<span class="err">rm: nice try. Nothing here gets deleted.</span>'); break;
    case 'ping': tPrint('<span class="ok">pong</span>'); break;
    case 'gaps': if(arg==='on'||arg==='off'){ setGaps(arg==='on'); tPrint(`<span class="ok">content gaps ${arg==='on'?'shown':'hidden'}</span> <span class="dim">(owner preview)</span>`); } else tPrint(`<span class="dim">usage: gaps on|off · currently ${S.gaps?'on':'off'}</span>`); break;
    default: tPrint(`<span class="err">command not found: ${ESCP(cmd)}</span> <span class="dim">— type help</span>`);
  }
}
function openTerm(){
  const d=$('#term'); if(d.open) return;
  foundEgg('term');
  if(!TERM.started){ TERM.started=true; tPrint(`<span class="ok">Duy Anh Search shell</span> <span class="dim">· type <span class="hl">help</span> to see commands</span>`); }
  d.showModal(); $('#term-input').focus();
}
$('#term-form').addEventListener('submit',e=>{ e.preventDefault(); const i=$('#term-input'); const v=i.value; i.value=''; termCmd(v); });
$('#term-input').addEventListener('keydown',e=>{
  const i=e.target;
  if(e.key==='ArrowUp'){ e.preventDefault(); if(TERM.hi>0){ TERM.hi--; i.value=TERM.hist[TERM.hi]; } }
  else if(e.key==='ArrowDown'){ e.preventDefault(); if(TERM.hi<TERM.hist.length-1){ TERM.hi++; i.value=TERM.hist[TERM.hi]; } else { TERM.hi=TERM.hist.length; i.value=''; } }
  else if(e.key==='Tab'){ const m=i.value.match(/^(\S+)\s+(\S*)$/); const pool=m?ITEMS.map(x=>x.id).concat(ROOMS.map(r=>r.id),CATS):['help','whoami','ls','cat','open','search','git','tour','theme','clear','exit'];
    const pre=m?m[2]:i.value.trim(); const hits=pool.filter(x=>x.startsWith(pre)); if(hits.length===1&&pre!==hits[0]){ e.preventDefault(); i.value=m?m[1]+' '+hits[0]:hits[0]+' '; } else if(hits.length>1){ e.preventDefault(); tPrint(`<span class="dim">${hits.join('  ')}</span>`); } }
});
$('#term').addEventListener('click',e=>{ if(e.target.id==='term-body'||e.target.id==='term-out') $('#term-input').focus(); if(e.target.id==='term') e.target.close(); });

/* ---------- light / dark look ---------- */
let LOOK='light';
try{ const v=localStorage.getItem('das-look'); if(v==='dark'||v==='light') LOOK=v; }catch(e){}
document.documentElement.dataset.look=LOOK;
function lookBtn(){
  const d=LOOK==='dark';
  return `<button type="button" class="look-btn" data-look-toggle aria-pressed="${d}" aria-label="${d?'Switch to light mode':'Switch to dark mode'}" title="${d?'Light mode':'Dark mode'}">${icon(d?'i-sun':'i-moon')}</button>`;
}
function applyLook(v){
  LOOK=v; document.documentElement.dataset.look=v;
  try{ localStorage.setItem('das-look',v); }catch(e){}
  const hadFocus=document.activeElement&&document.activeElement.hasAttribute('data-look-toggle');
  $$('[data-look-toggle]').forEach(b=>{ b.outerHTML=lookBtn(); });
  const nb=$('[data-look-toggle]'); if(nb&&hadFocus) nb.focus();
}
(function wave(){ // vertical wavy edge; two identical halves so the loop is seamless
  const H=2880, P=240, base=46, amp=30; let d=`M0 0 L${base} 0`, line=`M${base} 0`;
  for(let y=0;y<H;y+=P){ const seg=` Q${base+amp} ${y+P/4} ${base} ${y+P/2} T${base} ${y+P}`; d+=seg; line+=seg; }
  d+=` L0 ${H} Z`;
  $$('#curtain .cw-fill').forEach(e=>e.setAttribute('d',d)); $$('#curtain .cw-line').forEach(e=>e.setAttribute('d',line));
})();
let curtainBusy=false;
function setLook(v){
  if(v===LOOK) return;
  if(RM){ applyLook(v); return; }
  if(curtainBusy) return; curtainBusy=true;
  const c=$('#curtain'), dark=v==='dark';
  c.className='curtain to-'+v; $('use',$('.cur-ic',c)).setAttribute('href',dark?'#i-moon':'#i-sun'); $('.cur-say',c).textContent=dark?'Lights off':'Lights on';
  c.hidden=false; void c.offsetWidth; c.classList.add('closing');
  setTimeout(()=>{ applyLook(v);
    setTimeout(()=>{ c.classList.add('opening');
      setTimeout(()=>{ c.hidden=true; c.className='curtain'; curtainBusy=false; },860);
    },360);
  },740);
}

/* =====================================================================
   EASTER EGGS & THINGS THAT APPEAR
   ===================================================================== */
const EGGS={walk:'the walking turtle',dots:'five places, connected',secret:'a secret search',term:'the hidden terminal',name:'the turtle who says hi'};
const EGG_N=5;
const SECRETS=[
  {keys:['hello','hi','xin chao','chao','chao ban'], title:'Xin chào!', body:'You found a secret search. Thanks for exploring this far. The real work is in the five places.'},
  {keys:['slow and steady','slow and steady wins the race'], walk:true, title:'Slow and steady.', body:'The Digital Age Tortoise approves. Watch the bottom of your screen.'},
  {keys:['easter egg','easter eggs','egg','eggs','trung','trung phuc sinh','secret','secrets'], hatch:true, title:'You hatched an egg.', body:'Searching for secrets is one way to find one. There are five on this site: two live on the homepage, one hides behind the keyboard, and one answers to a name.'}
];
const EGG_HINTS={
  walk:['The shy turtle','Poke the little turtle next to the logo.'],
  dots:['Five places, connected','Light up every coloured dot under the logo.'],
  secret:['A secret search','You found this one by searching.'],
  term:['The hidden terminal','On a keyboard, press the key just left of 1. Or open the command menu.'],
  name:['The turtle who says hi','Search for Duy Anh’s name.']
};
function eggSVG(){
  const egg='M60 6C90 6 112 56 112 92C112 126 88 146 60 146C32 146 8 126 8 92C8 56 30 6 60 6Z';
  const spots='<circle cx="38" cy="40" r="6"/><circle cx="80" cy="34" r="4.5"/><circle cx="90" cy="68" r="7"/><circle cx="26" cy="96" r="5"/><circle cx="62" cy="118" r="6.5"/><circle cx="92" cy="114" r="4"/><circle cx="48" cy="78" r="3.5"/>';
  const zig='0,80 15,69 30,82 45,69 60,82 75,69 90,82 105,69 120,80';
  return `<svg class="egg" viewBox="-20 -60 160 220" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id="egg-top-clip"><polygon points="0,-10 120,-10 ${zig.split(' ').reverse().join(' ')}"/></clipPath>
      <clipPath id="egg-bot-clip"><polygon points="${zig} 120,160 0,160"/></clipPath>
    </defs>
    <ellipse class="egg-shadow" cx="60" cy="150" rx="44" ry="7" fill="var(--line-2)" opacity=".55"/>
    <g class="egg-all">
      <g class="baby"><g class="baby-face"><use href="#turtle" x="18" y="40" width="84" height="57"/></g></g>
      <g clip-path="url(#egg-bot-clip)"><path d="${egg}" fill="var(--egg)" stroke="var(--turtle-line)" stroke-width="2.4"/><g fill="var(--egg-spot)">${spots}</g><path d="M22 120C34 140 86 140 98 120" fill="none" stroke="var(--egg-shade)" stroke-width="7" stroke-linecap="round" opacity=".7"/></g>
      <g class="egg-top"><g clip-path="url(#egg-top-clip)"><path d="${egg}" fill="var(--egg)" stroke="var(--turtle-line)" stroke-width="2.4"/><g fill="var(--egg-spot)">${spots}</g></g>
        <polyline class="crack" points="${zig}" fill="none" stroke="var(--turtle-line)" stroke-width="2.4" stroke-linejoin="round"/></g>
    </g>
  </svg>`;
}
function burstHTML(){
  const cols=['--c-build','--c-awards','--c-research','--c-community','--c-media','--turtle'];
  let out=''; for(let i=0;i<30;i++){
    const a=(i/30)*Math.PI*2+Math.random()*.4, d=110+Math.random()*120;
    out+=`<i class="${i%3===0?'dot':''}" style="--bc:var(${cols[i%cols.length]});--dx:${Math.round(Math.cos(a)*d)}px;--dy:${Math.round(Math.sin(a)*d*.85-30)}px;--r:${Math.round(Math.random()*540-270)}deg;--dl:${(Math.random()*.15).toFixed(2)}s"></i>`;
  }
  return `<div class="burst" aria-hidden="true">${out}</div>`;
}
let hatchOpener=null;
function hatchHTML(){
  const eggs=S.eggs||{}; const n=Object.keys(EGG_HINTS).filter(k=>eggs[k]).length;
  return `<div class="hatch-stage">${eggSVG()}</div>${burstHTML()}
    <p class="hatch-count">Easter eggs found: ${n} of ${EGG_N}</p>
    <div class="hatch-copy"><h2 id="hatch-h">${n===EGG_N?`All ${['','one','two','three','four','five'][EGG_N]} eggs hatched!`:'It hatched!'}</h2>
      <p>${n===EGG_N?'You found every secret on this site. The Digital Age Tortoise is proud of you.':`You found the secret search. ${['','One more egg is','Two more eggs are','Three more eggs are','Four more eggs are'][EGG_N-n]} hiding in plain sight.`}</p></div>
    <ul class="egg-list">${Object.entries(EGG_HINTS).map(([k,[t,h]])=>`<li class="${eggs[k]?'found':''}"><span class="egg-ico" aria-hidden="true">${eggs[k]?'✓':'?'}</span><div><b>${eggs[k]?t:'Still hidden'}</b><span>${eggs[k]?(k==='secret'?'Found by searching “'+esc(S.q)+'”.':'Found.'):h}</span></div><span class="vh">${eggs[k]?'found':'not found yet'}</span></li>`).join('')}</ul>
    <div class="hatch-btns"><button type="button" class="btn btn-line btn-sm" data-hatch-again>Hatch it again</button><button type="button" class="btn btn-primary btn-sm" data-hatch-close>Close</button></div>`;
}
function playHatch(){
  const box=$('#hatch-in'); box.classList.remove('go','still'); box.innerHTML=hatchHTML(); void box.offsetWidth;
  box.classList.add(RM?'still':'go');
}
function openHatch(){
  const d=$('#hatch'); if(!d||d.open) return;
  hatchOpener=document.activeElement;
  playHatch(); d.showModal(); $('[data-hatch-close]',d).focus({preventScroll:true});
}
let hiTimer=null;
function closeHi(nav){
  clearTimeout(hiTimer); const el=$('.hi'); if(!el) return;
  const done=()=>{ el.remove(); if(nav) go('about'); };
  if(RM){ done(); return; } el.classList.add('leave'); setTimeout(done,500);
}
function sayHi(){
  const eg=foundEgg('name',true);
  const old=$('.hi'); if(old) old.remove(); clearTimeout(hiTimer);
  const el=document.createElement('div'); el.className='hi'; el.setAttribute('role','status');
  el.innerHTML=`<div class="hi-turtle" aria-hidden="true">${turtle()}</div>
    <div class="hi-bub"><b>Xin chào!</b><p>You found Duy Anh. Follow me, I’ll show you who he is.</p>
      <span class="hi-egg">${eg.isNew?`Easter egg ${eg.n} of ${EGG_N} found`:'Easter egg found again'}${eg.n===EGG_N?' · that’s all of them!':''}</span>
      <div class="hi-bar" aria-hidden="true"><i></i></div>
      <div class="hi-acts"><button type="button" class="btn btn-primary btn-sm" data-hi-go>Go now</button><button type="button" class="btn btn-line btn-sm" data-hi-stay>Stay here</button></div></div>`;
  document.body.appendChild(el);
  $('[data-hi-go]',el).focus({preventScroll:true});
  hiTimer=setTimeout(()=>closeHi(true), RM?3800:3800);
}
function secretFor(q){ const n=norm(q||''); return SECRETS.find(x=>x.keys.includes(n))||null; }
function toast(msg){
  const t=$('#toast'); t.innerHTML=turtle()+'<span>'+esc(msg)+'</span>';
  t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  clearTimeout(toast.tm); toast.tm=setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>{ if(!t.classList.contains('show')) t.innerHTML=''; },350); },4200);
}
function eggCount(){
  const n=Object.keys(S.eggs||{}).length, el=$('#egg-count');
  el.textContent=n?`Easter eggs found: ${n} of ${EGG_N}`+(n===EGG_N?' · all of them!':''):'';
}
function foundEgg(k,quiet){
  S.eggs=S.eggs||{}; const isNew=!S.eggs[k]; S.eggs[k]=1; save();
  const n=Object.keys(S.eggs).length;
  if(quiet){ eggCount(); return {n,isNew}; }
  toast(isNew?(n===EGG_N?`You found all ${EGG_N} easter eggs. The tortoise is impressed.`:`Easter egg ${n} of ${EGG_N}: ${EGGS[k]}`):`Found again: ${EGGS[k]}`);
  eggCount();
}
function walkTurtle(btn){
  if(btn) foundEgg('walk');
  if(RM){ return; }
  if($('.walker')) return;
  if(btn) btn.classList.add('gone');
  const w=document.createElement('div'); w.className='walker'; w.setAttribute('aria-hidden','true');
  w.innerHTML=`<span class="walker-say">slow and steady…</span>${turtle()}`;
  const lane=document.createElement('div'); lane.className='walk-lane'; lane.setAttribute('aria-hidden','true'); lane.appendChild(w);
  document.body.appendChild(lane);
  w.addEventListener('animationend',e=>{ if(e.animationName!=='walk') return; lane.remove();
    const b=$('.wm-turtle'); if(b){ b.classList.remove('gone'); b.classList.add('back'); setTimeout(()=>b.classList.remove('back'),700); } });
}
function lightDot(b){
  S.dots=S.dots||{}; const c=b.dataset.dot; S.dots[c]=!S.dots[c];
  b.classList.toggle('lit',!!S.dots[c]); b.setAttribute('aria-pressed',String(!!S.dots[c]));
  const lit=CATS.filter(x=>S.dots[x]).length, all=lit===5;
  b.parentElement.classList.toggle('joined',all);
  $('.dots-msg').textContent=all?'All five connected. One person, many connections.':(lit?`${lit} of 5 lit`:'');
  save(); if(all) foundEgg('dots');
}
function setupReveal(){
  if(RM||!('IntersectionObserver' in window)) return;
  const els=$$('.card,.journey li,.res',main).filter(e=>e.getBoundingClientRect().top>window.innerHeight);
  if(!els.length) return;
  const show=t=>{ io.unobserve(t); t.classList.add('rise');
    const done=()=>{ t.classList.remove('pre','rise'); t.style.removeProperty('--d'); }; t.addEventListener('transitionend',done,{once:true}); setTimeout(done,1200); };
  const io=new IntersectionObserver(es=>{ if(!es.some(en=>en.isIntersecting)) return;
    $$('.pre:not(.rise)',main).forEach(t=>{ if(t.getBoundingClientRect().top<window.innerHeight) show(t); }); },{rootMargin:'0px 0px -6% 0px'});
  els.forEach(e=>{ const i=[...e.parentElement.children].indexOf(e); e.style.setProperty('--d',((i%3)*0.08)+'s'); e.classList.add('pre'); io.observe(e); });
}

/* =====================================================================
   ROUTER
   ===================================================================== */
const main=$('#main'), top=$('#top'), dlg=$('#tortoise'); let opener=null;
let first=true;
function render(){
  const raw=decodeURIComponent(location.hash.slice(1))||'home';
  const tok=raw;
  if(S.cur==='search') S.resScroll=window.scrollY;
  S.prev=S.cur; S.cur=tok;
  if(tok!=='tortoise'&&dlg.open){ opener=null; dlg.close(); }
  const hd=document.getElementById('hatch'); if(hd&&hd.open) hd.close();
  ['cmdk','keys','term','drawer'].forEach(id=>{ const d=document.getElementById(id); if(d&&d.open){ if(id==='cmdk') ckOpener=null; d.close(); } });
  const isTour=(tok==='tour'||tok==='route');
  if(tok==='search'||tok==='home'||ROOM_BY_ID[tok]||isTour) S.fromSearch=false;
  else if(S.prev==='search') S.fromSearch=true;
  let html='', cat=null, after=null, scroll=0;

  if(tok==='home'||isTour){
    const v=viewHome(); html=v.html;
    after=()=>{ mountReadiness($('#rx-mount')); mountPuzzle($('.pz')); mountQmap(); setupStory();
      if(isTour){ setTimeout(()=>{ const c=$('#ch-1'); c.scrollIntoView({block:'start',behavior:'instant'}); $('#ch-1-h').setAttribute('tabindex','-1'); $('#ch-1-h').focus({preventScroll:true}); },0); } };
    if(isTour) scroll=null; }
  else if(tok==='search'){ html=viewResults(); const sec=secretFor(S.q); after=()=>{ bindResults(); if(sec&&S.fresh0){ foundEgg('secret'); if(sec.walk) walkTurtle(null); if(sec.hatch) setTimeout(openHatch,60); } }; S.fresh0=S.fresh; scroll=S.fresh?0:S.resScroll; S.fresh=false; }
  else if(ROOM_BY_ID[tok]){ const r=ROOM_BY_ID[tok]; cat=r.cat; S.visited[cat]=1;
    html={workshop:viewWorkshop,replay:viewReplay,lab:viewLab,common:viewCommon,studio:viewStudio}[tok]();
    after=()=>{ if(tok==='workshop') mountVocab($('#vocab')); if(tok==='lab') mountReadiness($('#rx-mount')); }; }
  else if(tok==='vswap'){ cat='research'; S.visited.research=1; html=viewLab(); after=()=>{ mountReadiness($('#rx-mount')); const d=$('#vswap-sec'); d.open=true; setTimeout(()=>{d.scrollIntoView({block:'start',behavior:'instant'}); d.focus({preventScroll:true});},0); }; scroll=null; }
  else if(tok==='about'||tok==='tortoise'||tok==='journey'){ html=viewAbout();
    after=()=>{ if(tok==='tortoise') openTortoise(null); if(tok==='journey'){ const j=$('#journey-anchor'); setTimeout(()=>{j.scrollIntoView({block:'start',behavior:'instant'}); j.focus({preventScroll:true});},0);} };
    if(tok==='journey') scroll=null; }
  else if(ITEM[tok]){ const it=ITEM[tok]; cat=it.cat;
    if(it.page&&it.page!==tok){ location.replace('#'+it.page); return; }
    if(CATS.includes(cat)) S.visited[cat]=1; html=viewItem(it); after={netmo:mountNetmo,fct:mountFct,funix:mountFunix,firealarm:mountFirealarm}[it.id]||null; }
  else { html=`<div class="wrap" style="padding-block:60px"><h1 id="main-h" tabindex="-1" style="font-size:36px">This page isn’t in Duy Anh’s world.</h1><p style="margin-top:12px;color:var(--ink-2)">The link may be mistyped. Try a search, or go back home.</p><p style="margin-top:20px"><a class="btn btn-primary" href="#home">Go home</a></p></div>`; }

  top.innerHTML = (tok==='home'||isTour)?'':topbar(cat);
  main.innerHTML = html;
  $$('form[data-sb]').forEach(bindSearch);
  if(after) after();
  setupReveal();
  save();
  if(scroll!==null) window.scrollTo({top:scroll,left:0,behavior:'instant'});
  if(!first&&!isTour&&!(tok==='home'&&scroll===null)){ const h=$('#main-h'); if(h) h.focus({preventScroll:true}); }
  first=false;
  // tab title: the page's name, then the site's
  const page = (tok==='home'||isTour) ? 'Behind the screen'
    : tok==='search' ? `“${S.q}” · Search`
    : ROOM_BY_ID[tok] ? ROOM_BY_ID[tok].name
    : tok==='vswap' ? ROOM.research.name
    : (tok==='about'||tok==='tortoise'||tok==='journey') ? 'About'
    : ITEM[tok] ? ITEM[tok].title : 'Page not found';
  document.title = `${page} · Trần Duy Anh`;
}
/* ---------- tortoise dialog ---------- */
function openTortoise(btn){
  opener=btn; if(dlg.open) return;
  if(typeof dlg.showModal==='function') dlg.showModal(); else dlg.setAttribute('open','');
  $('[data-close]',dlg).focus();
}
dlg.addEventListener('close',()=>{ const t=opener&&document.contains(opener)?opener:$('#main-h'); if(t) t.focus(); });
dlg.addEventListener('click',e=>{ if(e.target===dlg) dlg.close(); });
$('[data-close]',dlg).addEventListener('click',()=>dlg.close());

/* ---------- global events ---------- */
$('#drawer').addEventListener('close',()=>{ if(deepOpener&&document.contains(deepOpener)) deepOpener.focus({preventScroll:true}); deepOpener=null; });
$('#hatch').addEventListener('close',()=>{ const t=hatchOpener&&document.contains(hatchOpener)?hatchOpener:$('#main-h'); if(t) t.focus({preventScroll:true}); hatchOpener=null; });
$('#hatch').addEventListener('click',e=>{ if(e.target.id==='hatch') e.target.close(); });
document.addEventListener('click',e=>{
  const q=e.target.closest('[data-q]'); if(q){ e.preventDefault(); doSearch(q.dataset.q); return; }
  if(e.target.closest('[data-hi-go]')){ closeHi(true); return; }
  if(e.target.closest('[data-hi-stay]')){ closeHi(false); return; }
  const cp=e.target.closest('[data-copy]'); if(cp){ const v=cp.dataset.copy; const done=()=>{ cp.textContent='Copied'; setTimeout(()=>cp.textContent='Copy',1600); };
    try{ navigator.clipboard.writeText(v).then(done,()=>{ const r=document.createRange(); r.selectNodeContents(cp.previousElementSibling); const sel=getSelection(); sel.removeAllRanges(); sel.addRange(r); cp.textContent='Selected'; }); }catch(err){ const r=document.createRange(); r.selectNodeContents(cp.previousElementSibling); const sel=getSelection(); sel.removeAllRanges(); sel.addRange(r); } return; }
  const dp=e.target.closest('[data-deep]'); if(dp){ openDeep(dp.dataset.deep,dp); return; }
  if(e.target.closest('[data-dr-close]')||e.target.id==='drawer'){ $('#drawer').close(); return; }
  const dk=e.target.closest('[data-dock]'); if(dk){ const k=dk.dataset.dock;
    if(k==='menu'){ dockMenu($('#dock-menu').hidden); return; }
    const i=Math.max(0,storyProgress.cur??0)+(k==='next'?1:-1); if(CHAPTERS[i]) goCh(CHAPTERS[i].id); return; }
  if($('#dock-menu')&&!$('#dock-menu').hidden&&!e.target.closest('.dock')) dockMenu(false);
  const chb=e.target.closest('[data-ch]'); if(chb){ if(chb.closest('.dock-menu')) dockMenu(false); e.preventDefault(); goCh(chb.dataset.ch); return; }
  if(e.target.closest('[data-sx-top]')&&S.cur==='home'){ e.preventDefault(); window.scrollTo({top:0,behavior:RM?'auto':'smooth'}); return; }
  if(e.target.closest('[data-cmdk]')){ openCmdk(); return; }
  if(e.target.closest('[data-keys-close]')||e.target.id==='keys'){ $('#keys').close(); return; }
  if(e.target.closest('[data-term-close]')){ $('#term').close(); return; }
  if(e.target.id==='cmdk'){ $('#cmdk').close(); return; }
  const ck=e.target.closest('[data-ck]'); if(ck){ runCk(+ck.dataset.ck); return; }
  if(e.target.closest('[data-explain]')){ S.explain=!S.explain; save(); const a=$('#res-area'); if(a){ a.innerHTML=resultsArea(); bindResults(); const b=$('[data-explain]'); if(b) b.focus(); } return; }
  if(e.target.closest('[data-hatch-close]')){ $('#hatch').close(); return; }
  if(e.target.closest('[data-hatch-again]')){ playHatch(); $('[data-hatch-close]').focus({preventScroll:true}); return; }
  const lk=e.target.closest('[data-look-toggle]'); if(lk){ setLook(LOOK==='dark'?'light':'dark'); return; }
  const egg=e.target.closest('[data-egg-walk]'); if(egg){ walkTurtle(egg); return; }
  const dot=e.target.closest('[data-dot]'); if(dot){ lightDot(dot); return; }
  const fa=e.target.closest('.factor'); if(fa){ fa.setAttribute('aria-expanded',String(fa.getAttribute('aria-expanded')!=='true')); return; }
  const sc=e.target.closest('[data-scroll]'); if(sc){ const t=document.getElementById(sc.dataset.scroll); if(t){ if(t.tagName==='DETAILS') t.open=true; t.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'}); if(!t.hasAttribute('tabindex')) t.setAttribute('tabindex','-1'); t.focus({preventScroll:true}); } return; }
  const tt=e.target.closest('[data-tortoise]'); if(tt){ openTortoise(tt); return; }
  const br=e.target.closest('[data-back-results]'); if(br){ if(S.prev==='search') history.back(); else go('search'); return; }
});
function pageChange(){
  const go=()=>render();
  if(RM){ go(); return; }
  if(document.startViewTransition){ try{ document.startViewTransition(go); return; }catch(e){} }
  go(); const m=$('#main'); m.classList.remove('pg-in'); void m.offsetWidth; m.classList.add('pg-in');
}
window.addEventListener('hashchange',pageChange);
$('#ck-input').addEventListener('input',()=>{ ckAct=0; ckDraw(); });
$('#ck-input').addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){ e.preventDefault(); ckAct=(ckAct+1)%Math.max(1,ckOpts.length); ckDraw(); }
  else if(e.key==='ArrowUp'){ e.preventDefault(); ckAct=(ckAct-1+ckOpts.length)%Math.max(1,ckOpts.length); ckDraw(); }
  else if(e.key==='Enter'){ e.preventDefault(); runCk(ckAct); }
});
$('#ck-list').addEventListener('mousemove',e=>{ const o=e.target.closest('[data-ck]'); if(o&&+o.dataset.ck!==ckAct){ ckAct=+o.dataset.ck; $$('.ck-opt').forEach(x=>x.setAttribute('aria-selected',String(+x.dataset.ck===ckAct))); } });
['cmdk','keys','term'].forEach(id=>{ $('#'+id).addEventListener('close',()=>{ if(id==='cmdk'&&ckOpener&&document.contains(ckOpener)) ckOpener.focus({preventScroll:true}); ckOpener=id==='cmdk'?null:ckOpener; }); });
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&!e.altKey&&e.key.toLowerCase()==='k'){ e.preventDefault(); const d=$('#cmdk'); if(d.open) d.close(); else { $$('dialog[open]').forEach(x=>x.close()); openCmdk(); } return; }
  if(e.key==='Escape'&&$('.hi')){ closeHi(false); return; }
  if(e.key==='Escape'&&$('#dock-menu')&&!$('#dock-menu').hidden){ dockMenu(false); $('[data-dock="menu"]').focus(); return; }
  if(document.querySelector('dialog[open]')) return;
  const typing=e.target.closest&&e.target.closest('input,textarea,select,[contenteditable="true"]');
  if(typing||e.metaKey||e.ctrlKey||e.altKey) return;
  if(e.key==='/'){ const i=$('.topbar input')||$('.sx-explore-sec input'); if(i){ e.preventDefault(); i.focus(); i.select(); } return; }
  if(e.key==='?'){ e.preventDefault(); openKeys(); return; }
  if(e.key==='`'||e.code==='Backquote'){ e.preventDefault(); openTerm(); return; }
});
eggCount();
function setGaps(v){ S.gaps=!!v; document.body.classList.toggle('show-gaps',S.gaps); save(); }
setGaps(S.gaps);
if('scrollRestoration' in history) history.scrollRestoration='manual';

render();
})();
