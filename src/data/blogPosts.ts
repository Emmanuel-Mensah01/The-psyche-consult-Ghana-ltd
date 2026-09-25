// src/data/blogPosts.ts
//
// Single source of truth for blog content. Used by:
//   - src/app/blog/page.tsx        (listing page)
//   - src/app/blog/[slug]/page.tsx (individual article page)
//
// Each post's `content` is a list of simple content blocks so the article
// page can render real, structured articles (headings, paragraphs, lists,
// tips) without needing a markdown renderer or CMS.

export interface ContentBlock {
  type: 'p' | 'h2' | 'list' | 'tip';
  text?: string;
  items?: string[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  emoji: string;
  featured?: boolean;
  content: ContentBlock[];
}

export const posts: BlogPost[] = [
  // ---------------------------------------------------------------------
  {
    id: 1,
    slug: 'winning-personal-statement-uk-universities',
    title: 'How to Write a Winning Personal Statement for UK Universities',
    excerpt:
      'Your personal statement is your chance to stand out. Learn the exact structure, tone, and content strategies that get Ghanaian students accepted into top UK universities.',
    category: 'Application Tips',
    author: 'Ama Boateng',
    authorRole: 'Senior Admissions Counsellor',
    date: 'July 15, 2025',
    readTime: '8 min read',
    emoji: '✍️',
    featured: true,
    content: [
      {
        type: 'p',
        text: `If you're applying to a UK university through UCAS, your personal statement carries more weight than most Ghanaian applicants realise. Your WASSCE grades tell an admissions officer what you scored. Your personal statement is the only place in the entire application where you get to explain why you scored it, what you did with your curiosity outside the classroom, and why you specifically belong on that course. Two students with identical grades can have very different outcomes purely because of how well they used this one document.`,
      },
      { type: 'h2', text: '1. Start With the Subject, Not With Yourself' },
      {
        type: 'p',
        text: `The single most common mistake we see is students opening with "Since I was young, I have always been passionate about..." Admissions tutors read thousands of statements that begin this way, and it tells them nothing. Instead, open with something specific to the subject: a problem that puzzled you, a project you built, a book or case study that changed how you thought about the field. If you're applying for Economics, don't say you "love numbers" — mention the actual moment you noticed how fuel subsidy cuts changed transport fares in your neighbourhood, and how that pushed you to understand price elasticity.`,
      },
      { type: 'h2', text: '2. Use the 70/30 Rule' },
      {
        type: 'p',
        text: `A strong personal statement spends roughly 70% of its content on academic evidence — your engagement with the subject beyond the syllabus — and 30% on supercurricular and personal qualities. Many Ghanaian applicants get this backwards, spending most of the statement on leadership positions, church activities, and sporting achievements. Those matter, but only in the smaller share. Admissions tutors are first and foremost asking: "Will this student cope with and enjoy studying this specific subject at degree level?"`,
      },
      {
        type: 'list',
        items: [
          'Academic evidence (70%): wider reading, online courses (Coursera, edX), relevant projects, entrance exam prep (BMAT, LNAT, Maths Admissions Test), independent research, subject Olympiads',
          'Supercurricular and character (30%): leadership roles, work experience, volunteering, and what specific skills or insight they gave you',
        ],
      },
      { type: 'h2', text: '3. Be Specific — Vague Statements Get Skimmed' },
      {
        type: 'p',
        text: `"I read widely about medicine" says nothing. "I read Atul Gawande's Being Mortal and it changed how I think about end-of-life care, especially after volunteering at Korle Bu's outpatient ward" says everything an admissions tutor needs. Every claim in your statement should be backed by a specific title, project name, statistic, or experience. If you can delete a sentence and the statement loses nothing, delete it.`,
      },
      { type: 'h2', text: '4. Structure That Actually Works' },
      {
        type: 'list',
        items: [
          'Opening (1 paragraph): a specific hook tied directly to the subject — not your life story',
          'Academic engagement (2–3 paragraphs): what you have read, built, or explored beyond the curriculum, and what it taught you',
          'Relevant experience (1–2 paragraphs): work experience, projects, or competitions, explained in terms of what they showed you about the field',
          'Wider interests (1 short paragraph): only if genuinely relevant — skills that transfer to independent university study',
          'Closing (2–3 sentences): tie it back to why this course, at this stage of your life, is the right next step',
        ],
      },
      { type: 'h2', text: 'A Note on the New UCAS Format' },
      {
        type: 'p',
        text: `UCAS has moved from one open-ended essay to three separate structured questions: why you chose this course, how your education and experience prepared you, and what else you'd like admissions tutors to know about you (extracurriculars, personal circumstances). The advice above still applies within each section — specificity and subject-first thinking matter just as much when the boxes are smaller. Check the exact word/character limits on your UCAS Hub before you start writing, as these are enforced strictly.`,
      },
      { type: 'h2', text: '5. Common Mistakes That Cost Ghanaian Applicants Offers' },
      {
        type: 'list',
        items: [
          'Copying quotes or clichés ("I have always had a passion for...") — UCAS runs every statement through similarity-detection software',
          'Listing achievements without reflection — a debate trophy means nothing without what it taught you about structuring an argument',
          'Writing about a different course than the one you\'re applying to, because a sibling or agent template was reused',
          'Ignoring the specific course structure — Oxbridge and Russell Group tutors expect you to reference the actual modules or teaching style of that course',
          'Submitting a first draft — the strongest statements we see have gone through 6–8 rounds of editing',
        ],
      },
      {
        type: 'tip',
        text: `Read your statement aloud before submitting. If a sentence makes you stumble or sounds like something you'd never actually say, an admissions tutor will notice it too.`,
      },
      {
        type: 'p',
        text: `Finally, start early. The strongest personal statements are never written the week before the UCAS deadline — they come from students who spent the summer holidays reading, building small projects, and drafting. If you want a second pair of eyes on your draft, our counsellors review personal statements as part of every UK application package we run for Ghanaian students.`,
      },
    ],
  },
  // ---------------------------------------------------------------------
  {
    id: 2,
    slug: 'fully-funded-scholarships-african-students',
    title: 'Top Fully-Funded Scholarships for African Students',
    excerpt:
      'A comprehensive guide to the most competitive fully-funded scholarships available to African students, including what they cover, who they suit, and how to strengthen your application.',
    category: 'Scholarships',
    author: 'Kwame Asante',
    authorRole: 'Scholarships & Funding Advisor',
    date: 'July 10, 2025',
    readTime: '12 min read',
    emoji: '💰',
    featured: true,
    content: [
      {
        type: 'p',
        text: `"Fully-funded" is one of the most overused phrases in study-abroad marketing, and it causes real harm when students discover halfway through an application that a scholarship only covers tuition and not living costs. Below are established, genuinely fully-funded scholarship programmes that Ghanaian and other African students win every year — tuition, flights, accommodation or a living stipend, and usually health insurance. Deadlines and quotas shift annually, so always confirm current details on the official scholarship website before you invest weeks into an application.`,
      },
      { type: 'h2', text: '1. Mastercard Foundation Scholars Program' },
      {
        type: 'p',
        text: `One of the largest scholarship programmes for African students, delivered through partner universities across Africa, North America, and Europe (including institutions like the University of Ghana, University of Cape Town, and McGill). It covers full tuition, accommodation, travel, and a leadership development programme, with a strong emphasis on students returning to contribute to Africa's development. Because it is delivered through specific partner universities rather than a single central application, your first step should be identifying which partner institution offers your intended course.`,
      },
      { type: 'h2', text: '2. Chevening Scholarships (UK)' },
      {
        type: 'p',
        text: `Funded by the UK Foreign, Commonwealth & Development Office, Chevening funds one-year master's degrees at any UK university, covering tuition, a monthly stipend, travel, and an arrival allowance. It specifically looks for future leaders and influencers, so your application essays need concrete examples of leadership and networking, not just academic achievement. Ghana has a strong Chevening track record — the local British Council office runs information sessions worth attending before you apply.`,
      },
      { type: 'h2', text: '3. Commonwealth Scholarships (UK)' },
      {
        type: 'p',
        text: `Available to citizens of Commonwealth countries including Ghana, this covers master's and PhD study in the UK with full tuition, living allowance, and travel costs. Commonwealth Shared Scholarships (for master's) specifically target students who could not otherwise afford to study in the UK, and applications are usually made through the Commonwealth Scholarship Commission in partnership with your chosen UK university, so check which universities are participating in the current cycle.`,
      },
      { type: 'h2', text: '4. DAAD Scholarships (Germany)' },
      {
        type: 'p',
        text: `The German Academic Exchange Service funds hundreds of master's and PhD scholarships for developing countries, covering a monthly stipend, health insurance, and travel allowance. Many DAAD programmes are development-related (public policy, engineering, agriculture), reflecting Germany's aid priorities, and having relevant work or volunteer experience tied to development in Ghana strengthens an application considerably.`,
      },
      { type: 'h2', text: '5. Fulbright Foreign Student Program (USA)' },
      {
        type: 'p',
        text: `The US government's flagship scholarship for master's and PhD study, covering tuition, a living stipend, health insurance, and airfare. Applications go through the US Embassy in Accra (via the Ghana Fulbright Program office), not directly to universities, and typically open around February for the following academic year. Strong Fulbright applicants show a clear plan to bring skills back to Ghana rather than staying permanently in the US.`,
      },
      { type: 'h2', text: '6. Australia Awards' },
      {
        type: 'p',
        text: `Funded by the Australian government for students from partner countries, Australia Awards covers tuition, living costs, and travel for master's study, with a strong focus on fields tied to national development priorities such as health, education, agriculture, and governance. Selection panels weigh your intended contribution to Ghana's development heavily, so your personal statement should connect your study plan directly to a real gap you've observed at home.`,
      },
      { type: 'h2', text: '7. Erasmus Mundus Joint Master Degrees (EU)' },
      {
        type: 'p',
        text: `Rather than one scholarship, Erasmus Mundus is a catalogue of joint master's programmes delivered across two or more European universities, most with full scholarships covering tuition, travel, and a monthly stipend. Because you study in multiple countries during the same degree, it's an efficient way to build a genuinely international network and CV. Search the EMJMD catalogue directly by subject area rather than by "Erasmus" alone, since each programme has its own application deadline and requirements.`,
      },
      { type: 'h2', text: '8. Chinese Government Scholarship (CSC)' },
      {
        type: 'p',
        text: `China funds thousands of scholarships annually for African students at both bachelor's and postgraduate level, typically covering full tuition, accommodation, a monthly stipend, and basic medical insurance, applied for either directly through Chinese embassies or through partner universities. English-taught programmes are increasingly common, particularly in engineering, medicine, and business, but always confirm the language of instruction before accepting an offer.`,
      },
      { type: 'h2', text: '9. Gates Cambridge Scholarship (UK)' },
      {
        type: 'p',
        text: `Highly competitive but genuinely full-cost funding for postgraduate study at the University of Cambridge specifically, covering tuition, a maintenance allowance, and travel. It's aimed at students with outstanding academic records and a demonstrated commitment to improving the lives of others — your referees and research proposal (for research degrees) need to be exceptionally strong, since this is one of the most selective scholarships on this list.`,
      },
      { type: 'h2', text: '10. MEXT Scholarship (Japan)' },
      {
        type: 'p',
        text: `The Japanese government's scholarship for undergraduate, master's, and research students, applied for through the Japanese Embassy in Accra. It covers tuition, a living stipend, and round-trip airfare, and often includes a preparatory year of intensive Japanese language study before the degree begins, depending on your programme. It's an underused route for Ghanaian students and typically has less competition per seat than the UK or US equivalents.`,
      },
      { type: 'h2', text: 'How to Actually Win One' },
      {
        type: 'list',
        items: [
          'Apply to 4–6 scholarships in parallel rather than pinning everything on one — most Ghanaian scholarship winners we work with applied to several before succeeding',
          'Match your story to what each scholarship actually funds — a development-focused scholarship wants a return-to-Ghana narrative; a research scholarship wants a rigorous proposal',
          'Get your referees briefed early — strong recommendation letters take advisors 2–3 weeks to write properly, not two days',
          'Track deadlines in one place — scholarship cycles for the same programme can open 10–14 months before the intake starts',
        ],
      },
      {
        type: 'tip',
        text: `Never pay an agent or "scholarship consultant" who guarantees you a scholarship for a fee. Every programme above is free to apply for directly through its official website or embassy.`,
      },
    ],
  },
  // ---------------------------------------------------------------------
  {
    id: 3,
    slug: 'ielts-vs-toefl-which-test-to-take',
    title: 'IELTS vs TOEFL: Which English Test Should You Take?',
    excerpt:
      "Both tests are widely accepted, but universities and countries have preferences. Here's how to decide which exam gives you the best shot at your target school.",
    category: 'Test Preparation',
    author: 'Efua Mensah',
    authorRole: 'Test Preparation Coach',
    date: 'July 5, 2025',
    readTime: '6 min read',
    emoji: '📝',
    content: [
      {
        type: 'p',
        text: `For most Ghanaian students, the honest answer is: check your target universities' admissions page first, because a growing number now accept either test interchangeably. But if you genuinely have a free choice, the format differences below usually make one test noticeably easier for you than the other.`,
      },
      { type: 'h2', text: 'The Core Format Differences' },
      {
        type: 'list',
        items: [
          'IELTS Speaking is a face-to-face conversation with a real examiner in a separate room, on a separate day or time slot',
          'TOEFL Speaking is entirely computer-based — you speak into a microphone while a timer counts down, with no human in the room',
          'IELTS Listening uses a range of accents (British, Australian, American, Canadian) across the recordings',
          'TOEFL Listening is almost entirely American-accented and set in an academic lecture-hall context',
          'IELTS scores on a 1–9 band scale; TOEFL iBT scores out of 120 total across four sections',
          'TOEFL Reading and Listening questions are more often integrated — you may need to read a passage, then hear a lecture on the same topic, then answer combined questions',
        ],
      },
      { type: 'h2', text: 'Choose IELTS If...' },
      {
        type: 'list',
        items: [
          'You feel more confident having an actual conversation than talking to a screen — many Ghanaian students, coming from an oral-exam-light school system, find a real conversation less intimidating once nerves settle, because the examiner reacts and can rephrase',
          'You\'re applying to the UK, Australia, Canada, Ireland, or New Zealand, where IELTS is often the more familiar and sometimes cheaper option locally',
          'You want the option of IELTS on paper as well as computer-delivered, depending on test centre availability in Accra',
        ],
      },
      { type: 'h2', text: 'Choose TOEFL If...' },
      {
        type: 'list',
        items: [
          'You\'re specifically targeting US universities — TOEFL remains the more universally recognised option across American institutions, though IELTS is now accepted by the vast majority of them too',
          'You find speaking into a microphone alone less stressful than performing in front of a person, and you type/read comfortably on screen',
          'You prefer a fully digital, single-sitting format at a computer testing centre rather than switching between paper and a separate spoken interview slot',
        ],
      },
      { type: 'h2', text: 'Scoring Yourself Honestly Before You Commit' },
      {
        type: 'p',
        text: `Take one full free practice test of each — British Council and IDP both offer free IELTS practice materials, and ETS offers free TOEFL sample questions — under real timed conditions, not casually. Compare not just your score but how anxious each format made you feel. The test that produces a calmer, more confident version of you on test day is usually the right choice, because English proficiency tests measure performance under pressure as much as raw ability.`,
      },
      { type: 'h2', text: 'Preparation Timeline That Actually Works' },
      {
        type: 'list',
        items: [
          'Week 1–2: Diagnostic test + identify your two weakest sections',
          'Week 3–6: Focused daily practice on weak sections (45–60 minutes), light maintenance on strong sections',
          'Week 7–8: Full timed mock tests, 2–3 per week, reviewed in detail afterwards',
          'Final week: Light review only — no new material, focus on rest and exam-day logistics',
        ],
      },
      {
        type: 'tip',
        text: `Book your test date only after your first honest mock score is within striking distance of your target — booking too early just to "lock in motivation" often means paying for a resit.`,
      },
      {
        type: 'p',
        text: `Whichever test you choose, most UK, Canadian, and Australian universities require scores no older than two years at the time you enrol, so time your test around your actual intended intake, not just your application deadline.`,
      },
    ],
  },
  // ---------------------------------------------------------------------
  {
    id: 4,
    slug: 'uk-student-visa-guide',
    title: 'UK Student Visa Guide: CAS, Finances, and the Interview',
    excerpt:
      'Everything Ghanaian applicants need to know about the UK Student visa route — from your CAS number to the credibility interview, financial evidence, and common refusal reasons.',
    category: 'Visa Guidance',
    author: 'Kofi Darko',
    authorRole: 'Visa & Immigration Advisor',
    date: 'June 28, 2025',
    readTime: '10 min read',
    emoji: '🛂',
    content: [
      {
        type: 'p',
        text: `You may still hear people in Ghana refer to a "Tier 4 visa" — that name was retired when the UK moved to its points-based immigration system in December 2020. Today the correct route is simply the "Student visa," but the underlying logic is the same: prove you have a genuine offer, prove you can fund your studies, and prove you intend to study, not settle permanently through the back door.`,
      },
      { type: 'h2', text: 'Step 1: Get Your CAS' },
      {
        type: 'p',
        text: `Once you accept an unconditional offer and pay any required deposit, your university issues a Confirmation of Acceptance for Studies (CAS) — a unique reference number, not a physical document, that contains your course details, tuition fees, and the university's Home Office sponsor licence number. Your CAS is normally valid for six months, and you cannot apply for your visa until it has been issued, so chase your university's international office if it's delayed.`,
      },
      { type: 'h2', text: 'Step 2: Prove Your Finances' },
      {
        type: 'p',
        text: `You must show you can cover one academic year (up to nine months) of tuition, plus a fixed monthly living cost figure set by the Home Office — currently around £1,529 per month if studying in London, and £1,171 per month outside London, for up to nine months. This money must sit in your (or your parent's/guardian's, if they're your financial sponsor) account for a continuous 28-day period, and the bank statement or letter must be dated no more than 31 days before you submit your application. A single day's shortfall in the balance during that 28-day window is one of the most common — and most avoidable — refusal reasons we see.`,
      },
      {
        type: 'list',
        items: [
          'Confirm the exact 28-day balance requirement with your bank before the window starts',
          'If a parent or guardian is sponsoring you, prepare their relationship evidence (birth certificate, sponsorship letter) alongside the bank statement',
          'Keep the account open and untouched until your visa decision arrives — closing it early has caused real refusals',
        ],
      },
      { type: 'h2', text: 'Step 3: Tuberculosis Test' },
      {
        type: 'p',
        text: `Ghana is on the UK's list of countries requiring a TB test for visas longer than six months. Book this only at a Home Office-approved clinic (IOM Ghana runs the official testing in Accra) — a test from any other clinic will not be accepted, and appointment slots can take a few weeks, so book as soon as your CAS is issued.`,
      },
      { type: 'h2', text: 'Step 4: Complete the Online Application and Pay Fees' },
      {
        type: 'list',
        items: [
          'Visa application fee (check the current published rate on gov.uk before paying — it changes periodically)',
          'Immigration Health Surcharge (IHS), paid upfront per year of your course, giving you access to the NHS',
          'Biometric enrolment appointment at the visa application centre in Accra',
        ],
      },
      { type: 'h2', text: 'The Credibility Interview' },
      {
        type: 'p',
        text: `Many Ghanaian applicants are called for a short credibility interview, either in person or by phone. The officer is checking that your course genuinely fits your academic and career history, and that you understand why you chose this specific university and subject — not testing English fluency. Be ready to explain, in your own words: why this course, why this university, how it connects to your previous studies or work, your study plan, and your plan after graduation (including how a Graduate visa or return to Ghana fits in). Rehearsed, memorised answers that don't sound like you are easy for experienced officers to spot.`,
      },
      { type: 'h2', text: 'After Your Visa: The Graduate Route' },
      {
        type: 'p',
        text: `If you complete an eligible bachelor's or master's degree and apply for the Graduate visa on or before 31 December 2026, you currently receive two years of post-study work permission (three years for a PhD) with no sponsor required. From 1 January 2027, that non-doctoral duration is reducing to 18 months under confirmed UK government changes — so if timing is flexible and you're finishing around that period, ask your university whether an earlier graduation and application date is realistic.`,
      },
      {
        type: 'tip',
        text: `Apply for your Student visa as soon as your CAS and finances are ready — you can apply up to six months before your course start date, and early applications reduce the risk of a delayed decision affecting your travel plans.`,
      },
    ],
  },
  // ---------------------------------------------------------------------
  {
    id: 5,
    slug: 'cost-of-living-canada-student-budget',
    title: 'Cost of Living in Canada: A Realistic Budget for Students',
    excerpt:
      "Tuition is just the beginning. We break down the real monthly costs of living in Toronto, Vancouver, and Montreal so you can plan your finances accurately.",
    category: 'Student Life',
    author: 'Abena Osei',
    authorRole: 'Canada Study Programs Advisor',
    date: 'June 20, 2025',
    readTime: '7 min read',
    emoji: '🍁',
    content: [
      {
        type: 'p',
        text: `Canadian study permit applications require you to show proof of funds beyond tuition, and the amount you'll actually need month to month varies enormously by city. A budget built for Toronto will leave a student in Winnipeg overspending, and a budget built for a small Quebec town will badly under-fund a student trying to live in downtown Vancouver.`,
      },
      { type: 'h2', text: 'Monthly Cost Comparison by City' },
      {
        type: 'list',
        items: [
          'Toronto — the most expensive of the three: shared accommodation typically runs CAD 900–1,400/month; expect CAD 2,000–2,800/month total including food, transit, and phone',
          'Vancouver — similarly high housing costs, slightly lower food and transit costs than Toronto; expect a broadly similar total monthly budget',
          'Montreal — noticeably more affordable, particularly for shared housing and groceries; many students report total monthly costs 25–35% lower than Toronto or Vancouver for a comparable lifestyle',
          'Smaller university towns (e.g. parts of Ontario outside the GTA, New Brunswick, Saskatchewan) — often the most affordable overall, sometimes half the cost of Toronto housing',
        ],
      },
      { type: 'h2', text: 'Where the Money Actually Goes' },
      {
        type: 'list',
        items: [
          'Housing: on-campus residence is often pricier but includes utilities and a meal plan; off-campus shared apartments are usually cheaper long-term but require a deposit (often first + last month\'s rent) upfront',
          'Groceries: cooking for yourself typically runs CAD 300–450/month if you shop at value grocers (No Frills, Walmart) rather than premium chains',
          'Transit: most Canadian cities offer discounted monthly student transit passes — factor this in rather than relying on rideshares',
          'Phone and internet: budget mobile plans in Canada are more expensive than in Ghana; a basic prepaid plan still typically runs CAD 35–55/month',
          'Winter clothing: a genuine, often-overlooked one-time cost — a proper winter coat, boots, and layers can run CAD 300–600 in your first year and is not optional in most of Canada',
        ],
      },
      { type: 'h2', text: 'Reducing Costs Without Hurting Your Studies' },
      {
        type: 'list',
        items: [
          'Apply for on-campus housing in your first year — it simplifies budgeting even if it costs slightly more, and gives you time to find reliable roommates for year two',
          'Use your student card for transit, museum, and software discounts — most go unclaimed simply because students don\'t ask',
          'International students can generally work up to 20 hours per week during term time and full-time during scheduled breaks — confirm the current limit on your study permit conditions, as these rules are reviewed periodically',
          'Buy a Canadian SIM only after comparing Freedom Mobile, Fido, and Public Mobile — prices vary more than you\'d expect between providers for the same data allowance',
        ],
      },
      {
        type: 'tip',
        text: `Open a Canadian bank account in your first week — Scotiabank, RBC, and CIBC all run "newcomer" student packages with reduced or waived monthly fees for the first year, which matters when every transaction fee adds up.`,
      },
      {
        type: 'p',
        text: `When budgeting for your study permit application, remember the official minimum the government asks you to show is a floor, not a comfortable living budget — build your real monthly plan around the city-specific figures above, not just the minimum required to get your permit approved.`,
      },
    ],
  },
  // ---------------------------------------------------------------------
  {
    id: 6,
    slug: 'germany-free-tuition-universities-guide',
    title: "Germany's Low-Tuition Universities: What You Need to Know",
    excerpt:
      'Most public universities in Germany charge little to no tuition — but the picture is state by state, not country-wide. Here is the full, accurate breakdown before you apply.',
    category: 'Study Destinations',
    author: 'Yaw Frimpong',
    authorRole: 'Europe Study Programs Advisor',
    date: 'June 15, 2025',
    readTime: '9 min read',
    emoji: '🇩🇪',
    content: [
      {
        type: 'p',
        text: `"Germany is free" is the headline every study-abroad brochure uses, and it's mostly still true — but treating it as a blanket rule causes real disappointment when students discover the specific state or university they've chosen is one of the exceptions. Here's the accurate, current picture.`,
      },
      { type: 'h2', text: 'The Rule: Most Public Universities, Most States' },
      {
        type: 'p',
        text: `Fourteen of Germany's sixteen federal states charge no tuition fees at public universities for bachelor's and master's degrees, for international students exactly the same as German nationals. What you will pay everywhere, tuition-free states included, is a semester contribution (Semesterbeitrag) — typically €150–€350 per semester, which usually bundles in a regional public transport ticket, student union membership, and administrative costs.`,
      },
      { type: 'h2', text: 'The Two Exceptions' },
      {
        type: 'list',
        items: [
          'Baden-Württemberg (home to Heidelberg, Stuttgart, Freiburg, Tübingen, Mannheim, and Karlsruhe Institute of Technology): all public universities in this state charge non-EU/EEA students €1,500 per semester, a policy in place since winter semester 2017/18',
          'Technical University of Munich (TUM), in Bavaria: following a 2023 change to Bavarian higher education law, TUM introduced per-programme fees for non-EU students, ranging roughly from €2,000 to €6,000 per semester depending on the course — other Bavarian universities have not (yet) followed suit',
        ],
      },
      {
        type: 'p',
        text: `Everywhere else — including well-known institutions like LMU Munich, RWTH Aachen, Humboldt Berlin, University of Cologne, and Goethe Frankfurt — you pay only the semester contribution, regardless of nationality.`,
      },
      { type: 'h2', text: 'The Real Cost of Studying in Germany' },
      {
        type: 'list',
        items: [
          'Tuition (14 of 16 states): €0, plus €150–€350/semester contribution',
          'Blocked account (Sperrkonto) for your student visa: you must show funds of roughly €11,900 for the year, held in a designated blocked account that releases a monthly allowance',
          'Accommodation: student dormitories are the cheapest option and heavily oversubscribed — apply through the Studentenwerk of your city the moment you have an admission letter, not after',
          'Health insurance: mandatory for your visa and enrolment, typically €120–€140/month for public statutory insurance',
        ],
      },
      { type: 'h2', text: 'Language Requirements' },
      {
        type: 'p',
        text: `Many master's programmes, especially in engineering, business, and computer science, are taught entirely in English, but bachelor's programmes are still overwhelmingly taught in German. If you're targeting an English-taught programme, still budget time to reach at least conversational German (A2/B1) — it materially affects daily life, part-time work options, and eventually the graduate job market if you plan to stay.`,
      },
      { type: 'h2', text: 'How to Choose a University Strategically' },
      {
        type: 'list',
        items: [
          'If tuition-free study is your top priority, filter out Baden-Württemberg and TUM entirely, and confirm the specific programme\'s language of instruction',
          'Rank your shortlist by city cost of living, not just university reputation — Munich and Frankfurt are notably pricier than Leipzig, Dresden, or Aachen',
          'Check whether your target programme has a "Numerus Clausus" (grade-based admission cap) — competitive programmes like Medicine and Psychology have very high thresholds even without tuition fees as a barrier',
        ],
      },
      {
        type: 'tip',
        text: `Apply for dormitory housing through your city's Studentenwerk on the same day you accept your university offer — the best-value rooms are often gone within weeks of each intake opening.`,
      },
    ],
  },
  // ---------------------------------------------------------------------
  {
    id: 7,
    slug: 'strong-letter-of-recommendation-guide',
    title: 'How to Get a Strong Letter of Recommendation',
    excerpt:
      'A weak recommendation letter can sink an otherwise strong application. Learn how to approach lecturers and employers, and exactly what to include in your briefing document.',
    category: 'Application Tips',
    author: 'Ama Boateng',
    authorRole: 'Senior Admissions Counsellor',
    date: 'June 8, 2025',
    readTime: '5 min read',
    emoji: '📬',
    content: [
      {
        type: 'p',
        text: `Admissions committees read recommendation letters looking for one thing above all else: specific, concrete evidence that someone who has actually worked closely with you vouches for your ability to succeed at the next level. A generic letter — "X is a hardworking and dedicated student" — with no examples signals that the recommender barely knows the applicant, and experienced admissions readers can tell within the first two sentences.`,
      },
      { type: 'h2', text: 'Choose the Right Person, Not the Most Senior One' },
      {
        type: 'p',
        text: `Ghanaian applicants often default to asking the most senior person available — a head of department, a company's managing director — even if that person has barely interacted with them directly. Admissions officers actually prefer letters from someone with direct, sustained contact with your work: the lecturer who supervised your final-year project, the line manager who watched you handle a difficult client, the coach who saw you lead a team through a setback. Seniority means little if the letter has no real content.`,
      },
      { type: 'h2', text: 'Ask at the Right Time, the Right Way' },
      {
        type: 'list',
        items: [
          'Ask at least 4–6 weeks before your deadline — good letters take real time to write well, and asking with two days\' notice produces rushed, generic letters',
          'Ask in person or by video call first, then follow up in writing — this gives the person a natural opportunity to say no gracefully if they don\'t feel they can write a strong letter',
          'Never assume — explicitly ask "would you be able to write me a strong letter of recommendation?" so a hesitant recommender can decline rather than write something lukewarm',
        ],
      },
      { type: 'h2', text: 'Build a Briefing Document — This Is the Part Most Students Skip' },
      {
        type: 'p',
        text: `Even a recommender who knows you well is busy and juggling multiple requests. A well-prepared briefing document is the single highest-leverage thing you can do to improve your letter's quality. Include:`,
      },
      {
        type: 'list',
        items: [
          'The exact programme/scholarship you\'re applying to, and its specific submission deadline and format requirements',
          'Two or three specific projects, assignments, or moments where you worked directly together, with concrete detail — dates, outcomes, what you actually did',
          'Your intended course/career direction, so the letter can connect your past work to your future plans',
          'Your resume/CV and, if relevant, your personal statement draft, so the letter complements rather than repeats it',
          'Any specific qualities the programme explicitly says it looks for (leadership, resilience, research aptitude), so the recommender can address them directly if genuinely true',
        ],
      },
      { type: 'h2', text: 'What Makes a Letter Actually Strong' },
      {
        type: 'list',
        items: [
          'Specific anecdotes over general praise: "In my second-year data structures course, Kofi was the only student who identified an edge case in our group\'s assignment that the rest of the team, myself included, had missed" beats "Kofi is intelligent"',
          'A clear comparison: "One of the top three students I have taught in twelve years" carries real weight because it\'s measurable',
          'Direct address of any weaknesses in your application (a difficult semester, a lower grade) with honest context, rather than pretending they don\'t exist',
        ],
      },
      {
        type: 'tip',
        text: `Send a genuine thank-you note after your letter is submitted, and let your recommender know the outcome once you hear back — this matters more than it seems, especially if you\'ll need another letter from them in future.`,
      },
    ],
  },
  // ---------------------------------------------------------------------
  {
    id: 8,
    slug: 'adjusting-to-life-abroad-tips',
    title: 'Adjusting to Life Abroad: Tips from Ghanaian Students',
    excerpt:
      'Culture shock is real. Practical, honest advice — drawn from Ghanaian students currently studying in the UK, US, and Canada — on their first months abroad and how they found their footing.',
    category: 'Student Life',
    author: 'Efua Mensah',
    authorRole: 'Student Wellbeing Advisor',
    date: 'May 30, 2025',
    readTime: '11 min read',
    emoji: '🌍',
    content: [
      {
        type: 'p',
        text: `Almost every Ghanaian student we've worked with describes the same pattern: the first two weeks abroad feel exciting and new, weeks three to eight often bring a real low point — homesickness, exhaustion, and a creeping sense that everything is harder than it should be — before things genuinely settle by the second semester. Knowing this pattern in advance makes it far easier to get through, because it stops feeling like something has gone specifically wrong for you.`,
      },
      { type: 'h2', text: 'The Weather Hits Harder Than You Expect' },
      {
        type: 'p',
        text: `No amount of watching YouTube videos about winter fully prepares you for your first proper cold snap. Beyond buying real winter clothing (not just "warm-looking" clothing — check the actual insulation rating), many students underestimate how much darker winter days affect mood. If you notice persistent low energy or low mood during the darker months, this is common enough that most UK, Canadian, and US universities have specific student wellbeing services for it — using them early is far more effective than pushing through alone.`,
      },
      { type: 'h2', text: 'Food, and Why It Matters More Than You\'d Think' },
      {
        type: 'list',
        items: [
          'Locate African/Caribbean grocery shops near your campus in your first week, not your third month — most cities have at least one, often more than you\'d expect',
          'Learn to cook 3–4 staple Ghanaian dishes before you leave if you haven\'t already — the comfort of a familiar meal on a hard day is not a small thing',
          'Join or start a Ghanaian/African students\' association WhatsApp group before you even arrive — returning students are usually the fastest way to find where to shop and eat',
        ],
      },
      { type: 'h2', text: 'The Loneliness Curve Is Real — Plan For It, Don\'t Just Endure It' },
      {
        type: 'list',
        items: [
          'Join at least one society or club in your first two weeks, even if it feels awkward — friendships formed in week one make weeks four to eight far more manageable',
          'Schedule a fixed weekly call home rather than calling only when you\'re struggling — a regular rhythm is more stabilising than reactive, distress-driven calls',
          'Say yes to social invitations more often than feels natural in your first month — the instinct to withdraw when overwhelmed is understandable but tends to deepen isolation',
        ],
      },
      { type: 'h2', text: 'Academic Culture Shock Is Underrated' },
      {
        type: 'p',
        text: `Many Ghanaian students describe the academic adjustment as harder than the social one. UK and North American universities generally expect far more independent reading and original argument than WASSCE-style education, and lecturers will not chase you if you fall behind — that responsibility sits entirely with you. If your first assignment grade is lower than you expected, this is extremely common in the first semester and rarely reflects your actual ability; use your university's academic writing centre and your tutor's office hours immediately rather than waiting until grades slip further.`,
      },
      { type: 'h2', text: 'Money Stress Is Manageable With a System' },
      {
        type: 'list',
        items: [
          'Set up automatic weekly, not monthly, spending limits on your own tracking — weekly budgets are far easier to course-correct than discovering a monthly overspend too late',
          'Register with your university\'s financial aid or hardship office as soon as you arrive, even if you don\'t need it yet, so you know exactly how to access support if things get tight later',
          'Be upfront with roommates about your budget from day one — shared grocery runs and split subscriptions cause less friction when expectations are clear early',
        ],
      },
      { type: 'h2', text: 'Practical Advice Ghanaian Students Consistently Repeat' },
      {
        type: 'list',
        items: [
          'Register with a local doctor/GP in your first week, before you actually need one — registering while sick takes far longer',
          'Keep digital and physical copies of every important document (passport, visa, CAS/I-20, insurance) in at least two separate places',
          'Give yourself permission to have a genuinely bad week without treating it as proof you\'ve made the wrong decision — it almost never is',
        ],
      },
      {
        type: 'tip',
        text: `If low mood, anxiety, or homesickness are affecting your daily functioning for more than a couple of weeks, speak to your university's counselling service — it is free, confidential, and exists specifically for this. Reaching out early is a sign of good judgement, not weakness.`,
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(current: BlogPost, count: number = 3): BlogPost[] {
  const sameCategory = posts.filter((p) => p.slug !== current.slug && p.category === current.category);
  const others = posts.filter((p) => p.slug !== current.slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}

export const categories = [
  'All',
  'Application Tips',
  'Scholarships',
  'Test Preparation',
  'Visa Guidance',
  'Student Life',
  'Study Destinations',
];
