import React from 'react';

const team = [
  {
    emoji: '👨🏿‍💼',
    name: 'Solomon Opoku',
    role: 'CEO & Founder',
    bio: 'Visionary leader with extensive experience in international education consulting.',
    skills: ['University Selection', 'Career Counseling', 'Strategic Partnerships'],
  },
  {
    emoji: '👩🏿‍💼',
    name: 'Esther Abeka Thompson',
    role: 'Deputy General Manager / Counselor',
    bio: "Expert counselor providing comprehensive guidance for students\' academic journeys.",
    skills: ['Student Counseling', 'Academic Planning', 'Career Development'],
  },
  {
    emoji: '👨🏿‍💼',
    name: 'Raphael Hanson',
    role: 'Admissions / Visa Assistant Manager',
    bio: 'Specialist in admissions and visa processing with exceptional success rate.',
    skills: ['Visa Applications', 'Admissions Support', 'Documentation'],
  },
  {
    emoji: '👨🏿‍💼',
    name: 'Seth Acheampong',
    role: 'Enrollment Officer / BDO',
    bio: 'Dedicated enrollment officer focused on student success and business development.',
    skills: ['Student Enrollment', 'Business Development', 'Client Relations'],
  },
  {
    emoji: '👨🏿‍💼',
    name: 'Emmanuel Bawuah',
    role: 'Business Development Officer',
    bio: 'Strategic business development professional expanding partnership opportunities.',
    skills: ['Partnership Development', 'Market Expansion', 'Client Acquisition'],
  },
  {
    emoji: '👨🏿‍💼',
    name: 'Benjamin Anane-Agyei',
    role: 'Test Prep Coordinator',
    bio: 'Expert test preparation coordinator helping students achieve their best scores.',
    skills: ['IELTS', 'GRE', 'GMAT', 'Test Strategy'],
  },
];

export default function TeamSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Expert counselors dedicated to your success</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team?.map((member) => (
            <div
              key={member?.name}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="text-6xl mb-4 text-center">{member?.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{member?.name}</h3>
              <p className="text-indigo-600 font-semibold mb-3 text-center">{member?.role}</p>
              <p className="text-gray-600 text-sm mb-4">{member?.bio}</p>
              <div className="flex flex-wrap gap-2">
                {member?.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
