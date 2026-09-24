import React from 'react';

const stats = [
  { value: '500+', label: 'Students Placed' },
  { value: '452+', label: 'Partner Universities' },
  { value: '15+', label: 'Countries' },
  { value: '98%', label: 'Success Rate' },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats?.map((stat) => (
            <div key={stat?.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat?.value}</div>
              <div className="text-indigo-100 font-medium">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
