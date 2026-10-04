import React from 'react';

type Member = { name: string; role: string; bio: string; skills: string[]; image?: string };

// To add a photo: save a 4:5 portrait in public/team/ and set image: '/team/file.jpg' on the member.
const team: Member[] = [
  { name: 'Solomon Opoku', role: 'CEO & Founder', bio: 'Visionary leader with extensive experience in international education consulting.', skills: ['University Selection', 'Career Counseling', 'Strategic Partnerships'] },
  { name: 'Esther Abeka Thompson', role: 'Deputy General Manager / Counselor', bio: "Expert counselor providing comprehensive guidance for students' academic journeys.", skills: ['Student Counseling', 'Academic Planning', 'Career Development'], image: '/team/esther-thompson.jpg' },
  { name: 'Raphael Hanson', role: 'Admissions / Visa Assistant Manager', bio: 'Specialist in admissions and visa processing with exceptional success rate.', skills: ['Visa Applications', 'Admissions Support', 'Documentation'] },
  { name: 'Benjamin Anane-Agyei', role: 'Test Prep Coordinator', bio: 'Expert test preparation coordinator helping students achieve their best scores.', skills: ['IELTS', 'GRE', 'GMAT', 'Test Strategy'] },
];

const initials = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');

export default function TeamSection() {
  return (
    <section className="py-28 bg-white" id="team">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-indigo-900">Meet Our Team</h2>
          <p className="mt-5 text-xl text-gray-600">Expert counselors dedicated to your success.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <article key={m.name} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-indigo-800 to-indigo-600 ring-1 ring-indigo-900/10 shadow-xl shadow-indigo-900/10">
                {m.image ? (
                  <img src={m.image} alt={m.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="font-display text-7xl font-semibold text-gold-300/90">{initials(m.name)}</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-indigo-900 via-indigo-900/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="block h-[3px] w-8 bg-gold-400 mb-3 transition-all duration-500 group-hover:w-16" />
                  <h3 className="font-display text-xl font-semibold text-white leading-snug">{m.name}</h3>
                  <p className="text-sm text-indigo-100 mt-1">{m.role}</p>
                </div>
              </div>
              <p className="mt-5 text-gray-600 text-sm leading-relaxed">{m.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.skills.map((s) => <span key={s} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">{s}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
