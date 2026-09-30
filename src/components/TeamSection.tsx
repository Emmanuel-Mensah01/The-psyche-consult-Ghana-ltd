import React from 'react';
import TeamAvatar from '@/components/TeamAvatar';

const team = [
  {
    color: 'from-indigo-500 to-purple-600',
    // image: '/team/solomon-opoku.jpg',
    name: 'Solomon Opoku',
    role: 'CEO & Founder',
    bio: 'Visionary leader with extensive experience in international education consulting.',
    skills: ['University Selection', 'Career Counseling', 'Strategic Partnerships'],
  },
  {
    color: 'from-purple-500 to-pink-500',
    // image: '/team/esther-thompson.jpg',
    name: 'Esther Abeka Thompson',
    role: 'Deputy General Manager / Counselor',
    bio: "Expert counselor providing comprehensive guidance for students\' academic journeys.",
    skills: ['Student Counseling', 'Academic Planning', 'Career Development'],
  },
  {
    color: 'from-blue-500 to-indigo-600',
    // image: '/team/raphael-hanson.jpg',
    name: 'Raphael Hanson',
    role: 'Admissions / Visa Assistant Manager',
    bio: 'Specialist in admissions and visa processing with exceptional success rate.',
    skills: ['Visa Applications', 'Admissions Support', 'Documentation'],
  },
  {
    color: 'from-teal-500 to-emerald-600',
    // image: '/team/benjamin-anane-agyei.jpg',
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
              <div className="flex justify-center mb-4">
                <TeamAvatar name={member?.name} colorClass={member?.color} className="w-28 h-28" image={(member as { image?: string })?.image} />
              </div>
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
