import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import MottoVisionMission from '@/components/MottoVisionMission';
import CoreValues from '@/components/CoreValues';
import LeadCaptureSection from '@/components/LeadCaptureSection';
import ServicesSection from '@/components/ServicesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CountriesSection from '@/components/CountriesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContentUpdatesSection from '@/components/ContentUpdatesSection';
import CEOTravelsSection from '@/components/CEOTravelsSection';
import TeamSection from '@/components/TeamSection';
import UniversitiesSection from '@/components/UniversitiesSection';
import InternshipBanner from '@/components/InternshipBanner';
import FAQSection from '@/components/FAQSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <MottoVisionMission />
      <CoreValues />
      <LeadCaptureSection />
      <ServicesSection />
      <HowItWorksSection />
      <CountriesSection />
      <CEOTravelsSection preview />
      <ContentUpdatesSection />
      <TestimonialsSection />
      <TeamSection />
      <UniversitiesSection />
      <InternshipBanner />
      <FAQSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
