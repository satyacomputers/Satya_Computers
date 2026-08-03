'use client';

import { useState } from 'react';
import Link from 'next/link';
import GrainOverlay from '@/components/ui/GrainOverlay';
import { Cpu, Briefcase, Glasses, UserCheck, Code, Save, PenTool, Image as ImageIcon, Rocket, Zap, ChevronRight, Check, Package } from 'lucide-react';

interface Profession {
  id: string;
  label: string;
  icon: any;
  desc: string;
  workload: string;
}

const PROFESSIONS: Profession[] = [
  { id: 'dev', label: 'Software Engineer', icon: Code, desc: 'Web apps, Docker, IDEs', workload: 'High RAM, Fast CPU' },
  { id: 'design', label: 'Designer / Video Editor', icon: PenTool, desc: 'Figma, Premiere, Adobe CC', workload: 'Strong GPU, Color-accurate display' },
  { id: 'data', label: 'Data Analyst / ML', icon: Glasses, desc: 'Python, Excel, Jupyter', workload: 'Heavy Processing, High RAM' },
  { id: 'business', label: 'Business & Office', icon: Briefcase, desc: 'Meetings, Browser, Office', workload: 'Great Battery, Lightweight, Web Cam' },
  { id: 'creator', label: 'Content Creator', icon: ImageIcon, desc: 'Streaming, Light Editing', workload: 'Balanced CPU, Reliable Storage' },
  { id: 'student', label: 'Student / Scholar', icon: UserCheck, desc: 'Reading, Essays, Lectures', workload: 'Portability, Battery Life, Durability' },
];

export default function SystemFinderPage() {
  const [step, setStep] = useState(1);
  const [selectedProf, setSelectedProf] = useState('');
  const [budget, setBudget] = useState(30000);
  const [mobility, setMobility] = useState('balanced');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [aiMessage, setAiMessage] = useState('');

  const submitQuiz = async () => {
    setLoading(true);
    setStep(4);
    
    try {
      const res = await fetch('/api/system-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profession: selectedProf, budget, mobility })
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setResults(data.products || []);
      setAiMessage(data.message || 'We found the perfect matches for you based on the Satya Computers inventory.');
    } catch (e) {
      setAiMessage('Our AI engineers are currently offline, but here is a standard recommendation: Please explore our catalog or contact sales on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg relative pb-24 overflow-hidden pt-24 font-body">
      <GrainOverlay opacity={40} />

      {/* Hero Header */}
      <section className="px-4 relative z-10 max-w-5xl mx-auto mb-16 pt-10 text-center">
        <h1 className="font-heading text-5xl md:text-7xl text-brand-text mb-4 uppercase tracking-tighter">
          SATYA <span className="text-[var(--color-brand-primary)]">SYSTEM FINDER</span>
        </h1>
        <p className="font-body text-brand-text/60 max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs font-bold leading-relaxed">
          Powered by Gemini AI. Answer 3 simple questions. Let our intelligent recommendation engine pair you with the exact hardware specifications required for your professional workflow.
        </p>
      </section>

      {/* Main Quiz Area */}
      <section className="px-4 relative z-10 max-w-4xl mx-auto">
        <div className="bg-white border-4 border-black shadow-[16px_16px_0_rgba(241,90,36,0.15)] relative overflow-hidden">
          
          {/* Progress Bar */}
          <div className="flex h-2 bg-gray-100">
            <div className={`h-full bg-[var(--color-brand-primary)] transition-all duration-700 ${
              step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
            }`} />
          </div>

          <div className="p-8 md:p-14">
            
            {/* Step 1: Profession */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <p className="font-heading text-xs text-[var(--color-brand-primary)] tracking-[0.3em] font-black uppercase mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[var(--color-brand-primary)]" /> Step 1 of 3
                </p>
                <h2 className="font-heading text-4xl uppercase mb-8">What is your primary <span className="text-[var(--color-brand-primary)]">profession?</span></h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {PROFESSIONS.map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => setSelectedProf(prof.id)}
                      className={`text-left p-6 border-4 flex flex-col gap-3 transition-all duration-300 ${
                        selectedProf === prof.id 
                          ? 'border-[var(--color-brand-primary)] bg-orange-50 translate-x-1 translate-y-1 shadow-none' 
                          : 'border-black hover:border-black/50 shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 bg-white'
                      }`}
                    >
                      <prof.icon size={28} className={selectedProf === prof.id ? 'text-[var(--color-brand-primary)]' : 'text-black'} />
                      <h3 className="font-heading text-lg uppercase tracking-widest">{prof.label}</h3>
                      <p className="font-body text-[10px] text-black/50 uppercase tracking-widest font-bold leading-relaxed">{prof.desc}</p>
                      
                      {selectedProf === prof.id && (
                        <div className="mt-2 bg-[var(--color-brand-primary)] text-white text-[9px] uppercase tracking-widest px-2 py-1 flex items-center gap-1.5 animate-in slide-in-from-left-2">
                          <Check size={12} /> Selected Match
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!selectedProf}
                    className="flex items-center gap-4 bg-black text-white px-10 py-5 font-heading text-sm tracking-[0.3em] uppercase hover:bg-[var(--color-brand-primary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group border border-transparent shadow-xl"
                  >
                    Next Phase <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Budget */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <p className="font-heading text-xs text-[var(--color-brand-primary)] tracking-[0.3em] font-black uppercase mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[var(--color-brand-primary)]" /> Step 2 of 3
                </p>
                <div className="flex justify-between items-end mb-8">
                  <h2 className="font-heading text-4xl uppercase">Select your <span className="text-[var(--color-brand-primary)]">Budget Range</span></h2>
                  <p className="font-heading text-4xl text-[var(--color-brand-primary)] tracking-tight">₹{budget.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="bg-gray-50 border-4 border-black p-10 shadow-[8px_8px_0_rgba(0,0,0,1)]">
                  <input 
                    type="range" 
                    min="15000" 
                    max="100000" 
                    step="1000" 
                    value={budget}
                    title={`Budget selector: ₹${budget.toLocaleString('en-IN')}`}
                    aria-label="Set your budget range"
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full accent-[var(--color-brand-primary)] h-3 bg-black/10 rounded-none appearance-none outline-none [&::-webkit-slider-runnable-track]:appearance-none"
                  />
                  
                  <div className="flex justify-between mt-6">
                    <div className="text-center">
                      <p className="font-body text-[10px] text-black/40 uppercase tracking-[0.2em] font-bold mb-1 border-b-2 border-transparent w-max cursor-pointer hover:text-black hover:border-black transition-all" onClick={() => setBudget(20000)}>Entry Level</p>
                      <p className="font-heading text-sm">₹20,000</p>
                    </div>
                    <div className="text-center">
                      <p className="font-body text-[10px] text-black/40 uppercase tracking-[0.2em] font-bold mb-1 border-b-2 border-transparent w-max mx-auto cursor-pointer hover:text-[var(--color-brand-primary)] hover:border-[var(--color-brand-primary)] transition-all" onClick={() => setBudget(45000)}>Professional</p>
                      <p className="font-heading text-sm text-[var(--color-brand-primary)] font-bold">₹45,000</p>
                    </div>
                    <div className="text-center">
                      <p className="font-body text-[10px] text-black/40 uppercase tracking-[0.2em] font-bold mb-1 border-b-2 border-transparent w-max cursor-pointer hover:text-black hover:border-black transition-all" onClick={() => setBudget(80000)}>Workstation</p>
                      <p className="font-heading text-sm">₹80,000+</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 p-6 bg-orange-50 border-l-4 border-orange-500 font-body text-xs text-orange-900 leading-relaxed uppercase tracking-widest font-bold">
                  <span className="text-orange-500">Note:</span> Pre-owned enterprise laptops drop 60% of their retail price in 3 years. You are unlocking immense value within this budget segment.
                </div>

                <div className="mt-12 flex justify-between">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-black/50 font-heading text-xs uppercase tracking-widest hover:text-black transition-colors"
                  >
                    ← Previous
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex items-center gap-4 bg-black text-white px-10 py-5 font-heading text-sm tracking-[0.3em] uppercase hover:bg-[var(--color-brand-primary)] transition-colors group shadow-[4px_4px_0_rgba(241,90,36,0.3)]"
                  >
                    Next Phase <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Mobility vs Performance */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <p className="font-heading text-xs text-[var(--color-brand-primary)] tracking-[0.3em] font-black uppercase mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[var(--color-brand-primary)]" /> Final Step
                </p>
                <h2 className="font-heading text-4xl uppercase mb-8">What is your mobility <span className="text-[var(--color-brand-primary)]">preference?</span></h2>
                
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                  {[
                    { id: 'mobile', icon: Zap, label: 'Ultra Mobile', desc: 'I travel constantly. I need a lightweight machine with exceptional battery life (12-14").' },
                    { id: 'balanced', icon: Rocket, label: 'Standard Desk', desc: 'I work primarily from a desk but occasionally travel. Standard size (14-15").' },
                    { id: 'power', icon: Cpu, label: 'Power Workstation', desc: '100% Desk. I need maximum cooling, multiple ports, and massive screen real estate (15-17").' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMobility(m.id)}
                      className={`flex-1 text-left p-8 border-4 transition-all duration-300 relative overflow-hidden ${
                        mobility === m.id 
                        ? 'border-[var(--color-brand-primary)] bg-orange-50 shadow-none -translate-y-2' 
                        : 'border-black bg-white hover:border-black/50 shadow-[8px_8px_0_rgba(0,0,0,1)] hover:-translate-y-1'
                      }`}
                    >
                      {mobility === m.id && (
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-[#F15A24]" />
                      )}
                      <m.icon size={32} className={`mb-6 ${mobility === m.id ? 'text-[#F15A24]' : 'text-black'}`} />
                      <h3 className={`font-heading text-xl uppercase tracking-widest mb-3 ${mobility === m.id ? 'text-[#F15A24]' : ''}`}>{m.label}</h3>
                      <p className="font-body text-[10px] uppercase font-bold tracking-[0.1em] leading-relaxed text-black/60">{m.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center bg-[#0A1628] text-white p-6 md:p-8">
                  <button 
                    onClick={() => setStep(2)}
                    className="text-white/50 font-heading text-xs uppercase tracking-widest hover:text-white transition-colors"
                  >
                    ← Previous
                  </button>
                  <button 
                    onClick={submitQuiz}
                    className="flexItems-center gap-3 bg-[var(--color-brand-primary)] text-white px-8 md:px-12 py-5 font-heading text-sm md:text-base tracking-[0.3em] uppercase hover:bg-white hover:text-black font-black transition-all group"
                  >
                    Generate Hardware <Rocket size={20} className="inline-block group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Loading & Results */}
            {step === 4 && (
              <div className="animate-in fade-in zoom-in-95 duration-700 min-h-[400px]">
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-[400px]">
                    <div className="relative w-32 h-32 mb-8">
                      <div className="absolute inset-0 border-4 border-black border-t-[var(--color-brand-primary)] rounded-full animate-spin [animation-duration:3s]" />
                      <div className="absolute inset-2 border-4 border-black/20 border-b-[var(--color-brand-primary)] rounded-full animate-spin [animation-duration:1.5s]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu size={32} className="text-[var(--color-brand-primary)] animate-pulse" />
                      </div>
                    </div>
                    <h3 className="font-heading text-2xl uppercase tracking-widest text-brand-text mb-2">Analyzing Workflow Requirements</h3>
                    <p className="font-body text-[11px] text-brand-text/40 uppercase tracking-[0.3em] font-bold h-6 flex gap-1">
                      <span className="animate-pulse [animation-delay:0s]">Parsing logic</span> /
                      <span className="animate-pulse [animation-delay:0.5s]">Scanning DB</span> /
                      <span className="animate-pulse [animation-delay:1s]">Generating</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-10 pb-10 border-b border-black/10">
                      <div className="mx-auto w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                        <Check size={32} />
                      </div>
                      <h2 className="font-heading text-5xl uppercase text-brand-text mb-4">MATCH <span className="text-[var(--color-brand-primary)]">CONFIRMED</span></h2>
                      <p className="font-body text-sm font-bold uppercase tracking-widest text-brand-text/50 max-w-2xl mx-auto leading-relaxed">
                        &quot;{aiMessage}&quot;
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {results.length > 0 ? results.map((product, idx) => (
                        <div key={idx} className="bg-white border-4 border-black flex flex-col group hover:shadow-[12px_12px_0_rgba(241,90,36,0.2)] transition-all">
                          <div className="h-48 bg-gray-100 flex items-center justify-center border-b-4 border-black relative overflow-hidden">
                            {idx === 0 && <span className="absolute top-4 right-4 bg-emerald-500 text-white font-heading text-[10px] tracking-widest px-3 py-1 uppercase z-10 shadow-lg">98% Match</span>}
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                              <Package size={64} className="text-black/10 text-brand-primary" />
                            )}
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-heading text-2xl uppercase tracking-wider mb-2 line-clamp-1">{product.name}</h3>
                            <p className="font-body text-[10px] text-brand-text/50 uppercase font-black tracking-[0.2em] mb-4 h-8 overflow-hidden">{product.shortSpecs || 'High Performance System'}</p>
                            
                            <div className="mt-auto flex items-end justify-between">
                              <div>
                                <p className="font-heading text-[10px] text-[var(--color-brand-primary)] tracking-[0.3em] uppercase">Value</p>
                                <p className="font-heading text-2xl">₹{(product.price).toLocaleString('en-IN')}</p>
                              </div>
                              <Link 
                                href={`/products/${product.id}`}
                                className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full hover:bg-[var(--color-brand-primary)] transition-colors"
                              >
                                <ChevronRight size={20} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-full py-10 text-center">
                          <p className="font-heading text-xl text-black/50 uppercase tracking-widest mb-6">No exact matches found in your range. Try adjusting budget.</p>
                          <button onClick={() => setStep(2)} className="uppercase text-xs font-bold tracking-widest border-b-2 border-black pb-1 hover:text-[var(--color-brand-primary)] hover:border-[var(--color-brand-primary)] transition-colors">
                            ADJUST BUDGET
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Tech Pattern Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] opacity-[0.03] pointer-events-none bg-[radial-gradient(circle,_#000_2px,_transparent_2px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent,black)] z-0" />
    </main>
  );
}
