'use client';
import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How long does the entire process take?',
    answer: 'The timeline varies depending on your destination and program. Typically, the process takes 3-6 months from initial consultation to receiving your visa. We recommend starting at least 6-12 months before your intended start date to ensure ample time for all requirements.',
  },
  {
    question: 'Do I need to visit your office in person?',
    answer: 'No, you do not need to visit in person. We offer comprehensive online consultations via video call, email, and WhatsApp. However, you are always welcome to visit our offices in Kumasi or Accra for face-to-face meetings.',
  },
  {
    question: 'What are your service fees?',
    answer: 'Our service fees vary depending on the package and destination country. We offer competitive and transparent pricing with no hidden costs. Contact us for a free initial consultation where we can discuss your specific needs and provide a detailed fee structure.',
  },
  {
    question: 'Can you help with scholarship applications?',
    answer: 'Absolutely! We have a dedicated scholarship advisory service. Our team helps identify scholarships you qualify for, assists with scholarship essays and applications, and guides you through the entire scholarship process to maximize your chances of funding.',
  },
  {
    question: 'What if my application is rejected?',
    answer: 'We have a 98% success rate, but in the rare case of rejection, we do not give up. We analyze the reasons for rejection, help you strengthen your application, and reapply or explore alternative universities and programs that match your profile.',
  },
  {
    question: 'Do you provide post-arrival support?',
    answer: 'Yes! Our support does not end when you board the plane. We provide pre-departure orientation, connect you with our alumni network in your destination country, and offer ongoing support for accommodation, banking, and settling into your new academic life.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Get answers to common questions about studying abroad</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-gray-900 pr-8">{faq.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
