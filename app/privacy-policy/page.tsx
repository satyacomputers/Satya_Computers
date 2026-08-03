'use client';

import { storeInfo } from '@/data/store-info';
import { motion } from 'framer-motion';
import GrainOverlay from '@/components/ui/GrainOverlay';
import { ShieldCheck, UserCheck, Search, Database, Mail, Globe, Cpu, Laptop, Phone, MapPin, MousePointer2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="min-h-screen bg-white relative pb-32">
       <GrainOverlay opacity={10} />
       
       <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-black/5">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <span className="font-heading text-xs tracking-[0.4em] text-[var(--color-brand-primary)] uppercase mb-4 block font-bold">LEGALEASE & TRUST</span>
          <h1 className="font-heading text-6xl md:text-9xl text-[#1A1A1A] leading-[0.85] mb-8 uppercase">
            PRIVACY <br />
            <span className="text-[var(--color-brand-primary)]">PROTOCOL.</span>
          </h1>
          <p className="font-body text-black/50 uppercase tracking-widest text-sm">Last Revision: {lastUpdated}</p>
        </motion.div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {/* Introduction section */}
            <motion.div 
               initial={{ opacity: 0 }} 
               whileInView={{ opacity: 1 }} 
               viewport={{ once: true }}
               className="space-y-6"
            >
              <h2 className="font-heading text-4xl text-[#1A1A1A] uppercase tracking-tight flex items-center gap-4">
                <span className="w-8 h-px bg-black hidden sm:block"></span>
                Privacy Policy
              </h2>
              <p className="font-body text-black/70 leading-relaxed text-lg">
                This Privacy Policy describes our policies and procedures on the collection, use, and disclosure of your information when you use the Service and informs you about your privacy rights and how the law protects you.
              </p>
              <p className="font-body text-black/60 leading-relaxed">
                We use your personal data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.
              </p>
            </motion.div>

            {/* Interpretation and Definitions section */}
            <motion.div 
               initial={{ opacity: 0 }} 
               whileInView={{ opacity: 1 }} 
               viewport={{ once: true }}
               className="space-y-8"
            >
              <h2 className="font-heading text-4xl text-[#1A1A1A] uppercase tracking-tight">Interpretation and Definitions</h2>
              
              <div className="space-y-4">
                <h3 className="font-heading text-2xl text-[var(--color-brand-primary)] uppercase">Interpretation</h3>
                <p className="font-body text-sm text-black/60 leading-relaxed tracking-wider">
                  Words with capitalized initials have meanings defined under the following conditions. These definitions apply regardless of whether they appear in singular or plural.
                </p>
              </div>

              <div className="space-y-6 pt-6">
                <h3 className="font-heading text-2xl text-[var(--color-brand-primary)] uppercase">Definitions</h3>
                <div className="grid gap-6">
                  {[
                    { term: "Account", desc: "A unique account created for you to access our Service or parts of it." },
                    { term: "Company", desc: `Refers to ${storeInfo.name}, located at ${storeInfo.address}` },
                    { term: "Cookies", desc: "Small files placed on your device by a website, used to store browsing history and preferences." },
                    { term: "Country", desc: "Refers to Telangana, India." },
                    { term: "Device", desc: "Any device that can access the Service, such as a computer, mobile phone, or tablet." },
                    { term: "Personal Data", desc: "Information that relates to an identified or identifiable individual." },
                    { term: "Service", desc: "Refers to the website (satyacomputers.in)." },
                    { term: "Service Provider", desc: "Any third-party company or individual employed to facilitate the Service." },
                    { term: "Third-party Social Media Service", desc: "Social networks through which a user can log in or create an account (e.g., Google, Facebook, Twitter)." },
                    { term: "Usage Data", desc: "Data collected automatically from the use of the Service (e.g., IP address, browser type, time spent on pages)." },
                    { term: "You", desc: "The individual or entity accessing or using the Service." },
                  ].map((item, idx) => (
                    <div key={idx} className="border-l border-black/10 pl-6 group hover:border-[var(--color-brand-primary)] transition-colors">
                      <h4 className="font-heading text-lg text-black uppercase mb-1">{item.term}</h4>
                      <p className="font-body text-xs text-black/50 leading-relaxed tracking-wider">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Collecting and Using Your Personal Data section */}
            <motion.div 
               initial={{ opacity: 0 }} 
               whileInView={{ opacity: 1 }} 
               viewport={{ once: true }}
               className="space-y-10"
            >
              <h2 className="font-heading text-4xl text-[#1A1A1A] uppercase tracking-tight">Collecting and Using Your Personal Data</h2>
              
              <div className="space-y-6">
                <h3 className="font-heading text-2xl text-[var(--color-brand-primary)] uppercase">Types of Data Collected</h3>
                
                <div className="space-y-8">
                  {/* Personal Data */}
                  <div className="space-y-4">
                    <h4 className="font-heading text-xl text-black uppercase flex items-center gap-3">
                      <UserCheck size={18} className="text-[var(--color-brand-primary)]" />
                      Personal Data
                    </h4>
                    <p className="font-body text-sm text-black/60 tracking-wider">We may collect the following personally identifiable information:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0">
                      {['Email address', 'First and last name', 'Phone number', 'Address, State, ZIP/Postal code, City', 'Usage Data'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 font-body text-xs text-black/50 uppercase tracking-widest border border-black/5 p-3 hover:bg-black hover:text-white transition-all cursor-default">
                          <span className="w-1.5 h-1.5 bg-[var(--color-brand-primary)] rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Usage Data */}
                  <div className="space-y-4 pt-4">
                    <h4 className="font-heading text-xl text-black uppercase flex items-center gap-3">
                      <MousePointer2 size={18} className="text-[var(--color-brand-primary)]" />
                      Usage Data
                    </h4>
                    <p className="font-body text-sm text-black/60 tracking-wider">Collected automatically, such as:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {['IP address', 'Browser type and version', 'Time and date of visit', 'Pages visited', 'Device type and OS'].map((item, i) => (
                        <div key={i} className="bg-[#FAFAFA] p-4 border-b-2 border-transparent hover:border-[var(--color-brand-primary)] transition-all">
                          <p className="font-body text-[10px] uppercase font-bold tracking-[0.2em] text-black/40 mb-1">DATA POINT {i+1}</p>
                          <p className="font-heading text-sm text-black">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Media Data */}
                  <div className="space-y-4 pt-4">
                    <h4 className="font-heading text-xl text-black uppercase flex items-center gap-3">
                      <Globe size={18} className="text-[var(--color-brand-primary)]" />
                      Data from Social Media Services
                    </h4>
                    <p className="font-body text-sm text-black/60 tracking-wider">
                      If you log in via third-party platforms (e.g., Google, Facebook), we may collect information associated with those accounts, such as Name, Email address, and Activity or contact list.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] text-white p-12 h-fit border-[1px] border-white/5 relative overflow-hidden group hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 sticky top-32">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-8">
                <h2 className="font-heading text-4xl mb-2 uppercase leading-[0.9]">Legal <br /><span className="text-[var(--color-brand-primary)]">Governance.</span></h2>
                <div className="prose prose-invert max-w-none font-body text-xs uppercase tracking-[0.1em] leading-[2.4] text-white/50">
                  <p>
                    This policy is built as a dynamic protocol. We utilize industry-standard security measures (SSL, hashing) to protect your architectural presence within our systems.
                  </p>
                  <div className="pt-8 mt-8 border-t border-white/10 space-y-6">
                    <div>
                      <h4 className="font-heading text-xl text-white mb-2 uppercase">Official Entity</h4>
                      <p className="text-white text-base font-bold tracking-normal uppercase">{storeInfo.name}</p>
                    </div>
                    <div>
                      <h4 className="font-heading text-xl text-white mb-2 uppercase">Headquarters</h4>
                      <p className="text-white/70 tracking-wide text-sm leading-relaxed lowercase">{storeInfo.address}</p>
                    </div>
                    <div>
                      <h4 className="font-heading text-xl text-white mb-2 uppercase">Point of Contact</h4>
                      <p className="text-[var(--color-brand-primary)] text-sm font-bold tracking-widest">{storeInfo.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
