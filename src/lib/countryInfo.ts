// Country guides shown on /countries/[slug].
// Edit the text here to change what students see. Keep figures approximate — rules and fees change often,
// so the page tells students that their counselor confirms current requirements.

export interface CountryInfo {
  slug: string;
  name: string;
  flag: string;
  tagline: string;
  overview: string;
  language: string;
  currency: string;
  intakes: string[];
  tuition: string;
  living: string;
  duration: string;
  whyStudy: string[];
  popularFields: string[];
  requirements: string[];
  visaSteps: { title: string; text: string }[];
  workRights: string;
  postStudy: string;
  faqs: { q: string; a: string }[];
}

const commonRequirements = [
  'Valid international passport',
  'Academic transcripts and certificates (WASSCE for undergraduate entry; degree certificate and transcript for postgraduate)',
  'Proof of English proficiency (IELTS, TOEFL, Duolingo or the school’s own test) unless exempt',
  'Statement of purpose and CV / résumé where required',
  'Recommendation letters (mainly for postgraduate programmes)',
  'Proof of funds and sponsor documents',
];

export const countryInfo: Record<string, CountryInfo> = {
  'united-states': {
    slug: 'united-states',
    name: 'United States',
    flag: '🇺🇸',
    tagline: 'The widest choice of universities, programmes and scholarships in the world.',
    overview:
      'The US has thousands of universities, from large public research institutions to small private colleges and pathway programmes. Students can mix subjects, change majors, and take part in research and internships from early on.',
    language: 'English',
    currency: 'US Dollar (USD)',
    intakes: ['Fall (Aug–Sep) — main intake', 'Spring (Jan)', 'Summer at some schools'],
    tuition: 'Roughly US$20,000–US$45,000 per year (higher at top private universities)',
    living: 'Roughly US$12,000–US$20,000 per year depending on the city',
    duration: 'Bachelor’s 4 years · Master’s 1–2 years',
    whyStudy: [
      'Huge variety of institutions, programmes and campus lifestyles',
      'Flexible degrees — you can explore before choosing a major',
      'Strong research, internship and co-op opportunities',
      'Merit scholarships and assistantships available at many schools',
      'STEM graduates may qualify for extended work training after study',
    ],
    popularFields: ['Business & Finance', 'Computer Science & IT', 'Engineering', 'Health Sciences & Nursing', 'Data Science', 'Media & Design'],
    requirements: [...commonRequirements, 'SAT/ACT or GRE/GMAT only where the school requires them (many do not)'],
    visaSteps: [
      { title: 'Get admitted', text: 'Accept your offer and receive the I-20 form from your university.' },
      { title: 'Pay the SEVIS fee', text: 'Pay the SEVIS I-901 fee and keep your receipt.' },
      { title: 'Complete the DS-160', text: 'Fill in the online visa application and book your visa appointment.' },
      { title: 'Attend the interview', text: 'Bring your I-20, admission letter, financial documents and passport. Be ready to explain your study plan.' },
    ],
    workRights: 'F-1 students can generally work on campus during term. Off-campus work needs specific authorisation.',
    postStudy: 'Optional Practical Training (OPT) lets graduates work in their field, with an extension available for STEM degrees.',
    faqs: [
      { q: 'Can I get a scholarship?', a: 'Yes. Many US universities award merit scholarships to international students. Your counselor will point you to schools that match your grades and budget.' },
      { q: 'Do I need the SAT or GRE?', a: 'Many universities are test-optional. Requirements differ by school and programme, so we check each one for you.' },
    ],
  },

  'united-kingdom': {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    tagline: 'Globally respected degrees, completed faster.',
    overview:
      'UK universities are known for academic quality and shorter courses: most bachelor’s degrees take 3 years and many master’s degrees just 1 year, which saves both time and money.',
    language: 'English',
    currency: 'Pound Sterling (GBP)',
    intakes: ['September — main intake', 'January', 'Some universities also offer May'],
    tuition: 'Roughly £12,000–£30,000 per year (medicine and some specialised courses cost more)',
    living: 'Roughly £10,000–£15,000 per year; London is more expensive',
    duration: 'Bachelor’s 3 years · Master’s 1 year',
    whyStudy: [
      'Short, intensive degrees — 1-year master’s programmes',
      'Internationally recognised universities and qualifications',
      'Foundation and pathway programmes for students who need extra preparation',
      'Strong links with industry and professional bodies',
      'A graduate route to work after study (subject to current rules)',
    ],
    popularFields: ['Business & Management', 'Law', 'Computer Science', 'Engineering', 'Health & Social Care', 'Creative Arts'],
    requirements: [...commonRequirements, 'Personal statement (UCAS statement for many undergraduate applications)'],
    visaSteps: [
      { title: 'Receive your offer', text: 'Accept the offer and meet any conditions.' },
      { title: 'Get your CAS', text: 'The university issues a Confirmation of Acceptance for Studies (CAS) once you accept and pay any deposit.' },
      { title: 'Prepare finances', text: 'Show the required funds for tuition and living costs, held for the required period.' },
      { title: 'Apply online', text: 'Submit the Student visa application, pay the fee and Immigration Health Surcharge, and book biometrics.' },
    ],
    workRights: 'Students at degree level can usually work part-time during term and full-time in holidays, within set hour limits.',
    postStudy: 'The Graduate Route allows eligible graduates to stay and work after finishing their degree. Rules change, so your counselor confirms the current terms.',
    faqs: [
      { q: 'Do I need a foundation year?', a: 'Not always. If your WASSCE results do not meet direct entry for a bachelor’s degree, an international foundation programme is a common route.' },
      { q: 'Can I bring my family?', a: 'Dependants are now restricted for most taught courses. Check with your counselor before planning to bring family.' },
    ],
  },

  canada: {
    slug: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    tagline: 'Quality education, a safe multicultural society and work opportunities after study.',
    overview:
      'Canada combines respected public colleges and universities with a welcoming, multicultural environment. Colleges offer practical, career-focused diplomas and degrees; universities offer research-led degrees.',
    language: 'English and French',
    currency: 'Canadian Dollar (CAD)',
    intakes: ['September — main intake', 'January', 'May at some institutions'],
    tuition: 'Roughly CAD 15,000–CAD 35,000 per year',
    living: 'Roughly CAD 15,000–CAD 22,000 per year',
    duration: 'Diploma 1–2 years · Bachelor’s 3–4 years · Master’s 1–2 years',
    whyStudy: [
      'High quality of life and safe, welcoming cities',
      'Practical college programmes with co-op / work placements',
      'Post-graduation work permit options for eligible graduates',
      'More affordable than the US or UK for many programmes',
      'Strong in technology, health, business and trades',
    ],
    popularFields: ['Business', 'Information Technology', 'Health Sciences', 'Engineering Technology', 'Hospitality & Tourism', 'Trades'],
    requirements: [...commonRequirements, 'Letter of explanation (why Canada, why this programme)'],
    visaSteps: [
      { title: 'Get your Letter of Acceptance', text: 'Receive an offer from a designated learning institution (DLI).' },
      { title: 'Provincial attestation', text: 'Where required, obtain the provincial attestation letter before applying for the permit.' },
      { title: 'Apply for a study permit', text: 'Submit your application online with proof of funds, your acceptance letter and supporting documents.' },
      { title: 'Biometrics & decision', text: 'Give biometrics, wait for the decision, then receive your port-of-entry letter.' },
    ],
    workRights: 'Study-permit holders can generally work part-time off campus during term within government-set hours.',
    postStudy: 'Eligible graduates from qualifying programmes can apply for a Post-Graduation Work Permit (PGWP). Eligibility rules change, so we confirm current ones.',
    faqs: [
      { q: 'College or university?', a: 'Colleges are more hands-on and career-focused; universities are more academic. Your counselor will match this to your goals and budget.' },
      { q: 'Is IELTS compulsory?', a: 'Most schools require an English test. Some accept alternatives such as Duolingo or their own test.' },
    ],
  },

  australia: {
    slug: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    tagline: 'Top-ranked universities, sunny lifestyle and structured work options.',
    overview:
      'Australia has a strong reputation for teaching quality, particularly in health, engineering, business and hospitality, with support services designed for international students.',
    language: 'English',
    currency: 'Australian Dollar (AUD)',
    intakes: ['February/March — main intake', 'July', 'Some providers also offer November'],
    tuition: 'Roughly AUD 20,000–AUD 45,000 per year',
    living: 'Roughly AUD 25,000+ per year depending on the city',
    duration: 'Bachelor’s 3 years · Master’s 1.5–2 years',
    whyStudy: [
      'Several universities ranked among the world’s best',
      'Pathway and diploma routes into university degrees',
      'Mandatory student support and overseas student health cover',
      'Strong demand for graduates in health, engineering and IT',
      'Work-integrated learning and internships',
    ],
    popularFields: ['Nursing & Health', 'Engineering', 'Information Technology', 'Business & Accounting', 'Hospitality Management', 'Education'],
    requirements: [...commonRequirements, 'Genuine Student statement (why Australia and this course)'],
    visaSteps: [
      { title: 'Accept your offer', text: 'Pay the deposit and receive your electronic Confirmation of Enrolment (CoE).' },
      { title: 'Arrange health cover', text: 'Buy Overseas Student Health Cover (OSHC) for the length of your visa.' },
      { title: 'Apply for the Student visa', text: 'Lodge your application online with your CoE, funds evidence and Genuine Student statement.' },
      { title: 'Health checks & decision', text: 'Complete any required medical checks and biometrics, then wait for the outcome.' },
    ],
    workRights: 'Student visa holders can work limited hours during study, with different rules in scheduled breaks.',
    postStudy: 'Eligible graduates can apply for a Temporary Graduate visa. Conditions depend on your qualification and change over time.',
    faqs: [
      { q: 'What is the Genuine Student requirement?', a: 'A statement showing you intend to study, with clear reasons for your course and provider. We help you prepare it.' },
      { q: 'Which intake should I choose?', a: 'February is the main intake with the widest course choice. July is a good second option.' },
    ],
  },

  germany: {
    slug: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    tagline: 'World-class engineering education with low or no tuition at public universities.',
    overview:
      'Germany is famous for engineering, technology and applied sciences. Public universities charge little or no tuition for most programmes, while private universities and universities of applied sciences offer more English-taught options.',
    language: 'German and English (many English-taught programmes)',
    currency: 'Euro (EUR)',
    intakes: ['Winter (Oct) — main intake', 'Summer (Apr)'],
    tuition: 'Public universities: low or no tuition (some states charge fees for non-EU students) · Private universities: roughly €5,000–€20,000+ per year',
    living: 'Roughly €10,000–€13,000 per year',
    duration: 'Bachelor’s 3–4 years · Master’s 1–2 years',
    whyStudy: [
      'Very low tuition at public universities',
      'Excellent reputation in engineering, technology and applied sciences',
      'Growing number of English-taught degrees',
      'Long job-seeking period after graduation',
      'Central location for travel across Europe',
    ],
    popularFields: ['Engineering', 'Computer Science', 'Business Administration', 'Natural Sciences', 'Design & Media', 'Applied Sciences'],
    requirements: [...commonRequirements, 'Uni-assist / APS certificate verification where required for your country', 'German language proof for German-taught programmes'],
    visaSteps: [
      { title: 'Receive admission', text: 'Get your admission letter from a German university.' },
      { title: 'Prove your finances', text: 'Open a blocked account or provide another accepted proof of financial resources.' },
      { title: 'Health insurance', text: 'Arrange German-recognised health insurance.' },
      { title: 'Apply for the visa', text: 'Book an appointment at the German embassy with your documents and attend the visa interview.' },
    ],
    workRights: 'International students may work a limited number of days per year alongside their studies.',
    postStudy: 'Graduates can apply for a residence permit of up to 18 months to look for work related to their degree.',
    faqs: [
      { q: 'Do I need to speak German?', a: 'Not for English-taught programmes, but basic German makes daily life and part-time work much easier.' },
      { q: 'Is study really free?', a: 'Many public universities charge only small semester fees. Private universities charge tuition. You still need to show funds for living costs.' },
    ],
  },

  france: {
    slug: 'france',
    name: 'France',
    flag: '🇫🇷',
    tagline: 'Business, fashion, design and culinary excellence in the heart of Europe.',
    overview:
      'France offers renowned business schools, design and fashion institutes, engineering schools and public universities, with a growing number of programmes taught in English.',
    language: 'French and English (many English-taught programmes)',
    currency: 'Euro (EUR)',
    intakes: ['September/October — main intake', 'January/February at some schools'],
    tuition: 'Public universities: roughly €2,800–€3,800 per year for non-EU students · Private business/design schools: roughly €6,000–€20,000 per year',
    living: 'Roughly €9,000–€14,000 per year; Paris is higher',
    duration: 'Bachelor’s 3 years · Master’s 2 years',
    whyStudy: [
      'World-famous business, fashion, design and culinary schools',
      'Affordable public tuition compared with the UK or US',
      'Many English-taught programmes',
      'Rich culture and easy travel across Europe',
      'Paid internships and work-study (alternance) options',
    ],
    popularFields: ['Business & Management', 'Fashion & Design', 'Culinary Arts & Hospitality', 'Engineering', 'Luxury Management', 'Arts & Media'],
    requirements: [...commonRequirements, 'Campus France procedure where applicable', 'French language proof for French-taught programmes'],
    visaSteps: [
      { title: 'Get admitted', text: 'Receive your acceptance letter from the school or university.' },
      { title: 'Complete the Campus France procedure', text: 'Create your account and complete the pre-registration steps where required.' },
      { title: 'Apply for the long-stay student visa', text: 'Book your appointment with the visa application centre and submit your documents.' },
      { title: 'Validate on arrival', text: 'Validate your visa online after arriving in France.' },
    ],
    workRights: 'Students can work part-time within a yearly hour limit alongside their studies.',
    postStudy: 'Master’s graduates can apply for a temporary residence permit to search for or start work related to their studies.',
    faqs: [
      { q: 'Do I need French?', a: 'Not for English-taught programmes, but learning French is a big advantage for daily life and internships.' },
      { q: 'What are grandes écoles?', a: 'Selective, specialised schools for business and engineering. Many partner schools listed on this site are of this type.' },
    ],
  },

  netherlands: {
    slug: 'netherlands',
    name: 'Netherlands',
    flag: '🇳🇱',
    tagline: 'Innovative, English-taught education in a highly international setting.',
    overview:
      'The Netherlands offers hundreds of English-taught programmes in a practical, small-group teaching style. Universities of applied sciences focus on hands-on learning, while research universities are more academic.',
    language: 'Dutch and English (very widely spoken)',
    currency: 'Euro (EUR)',
    intakes: ['September — main intake', 'February at some institutions'],
    tuition: 'Roughly €8,000–€20,000 per year for non-EU students',
    living: 'Roughly €10,000–€15,000 per year',
    duration: 'Bachelor’s 3–4 years · Master’s 1–2 years',
    whyStudy: [
      'Large choice of English-taught programmes',
      'Practical, project-based learning',
      'Very international student community',
      'Orientation year for graduates to look for work',
      'Excellent transport links across Europe',
    ],
    popularFields: ['Business & International Management', 'Engineering & Technology', 'Hospitality Management', 'Design & Architecture', 'Logistics', 'IT'],
    requirements: [...commonRequirements, 'Some programmes require a motivation letter or entrance assessment'],
    visaSteps: [
      { title: 'Receive admission', text: 'Get your admission letter from the institution.' },
      { title: 'Institution files your permit', text: 'The school usually applies to the immigration service for your residence permit on your behalf.' },
      { title: 'Collect entry visa', text: 'Where needed, collect your entry visa (MVV) at the Dutch embassy.' },
      { title: 'Arrive and register', text: 'Register with your municipality and complete permit formalities after arrival.' },
    ],
    workRights: 'Students may work part-time alongside their studies within permitted limits.',
    postStudy: 'Graduates can apply for the orientation year (zoekjaar) to look for work or start a business.',
    faqs: [
      { q: 'Who applies for my permit?', a: 'In most cases your institution submits the residence permit application for you after you meet the financial requirements.' },
      { q: 'Is it affordable?', a: 'Tuition is moderate compared with the UK or US, but housing in big cities can be tight, so plan early.' },
    ],
  },

  ireland: {
    slug: 'ireland',
    name: 'Ireland',
    flag: '🇮🇪',
    tagline: 'English-speaking, friendly and home to Europe’s tech and pharma headquarters.',
    overview:
      'Ireland is an English-speaking EU country with a strong reputation for friendliness. Many global technology, finance and pharmaceutical companies have European bases there, which supports internships and graduate jobs.',
    language: 'English (and Irish)',
    currency: 'Euro (EUR)',
    intakes: ['September — main intake', 'January at some institutions'],
    tuition: 'Roughly €10,000–€25,000 per year (medicine costs more)',
    living: 'Roughly €10,000–€14,000 per year; Dublin is higher',
    duration: 'Bachelor’s 3–4 years · Master’s 1–2 years',
    whyStudy: [
      'English-speaking and welcoming to international students',
      'Major tech, pharma and finance employers',
      'Short master’s programmes',
      'Post-study stay-back scheme for eligible graduates',
      'Safe and compact student cities',
    ],
    popularFields: ['Computer Science & Data', 'Business & Finance', 'Pharmaceutical Sciences', 'Engineering', 'Health Sciences', 'Creative Media'],
    requirements: [...commonRequirements, 'Proof of health insurance and accommodation plan'],
    visaSteps: [
      { title: 'Accept your offer', text: 'Pay any deposit and obtain your letter of acceptance.' },
      { title: 'Apply for the study visa', text: 'Where a visa is required, apply online through the Irish immigration system with your documents and funds proof.' },
      { title: 'Biometrics', text: 'Submit documents and biometrics as instructed.' },
      { title: 'Register after arrival', text: 'Register with immigration authorities to receive your residence permission.' },
    ],
    workRights: 'Students on eligible courses can work part-time during term within set hour limits.',
    postStudy: 'Eligible graduates can apply to the Graduate Programme (stay-back scheme) to seek employment in Ireland.',
    faqs: [
      { q: 'Do I need a visa?', a: 'Ghanaian students normally do. Your counselor will confirm the process for your intake.' },
      { q: 'Is the cost of living high?', a: 'Housing in Dublin is expensive. Other cities like Cork, Galway and Limerick are usually cheaper.' },
    ],
  },

  'new-zealand': {
    slug: 'new-zealand',
    name: 'New Zealand',
    flag: '🇳🇿',
    tagline: 'Safe, beautiful and known for high-quality, practical education.',
    overview:
      'New Zealand offers universities, institutes of technology and specialised schools in a safe environment. Its education system is British-based, with a strong focus on practical skills and student wellbeing.',
    language: 'English',
    currency: 'New Zealand Dollar (NZD)',
    intakes: ['February — main intake', 'July'],
    tuition: 'Roughly NZD 22,000–NZD 35,000 per year',
    living: 'Roughly NZD 20,000 per year',
    duration: 'Bachelor’s 3 years · Master’s 1–2 years',
    whyStudy: [
      'Safe, welcoming and beautiful country',
      'Internationally recognised universities and qualifications',
      'Small classes and strong pastoral care',
      'Work options after study for eligible graduates',
      'Strong in agriculture, hospitality, tourism and engineering',
    ],
    popularFields: ['Hospitality & Tourism', 'Agriculture & Environment', 'Engineering', 'Business', 'Health Sciences', 'IT'],
    requirements: commonRequirements,
    visaSteps: [
      { title: 'Get an offer of place', text: 'Receive your offer from an approved institution and accept it.' },
      { title: 'Prepare funds and insurance', text: 'Gather proof of funds and arrange approved health and travel insurance.' },
      { title: 'Apply for the student visa', text: 'Apply online through Immigration New Zealand with your documents.' },
      { title: 'Decision and travel', text: 'Complete any medical or police checks requested and travel once approved.' },
    ],
    workRights: 'Student visa holders can usually work limited hours during term, and more in scheduled breaks.',
    postStudy: 'Eligible graduates may apply for a post-study work visa. Conditions depend on your qualification level and location.',
    faqs: [
      { q: 'Which intake is best?', a: 'February is the main intake. July is available for many programmes.' },
      { q: 'Is it cheaper than Australia?', a: 'Costs are broadly similar. Your counselor can compare specific schools against your budget.' },
    ],
  },

  singapore: {
    slug: 'singapore',
    name: 'Singapore',
    flag: '🇸🇬',
    tagline: 'A leading Asian education hub with strong global connections.',
    overview:
      'Singapore is a safe, modern and highly connected education hub. Universities and private institutes deliver internationally recognised degrees, often in partnership with top universities abroad.',
    language: 'English (plus Mandarin, Malay, Tamil)',
    currency: 'Singapore Dollar (SGD)',
    intakes: ['August — main intake', 'January'],
    tuition: 'Roughly SGD 15,000–SGD 40,000 per year depending on institution',
    living: 'Roughly SGD 10,000–SGD 15,000 per year',
    duration: 'Bachelor’s 3–4 years · Master’s 1–2 years',
    whyStudy: [
      'Safe, clean and English-speaking',
      'Gateway to Asia’s major business hubs',
      'Degrees delivered with partner universities from abroad',
      'Strong in business, finance, engineering and hospitality',
      'Excellent public transport and healthcare',
    ],
    popularFields: ['Business & Finance', 'Hospitality Management', 'Engineering', 'Information Technology', 'Design & Media', 'Life Sciences'],
    requirements: commonRequirements,
    visaSteps: [
      { title: 'Get admitted', text: 'Receive your offer from an approved institution.' },
      { title: 'Institution starts your pass', text: 'The institution submits your Student’s Pass application on your behalf.' },
      { title: 'In-principle approval', text: 'Receive your in-principle approval letter.' },
      { title: 'Collect your pass', text: 'Complete formalities and medical checks in Singapore to receive your Student’s Pass.' },
    ],
    workRights: 'Students at approved institutions may take limited part-time work in permitted circumstances.',
    postStudy: 'Graduates can seek employment and apply for suitable work passes based on their job offer and qualifications.',
    faqs: [
      { q: 'Is Singapore expensive?', a: 'Living costs are moderate compared with the UK, US or Australia, though housing can be pricey. Your counselor can help you compare.' },
      { q: 'Are the degrees recognised abroad?', a: 'Yes. Many programmes are delivered in partnership with respected universities overseas.' },
    ],
  },
};
